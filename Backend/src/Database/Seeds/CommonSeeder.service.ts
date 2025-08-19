import { DataSource } from 'typeorm';
import { user_role } from '../Table/Admin/user_role';
import { user } from '../Table/Admin/user';
import { currency } from '../Table/Admin/currency';
import { country } from '../Table/Admin/country';
import { company } from '../Table/Admin/company';
import { Injectable } from '@nestjs/common';
import { EncryptionService } from '@Service/Encryption.service';

@Injectable()
export class CommonSeederService {
  constructor(
    private readonly _EncryptionService: EncryptionService,
    private _DataSource: DataSource
  ) {
  }
  async Run() {
    try {
      await this.UserRoleSeed();
    }
    catch (e) {
      console.log(e);
    }
    try {
      await this.UserSeed();
    }
    catch (e) {
      console.log(e);
    }

    try {
      await this.CurrencySeed();
    }
    catch (e) {
      console.log(e);
    }

    try {
      await this.CountrySeed();
    }
    catch (e) {
      console.log(e);
    }

    try {
      await this.CompanySeed();
    }
    catch (e) {
      console.log(e);
    }


  }


  // UserRoleSeed = async () => {
  //   await this._DataSource.manager.createQueryBuilder()
  //     .insert()
  //     .into(user_role)
  //     .values([
  //       { name: 'Super Admin', code: '', created_by_id: "0", created_on: new Date() },
  //       { name: 'Admin', code: 'admin', created_by_id: "0", created_on: new Date() }

  //     ])
  //     .execute()
  // }

  UserRoleSeed = async () => {
    await this._DataSource.manager.createQueryBuilder()
      .insert()
      .into(user_role)
      .values([
        { name: 'Super Admin', code: '', created_by_id: "0", created_on: new Date() },
        { name: 'Admin', code: 'A', created_by_id: "1", created_on: new Date(), landing_page: "/admin_dashboard" },
        { name: 'Customer', code: 'C', created_by_id: "1", created_on: new Date(), landing_page: "/customer_dashboard" },
        { name: 'Vendor', code: 'V', created_by_id: "1", created_on: new Date(), landing_page: "/vendor_dashboard" },
        { name: 'Driver', code: 'D', created_by_id: "1", created_on: new Date(), landing_page: "/driver_dashboard" }
      ])
      .execute();
  }


  UserSeed = async () => {
    // Fetch roles for Super Admin and Admin
    const SuperAdminRoleData = await user_role.findOne({ where: { name: "Super Admin" } });
    const AdminRoleData = await user_role.findOne({ where: { name: "Admin" } });

    if (!SuperAdminRoleData || !AdminRoleData) {
      throw new Error('Required roles not found: Super Admin or Admin');
    }

    await this._DataSource.manager.createQueryBuilder()
      .insert()
      .into(user)
      .values([
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
        },
      ])
      .orIgnore() // optional: skip if email already exists (based on DB constraint)
      .execute();
  };


  CurrencySeed = async () => {
    await this._DataSource.manager.createQueryBuilder()
      .insert()
      .into(currency)
      .values([
        {
          name: 'Pound sterling',
          code: 'GBP',
          symbol: '£',
          created_by_id: "0",
          created_on: new Date()
        }
      ])
      .execute()
  }

  CountrySeed = async () => {
    const CurrencyData = await currency.findOne({ where: { name: "Pound sterling" } });
    await this._DataSource.manager.createQueryBuilder()
      .insert()
      .into(country)
      .values([
        {
          name: 'United Kingdom',
          code: 'UK',
          currency_id: CurrencyData.id,
          created_by_id: "0",
          created_on: new Date()
        }
      ])
      .execute()
  }

  CompanySeed = async () => {
    const CurrencyData = await currency.findOne({ where: { name: "Pound sterling" } });
    const CountryData = await country.findOne({ where: { name: "United Kingdom" } });
    await this._DataSource.manager.createQueryBuilder()
      .insert()
      .into(company)
      .values([
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
      ])
      .execute()
  }

}

