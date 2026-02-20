import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const plainPassword = 'Test@1234';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  
  console.log('=== Admin User Fix Script ===\n');
  
  // Find all users
  const allUsers = await prisma.user.findMany({
    select: { id: true, username: true, email: true, enabled: true, account_locked: true, failed_login_attempts: true, password: true }
  });
  
  console.log('Users in database:', allUsers.length);
  allUsers.forEach(u => {
    console.log(`  - ID: ${u.id}, Username: ${u.username}, Email: ${u.email}, Enabled: ${u.enabled}, Locked: ${u.account_locked}`);
  });
  console.log('');
  
  // Find or create admin user
  let user = await prisma.user.findUnique({
    where: { username: 'admin@ayurveda.com' }
  });
  
  if (user) {
    console.log('Found user:', user.username);
    
    // Test current password
    const testCurrent = await bcrypt.compare(plainPassword, user.password);
    console.log('Current password valid?', testCurrent ? 'YES' : 'NO');
    
    // Update password
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        enabled: true,
        account_locked: false,
        failed_login_attempts: 0
      }
    });
    
    console.log('\n✅ User updated:');
    console.log('   - Password reset');
    console.log('   - Account unlocked');
    console.log('   - Enabled: true');
    
    // Verify
    const verify = await prisma.user.findUnique({ where: { id: user.id } });
    if (verify) {
      const isValid = await bcrypt.compare(plainPassword, verify.password);
      console.log('\n✅ Verification test:', isValid ? 'PASSWORD MATCHES' : 'FAILED');
    }
    
  } else {
    console.log('User not found, creating new admin...');
    
    // Get or create ADMIN role
    let adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: { name: 'ADMIN', description: 'Administrator with full access' }
      });
      console.log('Created ADMIN role');
    }
    
    // Create user with role
    const newUser = await prisma.user.create({
      data: {
        username: 'admin@ayurveda.com',
        email: 'admin@ayurshop.com',
        password: hashedPassword,
        full_name: 'System Administrator',
        enabled: true,
        user_roles: {
          create: {
            role_id: adminRole.id
          }
        }
      }
    });
    
    console.log('\n✅ Created new admin user:');
    console.log('   - Username: admin@ayurveda.com');
    console.log('   - Password: Test@1234');
  }
  
  console.log('\n=== Done ===');
}

main()
  .catch(e => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
