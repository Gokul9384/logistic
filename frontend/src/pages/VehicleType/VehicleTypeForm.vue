<template>
  <q-page padding>
    <div class="text-body2 text-grey-7 q-mb-md">
      Vehicle Types / {{ pageTitle }}
    </div>

    <q-card flat bordered class="q-pa-lg">
      <div class="row items-center justify-between q-mb-lg">
        <div class="text-h6">{{ pageTitle }}</div>
        <q-chip
          v-if="!isAddMode"
          :color="formData.status ? 'positive' : 'negative'"
          text-color="white"
          class="text-body1"
          square
        >
          {{ formData.status ? 'Active' : 'Inactive' }}
        </q-chip>
      </div>

      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="formData.name"
              label="Vehicle Type Name"
              placeholder="Enter vehicle type name"
              :error="!!validationErrors.name"
              :error-message="validationErrors.name"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Vehicle Type Name <span class="text-red">*</span>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="formData.description"
              label="Description"
              placeholder="Enter description"
              :error="!!validationErrors.description"
              :error-message="validationErrors.description"
              :disable="isSubmitting"
            />
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
            label="Save Vehicle Type"
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
import { CommonService } from '@/services/CommonService';
import { CommonHelper } from '@/helpers/CommonHelper';

const route = useRoute();
const router = useRouter();
const vehicleTypeId = ref<string>(String(route.params.id) || '0');
const isPageLoading = ref(false);
const isSubmitting = ref(false);

// Form data interface
interface FormData {
  id: string;
  name: string;
  description: string;
  status: boolean;
}

// Form data initial state
const formData = reactive<FormData>({
  id: vehicleTypeId.value,
  name: '',
  description: '',
  status: true
});

// Validation errors object
const validationErrors = reactive({
  name: '',
  description: '',
  
});

// Validation rules
const validationRules = [
  { field: 'name', rules: [{ type: 'required', message: 'Vehicle type name is required' }] },
];

const isAddMode = computed(() => vehicleTypeId.value === '0');
const pageTitle = computed(() => isAddMode.value ? 'Add Vehicle Type' : 'Edit Vehicle Type');

const loadVehicleTypeData = async () => {
  if (!isAddMode.value) {
    try {
      isPageLoading.value = true;
      const vehicleTypeData = await CommonService.GetById(vehicleTypeId.value, '/v1/VehicleType/ById');
      Object.assign(formData, { ...vehicleTypeData, id: vehicleTypeId.value });
    } catch (error) {
      console.error('Error loading vehicle type data:', error);
      CommonHelper.ErrorToaster('Failed to load vehicle type data');
      handleCancel();
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
    const payload: Partial<FormData> = { ...formData };
    
    const response = isAddMode.value
      ? await CommonService.CommonPost(payload, '/v1/VehicleType/Insert')
      : await CommonService.CommonPut(payload, `/v1/VehicleType/Update/${vehicleTypeId.value}`);

    if (response.Type === 'S') {
      CommonHelper.SuccessToaster(response.Message);
      router.push('/vehicle_type');
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
  router.push('/vehicle_type');
};

onMounted(async () => {
  await loadVehicleTypeData();
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