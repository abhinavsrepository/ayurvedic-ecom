# Web to Backend Endpoint Connection Matrix

This matrix maps endpoints used by `ayurveda-shop` web code to `ayurveda-api` backend routes.

Legend:
- `OK`: implemented and matched
- `FIX`: exists but needs route/order/auth/contract update
- `MISSING`: not implemented in backend

## Auth (`ayurveda-shop/lib/api/auth.ts`)
| Method | Web Endpoint | Backend | Status | Notes |
|---|---|---|---|---|
| POST | `/api/auth/login` | `POST /api/auth/login` | OK | |
| POST | `/api/auth/register` | `POST /api/auth/register` | OK | |
| POST | `/api/auth/logout` | `POST /api/auth/logout` | OK | |
| POST | `/api/auth/refresh` | `POST /api/auth/refresh` | OK | uses `X-Refresh-Token` header |
| GET | `/api/auth/me` | `GET /api/auth/me` | OK | |
| POST | `/api/auth/2fa/enable` | `POST /api/auth/2fa/enable` | OK | |
| POST | `/api/auth/2fa/verify` | `POST /api/auth/2fa/verify` | OK | |
| DELETE | `/api/auth/2fa/disable` | `DELETE /api/auth/2fa/disable` | OK | |

## Products (`ayurveda-shop/lib/api/products.ts`, `app/actions/products.ts`)
| Method | Web Endpoint | Backend | Status | Notes |
|---|---|---|---|---|
| GET | `/api/products` | `GET /api/products` | OK | |
| GET | `/api/products/:id` | `GET /api/products/:id` | OK | |
| GET | `/api/products/slug/:slug` | `GET /api/products/slug/:slug` | OK | |
| POST | `/api/products` | `POST /api/products` | OK | auth required |
| PUT | `/api/products/:id` | `PUT /api/products/:id` | OK | auth required |
| DELETE | `/api/products/:id` | `DELETE /api/products/:id` | OK | auth required |
| GET | `/api/products/search` | `GET /api/products/search` | OK | route order fixed in controller |
| PATCH | `/api/products/:id/stock` | `PATCH /api/products/:id/stock` | OK | auth required |

## Orders (`ayurveda-shop/lib/api/orders.ts`, `lib/api/admin.ts`)
| Method | Web Endpoint | Backend | Status | Notes |
|---|---|---|---|---|
| GET | `/api/orders` | `GET /api/orders` | OK | supports admin list and customer list |
| GET | `/api/orders/:id` | `GET /api/orders/:id` | OK | supports admin access |
| POST | `/api/orders` | `POST /api/orders` | OK | |
| PATCH | `/api/orders/:id/cancel` | `PATCH /api/orders/:id/cancel` | OK | |
| GET | `/api/orders/:id/track` | `GET /api/orders/:id/track` | OK | |
| PATCH | `/api/orders/:id/status` | `PATCH /api/orders/:id/status` | OK | admin/manager |
| POST | `/api/orders/:id/refund` | `POST /api/orders/:id/refund` | OK | admin/manager |
| GET | `/api/orders/search` | `GET /api/orders/search` | OK | admin/manager |
| GET | `/api/orders/export` | `GET /api/orders/export` | OK | route order fixed |

## Customers (`ayurveda-shop/lib/api/customers.ts`, `lib/api/admin.ts`)
| Method | Web Endpoint | Backend | Status | Notes |
|---|---|---|---|---|
| GET | `/api/customers` | `GET /api/customers` | OK | admin/manager |
| GET | `/api/customers/:id` | `GET /api/customers/:id` | OK | admin/manager |
| PATCH | `/api/customers/:id` | `PATCH /api/customers/:id` | OK | admin/manager |
| GET | `/api/customers/:id/stats` | `GET /api/customers/:id/stats` | OK | admin/manager |
| GET | `/api/customers/search` | `GET /api/customers/search` | OK | route order fixed |
| GET | `/api/customers/export` | `GET /api/customers/export` | OK | route order fixed |

## Cart (`ayurveda-shop/lib/api/cart.ts`)
| Method | Web Endpoint | Backend | Status | Notes |
|---|---|---|---|---|
| GET | `/api/cart` | `GET /api/cart` | OK | |
| POST | `/api/cart/items` | `POST /api/cart/items` | OK | |
| PATCH | `/api/cart/items/:itemId` | `PATCH /api/cart/items/:itemId` | OK | |
| DELETE | `/api/cart/items/:itemId` | `DELETE /api/cart/items/:itemId` | OK | |
| DELETE | `/api/cart` | `DELETE /api/cart` | OK | |
| POST | `/api/cart/merge` | `POST /api/cart/merge` | OK | |
| GET | `/api/cart/summary` | `GET /api/cart/summary` | OK | |

## Reviews (`ayurveda-shop/lib/api/reviews.ts`)
| Method | Web Endpoint | Backend | Status | Notes |
|---|---|---|---|---|
| GET | `/api/reviews/product/:productId` | `GET /api/reviews/product/:productId` | OK | expects UUID product IDs |
| GET | `/api/reviews/product/:productId/stats` | `GET /api/reviews/product/:productId/stats` | OK | expects UUID product IDs |
| POST | `/api/reviews` | `POST /api/reviews` | OK | auth required |
| PATCH | `/api/reviews/:id` | `PATCH /api/reviews/:id` | OK | auth required |
| DELETE | `/api/reviews/:id` | `DELETE /api/reviews/:id` | OK | auth required |
| POST | `/api/reviews/:id/helpful` | `POST /api/reviews/:id/helpful` | OK | auth required |
| GET | `/api/reviews/user` | `GET /api/reviews/user` | OK | auth required |

## Blog (`ayurveda-shop/lib/api/blog.ts`)
| Method | Web Endpoint | Backend | Status | Notes |
|---|---|---|---|---|
| GET | `/api/blog/posts` | `GET /api/blog/posts` | OK | |
| GET | `/api/blog/posts/:slug` | `GET /api/blog/posts/:slug` | OK | |
| GET | `/api/blog/categories` | `GET /api/blog/categories` | OK | |
| GET | `/api/blog/tags` | `GET /api/blog/tags` | OK | |
| GET | `/api/blog/admin/posts` | `GET /api/blog/admin/posts` | OK | auth required |
| GET | `/api/blog/admin/posts/:id` | `GET /api/blog/admin/posts/:id` | OK | auth required |
| POST | `/api/blog/posts` | `POST /api/blog/posts` | OK | auth required |
| PUT | `/api/blog/posts/:id` | `PUT /api/blog/posts/:id` | OK | auth required |
| DELETE | `/api/blog/posts/:id` | `DELETE /api/blog/posts/:id` | OK | auth required |

## Addresses (`ayurveda-shop/lib/api/addresses.ts`)
| Method | Web Endpoint | Backend | Status | Notes |
|---|---|---|---|---|
| GET | `/api/addresses` | `GET /api/addresses` | OK | auth required |
| GET | `/api/addresses/default` | `GET /api/addresses/default` | OK | auth required |
| GET | `/api/addresses/:id` | `GET /api/addresses/:id` | OK | auth required |
| POST | `/api/addresses` | `POST /api/addresses` | OK | auth required |
| PATCH | `/api/addresses/:id` | `PATCH /api/addresses/:id` | OK | auth required |
| DELETE | `/api/addresses/:id` | `DELETE /api/addresses/:id` | OK | auth required |
| POST | `/api/addresses/:id/default` | `POST /api/addresses/:id/default` | OK | auth required |

## Users (`ayurveda-shop/lib/api/users.ts`)
| Method | Web Endpoint | Backend | Status | Notes |
|---|---|---|---|---|
| GET | `/api/users/me` | `GET /api/users/me` | OK | |
| PATCH | `/api/users/me` | `PATCH /api/users/me` | OK | |
| POST | `/api/users/me/password` | `POST /api/users/me/password` | OK | |
| POST | `/api/users/me/avatar` | `POST /api/users/me/avatar` | OK | |
| DELETE | `/api/users/me/account` | `DELETE /api/users/me/account` | OK | |

## Payments (`ayurveda-shop/lib/api/payments.ts`)
| Method | Web Endpoint | Backend | Status | Notes |
|---|---|---|---|---|
| POST | `/api/payments/create` | `POST /api/payments/create` | OK | |
| POST | `/api/payments/verify/razorpay` | `POST /api/payments/verify/razorpay` | OK | |
| POST | `/api/payments/verify/stripe` | `POST /api/payments/verify/stripe` | OK | |
| GET | `/api/payments/status/:orderId` | `GET /api/payments/status/:orderId` | OK | |
| POST | `/api/payments/refund` | `POST /api/payments/refund` | OK | |

## Analytics (`ayurveda-shop/lib/api/analytics.ts`)
| Method | Web Endpoint | Backend | Status | Notes |
|---|---|---|---|---|
| GET | `/api/analytics/traffic-sources` | `GET /api/analytics/traffic-sources` | OK | |
| GET | `/api/analytics/summary/events` | `GET /api/analytics/summary/events` | OK | |
| GET | `/api/analytics/summary/devices` | `GET /api/analytics/summary/devices` | OK | |
| GET | `/api/analytics/summary/locations` | `GET /api/analytics/summary/locations` | OK | |
| POST | `/api/analytics/event` | `POST /api/analytics/event` | OK | |

## Admin (`ayurveda-shop/lib/api/admin.ts`)
| Method | Web Endpoint | Backend | Status | Notes |
|---|---|---|---|---|
| GET | `/api/admin/dashboard/stats` | `GET /api/admin/dashboard/stats` | OK | implemented in admin module |

## ML (`ayurveda-shop/lib/api/ml.ts`)
| Method | Web Endpoint | Backend | Status | Notes |
|---|---|---|---|---|
| POST | `/api/ml/recommendations` | `POST /api/ml/recommendations` | OK | proxied by `ayurveda-api` to `ml-service` |
| POST | `/api/ml/forecast` | `POST /api/ml/forecast` | OK | |
| GET | `/api/ml/anomalies` | `GET /api/ml/anomalies` | OK | |
| POST | `/api/ml/predict/churn` | `POST /api/ml/predict/churn` | OK | |
| POST | `/api/ml/predict/clv` | `POST /api/ml/predict/clv` | OK | |
| POST | `/api/ml/playground` | `POST /api/ml/playground` | OK | exposed via `ayurveda-api` ML module |
| GET | `/api/ml/models/info` | `GET /api/ml/models/info` | OK | exposed via `ayurveda-api` ML module |

## Banners (`ayurveda-shop/lib/api/banners.ts`)
| Method | Web Endpoint | Backend | Status | Notes |
|---|---|---|---|---|
| GET | `/api/banners` (Next route) | `GET /api/banners` | OK | Next route proxies to backend |
| POST | `/api/banners/:id/impressions` (Next route) | `POST /api/banners/:id/impressions` | OK | Next route proxies to backend |
| POST | `/api/banners/:id/clicks` (Next route) | `POST /api/banners/:id/clicks` | OK | Next route proxies to backend |

## Execution Order
1. Backend route fixes + missing endpoints.
2. Frontend API contract alignment.
3. Replace web mock fallbacks with backend-driven behavior.
4. Verification.
