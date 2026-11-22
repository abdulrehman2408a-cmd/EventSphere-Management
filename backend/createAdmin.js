import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { connectDB, closeDB } from './config/db.js';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the backend directory
dotenv.config({ path: path.join(__dirname, '.env') });
// Fallback to current working directory .env if present
dotenv.config();

const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
};

export const createAdminAccount = async () => {
  try {
    console.log('\n=================================================');
    console.log('🛡️  EventSphere Management — Initial Admin Setup');
    console.log('=================================================\n');

    // 1. Resolve Admin credentials from environment variables first
    let name = process.env.ADMIN_NAME || '';
    let email = process.env.ADMIN_EMAIL || '';
    let password = process.env.ADMIN_PASSWORD || '';

    // 2. Fallback to CLI positional arguments or flags if not in env
    const args = process.argv.slice(2);
    if (!email && args.length >= 2) {
      email = args[0];
      password = args[1];
      if (!name) name = args.slice(2).join(' ');
    } else {
      for (const arg of args) {
        if (!email && arg.startsWith('--email=')) email = arg.split('=')[1];
        if (!password && arg.startsWith('--password=')) password = arg.split('=')[1];
        if (!name && arg.startsWith('--name=')) name = arg.split('=')[1];
      }
    }

    // 3. Fallback to interactive prompts if still not provided
    if (!name) {
      name = (await askQuestion('Enter Admin Full Name [Administrator]: ')) || 'Administrator';
    }
    if (!email) {
      email = await askQuestion('Enter Admin Email Address: ');
    }
    if (!password) {
      password = await askQuestion('Enter Admin Secure Password (min 6 chars): ');
    }

    // Validation
    name = name.trim() || 'Administrator';
    email = email.trim().toLowerCase();

    if (!email || !email.includes('@')) {
      console.error('❌ Error: A valid email address is required (e.g. via ADMIN_EMAIL env or input).');
      process.exit(1);
    }

    if (!password || password.length < 6) {
      console.error('❌ Error: Password must be at least 6 characters long (e.g. via ADMIN_PASSWORD env or input).');
      process.exit(1);
    }

    // 4. Connect to real persistent MongoDB (no in-memory database fallback)
    await connectDB();

    // 5. Check if account already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log(`ℹ️  Notice: User "${existingUser.email}" already exists with role "admin". No duplicate account created.`);
      } else {
        console.error(`❌ Error: A user with email "${existingUser.email}" already exists with role "${existingUser.role}".`);
        console.error('   Existing non-admin accounts will NOT be silently promoted to Admin.');
      }
      await closeDB();
      process.exit(existingUser.role === 'admin' ? 0 : 1);
    }

    // 6. Create the user with role: "admin"
    // Password is automatically hashed via bcrypt (10 salt rounds) by the User pre('save') hook
    const newAdmin = await User.create({
      name,
      email,
      password,
      role: 'admin',
      title: 'System Administrator',
      organization: 'EventSphere Administration',
      phone: '',
      city: 'Karachi'
    });

    console.log('✅ Real Admin account created successfully in MongoDB!');
    console.log('-------------------------------------------------');
    console.log(`ID:           ${newAdmin._id}`);
    console.log(`Name:         ${newAdmin.name}`);
    console.log(`Email:        ${newAdmin.email}`);
    console.log(`Role:         ${newAdmin.role}`);
    console.log(`Security:     Bcrypt hashed (10 salt rounds) — never stored in plain-text`);
    console.log('=================================================\n');

    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create Admin account:', error.message);
    try {
      await closeDB();
    } catch {}
    process.exit(1);
  }
};

if (process.argv[1]?.endsWith('createAdmin.js')) {
  createAdminAccount();
}
