// src/composables/usePermissions.ts
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

export function usePermissions() {
  const authStore = useAuthStore();
  
  const hasPermission = (permission: string) => {
    return authStore.hasPermission(permission);
  };
  
  const hasAnyPermission = (permissions: string[]) => {
    return authStore.hasAnyPermission(permissions);
  };
  
  const hasRole = (roleCode: string) => {
    return authStore.hasRole(roleCode);
  };
  
  const canAccess = (permissions?: string[], roles?: string[]) => {
    return authStore.canAccess(permissions, roles);
  };
  
  const isSuperAdmin = computed(() => authStore.hasRole('')); // Empty code for Super Admin
  const isAdmin = computed(() => authStore.hasRole('A')); // A for Admin
  const isCustomer = computed(() => authStore.hasRole('C')); // C for Customer
  const isDriver = computed(() => authStore.hasRole('D')); // D for Driver
  const isVendor = computed(() => authStore.hasRole('V')); // V for Vendor
  
  return {
    hasPermission,
    hasAnyPermission,
    hasRole,
    canAccess,
    isSuperAdmin,
    isAdmin,
    isCustomer,
    isDriver,
    isVendor,
    userRole: computed(() => authStore.userRole),
    userPermissions: computed(() => authStore.userPermissions)
  };
}