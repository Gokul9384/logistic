<!-- src/layouts/MainLayout.vue -->
<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <!-- Header -->
    <q-header elevated class="bg-white text-grey-8 q-py-xs" height-hint="58">
      <q-toolbar>
        <!-- Left: Menu -->
        <q-btn flat dense round @click="toggleLeftDrawer" aria-label="Menu" icon="menu" />
        <!-- Logo -->
        <img src="../assets/logo.png" alt="Logo" height="36" class="q-ml-sm" />
        <q-space />
        <!-- Right: Notifications + User Info -->
        <div class="q-gutter-sm row items-center no-wrap">
          <!-- Notification -->
          <q-btn 
            round 
            dense 
            flat 
            color="grey-8" 
            icon="notifications"
            @mouseover="showNotificationMenu = true"
          >
            <q-badge
              v-if="unreadNotificationCount > 0"
              color="red"
              text-color="white"
              floating
            >
              {{ unreadNotificationCount }}
            </q-badge>
            <q-tooltip>Notifications</q-tooltip>
            
            <!-- Notification Menu -->
            <q-menu 
              v-model="showNotificationMenu"
              @mouseleave="showNotificationMenu = false"
              anchor="bottom right"
              self="top right"
              :offset="[0, 10]"
              fit
              style="min-width: 350px; max-height: 400px;"
            >
              <q-card style="width: 100%">
                <q-card-section class="row items-center justify-between q-pa-sm">
                  <div class="text-subtitle1">Notifications</div>
                </q-card-section>
                
                <q-separator />
                
                <q-card-section class="scroll" style="max-height: 300px;">
                  <div v-if="isLoadingNotifications" class="flex flex-center q-pa-md">
                    <q-spinner color="primary" size="2em" />
                  </div>
                  
                  <div v-else-if="notifications.length === 0" class="text-center q-pa-md text-grey">
                    No notifications
                  </div>
                  
                  <q-list v-else separator>
                    <q-item 
                      v-for="notification in notifications" 
                      :key="notification.id"
                      clickable 
                      v-ripple
                      :class="{ 'bg-blue-1': !notification.is_read }"
                      @click="handleNotificationClick(notification)"
                    >
                      <q-item-section avatar>
                        <q-icon 
                          :name="notification.is_read ? 'mark_email_read' : 'mark_email_unread'" 
                          :color="notification.is_read ? 'grey' : 'blue'"
                        />
                      </q-item-section>
                      
                      <q-item-section>
                        <q-item-label class="text-weight-medium">{{ notification.title }}</q-item-label>
                        <q-item-label caption lines="2">{{ notification.message }}</q-item-label>
                        <q-item-label caption class="text-grey">
                          {{ formatNotificationDate(notification.created_on) }}
                        </q-item-label>
                      </q-item-section>
                      
                      <q-item-section side>
                        <q-icon 
                          v-if="!notification.is_read" 
                          name="circle" 
                          color="blue" 
                          size="xs" 
                          class="q-mt-xs"
                        />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                
                <q-separator v-if="notifications.length > 0" />
                

              </q-card>
            </q-menu>
          </q-btn>
          
          <!-- User Info -->
          <div class="text-right q-mr-sm">
            <div class="text-subtitle2">{{ authStore.role?.name || 'User' }}</div>
            <div class="text-caption text-grey-7">{{ authStore.user?.email || 'user@example.com' }}</div>
          </div>
          
          <!-- Avatar -->
          <q-btn round flat @click="handleLogout">
            <q-avatar size="32px" class="cursor-pointer">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              <q-tooltip anchor="top middle" self="bottom middle">
                Logout
              </q-tooltip>
            </q-avatar>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    
    <!-- Sidebar -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-2" :width="240">
      <q-scroll-area class="fit">
        <q-list padding>
          <!-- Dashboard - Always show for authenticated users -->
          <q-item 
            clickable 
            v-ripple 
            :to="dashboardRoute"
          >
            <q-item-section avatar>
              <q-icon name="dashboard" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
            </q-item-section>
          </q-item>
          
          <!-- Dynamic Sections from Configuration -->
          <template v-for="section in visibleMenuSections" :key="section.name">
            <q-expansion-item 
              :icon="section.icon" 
              :label="section.label" 
              :default-opened="section.name === 'operations'"
              header-class="text-bold"
            >
              <q-item 
                v-for="item in getVisibleItems(section)" 
                :key="item.name"
                clickable 
                v-ripple 
                :to="item.route"
              >
                <q-item-section avatar>
                  <q-icon :name="item.icon" />
                </q-item-section>
                <q-item-section>{{ item.label }}</q-item-section>
              </q-item>
            </q-expansion-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    
    <!-- Page -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { CommonHelper } from '@/helpers/CommonHelper'
import { CommonService } from '@/services/CommonService'
import { menuSections } from '@/config/menuConfig'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

// Layout state
const leftDrawerOpen = ref(false)
const toggleLeftDrawer = () => (leftDrawerOpen.value = !leftDrawerOpen.value)

// Notification state
const notifications = ref([])
const isLoadingNotifications = ref(false)
const showNotificationMenu = ref(false)
const refreshInterval = ref(null)

// Computed properties for reactive values
const userRole = computed(() => authStore.userRole)
const userPermissions = computed(() => authStore.userPermissions)
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Computed properties
const unreadNotificationCount = computed(() => {
  if (!notifications.value || !Array.isArray(notifications.value)) {
    return 0
  }
  return notifications.value.filter(n => !n.is_read && !n.read).length
})

// Dashboard route computed property
const dashboardRoute = computed(() => {
  const roleRoutes = {
    '': '/dashboard',     // Super Admin
    'A': '/admin_dashboard',    // Admin
    'V': '/vendor_dashboard',  // Vendor
    'C': '/customer_dashboard', // Customer
    'D': '/driver_dashboard'   // Driver
  }
  
  return roleRoutes[userRole.value] || '/dashboard'
})

// Filter visible menu sections
const visibleMenuSections = computed(() => {
  if (!menuSections || !Array.isArray(menuSections)) return []
  return menuSections.filter(section => canShowSection(section))
})

// Get visible items for a section
const getVisibleItems = (section) => {
  if (!section?.items) return []
  return section.items.filter(item => canShowMenuItem(item.permission))
}

// Permission-based menu visibility
const canShowMenuItem = (permission) => {
  if (userRole.value === undefined || userRole.value === null) return false
  if (userRole.value === '') return true
  return authStore.hasPermission(permission)
}

const canShowSection = (section) => {
  if (userRole.value === undefined || userRole.value === null) return false
  if (userRole.value === '') return true
  return authStore.hasAnyPermission(section.permissions)
}

// Format notification date
const formatNotificationDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.round(diffMs / 60000)
  const diffHours = Math.round(diffMs / 3600000)
  const diffDays = Math.round(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString()
}


// Handle notification click
const handleNotificationClick = async (notification) => {
  debugger
  showNotificationMenu.value = false
  
  const notificationData = { ...notification }
  
  if (!notificationData.is_read) {
    try {
      await markAsRead(notificationData.id)
      const index = notifications.value.findIndex(n => n.id === notificationData.id)
      if (index !== -1) {
        notifications.value[index].is_read = true
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }
  
  // Handle routing
  if (notificationData.route_module && notificationData.route_id) {      
    const routePath = `/${notificationData.route_module}/${notificationData.route_id}`
    console.log("Navigating to:", routePath)
    
    // Navigate to the route
    router.push(routePath)
  } 
}


// Mark notification as read
const markAsRead = async (notificationId) => {
    debugger
  const Id = notificationId;
  const Tse = `/v1/Notification/MarkAsRead/${Id}`
   await CommonService.CommonPut({},`/v1/Notification/MarkAsRead/${Id}`)
  // Update local notification state
  const notificationIndex = notifications.value.findIndex(n => n.id === notificationId)
  if (notificationIndex !== -1) {
    notifications.value[notificationIndex].is_read = true
  }
}



// Lifecycle hooks
onMounted(() => {
  initializeAuth()
  fetchNotifications()
  refreshInterval.value = setInterval(fetchNotifications, 10000)
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})

// Auth initialization
const initializeAuth = () => {
  if (!isAuthenticated.value) {
    authStore.initialize()
  }
}

// Notification functions
const fetchNotifications = async () => {
  isLoadingNotifications.value = true
  const response = await CommonService.GetAll('/v1/Notification/List')
  
  let notificationData = []
  if (response && Array.isArray(response)) {
    notificationData = response
  }
  
  notifications.value = notificationData.map(notification => ({
    id: notification.id,
    title: notification.title,
    message: notification.message,
    is_read: notification.is_read,
    created_on: notification.created_on,
    route_module: notification.route_module,
    route_id: notification.route_id
  }))
  
  isLoadingNotifications.value = false
}

// Logout handler
const handleLogout = () => {
  $q.dialog({
    title: 'Confirm Logout',
    message: 'Are you sure you want to logout?',
    cancel: true,
    persistent: true,
    ok: {
      color: 'primary',
      label: 'Logout'
    },
    cancel: {
      color: 'grey',
      flat: true
    }
  }).onOk(() => {
    CommonHelper.ClearLocalStorage()
    $q.notify({
      type: 'positive',
      message: 'Logged out successfully',
      timeout: 2000
    })
    setTimeout(() => {
      router.push('/auth/login')
      window.location.reload()
    }, 400)
  })
}
</script>