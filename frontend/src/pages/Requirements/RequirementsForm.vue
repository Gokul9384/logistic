<template>
  <q-page padding>
    <div class="text-body2 text-grey-7 q-mb-md">
      Requirements / {{ pageTitle }}
    </div>
    <q-card flat bordered class="q-pa-lg">
        <div class="row justify-between items-center q-mb-lg">
          <div class="text-h6">{{ pageTitle }}</div>
          <!-- Status buttons - only show in edit mode -->
          <div v-if="!isAddMode" class="q-gutter-sm">
            <q-btn
              unelevated
              color="positive"
              label="Accepted"
              :loading="isSubmitting && formData.requirement_status === 'Accepted'"
              @click="updateStatus('Accepted')"
              :class="{ 'active-status': formData.requirement_status === 'Accepted' }"
            />
            <q-btn
              unelevated
              color="negative"
              label="Rejected"
              :loading="isSubmitting && formData.requirement_status === 'Rejected'"
              @click="updateStatus('Rejected')"
              :class="{ 'active-status': formData.requirement_status === 'Rejected' }"
            />
          </div>
        </div>
      <!-- Rest of your form remains the same -->
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-select
              outlined
              v-model="formData.order_id"
              :options="orderOptions"
              label="Order"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              :error="!!validationErrors.order_id"
              :error-message="validationErrors.order_id"
              class="required-field"
              :disable="isSubmitting"
              :loading="loadingDropdowns"
            >
              <template v-slot:label>
                Order <span class="text-red">*</span>
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-6">
            <q-select
              outlined
              v-model="formData.vendor_id"
              :options="vendorOptions"
              label="Vendor"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              :error="!!validationErrors.vendor_id"
              :error-message="validationErrors.vendor_id"
              class="required-field"
              :disable="isSubmitting"
              :loading="loadingDropdowns"
            >
              <template v-slot:label>
                Vendor <span class="text-red">*</span>
              </template>
            </q-select>
          </div>
        </div>
        <div class="row q-col-gutter-md">

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
            label="Save Requirement"
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
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// Import your actual services
import { CommonService } from '@/services/CommonService';
import { CommonHelper } from '@/helpers/CommonHelper';
// Router and Quasar setup
const route = useRoute();
const router = useRouter();
// Component state
const requirementId = ref<string>(String(route.params.id) || '0');
const isPageLoading = ref(false);
const isSubmitting = ref(false);
const loadingDropdowns = ref(false);
const vendorOptions = ref<{ label: string, value: string }[]>([]);
const orderOptions = ref<{ label: string, value: string }[]>([]);
const requirementData = ref<any>(null);
// Form data interface
interface FormData {
  id?: string;
  status: boolean;
  order_id: string;
  vendor_id: string;
  requirement_status: string;
}
// Form data
const formData = reactive<FormData>({
  id: requirementId.value,
  status: true,
  order_id: '',
  vendor_id: '',
  requirement_status: 'Sent'
});
// const requirementStatusOptions = [
//   'Sent',
//   'Accepted',
//   'Rejected'
// ];
// Validation errors
const validationErrors = reactive({
  order_id: '',
  vendor_id: '',
  requirement_status: ''
});
// Validation rules
const validationRules = [
  {
    field: 'order_id',
    rules: [{ type: 'required', message: 'Order is required' }]
  },
  {
    field: 'vendor_id',
    rules: [{ type: 'required', message: 'Vendor is required' }]
  },
  {
    field: 'requirement_status',
    rules: [{ type: 'required', message: 'Requirement status is required' }]
  }
];
// Computed properties
const isAddMode = computed(() => requirementId.value === '0');
const pageTitle = computed(() => isAddMode.value ? 'Add Requirement' : 'Edit Requirement');
// Methods
const fetchDropdownData = async () => {
  try {
    loadingDropdowns.value = true;
    const [vendors, orders] = await Promise.all([
      CommonService.GetAll('/v1/Vendor/List'),
      CommonService.GetAll('/v1/Order/List')
    ]);
    
    vendorOptions.value = vendors.map((v: any) => ({ 
      label: v.company_name, 
      value: v.id 
    }));
    
    orderOptions.value = orders.map((o: any) => ({ 
      label: o.order_number, 
      value: o.id 
    }));
  } catch (error) {
    console.error('Error loading dropdown data:', error);
    CommonHelper.ErrorToaster('Failed to load selection data');
  } finally {
    loadingDropdowns.value = false;
  }
};
const loadRequirementData = async () => {
  if (!isAddMode.value) {
    try {
      isPageLoading.value = true;
      // First load the dropdown data
      await fetchDropdownData();
      
      // Then load the requirement data
      const data = await CommonService.GetById(requirementId.value, '/v1/Requirement/ById');
      requirementData.value = data;
      
      // Wait for the next tick to ensure dropdowns are rendered
      await nextTick();
      
      // Now set the form data
      Object.assign(formData, {
        id: requirementId.value,
        status: data.status !== undefined ? data.status : true,
        order_id: data.order_id || '',
        vendor_id: data.vendor_id || '',
        requirement_status: data.requirement_status || 'Pending'
      });
      
    } catch (error) {
      console.error('Error loading requirement data:', error);
      CommonHelper.ErrorToaster('Failed to load requirement data');
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
      ? await CommonService.CommonPost(payload, '/v1/Requirement/Insert')
      : await CommonService.CommonPut(payload, `/v1/Requirement/Update/${requirementId.value}`);
    if (response.Type === 'S') {
      CommonHelper.SuccessToaster(response.Message);
      router.push('/requirements');
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
  router.push('/requirements');
};
// New method to update status
const updateStatus = async (status: string) => {
  // Set the status
  formData.requirement_status = status;
  
  // Submit the form
  await handleSubmit();
};
// Lifecycle
onMounted(async () => {
  if (isAddMode.value) {
    await fetchDropdownData();
  } else {
    await loadRequirementData();
  }
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
/* New styles for active status button */
.active-status {
  border: 2px solid currentColor;
  font-weight: bold;
}
</style>