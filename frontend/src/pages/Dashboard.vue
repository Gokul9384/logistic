<!-- src/pages/Dashboard.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Dashboard</div>
    
    <q-card class="q-pa-md">
      <div class="text-h6 q-mb-sm">Welcome, {{ userName }}!</div>
      <div class="text-body1 q-mb-md">
        You are logged in as: <strong>{{ roleName }}</strong>
        (Role Code: <strong>{{ userRoleCode }}</strong>)
      </div>
      
      <q-separator class="q-my-md" />
      
      <div class="text-h6 q-mb-sm">Your Permissions:</div>
      <div class="row q-gutter-sm">
        <q-chip 
          v-for="permission in userPermissionsList" 
          :key="permission" 
          color="primary" 
          text-color="white"
        >
          {{ permission }}
        </q-chip>
        <q-chip v-if="!userPermissionsList.length" color="grey" text-color="white">
          No permissions assigned
        </q-chip>
      </div>
      
      <q-separator class="q-my-md" />
      
      <div class="text-h6 q-mb-sm">Available Menu Sections:</div>
      <div class="row q-gutter-sm">
        <q-chip 
          v-if="canShowSection('admin')" 
          color="orange" 
          text-color="white"
        >
          Admin Section
        </q-chip>
        <q-chip 
          v-if="canShowSection('setup')" 
          color="blue" 
          text-color="white"
        >
          Setup Section
        </q-chip>
        <q-chip 
          v-if="canShowSection('operations')" 
          color="green" 
          text-color="white"
        >
          Operations Section
        </q-chip>
      </div>

      <q-separator class="q-my-md" />
      
      <div class="text-h6 q-mb-sm">Debug Information:</div>
      <div class="text-body2">
        <p><strong>User Role:</strong> {{ userRoleCode }}</p>
        <p><strong>Role Name:</strong> {{ roleName }}</p>
        <p><strong>Permissions Array:</strong> {{ JSON.stringify(userPermissionsList) }}</p>
        <p><strong>Has Dashboard Permission:</strong> {{ hasDashboardPermission }}</p>
        <p><strong>Has Customers Permission:</strong> {{ hasCustomersPermission }}</p>
        <p><strong>Has Orders Permission:</strong> {{ hasOrdersPermission }}</p>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// Properly access the reactive values
const userName = computed(() => authStore.user?.name || 'User');
const roleName = computed(() => authStore.role?.name || 'Unknown Role');
const userRoleCode = computed(() => authStore.userRole || 'None');
const userPermissionsList = computed(() => authStore.userPermissions || []);

// Check specific permissions
const hasDashboardPermission = computed(() => authStore.hasPermission('dashboard'));
const hasCustomersPermission = computed(() => authStore.hasPermission('customers'));
const hasOrdersPermission = computed(() => authStore.hasPermission('orders'));

// Reuse the same permission checking logic as MainLayout
const canShowSection = (section) => {
  // Super Admin (empty code) can see everything
  if (authStore.hasRole('')) return true;
  
  const sectionPermissions = {
    admin: ['users', 'user_roles'],
    setup: ['customers', 'vendors', 'drivers'],
    operations: ['orders', 'requirements', 'quotes', 'customer_quotes', 'bookings',]
  }
  
  const permissions = sectionPermissions[section] || []
  return authStore.hasAnyPermission(permissions)
}


</script>