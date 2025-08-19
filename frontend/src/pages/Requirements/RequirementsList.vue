<template>
  <q-page padding>
    <!-- Header Section -->
    <div class="page-header row items-center justify-between q-mb-lg">
      <div>
        <h2 class="text-h5 text-weight-medium q-ma-none">Requirement Management</h2>
        <p class="text-body2 text-grey-7 q-mt-xs">Manage and track all your requirements</p>
      </div>
      <div class="header-actions row items-center q-gutter-sm">
        <q-btn
          unelevated
          color="primary"
          icon="add"
          label="Add Requirement"
          @click="navigateToAdd"
          class="add-btn"
        />
        <q-input
          outlined
          dense
          debounce="300"
          v-model="searchQuery"
          placeholder="Search requirements..."
          clearable
          class="search-input"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>
    <!-- Filters Section -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-3">
        <q-select
          outlined
          dense
          v-model="statusFilter"
          :options="statusOptions"
          label="Status"
          clearable
          options-dense
        />
      </div>
      <div class="col-12 col-md-3">
        <q-select
          outlined
          dense
          v-model="priorityFilter"
          :options="priorityOptions"
          label="Priority"
          clearable
          options-dense
        />
      </div>

      <div class="col-12 col-md-3 flex items-center">
        <q-btn
          flat
          color="primary"
          label="Reset Filters"
          icon="refresh"
          @click="resetFilters"
          class="full-width"
        />
      </div>
    </div>
    <!-- Stats Cards -->

    <!-- Requirements Grid -->
    <div v-if="paginatedRequirements.length > 0" class="requirements-grid q-mb-xl">
      <q-card 
        v-for=" requirement in paginatedRequirements" 
        :key="requirement.requirement_number"
        class="requirement-card"
        bordered
      >
        <q-card-section>
          <!-- Header with requirement number and status -->
          <div class="row justify-between items-start q-mb-sm">
            <div class="requirement-header">
              <div class="text-h6 text-weight-bold">{{ requirement.requirement_number }}</div>
              <q-chip
                :color="getRequirementStatusColor(requirement.requirement_status)"
                text-color="white"
                size="sm"
                class="status-chip"
              >
                {{ requirement.requirement_status }}
              </q-chip>
            </div>
            <div class="action-buttons">
              <q-btn
                flat
                dense
                round
                icon="edit"
                color="primary"
                size="sm"
                @click="navigateToEdit(requirement.id)"
              >
                <q-tooltip>Edit Requirement</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="negative"
                size="sm"
                @click="confirmDelete(requirement)"
              >
                <q-tooltip>Delete Requirement</q-tooltip>
              </q-btn>
            </div>
          </div>
          <!-- Order Information -->
          <div class="info-section q-mb-sm">
            <div class="info-row">
              <div class="info-label">Order Number:</div>
              <div class="info-value">{{ requirement.order_number }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Vendor:</div>
              <div class="info-value">{{ requirement.vendor_name }}</div>
            </div>
          </div>
          <!-- Material and Route -->
          <div class="info-section q-mb-sm">
            <div class="info-row">
              <div class="info-label">Material:</div>
              <div class="info-value">{{ requirement.material }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Route:</div>
              <div class="info-value">
                {{ requirement.source_location }} → {{ requirement.destination_location }}
              </div>
            </div>
          </div>
          <!-- Pickup Information -->
          <div class="info-section q-mb-sm">
            <div class="info-row">
              <div class="info-label">Pickup Date:</div>
              <div class="info-value">{{ formatDate(requirement.pickup_date) }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Pickup Time:</div>
              <div class="info-value">{{ formatTime(requirement.pickup_time) }}</div>
            </div>
            <div class="info-row" v-if="requirement.order_date">
              <div class="info-label">Order Date:</div>
              <div class="info-value">{{ formatDate(requirement.order_date) }}</div>
            </div>
          </div>
          <!-- Details Section -->
          <div class="details-section q-mt-md">
            <div class="detail-item">
              <q-icon name="event" size="sm" class="q-mr-xs" />
              <span>Expected: {{ formatDate(requirement.expected_date) }}</span>
            </div>
            <div class="detail-item">
              <q-icon name="scale" size="sm" class="q-mr-xs" />
              <span>Weight: {{ requirement.weight }} kg</span>
            </div>
            <div class="detail-item">
              <q-chip
                :color="getPriorityColor(requirement.priority)"
                text-color="white"
                size="sm"
                class="priority-chip"
              >
                {{ requirement.priority }} Priority
              </q-chip>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <!-- Empty State -->
    <div v-else class="empty-state q-mb-xl">
      <q-icon name="inbox" size="80px" class="text-grey-4" />
      <div class="text-h5 text-grey-6 q-mt-md">No requirements found</div>
      <div class="text-body1 text-grey-5 q-mb-lg">Try adjusting your filters or create a new requirement</div>
      <q-btn
        unelevated
        color="primary"
        icon="add"
        label="Add Requirement"
        @click="navigateToAdd"
      />
    </div>
    <!-- Pagination -->
    <div v-if="paginatedRequirements.length > 0" class="pagination-container">
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
        color="primary"
        active-color="primary"
        active-text-color="white"
      />
    </div>
    <q-inner-loading :showing="isLoading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { date } from 'quasar';
// Import your actual services
import { CommonService } from '@/services/CommonService';
import { CommonHelper } from '@/helpers/CommonHelper';

// Define types
interface VendorOption {
  label: string;
  value: string;
}

interface Requirement {
  order_id: string;
  vendor_id: string;
  vendor_name:string;
  company_name: string;
  requirement_number: string;
  requirement_status: string;
  order_number: string;
  source_location: string;
  destination_location: string;
  material: string;
  expected_date: string;
  order_status: string;
  priority: string;
  weight: string;
  pickup_date: string;
  pickup_time: string;
  order_date: string;
  id: string;
}

// Router and Quasar setup
const router = useRouter();
const $q = useQuasar();

// Component state
const isLoading = ref(false);
const searchQuery = ref('');
const allRequirements = ref<Requirement[]>([]);
const statusFilter = ref<string | null>(null);
const priorityFilter = ref<string | null>(null);
const vendorFilter = ref<string | null>(null);
const vendorOptions = ref<VendorOption[]>([]);

// Filter options
const statusOptions = ['Sent', 'Accepted', 'Rejected'];
const priorityOptions = ['High', 'Medium', 'Low','Urgent'];

// Table configuration
const tablePagination = reactive({
  sortBy: 'requirement_number',
  descending: false,
  page: 1,
  rowsPerPage: 6,
  rowsNumber: 0
});

// Computed properties
const filteredRequirements = computed(() => {
  let filtered = allRequirements.value;
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    const searchTerm = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter((requirement: Requirement) => {
      const searchableFields = [
        requirement.requirement_number,
        requirement.order_number,
        requirement.material,
        requirement.source_location,
        requirement.destination_location,
        requirement.company_name,
        requirement.requirement_status,
        requirement.priority,
        requirement.pickup_date,
        requirement.order_date
      ];
      return searchableFields.some(field =>
        field?.toString().toLowerCase().includes(searchTerm)
      );
    });
  }
  
  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(req => req.requirement_status === statusFilter.value);
  }
  
  // Apply priority filter
  if (priorityFilter.value) {
    filtered = filtered.filter(req => req.priority === priorityFilter.value);
  }
  
  // Apply vendor filter
  if (vendorFilter.value) {
    filtered = filtered.filter(req => req.vendor_id === vendorFilter.value);
  }
  
  // Update pagination when filtering
  tablePagination.rowsNumber = filtered.length;
  
  return filtered;
});

const paginatedRequirements = computed(() => {
  const filtered = filteredRequirements.value;
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
const fetchRequirements = async () => {
  try {
    isLoading.value = true;
    const response = await CommonService.GetAll('/v1/Requirement/RequirementDetail');
    allRequirements.value = response as Requirement[];
    tablePagination.rowsNumber = response.length;
    tablePagination.page = 1;
    
    // Extract vendor options with proper typing
    const vendorMap = new Map<string, string>();
    response.forEach((req: Requirement) => {
      if (req.vendor_id && req.vendor_name && !vendorMap.has(req.vendor_id)) {
        vendorMap.set(req.vendor_id, req.vendor_name);
      }
    });
    
    vendorOptions.value = Array.from(vendorMap, ([value, label]) => ({ label, value }));
  } catch (error) {
    CommonHelper.ErrorToaster('Failed to load requirements');
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return date.formatDate(dateString, 'MMM DD, YYYY');
};

const formatTime = (timeString: string) => {
  if (!timeString) return 'N/A';
  
  // Handle different time formats
  if (timeString.includes(':')) {
    // If it's already in HH:MM format
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  } else {
    // If it's a full datetime, extract time
    try {
      return new Date(timeString).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return timeString;
    }
  }
};

const getRequirementStatusColor = (status: string): string => {
  switch (status) {
    case 'Sent': return 'positive';
    case 'Rejected': return 'negative';
    case 'Accepted': return 'positive';
    default: return 'grey';
  }
};

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'High': return 'negative';
    case 'Medium': return 'orange';
    case 'Low': return 'positive';
    case 'Urgent': return 'red';
    default: return 'grey';
  }
};

const resetFilters = () => {
  searchQuery.value = '';
  statusFilter.value = null;
  priorityFilter.value = null;
  vendorFilter.value = null;
};

const onPageChange = (newPage: number) => {
  tablePagination.page = newPage;
};

const navigateToAdd = () => {
  router.push('/requirements/0');
};

const navigateToEdit = (requirementId: string) => {
  router.push(`/requirements/${requirementId}`);
};

const confirmDelete = (requirement: Requirement) => {
  $q.dialog({
    title: 'Are you sure?',
    message: `You want to delete the requirement for Order ID "${requirement.order_number}"!`,
    persistent: true,
    color: 'warning',
    ok: {
      label: 'Delete',
      color: 'negative'
    },
    cancel: {
      label: 'Cancel',
      color: 'grey'
    }
  }).onOk(async () => {
    try {
      CommonHelper.Showspinner();
      const response = await CommonService.CommonDelete(`/v1/Requirement/Delete/${requirement.order_id}`);
      if (response.Type === 'S') {
        CommonHelper.SuccessToaster(response.Message);
        await fetchRequirements(); // Refresh the list
      } else {
        CommonHelper.ErrorToaster(response.Message);
      }
    } catch (error) {
      CommonHelper.ErrorToaster('Failed to delete requirement');
    } finally {
      CommonHelper.Hidespinner();
    }
  });
};

// Watchers
watch([searchQuery, statusFilter, priorityFilter, vendorFilter], () => {
  tablePagination.page = 1; // Reset to first page when filtering
});

// Lifecycle
onMounted(() => {
  fetchRequirements();
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

.stat-card {
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.requirements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
}

.requirement-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.requirement-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.requirement-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-chip {
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  align-items: flex-start;
}

.info-label {
  min-width: 120px;
  font-weight: 500;
  color: #555;
}

.info-value {
  flex: 1;
  word-break: break-word;
}

.details-section {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.detail-item {
  display: flex;
  align-items: center;
  color: #666;
}

.priority-chip {
  font-weight: 500;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
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
  
  .requirements-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 16px;
  }
}
</style>