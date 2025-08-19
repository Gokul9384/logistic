<!-- src/pages/Admin/User_Role/UserRoleForm.vue -->
<template>
  <q-page padding>
    <!-- Breadcrumb -->
    <div class="text-body2 text-grey-7 q-mb-md">
      User Roles / {{ pageTitle }}
    </div>

    <!-- Main Card -->
    <q-card flat bordered class="q-pa-lg">
      <div class="text-h6 q-mb-lg">{{ pageTitle }}</div>
      
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <!-- First Row: Role Name, Role Code -->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="formData.name"
              label="Role Name"
              placeholder="Enter Role Name"
              :error="!!validationErrors.name"
              :error-message="validationErrors.name"
              class="required-field"
            >
              <template v-slot:label>
                Role Name <span class="text-red">*</span>
              </template>
            </q-input>
          </div>
          
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="formData.code"
              label="Role Code"
              placeholder="Enter Role Code"
              :error="!!validationErrors.code"
              :error-message="validationErrors.code"
              class="required-field"
            >
              <template v-slot:label>
                Role Code <span class="text-red">*</span>
              </template>
            </q-input>
          </div>
        </div>

        <!-- Second Row: Landing Page, Status -->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="formData.landing_page"
              label="Landing Page"
              placeholder="e.g., /admin/dashboard"
              :error="!!validationErrors.landing_page"
              :error-message="validationErrors.landing_page"
              class="required-field"
            >
              <template v-slot:label>
                Landing Page <span class="text-red">*</span>
              </template>
            </q-input>
          </div>
          

        </div>

        <!-- Permissions Section -->
        <div class="q-mt-md">
          <div class="text-subtitle1 q-mb-sm">Permissions</div>
          <div class="row q-gutter-sm">
            <q-checkbox
              v-model="formData.permissions"
              val="admin_dashboard"
              label="Admin Dashboard"
              color="primary"
            />
            <q-checkbox
              v-model="formData.permissions"
              val="vendor_dashboard"
              label="Vendor Dashboard"
              color="primary"
            />
            <q-checkbox
              v-model="formData.permissions"
              val="customer_dashboard"
              label="Customer Dashboard"
              color="primary"
            />
            <q-checkbox
              v-model="formData.permissions"
              val="driver_dashboard"
              label="Driver Dashboard"
              color="primary"
            />
            <q-checkbox
              v-model="formData.permissions"
              val="users"
              label="Users"
              color="primary"
            />
            <q-checkbox
              v-model="formData.permissions"
              val="user_roles"
              label="User Roles"
              color="primary"
            />
            <q-checkbox
              v-model="formData.permissions"
              val="customers"
              label="Customers"
              color="primary"
            />
            <q-checkbox
              v-model="formData.permissions"
              val="vendors"
              label="Vendors"
              color="primary"
            />
            <q-checkbox
              v-model="formData.permissions"
              val="vehicle_type"
              label="Vehicle Type"
              color="primary"
            />
            <q-checkbox
              v-model="formData.permissions"
              val="service_area"
              label="Service Area"
              color="primary"
            />
            <q-checkbox
              v-model="formData.permissions"
              val="drivers"
              label="Drivers"
              color="primary"
            />
            <q-checkbox
              v-model="formData.permissions"
              val="orders"
              label="Orders"
              color="primary"
            />
            <q-checkbox
              v-model="formData.permissions"
              val="requirements"
              label="Requirements"
              color="primary"
            />
            <q-checkbox
              v-model="formData.permissions"
              val="quotes"
              label="Quotes"
              color="primary"
            />
            <q-checkbox
              v-model="formData.permissions"
              val="customer_quotes"
              label="Customer Quotes"
              color="primary"
            />
            <q-checkbox
              v-model="formData.permissions"
              val="bookings"
              label="Bookings"
              color="primary"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="row justify-end q-mt-xl q-gutter-sm">
          <q-btn
            flat
            color="grey-8"
            icon="close"
            label="Cancel"
            @click="handleCancel"
            :disable="isSubmitting"
          />
          <q-btn
            unelevated
            color="primary"
            icon="save"
            label="Save Role"
            type="submit"
            :loading="isSubmitting"
          />
        </div>
      </q-form>
    </q-card>

    <!-- Loading Overlay -->
    <q-inner-loading :showing="isLoading">
      <q-spinner
        color="primary"
        size="3em"
        :thickness="5"
      />
    </q-inner-loading>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CommonService } from '@/services/CommonService';
import { CommonHelper } from '@/helpers/CommonHelper';

// Router setup
const route = useRoute();
const router = useRouter();

// Component state
const roleId = ref<string>(String(route.params.id) || '0');
const isLoading = ref(false);
const isSubmitting = ref(false);

// Form data interface
interface FormData {
  id?: string;
  name: string;
  code: string;
  landing_page: string;
  status: number;
  permissions: string[];
}

// Form data
const formData = reactive<FormData>({
  id: roleId.value,
  name: '',
  code: '',
  landing_page: '',
  status: 1, // Default to active
  permissions: []
});

// Validation errors
const validationErrors = reactive({
  name: '',
  code: '',
  landing_page: ''
});

// Validation rules
const validationRules = [
  {
    field: 'name',
    rules: [{ type: 'required', message: 'Role Name is required' }]
  },
  {
    field: 'code',
    rules: [{ type: 'required', message: 'Role Code is required' }]
  },
  {
    field: 'landing_page',
    rules: [{ type: 'required', message: 'Landing Page is required' }]
  }
];

// Computed properties
const isAddMode = computed(() => {
  return roleId.value === '0' || roleId.value === '' || !roleId.value;
});

const pageTitle = computed(() => isAddMode.value ? 'Add Role' : 'Edit Role');

// Methods
const loadRoleData = async () => {
  if (!isAddMode.value) {
    try {
      isLoading.value = true;
      const roleData = await CommonService.GetById(roleId.value, '/v1/UserRole/ById');
      
      if (roleData) {
        // Ensure permissions is an array
        let permissions = roleData.permissions || [];
        if (typeof permissions === 'string') {
          try {
            permissions = JSON.parse(permissions);
          } catch (e) {
            console.error('Failed to parse permissions:', e);
            permissions = [];
          }
        }
        
        Object.assign(formData, {
          ...roleData,
          id: roleId.value,
          permissions: permissions
        });
      }
    } catch (error) {
      console.error('Error loading role data:', error);
      CommonHelper.ErrorToaster('Failed to load role data');
      handleCancel();
    } finally {
      isLoading.value = false;
    }
  }
};

const clearValidationErrors = () => {
  Object.keys(validationErrors).forEach(key => {
    (validationErrors as any)[key] = '';
  });
};

const validateForm = (): boolean => {
  clearValidationErrors();
  let isValid = true;
  
  validationRules.forEach(fieldRule => {
    const { field, rules } = fieldRule;
    const value = (formData as any)[field];
    
    rules.forEach(rule => {
      if (rule.type === 'required' && (!value || value.toString().trim() === '')) {
        (validationErrors as any)[field] = rule.message;
        isValid = false;
      }
    });
  });
  
  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    CommonHelper.ErrorToaster('Please fix the validation errors before submitting.');
    return;
  }
  
  try {
    isSubmitting.value = true;
    isLoading.value = true;
    
    const payload = { ...formData };
    let response: any;
    
    if (isAddMode.value) {
      response = await CommonService.CommonPost(payload, '/v1/UserRole/Insert');
    } else {
      response = await CommonService.CommonPut(payload, `/v1/UserRole/Update/${roleId.value}`);
    }
    
    if (response.Type === 'S') {
      CommonHelper.SuccessToaster(response.Message);
      handleCancel();
    } else {
      CommonHelper.ErrorToaster(response.Message);
    }
  } catch (error) {
    console.error('Submission error:', error);
    CommonHelper.ErrorToaster('An unexpected error occurred');
  } finally {
    isSubmitting.value = false;
    isLoading.value = false;
  }
};

const handleCancel = () => {
  router.push('/user_role');
};

// Lifecycle
onMounted(() => {
  loadRoleData();
});
</script>

<style scoped>
.required-field :deep(.q-field__label) {
  font-weight: 500;
}

.text-red {
  color: #f44336;
}

.status-toggle {
  margin-top: 10px;
}

:deep(.q-card) {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

:deep(.q-btn) {
  text-transform: none;
  font-weight: 500;
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 8px;
}

:deep(.q-field--error .q-field__control) {
  border-color: #f44336;
}

:deep(.q-checkbox) {
  margin-right: 8px;
}
</style>