// src/directives/permission.ts
import type { Directive, DirectiveBinding } from 'vue';
import { useAuthStore } from '@/stores/auth';

// Extract permission checking logic into a separate function
function checkPermission(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
  const authStore = useAuthStore();
  const { value } = binding;
  
  if (!value) return;
  
  let hasPermission = false;
  
  if (Array.isArray(value)) {
    hasPermission = value.some(permission => authStore.hasPermission(permission));
  } else {
    hasPermission = authStore.hasPermission(value);
  }
  
  if (!hasPermission) {
    el.style.display = 'none';
    el.setAttribute('data-permission-hidden', 'true');
  } else {
    el.style.display = '';
    el.removeAttribute('data-permission-hidden');
  }
}

// Extract role checking logic into a separate function
function checkRole(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
  const authStore = useAuthStore();
  const { value } = binding;
  
  if (!value) return;
  
  let hasRole = false;
  
  if (Array.isArray(value)) {
    hasRole = value.some(role => authStore.hasRole(role));
  } else {
    hasRole = authStore.hasRole(value);
  }
  
  if (!hasRole) {
    el.style.display = 'none';
    el.setAttribute('data-role-hidden', 'true');
  } else {
    el.style.display = '';
    el.removeAttribute('data-role-hidden');
  }
}

export const permission: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    checkPermission(el, binding);
  },
  
  updated(el, binding) {
    checkPermission(el, binding);
  }
};

export const role: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    checkRole(el, binding);
  },
  
  updated(el, binding) {
    checkRole(el, binding);
  }
};