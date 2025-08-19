<template>
  <q-page padding>
    <!-- Header Section -->
    <div class="page-header row items-center justify-between q-mb-lg">
      <div>
        <h2 class="text-h5 text-weight-medium q-ma-none">Quote Management</h2>
        <p class="text-body2 text-grey-7 q-mt-xs">Manage and track all your quotes</p>
      </div>
      <div class="header-actions row items-center q-gutter-sm">
        <q-btn
          unelevated
          color="primary"
          icon="add"
          label="Add Quote"
          @click="navigateToAdd"
          class="add-btn"
        />
        <q-input
          outlined
          dense
          debounce="300"
          v-model="searchQuery"
          placeholder="Search quotes..."
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
          label="Quote Status"
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


    <!-- Quotes Grid -->
    <div v-if="paginatedQuotes.length > 0" class="quotes-grid q-mb-xl">
      <q-card 
        v-for="quote in paginatedQuotes" 
        :key="quote.id"
        class="quote-card"
        bordered
      >
        <q-card-section>
          <!-- Header with quote number and status -->
          <div class="row justify-between items-start q-mb-sm">
            <div class="quote-header">
              <div class="text-h6 text-weight-bold">{{ quote.quote_number }}</div>
              <q-chip
                :color="getQuoteStatusColor(quote.quote_status)"
                text-color="white"
                size="sm"
                class="status-chip"
              >
                {{ quote.quote_status }}
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
                @click="navigateToEdit(quote.quote_id)"
              >
                <q-tooltip>Edit Quote</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="negative"
                size="sm"
                @click="confirmDelete(quote)"
              >
                <q-tooltip>Delete Quote</q-tooltip>
              </q-btn>
            </div>
          </div>

          <!-- Quote Amount -->
          <div class="amount-section q-mb-sm">
            <div class="text-h5 text-weight-bold text-primary">${{ quote.quote_amount }}</div>
          </div>

          <!-- Order Information -->
          <div class="info-section q-mb-sm">
            <div class="info-row">
              <div class="info-label">Order Number:</div>
              <div class="info-value">{{ quote.order_number }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Requirement:</div>
              <div class="info-value">{{ quote.requirement_number }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Vendor:</div>
              <div class="info-value">{{ quote.vendor_name }}</div>
            </div>
          </div>
          
          <!-- Material and Route -->
          <div class="info-section q-mb-sm">
            <div class="info-row">
              <div class="info-label">Material:</div>
              <div class="info-value">{{ quote.material }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Route:</div>
              <div class="info-value">
                {{ quote.source_location }} → {{ quote.destination_location }}
              </div>
            </div>
          </div>

          <!-- Pickup Information -->
          <div class="info-section q-mb-sm">
            <div class="info-row">
              <div class="info-label">Pickup Date:</div>
              <div class="info-value">{{ formatDate(quote.pickup_date) }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Pickup Time:</div>
              <div class="info-value">{{ formatTime(quote.pickup_time) }}</div>
            </div>
            <div class="info-row" v-if="quote.order_date">
              <div class="info-label">Order Date:</div>
              <div class="info-value">{{ formatDate(quote.order_date) }}</div>
            </div>
          </div>

          <!-- Details Section -->
          <div class="details-section q-mt-md">
            <div class="detail-item">
              <q-icon name="event" size="sm" class="q-mr-xs" />
              <span>Expected: {{ formatDate(quote.expected_date) }}</span>
            </div>
            <div class="detail-item">
              <q-icon name="scale" size="sm" class="q-mr-xs" />
              <span>Weight: {{ quote.weight }} kg</span>
            </div>
            <div class="detail-item">
              <q-chip
                :color="getPriorityColor(quote.priority)"
                text-color="white"
                size="sm"
                class="priority-chip"
              >
                {{ quote.priority }} Priority
              </q-chip>
            </div>
          </div>

          <!-- Footer with dates -->
          <div class="footer-section q-mt-md">
            <div class="text-caption text-grey-6">
              Created: {{ formatDate(quote.created_on) }}
            </div>
            <div v-if="quote.updated_on" class="text-caption text-grey-6">
              Updated: {{ formatDate(quote.updated_on) }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state q-mb-xl">
      <q-icon name="receipt_long" size="80px" class="text-grey-4" />
      <div class="text-h5 text-grey-6 q-mt-md">No quotes found</div>
      <div class="text-body1 text-grey-5 q-mb-lg">Try adjusting your filters or create a new quote</div>
      <q-btn
        unelevated
        color="primary"
        icon="add"
        label="Add Quote"
        @click="navigateToAdd"
      />
    </div>

    <!-- Pagination -->
    <div v-if="paginatedQuotes.length > 0" class="pagination-container">
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

interface Quote {
  id: string;
  quote_id:string;
  status: number;
  created_by_id: string;
  created_on: string;
  updated_by_id: string | null;
  updated_on: string | null;
  requirement_id: string;
  quote_number: string;
  quote_amount: string;
  quote_status: string;
  order_id: string;
  vendor_id: string;
  requirement_number: string;
  requirement_status: string;
  customer_id: string;
  order_number: string;
  material: string;
  source_location: string;
  destination_location: string;
  weight: string;
  priority: string;
  expected_date: string;
  order_status: string;
  order_date: string;
  pickup_date: string;
  pickup_time: string;
  vendor_name:string;
}

// Router and Quasar setup
const router = useRouter();
const $q = useQuasar();

// Component state
const isLoading = ref(false);
const searchQuery = ref('');
const allQuotes = ref<Quote[]>([]);
const statusFilter = ref<string | null>(null);
const priorityFilter = ref<string | null>(null);
const vendorFilter = ref<string | null>(null);
const vendorOptions = ref<VendorOption[]>([]);

// Filter options
const statusOptions = ['Sent', 'Accepted', 'Rejected'];
const priorityOptions = ['High', 'Medium', 'Low','Urgent'];

// Table configuration
const tablePagination = reactive({
  sortBy: 'quote_number',
  descending: false,
  page: 1,
  rowsPerPage: 6,
  rowsNumber: 0
});

// Computed properties
const filteredQuotes = computed(() => {
  let filtered = allQuotes.value;
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    const searchTerm = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter((quote: Quote) => {
      const searchableFields = [
        quote.quote_number,
        quote.order_number,
        quote.requirement_number,
        quote.material,
        quote.source_location,
        quote.destination_location,
        quote.quote_status,
        quote.priority,
        quote.pickup_date,
        quote.order_date
      ];
      return searchableFields.some(field =>
        field?.toString().toLowerCase().includes(searchTerm)
      );
    });
  }
  
  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(req => req.quote_status === statusFilter.value);
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

const paginatedQuotes = computed(() => {
  const filtered = filteredQuotes.value;
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
const fetchQuotes = async () => {
  try {
    isLoading.value = true;
    const response = await CommonService.GetAll('/v1/Quote/QuoteDetail');  
    allQuotes.value = response as Quote[];
    tablePagination.rowsNumber = response.length;
    tablePagination.page = 1;
    
    // Extract vendor options with proper typing
    const vendorMap = new Map<string, string>();
    response.forEach((req: Quote) => {
      if (req.vendor_id && req.vendor_name && !vendorMap.has(req.vendor_id)) {
        vendorMap.set(req.vendor_id, req.vendor_name);
      }
    });
    
    vendorOptions.value = Array.from(vendorMap, ([value, label]) => ({ label, value }));
  } catch (error) {
    CommonHelper.ErrorToaster('Failed to load quotes');
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

const getQuoteStatusColor = (status: string): string => {
  switch (status) {
    case 'Sent': return 'Sent';
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
  router.push('/quotes/0');
};

const navigateToEdit = (quoteId: string) => {
  router.push(`/quotes/${quoteId}`);
};

const confirmDelete = (quote: Quote) => {
  $q.dialog({
    title: 'Are you sure?',
    message: `You want to delete the quote "${quote.quote_number}"!`,
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
      const response = await CommonService.CommonDelete(`/v1/Quote/Delete/${quote.quote_id}`);
      if (response.Type === 'S') {
        CommonHelper.SuccessToaster(response.Message);
        await fetchQuotes(); // Refresh the list
      } else {
        CommonHelper.ErrorToaster(response.Message);
      }
    } catch (error) {
      CommonHelper.ErrorToaster('Failed to delete quote');
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
  fetchQuotes();
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

.quotes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
}

.quote-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.quote-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.quote-header {
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

.amount-section {
  margin-bottom: 12px;
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

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 12px;
  border-top: 1px solid #eee;
  margin-top: 12px;
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
  
  .quotes-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
