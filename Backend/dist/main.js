"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _swagger = require("@nestjs/swagger");
const _appmodule = require("./app.module");
const _compression = /*#__PURE__*/ _interop_require_default(require("compression"));
const _errorhandler = /*#__PURE__*/ _interop_require_default(require("errorhandler"));
const _express = require("express");
const _common = require("@nestjs/common");
const _passport = /*#__PURE__*/ _interop_require_default(require("passport"));
const _Exceptionhelper = require("./Helper/Exception.helper");
const _CommonSeederservice = require("./Database/Seeds/CommonSeeder.service");
const _config = require("@nestjs/config");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function bootstrap() {
    const app = await _core.NestFactory.create(_appmodule.AppModule, {
        cors: {
            origin: '*',
            exposedHeaders: '*'
        }
    });
    app.enableCors();
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: _common.VersioningType.URI
    });
    app.use((0, _compression.default)());
    app.use((0, _errorhandler.default)());
    app.use((0, _express.urlencoded)({
        limit: '500mb',
        extended: true
    }));
    app.use(_passport.default.initialize());
    // app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, forbidUnknownValues: true }));
    app.useGlobalPipes(new _common.ValidationPipe({
        transform: true
    }));
    app.useGlobalFilters(new _Exceptionhelper.ExceptionHelper());
    const config = new _swagger.DocumentBuilder().setTitle('Code Move').addBearerAuth().setDescription('Code Move API Description').setVersion('1.0').setExternalDoc('Postman Collection', '/swagger-json').setContact("Code Move", "https://codemove.co.uk/", "codemove.co.uk").build();
    const document = _swagger.SwaggerModule.createDocument(app, config);
    _swagger.SwaggerModule.setup('swagger', app, document, {
        swaggerOptions: {
            tagsSorter: 'alpha',
            enableSearch: true
        }
    });
    const _ConfigService = app.get(_config.ConfigService);
    const port = process.env.PORT || _ConfigService.get('PORT');
    await app.listen(port);
    console.log(`Application is running on port ${port}`);
    if (_ConfigService.get("Database.Seed") == "true") {
        const _CommonSeederService = app.get(_CommonSeederservice.CommonSeederService);
        await _CommonSeederService.Run();
    }
}
bootstrap();

//# sourceMappingURL=main.js.map