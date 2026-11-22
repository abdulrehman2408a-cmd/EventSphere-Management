import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, closeDB } from './config/db.js';

// Models
import User from './models/User.js';
import Expo from './models/Expo.js';
import Exhibitor from './models/Exhibitor.js';
import Booth from './models/Booth.js';
import Registration from './models/Registration.js';
import Application from './models/Application.js';
import Schedule from './models/Schedule.js';
import Message from './models/Message.js';
import Notification from './models/Notification.js';
import Feedback from './models/Feedback.js';
import Bookmark from './models/Bookmark.js';

dotenv.config();

export const seedDatabase = async ({ force = false } = {}) => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    // Safety check: don't wipe database unless force mode
    if (!force) {
      const existingUsers = await User.countDocuments();
      if (existingUsers > 0) {
        console.log('[Seed] Database already has data. Skipping seed. Use --force flag to reseed.');
        return false;
      }
    }

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany(),
      Expo.deleteMany(),
      Exhibitor.deleteMany(),
      Booth.deleteMany(),
      Registration.deleteMany(),
      Application.deleteMany(),
      Schedule.deleteMany(),
      Message.deleteMany(),
      Notification.deleteMany(),
      Feedback.deleteMany(),
      Bookmark.deleteMany()
    ]);

    console.log('[Seed] Creating demo users...');
    // 1. Users
    const adminUser = await User.create({
      name: 'Daniyal Khan',
      email: 'admin@eventsphere.pk',
      password: 'password123',
      role: 'admin',
      title: 'Event Director & Lead Organizer',
      organization: 'EventSphere Global Ltd',
      phone: '+92 300 1234567',
      city: 'Karachi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    });

    const exhibitorUser = await User.create({
      name: 'Sarmad Tariq',
      email: 'exhibitor@nexustech.pk',
      password: 'password123',
      role: 'exhibitor',
      title: 'VP Technology & Partner',
      organization: 'NexusTech Solutions',
      phone: '+92 321 9876543',
      city: 'Lahore',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
    });

    const attendeeUser = await User.create({
      name: 'Ayesha Malik',
      email: 'attendee@pakistanbiz.com',
      password: 'password123',
      role: 'attendee',
      title: 'Senior Cloud Solutions Architect',
      organization: 'Devsinc Technologies',
      phone: '+92 333 4567890',
      city: 'Islamabad',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250'
    });

    console.log('[Seed] Creating expos...');
    // 2. Expos
    const expo1 = await Expo.create({
      title: 'Pakistan Tech Summit & AI Expo 2026',
      slug: 'pakistan-tech-summit-ai-expo-2026',
      theme: 'Pioneering AI, Cloud Infrastructure & Digital Economy',
      description: 'The premier national B2B mega-expo bringing together over 300 enterprise tech giants, venture capital firms, cloud architects, and 15,000+ business delegates.',
      category: 'Technology',
      startDate: new Date('2026-11-20'),
      endDate: new Date('2026-11-22'),
      dates: 'Nov 20 - 22, 2026',
      venue: 'Karachi Expo Centre, University Road',
      city: 'Karachi',
      country: 'Pakistan',
      maxCapacity: 15000,
      registeredAttendees: 3420,
      totalBooths: 120,
      bookedBooths: 94,
      ticketPricePKR: 0,
      status: 'Published',
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
      organizer: adminUser._id,
      featured: true
    });

    const expo2 = await Expo.create({
      title: 'PharmaMed Healthcare & Biotech Expo 2026',
      slug: 'pharmamed-healthcare-biotech-expo-2026',
      theme: 'Surgical Precision, Diagnostic Innovations & Therapeutics',
      description: 'South Asia’s leading medical devices and pharmaceutical formulation trade fair presenting hospital automation, surgical robotics, and clinical biotech breakthroughs.',
      category: 'Healthcare',
      startDate: new Date('2026-12-05'),
      endDate: new Date('2026-12-07'),
      dates: 'Dec 05 - 07, 2026',
      venue: 'Lahore Expo Centre, Johar Town',
      city: 'Lahore',
      country: 'Pakistan',
      maxCapacity: 12000,
      registeredAttendees: 2150,
      totalBooths: 90,
      bookedBooths: 68,
      ticketPricePKR: 1500,
      status: 'Published',
      coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200',
      organizer: adminUser._id,
      featured: true
    });

    const expo3 = await Expo.create({
      title: 'AutoSphere International Motor Show 2026',
      slug: 'autosphere-international-motor-show-2026',
      theme: 'Next-Gen EV Powertrains, Mobility & Autonomous Vehicles',
      description: 'Experience futuristic electric vehicles, commercial fleets, hypercars, and smart charging grid infrastructure displayed by top multinational manufacturers.',
      category: 'Automotive',
      startDate: new Date('2026-12-18'),
      endDate: new Date('2026-12-20'),
      dates: 'Dec 18 - 20, 2026',
      venue: 'Pak-China Friendship Centre',
      city: 'Islamabad',
      country: 'Pakistan',
      maxCapacity: 20000,
      registeredAttendees: 4890,
      totalBooths: 80,
      bookedBooths: 72,
      ticketPricePKR: 2000,
      status: 'Published',
      coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
      organizer: adminUser._id,
      featured: true
    });

    const expo4 = await Expo.create({
      title: 'CleanEnergy & Power Tech Expo 2026',
      slug: 'cleanenergy-power-tech-expo-2026',
      theme: 'Solar Megawatt Grids, Wind Storage & Decarbonization',
      description: 'Connecting utility operators, commercial solar EPC developers, inverter manufacturers, and green energy financing institutions under one roof.',
      category: 'Energy & Power',
      startDate: new Date('2027-01-14'),
      endDate: new Date('2027-01-16'),
      dates: 'Jan 14 - 16, 2027',
      venue: 'Karachi Expo Centre, Halls 3 & 4',
      city: 'Karachi',
      country: 'Pakistan',
      maxCapacity: 10000,
      registeredAttendees: 1820,
      totalBooths: 75,
      bookedBooths: 51,
      ticketPricePKR: 0,
      status: 'Published',
      coverImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200',
      organizer: adminUser._id,
      featured: false
    });

    const expo5 = await Expo.create({
      title: 'Textile & Apparel Sourcing Expo 2026',
      slug: 'textile-apparel-sourcing-expo-2026',
      theme: 'Sustainable Fibers, Smart Weaving & Global Garment Exports',
      description: 'Connecting world-class spinning mills, premium denim weavers, and digital dye houses with major European and North American buyers.',
      category: 'Textile & Fashion',
      startDate: new Date('2027-02-10'),
      endDate: new Date('2027-02-12'),
      dates: 'Feb 10 - 12, 2027',
      venue: 'Faisalabad International Expo Complex',
      city: 'Faisalabad',
      country: 'Pakistan',
      maxCapacity: 8500,
      registeredAttendees: 1420,
      totalBooths: 65,
      bookedBooths: 42,
      ticketPricePKR: 0,
      status: 'Published',
      coverImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200',
      organizer: adminUser._id,
      featured: false
    });

    const expo6 = await Expo.create({
      title: 'AgriTech Future Farming Expo 2026',
      slug: 'agritech-future-farming-expo-2026',
      theme: 'Drone Crop Analytics, Precision Irrigation & Hydroponics',
      description: 'Showcasing AI-powered harvesters, satellite soil diagnostics, and bio-fertilizer innovations revolutionizing crop yield.',
      category: 'Agriculture',
      startDate: new Date('2027-03-02'),
      endDate: new Date('2027-03-04'),
      dates: 'Mar 02 - 04, 2027',
      venue: 'Multan Trade Fair Grounds',
      city: 'Multan',
      country: 'Pakistan',
      maxCapacity: 7500,
      registeredAttendees: 980,
      totalBooths: 50,
      bookedBooths: 29,
      ticketPricePKR: 500,
      status: 'Published',
      coverImage: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=1200',
      organizer: adminUser._id,
      featured: false
    });

    console.log('[Seed] Creating exhibitors...');
    // 3. Exhibitors
    const exhibitor1 = await Exhibitor.create({
      name: 'NexusTech Solutions',
      slug: 'nexustech-solutions',
      user: exhibitorUser._id,
      expo: expo1._id,
      category: 'Software & Cloud',
      description: 'Tier-1 Enterprise Cloud Architecture, Kubernetes deployment pipelines, and high-frequency financial trading solutions.',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
      boothNumber: 'A-101',
      boothSize: '8x8m Island (64 sqm)',
      hall: 'Hall 1',
      website: 'https://nexustech.pk',
      email: 'partners@nexustech.pk',
      phone: '+92 21 3587 9000',
      city: 'Karachi',
      country: 'Pakistan',
      status: 'Approved',
      featured: true,
      rating: 4.9,
      reviewsCount: 38,
      products: [
        {
          name: 'NexusCloud Hybrid Orchestrator',
          category: 'Cloud Infrastructure',
          description: 'Zero-latency multi-cloud management for financial transactions and containerized microservices.',
          image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600',
          price: 'Custom Enterprise License'
        },
        {
          name: 'Sentinel AI Vulnerability Shield',
          category: 'Cybersecurity',
          description: 'Autonomous threat detection using machine learning behavioral anomaly detection.',
          image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600',
          price: 'PKR 450,000 / yr'
        }
      ],
      staff: [
        { name: 'Sarmad Tariq', role: 'Booth Director', email: 'sarmad@nexustech.pk', phone: '+92 321 9876543', badgeIssued: true },
        { name: 'Bilal Farooq', role: 'Senior Solutions Architect', email: 'bilal@nexustech.pk', phone: '+92 300 2345678', badgeIssued: true }
      ]
    });

    exhibitorUser.exhibitorProfile = exhibitor1._id;
    await exhibitorUser.save();

    const exhibitor2 = await Exhibitor.create({
      name: 'CloudScale Systems',
      slug: 'cloudscale-systems',
      expo: expo1._id,
      category: 'Software & Cloud',
      description: 'Hyperscale private cloud hosting, edge compute nodes, and managed database clusters across Pakistan.',
      logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
      boothNumber: 'A-102',
      boothSize: '6x6m Corner (36 sqm)',
      hall: 'Hall 1',
      website: 'https://cloudscale.pk',
      email: 'info@cloudscale.pk',
      phone: '+92 42 3578 1200',
      city: 'Lahore',
      country: 'Pakistan',
      status: 'Approved',
      featured: true,
      rating: 4.8,
      reviewsCount: 24,
      products: [
        {
          name: 'CloudScale Bare-Metal Clusters',
          category: 'Hardware & Infrastructure',
          description: 'Dedicated high-compute servers in Karachi & Islamabad data centers.',
          image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600',
          price: 'Starting PKR 120,000 / mo'
        }
      ]
    });

    const exhibitor3 = await Exhibitor.create({
      name: 'AI Dynamics Asia',
      slug: 'ai-dynamics-asia',
      expo: expo1._id,
      category: 'Artificial Intelligence',
      description: 'Generative AI models fine-tuned on regional languages (Urdu, Pashto, Sindhi) for customer support automation.',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=1200',
      boothNumber: 'B-201',
      boothSize: '6x6m Standard (36 sqm)',
      hall: 'Hall 2',
      website: 'https://aidynamics.asia',
      email: 'contact@aidynamics.asia',
      phone: '+92 51 844 5500',
      city: 'Islamabad',
      country: 'Pakistan',
      status: 'Approved',
      featured: true,
      rating: 4.9,
      reviewsCount: 31
    });

    const exhibitor4 = await Exhibitor.create({
      name: 'PharmaCore Global Diagnostics',
      slug: 'pharmacore-global-diagnostics',
      expo: expo2._id,
      category: 'Medical Technology',
      description: 'Automated hematology analyzers, real-time PCR kits, and AI pathology scanners for diagnostic labs.',
      logo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=1200',
      boothNumber: 'C-301',
      boothSize: '8x8m Island (64 sqm)',
      hall: 'Hall 3',
      website: 'https://pharmacore.com.pk',
      email: 'sales@pharmacore.com.pk',
      phone: '+92 21 3450 8820',
      city: 'Karachi',
      country: 'Pakistan',
      status: 'Approved',
      featured: true,
      rating: 4.8,
      reviewsCount: 19
    });

    console.log('[Seed] Creating booths for interactive floor plan...');
    // 4. Booths
    const boothConfigs = [
      { number: 'A-101', expo: expo1._id, hall: 'Hall 1', size: '8x8m (64 sqm)', category: 'Premium Island', pricePKR: 450000, status: 'Booked', exhibitor: exhibitor1._id, exhibitorName: 'NexusTech Solutions', coordinates: { x: 50, y: 50, width: 90, height: 90 } },
      { number: 'A-102', expo: expo1._id, hall: 'Hall 1', size: '6x6m (36 sqm)', category: 'Corner Booth', pricePKR: 300000, status: 'Booked', exhibitor: exhibitor2._id, exhibitorName: 'CloudScale Systems', coordinates: { x: 160, y: 50, width: 80, height: 80 } },
      { number: 'A-103', expo: expo1._id, hall: 'Hall 1', size: '6x6m (36 sqm)', category: 'Corner Booth', pricePKR: 300000, status: 'Available', coordinates: { x: 260, y: 50, width: 80, height: 80 } },
      { number: 'A-104', expo: expo1._id, hall: 'Hall 1', size: '4x4m (16 sqm)', category: 'Standard Booth', pricePKR: 200000, status: 'Available', coordinates: { x: 360, y: 50, width: 70, height: 70 } },
      { number: 'A-105', expo: expo1._id, hall: 'Hall 1', size: '4x4m (16 sqm)', category: 'Standard Booth', pricePKR: 200000, status: 'Reserved', reservedUntil: new Date('2026-11-25'), coordinates: { x: 450, y: 50, width: 70, height: 70 } },
      { number: 'A-106', expo: expo1._id, hall: 'Hall 1', size: '3x3m (9 sqm)', category: 'Startup Pod', pricePKR: 120000, status: 'Available', coordinates: { x: 540, y: 50, width: 60, height: 60 } },
      
      { number: 'B-201', expo: expo1._id, hall: 'Hall 2', size: '6x6m (36 sqm)', category: 'Corner Booth', pricePKR: 300000, status: 'Booked', exhibitor: exhibitor3._id, exhibitorName: 'AI Dynamics Asia', coordinates: { x: 50, y: 180, width: 80, height: 80 } },
      { number: 'B-202', expo: expo1._id, hall: 'Hall 2', size: '6x6m (36 sqm)', category: 'Standard Booth', pricePKR: 250000, status: 'Available', coordinates: { x: 150, y: 180, width: 80, height: 80 } },
      { number: 'B-203', expo: expo1._id, hall: 'Hall 2', size: '6x6m (36 sqm)', category: 'Standard Booth', pricePKR: 250000, status: 'Available', coordinates: { x: 250, y: 180, width: 80, height: 80 } },
      { number: 'B-204', expo: expo1._id, hall: 'Hall 2', size: '8x8m (64 sqm)', category: 'Premium Island', pricePKR: 450000, status: 'Available', coordinates: { x: 350, y: 170, width: 95, height: 95 } },
      { number: 'B-205', expo: expo1._id, hall: 'Hall 2', size: '3x3m (9 sqm)', category: 'Startup Pod', pricePKR: 120000, status: 'Available', coordinates: { x: 470, y: 180, width: 60, height: 60 } },
      { number: 'B-206', expo: expo1._id, hall: 'Hall 2', size: '3x3m (9 sqm)', category: 'Startup Pod', pricePKR: 120000, status: 'Available', coordinates: { x: 550, y: 180, width: 60, height: 60 } },

      { number: 'C-301', expo: expo1._id, hall: 'Hall 3', size: '8x8m (64 sqm)', category: 'Premium Island', pricePKR: 450000, status: 'Booked', exhibitor: exhibitor4._id, exhibitorName: 'PharmaCore Global Diagnostics', coordinates: { x: 50, y: 300, width: 90, height: 90 } },
      { number: 'C-302', expo: expo1._id, hall: 'Hall 3', size: '6x6m (36 sqm)', category: 'Corner Booth', pricePKR: 300000, status: 'Available', coordinates: { x: 160, y: 300, width: 80, height: 80 } },
      { number: 'C-303', expo: expo1._id, hall: 'Hall 3', size: '4x4m (16 sqm)', category: 'Standard Booth', pricePKR: 200000, status: 'Available', coordinates: { x: 260, y: 300, width: 70, height: 70 } },
      { number: 'C-304', expo: expo1._id, hall: 'Hall 3', size: '4x4m (16 sqm)', category: 'Standard Booth', pricePKR: 200000, status: 'Available', coordinates: { x: 350, y: 300, width: 70, height: 70 } },
      { number: 'C-305', expo: expo1._id, hall: 'Hall 3', size: '4x4m (16 sqm)', category: 'Standard Booth', pricePKR: 200000, status: 'Reserved', coordinates: { x: 440, y: 300, width: 70, height: 70 } },
      { number: 'C-306', expo: expo1._id, hall: 'Hall 3', size: '3x3m (9 sqm)', category: 'Startup Pod', pricePKR: 120000, status: 'Available', coordinates: { x: 530, y: 300, width: 60, height: 60 } }
    ];

    await Booth.insertMany(boothConfigs);

    console.log('[Seed] Creating conference agenda sessions...');
    // 5. Schedules / Sessions
    const session1 = await Schedule.create({
      expo: expo1._id,
      title: 'Architecting Generative AI at National Enterprise Scale',
      description: 'Technical exploration of fine-tuning large language models on local multi-lingual data, zero-trust inference, and enterprise governance.',
      speaker: 'Dr. Shahzad Latif',
      speakerRole: 'Chief Artificial Intelligence Scientist',
      speakerCompany: 'Devsinc Technologies',
      speakerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      date: '2026-11-20',
      time: '10:00 AM - 11:15 AM',
      hall: 'Main Auditorium Hall A',
      category: 'Keynote & AI',
      maxCapacity: 350,
      enrolled: 284
    });

    const session2 = await Schedule.create({
      expo: expo1._id,
      title: 'Kubernetes & Hybrid Cloud Disaster Recovery Strategies',
      description: 'Real-world walkthrough of banking-grade fault-tolerant clusters spanning geographically distributed data centers.',
      speaker: 'Bilal Farooq',
      speakerRole: 'VP Cloud Architecture',
      speakerCompany: 'NexusTech Solutions',
      speakerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      date: '2026-11-20',
      time: '11:45 AM - 01:00 PM',
      hall: 'Technical Hall 2',
      category: 'Cloud & Infrastructure',
      maxCapacity: 250,
      enrolled: 195
    });

    const session3 = await Schedule.create({
      expo: expo1._id,
      title: 'Securing Financial APIs Against Distributed Quantum Exploits',
      description: 'Post-quantum cryptographic key exchanges and real-time behavioral fraud mitigation for mobile payment networks.',
      speaker: 'Zainab Qureshi',
      speakerRole: 'Head of Cybersecurity',
      speakerCompany: 'Meezan Bank Digital',
      speakerImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      date: '2026-11-21',
      time: '02:00 PM - 03:15 PM',
      hall: 'Main Auditorium Hall A',
      category: 'Cybersecurity',
      maxCapacity: 300,
      enrolled: 240
    });

    const session4 = await Schedule.create({
      expo: expo1._id,
      title: 'VC Roundtable: Pakistan Tech Valuation & Cross-Border Expansion',
      description: 'Panel discussion featuring leading regional venture partners on B2B SaaS unit economics and Gulf market expansion.',
      speaker: 'Omer Ghani',
      speakerRole: 'Managing General Partner',
      speakerCompany: 'Indus Valley Capital',
      speakerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      date: '2026-11-22',
      time: '03:30 PM - 05:00 PM',
      hall: 'Executive Lounge B',
      category: 'Venture & Growth',
      maxCapacity: 200,
      enrolled: 198
    });

    console.log('[Seed] Creating attendee registrations & passes...');
    // 6. Registrations
    const reg1 = await Registration.create({
      user: attendeeUser._id,
      expo: expo1._id,
      expoTitle: expo1.title,
      ticketNumber: 'ESP-2026-4821',
      ticketType: 'VIP Delegate Pass',
      attendeeName: attendeeUser.name,
      email: attendeeUser.email,
      phone: attendeeUser.phone,
      company: attendeeUser.organization,
      designation: attendeeUser.title,
      city: attendeeUser.city,
      checkedIn: true,
      checkInTime: new Date(),
      paidAmountPKR: 0,
      qrCodeData: JSON.stringify({
        ticketNumber: 'ESP-2026-4821',
        attendee: attendeeUser.name,
        expo: expo1.title,
        valid: true
      })
    });

    const reg2 = await Registration.create({
      expo: expo1._id,
      expoTitle: expo1.title,
      ticketNumber: 'ESP-2026-8914',
      ticketType: 'Standard Visitor Pass',
      attendeeName: 'Hamza Rizvi',
      email: 'h.rizvi@afiniti.com',
      phone: '+92 301 5556677',
      company: 'Afiniti Solutions',
      designation: 'Senior Data Scientist',
      city: 'Lahore',
      checkedIn: false,
      paidAmountPKR: 0,
      qrCodeData: JSON.stringify({
        ticketNumber: 'ESP-2026-8914',
        attendee: 'Hamza Rizvi',
        expo: expo1.title,
        valid: true
      })
    });

    console.log('[Seed] Creating expo applications...');
    // 7. Applications
    await Application.create({
      exhibitor: exhibitor1._id,
      user: exhibitorUser._id,
      expo: expo1._id,
      companyName: exhibitor1.name,
      contactPerson: exhibitorUser.name,
      email: exhibitorUser.email,
      phone: exhibitorUser.phone,
      requestedBoothCategory: 'Premium Island',
      preferredBoothNumber: 'A-101',
      proposedProductShowcase: 'Enterprise Cloud Management and Sentinel Security Suite',
      requiredPowerKW: 15,
      status: 'Approved',
      adminNotes: 'Approved with premium island corner placement.'
    });

    await Application.create({
      user: exhibitorUser._id,
      expo: expo2._id,
      companyName: 'NexusBio Diagnostic Software',
      contactPerson: exhibitorUser.name,
      email: exhibitorUser.email,
      phone: exhibitorUser.phone,
      requestedBoothCategory: 'Corner Booth',
      preferredBoothNumber: 'C-302',
      proposedProductShowcase: 'Clinical AI Telemetry software for hospitals',
      requiredPowerKW: 8,
      status: 'Pending',
      adminNotes: ''
    });

    console.log('[Seed] Creating messages & inquiries...');
    // 8. Messages
    await Message.create({
      sender: attendeeUser._id,
      senderName: attendeeUser.name,
      senderEmail: attendeeUser.email,
      senderRole: 'attendee',
      to: 'Organizer Support',
      from: `${attendeeUser.name} (${attendeeUser.email})`,
      subject: 'Speaker slides and recording access',
      content: 'Hello EventSphere team, will the keynote presentation slides for the AI summit be distributed to delegates after the session concludes?',
      status: 'Replied',
      time: '2 hours ago',
      replies: [
        {
          sender: 'Daniyal Khan',
          senderId: adminUser._id,
          text: 'Hi Ayesha! Yes, all verified delegates will receive a secure portal link with high-resolution slide decks and recordings.',
          time: '1 hour ago',
          createdAt: new Date()
        }
      ]
    });

    await Message.create({
      sender: exhibitorUser._id,
      senderName: exhibitorUser.name,
      senderEmail: exhibitorUser.email,
      senderRole: 'exhibitor',
      to: 'Organizer Support',
      from: `${exhibitorUser.name} (${exhibitorUser.email})`,
      subject: 'Booth A-101 3-Phase Power Connection Confirmation',
      content: 'Could you please confirm if the heavy electrical connection for our high-density server rack demo at Booth A-101 is scheduled for Nov 19 setup day?',
      status: 'Replied',
      time: 'Yesterday',
      replies: [
        {
          sender: 'Event Operations Desk',
          senderId: adminUser._id,
          text: 'Confirmed. The master electrician will be at Booth A-101 at 09:00 AM on setup day.',
          time: 'Yesterday',
          createdAt: new Date()
        }
      ]
    });

    console.log('[Seed] Creating notifications...');
    // 9. Notifications
    await Notification.create({
      user: adminUser._id,
      role: 'admin',
      title: 'New Exhibitor Application',
      message: 'NexusBio Diagnostic Software has submitted a space application for PharmaMed Expo 2026.',
      type: 'info',
      unread: true,
      link: '/admin/exhibitors'
    });

    await Notification.create({
      user: exhibitorUser._id,
      role: 'exhibitor',
      title: 'Booth Allocation Confirmed',
      message: 'Your reservation for Booth A-101 in Hall 1 has been validated and confirmed.',
      type: 'success',
      unread: true,
      link: '/exhibitor/booths'
    });

    await Notification.create({
      user: attendeeUser._id,
      role: 'attendee',
      title: 'Digital Pass Activated',
      message: 'Your VIP pass ESP-2026-4821 is ready for instant QR turnstile entrance at Karachi Expo Centre.',
      type: 'success',
      unread: false,
      link: '/attendee/events'
    });

    console.log('[Seed] Creating feedback...');
    // 10. Feedback
    await Feedback.create({
      user: attendeeUser._id,
      name: 'Ayesha Malik',
      role: 'Attendee',
      rating: 5,
      expoTitle: 'Pakistan Tech Summit & AI Expo 2026',
      comment: 'Superb event organization! The digital badge check-in was lightning-fast and the floor plan made locating tech booths completely effortless.'
    });

    await Feedback.create({
      name: 'Kashif Mehmood',
      role: 'Exhibitor',
      rating: 5,
      expoTitle: 'Pakistan Tech Summit & AI Expo 2026',
      comment: 'Outstanding B2B footfall. We connected with over 40 enterprise buyers within the first two days alone.'
    });

    console.log('[Seed] Creating bookmarks...');
    // 11. Bookmarks
    await Bookmark.create({
      user: attendeeUser._id,
      session: session1._id
    });
    await Bookmark.create({
      user: attendeeUser._id,
      session: session2._id
    });

    console.log('\n======================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('Demo Credentials:');
    console.log('1. Admin / Organizer:');
    console.log('   Email:    admin@eventsphere.pk');
    console.log('   Password: password123');
    console.log('2. Exhibitor:');
    console.log('   Email:    exhibitor@nexustech.pk');
    console.log('   Password: password123');
    console.log('3. Attendee:');
    console.log('   Email:    attendee@pakistanbiz.com');
    console.log('   Password: password123');
    console.log('======================================================\n');

    return true;
  } catch (err) {
    console.error('[Seed Error] Failed to seed database:', err);
    throw err;
  }
};

// If run directly from terminal: `node seed.js`
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase({ force: true }).then(async () => {
    await closeDB();
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
