const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// 1. Manually parse .env.local without external dependencies
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("\n❌ ERROR: Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");
  console.error("Please add SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here to .env.local and run again.\n");
  process.exit(1);
}

// 2. Initialize Supabase Admin Client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function migrate() {
  if (!fs.existsSync('users.csv')) {
    console.error("❌ ERROR: users.csv file not found in the current directory!");
    process.exit(1);
  }

  const csv = fs.readFileSync('users.csv', 'utf8');
  
  // 3. Parse CSV safely
  const lines = csv.split('\n').filter(line => line.trim() !== '');
  
  const parseLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') {
        inQuotes = !inQuotes;
      } else if (line[i] === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += line[i];
      }
    }
    result.push(current);
    return result.map(s => s.trim());
  };

  const headers = parseLine(lines[0]);
  
  const idIndex = headers.indexOf('id');
  const emailIndex = headers.indexOf('email');
  
  if (idIndex === -1 || emailIndex === -1) {
    console.error("❌ ERROR: Could not find 'id' or 'email' column in users.csv. Is it formatted correctly?");
    process.exit(1);
  }
  
  console.log(`\n🚀 Starting Migration for ${lines.length - 1} users...\n`);
  
  let successCount = 0;
  
  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    const id = cols[idIndex];
    const email = cols[emailIndex];
    
    if (!id || !email || id.toUpperCase() === 'NULL' || email.toUpperCase() === 'NULL') continue;
    
    console.log(`➡️  Migrating user: ${email} (${id})`);
    
    const { data, error } = await supabase.auth.admin.createUser({
      id: id,
      email: email,
      email_confirm: true,
      password: "MarqueWelcome123!" // Temporary default password for all migrated users
    });
    
    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`   ⚠️  Skipped: User already exists`);
      } else {
        console.error(`   ❌ Failed:`, error.message);
      }
    } else {
      console.log(`   ✅ Success`);
      successCount++;
    }
  }
  
  console.log(`\n🎉 Migration complete! Successfully migrated ${successCount} users.\n`);
}

migrate();
