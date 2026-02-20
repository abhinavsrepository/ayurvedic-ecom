"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
require("dotenv/config");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const products_module_1 = require("./products/products.module");
const orders_module_1 = require("./orders/orders.module");
const customers_module_1 = require("./customers/customers.module");
const payments_module_1 = require("./payments/payments.module");
const admin_module_1 = require("./admin/admin.module");
const cart_module_1 = require("./cart/cart.module");
const cache_module_1 = require("./cache/cache.module");
const reviews_module_1 = require("./reviews/reviews.module");
const blog_module_1 = require("./blog/blog.module");
const addresses_module_1 = require("./addresses/addresses.module");
const users_module_1 = require("./users/users.module");
const analytics_module_1 = require("./analytics/analytics.module");
const banners_module_1 = require("./banners/banners.module");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            prisma_module_1.PrismaModule,
            cache_module_1.CacheModule,
            auth_module_1.AuthModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            customers_module_1.CustomersModule,
            payments_module_1.PaymentsModule,
            admin_module_1.AdminModule,
            cart_module_1.CartModule,
            reviews_module_1.ReviewsModule,
            blog_module_1.BlogModule,
            addresses_module_1.AddressesModule,
            users_module_1.UsersModule,
            analytics_module_1.AnalyticsModule,
            banners_module_1.BannersModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map