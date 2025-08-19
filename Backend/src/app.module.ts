import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@Controller/Admin/User.controller';
import { UserRoleController } from '@Controller/Admin/UserRole.controller';
import { LoginController } from '@Controller/Auth/Login.controller';
import { ExceptionHelper } from '@Helper/Exception.helper';
import { UserService } from '@Service/Admin/User.service';
import { UserRoleService } from '@Service/Admin/UserRole.service';
import { AuthService } from '@Service/Auth/Auth.service';
import { JwtStrategy } from '@Service/Auth/JwtStrategy.service';
import { EmailService } from '@Service/Email.service';
import { EmailConfigController } from '@Controller/Admin/EmailConfig.controller';
import { EmailConfigService } from '@Service/Admin/EmailConfig.service';
import { CountryController } from '@Controller/Admin/Country.controller';
import { CurrencyController } from '@Controller/Admin/Currency.controller';
import { CountryService } from '@Service/Admin/Country.service';
import { CurrencyService } from '@Service/Admin/Currency.service';
import { CompanyController } from '@Controller/Admin/Company.controller';
import { CompanyService } from '@Service/Admin/Company.service';
import { CommonService } from '@Service/Common.service';
import Configuration from './Config/Configuration';
import { EncryptionService } from '@Service/Encryption.service';
import { CommonSeederService } from '@Database/Seeds/CommonSeeder.service';
import { MailerService } from '@Service/Mailer.service';
import { ErrorLogService } from '@Service/Admin/ErrorLog.service';
import { ErrorLogController } from '@Controller/Admin/ErrorLog.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuditLogService } from '@Service/Admin/AuditLog.service';
import { AuditLogController } from '@Controller/Admin/AuditLog.controller';
import { MulterModule } from '@nestjs/platform-express';
import { AutoNumberController } from '@Controller/Admin/AutoNumber.controller';
import { Redis } from 'ioredis';
import { CacheService } from '@Service/Cache.service';
import { StateService } from './Service/Admin/State.service';
import { CityService } from './Service/Admin/City.service';
import { StateController } from './Controller/Admin/State.controller';
import { CityController } from './Controller/Admin/City.controller';
import { VendorController } from './Controller/CodeMove/Vendor.controller';
import { VendorService } from './Service/CodeMove/Vendor.service';
import { CustomerService } from './Service/CodeMove/Customer.service';
import { CustomerController } from './Controller/CodeMove/Customer.controller';
import { OrderController } from './Controller/CodeMove/Order.controller';
import { OrderService } from './Service/CodeMove/Order.service';
import { DriverService } from './Service/CodeMove/Driver.service';
import { DeliveryService } from './Service/CodeMove/Delivery.service';
import { DriverController } from './Controller/CodeMove/Driver.controller';
import { DeliveryController } from './Controller/CodeMove/Delivery.controller';
import { QuoteController } from './Controller/CodeMove/Quote.controller';
import { QuoteService } from './Service/CodeMove/Quote.service';
import { SignUpService } from './Service/Auth/SignUpService.service';
import { NotificationController } from './Controller/CodeMove/Notification.controller';
import { NotificationService } from './Service/CodeMove/Notification.service';
import { RequirementController } from './Controller/CodeMove/Requirement.controller';
import { RequirementService } from './Service/CodeMove/Requirement.service';
import { BookingController } from './Controller/CodeMove/Booking.controller';
import { BookingService } from './Service/CodeMove/Booking.service';
import { CustomerQuoteController } from './Controller/CodeMove/CustomerQuote.controller';
import { CustomerQuoteService } from './Service/CodeMove/CustomerQuote.service';
import { DashboardController } from './Controller/CodeMove/Dashboard.controller';
import { DashboardService } from './Service/CodeMove/Dashboard.service';
import { VehicleTypeService } from './Service/CodeMove/VehicleType.service';
import { VehicleTypeController } from './Controller/CodeMove/VehicleType.controller';
import { ServiceAreaController } from './Controller/CodeMove/ServiceArea.controller';
import { ServiceAreaService } from './Service/CodeMove/ServiceArea.service';
import { VendorDashboardService } from './Service/CodeMove/VendorDashboard.service';
import { VendorDashboardController } from './Controller/CodeMove/VendorDashboard.controller';
import { CustomerDashboardController } from './Controller/CodeMove/CustomerDashboard.controller';
import { CustomerDashboardService } from './Service/CodeMove/CustomerDashboard.service';
import { DriverDashboardController } from './Controller/CodeMove/DriverDashboard.controller';
import { DriverDashboardService } from './Service/CodeMove/DriverDashboard.service';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: __dirname + '/client',
      exclude: ['/api/*', 'swagger'],
    }),
    EventEmitterModule.forRoot({ maxListeners: 0 }),
    ConfigModule.forRoot({ isGlobal: true, load: [Configuration] }),
    MulterModule.register(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (_ConfigService: ConfigService) => ({
        type: 'mysql',
        host: _ConfigService.get("Database.Host"),
        port: _ConfigService.get("Database.Port"),
        username: _ConfigService.get("Database.User"),
        password: _ConfigService.get("Database.Password"),
        database: _ConfigService.get("Database.Name"),
        synchronize: _ConfigService.get("Database.Sync"),
        keepConnectionAlive: true,
        entities: [__dirname + '/Database/**/*.{ts,js}'],
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
      inject: [ConfigService]
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: true,
      property: 'user',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (_ConfigService: ConfigService) => ({
        secret: _ConfigService.get("JWT.SecertToken"),
        signOptions: { expiresIn: _ConfigService.get("JWT.ExpiresIn") },
      }),
      inject: [ConfigService]

    }),
  ],
  controllers: [
    LoginController,
    UserController,
    UserRoleController,
    EmailConfigController,
    CountryController,
    CurrencyController,
    CompanyController,
    ErrorLogController,
    AuditLogController,
    AutoNumberController,
    StateController,
    CityController,
    VendorController,
    CustomerController,
    OrderController,
    DriverController,
    DeliveryController,
    QuoteController,
    NotificationController,
    RequirementController,
    BookingController,
    CustomerQuoteController,
    DashboardController,
    VehicleTypeController,
    ServiceAreaController,
    VendorDashboardController,
    CustomerDashboardController,
    DriverDashboardController
  ],
  providers: [
    AuthService,
    UserService,
    UserRoleService,
    EmailService,
    EmailConfigService,
    CountryService,
    CurrencyService,
    CompanyService,
    CommonService,
    JwtStrategy,
    ErrorLogService,
    AuditLogService,
    StateService,
    CityService,
    VendorService,
    CustomerService,
    OrderService,
    DriverService,
    DeliveryService,
    QuoteService,
    SignUpService,
    NotificationService,
    RequirementService,
    BookingService,
    CustomerQuoteService,
    DashboardService,
    VehicleTypeService,
    ServiceAreaService,
    VendorDashboardService,
    CustomerDashboardService,
    DriverDashboardService,
    {
      provide: APP_FILTER,
      useClass: ExceptionHelper,
    },
    MailerService,
    EncryptionService,
    CommonSeederService,
    CacheService,
    {
      provide: "REDIS_CLIENT",
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        });
      },
    },
    CacheService
  ],
  exports: [AuthService, EncryptionService],
})
export class AppModule {
}
