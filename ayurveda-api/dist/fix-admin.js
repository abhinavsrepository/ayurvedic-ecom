"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const bcrypt = __importStar(require("bcrypt"));
require('dotenv').config();
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const plainPassword = 'Test@1234';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log('=== Admin User Fix Script ===\n');
    const allUsers = await prisma.user.findMany({
        select: { id: true, username: true, email: true, enabled: true, account_locked: true, failed_login_attempts: true, password: true }
    });
    console.log('Users in database:', allUsers.length);
    allUsers.forEach(u => {
        console.log(`  - ID: ${u.id}, Username: ${u.username}, Email: ${u.email}, Enabled: ${u.enabled}, Locked: ${u.account_locked}`);
    });
    console.log('');
    let user = await prisma.user.findUnique({
        where: { username: 'admin@ayurveda.com' }
    });
    if (user) {
        console.log('Found user:', user.username);
        const testCurrent = await bcrypt.compare(plainPassword, user.password);
        console.log('Current password valid?', testCurrent ? 'YES' : 'NO');
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
        const verify = await prisma.user.findUnique({ where: { id: user.id } });
        if (verify) {
            const isValid = await bcrypt.compare(plainPassword, verify.password);
            console.log('\n✅ Verification test:', isValid ? 'PASSWORD MATCHES' : 'FAILED');
        }
    }
    else {
        console.log('User not found, creating new admin...');
        let adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
        if (!adminRole) {
            adminRole = await prisma.role.create({
                data: { name: 'ADMIN', description: 'Administrator with full access' }
            });
            console.log('Created ADMIN role');
        }
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
//# sourceMappingURL=fix-admin.js.map