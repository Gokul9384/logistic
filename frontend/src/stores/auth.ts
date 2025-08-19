// src/stores/auth.ts
import { defineStore } from 'pinia';
import { CommonHelper } from '@/helpers/CommonHelper';

// Define interfaces
interface User {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Role {
  id: string;
  name: string;
  code: string;
  landingPage: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  role: Role | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    role: null,
    token: null,
    isAuthenticated: false
  }),
  
  getters: {
    userRole: (state) => state.role?.code || '',
    userPermissions: (state) => state.role?.permissions || [],
    hasPermission: (state) => {
      return (permission: string) => {
        // If role is null, no permissions
        if (!state.role) return false;
        
        // Super Admin (empty code) has all permissions
        if (state.role.code === '') return true;
        
        // Now we can safely access permissions since we know role exists
        return state.role.permissions.includes(permission);
      };
    },
    hasAnyPermission: (state) => {
      return (permissions: string[]) => {
        // If role is null, no permissions
        if (!state.role) return false;
        
        // Super Admin (empty code) has all permissions
        if (state.role.code === '') return true;
        
        // Now we can safely access permissions since we know role exists
        return permissions.some(permission => 
          state.role!.permissions.includes(permission)
        );
      };
    },
    hasRole: (state) => (roleCode: string) => {
      return state.role?.code === roleCode;
    },
    landingPage: (state) => state.role?.landingPage || '/dashboard'
  },
  
  actions: {
    initialize() {
      try {
        const userData = CommonHelper.GetUserData();
        
        if (userData && userData.api_token) {
          this.setUser(userData);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error initializing auth from storage:', error);
        return false;
      }
    },
    
    setUser(userData: any) {
      // Parse permissions if it's a string
      let permissions = userData.user_role_permissions || [];
      
      if (typeof permissions === 'string') {
        try {
          permissions = JSON.parse(permissions);
        } catch (e) {
          console.error('Failed to parse permissions:', e);
          permissions = [];
        }
      }
      
      // Ensure permissions is always an array
      if (!Array.isArray(permissions)) {
        console.warn('Permissions is not an array, converting to empty array');
        permissions = [];
      }
      
      this.user = {
        id: userData.user_id,
        email: userData.email,
        name: userData.first_name ? `${userData.first_name} ${userData.last_name || ''}`.trim() : 'User',
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        role: userData.user_role_name || ''
      };
      
      this.role = {
        id: userData.user_role_id,
        name: userData.user_role_name || '',
        code: userData.user_role_code || '',
        landingPage: userData.user_role_landing_page || '/dashboard',
        permissions: permissions
      };
      
      this.token = userData.api_token;
      this.isAuthenticated = true;
      
      // Save to local storage using existing method
      CommonHelper.SetLocalStorage(CommonHelper.UserStorageName, userData, true);
    },
    
    clearUser() {
      this.user = null;
      this.role = null;
      this.token = null;
      this.isAuthenticated = false;
      // Use existing method to clear storage
      CommonHelper.ClearLocalStorage();
    },
    
    logout() {
      this.clearUser();
    },
    
    canAccess(permissions?: string[], roles?: string[]) {
      // If user is not authenticated or role is null, deny access
      if (!this.isAuthenticated || !this.role) {
        return false;
      }
      
      // Super Admin (empty code) can access everything
      if (this.role.code === '') return true;
      
      // If no permissions or roles required, allow access
      if (!permissions && !roles) return true;
      
      // Check role-based access
      if (roles && roles.length > 0) {
        if (!roles.includes(this.role.code)) {
          return false;
        }
      }
      
      // Check permission-based access
      if (permissions && permissions.length > 0) {
        // Since we already checked that this.role exists, we can safely access permissions
        const rolePermissions = this.role.permissions;
        if (!rolePermissions || !permissions.some(p => rolePermissions.includes(p))) {
          return false;
        }
      }
      
      return true;
    }
  }
});