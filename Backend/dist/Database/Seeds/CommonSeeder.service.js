"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommonSeederService", {
    enumerable: true,
    get: function() {
        return CommonSeederService;
    }
});
const _typeorm = require("typeorm");
const _user_role = require("../Table/Admin/user_role");
const _user = require("../Table/Admin/user");
const _currency = require("../Table/Admin/currency");
const _country = require("../Table/Admin/country");
const _company = require("../Table/Admin/company");
const _common = require("@nestjs/common");
const _Encryptionservice = require("../../Service/Encryption.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CommonSeederService = class CommonSeederService {
    async Run() {
        try {
            await this.UserRoleSeed();
        } catch (e) {
            console.log(e);
        }
        try {
            await this.UserSeed();
        } catch (e) {
            console.log(e);
        }
        try {
            await this.CurrencySeed();
        } catch (e) {
            console.log(e);
        }
        try {
            await this.CountrySeed();
        } catch (e) {
            console.log(e);
        }
        try {
            await this.CompanySeed();
        } catch (e) {
            console.log(e);
        }
    }
    constructor(_EncryptionService, _DataSource){
        this._EncryptionService = _EncryptionService;
        this._DataSource = _DataSource;
        this.// UserRoleSeed = async () => {
        //   await this._DataSource.manager.createQueryBuilder()
        //     .insert()
        //     .into(user_role)
        //     .values([
        //       { name: 'Super Admin', code: '', created_by_id: "0", created_on: new Date() },
        //       { name: 'Admin', code: 'admin', created_by_id: "0", created_on: new Date() }
        //     ])
        //     .execute()
        // }
        UserRoleSeed = async ()=>{
            await this._DataSource.manager.createQueryBuilder().insert().into(_user_role.user_role).values([
                {
                    name: 'Super Admin',
                    code: '',
                    created_by_id: "0",
                    created_on: new Date()
                },
                {
                    name: 'Admin',
                    code: 'A',
                    created_by_id: "1",
                    created_on: new Date(),
                    landing_page: "/admin_dashboard"
                },
                {
                    name: 'Customer',
                    code: 'C',
                    created_by_id: "1",
                    created_on: new Date(),
                    landing_page: "/customer_dashboard"
                },
                {
                    name: 'Vendor',
                    code: 'V',
                    created_by_id: "1",
                    created_on: new Date(),
                    landing_page: "/vendor_dashboard"
                },
                {
                    name: 'Driver',
                    code: 'D',
                    created_by_id: "1",
                    created_on: new Date(),
                    landing_page: "/driver_dashboard"
                }
            ]).execute();
        };
        this.UserSeed = async ()=>{
            // Fetch roles for Super Admin and Admin
            const SuperAdminRoleData = await _user_role.user_role.findOne({
                where: {
                    name: "Super Admin"
                }
            });
            const AdminRoleData = await _user_role.user_role.findOne({
                where: {
                    name: "Admin"
                }
            });
            if (!SuperAdminRoleData || !AdminRoleData) {
                throw new Error('Required roles not found: Super Admin or Admin');
            }
            await this._DataSource.manager.createQueryBuilder().insert().into(_user.user).values([
                {
                    user_role_id: SuperAdminRoleData.id,
                    first_name: 'Super Admin',
                    email: 'admin@user.com',
                    password: this._EncryptionService.Encrypt('Login123!!'),
                    created_by_id: "0",
                    created_on: new Date()
                },
                {
                    user_role_id: AdminRoleData.id,
                    first_name: 'Admin',
                    email: 'admin@gmail.com',
                    password: this._EncryptionService.Encrypt('123456'),
                    created_by_id: "0",
                    created_on: new Date()
                }
            ]).orIgnore() // optional: skip if email already exists (based on DB constraint)
            .execute();
        };
        this.CurrencySeed = async ()=>{
            await this._DataSource.manager.createQueryBuilder().insert().into(_currency.currency).values([
                {
                    name: 'Pound sterling',
                    code: 'GBP',
                    symbol: '£',
                    created_by_id: "0",
                    created_on: new Date()
                }
            ]).execute();
        };
        this.CountrySeed = async ()=>{
            const CurrencyData = await _currency.currency.findOne({
                where: {
                    name: "Pound sterling"
                }
            });
            await this._DataSource.manager.createQueryBuilder().insert().into(_country.country).values([
                {
                    name: 'United Kingdom',
                    code: 'UK',
                    currency_id: CurrencyData.id,
                    created_by_id: "0",
                    created_on: new Date()
                }
            ]).execute();
        };
        this.CompanySeed = async ()=>{
            const CurrencyData = await _currency.currency.findOne({
                where: {
                    name: "Pound sterling"
                }
            });
            const CountryData = await _country.country.findOne({
                where: {
                    name: "United Kingdom"
                }
            });
            await this._DataSource.manager.createQueryBuilder().insert().into(_company.company).values([
                {
                    name: "BoilerPlate",
                    address: "BoilerPlate",
                    postal_code: "BoilerPlate",
                    country_id: CountryData.id,
                    currency_id: CurrencyData.id,
                    email: "Demo",
                    website: "Demo",
                    invoice_footer: "BoilerPlate",
                    created_by_id: "0",
                    created_on: new Date()
                }
            ]).execute();
        };
    }
};
CommonSeederService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Encryptionservice.EncryptionService === "undefined" ? Object : _Encryptionservice.EncryptionService,
        typeof _typeorm.DataSource === "undefined" ? Object : _typeorm.DataSource
    ])
], CommonSeederService);

//# sourceMappingURL=CommonSeeder.service.js.map