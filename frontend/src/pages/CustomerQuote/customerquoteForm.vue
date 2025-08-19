<template>
  <q-page padding>
    <div class="text-body2 text-grey-7 q-mb-md">
      Customer Quotes / {{ pageTitle }}
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
            :loading="isSubmitting && formData.customer_quote_status === 'Accepted'"
            @click="updateCustomerQuoteStatus('Accepted')"
            :class="{ 'active-status': formData.customer_quote_status === 'Accepted' }"
          />
          <q-btn
            unelevated
            color="negative"
            label="Rejected"
            :loading="isSubmitting && formData.customer_quote_status === 'Rejected'"
            @click="updateCustomerQuoteStatus('Rejected')"
            :class="{ 'active-status': formData.customer_quote_status === 'Rejected' }"
          />
        </div>
      </div>
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-select
              outlined
              v-model="formData.quote_id"
              :options="quoteOptions"
              label="Quote"
              option-label="quote_number"
              option-value="id"
              emit-value
              map-options
              :error="!!validationErrors.quote_id"
              :error-message="validationErrors.quote_id"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Quote <span class="text-red">*</span>
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-6">
            <q-select
              outlined
              v-model="formData.order_id"
              :options="orderOptions"
              label="Order"
              option-label="order_number"
              option-value="id"
              emit-value
              map-options
              :error="!!validationErrors.order_id"
              :error-message="validationErrors.order_id"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Order <span class="text-red">*</span>
              </template>
            </q-select>
          </div>
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-select
              outlined
              v-model="formData.customer_id"
              :options="customerOptions"
              label="Customer"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              :error="!!validationErrors.customer_id"
              :error-message="validationErrors.customer_id"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Customer <span class="text-red">*</span>
              </template>
            </q-select>
          </div>

           <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model.number="formData.customer_quote_amount"
              type="number"
              step="0.01"
              label="Customer Quote Amount"
              placeholder="Enter quote amount"
              :error="!!validationErrors.customer_quote_amount"
              :error-message="validationErrors.customer_quote_amount"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Customer Quote Amount <span class="text-red">*</span>
              </template>
              <template v-slot:prepend>
                <q-icon name="currency_rupee" />
              </template>
            </q-input>
          </div>
        </div>
        <!-- Removed the customer quote status dropdown -->

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
            label="Save Customer Quote"
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
const customerQuoteId = ref<string>(String(route.params.id) || '0');
const isPageLoading = ref(false);
const isSubmitting = ref(false);
const quoteOptions = ref<any[]>([]);
const orderOptions = ref<any[]>([]);
const customerOptions = ref<any[]>([]);
// Form data interface
interface FormData {
  id: string;
  status: boolean;
  quote_id: string;
  order_id: string;
  customer_id: string;
  customer_quote_amount: number;
  customer_quote_status: string;
}
// Form data
const formData = reactive<FormData>({
  id: customerQuoteId.value,
  status: true,
  quote_id: '',
  order_id: '',
  customer_id: '',
  customer_quote_amount: 0,
  customer_quote_status: 'Sent'
});
// const customerQuoteStatusOptions = [
//   'Sent',
//   'Accepted',
//   'Rejected'
// ];
// Validation errors
const validationErrors = reactive({
  quote_id: '',
  order_id: '',
  customer_id: '',
  customer_quote_amount: '',
  customer_quote_status: ''
});
// Validation rules
const validationRules = [
  {
    field: 'quote_id',
    rules: [{ type: 'required', message: 'Quote is required' }]
  },
  {
    field: 'order_id',
    rules: [{ type: 'required', message: 'Order is required' }]
  },
  {
    field: 'customer_id',
    rules: [{ type: 'required', message: 'Customer is required' }]
  },
  {
    field: 'customer_quote_amount',
    rules: [
      { type: 'required', message: 'Customer quote amount is required' },
      { type: 'min', value: 0.01, message: 'Amount must be greater than 0' }
    ]
  },
  {
    field: 'customer_quote_status',
    rules: [{ type: 'required', message: 'Customer quote status is required' }]
  }
];
// Computed properties
const isAddMode = computed(() => customerQuoteId.value === '0');
const pageTitle = computed(() => isAddMode.value ? 'Add Customer Quote' : 'Edit Customer Quote');
// Methods
const fetchQuotes = async () => {
  try {
    const response = await CommonService.GetAll('/v1/Quote/List');
    quoteOptions.value = response.map((quote: any) => ({
      id: quote.id,
      quote_number: quote.quote_number
    }));
  } catch (error) {
    console.error('Error loading quotes:', error);
  }
};
const fetchOrders = async () => {
  try {
    const response = await CommonService.GetAll('/v1/Order/List');
    orderOptions.value = response.map((order: any) => ({
      id: order.id,
      order_number: order.order_number
    }));
  } catch (error) {
    console.error('Error loading orders:', error);
  }
};
const fetchCustomers = async () => {
  try {
    const response = await CommonService.GetAll('/v1/Customer/List');
    customerOptions.value = response.map((customer: any) => ({
      id: customer.id,
      name: customer.name
    }));
  } catch (error) {
    console.error('Error loading customers:', error);
  }
};
const loadCustomerQuoteData = async () => {
  if (!isAddMode.value) {
    try {
      isPageLoading.value = true;
      const customerQuoteData = await CommonService.GetById(customerQuoteId.value, '/v1/CustomerQuote/ById');
      Object.assign(formData, {
        ...customerQuoteData,
        id: customerQuoteId.value
      });
    } catch (error) {
      console.error('Error loading customer quote data:', error);
      CommonHelper.ErrorToaster('Failed to load customer quote data');
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
    const payload: Partial<FormData> = { ...formData };
    const response = isAddMode.value
      ? await CommonService.CommonPost(payload, '/v1/CustomerQuote/Insert')
      : await CommonService.CommonPut(payload, `/v1/CustomerQuote/Update/${customerQuoteId.value}`);
    if (response.Type === 'S') {
      CommonHelper.SuccessToaster(response.Message);
      router.push('/customer-quotes');
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
  router.push('/customer-quotes');
};
// New method to update customer quote status
const updateCustomerQuoteStatus = async (status: string) => {
  // Set the status
  formData.customer_quote_status = status;
  
  // Submit the form
  await handleSubmit();
};
// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchQuotes(),
    fetchOrders(),
    fetchCustomers()
  ]);
  await loadCustomerQuoteData();
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