<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="text-h4 q-mb-lg text-primary text-weight-bold">Customer Dashboard</div>
    
    <!-- Stats Cards - Matching Admin & Vendor Design -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <!-- Existing stats cards -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="text-center shadow-3 rounded-borders" flat bordered>
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle2 text-grey-7 q-mb-sm">My Orders</div>
            <div class="text-h3 text-weight-bold text-primary">{{ stats.accepted_requirements }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="text-center shadow-3 rounded-borders" flat bordered>
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle2 text-grey-7 q-mb-sm">Pending Quotes</div>
            <div class="text-h3 text-weight-bold text-orange">{{ stats.pending_quotes }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="text-center shadow-3 rounded-borders" flat bordered>
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle2 text-grey-7 q-mb-sm">Active Bookings</div>
            <div class="text-h3 text-weight-bold text-positive">{{ stats.active_bookings }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="text-center shadow-3 rounded-borders" flat bordered>
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle2 text-grey-7 q-mb-sm">Pending Deliveries</div>
            <div class="text-h3 text-weight-bold text-negative">{{ stats.pending_deliveries }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    
    <!-- Quick Actions Section -->
    <q-card flat bordered class="shadow-3 rounded-borders q-mb-xl">
      <q-card-section class="q-pa-lg">
        <div class="text-h6 text-primary text-weight-bold">Quick Actions</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-lg">
        <div class="row q-gutter-md">
          <q-btn color="primary" icon="add" label="New Order" @click="createOrder" size="md" class="q-px-md" />
          <q-btn color="secondary" icon="list" label="My Orders" @click="viewOrders" size="md" class="q-px-md" />
          <q-btn color="accent" icon="description" label="My Quotes" @click="viewQuotes" size="md" class="q-px-md" />
        </div>
      </q-card-section>
    </q-card>
    
    <!-- Delivery Tracking Section -->
    <q-card flat bordered class="shadow-3 rounded-borders q-mb-xl delivery-tracking-section">
      <q-card-section class="q-pa-lg">
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6 text-primary text-weight-bold">Delivery Tracking</div>
          <div class="row q-gutter-sm items-center">
            <q-input 
              v-model="deliveryDateRange.start" 
              type="date" 
              label="Start Date" 
              dense 
              outlined 
              style="width: 150px;"
              class="q-mr-sm"
            />
            <q-btn 
              color="primary" 
              dense 
              label="Filter" 
              @click="fetchDeliveryTracking"
              class="q-mr-sm"
            />
            <q-btn 
              flat 
              dense 
              label="Clear" 
              @click="clearDeliveryDateFilter"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-lg">
        <!-- Timeline View for Delivery Tracking -->
        <div v-if="deliveryTracking.length > 0" class="delivery-timeline-container">
          <div v-for="delivery in deliveryTracking" :key="delivery.order_number" class="delivery-timeline-item">
            <q-card flat bordered class="delivery-card">
              <q-card-section class="q-pa-md">
                <div class="row items-center justify-between q-mb-md">
                  <div class="text-h6 text-weight-bold">{{ delivery.order_number }}</div>
                  <q-chip 
                    :color="getDeliveryStatusColor(delivery.delivery_status)" 
                    text-color="white" 
                    size="md"
                    class="text-weight-medium"
                  >
                    {{ delivery.delivery_status }}
                  </q-chip>
                </div>
                
                <div class="row q-col-gutter-md q-mb-md">
                  <div class="col-12 col-md-6">
                    <div class="text-caption text-grey-6">Order Date</div>
                    <div class="text-body1 text-weight-medium">{{ formatDate(delivery.order_date) }}</div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="text-caption text-grey-6">Booking #</div>
                    <div class="text-body1 text-weight-medium">{{ delivery.booking_number }}</div>
                  </div>
                </div>
                
                <div class="row q-col-gutter-md q-mb-md">
                  <div class="col-12 col-md-6">
                    <div class="text-caption text-grey-6">Source</div>
                    <div class="text-body1">{{ delivery.source_location }}</div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="text-caption text-grey-6">Destination</div>
                    <div class="text-body1">{{ delivery.destination_location }}</div>
                  </div>
                </div>
                
                <div class="text-caption text-grey-6 q-mb-sm">Driver</div>
                <div class="text-body1 text-weight-medium q-mb-md">{{ delivery.driver_name || 'Not assigned' }}</div>
                
                <!-- Delivery Status Timeline -->
                <div class="text-subtitle1 text-weight-bold q-mb-md">Delivery Progress</div>
                <div class="status-timeline">
                  <div class="timeline-step" :class="{ 'active': delivery.delivery_status === 'Assigned' || delivery.delivery_status !== 'Assigned' }">
                    <div class="step-icon assigned">
                      <q-icon name="assignment" />
                    </div>
                    <div class="step-content">
                      <div class="step-title">Assigned</div>
                      <div class="step-time">{{ delivery.assigned_time ? formatDateTime(delivery.assigned_time) : 'Pending' }}</div>
                    </div>
                  </div>
                  
                  <div class="timeline-step" :class="{ 'active': delivery.delivery_status === 'Started' || delivery.delivery_status === 'In Transit' || delivery.delivery_status === 'Delivered' }">
                    <div class="step-icon started">
                      <q-icon name="play_circle" />
                    </div>
                    <div class="step-content">
                      <div class="step-title">Started</div>
                      <div class="step-time">{{ delivery.start_time ? formatDateTime(delivery.start_time) : 'Pending' }}</div>
                    </div>
                  </div>
                  
                  <div class="timeline-step" :class="{ 'active': delivery.delivery_status === 'In Transit' || delivery.delivery_status === 'Delivered' }">
                    <div class="step-icon in-transit">
                      <q-icon name="local_shipping" />
                    </div>
                    <div class="step-content">
                      <div class="step-title">In Transit</div>
                      <div class="step-time">{{ delivery.in_transit_time ? formatDateTime(delivery.in_transit_time) : 'Pending' }}</div>
                    </div>
                  </div>
                  
                  <div class="timeline-step" :class="{ 'active': delivery.delivery_status === 'Delivered' }">
                    <div class="step-icon delivered">
                      <q-icon name="check_circle" />
                    </div>
                    <div class="step-content">
                      <div class="step-title">Delivered</div>
                      <div class="step-time">{{ delivery.end_time ? formatDateTime(delivery.end_time) : 'Pending' }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="row justify-end q-mt-md">
                  <q-btn 
                    flat 
                    round 
                    color="primary" 
                    icon="visibility" 
                    size="sm" 
                    @click="viewDeliveryDetails(delivery)"
                    class="q-mr-sm"
                  >
                    <q-tooltip>View Details</q-tooltip>
                  </q-btn>
                  <q-btn 
                    v-if="delivery.delivery_status === 'In Transit'"
                    flat 
                    round 
                    color="amber" 
                    icon="map" 
                    size="sm" 
                    @click="trackDelivery(delivery)"
                  >
                    <q-tooltip>Track on Map</q-tooltip>
                  </q-btn>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="empty-state">
          <div class="empty-state-icon">
            <q-icon name="local_shipping" size="4rem" color="grey-4" />
          </div>
          <div class="text-h5 text-weight-bold text-grey-6 q-mt-md">No delivery tracking data found</div>
          <div class="text-body1 text-grey-5 q-mt-sm">Try adjusting your filter settings</div>
        </div>
      </q-card-section>
    </q-card>
    
    <!-- Recent Orders Section - Matching Admin & Vendor Table Design -->
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
              @click="fetchRequirements"
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
          row-key="id"
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
                @click="viewOrder(props.row.id)"
              >
                <q-tooltip>View Order</q-tooltip>
              </q-btn>
              <q-btn
                v-if="props.row.order_status === 'CUSTOMER_QUOTE_CREATED'"
                flat round color="green"
                icon="check" size="sm"
                @click="acceptQuote(props.row.id)"
                class="q-ml-xs"
              >
                <q-tooltip>Accept Quote</q-tooltip>
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
    
    <!-- Delivery Details Dialog -->
    <q-dialog v-model="showDeliveryDetailsDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="dialog-card">
        <q-card-section class="dialog-header">
          <div class="row items-center">
            <div class="dialog-icon">
              <q-icon name="local_shipping" size="1.5rem" color="primary" />
            </div>
            <div class="q-ml-md">
              <div class="text-h5 text-weight-bold">Delivery Details</div>
              <div class="text-caption text-grey-6">Complete delivery information</div>
            </div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup color="grey-7" />
          </div>
        </q-card-section>
        
        <q-separator />
        
        <q-card-section v-if="selectedDelivery" class="q-pa-xl">
          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-6">
              <q-card flat bordered class="info-card">
                <q-card-section class="q-pa-lg">
                  <div class="text-h6 text-weight-bold text-primary q-mb-md">Order Information</div>
                  <q-list>
                    <q-item>
                      <q-item-section>
                        <q-item-label overline class="text-weight-medium">Order Number</q-item-label>
                        <q-item-label class="text-h6 text-weight-bold">{{ selectedDelivery.order_number }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    
                    <q-item>
                      <q-item-section>
                        <q-item-label overline class="text-weight-medium">Booking Number</q-item-label>
                        <q-item-label class="text-body1">{{ selectedDelivery.booking_number }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    
                    <q-item>
                      <q-item-section>
                        <q-item-label overline class="text-weight-medium">Order Date</q-item-label>
                        <q-item-label class="text-body1">{{ formatDate(selectedDelivery.order_date) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    
                    <q-item>
                      <q-item-section>
                        <q-item-label overline class="text-weight-medium">Status</q-item-label>
                        <q-item-label>
                          <q-chip 
                            :color="getDeliveryStatusColor(selectedDelivery.delivery_status)" 
                            text-color="white" 
                            size="md"
                            class="text-weight-medium"
                          >
                            {{ selectedDelivery.delivery_status }}
                          </q-chip>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
            
            <div class="col-12 col-md-6">
              <q-card flat bordered class="info-card">
                <q-card-section class="q-pa-lg">
                  <div class="text-h6 text-weight-bold text-primary q-mb-md">Driver Information</div>
                  <q-list>
                    <q-item>
                      <q-item-section>
                        <q-item-label overline class="text-weight-medium">Driver Name</q-item-label>
                        <q-item-label class="text-body1">{{ selectedDelivery.driver_name || 'Not assigned' }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    
                    <q-item>
                      <q-item-section>
                        <q-item-label overline class="text-weight-medium">Contact</q-item-label>
                        <q-item-label class="text-body1">{{ selectedDelivery.driver_contact || 'Not available' }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>
          
          <q-separator class="q-my-xl" />
          
          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-6">
              <q-card flat bordered class="info-card">
                <q-card-section class="q-pa-lg">
                  <div class="text-h6 text-weight-bold text-primary q-mb-md">Location Details</div>
                  <q-list>
                    <q-item>
                      <q-item-section>
                        <q-item-label overline class="text-weight-medium">Pickup Location</q-item-label>
                        <q-item-label class="text-body1">{{ selectedDelivery.source_location }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    
                    <q-item>
                      <q-item-section>
                        <q-item-label overline class="text-weight-medium">Destination</q-item-label>
                        <q-item-label class="text-body1">{{ selectedDelivery.destination_location }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
            
            <div class="col-12 col-md-6">
              <q-card flat bordered class="info-card">
                <q-card-section class="q-pa-lg">
                  <div class="text-h6 text-weight-bold text-primary q-mb-md">Delivery Timeline</div>
                  <div class="status-timeline">
                    <div class="timeline-step" :class="{ 'active': selectedDelivery.delivery_status === 'Assigned' || selectedDelivery.delivery_status !== 'Assigned' }">
                      <div class="step-icon assigned">
                        <q-icon name="assignment" />
                      </div>
                      <div class="step-content">
                        <div class="step-title">Assigned</div>
                        <div class="step-time">{{ selectedDelivery.assigned_time ? formatDateTime(selectedDelivery.assigned_time) : 'Pending' }}</div>
                      </div>
                    </div>
                    
                    <div class="timeline-step" :class="{ 'active': selectedDelivery.delivery_status === 'Started' || selectedDelivery.delivery_status === 'In Transit' || selectedDelivery.delivery_status === 'Delivered' }">
                      <div class="step-icon started">
                        <q-icon name="play_circle" />
                      </div>
                      <div class="step-content">
                        <div class="step-title">Started</div>
                        <div class="step-time">{{ selectedDelivery.start_time ? formatDateTime(selectedDelivery.start_time) : 'Pending' }}</div>
                      </div>
                    </div>
                    
                    <div class="timeline-step" :class="{ 'active': selectedDelivery.delivery_status === 'In Transit' || selectedDelivery.delivery_status === 'Delivered' }">
                      <div class="step-icon in-transit">
                        <q-icon name="local_shipping" />
                      </div>
                      <div class="step-content">
                        <div class="step-title">In Transit</div>
                        <div class="step-time">{{ selectedDelivery.in_transit_time ? formatDateTime(selectedDelivery.in_transit_time) : 'Pending' }}</div>
                      </div>
                    </div>
                    
                    <div class="timeline-step" :class="{ 'active': selectedDelivery.delivery_status === 'Delivered' }">
                      <div class="step-icon delivered">
                        <q-icon name="check_circle" />
                      </div>
                      <div class="step-content">
                        <div class="step-title">Delivered</div>
                        <div class="step-time">{{ selectedDelivery.end_time ? formatDateTime(selectedDelivery.end_time) : 'Pending' }}</div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          
          <q-separator class="q-my-xl" />
          
          <div class="row q-gutter-md justify-center">
            <q-btn 
              v-if="selectedDelivery.delivery_status === 'In Transit'"
              color="amber" 
              label="Track on Map" 
              icon="map"
              size="lg" 
              @click="trackDelivery(selectedDelivery)"
            />
            <q-btn 
              color="primary" 
              label="Close" 
              icon="close"
              size="lg" 
              v-close-popup
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { CommonService } from '@/services/CommonService';
import { useQuasar } from 'quasar';
const router = useRouter();
const $q = useQuasar();
const loading = ref(false);
const deliveryLoading = ref(false);
const dateRange = ref({
  start: '',
  end: ''
});
const deliveryDateRange = ref({
  start: '',
  end: ''
});
const showDeliveryDetailsDialog = ref(false);
const selectedDelivery = ref(null);
// Stats matching API response
const stats = ref({
  accepted_requirements: "0",
  pending_quotes: "0",
  active_bookings: "0",
  pending_deliveries: "0"
});
const recentOrders = ref([]);
const deliveryTracking = ref([]);
// Updated columns to match API response
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
    name: 'material', 
    label: 'Material', 
    field: 'material', 
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
    name: 'expected_date', 
    label: 'Expected Date', 
    field: 'expected_date', 
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
const getDeliveryStatusColor = (status) => {
  const colors = {
    'Assigned': 'orange',
    'Started': 'blue',
    'In Transit': 'amber',
    'Delivered': 'positive'
  };
  return colors[status] || 'grey';
};
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return dateTimeString;
  }
};
const createOrder = () => {
  router.push('/orders/create');
};
const viewOrders = () => {
  router.push('/orders');
};
const viewQuotes = () => {
  router.push('/customer-quotes');
};
const viewDeliveryTracking = () => {
  // Scroll to delivery tracking section
  const element = document.querySelector('.delivery-tracking-section');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
const viewOrder = (orderId) => {
  router.push(`/orders/${orderId}`);
};
const acceptQuote = (orderId) => {
  router.push(`/customer-quotes/${orderId}`);
};
const viewDeliveryDetails = (delivery) => {
  selectedDelivery.value = delivery;
  showDeliveryDetailsDialog.value = true;
};
const trackDelivery = (delivery) => {
  // In a real app, this would open a map view with the delivery location
  $q.notify({
    type: 'info',
    message: `Tracking delivery for order ${delivery.order_number}`,
    position: 'top'
  });
  
  // You could navigate to a map page or open a map dialog here
  // router.push(`/track-delivery/${delivery.order_number}`);
};
const clearDateFilter = () => {
  dateRange.value.start = '';
  dateRange.value.end = '';
  fetchRequirements();
};
const clearDeliveryDateFilter = () => {
  deliveryDateRange.value.start = '';
  deliveryDateRange.value.end = '';
  fetchDeliveryTracking();
};
const fetchDashboardData = async () => {
  loading.value = true;
  try {
    // Fetch stats using correct API endpoint
    const statsResponse = await CommonService.GetAll('/v1/CustomerDashboard/stats');
    stats.value = statsResponse || {
      accepted_requirements: "0",
      pending_quotes: "0",
      active_bookings: "0",
      pending_deliveries: "0"
    };
    
    // Fetch recent orders using correct API endpoint
    fetchRequirements();
    
    // Fetch delivery tracking data
    fetchDeliveryTracking();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    loading.value = false;
  }
};
const fetchRequirements = async () => {
  loading.value = true;
  try {
    let url = '/v1/CustomerDashboard/recent-requirements';
    if (dateRange.value.start && dateRange.value.end) {
      url += `?startDate=${dateRange.value.start}&endDate=${dateRange.value.end}`;
    }
    const ordersResponse = await CommonService.GetAll(url);
    recentOrders.value = ordersResponse || [];
  } catch (error) {
    console.error('Error fetching requirements:', error);
  } finally {
    loading.value = false;
  }
};
const fetchDeliveryTracking = async () => {
  deliveryLoading.value = true;
  try {
    let url = '/v1/CustomerDashboard/delivery-tracking';
    if (deliveryDateRange.value.start) {
      url += `?startDate=${deliveryDateRange.value.start}`;
    }
    const deliveryResponse = await CommonService.GetAll(url);
    deliveryTracking.value = deliveryResponse || [];
  } catch (error) {
    console.error('Error fetching delivery tracking:', error);
  } finally {
    deliveryLoading.value = false;
  }
};
onMounted(() => {
  fetchDashboardData();
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
/* Dialog Enhancements */
.dialog-card {
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}
.dialog-header {
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 24px;
}
.dialog-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(25, 118, 210, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.info-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(0, 0, 0, 0.01);
}
/* Delivery tracking section */
.delivery-tracking-section {
  scroll-margin-top: 20px;
}
/* Delivery Timeline Styles */
.delivery-timeline-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.delivery-timeline-item {
  width: 100%;
}
.delivery-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  background: white;
}
.delivery-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
.status-timeline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin: 1.5rem 0;
  position: relative;
}
.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 22%;
  position: relative;
  z-index: 2;
}
.timeline-step.active .step-icon {
  transform: scale(1.1);
}
.step-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}
.step-icon.assigned {
  background-color: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}
.step-icon.started {
  background-color: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}
.step-icon.in-transit {
  background-color: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}
.step-icon.delivered {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}
.timeline-step.active .step-icon.assigned {
  background-color: #ff9800;
  color: white;
}
.timeline-step.active .step-icon.started {
  background-color: #2196f3;
  color: white;
}
.timeline-step.active .step-icon.in-transit {
  background-color: #ffc107;
  color: white;
}
.timeline-step.active .step-icon.delivered {
  background-color: #4caf50;
  color: white;
}
.step-content {
  text-align: center;
}
.step-title {
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 4px;
}
.step-time {
  font-size: 0.75rem;
  color: #757575;
}
/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}
.empty-state-icon {
  display: inline-block;
  padding: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.04);
  margin-bottom: 16px;
}
/* Responsive Design */
@media (max-width: 768px) {
  .status-timeline {
    flex-direction: column;
    gap: 1rem;
  }
  
  .timeline-step {
    width: 100%;
    flex-direction: row;
    align-items: flex-start;
  }
  
  .step-icon {
    margin-right: 1rem;
    margin-bottom: 0;
  }
  
  .step-content {
    text-align: left;
  }
}
</style>