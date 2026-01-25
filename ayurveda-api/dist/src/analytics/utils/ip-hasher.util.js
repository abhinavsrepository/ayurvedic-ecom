"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpHasher = void 0;
const crypto_1 = require("crypto");
class IpHasher {
    static hash(ip, salt) {
        if (!ip) {
            return '';
        }
        if (salt) {
            return (0, crypto_1.createHmac)('sha256', salt).update(ip).digest('hex');
        }
        return (0, crypto_1.createHash)('sha256').update(ip).digest('hex');
    }
    static anonymize(ip) {
        if (!ip) {
            return '';
        }
        if (ip.includes('.')) {
            const parts = ip.split('.');
            if (parts.length === 4) {
                return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
            }
        }
        if (ip.includes(':')) {
            const parts = ip.split(':');
            if (parts.length >= 4) {
                return parts.slice(0, 4).join(':') + '::';
            }
        }
        return ip;
    }
    static extractIp(headers) {
        return (headers['x-forwarded-for']?.split(',')[0]?.trim() ||
            headers['x-real-ip'] ||
            headers['cf-connecting-ip'] ||
            headers['x-client-ip'] ||
            '');
    }
}
exports.IpHasher = IpHasher;
//# sourceMappingURL=ip-hasher.util.js.map