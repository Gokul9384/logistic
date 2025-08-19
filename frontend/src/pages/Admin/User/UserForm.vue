<template>
  <q-page padding>
    <!-- Breadcrumb -->
    <div class="text-body2 text-grey-7 q-mb-md">
      Users / {{ pageTitle }}
    </div>

    <!-- Main Card -->
    <q-card flat bordered class="q-pa-lg">
      <div class="text-h6 q-mb-lg">{{ pageTitle }}</div>

      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <!-- First Row: User Role, First Name, Last Name -->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-select
              outlined
              emit-value
              map-options
              v-model="formData.user_role_id"
              :options="userRoles"
              option-label="name"
              option-value="id"
              label="User Role"
              placeholder="Select User Role"
              :error="!!validationErrors.user_role_id"
              :error-message="validationErrors.user_role_id"
              :loading="isLoading"
              class="required-field"
            >
              <template v-slot:label>
                User Role <span class="text-red">*</span>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-4">
            <q-input
              outlined
              v-model="formData.first_name"
              label="First Name"
              placeholder="Enter First Name"
              :error="!!validationErrors.first_name"
              :error-message="validationErrors.first_name"
              class="required-field"
            >
              <template v-slot:label>
                First Name <span class="text-red">*</span>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-4">
            <q-input
              outlined
              v-model="formData.last_name"
              label="Last Name"
              placeholder="Enter Last Name"
              :error="!!validationErrors.last_name"
              :error-message="validationErrors.last_name"
              class="required-field"
            >
              <template v-slot:label>
                Last Name <span class="text-red">*</span>
              </template>
            </q-input>
          </div>
        </div>

        <!-- Second Row: Mobile, Email, Password -->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              outlined
              v-model="formData.mobile"
              label="Mobile"
              placeholder="Enter Mobile Number"
              :error="!!validationErrors.mobile"
              :error-message="validationErrors.mobile"
              class="required-field"
            >
              <template v-slot:label>
                Mobile <span class="text-red">*</span>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-4">
            <q-input
              outlined
              type="email"
              v-model="formData.email"
              label="Email"
              placeholder="Enter Email Address"
              :error="!!validationErrors.email"
              :error-message="validationErrors.email"
              class="required-field"
            >
              <template v-slot:label>
                Email <span class="text-red">*</span>
              </template>
            </q-input>
          </div>

          <!-- Password Field - Only for Add Mode -->
          <div v-if="isAddMode" class="col-12 col-md-4">
            <q-input
              outlined
              type="password"
              v-model="formData.password"
              label="Password"
              placeholder="Enter Password"
              :error="!!validationErrors.password"
              :error-message="validationErrors.password"
              class="required-field"
            >
              <template v-slot:label>
                Password <span class="text-red">*</span>
              </template>
            </q-input>
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
            label="Save User"
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

// Import your actual services
import { CommonService } from '@/services/CommonService';
import { CommonHelper } from '@/helpers/CommonHelper';

// Router and Quasar setup
const route = useRoute();
const router = useRouter();

// Component state - Fixed: Handle userId as string to avoid type comparison issues
const userId = ref<string>(String(route.params.id) || '0');
const isLoading = ref(false);
const isSubmitting = ref(false);
const userRoles = ref<{id: number, name: string}[]>([]);

// Form data interface for better type safety
interface FormData {
  id: string;
  user_role_id: number | null;
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  password?: string; // Made optional to fix delete operator issue
}

// Form data - Fixed: Make password optional in the interface
const formData = reactive<FormData>({
  id: userId.value,
  user_role_id: null,
  first_name: '',
  last_name: '',
  mobile: '',
  email: '',
  password: ''
});

// Validation errors
const validationErrors = reactive({
  user_role_id: '',
  first_name: '',
  last_name: '',
  mobile: '',
  email: '',
  password: ''
});

// Validation rules
const validationRules = [
  {
    field: 'user_role_id',
    rules: [{ type: 'required', message: 'User Role is required' }]
  },
  {
    field: 'first_name',
    rules: [{ type: 'required', message: 'First Name is required' }]
  },
  {
    field: 'last_name',
    rules: [{ type: 'required', message: 'Last Name is required' }]
  },
  {
    field: 'mobile',
    rules: [{ type: 'required', message: 'Mobile is required' }]
  },
  {
    field: 'email',
    rules: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Please enter a valid email address' }
    ]
  },
  {
    field: 'password',
    rules: [{ type: 'required', message: 'Password is required' }]
  }
];

// Computed properties - Fixed: Proper string comparison for isAddMode
const isAddMode = computed(() => {
  return userId.value === '0' || userId.value === '' || !userId.value;
});

const pageTitle = computed(() => isAddMode.value ? 'Add User' : 'Edit User');

// Methods
const loadUserRoles = async () => {
  try {
    isLoading.value = true;
    userRoles.value = await CommonService.GetAll('/v1/UserRole/List');
  } catch (error) {
    CommonHelper.ErrorToaster('Failed to load user roles');
  } finally {
    isLoading.value = false;
  }
};

const loadUserData = async () => {
  if (!isAddMode.value) {
    try {
          isLoading.value = true;

      // ✅ Correctly passing UUID string directly
      const userData = await CommonService.GetById(userId.value, '/v1/User/ById');

      Object.assign(formData, {
        ...userData,
        id: userId.value
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      CommonHelper.ErrorToaster('Failed to load user data');
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

    // Skip password validation for edit mode
    if (field === 'password' && !isAddMode.value) {
      return;
    }

    rules.forEach(rule => {
      if (rule.type === 'required' && (!value || value.toString().trim() === '')) {
        (validationErrors as any)[field] = rule.message;
        isValid = false;
      } else if (rule.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          (validationErrors as any)[field] = rule.message;
          isValid = false;
        }
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

    // Create payload with proper typing
    const payload: Partial<FormData> = { ...formData };
    
    // Fixed: Proper way to handle optional password field
    if (!isAddMode.value && (!payload.password || payload.password.trim() === '')) {
      // Remove password from payload if in edit mode and not provided
      const { password, ...payloadWithoutPassword } = payload;
      Object.assign(payload, payloadWithoutPassword);
    }

    const response = isAddMode.value
      ? await CommonService.CommonPost(payload, '/v1/User/Insert')
      : await CommonService.CommonPut(payload, `/v1/User/Update/${userId.value}`);

    if (response.Type === 'S') {
      CommonHelper.SuccessToaster(response.Message);
      router.push('/users');
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
  router.push('/users');
};

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadUserRoles(),
    loadUserData()
  ]);
});
</script>

<style scoped>
.form-section {
  margin-bottom: 16px;
}

.required-field :deep(.q-field__label) {
  font-weight: 500;
}

.text-red {
  color: #f44336;
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
</style>