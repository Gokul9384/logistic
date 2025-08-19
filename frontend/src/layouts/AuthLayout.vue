<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <div class="auth-layout">
        <!-- Background Elements -->
        <div class="auth-bg-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
        
        <div class="auth-container">
          <!-- Left Side - Full Image -->
          <div class="auth-image">
            <div class="image-overlay"></div>
          </div>
          
          <!-- Right Side - Auth Form -->
          <div class="auth-form-container">
            <q-card class="auth-card" flat>
              <router-view />
            </q-card>
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
/* Color Variables */
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --card-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  --border-radius: 24px;
  --spacing-lg: 2rem;
  --spacing-md: 1rem;
}

.auth-layout {
  min-height: 100vh;
  background: var(--primary-gradient);
  position: relative;
  overflow: hidden;
}

.auth-bg-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(2px);
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -150px;
  animation: float 6s ease-in-out infinite;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: -100px;
  animation: float 8s ease-in-out infinite reverse;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  animation: float 7s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

.auth-container {
  position: relative;
  z-index: 2;
  min-height: 100vh; /* Changed from height to min-height */
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 100%;
  margin: 0 auto;
  gap: 0;
}

/* Left Side - Full Image */
.auth-image {
  position: relative;
  background-image: url('../assets/loginbg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100%;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1;
}

/* Right Side - Form Container */
.auth-form-container {
  display: flex;
  align-items: flex-start; /* Changed from center to flex-start */
  justify-content: center;
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.95);
  overflow: visible; /* Changed from hidden to visible */
  min-height: 100vh; /* Changed from height to min-height */
}

.auth-card {
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
  overflow: visible;
  position: relative;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: var(--border-radius);
  z-index: -1;
}

/* Mobile Responsiveness */
@media (max-width: 1024px) {
  .auth-container {
    grid-template-columns: 1fr;
  }
  
  .auth-image {
    min-height: 40vh;
    height: 40vh;
  }
  
  .auth-form-container {
    padding: var(--spacing-md);
    min-height: 60vh; /* Changed from height to min-height */
    height: auto; /* Allow height to grow with content */
  }
}

@media (max-width: 768px) {
  .auth-image {
    min-height: 30vh;
    height: 30vh;
  }
  
  .auth-form-container {
    padding: 1rem;
    min-height: 70vh; /* Changed from height to min-height */
    height: auto; /* Allow height to grow with content */
  }
  
  .auth-card {
    border-radius: 16px;
  }
  
  .shape-1,
  .shape-2,
  .shape-3 {
    opacity: 0.3;
  }
}

@media (max-width: 480px) {
  :root {
    --spacing-lg: 1.5rem;
    --spacing-md: 0.75rem;
  }
  
  .auth-image {
    min-height: 25vh;
    height: 25vh;
  }
  
  .auth-form-container {
    padding: 0.75rem;
    min-height: 75vh; /* Changed from height to min-height */
    height: auto; /* Allow height to grow with content */
  }
  
  .auth-card {
    border-radius: 12px;
  }
  
  .shape-1 {
    width: 200px;
    height: 200px;
    top: -100px;
    right: -100px;
  }
  
  .shape-2 {
    width: 150px;
    height: 150px;
    bottom: -75px;
    left: -75px;
  }
  
  .shape-3 {
    width: 100px;
    height: 100px;
  }
}

@media (max-width: 360px) {
  .auth-image {
    min-height: 20vh;
    height: 20vh;
  }
  
  .auth-form-container {
    padding: 0.5rem;
    min-height: 80vh; /* Changed from height to min-height */
    height: auto; /* Allow height to grow with content */
  }
  
  .auth-card {
    border-radius: 8px;
  }
}
</style>