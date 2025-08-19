<template>
  <q-page padding>
    <div class="page-header row items-center justify-between q-mb-lg">
      <h2 class="text-h5 text-weight-medium q-ma-none">Order Management</h2>
      <div class="header-actions row items-center q-gutter-sm">
        <q-btn
          unelevated
          color="primary"
          icon="add"
          label="Add Order"
          @click="navigateToAdd"
          class="add-btn"
        />
        <q-input
          outlined
          dense
          debounce="300"
          v-model="searchQuery"
          placeholder="Search orders..."
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
        :rows="paginatedOrders"
        row-key="order_number"
        v-model:pagination="tablePagination"
        :rows-per-page-options="pageSizeOptions"
        @request="onTableRequest"
        :loading="isLoading"
        class="orders-table"
      >
        <template v-slot:body-cell-customer="props">
          <q-td :props="props">
            <div class="text-weight-medium">
              {{ props.row.customer.name || 'N/A' }}
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

        <template v-slot:body-cell-order_status="props">
          <q-td :props="props">
            <q-chip
              :color="getStatusColor(props.row.order_status)"
              text-color="white"
              size="sm"
            >
              {{ props.row.order_status }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-priority="props">
          <q-td :props="props">
            <q-chip
              :color="getPriorityColor(props.row.priority)"
              text-color="white"
              size="sm"
            >
              {{ props.row.priority }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-pickup_time="props">
          <q-td :props="props">
            <div class="text-weight-medium">
              {{ formatTime(props.row.pickup_time) }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <div class="action-buttons q-gutter-xs">
              <q-btn
                flat
                dense
                round
                icon="edit"
                color="primary"
                size="sm"
                @click="navigateToEdit(props.row.id)"
              >
                <q-tooltip>Edit Order</q-tooltip>
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
                <q-tooltip>Delete Order</q-tooltip>
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
const allOrders = ref<any[]>([]);
const pageSizeOptions = [10, 20, 50, 100];

// Table configuration
const tablePagination = reactive({
  sortBy: 'order_number',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const tableColumns = [
  {
    name: 'order_number',
    label: 'Order Number',
    field: 'order_number',
    sortable: true,
    align: 'left' as const
  },
  {
    name: 'customer',
    label: 'Customer',
    field: 'customer_id',
    sortable: true,
    align: 'left' as const
  },
  {
    name: 'material',
    label: 'Material',
    field: 'material',
    sortable: true,
    align: 'left' as const
  },
  {
    name: 'order_date',
    label: 'Order Date',
    field: 'order_date',
    sortable: true,
    align: 'left' as const,
    format: (val: string) => formatDate(val)
  },
  {
    name: 'pickup_date',
    label: 'Pickup Date',
    field: 'pickup_date',
    sortable: true,
    align: 'left' as const,
    format: (val: string) => formatDate(val)
  },
  {
    name: 'pickup_time',
    label: 'Pickup Time',
    field: 'pickup_time',
    sortable: true,
    align: 'center' as const
  },
  {
    name: 'source_location',
    label: 'Source',
    field: 'source_location',
    sortable: true,
    align: 'left' as const
  },
  {
    name: 'destination_location',
    label: 'Destination',
    field: 'destination_location',
    sortable: true,
    align: 'left' as const
  },
  {
    name: 'weight',
    label: 'Weight',
    field: 'weight',
    sortable: true,
    align: 'right' as const
  },
  {
    name: 'priority',
    label: 'Priority',
    field: 'priority',
    sortable: true,
    align: 'center' as const
  },
  {
    name: 'expected_date',
    label: 'Expected Date',
    field: 'expected_date',
    sortable: true,
    align: 'left' as const,
    format: (val: string) => formatDate(val)
  },
  {
    name: 'order_status',
    label: 'Order Status',
    field: 'order_status',
    sortable: true,
    align: 'center' as const
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
const filteredOrders = computed(() => {
  let filtered = allOrders.value;

  if (searchQuery.value.trim()) {
    const searchTerm = searchQuery.value.toLowerCase().trim();
    filtered = allOrders.value.filter((order: any) => {
      const searchableFields = [
        order.order_number,
        order.customer_id,
        order.customer_name,
        order.material,
        order.source_location,
        order.destination_location,
        order.order_status,
        order.order_date,
        order.pickup_date
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

const paginatedOrders = computed(() => {
  const filtered = filteredOrders.value;
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
const fetchOrders = async () => {
  try {
    isLoading.value = true;
    const response = await CommonService.GetAll('/v1/Order/List');
    allOrders.value = response;
    tablePagination.rowsNumber = response.length;
    tablePagination.page = 1;
  } catch (error) {
    CommonHelper.ErrorToaster('Failed to load orders');
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

const formatTime = (timeString: string) => {
  if (!timeString) return 'N/A';
  
  // Handle different time formats
  if (timeString.includes(':')) {
    // If it's already in HH:MM format
    return timeString;
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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'negative';
    case 'Medium': return 'orange';
    case 'Low': return 'positive';
    case 'Urgent': return 'red';
    default: return 'grey';
  }
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
  router.push('/orders/0');
};

const navigateToEdit = (orderId: string) => {
  router.push(`/orders/${orderId}`);
};

const confirmDelete = (order: any) => {
  $q.dialog({
    title: 'Are you sure?',
    message: `You want to ${order.status ? 'deactivate' : 'activate'} order ${order.id}!`,
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
      CommonHelper.Showspinner();
      const response = await CommonService.CommonDelete(`/v1/Order/Delete/${order.id}`);

      if (response.Type === 'S') {
        CommonHelper.SuccessToaster(response.Message);
        await fetchOrders(); // Refresh the list
      } else {
        CommonHelper.ErrorToaster(response.Message);
      }
    } catch (error) {
      CommonHelper.ErrorToaster('Failed to update order status');
    } finally {
      CommonHelper.Hidespinner();
    }
  });
};

// Watchers
watch(searchQuery, () => {
  tablePagination.page = 1; // Reset to first page when searching
});

// Lifecycle
onMounted(() => {
  fetchOrders();
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
.orders-table {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}
.action-buttons {
  display: flex;
  justify-content: center;
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