# Adding Sample Equipment Data to AgriShop Pro

## Current Issue
MongoDB Atlas connection is failing due to network/DNS issues. Here are multiple solutions:

---

## Solution 1: Fix MongoDB Atlas Connection (Recommended)

### Step 1: Check Network Access in MongoDB Atlas
1. Go to https://cloud.mongodb.com
2. Navigate to your cluster
3. Click "Network Access" in the left sidebar
4. Click "Add IP Address"
5. Select "Allow Access from Anywhere" (0.0.0.0/0)
6. Click "Confirm"

### Step 2: Verify Connection String
Your current connection string in `.env`:
```
#MONGODB_URI=mongodb://localhost:27017/agrishop-pro
MONGODB_URI=mongodb+srv://db_user:cluster@rootstack.dqbbvwx.mongodb.net/?appName=RootStack
```

Add the database name:
```
MONGODB_URI=mongodb+srv://db_user:cluster@rootstack.dqbbvwx.mongodb.net/agrishop-pro?retryWrites=true&w=majority
```

### Step 3: Run Seed Script
```bash
node server/seed.js
```

---

## Solution 2: Add Data Through Admin Dashboard

### Step 1: Login as Admin
1. Navigate to: http://localhost:3000/admin/login
2. Email: `admin@agrishop.com`
3. Password: `Admin@123`

### Step 2: Go to Inventory Management
Click "Manage Inventory" or navigate to: http://localhost:3000/admin/inventory

### Step 3: Add Equipment Manually
Click "+ Add Equipment" and add the following items:

#### Equipment 1: Mahindra 575 DI
- **Name**: Mahindra 575 DI
- **Category**: Tractor
- **Brand**: Mahindra
- **Price**: ₹650,000
- **Description**: Powerful 47 HP tractor ideal for medium to large farms
- **Stock**: 5
- **Specifications**:
  - Horsepower: 47 HP
  - Engine: 2730 CC
  - Gears: 8 Forward + 2 Reverse
  - Fuel Tank: 65 Liters

#### Equipment 2: John Deere 5310
- **Name**: John Deere 5310
- **Category**: Tractor
- **Brand**: John Deere
- **Price**: ₹850,000
- **Description**: Premium 55 HP tractor with superior fuel efficiency
- **Stock**: 3
- **Specifications**:
  - Horsepower: 55 HP
  - Engine: 3054 CC
  - Gears: 9 Forward + 3 Reverse
  - Fuel Tank: 75 Liters

#### Equipment 3: Swaraj 855 FE
- **Name**: Swaraj 855 FE
- **Category**: Tractor
- **Brand**: Swaraj
- **Price**: ₹550,000
- **Description**: Reliable 50 HP tractor perfect for Indian farming
- **Stock**: 8
- **Specifications**:
  - Horsepower: 50 HP
  - Engine: 2896 CC
  - Gears: 8 Forward + 2 Reverse
  - Fuel Tank: 60 Liters

#### Equipment 4: Kubota Combine Harvester
- **Name**: Kubota Combine Harvester
- **Category**: Harvester
- **Brand**: Kubota
- **Price**: ₹1,200,000
- **Description**: Efficient combine harvester for wheat, rice, and other crops
- **Stock**: 2
- **Specifications**:
  - Cutting Width: 2.0 meters
  - Grain Tank: 1200 kg
  - Engine: 68 HP

#### Equipment 5: Rotavator 6 Feet
- **Name**: Rotavator 6 Feet
- **Category**: Implement
- **Brand**: Fieldking
- **Price**: ₹85,000
- **Description**: Heavy-duty rotavator for soil preparation
- **Stock**: 15
- **Specifications**:
  - Working Width: 6 feet
  - Blades: 36 blades
  - Weight: 350 kg

#### Equipment 6: Disc Plough 3 Bottom
- **Name**: Disc Plough 3 Bottom
- **Category**: Implement
- **Brand**: Lemken
- **Price**: ₹65,000
- **Description**: Robust disc plough for primary tillage
- **Stock**: 12
- **Specifications**:
  - Disc Size: 26 inches
  - Number of Discs: 3
  - Weight: 280 kg

#### Equipment 7: Seed Drill 9 Tyne
- **Name**: Seed Drill 9 Tyne
- **Category**: Implement
- **Brand**: Mahindra
- **Price**: ₹45,000
- **Description**: Precision seed drill for uniform seed placement
- **Stock**: 10
- **Specifications**:
  - Number of Tynes: 9
  - Seed Box: 80 kg
  - Row Spacing: 22.5 cm

#### Equipment 8: Sprayer 400 Liter
- **Name**: Sprayer 400 Liter
- **Category**: Implement
- **Brand**: Neptune
- **Price**: ₹55,000
- **Description**: Boom sprayer for efficient pesticide application
- **Stock**: 7
- **Specifications**:
  - Tank Capacity: 400 liters
  - Boom Width: 12 meters
  - Nozzles: 16

#### Equipment 9: Cultivator 9 Tyne
- **Name**: Cultivator 9 Tyne
- **Category**: Implement
- **Brand**: Fieldking
- **Price**: ₹35,000
- **Description**: Spring loaded cultivator for secondary tillage
- **Stock**: 20
- **Specifications**:
  - Number of Tynes: 9
  - Working Width: 7 feet
  - Weight: 180 kg

#### Equipment 10: Trailer 4 Ton
- **Name**: Trailer 4 Ton
- **Category**: Implement
- **Brand**: Sonalika
- **Price**: ₹95,000
- **Description**: Heavy-duty hydraulic trailer for transportation
- **Stock**: 6
- **Specifications**:
  - Capacity: 4 tons
  - Tyre Size: 7.50-16
  - Dimensions: 12 x 6 x 2 feet

#### Equipment 11: Potato Planter
- **Name**: Potato Planter
- **Category**: Implement
- **Brand**: Grimme
- **Price**: ₹125,000
- **Description**: Automatic potato planter with fertilizer attachment
- **Stock**: 4
- **Specifications**:
  - Rows: 2
  - Spacing: Adjustable 25-35 cm
  - Hopper: 150 kg

#### Equipment 12: Chaff Cutter
- **Name**: Chaff Cutter
- **Category**: Implement
- **Brand**: Rajkumar
- **Price**: ₹28,000
- **Description**: Electric chaff cutter for fodder preparation
- **Stock**: 25
- **Specifications**:
  - Motor: 3 HP
  - Capacity: 300 kg/hour
  - Blades: 3 blades

---

## Solution 3: Use API Directly (For Developers)

If you have Postman or similar tool:

### Step 1: Login as Admin
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@agrishop.com",
  "password": "Admin@123"
}
```

Copy the `token` from response.

### Step 2: Add Equipment
```
POST http://localhost:5000/api/equipment
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Mahindra 575 DI",
  "category": "tractor",
  "brand": "Mahindra",
  "price": 650000,
  "description": "Powerful 47 HP tractor ideal for medium to large farms",
  "specifications": {
    "horsepower": "47 HP",
    "engine": "2730 CC",
    "gears": "8 Forward + 2 Reverse",
    "fuelTank": "65 Liters"
  },
  "stock": 5
}
```

Repeat for all 12 equipment items.

---

## Solution 4: Check if Server is Running

The server should be running on port 5000. Check:

```bash
# Test health endpoint
curl http://localhost:5000/health

# Or in browser
http://localhost:5000/health
```

If not running, start it:
```bash
npm run dev
```

---

## Verification

After adding data, verify by:

1. **Admin Dashboard**: http://localhost:3000/admin/dashboard
   - Should show equipment statistics
   - Low stock alerts should appear

2. **Inventory Page**: http://localhost:3000/admin/inventory
   - Should list all 12 equipment items
   - Can search and filter

3. **Equipment Catalogue** (Farmer view): http://localhost:3000/equipment
   - Should display all equipment with images
   - Can browse and view details

---

## Need Help?

If you continue to have issues:
1. Check if MongoDB Atlas cluster is active
2. Verify your IP is whitelisted in Network Access
3. Try using a different network (mobile hotspot)
4. Consider using local MongoDB instead (see QUICK_START.md)

**The seed script contains all 12 equipment items ready to be added!**