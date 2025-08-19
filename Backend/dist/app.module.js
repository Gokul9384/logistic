"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _core = require("@nestjs/core");
const _jwt = require("@nestjs/jwt");
const _passport = require("@nestjs/passport");
const _servestatic = require("@nestjs/serve-static");
const _typeorm = require("@nestjs/typeorm");
const _Usercontroller = require("./Controller/Admin/User.controller");
const _UserRolecontroller = require("./Controller/Admin/UserRole.controller");
const _Logincontroller = require("./Controller/Auth/Login.controller");
const _Exceptionhelper = require("./Helper/Exception.helper");
const _Userservice = require("./Service/Admin/User.service");
const _UserRoleservice = require("./Service/Admin/UserRole.service");
const _Authservice = require("./Service/Auth/Auth.service");
const _JwtStrategyservice = require("./Service/Auth/JwtStrategy.service");
const _Emailservice = require("./Service/Email.service");
const _EmailConfigcontroller = require("./Controller/Admin/EmailConfig.controller");
const _EmailConfigservice = require("./Service/Admin/EmailConfig.service");
const _Countrycontroller = require("./Controller/Admin/Country.controller");
const _Currencycontroller = require("./Controller/Admin/Currency.controller");
const _Countryservice = require("./Service/Admin/Country.service");
const _Currencyservice = require("./Service/Admin/Currency.service");
const _Companycontroller = require("./Controller/Admin/Company.controller");
const _Companyservice = require("./Service/Admin/Company.service");
const _Commonservice = require("./Service/Common.service");
const _Configuration = /*#__PURE__*/ _interop_require_default(require("./Config/Configuration"));
const _Encryptionservice = require("./Service/Encryption.service");
const _CommonSeederservice = require("./Database/Seeds/CommonSeeder.service");
const _Mailerservice = require("./Service/Mailer.service");
const _ErrorLogservice = require("./Service/Admin/ErrorLog.service");
const _ErrorLogcontroller = require("./Controller/Admin/ErrorLog.controller");
const _eventemitter = require("@nestjs/event-emitter");
const _AuditLogservice = require("./Service/Admin/AuditLog.service");
const _AuditLogcontroller = require("./Controller/Admin/AuditLog.controller");
const _platformexpress = require("@nestjs/platform-express");
const _AutoNumbercontroller = require("./Controller/Admin/AutoNumber.controller");
const _ioredis = require("ioredis");
const _Cacheservice = require("./Service/Cache.service");
const _Stateservice = require("./Service/Admin/State.service");
const _Cityservice = require("./Service/Admin/City.service");
const _Statecontroller = require("./Controller/Admin/State.controller");
const _Citycontroller = require("./Controller/Admin/City.controller");
const _Vendorcontroller = require("./Controller/CodeMove/Vendor.controller");
const _Vendorservice = require("./Service/CodeMove/Vendor.service");
const _Customerservice = require("./Service/CodeMove/Customer.service");
const _Customercontroller = require("./Controller/CodeMove/Customer.controller");
const _Ordercontroller = require("./Controller/CodeMove/Order.controller");
const _Orderservice = require("./Service/CodeMove/Order.service");
const _Driverservice = require("./Service/CodeMove/Driver.service");
const _Deliveryservice = require("./Service/CodeMove/Delivery.service");
const _Drivercontroller = require("./Controller/CodeMove/Driver.controller");
const _Deliverycontroller = require("./Controller/CodeMove/Delivery.controller");
const _Quotecontroller = require("./Controller/CodeMove/Quote.controller");
const _Quoteservice = require("./Service/CodeMove/Quote.service");
const _SignUpServiceservice = require("./Service/Auth/SignUpService.service");
const _Notificationcontroller = require("./Controller/CodeMove/Notification.controller");
const _Notificationservice = require("./Service/CodeMove/Notification.service");
const _Requirementcontroller = require("./Controller/CodeMove/Requirement.controller");
const _Requirementservice = require("./Service/CodeMove/Requirement.service");
const _Bookingcontroller = require("./Controller/CodeMove/Booking.controller");
const _Bookingservice = require("./Service/CodeMove/Booking.service");
const _CustomerQuotecontroller = require("./Controller/CodeMove/CustomerQuote.controller");
const _CustomerQuoteservice = require("./Service/CodeMove/CustomerQuote.service");
const _Dashboardcontroller = require("./Controller/CodeMove/Dashboard.controller");
const _Dashboardservice = require("./Service/CodeMove/Dashboard.service");
const _VehicleTypeservice = require("./Service/CodeMove/VehicleType.service");
const _VehicleTypecontroller = require("./Controller/CodeMove/VehicleType.controller");
const _ServiceAreacontroller = require("./Controller/CodeMove/ServiceArea.controller");
const _ServiceAreaservice = require("./Service/CodeMove/ServiceArea.service");
const _VendorDashboardservice = require("./Service/CodeMove/VendorDashboard.service");
const _VendorDashboardcontroller = require("./Controller/CodeMove/VendorDashboard.controller");
const _CustomerDashboardcontroller = require("./Controller/CodeMove/CustomerDashboard.controller");
const _CustomerDashboardservice = require("./Service/CodeMove/CustomerDashboard.service");
const _DriverDashboardcontroller = require("./Controller/CodeMove/DriverDashboard.controller");
const _DriverDashboardservice = require("./Service/CodeMove/DriverDashboard.service");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppModule = class AppModule {
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _servestatic.ServeStaticModule.forRoot({
                rootPath: __dirname + '/client',
                exclude: [
                    '/api/*',
                    'swagger'
                ]
            }),
            _eventemitter.EventEmitterModule.forRoot({
                maxListeners: 0
            }),
            _config.ConfigModule.forRoot({
                isGlobal: true,
                load: [
                    _Configuration.default
                ]
            }),
            _platformexpress.MulterModule.register(),
            _typeorm.TypeOrmModule.forRootAsync({
                imports: [
                    _config.ConfigModule
                ],
                useFactory: (_ConfigService)=>({
                        type: 'mysql',
                        host: _ConfigService.get("Database.Host"),
                        port: _ConfigService.get("Database.Port"),
                        username: _ConfigService.get("Database.User"),
                        password: _ConfigService.get("Database.Password"),
                        database: _ConfigService.get("Database.Name"),
                        synchronize: _ConfigService.get("Database.Sync"),
                        keepConnectionAlive: true,
                        entities: [
                            __dirname + '/Database/**/*.{ts,js}'
                        ],
                        logger: "advanced-console",
                        logging: _ConfigService.get("Database.LOG"),
                        bigNumberStrings: false,
                        supportBigNumbers: true,
                        dateStrings: true,
                        timezone: "local",
                        ssl: {
                            rejectUnauthorized: false
                        }
                    }),
                inject: [
                    _config.ConfigService
                ]
            }),
            _passport.PassportModule.register({
                defaultStrategy: 'jwt',
                session: true,
                property: 'user'
            }),
            _jwt.JwtModule.registerAsync({
                imports: [
                    _config.ConfigModule
                ],
                useFactory: (_ConfigService)=>({
                        secret: _ConfigService.get("JWT.SecertToken"),
                        signOptions: {
                            expiresIn: _ConfigService.get("JWT.ExpiresIn")
                        }
                    }),
                inject: [
                    _config.ConfigService
                ]
            })
        ],
        controllers: [
            _Logincontroller.LoginController,
            _Usercontroller.UserController,
            _UserRolecontroller.UserRoleController,
            _EmailConfigcontroller.EmailConfigController,
            _Countrycontroller.CountryController,
            _Currencycontroller.CurrencyController,
            _Companycontroller.CompanyController,
            _ErrorLogcontroller.ErrorLogController,
            _AuditLogcontroller.AuditLogController,
            _AutoNumbercontroller.AutoNumberController,
            _Statecontroller.StateController,
            _Citycontroller.CityController,
            _Vendorcontroller.VendorController,
            _Customercontroller.CustomerController,
            _Ordercontroller.OrderController,
            _Drivercontroller.DriverController,
            _Deliverycontroller.DeliveryController,
            _Quotecontroller.QuoteController,
            _Notificationcontroller.NotificationController,
            _Requirementcontroller.RequirementController,
            _Bookingcontroller.BookingController,
            _CustomerQuotecontroller.CustomerQuoteController,
            _Dashboardcontroller.DashboardController,
            _VehicleTypecontroller.VehicleTypeController,
            _ServiceAreacontroller.ServiceAreaController,
            _VendorDashboardcontroller.VendorDashboardController,
            _CustomerDashboardcontroller.CustomerDashboardController,
            _DriverDashboardcontroller.DriverDashboardController
        ],
        providers: [
            _Authservice.AuthService,
            _Userservice.UserService,
            _UserRoleservice.UserRoleService,
            _Emailservice.EmailService,
            _EmailConfigservice.EmailConfigService,
            _Countryservice.CountryService,
            _Currencyservice.CurrencyService,
            _Companyservice.CompanyService,
            _Commonservice.CommonService,
            _JwtStrategyservice.JwtStrategy,
            _ErrorLogservice.ErrorLogService,
            _AuditLogservice.AuditLogService,
            _Stateservice.StateService,
            _Cityservice.CityService,
            _Vendorservice.VendorService,
            _Customerservice.CustomerService,
            _Orderservice.OrderService,
            _Driverservice.DriverService,
            _Deliveryservice.DeliveryService,
            _Quoteservice.QuoteService,
            _SignUpServiceservice.SignUpService,
            _Notificationservice.NotificationService,
            _Requirementservice.RequirementService,
            _Bookingservice.BookingService,
            _CustomerQuoteservice.CustomerQuoteService,
            _Dashboardservice.DashboardService,
            _VehicleTypeservice.VehicleTypeService,
            _ServiceAreaservice.ServiceAreaService,
            _VendorDashboardservice.VendorDashboardService,
            _CustomerDashboardservice.CustomerDashboardService,
            _DriverDashboardservice.DriverDashboardService,
            {
                provide: _core.APP_FILTER,
                useClass: _Exceptionhelper.ExceptionHelper
            },
            _Mailerservice.MailerService,
            _Encryptionservice.EncryptionService,
            _CommonSeederservice.CommonSeederService,
            _Cacheservice.CacheService,
            {
                provide: "REDIS_CLIENT",
                useFactory: ()=>{
                    return new _ioredis.Redis({
                        host: process.env.REDIS_HOST,
                        port: Number(process.env.REDIS_PORT)
                    });
                }
            },
            _Cacheservice.CacheService
        ],
        exports: [
            _Authservice.AuthService,
            _Encryptionservice.EncryptionService
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map