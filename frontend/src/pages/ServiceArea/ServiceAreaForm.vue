<template>
  <q-page padding>
    <div class="text-body2 text-grey-7 q-mb-md">
      Service Areas / {{ pageTitle }}
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
              label="Service Area Name"
              placeholder="Enter service area name"
              :error="!!validationErrors.name"
              :error-message="validationErrors.name"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Service Area Name <span class="text-red">*</span>
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
            label="Save Service Area"
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
const serviceAreaId = ref<string>(String(route.params.id) || '0');
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
  id: serviceAreaId.value,
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
  { field: 'name', rules: [{ type: 'required', message: 'Service area name is required' }] },
];

const isAddMode = computed(() => serviceAreaId.value === '0');
const pageTitle = computed(() => isAddMode.value ? 'Add Service Area' : 'Edit Service Area');

const loadServiceAreaData = async () => {
  if (!isAddMode.value) {
    try {
      isPageLoading.value = true;
      const serviceAreaData = await CommonService.GetById(serviceAreaId.value, '/v1/ServiceArea/ById');
      Object.assign(formData, { ...serviceAreaData, id: serviceAreaId.value });
    } catch (error) {
      console.error('Error loading service area data:', error);
      CommonHelper.ErrorToaster('Failed to load service area data');
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
      ? await CommonService.CommonPost(payload, '/v1/ServiceArea/Insert')
      : await CommonService.CommonPut(payload, `/v1/ServiceArea/Update/${serviceAreaId.value}`);

    if (response.Type === 'S') {
      CommonHelper.SuccessToaster(response.Message);
      router.push('/service_area');
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
  router.push('/service_area');
};

onMounted(async () => {
  await loadServiceAreaData();
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