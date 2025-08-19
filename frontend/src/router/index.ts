// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth';
import { CommonHelper } from '../helpers/CommonHelper'

// Define route meta interface
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresGuest?: boolean;
    permissions?: string[];
    roles?: string[];
  }
}

const routes = [
  {
    path: '/auth',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../pages/auth/Login.vue'),
        meta: { requiresGuest: true }
      }
    ]
  },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../pages/Dashboard.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['dashboard']
        }
      },
        {
        path: 'admin_dashboard',
        name: 'AdminDashboard',
        component: () => import('../pages/Dashboard/AdminDashboard.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['admin_dashboard'],
          roles: ['','A'] // Admin role
        }
      },
      {
        path: 'vendor_dashboard',
        name: 'VendorDashboard',
        component: () => import('../pages/Dashboard/VendorDashboard.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['vendor_dashboard'],
          roles: ['V'] // Vendor role
        }
      },
      {
        path: 'customer_dashboard',
        name: 'CustomerDashboard',
        component: () => import('../pages/Dashboard/CustomerDashboard.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['customer_dashboard'],
          roles: ['C'] // Customer role
        }
      },
      {
        path: 'driver_dashboard',
        name: 'DriverDashboard',
        component: () => import('../pages/Dashboard/DriverDashboard.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['driver_dashboard'],
          roles: ['D'] // Driver role
        }
      },
      {
        path: 'users',
        name: 'UserList',
        component: () => import('../pages/Admin/User/UserList.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['users'],
          roles: ['A'] // Admin role
        }
      },
      {
        path: 'users/:id',
        name: 'UserEdit',
        component: () => import('../pages/Admin/User/UserForm.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['users'],
          roles: ['A'] // Admin role
        }
      },
      {
        path: 'user_role',
        name: 'UserRoleList',
        component: () => import('../pages/Admin/User_Role/UserRoleList.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['user_roles'],
          roles: ['A'] // Admin role
        }
      },
      {
        path: 'user_role/:id',
        name: 'UserRoleEdit',
        component: () => import('../pages/Admin/User_Role/UserRoleForm.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['user_roles'],
          roles: ['A'] // Admin role
        }
      },
      {
        path: 'customers',
        name: 'customerList',
        component: () => import('../pages/Customer/CustomerList.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['customers'],
          roles: ['A', 'C'] // Admin and Customer roles
        }
      },
      {
        path: 'customers/:id',
        name: 'customerEdit',
        component: () => import('../pages/Customer/CustomerForm.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['customers'],
          roles: ['A', 'C'] // Admin and Customer roles
        }
      },
      {
        path: 'vendors',
        name: 'vendorList',
        component: () => import('../pages/Vendor/VendorList.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['vendors'],
          roles: ['A', 'V'] // Admin and Vendor roles
        }
      },
      {
        path: 'vendors/:id',
        name: 'vendorEdit',
        component: () => import('../pages/Vendor/VendorForm.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['vendors'],
          roles: ['A' , 'V'] // Admin and Vendor roles
        }
      },
      {
        path: 'vehicle_type',
        name: 'VehicleTypeList',
        component: () => import('../pages/VehicleType/VehicleTypeList.vue'),
        meta: { 
          requiresAuth: false,
          permissions: ['vehicle_type'],
          roles: ['A', 'V'] // Admin and Vendor roles
        }
      },
      {
        path: 'vehicle_type/:id',
        name: 'VehicleTypeEdit',
        component: () => import('../pages/VehicleType/VehicleTypeForm.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['vehicle_type'],
          roles: ['A' , 'V'] // Admin and Vendor roles
        }
      },
      {
        path: 'service_area',
        name: 'ServiceAreaList',
        component: () => import('../pages/ServiceArea/ServiceAreaList.vue'),
        meta: { 
          requiresAuth: false,
          permissions: ['service_area'],
          roles: ['A', 'V'] // Admin and Vendor roles
        }
      },
      {
        path: 'service_area/:id',
        name: 'ServiceAreaEdit',
        component: () => import('../pages/ServiceArea/ServiceAreaForm.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['service_area'],
          roles: ['A' , 'V'] // Admin and Vendor roles
        }
      },
      {
        path: 'orders',
        name: 'orderList',
        component: () => import('../pages/Order/OrderList.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['orders'],
          roles: ['A', 'V', 'C'] // Admin, Vendor, and Customer roles
        }
      },
      {
        path: 'orders/:id',
        name: 'orderEdit',
        component: () => import('../pages/Order/OrderForm.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['orders'],
          roles: ['A', 'V', 'C'] // Admin, Vendor, and Customer roles
        }
      },
      {
        path: 'requirements',
        name: 'requirementList',
        component: () => import('../pages/Requirements/RequirementsList.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['requirements'],
          roles: ['A', 'V'] // Admin and Vendor roles
        }
      },
      {
        path: 'requirements/:id',
        name: 'requirementEdit',
        component: () => import('../pages/Requirements/RequirementsForm.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['requirements'],
          roles: ['A', 'V'] // Admin and Vendor roles
        }
      },
      {
        path: 'quotes',
        name: 'quoteList',
        component: () => import('../pages/Quote/QuoteList.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['quotes'],
          roles: ['A', 'V'] // Admin and Vendor roles
        }
      },
      {
        path: 'quotes/:id',
        name: 'quoteEdit',
        component: () => import('../pages/Quote/QuoteForm.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['quotes'],
          roles: ['A', 'V'] // Admin and Vendor roles
        }
      },
      {
        path: 'customer-quotes',
        name: 'customerQuotesList',
        component: () => import('../pages/CustomerQuote/customerquoteList.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['customer_quotes'],
          roles: ['A', 'C'] // Admin and Customer roles
        }
      },
      {
        path: 'customer-quotes/:id',
        name: 'customerQuotesEdit',
        component: () => import('../pages/CustomerQuote/customerquoteForm.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['customer_quotes'],
          roles: ['A', 'C'] // Admin and Customer roles
        }
      },
      {
        path: 'bookings',
        name: 'bookingList',
        component: () => import('../pages/Booking/BookingList.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['bookings'],
          roles: ['A', 'C', 'V', 'D'] // Admin, Customer, and Driver roles
        }
      },
      {
        path: 'bookings/:id',
        name: 'bookingEdit',
        component: () => import('../pages/Booking/BookingForm.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['bookings'],
          roles: ['A', 'C', 'V','D'] // Admin, Customer, and Vendor roles
        }
      },
      {
        path: 'drivers',
        name: 'driversList',
        component: () => import('../pages/Driver/DriverList.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['drivers'],
          roles: ['A','V','D'] // Admin, Vendor, and Driver roles
        }
      },
      {
        path: 'drivers/:id',
        name: 'driversEdit',
        component: () => import('../pages/Driver/DriverForm.vue'),
        meta: { 
          requiresAuth: true,
          permissions: ['drivers'],
          roles: ['A','V'] // Admin and Vendor rolesS
        }
      },
    ]
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: () => import('../pages/AccessDenied/AccessDenied.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/auth/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guards
router.beforeEach(async (to, _from, next) => {
  try {
    const authStore = useAuthStore();
    
    // Initialize auth store if not already done
    if (!authStore.isAuthenticated) {
      authStore.initialize();
    }
    
    const isAuthenticated = authStore.isAuthenticated;
    
    // Handle guest routes (login, forgot password, etc.)
    if (to.meta.requiresGuest && isAuthenticated) {
      return next(authStore.landingPage);
    }
    
    // Handle protected routes
    if (to.meta.requiresAuth && !isAuthenticated) {
      return next('/auth/login');
    }
    
    // Check role and permission based access
    if (isAuthenticated && to.meta.requiresAuth) {
      const routeRoles = to.meta.roles as string[] || [];
      const routePermissions = to.meta.permissions as string[] || [];
      
      // Check if user can access this route
      if (!authStore.canAccess(routePermissions, routeRoles)) {
        CommonHelper.ErrorToaster('Access denied. You do not have permission to access this page.');
        return next('/access-denied');
      }
    }
    
    next();
  } catch (error) {
    console.error('Router guard error:', error);
    next('/auth/login');
  }
});
export default router