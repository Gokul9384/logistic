// src/config/menuConfig.ts
export interface MenuItem {
  name: string;
  label: string;
  icon: string;
  permission: string;
  route: string;
}

export interface MenuSection {
  name: string;
  icon: string;
  label: string;
  permissions: string[];
  items: MenuItem[];
}

export const menuSections: MenuSection[] = [
  {
    name: 'admin',
    icon: 'admin_panel_settings',
    label: 'Admin',
    permissions: ['users', 'user_roles'],
    items: [
      {
        name: 'users',
        label: 'Users',
        icon: 'person',
        permission: 'users',
        route: '/users'
      },
      {
        name: 'user_roles',
        label: 'User Roles',
        icon: 'admin_panel_settings',
        permission: 'user_roles',
        route: '/user_role'
      }
    ]
  },
  {
    name: 'setup',
    icon: 'settings',
    label: 'Setup',
    permissions: ['customers', 'vendors', 'drivers','vehicle_type','service_area'],
    items: [
      {
        name: 'customers',
        label: 'Customers',
        icon: 'person',
        permission: 'customers',
        route: '/customers'
      },
      {
        name: 'vehicle_type',
        label: 'Vehicle Type',
        icon: 'local_shipping',
        permission: 'vehicle_type',
        route: '/vehicle_type'
      },
      {
        name: 'service_area',
        label: 'Service Area',
        icon: 'area_chart',
        permission: 'service_area',
        route: '/service_area'
      },
      {
        name: 'vendors',
        label: 'Vendors',
        icon: 'storefront',
        permission: 'vendors',
        route: '/vendors'
      },
      {
        name: 'drivers',
        label: 'Drivers',
        icon: 'local_shipping',
        permission: 'drivers',
        route: '/drivers'
      }
    ]
  },
  {
    name: 'operations',
    icon: 'business_center',
    label: 'Operations',
    permissions: ['orders', 'requirements', 'quotes', 'customer_quotes', 'bookings'],
    items: [
      {
        name: 'orders',
        label: 'Orders',
        icon: 'shopping_cart',
        permission: 'orders',
        route: '/orders'
      },
      {
        name: 'requirements',
        label: 'Requirements',
        icon: 'assignment',
        permission: 'requirements',
        route: '/requirements'
      },
      {
        name: 'quotes',
        label: 'Quotes',
        icon: 'request_quote',
        permission: 'quotes',
        route: '/quotes'
      },
      {
        name: 'customer_quotes',
        label: 'Customer Quotes',
        icon: 'rate_review',
        permission: 'customer_quotes',
        route: '/customer-quotes'
      },
      {
        name: 'bookings',
        label: 'Bookings',
        icon: 'event',
        permission: 'bookings',
        route: '/bookings'
      }
    ]
  }
];