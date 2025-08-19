<template>
  <q-page padding>
    <div class="text-body2 text-grey-7 q-mb-md">
      Drivers / {{ pageTitle }}
    </div>

    <q-card flat bordered class="q-pa-lg">
      <div class="text-h6 q-mb-lg">{{ pageTitle }}</div>

      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="formData.name"
              label="Driver Name"
              placeholder="Enter Full Name"
              :error="!!validationErrors.name"
              :error-message="validationErrors.name"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Name <span class="text-red">*</span>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <q-select
              outlined
              v-model="formData.vendor_id"
              :options="vendorOptions"
              label="Vendor"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              :error="!!validationErrors.vendor_id"
              :error-message="validationErrors.vendor_id"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Vendor <span class="text-red">*</span>
              </template>
            </q-select>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="formData.email"
              type="email"
              label="Email"
              placeholder="Enter Email Address"
              :error="!!validationErrors.email"
              :error-message="validationErrors.email"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Email <span class="text-red">*</span>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="formData.mobile"
              label="Mobile"
              placeholder="Enter Mobile Number"
              :error="!!validationErrors.mobile"
              :error-message="validationErrors.mobile"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Mobile <span class="text-red">*</span>
              </template>
            </q-input>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="formData.license_number"
              label="License Number"
              placeholder="Enter License Number"
              :error="!!validationErrors.license_number"
              :error-message="validationErrors.license_number"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                License No. <span class="text-red">*</span>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="formData.vehicle_number"
              label="Vehicle Number"
              placeholder="Enter Vehicle Number"
              :error="!!validationErrors.vehicle_number"
              :error-message="validationErrors.vehicle_number"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Vehicle No. <span class="text-red">*</span>
              </template>
            </q-input>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div v-if="isAddMode" class="col-12 col-md-6">
            <q-input
              outlined
              type="password"
              v-model="formData.password"
              label="Password"
              placeholder="Enter Password"
              :error="!!validationErrors.password"
              :error-message="validationErrors.password"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Password <span class="text-red">*</span>
              </template>
            </q-input>
          </div>

        </div>

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
            label="Save Driver"
            type="submit"
            :loading="isSubmitting"
          />
        </div>
      </q-form>
    </q-card>

    <q-inner-loading :showing="isPageLoading">
      <q-spinner-gears size="50px" color="primary" />
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

// Component state
const driverId = ref<string>(String(route.params.id) || '0');
const isPageLoading = ref(false);
const isSubmitting = ref(false);
const vendorOptions = ref<any[]>([]);

// Form data interface
interface FormData {
  id: string;
  status: boolean;
  vendor_id: string;
  license_number: string;
  vehicle_number: string;
  name: string;
  email: string;
  password: string;
  mobile: string;
}

// Form data
const formData = reactive<FormData>({
  id: driverId.value,
  status: true,
  vendor_id: '',
  license_number: '',
  vehicle_number: '',
  name: '',
  email: '',
  password: '',
  mobile: ''
});

// Validation errors
const validationErrors = reactive({
  name: '',
  email: '',
  mobile: '',
  vendor_id: '',
  license_number: '',
  vehicle_number: '',
  password: ''
});

// Validation rules
const validationRules = [
  {
    field: 'name',
    rules: [{ type: 'required', message: 'Name is required' }]
  },
  {
    field: 'email',
    rules: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Please enter a valid email address' }
    ]
  },
  {
    field: 'mobile',
    rules: [{ type: 'required', message: 'Mobile is required' }]
  },
  {
    field: 'vendor_id',
    rules: [{ type: 'required', message: 'Vendor is required' }]
  },
  {
    field: 'license_number',
    rules: [{ type: 'required', message: 'License number is required' }]
  },
  {
    field: 'vehicle_number',
    rules: [{ type: 'required', message: 'Vehicle number is required' }]
  },
  {
    field: 'password',
    rules: [{ type: 'required', message: 'Password is required' }]
  }
];

// Computed properties
const isAddMode = computed(() => driverId.value === '0');
const pageTitle = computed(() => isAddMode.value ? 'Add Driver' : 'Edit Driver');

// Methods
const fetchVendors = async () => {
  try {
    const response = await CommonService.GetAll('/v1/Vendor/List');
    vendorOptions.value = response.map((vendor: any) => ({
      id: vendor.id,
      name: vendor.company_name
    }));
  } catch (error) {
    console.error('Error loading vendors:', error);
  }
};

const loadDriverData = async () => {
  if (!isAddMode.value) {
    try {
      isPageLoading.value = true;
      const driverData = await CommonService.GetById(driverId.value, '/v1/Driver/ById');
      Object.assign(formData, {
        ...driverData,
        id: driverId.value,
        password: '' // Don't load password for security reasons
      });
    } catch (error) {
      console.error('Error loading driver data:', error);
      CommonHelper.ErrorToaster('Failed to load driver data');
    } finally {
      isPageLoading.value = false;
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

    if (field === 'password' && !isAddMode.value && !value) {
      return; // Skip password validation for edit mode if not provided
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

    const payload: Partial<FormData> = { ...formData };
    if (!isAddMode.value && (!payload.password || payload.password.trim() === '')) {
      delete payload.password;
    }

    const response = isAddMode.value
      ? await CommonService.CommonPost(payload, '/v1/Driver/Insert')
      : await CommonService.CommonPut(payload, `/v1/Driver/Update/${driverId.value}`);

    if (response.Type === 'S') {
      CommonHelper.SuccessToaster(response.Message);
      router.push('/drivers');
    } else {
      CommonHelper.ErrorToaster(response.Message);
    }
  } catch (error) {
    console.error('Submission error:', error);
    CommonHelper.ErrorToaster('An unexpected error occurred');
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  router.push('/drivers');
};

// Lifecycle
onMounted(async () => {
  await fetchVendors();
  await loadDriverData();
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
:deep(.q-field--disable) {
  opacity: 0.6;
}
</style>