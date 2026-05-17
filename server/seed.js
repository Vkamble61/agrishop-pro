const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Equipment = require('./models/Equipment');
const User = require('./models/User');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Sample equipment data
const equipmentData = [
  {
    name: 'Mahindra 575 DI',
    category: 'tractor',
    brand: 'Mahindra',
    price: 650000,
    description: 'Powerful 47 HP tractor ideal for medium to large farms. Features advanced hydraulics and comfortable seating.',
    specifications: {
      horsepower: '47 HP',
      engine: '2730 CC',
      gears: '8 Forward + 2 Reverse',
      fuelTank: '65 Liters',
      liftingCapacity: '1800 kg'
    },
    images: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500'
    ],
    stock: 5,
    rating: 4.5
  },
  {
    name: 'John Deere 5310',
    category: 'tractor',
    brand: 'John Deere',
    price: 850000,
    description: 'Premium 55 HP tractor with superior fuel efficiency and modern technology.',
    specifications: {
      horsepower: '55 HP',
      engine: '3054 CC',
      gears: '9 Forward + 3 Reverse',
      fuelTank: '75 Liters',
      liftingCapacity: '2000 kg'
    },
    images: [
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=500',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'
    ],
    stock: 3,
    rating: 4.8
  },
  {
    name: 'Swaraj 855 FE',
    category: 'tractor',
    brand: 'Swaraj',
    price: 550000,
    description: 'Reliable 50 HP tractor perfect for Indian farming conditions.',
    specifications: {
      horsepower: '50 HP',
      engine: '2896 CC',
      gears: '8 Forward + 2 Reverse',
      fuelTank: '60 Liters',
      liftingCapacity: '1600 kg'
    },
    images: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500'
    ],
    stock: 8,
    rating: 4.3
  },
  {
    name: 'Kubota Combine Harvester',
    category: 'harvester',
    brand: 'Kubota',
    price: 1200000,
    description: 'Efficient combine harvester for wheat, rice, and other crops.',
    specifications: {
      cuttingWidth: '2.0 meters',
      grainTankCapacity: '1200 kg',
      engine: '68 HP',
      threshingSystem: 'Axial Flow'
    },
    images: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'
    ],
    stock: 2,
    rating: 4.6
  },
  {
    name: 'Rotavator 6 Feet',
    category: 'implement',
    brand: 'Fieldking',
    price: 85000,
    description: 'Heavy-duty rotavator for soil preparation and seedbed making.',
    specifications: {
      workingWidth: '6 feet',
      blades: '36 blades',
      weight: '350 kg',
      powerRequirement: '35-50 HP'
    },
    images: [
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=500'
    ],
    stock: 15,
    rating: 4.4
  },
  {
    name: 'Disc Plough 3 Bottom',
    category: 'implement',
    brand: 'Lemken',
    price: 65000,
    description: 'Robust disc plough for primary tillage operations.',
    specifications: {
      discSize: '26 inches',
      numberOfDiscs: '3',
      weight: '280 kg',
      powerRequirement: '45-60 HP'
    },
    images: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500'
    ],
    stock: 12,
    rating: 4.2
  },
  {
    name: 'Seed Drill 9 Tyne',
    category: 'implement',
    brand: 'Mahindra',
    price: 45000,
    description: 'Precision seed drill for uniform seed placement.',
    specifications: {
      numberOfTynes: '9',
      seedBoxCapacity: '80 kg',
      rowSpacing: '22.5 cm',
      powerRequirement: '35-45 HP'
    },
    images: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'
    ],
    stock: 10,
    rating: 4.1
  },
  {
    name: 'Sprayer 400 Liter',
    category: 'implement',
    brand: 'Neptune',
    price: 55000,
    description: 'Boom sprayer for efficient pesticide and fertilizer application.',
    specifications: {
      tankCapacity: '400 liters',
      boomWidth: '12 meters',
      nozzles: '16',
      powerRequirement: '30-40 HP'
    },
    images: [
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=500'
    ],
    stock: 7,
    rating: 4.3
  },
  {
    name: 'Cultivator 9 Tyne',
    category: 'implement',
    brand: 'Fieldking',
    price: 35000,
    description: 'Spring loaded cultivator for secondary tillage.',
    specifications: {
      numberOfTynes: '9',
      workingWidth: '7 feet',
      weight: '180 kg',
      powerRequirement: '30-45 HP'
    },
    images: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500'
    ],
    stock: 20,
    rating: 4.0
  },
  {
    name: 'Trailer 4 Ton',
    category: 'implement',
    brand: 'Sonalika',
    price: 95000,
    description: 'Heavy-duty hydraulic trailer for farm produce transportation.',
    specifications: {
      capacity: '4 tons',
      tyreSize: '7.50-16',
      hydraulicSystem: 'Single Acting',
      dimensions: '12 x 6 x 2 feet'
    },
    images: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'
    ],
    stock: 6,
    rating: 4.4
  },
  {
    name: 'Potato Planter',
    category: 'implement',
    brand: 'Grimme',
    price: 125000,
    description: 'Automatic potato planter with fertilizer attachment.',
    specifications: {
      rows: '2',
      spacing: 'Adjustable 25-35 cm',
      hopperCapacity: '150 kg',
      powerRequirement: '40-55 HP'
    },
    images: [
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=500'
    ],
    stock: 4,
    rating: 4.5
  },
  {
    name: 'Chaff Cutter',
    category: 'implement',
    brand: 'Rajkumar',
    price: 28000,
    description: 'Electric chaff cutter for fodder preparation.',
    specifications: {
      motor: '3 HP',
      capacity: '300 kg/hour',
      blades: '3 blades',
      voltage: '220V Single Phase'
    },
    images: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500'
    ],
    stock: 25,
    rating: 4.2
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    // Clear existing equipment
    await Equipment.deleteMany({});
    console.log('✓ Cleared existing equipment');
    
    // Insert sample equipment
    const equipment = await Equipment.insertMany(equipmentData);
    console.log(`✓ Added ${equipment.length} equipment items`);
    
    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: 'admin@agrishop.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@agrishop.com',
        password: 'Admin@123',
        role: 'admin',
        phone: '9999999999'
      });
      console.log('✓ Created admin user (admin@agrishop.com / Admin@123)');
    } else {
      console.log('✓ Admin user already exists');
    }
    
    // Create sample farmer if doesn't exist
    const farmerExists = await User.findOne({ email: 'farmer@example.com' });
    if (!farmerExists) {
      await User.create({
        name: 'John Farmer',
        email: 'farmer@example.com',
        password: 'Farmer@123',
        role: 'farmer',
        phone: '9876543210',
        address: {
          village: 'Sample Village',
          district: 'Sample District',
          state: 'Maharashtra',
          pincode: '123456'
        },
        farmSize: 5.5,
        crops: ['wheat', 'rice', 'cotton']
      });
      console.log('✓ Created sample farmer (farmer@example.com / Farmer@123)');
    } else {
      console.log('✓ Sample farmer already exists');
    }
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('   Admin: admin@agrishop.com / Admin@123');
    console.log('   Farmer: farmer@example.com / Farmer@123');
    console.log('\n✨ You can now test the application!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();

// Made with Bob
