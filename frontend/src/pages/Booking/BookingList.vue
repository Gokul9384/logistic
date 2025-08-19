<template>
  <q-page padding>
    <div class="page-header row items-center justify-between q-mb-lg">
      <h2 class="text-h5 text-weight-medium q-ma-none">Booking Management</h2>
      <div class="header-actions row items-center q-gutter-sm">
        <q-btn
          unelevated
          color="primary"
          icon="add"
          label="Add Booking"
          @click="navigateToAdd"
          class="add-btn"
        />
        <q-input
          outlined
          dense
          debounce="300"
          v-model="searchQuery"
          placeholder="Search bookings..."
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
        :rows="paginatedBookings"
        row-key="id"
        v-model:pagination="tablePagination"
        :rows-per-page-options="pageSizeOptions"
        @request="onTableRequest"
        :loading="isLoading"
        class="bookings-table"
      >
        <template v-slot:body-cell-order="props">
          <q-td :props="props">
            <div class="text-weight-medium">
              {{ props.row.order?.order_number || 'N/A' }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-vendor="props">
          <q-td :props="props">
            <div class="text-weight-medium">
              {{ props.row.vendor?.company_name || 'N/A' }}
            </div>
          </q-td>
        </template>

                <template v-slot:body-cell-customer="props">
          <q-td :props="props">
            <div class="text-weight-medium">
              {{ props.row.customer?.name || 'N/A' }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-quote="props">
          <q-td :props="props">
            <div class="text-weight-medium">
              {{ props.row.quote?.quote_number || 'N/A' }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-driver="props">
          <q-td :props="props">
            <div class="text-weight-medium">
              {{ props.row.driver?.name || 'N/A' }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-amount="props">
          <q-td :props="props">
            <div class="text-weight-bold text-positive">
              ₹{{ formatAmount(props.row.amount) }}
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

        <template v-slot:body-cell-booking_status="props">
          <q-td :props="props">
            <q-chip
              :color="getBookingStatusColor(props.row.booking_status)"
              text-color="white"
              size="sm"
            >
              {{ formatBookingStatus(props.row.booking_status) }}
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
                icon="edit"
                color="primary"
                size="sm"
                @click="navigateToEdit(props.row.id)"
              >
                <q-tooltip>Edit Booking</q-tooltip>
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
                <q-tooltip>Delete Booking</q-tooltip>
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
const allBookings = ref<any[]>([]);
const pageSizeOptions = [10, 20, 50, 100];

// Table configuration
const tablePagination = reactive({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const tableColumns = [
  {
    name: 'booking_number',
    label: 'Booking number',
    field: 'booking_number',
    sortable: true,
    align: 'left' as const
  },
  {
    name: 'order',
    label: 'Order',
    field: 'order_id',
    sortable: true,
    align: 'left' as const
  },
  {
    name: 'vendor',
    label: 'Vendor',
    field: 'vendor_id',
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
    name: 'quote',
    label: 'Quote',
    field: 'quote_id',
    sortable: true,
    align: 'left' as const
  },
  {
    name: 'amount',
    label: 'Amount',
    field: 'amount',
    sortable: true,
    align: 'right' as const
  },
  {
    name: 'booking_status',
    label: 'Booking Status',
    field: 'booking_status',
    sortable: true,
    align: 'center' as const
  },
  {
    name: 'driver',
    label: 'Driver',
    field: 'driver_id',
    sortable: true,
    align: 'left' as const
  },
  {
    name: 'vehicle_number',
    label: 'Vehicle Number',
    field: 'vehicle_number',
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
const filteredBookings = computed(() => {
  let filtered = allBookings.value;

  if (searchQuery.value.trim()) {
    const searchTerm = searchQuery.value.toLowerCase().trim();
    filtered = allBookings.value.filter((booking: any) => {
      const searchableFields = [
        booking.id,
        booking.order?.order_number,
        booking.vendor?.company_name,
        booking.customer?.name,
        booking.quote?.quote_number,
        booking.driver?.name,
        booking.vehicle_number,
        booking.booking_status
      ];

      return searchableFields.some(field =>
        field?.toString().toLowerCase().includes(searchTerm)
      );
    });
  }

  // Update pagination when filtering
  tablePagination.rowsNumber = filtered.length;
  
  return filtered;
});

const paginatedBookings = computed(() => {
  const filtered = filteredBookings.value;
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
const fetchBookings = async () => {
  try {
    isLoading.value = true;
    const response = await CommonService.GetAll('/v1/Booking/List');
    allBookings.value = response;
    tablePagination.rowsNumber = response.length;
    tablePagination.page = 1;
  } catch (error) {
    CommonHelper.ErrorToaster('Failed to load bookings');
  } finally {
    isLoading.value = false;
  }
};

const formatAmount = (amount: number) => {
  if (!amount) return '0.00';
  return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const getBookingStatusColor = (status: string) => {
  switch (status) {
    case 'Created': return 'orange';
    case 'Confirmed': return 'positive';
    case 'Rejected': return 'red';
    default: return 'grey';
  }
};

const formatBookingStatus = (status: string) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
  router.push('/bookings/0');
};

const navigateToEdit = (bookingId: string) => {
  router.push(`/bookings/${bookingId}`);
};

const confirmDelete = (booking: any) => {
  $q.dialog({
    title: 'Are you sure?',
    message: `You want to ${booking.status ? 'deactivate' : 'activate'} booking ${booking.id}!`,
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
      const response = await CommonService.CommonDelete(`/v1/Booking/Delete/${booking.id}`);

      if (response.Type === 'S') {
        CommonHelper.SuccessToaster(response.Message);
        await fetchBookings(); // Refresh the list
      } else {
        CommonHelper.ErrorToaster(response.Message);
      }
    } catch (error) {
      CommonHelper.ErrorToaster('Failed to update booking status');
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
  fetchBookings();
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
.bookings-table {
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