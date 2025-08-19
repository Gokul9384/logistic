<template>
  <q-page padding>
    <div class="text-body2 text-grey-7 q-mb-md">
      Quotes / {{ pageTitle }}
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
            :loading="isSubmitting && formData.quote_status === 'Accepted'"
            @click="updateQuoteStatus('Accepted')"
            :class="{ 'active-status': formData.quote_status === 'Accepted' }"
          />
          <q-btn
            unelevated
            color="negative"
            label="Rejected"
            :loading="isSubmitting && formData.quote_status === 'Rejected'"
            @click="updateQuoteStatus('Rejected')"
            :class="{ 'active-status': formData.quote_status === 'Rejected' }"
          />
        </div>
      </div>
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-select
              outlined
              v-model="formData.requirement_id"
              :options="requirementOptions"
              label="Requirement"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              :error="!!validationErrors.requirement_id"
              :error-message="validationErrors.requirement_id"
              class="required-field"
              :disable="isSubmitting"
              :loading="loadingDropdowns"
            >
              <template v-slot:label>
                Requirement <span class="text-red">*</span>
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model.number="formData.quote_amount"
              type="number"
              step="0.01"
              min="0.01"
              label="Quote Amount"
              placeholder="Enter quote amount"
              :error="!!validationErrors.quote_amount"
              :error-message="validationErrors.quote_amount"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Quote Amount <span class="text-red">*</span>
              </template>
              <template v-slot:prepend>
                <q-icon name="currency_rupee" />
              </template>
            </q-input>
          </div>
        </div>
        <!-- Removed the quote status dropdown -->
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
            label="Save Quote"
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
const quoteId = ref<string>(String(route.params.id) || '0');
const isPageLoading = ref(false);
const isSubmitting = ref(false);
const loadingDropdowns = ref(false);
const requirementOptions = ref<any[]>([]);
// Form data interface
interface FormData {
  id?: string;
  status: boolean;
  requirement_id: string;
  quote_amount: number | null;
  quote_status: string;
}
// Form data
const formData = reactive<FormData>({
  id: quoteId.value,
  status: true,
  requirement_id: '',
  quote_amount: null,
  quote_status: 'Sent'
});
// const quoteStatusOptions = [
//   'Sent',
//   'Accepted',
//   'Rejected'
// ];
// Validation errors
const validationErrors = reactive({
  requirement_id: '',
  quote_amount: '',
  quote_status: ''
});
// Validation rules
const validationRules = [
  {
    field: 'requirement_id',
    rules: [{ type: 'required', message: 'Requirement is required' }]
  },
  {
    field: 'quote_amount',
    rules: [
      { type: 'required', message: 'Quote amount is required' },
      { type: 'min', value: 0.01, message: 'Amount must be greater than 0' }
    ]
  },
  {
    field: 'quote_status',
    rules: [{ type: 'required', message: 'Quote status is required' }]
  }
];
// Computed properties
const isAddMode = computed(() => quoteId.value === '0');
const pageTitle = computed(() => isAddMode.value ? 'Add Quote' : 'Edit Quote');
// Methods
const fetchRequirementsForDropdown = async () => {
  try {
    loadingDropdowns.value = true;
    const requirements = await CommonService.GetAll('/v1/Requirement/List');
    requirementOptions.value = (requirements || []).map((r: any) => ({
      label: `${r.requirement_number} - ${r.vendor?.company_name || 'No Vendor'}`,
      value: r.id,
    }));
  } catch (error) {
    console.error('Error loading requirements:', error);
    CommonHelper.ErrorToaster('Failed to load requirements');
  } finally {
    loadingDropdowns.value = false;
  }
};
const loadQuoteData = async () => {
  if (!isAddMode.value) {
    try {
      isPageLoading.value = true;
      const quoteData = await CommonService.GetById(quoteId.value, '/v1/Quote/ById');
      Object.assign(formData, {
        ...quoteData,
        id: quoteId.value,
        quote_amount: quoteData.quote_amount || null
      });
    } catch (error) {
      console.error('Error loading quote data:', error);
      CommonHelper.ErrorToaster('Failed to load quote data');
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
      } else if (rule.type === 'min' && value !== undefined && rule.value !== undefined && value < rule.value) {
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
    const payload: Partial<FormData> = { 
      ...formData,
      quote_amount: Number(formData.quote_amount)
    };
    const response = isAddMode.value
      ? await CommonService.CommonPost(payload, '/v1/Quote/Insert')
      : await CommonService.CommonPut(payload, `/v1/Quote/Update/${quoteId.value}`);
    if (response.Type === 'S') {
      CommonHelper.SuccessToaster(response.Message);
      router.push('/quotes');
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
  router.push('/quotes');
};
// New method to update quote status
const updateQuoteStatus = async (status: string) => {
  // Set the status
  formData.quote_status = status;
  
  // Submit the form
  await handleSubmit();
};
// Lifecycle
onMounted(async () => {
  await fetchRequirementsForDropdown();
  await loadQuoteData();
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