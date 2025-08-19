<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="text-h4 q-mb-lg text-primary text-weight-bold">Admin Dashboard</div>

    <!-- Stats Cards - Better Alignment -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="text-center shadow-3 rounded-borders" flat bordered>
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle2 text-grey-7 q-mb-sm">Total Orders</div>
            <div class="text-h3 text-weight-bold text-primary">{{ stats.totalOrders }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="text-center shadow-3 rounded-borders" flat bordered>
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle2 text-grey-7 q-mb-sm">Pending Quotes</div>
            <div class="text-h3 text-weight-bold text-orange">{{ stats.pendingQuotes }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="text-center shadow-3 rounded-borders" flat bordered>
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle2 text-grey-7 q-mb-sm">Active Bookings</div>
            <div class="text-h3 text-weight-bold text-positive">{{ stats.activeBookings }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="text-center shadow-3 rounded-borders" flat bordered>
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle2 text-grey-7 q-mb-sm">Pending Deliveries</div>
            <div class="text-h3 text-weight-bold text-negative">{{ stats.pendingDeliveries }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Orders Section - Better Layout -->
    <q-card flat bordered class="shadow-3 rounded-borders">
      <q-card-section class="q-pa-lg">
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6 text-primary text-weight-bold">Recent Orders</div>
          <div class="row q-gutter-sm items-center">
            <q-input 
              v-model="dateRange.start" 
              type="date" 
              label="Start Date" 
              dense 
              outlined 
              style="width: 150px;"
              class="q-mr-sm"
            />
            <q-input 
              v-model="dateRange.end" 
              type="date" 
              label="End Date" 
              dense 
              outlined 
              style="width: 150px;"
              class="q-mr-sm"
            />
            <q-btn 
              color="primary" 
              dense 
              label="Filter" 
              @click="fetchOrders"
              class="q-mr-sm"
            />
            <q-btn 
              flat 
              dense 
              label="Clear" 
              @click="clearDateFilter"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-lg">
        <q-table
          :rows="recentOrders"
          :columns="orderColumns"
          row-key="order_id"
          :loading="loading"
          flat
          bordered
          class="clean-table"
          :rows-per-page-options="[10, 25, 50]"
          rows-per-page-label="Rows per page:"
        >
          <template v-slot:body-cell-order_status="props">
            <q-td :props="props" class="text-center">
              <q-chip 
                :color="getStatusColor(props.row.order_status)" 
                text-color="white" 
                size="sm"
                class="text-weight-medium"
              >
                {{ props.row.order_status }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <q-btn 
                flat 
                round 
                color="primary" 
                icon="visibility" 
                size="sm" 
                @click="viewOrder(props.row.order_id)"
              >
                <q-tooltip>View Order</q-tooltip>
              </q-btn>
            </q-td>
          </template>

          <template v-slot:no-data>
            <div class="full-width row flex-center text-grey q-gutter-sm q-pa-lg">
              <q-icon size="2em" name="sentiment_dissatisfied" />
              <span class="text-subtitle1">No orders found</span>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { CommonService } from '@/services/CommonService';
import { useRoute, useRouter } from 'vue-router';


const router = useRouter();
const loading = ref(false);
const stats = ref({
  totalOrders: 0,
  pendingQuotes: 0,
  activeBookings: 0,
  pendingDeliveries: 0
});

const dateRange = ref({
  start: '',
  end: ''
});

const recentOrders = ref([]);

const orderColumns = [
  { 
    name: 'order_number', 
    label: 'Order #', 
    field: 'order_number', 
    sortable: true, 
    align: 'left',
    headerStyle: 'font-weight: bold;'
  },
  { 
    name: 'order_date', 
    label: 'Date', 
    field: 'order_date', 
    sortable: true, 
    align: 'left',
    headerStyle: 'font-weight: bold;'
  },
  { 
    name: 'source_location', 
    label: 'Source', 
    field: 'source_location', 
    sortable: true, 
    align: 'left',
    headerStyle: 'font-weight: bold;'
  },
  { 
    name: 'destination_location', 
    label: 'Destination', 
    field: 'destination_location', 
    sortable: true, 
    align: 'left',
    headerStyle: 'font-weight: bold;'
  },
  { 
    name: 'order_status', 
    label: 'Status', 
    field: 'order_status', 
    align: 'center',
    headerStyle: 'font-weight: bold;'
  },
  { 
    name: 'actions', 
    label: 'Actions', 
    field: 'actions', 
    align: 'center',
    headerStyle: 'font-weight: bold;'
  }
];

const getStatusColor = (status) => {
  const colors = {
    'NEW': 'orange',
    'ASSIGNED_TO_VENDOR': 'blue',
    'QUOTED': 'purple',
    'CUSTOMER_QUOTE_CREATED': 'teal',
    'QUOTE_ACCEPTED': 'green',
    'BOOKING_CREATED': 'indigo',
    'DRIVER_ASSIGNED': 'cyan',
    'IN_TRANSIT': 'amber',
    'DELIVERED': 'positive'
  };
  return colors[status] || 'grey';
};

const viewOrder = (orderId) => {
  router.push(`/orders/${orderId}`);
};


const fetchStats = async () => {
  try {
    const statsResponse = await CommonService.GetAll('/v1/Dashboard/stats');
    stats.value = {
      totalOrders: statsResponse.order_count,
      pendingQuotes: statsResponse.quote_count,
      activeBookings: statsResponse.active_booking,
      pendingDeliveries: statsResponse.pending_delivery
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};

const fetchOrders = async () => {
  loading.value = true;
  try {
    let url = '/v1/Dashboard/orders';
    if (dateRange.value.start && dateRange.value.end) {
      url += `?startDate=${dateRange.value.start}&endDate=${dateRange.value.end}`;
    }
    const ordersResponse = await CommonService.GetAll(url);
    recentOrders.value = ordersResponse;
  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    loading.value = false;
  }
};

const clearDateFilter = () => {
  dateRange.value.start = '';
  dateRange.value.end = '';
  fetchOrders();
};

onMounted(() => {
  fetchStats();
  fetchOrders();
});
</script>

<style scoped>
.clean-table {
  border-radius: 8px;
  overflow: hidden;
}

.clean-table .q-table__top,
.clean-table .q-table__bottom {
  padding: 12px 16px;
}

.clean-table th {
  background-color: #f5f5f5;
  color: #1976d2;
  font-weight: bold;
}

.clean-table td {
  padding: 12px 16px;
}

.clean-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.clean-table tbody tr:hover {
  background-color: #e3f2fd;
}

.rounded-borders {
  border-radius: 8px;
}

.shadow-3 {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>