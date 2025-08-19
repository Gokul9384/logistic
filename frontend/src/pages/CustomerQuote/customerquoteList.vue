<template>
  <q-page padding>
    <!-- Header Section -->
    <div class="page-header row items-center justify-between q-mb-lg">
      <div>
        <h2 class="text-h5 text-weight-medium q-ma-none">Customer Quote Management</h2>
        <p class="text-body2 text-grey-7 q-mt-xs">Manage and track all customer quotes</p>
      </div>
      <div class="header-actions row items-center q-gutter-sm">
        <q-btn
          unelevated
          color="primary"
          icon="add"
          label="Add Customer Quote"
          @click="navigateToAdd"
          class="add-btn"
        />
        <q-input
          outlined
          dense
          debounce="300"
          v-model="searchQuery"
          placeholder="Search customer quotes..."
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

    <!-- Customer Quotes Grid -->
    <div v-if="paginatedCustomerQuotes.length > 0" class="quotes-grid q-mb-xl">
      <q-card 
        v-for="customerQuote in paginatedCustomerQuotes" 
        :key="customerQuote.id"
        class="quote-card"
        bordered
      >
        <q-card-section>
          <!-- Header with quote number and status -->
          <div class="row justify-between items-start q-mb-sm">
            <div class="quote-header">
              <div class="text-h6 text-weight-bold">{{ customerQuote.customer_quote_number }}</div>
              <q-chip
                :color="getCustomerQuoteStatusColor(customerQuote.customer_quote_status)"
                text-color="white"
                size="sm"
                class="status-chip"
              >
                {{ customerQuote.customer_quote_status }}
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
                @click="navigateToEdit(customerQuote.id)"
              >
                <q-tooltip>Edit Customer Quote</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="negative"
                size="sm"
                @click="confirmDelete(customerQuote)"
              >
                <q-tooltip>Delete Customer Quote</q-tooltip>
              </q-btn>
            </div>
          </div>

          <!-- Quote Amount -->
          <div class="amount-section q-mb-sm">
            <div class="text-h5 text-weight-bold text-primary">₹{{ formatAmount(customerQuote.customer_quote_amount) }}</div>
          </div>

          <!-- Quote and Order Information -->
          <div class="info-section q-mb-sm">

            <div class="info-row">
              <div class="info-label">Order:</div>
              <div class="info-value">{{ customerQuote.order?.order_number || 'N/A' }}</div>
            </div>
          </div>

          <!-- Customer Information -->
          <div class="info-section q-mb-sm">
            <div class="info-row">
              <div class="info-label">Customer:</div>
              <div class="info-value">{{ customerQuote.customer?.name || 'N/A' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Contact:</div>
              <div class="info-value">{{ customerQuote.customer?.email || 'N/A' }} | {{ customerQuote.customer?.mobile || 'N/A' }}</div>
            </div>
          </div>

          <!-- Material and Route -->
          <div class="info-section q-mb-sm">
            <div class="info-row">
              <div class="info-label">Material:</div>
              <div class="info-value">{{ customerQuote.order?.material || 'N/A' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Route:</div>
              <div class="info-value">
                {{ customerQuote.order?.source_location || 'N/A' }} → {{ customerQuote.order?.destination_location || 'N/A' }}
              </div>
            </div>
                        <div class="info-row" v-if="customerQuote.order?.pickup_date">
              <div class="info-label">Pickup Date:</div>
              <div class="info-value">{{ formatDate(customerQuote.order?.pickup_date) }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Pickup Time:</div>
              <div class="info-value">{{ formatTime(customerQuote.order?.pickup_time) }}</div>
            </div>

          </div>

          <!-- Details Section -->
          <div class="details-section q-mt-md">
            <div class="detail-item">
              <q-icon name="event" size="sm" class="q-mr-xs" />
              <span>Expected: {{ formatDate(customerQuote.order?.expected_date) }}</span>
            </div>
            <div class="detail-item">
              <q-icon name="scale" size="sm" class="q-mr-xs" />
              <span>Weight: {{ customerQuote.order?.weight || 'N/A' }} kg</span>
            </div>
            <div class="detail-item">
              <q-chip
                :color="getPriorityColor(customerQuote.order?.priority)"
                text-color="white"
                size="sm"
                class="priority-chip"
              >
                {{ customerQuote.order?.priority || 'N/A' }} Priority
              </q-chip>
            </div>
          </div>

          <!-- Footer with dates -->
          <div class="footer-section q-mt-md">
            <div class="text-caption text-grey-6">
              Created: {{ formatDate(customerQuote.created_on) }}
            </div>
            <div class="text-caption text-grey-6">
              Original Quote: ₹{{ formatAmount(customerQuote.quote?.quote_amount) }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state q-mb-xl">
      <q-icon name="receipt_long" size="80px" class="text-grey-4" />
      <div class="text-h5 text-grey-6 q-mt-md">No customer quotes found</div>
      <div class="text-body1 text-grey-5 q-mb-lg">Try adjusting your filters or create a new customer quote</div>
      <q-btn
        unelevated
        color="primary"
        icon="add"
        label="Add Customer Quote"
        @click="navigateToAdd"
      />
    </div>

    <!-- Pagination -->
    <div v-if="paginatedCustomerQuotes.length > 0" class="pagination-container">
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
interface CustomerOption {
  label: string;
  value: string;
}

interface CustomerQuote {
  id: string;
  status: boolean;
  created_by_id: string;
  created_on: string;
  quote_id: string;
  order_id: string;
  customer_id: string;
  customer_quote_number: string;
  customer_quote_amount: string;
  customer_quote_status: string;
  quote: {
    id: string;
    status: boolean;
    created_by_id: string;
    created_on: string;
    requirement_id: string;
    quote_number: string;
    quote_amount: string;
    quote_status: string;
  };
  order: {
    id: string;
    status: boolean;
    created_by_id: string;
    created_on: string;
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
  };
  customer: {
    id: string;
    status: boolean;
    created_by_id: string;
    created_on: string;
    user_id: string;
    name: string;
    address: string;
    email: string;
    mobile: string;
    gst_number: string;
  };
}

// Router and Quasar setup
const router = useRouter();
const $q = useQuasar();

// Component state
const isLoading = ref(false);
const searchQuery = ref('');
const allCustomerQuotes = ref<CustomerQuote[]>([]);
const statusFilter = ref<string | null>(null);
const priorityFilter = ref<string | null>(null);
const customerFilter = ref<string | null>(null);
const customerOptions = ref<CustomerOption[]>([]);

// Filter options
const statusOptions = ['Sent', 'Accepted', 'Rejected'];
const priorityOptions = ['High', 'Medium', 'Low','Urgent'];

// Table configuration
const tablePagination = reactive({
  sortBy: 'customer_quote_number',
  descending: false,
  page: 1,
  rowsPerPage: 6,
  rowsNumber: 0
});

// Computed properties
const filteredCustomerQuotes = computed(() => {
  let filtered = allCustomerQuotes.value;
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    const searchTerm = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter((customerQuote: CustomerQuote) => {
      const searchableFields = [
        customerQuote.customer_quote_number,
        customerQuote.quote?.quote_number,
        customerQuote.order?.order_number,
        customerQuote.customer?.name,
        customerQuote.customer?.email,
        customerQuote.customer?.mobile,
        customerQuote.customer_quote_status,
        customerQuote.order?.material,
        customerQuote.order?.source_location,
        customerQuote.order?.destination_location
      ];
      return searchableFields.some(field =>
        field?.toString().toLowerCase().includes(searchTerm)
      );
    });
  }
  
  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(req => req.customer_quote_status === statusFilter.value);
  }
  
  // Apply priority filter
  if (priorityFilter.value) {
    filtered = filtered.filter(req => req.order?.priority === priorityFilter.value);
  }
  
  // Apply customer filter
  if (customerFilter.value) {
    filtered = filtered.filter(req => req.customer_id === customerFilter.value);
  }
  
  // Update pagination when filtering
  tablePagination.rowsNumber = filtered.length;
  
  return filtered;
});

const paginatedCustomerQuotes = computed(() => {
  const filtered = filteredCustomerQuotes.value;
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
const fetchCustomerQuotes = async () => {
  try {
    isLoading.value = true;
    const response = await CommonService.GetAll('/v1/CustomerQuote/List');
    allCustomerQuotes.value = response as CustomerQuote[];
    tablePagination.rowsNumber = response.length;
    tablePagination.page = 1;
    
    // Extract customer options with proper typing
    const customerMap = new Map<string, string>();
    response.forEach((req: CustomerQuote) => {
      if (req.customer_id && req.customer?.name && !customerMap.has(req.customer_id)) {
        customerMap.set(req.customer_id, req.customer.name);
      }
    });
    
    customerOptions.value = Array.from(customerMap, ([value, label]) => ({ label, value }));
  } catch (error) {
    CommonHelper.ErrorToaster('Failed to load customer quotes');
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

const formatAmount = (amount: string) => {
  if (!amount) return '0.00';
  const numAmount = parseFloat(amount);
  return numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const getCustomerQuoteStatusColor = (status: string): string => {
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
    case 'Urgent': return 'red';
    default: return 'grey';
  }
};

const resetFilters = () => {
  searchQuery.value = '';
  statusFilter.value = null;
  priorityFilter.value = null;
  customerFilter.value = null;
};

const onPageChange = (newPage: number) => {
  tablePagination.page = newPage;
};

const navigateToAdd = () => {
  router.push('/customer-quotes/0');
};

const navigateToEdit = (customerQuoteId: string) => {
  router.push(`/customer-quotes/${customerQuoteId}`);
};

const confirmDelete = (customerQuote: CustomerQuote) => {
  $q.dialog({
    title: 'Are you sure?',
    message: `You want to delete the customer quote "${customerQuote.customer_quote_number}"!`,
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
      const response = await CommonService.CommonDelete(`/v1/CustomerQuote/Delete/${customerQuote.id}`);
      if (response.Type === 'S') {
        CommonHelper.SuccessToaster(response.Message);
        await fetchCustomerQuotes(); // Refresh the list
      } else {
        CommonHelper.ErrorToaster(response.Message);
      }
    } catch (error) {
      CommonHelper.ErrorToaster('Failed to delete customer quote');
    } finally {
      CommonHelper.Hidespinner();
    }
  });
};

// Watchers
watch([searchQuery, statusFilter, priorityFilter, customerFilter], () => {
  tablePagination.page = 1; // Reset to first page when filtering
});

// Lifecycle
onMounted(() => {
  fetchCustomerQuotes();
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