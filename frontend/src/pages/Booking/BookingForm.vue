<template>
  <q-page padding>
    <div class="text-body2 text-grey-7 q-mb-md">
      Bookings / {{ pageTitle }}
    </div>
    <q-card flat bordered class="q-pa-lg">
      <div class="row justify-between items-center q-mb-lg">
        <div class="text-h6">{{ pageTitle }}</div>
        <!-- Status buttons - only show in edit mode -->
        <div v-if="!isAddMode" class="q-gutter-sm">
          <q-btn
            unelevated
            color="positive"
            label="Confirmed"
            :loading="isSubmitting && formData.booking_status === 'Confirmed'"
            @click="updateBookingStatus('Confirmed')"
            :class="{ 'active-status': formData.booking_status === 'Confirmed' }"
          />
          <q-btn
            unelevated
            color="negative"
            label="Rejected"
            :loading="isSubmitting && formData.booking_status === 'Rejected'"
            @click="updateBookingStatus('Rejected')"
            :class="{ 'active-status': formData.booking_status === 'Rejected' }"
          />
        </div>
      </div>
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-select
              outlined
              v-model="formData.order_id"
              :options="orderOptions"
              label="Order" option-label="order_number"
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
          
          <div class="col-12 col-md-6">
            <q-select
              outlined
              v-model="formData.customer_id"
              :options="customerOptions"
              label="Customer" option-label="name"
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
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-select
              outlined
              v-model="formData.vendor_id"
              :options="vendorOptions"
              label="Vendor" option-label="name"
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
          <div class="col-12 col-md-6">
            <q-select
              outlined
              v-model="formData.quote_id"
              :options="quoteOptions"
              label="Quote" option-label="quote_number"
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
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model.number="formData.amount"
              type="number"
              step="0.01"
              label="Amount"
              placeholder="Enter amount"
              :error="!!validationErrors.amount"
              :error-message="validationErrors.amount"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Amount <span class="text-red">*</span>
              </template>
              <template v-slot:prepend>
                <q-icon name="currency_rupee" />
              </template>
            </q-input>
          </div>

           <div class="col-12 col-md-6">
            <q-select
              outlined
              clearable
              v-model="formData.driver_id"
              :options="driverOptions"
              label="Driver (Optional)"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              :error="!!validationErrors.driver_id"
              :error-message="validationErrors.driver_id"
              :disable="isSubmitting"
            />
          </div>
          <!-- Removed the booking status dropdown -->
          <div class="col-12 col-md-6">
            <!-- Empty column to maintain layout -->
          </div>
        </div>
        <div class="row q-col-gutter-md">
         
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="formData.vehicle_number"
              label="Vehicle Number (Optional)"
              placeholder="Enter vehicle number"
              :error="!!validationErrors.vehicle_number"
              :error-message="validationErrors.vehicle_number"
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
            label="Save Booking"
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
const bookingId = ref<string>(String(route.params.id) || '0');
const isPageLoading = ref(false);
const isSubmitting = ref(false);
const orderOptions = ref<any[]>([]);
const customerOptions = ref<any[]>([]);
const vendorOptions = ref<any[]>([]);
const quoteOptions = ref<any[]>([]);
const driverOptions = ref<any[]>([]);
// Form data interface
interface FormData {
  id: string;
  status: boolean;
  order_id: string;
  customer_id: string;
  vendor_id: string;
  quote_id: string;
  amount: number;
  booking_status: string;
  driver_id: string | null;
  vehicle_number: string | null;
}
// Form data
const formData = reactive<FormData>({
  id: bookingId.value,
  status: true,
  order_id: '',
  customer_id: '',
  vendor_id: '',
  quote_id: '',
  amount: 0,
  booking_status: 'Created',
  driver_id: null,
  vehicle_number: null
});
// const bookingStatusOptions = [
//   'Created',
//   'Confirmed',
//   'Rejected',
// ];
// Validation errors
const validationErrors = reactive({
  order_id: '',
  customer_id: '',
  vendor_id: '',
  quote_id: '',
  amount: '',
  booking_status: '',
  driver_id: '',
  vehicle_number: ''
});
// Validation rules
const validationRules = [
  {
    field: 'order_id',
    rules: [{ type: 'required', message: 'Order is required' }]
  },
  {
    field: 'customer_id',
    rules: [{ type: 'required', message: 'Customer is required' }]
  },
  {
    field: 'vendor_id',
    rules: [{ type: 'required', message: 'Vendor is required' }]
  },
  {
    field: 'quote_id',
    rules: [{ type: 'required', message: 'Quote is required' }]
  },
  {
    field: 'amount',
    rules: [
      { type: 'required', message: 'Amount is required' },
      { type: 'min', value: 0.01, message: 'Amount must be greater than 0' }
    ]
  },
  {
    field: 'booking_status',
    rules: [{ type: 'required', message: 'Booking status is required' }]
  }
];
// Computed properties
const isAddMode = computed(() => bookingId.value === '0');
const pageTitle = computed(() => isAddMode.value ? 'Add Booking' : 'Edit Booking');
// Methods
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
const fetchDrivers = async () => {
  try {
    const response = await CommonService.GetAll('/v1/Driver/List');
    driverOptions.value = response.map((driver: any) => ({
      id: driver.id,
      name: driver.name
    }));
  } catch (error) {
    console.error('Error loading drivers:', error);
  }
};
const loadBookingData = async () => {
  if (!isAddMode.value) {
    try {
      isPageLoading.value = true;
      const bookingData = await CommonService.GetById(bookingId.value, '/v1/Booking/ById');
      Object.assign(formData, {
        ...bookingData,
        id: bookingId.value
      });
    } catch (error) {
      console.error('Error loading booking data:', error);
      CommonHelper.ErrorToaster('Failed to load booking data');
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
    
    // Ensure empty strings are sent as null for optional fields
    if (payload.driver_id === '') payload.driver_id = null;
    if (payload.vehicle_number === '') payload.vehicle_number = null;
    
    const response = isAddMode.value
      ? await CommonService.CommonPost(payload, '/v1/Booking/Insert')
      : await CommonService.CommonPut(payload, `/v1/Booking/Update/${bookingId.value}`);
    if (response.Type === 'S') {
      CommonHelper.SuccessToaster(response.Message);
      router.push('/bookings');
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
  router.push('/bookings');
};
// New method to update booking status
const updateBookingStatus = async (status: string) => {
  // Set the status
  formData.booking_status = status;
  
  // Submit the form
  await handleSubmit();
};
// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchOrders(),
    fetchCustomers(),
    fetchVendors(),
    fetchQuotes(),
    fetchDrivers()
  ]);
  await loadBookingData();
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