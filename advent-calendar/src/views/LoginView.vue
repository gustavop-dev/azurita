<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

const HARDCODED_USERNAME = 'ANOMALIA'
const HARDCODED_PASSWORD = 'MCTPJSI'

const handleLogin = () => {
  error.value = ''
  
  if (username.value === HARDCODED_USERNAME && password.value === HARDCODED_PASSWORD) {
    // Guardar en localStorage
    localStorage.setItem('authenticated', 'true')
    localStorage.setItem('username', username.value)
    
    // Redirigir a home
    router.push('/')
  } else {
    error.value = 'Credenciales incorrectas'
    password.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-8 bg-christmas-cream">
    <div class="login-wrapper">
      <!-- Lucecitas de navidad -->
      <div class="light light-red" style="top: 0; left: 10%;"></div>
      <div class="light light-green" style="top: 0; left: 25%;"></div>
      <div class="light light-yellow" style="top: 0; left: 40%;"></div>
      <div class="light light-red" style="top: 0; left: 55%;"></div>
      <div class="light light-cyan" style="top: 0; left: 70%;"></div>
      <div class="light light-magenta" style="top: 0; left: 85%;"></div>
      
      <div class="light light-yellow" style="top: 25%; left: 0;"></div>
      <div class="light light-magenta" style="top: 50%; left: 0;"></div>
      <div class="light light-cyan" style="top: 75%; left: 0;"></div>
      
      <div class="light light-green" style="top: 25%; right: 0;"></div>
      <div class="light light-red" style="top: 50%; right: 0;"></div>
      <div class="light light-yellow" style="top: 75%; right: 0;"></div>
      
      <div class="light light-green" style="bottom: 0; left: 10%;"></div>
      <div class="light light-red" style="bottom: 0; left: 25%;"></div>
      <div class="light light-magenta" style="bottom: 0; left: 40%;"></div>
      <div class="light light-cyan" style="bottom: 0; left: 55%;"></div>
      <div class="light light-yellow" style="bottom: 0; left: 70%;"></div>
      <div class="light light-green" style="bottom: 0; left: 85%;"></div>
      
      <div class="login-card">
        <h2 class="login-title">Iniciar sesión</h2>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label class="form-label">Usuario</label>
            <input
              v-model="username"
              type="text"
              required
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <input
              v-model="password"
              type="password"
              required
              class="form-input"
            />
          </div>
          
          <p v-if="error" class="error-message">
            {{ error }}
          </p>
          
          <button type="submit" class="submit-button">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  position: relative;
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: white;
  border-radius: 1rem;
  padding: 3rem 2.5rem;
  border: 4px solid #000000;
  box-shadow: 8px 8px 0px 0px rgba(220, 38, 38, 0.3);
  width: 100%;
  position: relative;
}

.light {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  z-index: 1000;
  animation: twinkle 2s infinite alternate;
  box-shadow: 0 0 10px currentColor;
}

.light-red {
  background: #ff0000;
  color: #ff0000;
}

.light-green {
  background: #00ff00;
  color: #00ff00;
}

.light-yellow {
  background: #ffff00;
  color: #ffff00;
}

.light-cyan {
  background: #00ffff;
  color: #00ffff;
}

.light-magenta {
  background: #ff00ff;
  color: #ff00ff;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.9);
  }
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2.5rem;
  position: relative;
  z-index: 2;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  z-index: 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  outline: none;
}

.form-input:focus {
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  background: white;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
}

.submit-button {
  width: 100%;
  padding: 1rem;
  background: #a8e6cf;
  color: #1a1a1a;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
}

.submit-button:hover {
  background: #8dd9b8;
}

.submit-button:active {
  transform: translateY(2px);
}
</style>
