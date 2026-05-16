# AgriShop Pro - Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment Methods](#deployment-methods)
4. [Configuration](#configuration)
5. [Security Checklist](#security-checklist)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js**: v18.x or higher
- **MongoDB**: v7.0 or higher
- **Docker**: v24.x or higher (for containerized deployment)
- **Docker Compose**: v2.x or higher
- **Git**: For version control

### System Requirements
- **CPU**: 2+ cores recommended
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 20GB minimum
- **OS**: Linux (Ubuntu 20.04+), macOS, or Windows with WSL2

---

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/agrishop-pro.git
cd agrishop-pro
```

### 2. Configure Environment Variables

Copy the production environment template:
```bash
cp .env.example .env.production
```

Edit `.env.production` with your production values:
```bash
nano .env.production
```

**Critical Variables to Update:**
- `MONGODB_URI` - Your production MongoDB connection string
- `JWT_SECRET` - Generate a strong secret (min 32 characters)
- `CLIENT_URL` - Your production frontend URL
- `EMAIL_*` - Email service credentials
- All other placeholder values

**Generate Strong Secrets:**
```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Install Dependencies
```bash
# Install server dependencies
npm install --production

# Install client dependencies
cd client
npm install --production
cd ..
```

---

## Deployment Methods

### Method 1: Docker Deployment (Recommended)

#### Step 1: Build and Deploy
```bash
# Make deploy script executable
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh
```

#### Step 2: Verify Deployment
```bash
# Check container status
docker-compose ps

# Check application health
curl http://localhost:5000/health

# View logs
docker-compose logs -f app
```

#### Step 3: Access Application
- **API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **Metrics**: http://localhost:5000/metrics

### Method 2: Manual Deployment

#### Step 1: Build Client
```bash
cd client
npm run build
cd ..
```

#### Step 2: Start MongoDB
```bash
# Using Docker
docker run -d \
  --name agrishop-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=yourpassword \
  -v mongodb_data:/data/db \
  mongo:7.0

# Or use existing MongoDB instance
```

#### Step 3: Start Application
```bash
# Set environment
export NODE_ENV=production

# Start server
node server/server.js

# Or use PM2 for process management
npm install -g pm2
pm2 start server/server.js --name agrishop-pro
pm2 save
pm2 startup
```

### Method 3: Cloud Platform Deployment

#### Heroku
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create agrishop-pro

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_here

# Deploy
git push heroku main

# Open app
heroku open
```

#### AWS EC2
1. Launch EC2 instance (Ubuntu 20.04)
2. Install Docker and Docker Compose
3. Clone repository
4. Configure environment variables
5. Run deployment script
6. Configure security groups (ports 80, 443, 5000)
7. Set up Elastic IP
8. Configure domain and SSL

#### DigitalOcean
1. Create Droplet (Ubuntu 20.04)
2. SSH into droplet
3. Install Docker and Docker Compose
4. Clone repository
5. Run deployment script
6. Configure firewall
7. Set up domain and SSL with Let's Encrypt

---

## Configuration

### Nginx Reverse Proxy

Create `nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:5000;
    }

    server {
        listen 80;
        server_name your-domain.com;

        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### SSL/TLS Configuration

#### Using Let's Encrypt
```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### PM2 Configuration

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'agrishop-pro',
    script: './server/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    autorestart: true,
    watch: false
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## Security Checklist

### Before Deployment
- [ ] Update all environment variables in `.env.production`
- [ ] Generate strong JWT secret (min 64 characters)
- [ ] Use strong database passwords
- [ ] Enable MongoDB authentication
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Disable unnecessary ports
- [ ] Set up backup strategy

### Application Security
- [ ] Input validation enabled
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Secure headers configured
- [ ] Password hashing (bcrypt)
- [ ] JWT token expiration set
- [ ] File upload restrictions
- [ ] API rate limiting active

### Database Security
- [ ] MongoDB authentication enabled
- [ ] Strong admin password
- [ ] Network access restricted
- [ ] Regular backups configured
- [ ] Encryption at rest enabled
- [ ] Audit logging enabled

### Infrastructure Security
- [ ] Firewall configured
- [ ] SSH key authentication only
- [ ] Fail2ban installed
- [ ] Regular security updates
- [ ] Monitoring enabled
- [ ] Log aggregation set up

---

## Monitoring & Maintenance

### Health Checks
```bash
# Basic health check
curl http://localhost:5000/health

# Detailed health check
curl http://localhost:5000/health/detailed

# Readiness probe
curl http://localhost:5000/ready

# Liveness probe
curl http://localhost:5000/live

# Metrics
curl http://localhost:5000/metrics
```

### Log Management
```bash
# View application logs
docker-compose logs -f app

# View last 100 lines
docker-compose logs --tail=100 app

# View MongoDB logs
docker-compose logs -f mongodb

# Application log files
tail -f logs/app.log
tail -f logs/error.log
```

### Database Backup
```bash
# Backup MongoDB
docker exec agrishop-mongodb mongodump \
  --username admin \
  --password yourpassword \
  --authenticationDatabase admin \
  --out /backup/$(date +%Y%m%d)

# Restore MongoDB
docker exec agrishop-mongodb mongorestore \
  --username admin \
  --password yourpassword \
  --authenticationDatabase admin \
  /backup/20260516
```

### Performance Monitoring

#### Using PM2
```bash
pm2 monit
pm2 list
pm2 logs
pm2 restart agrishop-pro
```

#### Docker Stats
```bash
docker stats agrishop-app
docker-compose top
```

### Automated Backups

Create backup script `scripts/backup.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/backups/agrishop-pro"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
docker exec agrishop-mongodb mongodump \
  --username admin \
  --password $MONGO_PASSWORD \
  --authenticationDatabase admin \
  --gzip \
  --archive=$BACKUP_DIR/db_$DATE.gz

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz uploads/

# Keep only last 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

Add to crontab:
```bash
# Daily backup at 2 AM
0 2 * * * /path/to/scripts/backup.sh
```

---

## Troubleshooting

### Common Issues

#### 1. Application Won't Start
```bash
# Check logs
docker-compose logs app

# Check environment variables
docker-compose config

# Verify MongoDB connection
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

#### 2. Database Connection Failed
```bash
# Check MongoDB status
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Test connection
docker-compose exec app node -e "require('./server/config/db')()"
```

#### 3. High Memory Usage
```bash
# Check memory usage
docker stats

# Restart application
docker-compose restart app

# Check for memory leaks in logs
docker-compose logs app | grep "memory"
```

#### 4. Slow Performance
```bash
# Check database indexes
docker-compose exec mongodb mongosh agrishop-pro --eval "db.getCollectionNames().forEach(c => print(c, db[c].getIndexes()))"

# Check slow queries
docker-compose exec mongodb mongosh agrishop-pro --eval "db.setProfilingLevel(1, 100)"

# Monitor CPU usage
docker stats agrishop-app
```

#### 5. SSL Certificate Issues
```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Check certificate expiry
sudo certbot certificates

# Test SSL configuration
openssl s_client -connect your-domain.com:443
```

### Emergency Procedures

#### Rollback Deployment
```bash
# Stop current deployment
docker-compose down

# Checkout previous version
git checkout <previous-commit-hash>

# Redeploy
./scripts/deploy.sh
```

#### Database Recovery
```bash
# Stop application
docker-compose stop app

# Restore from backup
docker exec agrishop-mongodb mongorestore \
  --username admin \
  --password yourpassword \
  --authenticationDatabase admin \
  --drop \
  /backup/20260516

# Restart application
docker-compose start app
```

---

## Scaling

### Horizontal Scaling
```bash
# Scale application containers
docker-compose up -d --scale app=3

# Use load balancer (Nginx)
# Configure upstream with multiple app instances
```

### Vertical Scaling
```bash
# Increase container resources in docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
```

---

## Support & Resources

- **Documentation**: See README.md and API_DOCUMENTATION.md
- **Issues**: Report bugs on GitHub Issues
- **Email**: support@agrishop-pro.com
- **Community**: Join our Discord/Slack channel

---

## Changelog

### Version 1.0.0 (May 2026)
- Initial production release
- Core features implemented
- Docker deployment support
- Comprehensive monitoring

---

**Last Updated**: May 16, 2026  
**Maintained By**: AgriShop Pro Team