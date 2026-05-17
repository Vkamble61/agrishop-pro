# Quick Start Guide - AgriShop Pro

## Issue: MongoDB Not Running

The application requires MongoDB to store data. You have two options:

---

## Option 1: Use MongoDB Atlas (Recommended - Free & Easy)

### Step 1: Create Free MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Create a free cluster (M0 Sandbox - Free forever)
4. Wait 3-5 minutes for cluster creation

### Step 2: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
4. Replace `<password>` with your actual password
5. Add database name: `mongodb+srv://username:password@cluster.mongodb.net/agrishop-pro`

### Step 3: Update .env File
Open `.env` file and update the MONGODB_URI:
```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/agrishop-pro?retryWrites=true&w=majority
```

### Step 4: Whitelist Your IP
1. In MongoDB Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 5: Seed Database
```bash
node server/seed.js
```

### Step 6: Start Application
```bash
npm run dev
```

---

## Option 2: Install MongoDB Locally

### For Windows:
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run the installer (choose "Complete" installation)
3. Install as a Windows Service
4. MongoDB will start automatically

### For macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### For Linux (Ubuntu):
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### After Installation:
1. Verify MongoDB is running:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl status mongod
```

2. Seed the database:
```bash
node server/seed.js
```

3. Start the application:
```bash
npm run dev
```

---

## Quick Test (After Setup)

### 1. Test Backend Health
Open browser: http://localhost:5000/health

Should see:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "...",
  "uptime": 123.45,
  "environment": "development"
}
```

### 2. Test Equipment API
Open browser: http://localhost:5000/api/equipment

Should see list of 12 equipment items.

### 3. Access Frontend
Open browser: http://localhost:3000

You should see the AgriShop Pro homepage with equipment listed.

---

## Test Credentials

After running the seed script, you can login with:

**Admin Account:**
- Email: `admin@agrishop.com`
- Password: `Admin@123`

**Farmer Account:**
- Email: `farmer@example.com`
- Password: `Farmer@123`

---

## Troubleshooting

### Port 3000 Already in Use
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use a different port
set PORT=3001 && npm start
```

### MongoDB Connection Failed
1. Check if MongoDB is running
2. Verify connection string in `.env`
3. Check firewall settings
4. For Atlas: Verify IP whitelist

### Module Not Found Errors
```bash
# Reinstall dependencies
npm install
cd client && npm install
```

---

## Next Steps

1. ✅ Set up MongoDB (Atlas or Local)
2. ✅ Update `.env` with connection string
3. ✅ Run seed script: `node server/seed.js`
4. ✅ Start application: `npm run dev`
5. ✅ Open http://localhost:3000
6. ✅ Login and test features!

---

## Need Help?

- Check SETUP_GUIDE.md for detailed setup instructions
- Check API_DOCUMENTATION.md for API reference
- Check DEPLOYMENT_GUIDE.md for production deployment

**Happy Farming! 🚜🌾**