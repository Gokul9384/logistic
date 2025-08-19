<template>
  <q-page padding>
    <div class="text-body2 text-grey-7 q-mb-md">
      Customers / {{ pageTitle }}
    </div>

    <q-card flat bordered class="q-pa-lg">
      <div class="text-h6 q-mb-lg">{{ pageTitle }}</div>

      <div class="row q-col-gutter-lg">
        <!-- Left Column - Form Fields -->
        <div class="col-12 col-lg-6">
          <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  outlined
                  v-model="formData.name"
                  label="Customer Name"
                  placeholder="Enter Full Name"
                  :error="!!validationErrors.name"
                  :error-message="validationErrors.name"
                  class="required-field"
                  :disable="isSubmitting"
                >
                  <template v-slot:label>
                    Customer Name <span class="text-red">*</span>
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

              <div class="col-12 col-md-6">
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

              <div class="col-12">
                <q-input
                  outlined
                  v-model="formData.gst_number"
                  label="GST Number"
                  placeholder="Enter GST Number"
                  :error="!!validationErrors.gst_number"
                  :error-message="validationErrors.gst_number"
                  :disable="isSubmitting"
                />
              </div>

              <!-- Map Location Field -->
              <div class="col-12">
                <q-input
                  outlined
                  v-model="formData.formatted_address"
                  label="Selected Address"
                  placeholder="Click on map to set location"
                  :error="!!validationErrors.formatted_address"
                  :error-message="validationErrors.formatted_address"
                  :disable="isSubmitting"
                  readonly
                >
                  <template v-slot:append>
                    <q-icon 
                      name="location_on" 
                      class="cursor-pointer text-primary" 
                      @click="openLocationPicker"
                    />
                  </template>
                </q-input>
              </div>

              <div v-if="isAddMode" class="col-12">
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
                label="Save Customer"
                type="submit"
                :loading="isSubmitting"
              />
            </div>
          </q-form>
        </div>

        <!-- Right Column - Google Map Interface -->
        <div class="col-12 col-lg-6">
          <div class="map-container">
            <div class="text-subtitle2 q-mb-md text-grey-8">
              <q-icon name="map" class="q-mr-sm" />
              Select Location on Google Map
            </div>
            
            <q-card flat bordered class="map-card">
              <div id="google-map" class="map-view"></div>
              
              <!-- Map Controls -->
              <div class="map-controls q-pa-md">
                <div class="row q-gutter-sm items-center">
                  <q-btn 
                    size="sm" 
                    color="primary" 
                    icon="my_location" 
                    label="Current Location"
                    @click="getCurrentLocation"
                    :loading="isGettingLocation"
                  />
                  <q-btn 
                    size="sm" 
                    color="secondary" 
                    icon="search" 
                    label="Search Place"
                    @click="showSearchDialog = true"
                  />
                  <q-space />
                  <q-btn 
                    v-if="formData.latitude && formData.longitude"
                    size="sm" 
                    color="negative" 
                    icon="clear" 
                    label="Clear"
                    @click="clearLocation"
                  />
                </div>
                
                <!-- Location Info -->
                <div v-if="formData.latitude && formData.longitude" class="q-mt-md">
                  <div class="text-caption text-grey-7">
                    <strong>Selected Location:</strong>
                  </div>
                  <div class="text-body2">
                    Lat: {{ parseFloat(formData.latitude).toFixed(6) }}, 
                    Lng: {{ parseFloat(formData.longitude).toFixed(6) }}
                  </div>
                  <div v-if="formData.formatted_address" class="text-body2 text-grey-8 q-mt-xs">
                    {{ formData.formatted_address }}
                  </div>
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </div>
    </q-card>

    <!-- Search Location Dialog -->
    <q-dialog v-model="showSearchDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Search Location</div>
          <div class="text-caption text-grey-6">
            Search using Google Places API
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            outlined
            v-model="searchLocationQuery"
            label="Search for a place"
            placeholder="Enter city, address, or landmark"
            @keyup.enter="searchLocation"
            :loading="isSearching"
          >
            <template v-slot:append>
              <q-icon name="search" class="cursor-pointer" @click="searchLocation" />
            </template>
          </q-input>

          <!-- Search Results -->
          <div v-if="searchResults.length > 0" class="q-mt-md">
            <div class="text-caption text-grey-7 q-mb-sm">Search Results:</div>
            <q-list bordered separator class="search-results-list">
              <q-item 
                v-for="result in searchResults" 
                :key="result.place_id"
                clickable 
                v-ripple
                @click="selectSearchResult(result)"
                class="search-result-item"
              >
                <q-item-section>
                  <q-item-label>{{ result.name }}</q-item-label>
                  <q-item-label caption>{{ result.formatted_address }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" color="grey-5" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- No Results Message -->
          <div v-else-if="hasSearched && !isSearching" class="q-mt-md text-center text-grey-6">
            <q-icon name="search_off" size="2em" class="q-mb-sm" />
            <div>No results found. Try a different search term.</div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup @click="clearSearch" />
          <q-btn 
            flat 
            label="Search" 
            color="primary" 
            @click="searchLocation" 
            :loading="isSearching"
            :disable="!searchLocationQuery.trim()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-inner-loading :showing="isPageLoading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, nextTick, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Import your actual services
import { CommonService } from '@/services/CommonService';
import { CommonHelper } from '@/helpers/CommonHelper';

// Google Maps TypeScript declarations
declare global {
  interface Window {
    google: any;
    initGoogleMap?: () => void;
  }
}

// Router setup
const route = useRoute();
const router = useRouter();

// Google Maps API Key - Replace with your actual API key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Component state
const customerId = ref<string>(String(route.params.id) || '0');
const isPageLoading = ref(false);
const isSubmitting = ref(false);
const isGettingLocation = ref(false);
const showSearchDialog = ref(false);
const searchLocationQuery = ref(''); // Renamed to avoid conflict
const searchResults = ref<any[]>([]);
const isSearching = ref(false);
const hasSearched = ref(false);

// Google Maps instances
const map = ref<any>(null);
const marker = ref<any>(null);
const placesService = ref<any>(null);
const geocoder = ref<any>(null);
const autocompleteService = ref<any>(null);

// Updated Form data interface to match your payload
interface FormData {
  id: string;
  name: string;
  email: string;
  mobile: string;
  gst_number: string;
  status: boolean;
  password?: string;
  latitude: string;
  longitude: string;
  formatted_address: string;
}

// Form data
const formData = reactive<FormData>({
  id: customerId.value,
  name: '',
  email: '',
  mobile: '',
  gst_number: '',
  status: true,
  password: '',
  latitude: '',
  longitude: '',
  formatted_address: ''
});

// Validation errors
const validationErrors = reactive({
  name: '',
  email: '',
  mobile: '',
  gst_number: '',
  password: '',
  latitude: '',
  longitude: '',
  formatted_address: ''
});

// Validation rules
const validationRules = [
  {
    field: 'name',
    rules: [{ type: 'required', message: 'Customer Name is required' }]
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

// Computed properties
const isAddMode = computed(() => customerId.value === '0');
const pageTitle = computed(() => isAddMode.value ? 'Add Customer' : 'Edit Customer');

// Google Maps Methods
const loadGoogleMaps = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      resolve(true);
      return;
    }

    // Set up callback
    window.initGoogleMap = () => {
      resolve(true);
    };

    // Load Google Maps API with additional libraries
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&callback=initGoogleMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
};

const initializeGoogleMap = async () => {
  await nextTick();
  
  // Default location (Coimbatore coordinates)
  const defaultLat = 10.9974;
  const defaultLng = 76.9589;

  // Check if Google Maps is loaded
  if (!window.google || !window.google.maps) {
    console.error('Google Maps not loaded');
    CommonHelper.ErrorToaster('Google Maps failed to load. Please check your API key and refresh the page.');
    return;
  }

  console.log('Google Maps API loaded successfully');
  console.log('Available services:', {
    maps: !!window.google.maps,
    places: !!window.google.maps.places,
    geometry: !!window.google.maps.geometry
  });
  
  // Initialize map
  const mapOptions = {
    center: { lat: defaultLat, lng: defaultLng },
    zoom: 13,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true,
    mapTypeId: window.google.maps.MapTypeId.ROADMAP
  };

  map.value = new window.google.maps.Map(document.getElementById('google-map'), mapOptions);

  // Initialize services with error checking
  try {
    placesService.value = new window.google.maps.places.PlacesService(map.value);
    console.log('PlacesService initialized:', !!placesService.value);
  } catch (error) {
    console.error('Error initializing PlacesService:', error);
  }

  try {
    geocoder.value = new window.google.maps.Geocoder();
    console.log('Geocoder initialized:', !!geocoder.value);
  } catch (error) {
    console.error('Error initializing Geocoder:', error);
  }

  try {
    autocompleteService.value = new window.google.maps.places.AutocompleteService();
    console.log('AutocompleteService initialized:', !!autocompleteService.value);
  } catch (error) {
    console.error('Error initializing AutocompleteService:', error);
  }

  // Add click listener to map
  map.value.addListener('click', (event: any) => {
    setLocationOnMap(event.latLng.lat(), event.latLng.lng());
  });

  console.log('Google Map initialized successfully');
};

const setLocationOnMap = async (lat: number, lng: number) => {
  // Check if Google Maps is available
  if (!window.google || !map.value) {
    console.error('Google Maps not available');
    return;
  }

  // Remove existing marker
  if (marker.value) {
    marker.value.setMap(null);
  }

  // Add new marker
  marker.value = new window.google.maps.Marker({
    position: { lat, lng },
    map: map.value,
    title: 'Selected Location',
    draggable: true
  });

  // Add drag listener to marker
  marker.value.addListener('dragend', (event: any) => {
    setLocationOnMap(event.latLng.lat(), event.latLng.lng());
  });

  // Center map on selected location
  map.value.setCenter({ lat, lng });

  // Update form data
  formData.latitude = lat.toString();
  formData.longitude = lng.toString();

  // Reverse geocoding to get address
  try {
    const request = {
      location: { lat, lng }
    };

    geocoder.value.geocode(request, (results: any[], status: string) => {
      if (status === 'OK' && results && results.length > 0) {
        const result = results[0];
        formData.formatted_address = result.formatted_address;
      } else {
        // Fallback if geocoding fails
        formData.formatted_address = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
      }
    });
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    formData.formatted_address = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
  }
};

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    CommonHelper.ErrorToaster('Geolocation is not supported by this browser.');
    return;
  }

  isGettingLocation.value = true;
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setLocationOnMap(lat, lng);
      isGettingLocation.value = false;
    },
    (error) => {
      console.error('Geolocation error:', error);
      CommonHelper.ErrorToaster('Unable to get your current location. Please select manually on the map.');
      isGettingLocation.value = false;
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
};

const searchLocation = async () => {
  if (!searchLocationQuery.value.trim()) {
    CommonHelper.ErrorToaster('Please enter a search query.');
    return;
  }

  if (!window.google || !window.google.maps) {
    CommonHelper.ErrorToaster('Google Maps is not loaded. Please refresh the page.');
    return;
  }

  isSearching.value = true;
  hasSearched.value = true;
  searchResults.value = [];

  try {
    // First try with Places Text Search (simpler and more reliable)
    if (placesService.value) {
      const request = {
        query: searchLocationQuery.value,
        fields: ['place_id', 'name', 'formatted_address', 'geometry']
      };

      placesService.value.textSearch(request, (results: any[], status: string) => {
        isSearching.value = false;
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          searchResults.value = results.slice(0, 5).map(result => ({
            place_id: result.place_id,
            name: result.name,
            formatted_address: result.formatted_address,
            geometry: result.geometry
          }));
        } else {
          // Fallback to Geocoding API if Places fails
          geocodeSearch();
        }
      });
    } else {
      // Direct fallback to Geocoding API
      geocodeSearch();
    }
  } catch (error) {
    console.error('Search error:', error);
    isSearching.value = false;
    geocodeSearch(); // Try geocoding as fallback
  }
};

// Fallback search using Geocoding API
const geocodeSearch = () => {
  if (!geocoder.value) {
    CommonHelper.ErrorToaster('Geocoding service not available.');
    isSearching.value = false;
    return;
  }

  const request = {
    address: searchLocationQuery.value,
    componentRestrictions: { country: 'IN' }
  };

  geocoder.value.geocode(request, (results: any[], status: string) => {
    isSearching.value = false;
    
    if (status === 'OK' && results && results.length > 0) {
      searchResults.value = results.slice(0, 5).map((result, index) => ({
        place_id: result.place_id || `geocode_${index}`,
        name: result.address_components?.[0]?.long_name || 'Location',
        formatted_address: result.formatted_address,
        geometry: result.geometry
      }));
    } else {
      searchResults.value = [];
      handleSearchError(status);
    }
  });
};

// Handle search errors
const handleSearchError = (status: string) => {
  switch (status) {
    case 'ZERO_RESULTS':
      CommonHelper.ErrorToaster('No results found. Please try a different search term.');
      break;
    case 'OVER_QUERY_LIMIT':
      CommonHelper.ErrorToaster('Search quota exceeded. Please try again later.');
      break;
    case 'REQUEST_DENIED':
      CommonHelper.ErrorToaster('Search request denied. Please check your API key configuration.');
      break;
    case 'INVALID_REQUEST':
      CommonHelper.ErrorToaster('Invalid search request. Please try a different search term.');
      break;
    default:
      CommonHelper.ErrorToaster('Search failed. Please try again or click on the map directly.');
  }
};

const selectSearchResult = (result: any) => {
  if (result.geometry && result.geometry.location) {
    const lat = typeof result.geometry.location.lat === 'function' 
      ? result.geometry.location.lat() 
      : result.geometry.location.lat;
    const lng = typeof result.geometry.location.lng === 'function' 
      ? result.geometry.location.lng() 
      : result.geometry.location.lng;
    
    // Set the location data
    formData.latitude = lat.toString();
    formData.longitude = lng.toString();
    formData.formatted_address = result.formatted_address || result.name || '';

    // Update map
    setLocationOnMap(lat, lng);
    
    // Close dialog and clear search
    showSearchDialog.value = false;
    clearSearch();
    
    CommonHelper.SuccessToaster('Location selected successfully!');
  } else {
    CommonHelper.ErrorToaster('Unable to get location coordinates for this place.');
  }
};

const clearSearch = () => {
  searchLocationQuery.value = '';
  searchResults.value = [];
  hasSearched.value = false;
  isSearching.value = false;
};

const clearLocation = () => {
  formData.latitude = '';
  formData.longitude = '';
  formData.formatted_address = '';
  
  if (marker.value) {
    marker.value.setMap(null);
    marker.value = null;
  }
  
  CommonHelper.SuccessToaster('Location cleared successfully!');
};

const openLocationPicker = () => {
  if (!map.value) {
    CommonHelper.ErrorToaster('Map is not loaded yet. Please wait and try again.');
    return;
  }
  CommonHelper.SuccessToaster('Click on the map to select a location or use the search function.');
};

// Form Methods
const loadCustomerData = async () => {
  if (!isAddMode.value) {
    try {
      isPageLoading.value = true;
      const customerData = await CommonService.GetById(customerId.value, '/v1/Customer/ById');
      Object.assign(formData, {
        ...customerData,
        id: customerId.value
      });
      
      // If customer has location data, set it on map
      if (customerData.latitude && customerData.longitude) {
        const lat = parseFloat(customerData.latitude);
        const lng = parseFloat(customerData.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          await nextTick();
          // Wait a bit for map to be fully initialized
          setTimeout(() => {
            if (map.value) {
              setLocationOnMap(lat, lng);
            }
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error loading customer data:', error);
      CommonHelper.ErrorToaster('Failed to load customer data');
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

    // Prepare payload according to your API structure
    const payload: any = {
      id: formData.id,
      status: formData.status,
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      gst_number: formData.gst_number,
      latitude: formData.latitude,
      longitude: formData.longitude,
      formatted_address: formData.formatted_address
    };

    // Include password only for add mode or if provided
    if (isAddMode.value || (formData.password && formData.password.trim() !== '')) {
      payload.password = formData.password;
    }

    const response = isAddMode.value
      ? await CommonService.CommonPost(payload, '/v1/Customer/Insert')
      : await CommonService.CommonPut(payload, `/v1/Customer/Update/${customerId.value}`);

    if (response.Type === 'S') {
      CommonHelper.SuccessToaster(response.Message);
      router.push('/customers');
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
  router.push('/customers');
};

// Lifecycle
onMounted(async () => {
  try {
    // Load Google Maps first
    await loadGoogleMaps();
    // Wait a bit for Google Maps to fully initialize
    setTimeout(async () => {
      await initializeGoogleMap();
      // Load customer data after map is ready
      await loadCustomerData();
    }, 100);
  } catch (error) {
    console.error('Error initializing component:', error);
    CommonHelper.ErrorToaster('Failed to initialize Google Maps. Please check your API key and refresh the page.');
  }
});

onUnmounted(() => {
  // Clean up map instance
  if (map.value) {
    map.value = null;
  }
  if (marker.value) {
    marker.value = null;
  }
  // Clean up callback
  if (window.initGoogleMap) {
    delete window.initGoogleMap;
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

.map-container {
  position: sticky;
  top: 20px;
}

.map-card {
  overflow: hidden;
  border-radius: 12px;
}

.map-view {
  height: 400px;
  width: 100%;
  border-radius: 8px 8px 0 0;
}

.map-controls {
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
}

.search-results-list {
  max-height: 250px;
  overflow-y: auto;
}

.search-result-item:hover {
  background-color: #f5f5f5;
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

/* Responsive adjustments */
@media (max-width: 1023px) {
  .map-container {
    position: static;
    margin-top: 20px;
  }
}

@media (max-width: 599px) {
  .map-view {
    height: 300px;
  }
}
</style>