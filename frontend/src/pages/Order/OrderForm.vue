<template>
  <q-page padding>
    <div class="text-body2 text-grey-7 q-mb-md">
      Orders / {{ pageTitle }}
    </div>

    <q-card flat bordered class="q-pa-lg">
      <div class="row items-center justify-between q-mb-lg">
        <div class="text-h6">{{ pageTitle }}</div>
        <q-chip
          v-if="!isAddMode"
          :color="getStatusColor(formData.order_status)"
          text-color="white"
          class="text-body1"
          square
        >
          {{ formData.order_status }}
        </q-chip>
      </div>

      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
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
              v-model="formData.material"
              label="Material"
              placeholder="Enter material"
              :error="!!validationErrors.material"
              :error-message="validationErrors.material"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Material <span class="text-red">*</span>
              </template>
            </q-input>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="formData.source_location"
              label="Source Location"
              placeholder="Enter source location"
              :error="!!validationErrors.source_location"
              :error-message="validationErrors.source_location"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Source Location <span class="text-red">*</span>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="formData.destination_location"
              label="Destination Location"
              placeholder="Enter destination location"
              :error="!!validationErrors.destination_location"
              :error-message="validationErrors.destination_location"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Destination Location <span class="text-red">*</span>
              </template>
            </q-input>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input 
              outlined 
              v-model="formData.order_date" 
              label="Order Date & Time" 
              readonly
              :disable="isSubmitting"
            />
          </div>
          
          <div class="col-12 col-md-6">
             <q-input 
              outlined 
              v-model="formData.pickup_date" 
              label="Pickup Date" 
              mask="date"
              :disable="isSubmitting"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="formData.pickup_date">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div><br></br>

        <div class="row q-col-gutter-md">
           <div class="col-12 col-md-6">
            <q-input 
              outlined 
              v-model="formData.pickup_time" 
              label="Pickup Time" 
              mask="time"
              :disable="isSubmitting"
            >
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="formData.pickup_time" format24h>
                       <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model.number="formData.weight"
              type="number"
              label="Weight (kg)"
              suffix="Kg"
              placeholder="Enter weight"
              :error="!!validationErrors.weight"
              :error-message="validationErrors.weight"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Weight (kg) <span class="text-red">*</span>
              </template>
            </q-input>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-select
              outlined
              v-model="formData.priority"
              :options="priorityOptions"
              label="Priority"
              :error="!!validationErrors.priority"
              :error-message="validationErrors.priority"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Priority <span class="text-red">*</span>
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="formData.expected_date"
              label="Expected Delivery Date"
              mask="date"
              :error="!!validationErrors.expected_date"
              :error-message="validationErrors.expected_date"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Expected Date <span class="text-red">*</span>
              </template>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="formData.expected_date">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
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
            label="Save Order"
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
const orderId = ref<string>(String(route.params.id) || '0');
const isPageLoading = ref(false);
const isSubmitting = ref(false);
const customerOptions = ref<any[]>([]);

// Separate date and time refs (no longer needed for order date)
// const orderDateOnly = ref<string>('');
// const orderTimeOnly = ref<string>('');

// Form data interface with new fields
interface FormData {
  id: string;
  status: boolean;
  customer_id: string;
  material: string;
  source_location: string;
  destination_location: string;
  weight: number;
  priority: string;
  expected_date: string;
  order_status: string;
  // New Fields
  order_date: string;
  pickup_date: string;
  pickup_time: string;
}

// Form data initial state
const formData = reactive<FormData>({
  id: orderId.value,
  status: true,
  customer_id: '',
  material: '',
  source_location: '',
  destination_location: '',
  weight: 0,
  priority: 'Low',
  expected_date: '',
  order_status: 'New',
  // New Fields
  order_date: '',
  pickup_date: '',
  pickup_time: ''
});

const priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];

// Validation errors object with new fields
const validationErrors = reactive({
  customer_id: '',
  material: '',
  source_location: '',
  destination_location: '',
  weight: '',
  priority: '',
  expected_date: '',
  order_status: '',
  // New Fields
  order_date: '',
  pickup_date: '',
  pickup_time: ''
});

// Validation rules (removed order_status)
const validationRules = [
  { field: 'customer_id', rules: [{ type: 'required', message: 'Customer is required' }] },
  { field: 'material', rules: [{ type: 'required', message: 'Material is required' }] },
  { field: 'source_location', rules: [{ type: 'required', message: 'Source location is required' }] },
  { field: 'destination_location', rules: [{ type: 'required', message: 'Destination location is required' }] },
  { field: 'weight', rules: [ { type: 'required', message: 'Weight is required' }, { type: 'min', value: 0.1, message: 'Weight must be greater than 0' } ] },
  { field: 'priority', rules: [{ type: 'required', message: 'Priority is required' }] },
  { field: 'expected_date', rules: [{ type: 'required', message: 'Expected date is required' }] },
];

const isAddMode = computed(() => orderId.value === '0');
const pageTitle = computed(() => isAddMode.value ? 'Add Order' : 'Edit Order');

// Function to get the color for the status chip
const getStatusColor = (status: string) => {
  switch (status) {
    case 'New': return 'grey';
    case 'Requested': return 'orange';
    case 'Quoted': return 'blue';
    case 'Assigned': return 'purple';
    case 'Delivered': return 'green';
    case 'Cancelled': return 'red';
    default: return 'primary';
  }
};

// Update order datetime (simplified for readonly field)
// const updateOrderDateTime = () => {
//   if (orderDateOnly.value && orderTimeOnly.value) {
//     formData.order_date = `${orderDateOnly.value} ${orderTimeOnly.value}`;
//   } else if (orderDateOnly.value) {
//     formData.order_date = `${orderDateOnly.value} 00:00`;
//   }
// };

// Initialize current date/time for new orders (simplified)
const initializeOrderDateTime = () => {
  if (isAddMode.value) {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    formData.order_date = `${year}-${month}-${day} ${hours}:${minutes}`;
  }
};

// Parse existing order datetime (no longer needed for readonly field)
// const parseOrderDateTime = () => {
//   if (formData.order_date) {
//     const [date, time] = formData.order_date.split(' ');
//     orderDateOnly.value = date || '';
//     orderTimeOnly.value = time || '';
//   }
// };

const getCurrentUserId = (): string | null => {
  try {
    const userData = CommonHelper.GetUserData();
    return userData?.user_id || userData?.userId || userData?.id || null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

const fetchCustomers = async () => {
  try {
    const response: any[] = await CommonService.GetAll('/v1/Customer/List');

    customerOptions.value = response.map((customer) => ({
      id: customer.id,
      name: customer.name
    }));

    const currentUserId = getCurrentUserId();

    if (currentUserId && isAddMode.value) {
      const matchingCustomer = response.find(
        (customer) => customer.user_id?.toString() === currentUserId.toString()
      );

      if (matchingCustomer) {
        formData.customer_id = matchingCustomer.id;
        console.log('Matched customer:', matchingCustomer.name);
      }
    }
  } catch (error) {
    console.error('Error loading customers:', error);
    CommonHelper.ErrorToaster('Failed to load customers');
  }
};


const loadOrderData = async () => {
  if (!isAddMode.value) {
    try {
      isPageLoading.value = true;
      const orderData = await CommonService.GetById(orderId.value, '/v1/Order/ById');
      Object.assign(formData, { ...orderData, id: orderId.value });
    } catch (error) {
      console.error('Error loading order data:', error);
      CommonHelper.ErrorToaster('Failed to load order data');
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
      ? await CommonService.CommonPost(payload, '/v1/Order/Insert')
      : await CommonService.CommonPut(payload, `/v1/Order/Update/${orderId.value}`);
    if (response.Type === 'S') {
      CommonHelper.SuccessToaster(response.Message);
      router.push('/orders');
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
  router.push('/orders');
};

onMounted(async () => {
  initializeOrderDateTime();
  await fetchCustomers();
  await loadOrderData();
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