<template>
  <q-page padding>
    <div class="text-body2 text-grey-7 q-mb-md">
      Vendors / {{ pageTitle }}
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
        <!-- Basic Information Section -->
        <div class="section-header">
          <q-icon name="business" class="q-mr-sm" />
          <span class="text-h6">Basic Information</span>
        </div>
        
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              outlined
              v-model="formData.company_name"
              label="Company Name"
              placeholder="Enter Company Name"
              :error="!!validationErrors.company_name"
              :error-message="validationErrors.company_name"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Company Name <span class="text-red">*</span>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-4">
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
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Email <span class="text-red">*</span>
              </template>
            </q-input>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              outlined
              v-model="formData.address"
              label="Address"
              placeholder="Enter Address"
              :error="!!validationErrors.address"
              :error-message="validationErrors.address"
              :disable="isSubmitting"
            />
          </div>
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
              :disable="isSubmitting"
            >
              <template v-slot:label>
                Password <span class="text-red">*</span>
              </template>
            </q-input>
          </div>
        </div>

        <!-- Legal Information Section -->
        <div class="section-header q-mt-lg">
          <q-icon name="account_balance" class="q-mr-sm" />
          <span class="text-h6">Legal Information</span>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              outlined
              v-model="formData.gst_number"
              label="GST Number"
              placeholder="Enter GST Number"
              :error="!!validationErrors.gst_number"
              :error-message="validationErrors.gst_number"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                GST Number <span class="text-red">*</span>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-4">
            <q-input
              outlined
              v-model="formData.pan_number"
              label="PAN Number"
              placeholder="Enter PAN Number"
              :error="!!validationErrors.pan_number"
              :error-message="validationErrors.pan_number"
              class="required-field"
              :disable="isSubmitting"
            >
              <template v-slot:label>
                PAN Number <span class="text-red">*</span>
              </template>
            </q-input>
          </div>
        </div>

        <!-- Vehicle Information Section -->
        <div class="section-header q-mt-lg">
          <q-icon name="local_shipping" class="q-mr-sm" />
          <span class="text-h6">Vehicle Information</span>
          <q-space />
          <q-btn
            flat
            color="primary"
            icon="add"
            label="Add Vehicle"
            @click="addVehicle"
            :disable="isSubmitting"
            size="sm"
          />
        </div>

        <div v-if="formData.vendor_vehicle_list.length === 0" class="text-center q-pa-lg text-grey-6">
          <q-icon name="local_shipping" size="3em" class="q-mb-sm" />
          <div>No vehicles added yet</div>
          <div class="text-caption">Click "Add Vehicle" to get started</div>
        </div>

        <div v-for="(vehicle, index) in formData.vendor_vehicle_list" :key="index" class="vehicle-card q-mb-md">
          <q-card flat bordered class="q-pa-md">
            <div class="row items-center q-mb-md">
              <q-icon name="local_shipping" class="q-mr-sm" />
              <span class="text-subtitle1">Vehicle {{ index + 1 }}</span>
              <q-space />
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="negative"
                size="sm"
                @click="removeVehicle(index)"
                :disable="isSubmitting"
              >
                <q-tooltip>Remove Vehicle</q-tooltip>
              </q-btn>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-select
                  outlined
                  v-model="vehicle.vehicle_type_id"
                  :options="vehicleTypeOptions"
                  label="Vehicle Type"
                  option-label="name"
                  option-value="id"
                  emit-value
                  map-options
                  :error="!!validationErrors[`vehicle_${index}_type`]"
                  :error-message="validationErrors[`vehicle_${index}_type`]"
                  class="required-field"
                  :disable="isSubmitting"
                  @update:model-value="(value) => updateVehicleCapacityLimits(index, value)"
                >
                  <template v-slot:label>
                    Vehicle Type <span class="text-red">*</span>
                  </template>
                </q-select>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  outlined
                  type="number"
                  v-model.number="vehicle.min_capacity"
                  label="Min Capacity (Kg)"
                  placeholder="Enter minimum capacity"
                  suffix="Kg"
                  :error="!!validationErrors[`vehicle_${index}_min_capacity`]"
                  :error-message="validationErrors[`vehicle_${index}_min_capacity`]"
                  class="required-field"
                  :disable="isSubmitting"
                  :hint="getCapacityHint(index, 'min')"
                >
                  <template v-slot:label>
                    Min Capacity <span class="text-red">*</span>
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  outlined
                  type="number"
                  v-model.number="vehicle.max_capacity"
                  label="Max Capacity (Kg)"
                  placeholder="Enter maximum capacity"
                  suffix="Kg"
                  :error="!!validationErrors[`vehicle_${index}_max_capacity`]"
                  :error-message="validationErrors[`vehicle_${index}_max_capacity`]"
                  class="required-field"
                  :disable="isSubmitting"
                  :hint="getCapacityHint(index, 'max')"
                >
                  <template v-slot:label>
                    Max Capacity <span class="text-red">*</span>
                  </template>
                </q-input>
              </div>
            </div>
          </q-card>
        </div>

        <!-- Service Area Information Section -->
        <div class="section-header q-mt-lg">
          <q-icon name="location_on" class="q-mr-sm" />
          <span class="text-h6">Service Area Information</span>
          <q-space />
          <q-btn
            flat
            color="primary"
            icon="add"
            label="Add Service Area"
            @click="addServiceArea"
            :disable="isSubmitting"
            size="sm"
          />
        </div>

        <div v-if="formData.vendor_service_area_list.length === 0" class="text-center q-pa-lg text-grey-6">
          <q-icon name="location_on" size="3em" class="q-mb-sm" />
          <div>No service areas added yet</div>
          <div class="text-caption">Click "Add Service Area" to get started</div>
        </div>

        <div v-for="(serviceArea, index) in formData.vendor_service_area_list" :key="index" class="service-area-card q-mb-md">
          <q-card flat bordered class="q-pa-md">
            <div class="row items-center q-mb-md">
              <q-icon name="location_on" class="q-mr-sm" />
              <span class="text-subtitle1">Service Area {{ index + 1 }}</span>
              <q-space />
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="negative"
                size="sm"
                @click="removeServiceArea(index)"
                :disable="isSubmitting"
              >
                <q-tooltip>Remove Service Area</q-tooltip>
              </q-btn>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-select
                  outlined
                  v-model="serviceArea.service_area_id"
                  :options="serviceAreaOptions"
                  label="Service Area"
                  option-label="name"
                  option-value="id"
                  emit-value
                  map-options
                  :error="!!validationErrors[`service_area_${index}_area`]"
                  :error-message="validationErrors[`service_area_${index}_area`]"
                  class="required-field"
                  :disable="isSubmitting"
                  @update:model-value="(value) => updateServiceAreaKmLimits(index, value)"
                >
                  <template v-slot:label>
                    Service Area <span class="text-red">*</span>
                  </template>
                </q-select>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  outlined
                  type="number"
                  v-model.number="serviceArea.min_km"
                  label="Min Distance (Km)"
                  placeholder="Enter minimum distance"
                  suffix="Km"
                  :error="!!validationErrors[`service_area_${index}_min_km`]"
                  :error-message="validationErrors[`service_area_${index}_min_km`]"
                  class="required-field"
                  :disable="isSubmitting"
                  :hint="getKmHint(index, 'min')"
                >
                  <template v-slot:label>
                    Min Distance <span class="text-red">*</span>
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  outlined
                  type="number"
                  v-model.number="serviceArea.max_km"
                  label="Max Distance (Km)"
                  placeholder="Enter maximum distance"
                  suffix="Km"
                  :error="!!validationErrors[`service_area_${index}_max_km`]"
                  :error-message="validationErrors[`service_area_${index}_max_km`]"
                  class="required-field"
                  :disable="isSubmitting"
                  :hint="getKmHint(index, 'max')"
                >
                  <template v-slot:label>
                    Max Distance <span class="text-red">*</span>
                  </template>
                </q-input>
              </div>
            </div>
          </q-card>
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
            label="Save Vendor"
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

// Router setup
const route = useRoute();
const router = useRouter();

// Component state
const vendorId = ref<string>(String(route.params.id) || '0');
const isPageLoading = ref(false);
const isSubmitting = ref(false);
const vehicleTypeOptions = ref<any[]>([]);
const serviceAreaOptions = ref<any[]>([]);

// Interfaces
interface VendorVehicle {
  vehicle_type_id: string;
  min_capacity: number;
  max_capacity: number;
}

interface VendorServiceArea {
  service_area_id: string;
  min_km: number;
  max_km: number;
}

interface FormData {
  id: string;
  status: boolean;
  company_name: string;
  address: string;
  service_area: string;
  email: string;
  mobile: string;
  gst_number: string;
  pan_number: string;
  password?: string;
  vendor_vehicle_list: VendorVehicle[];
  vendor_service_area_list: VendorServiceArea[];
}

// Form data
const formData = reactive<FormData>({
  id: vendorId.value,
  status: true,
  company_name: '',
  address: '',
  service_area: '',
  email: '',
  mobile: '',
  gst_number: '',
  pan_number: '',
  password: '',
  vendor_vehicle_list: [],
  vendor_service_area_list: []
});

// Validation errors - dynamic object to handle vehicle and service area validation
const validationErrors = reactive<Record<string, string>>({
  company_name: '',
  address: '',
  service_area: '',
  email: '',
  mobile: '',
  gst_number: '',
  pan_number: '',
  password: ''
});

// Validation rules
const validationRules = [
  {
    field: 'company_name',
    rules: [{ type: 'required', message: 'Company Name is required' }]
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
    field: 'gst_number',
    rules: [{ type: 'required', message: 'GST number is required' }]
  },
  {
    field: 'pan_number',
    rules: [{ type: 'required', message: 'PAN number is required' }]
  }
];

// Computed properties
const isAddMode = computed(() => vendorId.value === '0');
const pageTitle = computed(() => isAddMode.value ? 'Add Vendor' : 'Edit Vendor');

// Methods
const fetchVehicleTypes = async () => {
  try {
    const response = await CommonService.GetAll('/v1/VehicleType/List');
    vehicleTypeOptions.value = response.map((type: any) => ({
      id: type.id,
      name: type.name,
      min_capacity: type.min_capacity,
      max_capacity: type.max_capacity
    }));
  } catch (error) {
    console.error('Error loading vehicle types:', error);
    CommonHelper.ErrorToaster('Failed to load vehicle types');
  }
};

const fetchServiceAreas = async () => {
  try {
    const response = await CommonService.GetAll('/v1/ServiceArea/List'); // Adjust endpoint as needed
    serviceAreaOptions.value = response.map((area: any) => ({
      id: area.id,
      name: area.name,
      min_km: area.min_km,
      max_km: area.max_km
    }));
  } catch (error) {
    console.error('Error loading service areas:', error);
    CommonHelper.ErrorToaster('Failed to load service areas');
  }
};

const loadVendorData = async () => {
  if (!isAddMode.value) {
    try {
      isPageLoading.value = true;
      const vendorData = await CommonService.GetById(vendorId.value, '/v1/Vendor/ById');
      
      // Ensure lists exist
      if (!vendorData.vendor_vehicle_list) {
        vendorData.vendor_vehicle_list = [];
      }
      if (!vendorData.vendor_service_area_list) {
        vendorData.vendor_service_area_list = [];
      }
      
      Object.assign(formData, {
        ...vendorData,
        id: vendorId.value,
        vendor_vehicle_list: vendorData.vendor_vehicle_list || [],
        vendor_service_area_list: vendorData.vendor_service_area_list || []
      });
    } catch (error) {
      console.error('Error loading vendor data:', error);
      CommonHelper.ErrorToaster('Failed to load vendor data');
      handleCancel();
    } finally {
      isPageLoading.value = false;
    }
  }
};

// Vehicle Methods
const addVehicle = () => {
  formData.vendor_vehicle_list.push({
    vehicle_type_id: '',
    min_capacity: 0,
    max_capacity: 0
  });
};

const removeVehicle = (index: number) => {
  formData.vendor_vehicle_list.splice(index, 1);
  
  // Clear validation errors for this vehicle
  Object.keys(validationErrors).forEach(key => {
    if (key.startsWith(`vehicle_${index}_`)) {
      delete validationErrors[key];
    }
  });
  
  // Re-index remaining vehicle validation errors
  const vehicleErrors: Record<string, string> = {};
  Object.keys(validationErrors).forEach(key => {
    const match = key.match(/^vehicle_(\d+)_(.+)$/);
    if (match) {
      const vehicleIndex = parseInt(match[1]);
      const field = match[2];
      if (vehicleIndex > index) {
        const newKey = `vehicle_${vehicleIndex - 1}_${field}`;
        vehicleErrors[newKey] = validationErrors[key];
        delete validationErrors[key];
      }
    }
  });
  
  Object.assign(validationErrors, vehicleErrors);
};

const updateVehicleCapacityLimits = (index: number, vehicleTypeId: string) => {
  const vehicleType = vehicleTypeOptions.value.find(type => type.id === vehicleTypeId);
  if (vehicleType && formData.vendor_vehicle_list[index]) {
    const vehicle = formData.vendor_vehicle_list[index];
    
    // Clear any existing validation errors for this vehicle when type changes
    Object.keys(validationErrors).forEach(key => {
      if (key.startsWith(`vehicle_${index}_`)) {
        delete validationErrors[key];
      }
    });
    
    // Only set default values if they are currently 0 or invalid
    if (!vehicle.min_capacity || vehicle.min_capacity === 0) {
      vehicle.min_capacity = vehicleType.min_capacity;
    } else {
      // If user has entered a value, validate it against new vehicle type limits
      if (vehicle.min_capacity < vehicleType.min_capacity) {
        vehicle.min_capacity = vehicleType.min_capacity;
      }
    }
    
    if (!vehicle.max_capacity || vehicle.max_capacity === 0) {
      vehicle.max_capacity = vehicleType.max_capacity;
    } else {
      // If user has entered a value, validate it against new vehicle type limits
      if (vehicle.max_capacity > vehicleType.max_capacity) {
        vehicle.max_capacity = vehicleType.max_capacity;
      }
    }
    
    // Ensure max is greater than min after adjustments
    if (vehicle.max_capacity <= vehicle.min_capacity) {
      vehicle.max_capacity = Math.max(vehicle.min_capacity + 1, vehicleType.max_capacity);
    }
  }
};

const getCapacityHint = (index: number, type: 'min' | 'max') => {
  const vehicle = formData.vendor_vehicle_list[index];
  const vehicleType = vehicleTypeOptions.value.find(vt => vt.id === vehicle.vehicle_type_id);
  
  if (vehicleType) {
    const limit = type === 'min' ? vehicleType.min_capacity : vehicleType.max_capacity;
    return `Vehicle type ${type} limit: ${limit} Kg`;
  }
  
  return '';
};

// Service Area Methods
const addServiceArea = () => {
  formData.vendor_service_area_list.push({
    service_area_id: '',
    min_km: 0,
    max_km: 0
  });
};

const removeServiceArea = (index: number) => {
  formData.vendor_service_area_list.splice(index, 1);
  
  // Clear validation errors for this service area
  Object.keys(validationErrors).forEach(key => {
    if (key.startsWith(`service_area_${index}_`)) {
      delete validationErrors[key];
    }
  });
  
  // Re-index remaining service area validation errors
  const serviceAreaErrors: Record<string, string> = {};
  Object.keys(validationErrors).forEach(key => {
    const match = key.match(/^service_area_(\d+)_(.+)$/);
    if (match) {
      const serviceAreaIndex = parseInt(match[1]);
      const field = match[2];
      if (serviceAreaIndex > index) {
        const newKey = `service_area_${serviceAreaIndex - 1}_${field}`;
        serviceAreaErrors[newKey] = validationErrors[key];
        delete validationErrors[key];
      }
    }
  });
  
  Object.assign(validationErrors, serviceAreaErrors);
};

const updateServiceAreaKmLimits = (index: number, serviceAreaId: string) => {
  const serviceArea = serviceAreaOptions.value.find(area => area.id === serviceAreaId);
  if (serviceArea && formData.vendor_service_area_list[index]) {
    const vendorServiceArea = formData.vendor_service_area_list[index];
    
    // Clear any existing validation errors for this service area when type changes
    Object.keys(validationErrors).forEach(key => {
      if (key.startsWith(`service_area_${index}_`)) {
        delete validationErrors[key];
      }
    });
    
    // Only set default values if they are currently 0 or invalid
    if (!vendorServiceArea.min_km || vendorServiceArea.min_km === 0) {
      vendorServiceArea.min_km = serviceArea.min_km;
    } else {
      // If user has entered a value, validate it against new service area limits
      if (vendorServiceArea.min_km < serviceArea.min_km) {
        vendorServiceArea.min_km = serviceArea.min_km;
      }
    }
    
    if (!vendorServiceArea.max_km || vendorServiceArea.max_km === 0) {
      vendorServiceArea.max_km = serviceArea.max_km;
    } else {
      // If user has entered a value, validate it against new service area limits
      if (vendorServiceArea.max_km > serviceArea.max_km) {
        vendorServiceArea.max_km = serviceArea.max_km;
      }
    }
    
    // Ensure max is greater than min after adjustments
    if (vendorServiceArea.max_km <= vendorServiceArea.min_km) {
      vendorServiceArea.max_km = Math.max(vendorServiceArea.min_km + 1, serviceArea.max_km);
    }
  }
};

const getKmHint = (index: number, type: 'min' | 'max') => {
  const serviceArea = formData.vendor_service_area_list[index];
  const serviceAreaType = serviceAreaOptions.value.find(sa => sa.id === serviceArea.service_area_id);
  
  if (serviceAreaType) {
    const limit = type === 'min' ? serviceAreaType.min_km : serviceAreaType.max_km;
    return `Service area ${type} limit: ${limit} Km`;
  }
  
  return '';
};

const clearValidationErrors = () => {
  Object.keys(validationErrors).forEach(key => {
    validationErrors[key] = '';
  });
};

// FIXED VALIDATION FUNCTION - Only validates min/max within same vehicle
const validateForm = (): boolean => {
  clearValidationErrors();
  let isValid = true;

  // Validate basic fields
  validationRules.forEach(fieldRule => {
    const { field, rules } = fieldRule;
    const value = (formData as any)[field];

    if (field === 'password' && !isAddMode.value) {
      return;
    }

    rules.forEach(rule => {
      if (rule.type === 'required' && (!value || value.toString().trim() === '')) {
        validationErrors[field] = rule.message;
        isValid = false;
      } else if (rule.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          validationErrors[field] = rule.message;
          isValid = false;
        }
      }
    });
  });

  // Validate password for add mode
  if (isAddMode.value) {
    if (!formData.password || formData.password.trim() === '') {
      validationErrors.password = 'Password is required';
      isValid = false;
    }
  }

  // Validate vehicles
  if (formData.vendor_vehicle_list.length === 0) {
    CommonHelper.ErrorToaster('At least one vehicle must be added');
    return false;
  }

  formData.vendor_vehicle_list.forEach((vehicle, index) => {
    // Vehicle type validation
    if (!vehicle.vehicle_type_id) {
      validationErrors[`vehicle_${index}_type`] = 'Vehicle type is required';
      isValid = false;
      return; // Skip further validation for this vehicle if type is not selected
    }

    // Get vehicle type limits
    const vehicleType = vehicleTypeOptions.value.find(vt => vt.id === vehicle.vehicle_type_id);
    
    if (!vehicleType) {
      validationErrors[`vehicle_${index}_type`] = 'Invalid vehicle type selected';
      isValid = false;
      return;
    }

    // Convert to numbers to ensure proper comparison
    const minCapacity = Number(vehicle.min_capacity);
    const maxCapacity = Number(vehicle.max_capacity);
    const vehicleTypeMin = Number(vehicleType.min_capacity);
    const vehicleTypeMax = Number(vehicleType.max_capacity);

    // Min capacity validation - check against vehicle type limits only
    if (isNaN(minCapacity) || minCapacity <= 0) {
      validationErrors[`vehicle_${index}_min_capacity`] = 'Min capacity is required and must be greater than 0';
      isValid = false;
    } else if (minCapacity < vehicleTypeMin) {
      validationErrors[`vehicle_${index}_min_capacity`] = `Min capacity cannot be less than vehicle type minimum (${vehicleTypeMin} Kg)`;
      isValid = false;
    }

    // Max capacity validation - check against vehicle type limits only
    if (isNaN(maxCapacity) || maxCapacity <= 0) {
      validationErrors[`vehicle_${index}_max_capacity`] = 'Max capacity is required and must be greater than 0';
      isValid = false;
    } else if (maxCapacity > vehicleTypeMax) {
      validationErrors[`vehicle_${index}_max_capacity`] = `Max capacity cannot exceed vehicle type maximum (${vehicleTypeMax} Kg)`;
      isValid = false;
    }

    // FIXED: Cross-field validation - ONLY within the same vehicle
    // Only check if both values are valid positive numbers
    if (!isNaN(minCapacity) && !isNaN(maxCapacity) && 
        minCapacity > 0 && maxCapacity > 0 && 
        minCapacity >= maxCapacity) {
      validationErrors[`vehicle_${index}_min_capacity`] = 'Min capacity must be less than max capacity';
      isValid = false;
    }
  });

  // Validate service areas
  if (formData.vendor_service_area_list.length === 0) {
    CommonHelper.ErrorToaster('At least one service area must be added');
    return false;
  }

  formData.vendor_service_area_list.forEach((serviceArea, index) => {
    // Service area validation
    if (!serviceArea.service_area_id) {
      validationErrors[`service_area_${index}_area`] = 'Service area is required';
      isValid = false;
      return; // Skip further validation for this service area if area is not selected
    }

    // Get service area limits
    const serviceAreaType = serviceAreaOptions.value.find(sa => sa.id === serviceArea.service_area_id);
    
    if (!serviceAreaType) {
      validationErrors[`service_area_${index}_area`] = 'Invalid service area selected';
      isValid = false;
      return;
    }

    // Convert to numbers to ensure proper comparison
    const minKm = Number(serviceArea.min_km);
    const maxKm = Number(serviceArea.max_km);
    const serviceAreaTypeMin = Number(serviceAreaType.min_km);
    const serviceAreaTypeMax = Number(serviceAreaType.max_km);

    // Min km validation - check against service area type limits only
    if (isNaN(minKm) || minKm <= 0) {
      validationErrors[`service_area_${index}_min_km`] = 'Min distance is required and must be greater than 0';
      isValid = false;
    } else if (minKm < serviceAreaTypeMin) {
      validationErrors[`service_area_${index}_min_km`] = `Min distance cannot be less than service area minimum (${serviceAreaTypeMin} Km)`;
      isValid = false;
    }

    // Max km validation - check against service area type limits only
    if (isNaN(maxKm) || maxKm <= 0) {
      validationErrors[`service_area_${index}_max_km`] = 'Max distance is required and must be greater than 0';
      isValid = false;
    } else if (maxKm > serviceAreaTypeMax) {
      validationErrors[`service_area_${index}_max_km`] = `Max distance cannot exceed service area maximum (${serviceAreaTypeMax} Km)`;
      isValid = false;
    }

    // FIXED: Cross-field validation - ONLY within the same service area
    // Only check if both values are valid positive numbers
    if (!isNaN(minKm) && !isNaN(maxKm) && 
        minKm > 0 && maxKm > 0 && 
        minKm >= maxKm) {
      validationErrors[`service_area_${index}_min_km`] = 'Min distance must be less than max distance';
      isValid = false;
    }
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
    
    // Remove password from payload if in edit mode and password is empty
    if (!isAddMode.value && (!payload.password || payload.password.trim() === '')) {
      delete payload.password;
    }

    const response = isAddMode.value
      ? await CommonService.CommonPost(payload, '/v1/Vendor/Insert')
      : await CommonService.CommonPut(payload, `/v1/Vendor/Update/${vendorId.value}`);

    if (response.Type === 'S') {
      CommonHelper.SuccessToaster(response.Message);
      router.push('/vendors');
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
  router.push('/vendors');
};

// Lifecycle
onMounted(async () => {
  await fetchVehicleTypes();
  await fetchServiceAreas();
  await loadVendorData();
});
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.vehicle-card,
.service-area-card {
  transition: all 0.3s ease;
}

.vehicle-card:hover,
.service-area-card:hover {
  transform: translateY(-1px);
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

:deep(.q-field--with-bottom) {
  padding-bottom: 20px;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
}
</style>