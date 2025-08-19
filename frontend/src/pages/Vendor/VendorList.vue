<template>
  <q-page padding>
    <div class="page-header row items-center justify-between q-mb-lg">
      <h2 class="text-h5 text-weight-medium q-ma-none">Vendor Management</h2>
      <div class="header-actions row items-center q-gutter-sm">
        <q-btn
          unelevated
          color="primary"
          icon="business"
          label="Add Vendor"
          @click="navigateToAdd"
          class="add-btn"
        />
        <q-input
          outlined
          dense
          debounce="300"
          v-model="searchQuery"
          placeholder="Search vendors..."
          clearable
          class="search-input"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <q-card flat bordered>
      <q-table
        :columns="tableColumns"
        :rows="paginatedVendors"
        row-key="id"
        v-model:pagination="tablePagination"
        :rows-per-page-options="pageSizeOptions"
        @request="onTableRequest"
        :loading="isLoading"
        class="vendors-table"
      >
        <template v-slot:body-cell-company_name="props">
          <q-td :props="props">
            <div class="vendor-info">
              <div class="text-weight-medium">
                {{ props.row.company_name }}
              </div>
              <div class="text-caption text-grey-6">
                {{ props.row.email }}
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-vehicle_info="props">
          <q-td :props="props">
            <div v-if="props.row.vendor_vehicle_list && props.row.vendor_vehicle_list.length > 0">
              <q-chip
                v-for="(vehicle, index) in props.row.vendor_vehicle_list.slice(0, 2)"
                :key="index"
                color="blue-1"
                text-color="primary"
                size="sm"
                class="q-ma-xs"
              >
                {{ getVehicleTypeName(vehicle.vehicle_type_id) }}
                <q-tooltip>
                  {{ getVehicleTypeName(vehicle.vehicle_type_id) }}<br/>
                  Capacity: {{ vehicle.min_capacity }} - {{ vehicle.max_capacity }} Kg
                </q-tooltip>
              </q-chip>
              <q-chip
                v-if="props.row.vendor_vehicle_list.length > 2"
                color="grey-3"
                text-color="grey-8"
                size="sm"
                class="q-ma-xs"
              >
                +{{ props.row.vendor_vehicle_list.length - 2 }} more
              </q-chip>
            </div>
            <div v-else class="text-grey-6 text-caption">
              No vehicles
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-service_area_info="props">
          <q-td :props="props">
            <div v-if="props.row.vendor_service_area_list && props.row.vendor_service_area_list.length > 0">
              <q-chip
                v-for="(serviceArea, index) in props.row.vendor_service_area_list.slice(0, 2)"
                :key="index"
                color="green-1"
                text-color="positive"
                size="sm"
                class="q-ma-xs"
              >
                {{ getServiceAreaName(serviceArea.service_area_id) }}
                <q-tooltip>
                  {{ getServiceAreaName(serviceArea.service_area_id) }}<br/>
                  Distance: {{ serviceArea.min_km }} - {{ serviceArea.max_km }} Km
                </q-tooltip>
              </q-chip>
              <q-chip
                v-if="props.row.vendor_service_area_list.length > 2"
                color="grey-3"
                text-color="grey-8"
                size="sm"
                class="q-ma-xs"
              >
                +{{ props.row.vendor_service_area_list.length - 2 }} more
              </q-chip>
            </div>
            <div v-else class="text-grey-6 text-caption">
              No service areas
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="props.row.status ? 'positive' : 'negative'"
              text-color="white"
              size="sm"
            >
              {{ props.row.status ? 'Active' : 'Inactive' }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <div class="action-buttons q-gutter-xs">
              <q-btn
                flat
                dense
                round
                icon="visibility"
                color="info"
                size="sm"
                @click="showVendorDetails(props.row)"
              >
                <q-tooltip>View Details</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="edit"
                color="primary"
                size="sm"
                @click="navigateToEdit(props.row.id)"
              >
                <q-tooltip>Edit Vendor</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="negative"
                size="sm"
                @click="confirmDelete(props.row)"
              >
                <q-tooltip>Delete Vendor</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>

        <template v-slot:no-data="{ message }">
          <div class="full-width row flex-center q-gutter-sm text-grey">
            <q-icon size="2em" name="sentiment_dissatisfied" />
            <span>{{ message }}</span>
          </div>
        </template>

        <!-- Bottom Pagination -->
        <template v-slot:bottom>
          <div class="row full-width justify-between items-center">
            <div class="text-caption text-grey-7">
              {{ paginationInfo }}
            </div>
            <q-pagination
              v-model="tablePagination.page"
              :max="totalPages"
              :max-pages="6"
              direction-links
              boundary-links
              @update:model-value="onPageChange"
            />
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Vendor Details Dialog -->
    <q-dialog v-model="showDetailsDialog" persistent>
      <q-card style="min-width: 700px; max-width: 900px">
        <q-card-section class="row items-center">
          <q-icon name="business" class="q-mr-sm" />
          <div class="text-h6">Vendor Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle1 q-mb-lg">
            {{ selectedVendor?.company_name }}
          </div>
          
          <!-- Tabs for Vehicle and Service Area Details -->
          <q-tabs
            v-model="activeTab"
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="vehicles" icon="local_shipping" label="Vehicles" />
            <q-tab name="service_areas" icon="location_on" label="Service Areas" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="activeTab" animated>
            <!-- Vehicle Details Tab -->
            <q-tab-panel name="vehicles">
              <div v-if="selectedVendor?.vendor_vehicle_list && selectedVendor.vendor_vehicle_list.length > 0">
                <div 
                  v-for="(vehicle, index) in selectedVendor.vendor_vehicle_list" 
                  :key="index"
                  class="vehicle-detail-card q-mb-md"
                >
                  <q-card flat bordered class="q-pa-md">
                    <div class="row items-center q-mb-sm">
                      <q-icon name="local_shipping" color="primary" class="q-mr-sm" />
                      <span class="text-subtitle2">Vehicle {{ index + 1 }}</span>
                    </div>
                    <div class="row q-col-gutter-md">
                      <div class="col-4">
                        <div class="text-caption text-grey-6">Vehicle Type</div>
                        <div class="text-weight-medium">
                          {{ getVehicleTypeName(vehicle.vehicle_type_id) }}
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="text-caption text-grey-6">Min Capacity</div>
                        <div class="text-weight-medium">{{ vehicle.min_capacity }} Kg</div>
                      </div>
                      <div class="col-4">
                        <div class="text-caption text-grey-6">Max Capacity</div>
                        <div class="text-weight-medium">{{ vehicle.max_capacity }} Kg</div>
                      </div>
                    </div>
                  </q-card>
                </div>
              </div>
              
              <div v-else class="text-center q-pa-lg text-grey-6">
                <q-icon name="local_shipping" size="3em" class="q-mb-sm" />
                <div>No vehicles configured</div>
              </div>
            </q-tab-panel>

            <!-- Service Area Details Tab -->
            <q-tab-panel name="service_areas">
              <div v-if="selectedVendor?.vendor_service_area_list && selectedVendor.vendor_service_area_list.length > 0">
                <div 
                  v-for="(serviceArea, index) in selectedVendor.vendor_service_area_list" 
                  :key="index"
                  class="service-area-detail-card q-mb-md"
                >
                  <q-card flat bordered class="q-pa-md">
                    <div class="row items-center q-mb-sm">
                      <q-icon name="location_on" color="positive" class="q-mr-sm" />
                      <span class="text-subtitle2">Service Area {{ index + 1 }}</span>
                    </div>
                    <div class="row q-col-gutter-md">
                      <div class="col-4">
                        <div class="text-caption text-grey-6">Service Area</div>
                        <div class="text-weight-medium">
                          {{ getServiceAreaName(serviceArea.service_area_id) }}
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="text-caption text-grey-6">Min Distance</div>
                        <div class="text-weight-medium">{{ serviceArea.min_km }} Km</div>
                      </div>
                      <div class="col-4">
                        <div class="text-caption text-grey-6">Max Distance</div>
                        <div class="text-weight-medium">{{ serviceArea.max_km }} Km</div>
                      </div>
                    </div>
                  </q-card>
                </div>
              </div>
              
              <div v-else class="text-center q-pa-lg text-grey-6">
                <q-icon name="location_on" size="3em" class="q-mb-sm" />
                <div>No service areas configured</div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-inner-loading :showing="isLoading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

// Import your actual services
import { CommonService } from '@/services/CommonService';
import { CommonHelper } from '@/helpers/CommonHelper';

// Router and Quasar setup
const router = useRouter();
const $q = useQuasar();

// Component state
const isLoading = ref(false);
const searchQuery = ref('');
const allVendors = ref<any[]>([]);
const vehicleTypes = ref<any[]>([]);
const serviceAreas = ref<any[]>([]);
const pageSizeOptions = [10, 20, 50, 100];
const showDetailsDialog = ref(false);
const selectedVendor = ref<any>(null);
const activeTab = ref('vehicles');

// Table configuration
const tablePagination = reactive({
  sortBy: 'company_name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const tableColumns = [
  {
    name: 'company_name',
    label: 'Vendor Details',
    field: 'company_name',
    sortable: true,
    align: 'left' as const
  },
  {
    name: 'mobile',
    label: 'Mobile',
    field: 'mobile',
    sortable: true,
    align: 'left' as const
  },
  {
    name: 'vehicle_info',
    label: 'Vehicles',
    field: 'vehicle_info',
    sortable: false,
    align: 'left' as const
  },
  {
    name: 'service_area_info',
    label: 'Service Areas',
    field: 'service_area_info',
    sortable: false,
    align: 'left' as const
  },
  {
    name: 'gst_number',
    label: 'GST Number',
    field: 'gst_number',
    sortable: true,
    align: 'left' as const
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    sortable: false,
    align: 'center' as const
  }
];

// Computed properties
const filteredVendors = computed(() => {
  let filtered = allVendors.value;

  if (searchQuery.value.trim()) {
    const searchTerm = searchQuery.value.toLowerCase().trim();
    filtered = allVendors.value.filter((vendor: any) => {
      const searchableFields = [
        vendor.company_name,
        vendor.email,
        vendor.mobile,
        vendor.service_area,
        vendor.address,
        vendor.gst_number,
        vendor.pan_number
      ];

      return searchableFields.some(field =>
        field?.toLowerCase().includes(searchTerm)
      );
    });
  }

  // Update pagination when filtering
  tablePagination.rowsNumber = filtered.length;
  
  return filtered;
});

const paginatedVendors = computed(() => {
  const filtered = filteredVendors.value;
  const { page, rowsPerPage } = tablePagination;
  
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  
  return filtered.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
  return Math.ceil(tablePagination.rowsNumber / tablePagination.rowsPerPage);
});

const paginationInfo = computed(() => {
  const { page, rowsPerPage, rowsNumber } = tablePagination;
  
  if (rowsNumber === 0) {
    return '0 records';
  }
  
  const startRecord = (page - 1) * rowsPerPage + 1;
  const endRecord = Math.min(page * rowsPerPage, rowsNumber);
  
  return `${startRecord}-${endRecord} of ${rowsNumber} records`;
});

// Methods
const fetchVehicleTypes = async () => {
  try {
    const response = await CommonService.GetAll('/v1/VehicleType/List');
    vehicleTypes.value = response;
  } catch (error) {
    console.error('Error loading vehicle types:', error);
  }
};

const fetchServiceAreas = async () => {
  try {
    const response = await CommonService.GetAll('/v1/ServiceArea/List'); // Adjust endpoint as needed
    serviceAreas.value = response;
  } catch (error) {
    console.error('Error loading service areas:', error);
  }
};

const getVehicleTypeName = (vehicleTypeId: string) => {
  const vehicleType = vehicleTypes.value.find(type => type.id === vehicleTypeId);
  return vehicleType ? vehicleType.name : 'Unknown';
};

const getServiceAreaName = (serviceAreaId: string) => {
  const serviceArea = serviceAreas.value.find(area => area.id === serviceAreaId);
  return serviceArea ? serviceArea.name : 'Unknown';
};

const fetchVendors = async () => {
  try {
    isLoading.value = true;
    const response = await CommonService.GetAll('/v1/Vendor/List');
    allVendors.value = response;
    tablePagination.rowsNumber = response.length;
    tablePagination.page = 1;
  } catch (error) {
    CommonHelper.ErrorToaster('Failed to load vendors');
  } finally {
    isLoading.value = false;
  }
};

const showVendorDetails = (vendor: any) => {
  selectedVendor.value = vendor;
  activeTab.value = 'vehicles'; // Default to vehicles tab
  showDetailsDialog.value = true;
};

const onTableRequest = (props: {
  pagination: {
    page: number;
    rowsPerPage: number;
    sortBy: string;
    descending: boolean;
  };
}) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;

  tablePagination.page = page;
  tablePagination.rowsPerPage = rowsPerPage;
  tablePagination.sortBy = sortBy;
  tablePagination.descending = descending;
};

const onPageChange = (newPage: number) => {
  tablePagination.page = newPage;
};

const navigateToAdd = () => {
  router.push('/vendors/0');
};

const navigateToEdit = (vendorId: string) => {
  router.push(`/vendors/${vendorId}`);
};

const confirmDelete = (vendor: any) => {
  $q.dialog({
    title: 'Are you sure?',
    message: `You want to ${vendor.status ? 'deactivate' : 'activate'} vendor "${vendor.company_name}"!`,
    persistent: true,
    color: 'warning',
    ok: {
      label: 'Confirm',
      color: 'negative'
    },
    cancel: {
      label: 'Cancel',
      color: 'grey'
    }
  }).onOk(async () => {
    try {
      isLoading.value = true;
      const response = await CommonService.CommonDelete(`/v1/Vendor/Delete/${vendor.id}`);

      if (response.Type === 'S') {
        CommonHelper.SuccessToaster(response.Message);
        await fetchVendors(); // Refresh the list
      } else {
        CommonHelper.ErrorToaster(response.Message);
      }
    } catch (error) {
      CommonHelper.ErrorToaster('Failed to delete vendor');
    } finally {
      isLoading.value = false;
    }
  });
};

// Watchers
watch(searchQuery, () => {
  tablePagination.page = 1; // Reset to first page when searching
});

// Lifecycle
onMounted(async () => {
  await fetchVehicleTypes();
  await fetchServiceAreas();
  await fetchVendors();
});
</script>

<style scoped>
.page-header {
  margin-bottom: 24px;
}
.add-btn {
  text-transform: none;
  font-weight: 500;
}
.search-input {
  width: 300px;
}
.vendors-table {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}
.vendor-info {
  line-height: 1.2;
}
.action-buttons {
  display: flex;
  justify-content: center;
}
.vehicle-detail-card,
.service-area-detail-card {
  transition: all 0.3s ease;
}
.vehicle-detail-card:hover,
.service-area-detail-card:hover {
  transform: translateY(-1px);
}
:deep(.q-table th) {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}
:deep(.q-table tbody tr:hover) {
  background-color: #f8f9fa;
}
:deep(.q-btn) {
  text-transform: none;
}
:deep(.q-chip) {
  font-weight: 500;
}
:deep(.q-pagination) {
  color: #1976d2;
}
:deep(.q-pagination .q-btn) {
  min-height: 32px;
  min-width: 32px;
}
:deep(.q-tab-panels) {
  background-color: transparent;
}
:deep(.q-tab-panel) {
  padding: 16px 0;
}
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  .header-actions {
    justify-content: space-between;
  }
  .search-input {
    width: 100%;
    max-width: 300px;
  }
  :deep(.q-table .q-table__bottom) {
    flex-direction: column;
    gap: 12px;
  }
  :deep(.q-pagination) {
    justify-content: center;
  }
}
</style>