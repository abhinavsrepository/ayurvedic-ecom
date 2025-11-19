# 🚀 Quick Setup Guide - Complete Backend in 10 Minutes

## ✅ Already Completed
- Auth module (JWT + 2FA + RBAC) ✅
- Products module (CRUD + Search) ✅
- Common utilities (Guards, Filters, Decorators) ✅
- All modules scaffolded ✅

## 📝 Remaining Tasks

### 1. Update .env file (1 minute)

```bash
# Add these to .env
JWT_SECRET=super-secret-jwt-key-change-in-production-min-32-characters-long
JWT_REFRESH_SECRET=super-secret-refresh-key-change-in-production-min-32-chars
```

### 2. Update main.ts (Copy from ALL_IMPLEMENTATIONS.md)

Replace the contents of `src/main.ts` with the version from `ALL_IMPLEMENTATIONS.md`

### 3. Update app.module.ts (Copy from ALL_IMPLEMENTATIONS.md)

Replace the contents of `src/app.module.ts` with the version from `ALL_IMPLEMENTATIONS.md`

### 4. Implement Orders Module

Copy the following files from `ALL_IMPLEMENTATIONS.md`:
- `src/orders/dto/order-query.dto.ts`
- `src/orders/dto/update-order-status.dto.ts`
- `src/orders/orders.service.ts`
- `src/orders/orders.controller.ts`
- `src/orders/orders.module.ts`

### 5. Implement Customers Module

Copy from `ALL_IMPLEMENTATIONS.md`:
- `src/customers/customers.service.ts`
- `src/customers/customers.controller.ts`
- `src/customers/customers.module.ts`

### 6. Implement Admin Module

Copy from `ALL_IMPLEMENTATIONS.md`:
- `src/admin/admin.service.ts`
- `src/admin/admin.controller.ts`
- `src/admin/admin.module.ts`

### 7. Start and Test (2 minutes)

```bash
cd ayurveda-api
pnpm run start:dev
```

Visit: http://localhost:3333/api-docs

## 🧪 Testing Checklist

### 1. Health Check ✅
```
GET http://localhost:3333/actuator/health
```

### 2. Products (Public) ✅
```
GET http://localhost:3333/api/products
```

### 3. Auth Flow

#### Register User (if needed via DB):
```sql
INSERT INTO users (id, username, email, password, full_name, enabled)
VALUES (
  gen_random_uuid(),
  'admin',
  'admin@example.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eR7J3QK.N7GW', -- password: password123
  'Admin User',
  true
);

INSERT INTO roles (id, name, description)
VALUES (gen_random_uuid(), 'ADMIN', 'Administrator role');

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'admin' AND r.name = 'ADMIN';
```

#### Login:
```
POST http://localhost:3333/api/auth/login
Body: {
  "username": "admin",
  "password": "password123"
}
```

Copy the `accessToken` from response.

#### Test Protected Endpoint:
```
GET http://localhost:3333/api/admin/dashboard
Headers: Authorization: Bearer <your-access-token>
```

## 🎯 Feature Status

| Module | Status | Endpoints |
|--------|--------|-----------|
| Health | ✅ Working | /actuator/health |
| Auth | ✅ Complete | /api/auth/* (8 endpoints) |
| Products | ✅ Complete | /api/products (6 endpoints) |
| Orders | 📋 Ready to implement | /api/orders (3 endpoints) |
| Customers | 📋 Ready to implement | /api/customers (2 endpoints) |
| Admin | 📋 Ready to implement | /api/admin (2 endpoints) |

## 🤖 AI/ML Integration Plan

### Option 1: External Python Service (Recommended)

Create a separate Python Flask/FastAPI service:

```python
# ml-service/app.py
from flask import Flask, jsonify, request
import numpy as np
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)

@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    user_id = request.json.get('user_id')
    # Your ML logic here
    return jsonify({
        'recommendations': [
            {'product_id': '123', 'score': 0.95},
            {'product_id': '456', 'score': 0.87},
        ]
    })

if __name__ == '__main__':
    app.run(port=5000)
```

Then call from NestJS:
```typescript
// src/ml/ml.service.ts
async getRecommendations(userId: string) {
  const response = await fetch('http://localhost:5000/recommendations', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId }),
  });
  return response.json();
}
```

### Option 2: TensorFlow.js in NestJS

```bash
pnpm add @tensorflow/tfjs-node
```

```typescript
// src/ml/ml.service.ts
import * as tf from '@tensorflow/tfjs-node';

@Injectable()
export class MlService {
  private model: tf.LayersModel;

  async onModuleInit() {
    this.model = await tf.loadLayersModel('file://./models/recommendation-model.json');
  }

  async predict(features: number[]) {
    const input = tf.tensor2d([features]);
    const prediction = this.model.predict(input) as tf.Tensor;
    return prediction.array();
  }
}
```

### Recommended AI Features:

1. **Product Recommendations** (Collaborative Filtering)
2. **Search Autocomplete** (NLP)
3. **Price Optimization** (Regression)
4. **Customer Segmentation** (Clustering)
5. **Fraud Detection** (Anomaly Detection)
6. **Chatbot** (LLM integration)

## 📦 Quick Copy-Paste for All Implementations

All complete code is in: `ALL_IMPLEMENTATIONS.md`

Just copy-paste each section into the corresponding file and you're done!

## 🚀 Next Steps After Backend is Running

1. **Create admin user** (SQL above)
2. **Test all endpoints** via Swagger
3. **Connect frontend** (already configured to use port 3333)
4. **Add sample products** via API
5. **Implement AI/ML** (choose Option 1 or 2)
6. **Deploy to Railway** (configs in deployment section)

## 💡 Pro Tips

- Use Swagger UI at `/api-docs` for testing
- Check logs for any errors
- All endpoints use proper error handling
- RBAC is enforced via guards
- Database migrations are automatic with Prisma

Happy coding! 🎉
