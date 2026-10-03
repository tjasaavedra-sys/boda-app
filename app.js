// Archivo: app.js

/**
 * CONFIGURACIÓN DE FIREBASE Y BACKEND (Preparado para conectar sin exponer claves directamente)
 * Cuando desees migrar de localStorage a Firebase Cloud, simplemente completa este objeto:
 */
const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// ==========================================
// ESTADO Y BASE DE DATOS LOCAL (localStorage)
// ==========================================
const STORAGE_KEY = 'wedding_planner_data_v1';

const INITIAL_STATE = {
  weddingDetails: {
    coupleNames: "Ana & Carlos",
    date: "2027-09-18",
    location: "Hacienda El Paraíso",
    totalBudget: 15000
  },
  guests: [
    {
      id: "guest-1",
      name: "María García",
      email: "maria@example.com",
      phone: "+34 612 345 678",
      group: "Familia Novia",
      status: "Confirmado", // Confirmado, Pendiente, Rechazado
      menu: "Adulto", // Adulto, Niño, Vegetariano, Vegano, Celiaco
      allergies: "Intolerante a la lactosa",
      plusOneAllowed: true,
      plusOneName: "Juan Pérez",
      plusOneMenu: "Adulto",
      table: "Mesa 1",
      notes: "Necesita transporte desde el hotel"
    },
    {
      id: "guest-2",
      name: "Roberto Gómez",
      email: "roberto@example.com",
      phone: "+34 622 987 654",
      group: "Amigos Novio",
      status: "Pendiente",
      menu: "Vegetariano",
      allergies: "Ninguna",
      plusOneAllowed: false,
      plusOneName: "",
      plusOneMenu: "Sin menú",
      table: "Sin asignar",
      notes: ""
    }
  ],
  tasks: [
    { id: "t1", title: "Reservar el lugar de la ceremonia", status: "completada" },
    { id: "t2", title: "Elegir fotógrafo profesional", status: "completada" },
    { id: "t3", title: "Enviar invitaciones a la lista preliminar", status: "pendiente" },
    { id: "t4", title: "Prueba de menú del banquete", status: "pendiente" }
  ],
  expenses: [
    { id: "e1", title: "Lugar del evento", total: 5000, paid: 2000 },
    { id: "e2", title: "Catering", total: 6000, paid: 1000 }
  ],
  webhooks: {
    endpointUrl: "",
    authToken: ""
  }
};

let store = loadData();

function loadData() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATE));
    return INITIAL_STATE;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_STATE;
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  updateUI();
}

// ==========================================
// DEFINICIÓN DE MÓDULOS DE NAVEGACIÓN
// ==========================================
const MODULES = [
  { id: 'resumen', name: 'Resumen', icon: 'layout-dashboard' },
  { id: 'invitados', name: 'Invitados', icon: 'users' },
  { id: 'espacios', name: 'Espacios', icon: 'map-pin' },
  { id: 'proveedores', name: 'Proveedores', icon: 'briefcase' },
  { id: 'web-invitados', name: 'Sitio Web', icon: 'globe' },
  { id: 'tareas', name: 'Tareas', icon: 'check-square' },
  { id: 'presupuesto', name: 'Presupuesto', icon: 'wallet' },
  { id: 'itinerario', name: 'Itinerario', icon: 'clock' },
  { id: 'mesas', name: 'Mesas', icon: 'grid' },
  { id: 'notas', name: 'Notas', icon: 'file-text' },
  { id: 'configuracion', name: 'Configuración', icon: 'settings' }
];

let activeModule = 'resumen';

// ==========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();
  renderNavigation();
  switchModule('resumen');
  setupPWAInstaller();
});

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .catch(err => console.log('SW registration error:', err));
  }
}

let deferredPrompt;
function setupPWAInstaller() {
  const btn = document.getElementById('pwa-install-btn');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if(btn) btn.classList.remove('hidden');
  });

  if (btn) {
    btn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        btn.classList.add('hidden');
      }
      deferredPrompt = null;
    });
  }
}

// ==========================================
// RENDERIZADO DE MENÚS Y NAVEGACIÓN
// ==========================================
function renderNavigation() {
  const desktopNav = document.getElementById('desktop-menu');
  const mobileNav = document.getElementById('mobile-menu');

  if (desktopNav) {
    desktopNav.innerHTML = MODULES.map(mod => `
      <button onclick="switchModule('${mod.id}')" class="nav-item-transition group flex items-center w-full px-3 py-2.5 text-sm font-semibold rounded-xl transition-all ${
        activeModule === mod.id 
          ? 'bg-wedding-50 text-wedding-700 shadow-sm' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }">
        <i data-lucide="${mod.icon}" class="mr-3 h-5 w-5 ${activeModule === mod.id ? 'text-wedding-600' : 'text-slate-400 group-hover:text-slate-600'}"></i>
        ${mod.name}
      </button>
    `).join('');
  }

  if (mobileNav) {
    // En móvil mostramos los 5 módulos principales y un menú rápido
    const topMobile = ['resumen', 'invitados', 'tareas', 'presupuesto', 'configuracion'];
    const mobileModules = MODULES.filter(m => topMobile.includes(m.id));
    
    mobileNav.innerHTML = mobileModules.map(mod => `
      <button onclick="switchModule('${mod.id}')" class="flex flex-col items-center py-1.5 px-3 rounded-lg ${
        activeModule === mod.id ? 'text-wedding-600 font-bold' : 'text-slate-500 hover:text-slate-800'
      }">
        <i data-lucide="${mod.icon}" class="w-5 h-5"></i>
        <span class="text-[10px] mt-1">${mod.name}</span>
      </button>
    `).join('');
  }

  if (window.lucide) lucide.createIcons();
}

function switchModule(moduleId) {
  activeModule = moduleId;
  const modObj = MODULES.find(m => m.id === moduleId);
  
  const titleElem = document.getElementById('mobile-title');
  if (titleElem && modObj) titleElem.textContent = modObj.name;

  renderNavigation();
  renderModuleContent();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateUI() {
  renderNavigation();
  renderModuleContent();
}

// ==========================================
// ENRUTADOR Y RENDERIZADO DE CONTENIDO
// ==========================================
function renderModuleContent() {
  const container = document.getElementById('app-content');
  if (!container) return;

  switch (activeModule) {
    case 'resumen':
      container.innerHTML = renderResumenModule();
      break;
    case 'invitados':
      container.innerHTML = renderInvitadosModule();
      break;
    case 'configuracion':
      container.innerHTML = renderConfiguracionModule();
      break;
    default:
      container.innerHTML = `
        <div class="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-lg mx-auto my-12">
          <div class="p-4 bg-rose-50 text-wedding-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <i data-lucide="construction" class="w-8 h-8"></i>
          </div>
          <h2 class="text-xl font-bold text-slate-900 mb-2">Módulo en Preparación</h2>
          <p class="text-slate-500 text-sm mb-6">El módulo de <strong>${MODULES.find(m => m.id === activeModule)?.name}</strong> se integrará completamente en el siguiente paso de desarrollo.</p>
          <button onclick="switchModule('resumen')" class="bg-wedding-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-wedding-700 transition-colors shadow-sm">
            Volver al Resumen
          </button>
        </div>
      `;
  }
  if (window.lucide) lucide.createIcons();
}

// ==========================================
// MÓDULO 1: RESUMEN (PANEL Y PROGRESO VISUAL)
// ==========================================
function renderResumenModule() {
  const today = new Date();
  const weddingDate = new Date(store.weddingDetails.date);
  const diffTime = weddingDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const daysLeft = diffDays > 0 ? diffDays : 0;

  // Estadísticas rápidas
  const totalGuests = store.guests.reduce((acc, g) => acc + 1 + (g.plusOneAllowed && g.plusOneName ? 1 : 0), 0);
  const confirmedGuests = store.guests.reduce((acc, g) => {
    let count = g.status === 'Confirmado' ? 1 : 0;
    if (g.status === 'Confirmado' && g.plusOneAllowed && g.plusOneName) count += 1;
    return acc + count;
  }, 0);

  const completedTasks = store.tasks.filter(t => t.status === 'completada').length;
  const totalTasks = store.tasks.length;
  const taskPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalExpenseBudget = store.expenses.reduce((acc, e) => acc + e.total, 0);
  const paidExpenses = store.expenses.reduce((acc, e) => acc + e.paid, 0);

  return `
    <div class="space-y-6 animate-fade-in">
      
      <!-- HERO BANNER CON CONTEO REGRESIVO -->
      <div class="relative overflow-hidden bg-gradient-to-r from-wedding-800 via-wedding-700 to-wedding-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <i data-lucide="heart" class="w-3.5 h-3.5 fill-current"></i>
              <span>${store.weddingDetails.location}</span>
            </div>
            <h2 class="text-2xl sm:text-4xl font-extrabold tracking-tight">${store.weddingDetails.coupleNames}</h2>
            <p class="text-rose-100 text-sm mt-1">Fecha oficial: ${new Date(store.weddingDetails.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center flex items-center justify-center min-w-[180px]">
            <div>
              <span class="text-4xl font-black block">${daysLeft}</span>
              <span class="text-xs font-medium text-rose-100 uppercase tracking-wider">Días Restantes</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TARJETAS DE PROGRESO GLOBAL -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <!-- Tarjeta Invitados -->
        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <i data-lucide="users" class="w-6 h-6"></i>
          </div>
          <div class="flex-1">
            <p class="text-xs font-semibold text-slate-500">Invitados Confirmados</p>
            <h3 class="text-xl font-bold text-slate-900 mt-0.5">${confirmedGuests} <span class="text-xs font-normal text-slate-400">/ ${totalGuests}</span></h3>
            <div class="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div class="bg-blue-600 h-1.5 rounded-full" style="width: ${totalGuests > 0 ? (confirmedGuests/totalGuests)*100 : 0}%"></div>
            </div>
          </div>
        </div>

        <!-- Tarjeta Tareas -->
        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <i data-lucide="check-circle-2" class="w-6 h-6"></i>
          </div>
          <div class="flex-1">
            <p class="text-xs font-semibold text-slate-500">Progreso de Tareas</p>
            <h3 class="text-xl font-bold text-slate-900 mt-0.5">${taskPercentage}%</h3>
            <div class="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div class="bg-emerald-500 h-1.5 rounded-full" style="width: ${taskPercentage}%"></div>
            </div>
          </div>
        </div>

        <!-- Tarjeta Presupuesto -->
        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <i data-lucide="wallet" class="w-6 h-6"></i>
          </div>
          <div class="flex-1">
            <p class="text-xs font-semibold text-slate-500">Pagado / Presupuestado</p>
            <h3 class="text-xl font-bold text-slate-900 mt-0.5">${paidExpenses}€ <span class="text-xs font-normal text-slate-400">/ ${totalExpenseBudget}€</span></h3>
            <div class="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div class="bg-purple-600 h-1.5 rounded-full" style="width: ${totalExpenseBudget > 0 ? (paidExpenses/totalExpenseBudget)*100 : 0}%"></div>
            </div>
          </div>
        </div>

      </div>

      <!-- CAMINO VISUAL Y ROADMAP -->
      <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <i data-lucide="milestone" class="w-5 h-5 text-wedding-600"></i>
          Línea de Tiempo del Planificador
        </h3>
        
        <div class="relative border-l-2 border-wedding-100 ml-4 space-y-6 pl-6 my-2">
          
          <div class="relative">
            <div class="absolute -left-[31px] top-0 p-1 bg-wedding-600 text-white rounded-full">
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
            </div>
            <h4 class="text-sm font-bold text-slate-900">Configuración Inicial y Presupuesto</h4>
            <p class="text-xs text-slate-500 mt-0.5">Definir fecha, presupuesto general y lista preliminar.</p>
          </div>

          <div class="relative">
            <div class="absolute -left-[31px] top-0 p-1 bg-wedding-600 text-white rounded-full">
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
            </div>
            <h4 class="text-sm font-bold text-slate-900">Reservar Espacios y Proveedores Clave</h4>
            <p class="text-xs text-slate-500 mt-0.5">Lugar de ceremonia, banquete, fotógrafo y música.</p>
          </div>

          <div class="relative">
            <div class="absolute -left-[31px] top-0 p-1 bg-wedding-200 text-wedding-800 rounded-full">
              <i data-lucide="clock" class="w-3.5 h-3.5"></i>
            </div>
            <h4 class="text-sm font-bold text-wedding-800">Gestión de Invitados y RSVP</h4>
            <p class="text-xs text-slate-500 mt-0.5">Enviar invitaciones, recolectar menús y alergias.</p>
          </div>

          <div class="relative">
            <div class="absolute -left-[31px] top-0 p-1 bg-slate-200 text-slate-500 rounded-full">
              <i data-lucide="circle" class="w-3.5 h-3.5"></i>
            </div>
            <h4 class="text-sm font-bold text-slate-400">Distribución de Mesas e Itinerario Final</h4>
            <p class="text-xs text-slate-400 mt-0.5">Asignación de asientos y cronograma hora por hora.</p>
          </div>

        </div>
      </div>

    </div>
  `;
}

// ==========================================
// MÓDULO 2: LISTA DE INVITADOS (COMPLETO CON CRUD Y RSVP)
// ==========================================
let guestSearchQuery = "";
let guestStatusFilter = "todos";

function renderInvitadosModule() {
  let filteredGuests = store.guests.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(guestSearchQuery.toLowerCase()) || 
                          g.group.toLowerCase().includes(guestSearchQuery.toLowerCase());
    const matchesStatus = guestStatusFilter === "todos" || g.status === guestStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Métricas
  const totalCount = store.guests.length;
  const confirmedCount = store.guests.filter(g => g.status === 'Confirmado').length;
  const pendingCount = store.guests.filter(g => g.status === 'Pendiente').length;
  const declinedCount = store.guests.filter(g => g.status === 'Rechazado').length;

  return `
    <div class="space-y-6 animate-fade-in">
      
      <!-- CABECERA DE MÓDULO -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Lista de Invitados</h2>
          <p class="text-slate-500 text-sm">Gestiona RSVP, menús especiales, acompañantes y mesas.</p>
        </div>
        <button onclick="openAddGuestModal()" class="inline-flex items-center justify-center gap-2 bg-wedding-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-wedding-700 transition-colors shadow-sm">
          <i data-lucide="user-plus" class="w-4 h-4"></i>
          Añadir Invitado
        </button>
      </div>

      <!-- MÉTRICAS DE INVITADOS -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div onclick="setGuestFilter('todos')" class="cursor-pointer bg-white p-4 rounded-2xl border ${guestStatusFilter === 'todos' ? 'border-wedding-500 ring-2 ring-wedding-100' : 'border-slate-100'} shadow-sm">
          <span class="text-xs font-semibold text-slate-500 block">Total</span>
          <span class="text-xl font-bold text-slate-900">${totalCount}</span>
        </div>
        <div onclick="setGuestFilter('Confirmado')" class="cursor-pointer bg-white p-4 rounded-2xl border ${guestStatusFilter === 'Confirmado' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-100'} shadow-sm">
          <span class="text-xs font-semibold text-emerald-600 block">Confirmados</span>
          <span class="text-xl font-bold text-emerald-700">${confirmedCount}</span>
        </div>
        <div onclick="setGuestFilter('Pendiente')" class="cursor-pointer bg-white p-4 rounded-2xl border ${guestStatusFilter === 'Pendiente' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-100'} shadow-sm">
          <span class="text-xs font-semibold text-amber-600 block">Pendientes</span>
          <span class="text-xl font-bold text-amber-700">${pendingCount}</span>
        </div>
        <div onclick="setGuestFilter('Rechazado')" class="cursor-pointer bg-white p-4 rounded-2xl border ${guestStatusFilter === 'Rechazado' ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-100'} shadow-sm">
          <span class="text-xs font-semibold text-rose-600 block">Rechazados</span>
          <span class="text-xl font-bold text-rose-700">${declinedCount}</span>
        </div>
      </div>

      <!-- BARRA DE BÚSQUEDA Y FILTROS -->
      <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <i data-lucide="search" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input type="text" value="${guestSearchQuery}" oninput="handleGuestSearch(this.value)" placeholder="Buscar por nombre o grupo..." class="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500 focus:bg-white transition-all">
        </div>
        <select onchange="setGuestFilter(this.value)" class="py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
          <option value="todos" ${guestStatusFilter === 'todos' ? 'selected' : ''}>Todos los estados</option>
          <option value="Confirmado" ${guestStatusFilter === 'Confirmado' ? 'selected' : ''}>Confirmados</option>
          <option value="Pendiente" ${guestStatusFilter === 'Pendiente' ? 'selected' : ''}>Pendientes</option>
          <option value="Rechazado" ${guestStatusFilter === 'Rechazado' ? 'selected' : ''}>Rechazados</option>
        </select>
      </div>

      <!-- TABLA DE INVITADOS (DESKTOP) / LISTA DE TARJETAS (MÓVIL) -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        ${filteredGuests.length === 0 ? `
          <div class="p-8 text-center text-slate-500">
            <i data-lucide="users" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
            <p class="text-sm">No se encontraron invitados con los criterios seleccionados.</p>
          </div>
        ` : `
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-600">
              <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th class="py-3.5 px-4">Invitado</th>
                  <th class="py-3.5 px-4">Grupo</th>
                  <th class="py-3.5 px-4">Estado RSVP</th>
                  <th class="py-3.5 px-4">Menú / Alergias</th>
                  <th class="py-3.5 px-4">Acompañante</th>
                  <th class="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${filteredGuests.map(g => `
                  <tr class="hover:bg-slate-50/50 transition-colors">
                    <td class="py-3.5 px-4 font-semibold text-slate-900">
                      <div>${g.name}</div>
                      <div class="text-xs text-slate-400 font-normal">${g.phone || g.email || 'Sin contacto'}</div>
                    </td>
                    <td class="py-3.5 px-4">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        ${g.group}
                      </span>
                    </td>
                    <td class="py-3.5 px-4">
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        g.status === 'Confirmado' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        g.status === 'Pendiente' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }">
                        ${g.status}
                      </span>
                    </td>
                    <td class="py-3.5 px-4">
                      <div class="text-slate-800 font-medium">${g.menu}</div>
                      ${g.allergies ? `<div class="text-xs text-rose-600 font-medium mt-0.5">⚠️ ${g.allergies}</div>` : ''}
                    </td>
                    <td class="py-3.5 px-4 text-xs">
                      ${g.plusOneAllowed ? `
                        <div class="font-medium text-slate-800">${g.plusOneName || 'Por definir'}</div>
                        <div class="text-slate-400">${g.plusOneMenu}</div>
                      ` : '<span class="text-slate-400">No permitido</span>'}
                    </td>
                    <td class="py-3.5 px-4 text-right">
                      <div class="flex items-center justify-end gap-1">
                        <button onclick="editGuest('${g.id}')" class="p-1.5 text-slate-400 hover:text-wedding-600 hover:bg-wedding-50 rounded-lg transition-colors">
                          <i data-lucide="edit-3" class="w-4 h-4"></i>
                        </button>
                        <button onclick="deleteGuest('${g.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                          <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>

    </div>
  `;
}

function handleGuestSearch(val) {
  guestSearchQuery = val;
  renderModuleContent();
}

function setGuestFilter(val) {
  guestStatusFilter = val;
  renderModuleContent();
}

// ==========================================
// MODAL DE GESTIÓN DE INVITADOS
// ==========================================
function openAddGuestModal(guestId = null) {
  const guest = guestId ? store.guests.find(g => g.id === guestId) : null;
  const isEdit = !!guest;

  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  modalTitle.textContent = isEdit ? 'Editar Invitado' : 'Añadir Nuevo Invitado';

  modalBody.innerHTML = `
    <form onsubmit="saveGuestForm(event, '${guestId || ''}')" class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo *</label>
        <input type="text" id="g-name" required value="${guest ? guest.name : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
          <input type="text" id="g-phone" value="${guest ? guest.phone : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Grupo</label>
          <select id="g-group" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
            <option value="Familia Novia" ${guest && guest.group === 'Familia Novia' ? 'selected' : ''}>Familia Novia</option>
            <option value="Familia Novio" ${guest && guest.group === 'Familia Novio' ? 'selected' : ''}>Familia Novio</option>
            <option value="Amigos Novia" ${guest && guest.group === 'Amigos Novia' ? 'selected' : ''}>Amigos Novia</option>
            <option value="Amigos Novio" ${guest && guest.group === 'Amigos Novio' ? 'selected' : ''}>Amigos Novio</option>
            <option value="Trabajo" ${guest && guest.group === 'Trabajo' ? 'selected' : ''}>Trabajo</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Estado RSVP</label>
          <select id="g-status" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
            <option value="Pendiente" ${guest && guest.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="Confirmado" ${guest && guest.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
            <option value="Rechazado" ${guest && guest.status === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Menú Específico</label>
          <select id="g-menu" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
            <option value="Adulto" ${guest && guest.menu === 'Adulto' ? 'selected' : ''}>Adulto</option>
            <option value="Niño" ${guest && guest.menu === 'Niño' ? 'selected' : ''}>Niño</option>
            <option value="Vegetariano" ${guest && guest.menu === 'Vegetariano' ? 'selected' : ''}>Vegetariano</option>
            <option value="Vegano" ${guest && guest.menu === 'Vegano' ? 'selected' : ''}>Vegano</option>
            <option value="Celiaco" ${guest && guest.menu === 'Celiaco' ? 'selected' : ''}>Celiaco</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Alergias / Restricciones</label>
        <input type="text" id="g-allergies" value="${guest ? guest.allergies : ''}" placeholder="Ej: Sin frutos secos, sin lactosa" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
      </div>

      <div class="pt-2 border-t border-slate-100">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" id="g-plusone-allowed" ${guest && guest.plusOneAllowed ? 'checked' : ''} onchange="togglePlusOneFields(this.checked)" class="rounded text-wedding-600 focus:ring-wedding-500">
          <span class="text-xs font-semibold text-slate-700">Permitir Acompañante (+1)</span>
        </label>
      </div>

      <div id="plusone-container" class="${guest && guest.plusOneAllowed ? '' : 'hidden'} space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Nombre Acompañante</label>
          <input type="text" id="g-plusone-name" value="${guest ? guest.plusOneName : ''}" class="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Menú Acompañante</label>
          <select id="g-plusone-menu" class="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
            <option value="Adulto" ${guest && guest.plusOneMenu === 'Adulto' ? 'selected' : ''}>Adulto</option>
            <option value="Niño" ${guest && guest.plusOneMenu === 'Niño' ? 'selected' : ''}>Niño</option>
            <option value="Vegetariano" ${guest && guest.plusOneMenu === 'Vegetariano' ? 'selected' : ''}>Vegetariano</option>
            <option value="Vegano" ${guest && guest.plusOneMenu === 'Vegano' ? 'selected' : ''}>Vegano</option>
            <option value="Celiaco" ${guest && guest.plusOneMenu === 'Celiaco' ? 'selected' : ''}>Celiaco</option>
          </select>
        </div>
      </div>

      <div class="pt-4 flex justify-end gap-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
          Cancelar
        </button>
        <button type="submit" class="px-5 py-2 text-xs font-semibold text-white bg-wedding-600 rounded-xl hover:bg-wedding-700 transition-colors shadow-sm">
          Guardar Invitado
        </button>
      </div>
    </form>
  `;

  openModal();
}

function togglePlusOneFields(show) {
  const container = document.getElementById('plusone-container');
  if (container) {
    if (show) container.classList.remove('hidden');
    else container.classList.add('hidden');
  }
}

function saveGuestForm(e, guestId) {
  e.preventDefault();

  const name = document.getElementById('g-name').value;
  const phone = document.getElementById('g-phone').value;
  const group = document.getElementById('g-group').value;
  const status = document.getElementById('g-status').value;
  const menu = document.getElementById('g-menu').value;
  const allergies = document.getElementById('g-allergies').value;
  const plusOneAllowed = document.getElementById('g-plusone-allowed').checked;
  const plusOneName = document.getElementById('g-plusone-name')?.value || '';
  const plusOneMenu = document.getElementById('g-plusone-menu')?.value || '';

  if (guestId) {
    const idx = store.guests.findIndex(g => g.id === guestId);
    if (idx !== -1) {
      store.guests[idx] = {
        ...store.guests[idx],
        name, phone, group, status, menu, allergies,
        plusOneAllowed, plusOneName, plusOneMenu
      };
    }
  } else {
    store.guests.push({
      id: "guest-" + Date.now(),
      name, email: '', phone, group, status, menu, allergies,
      plusOneAllowed, plusOneName, plusOneMenu,
      table: 'Sin asignar', notes: ''
    });
  }

  saveData();
  closeModal();
  showToast(guestId ? 'Invitado actualizado' : 'Invitado guardado correctamente');
}

function editGuest(id) {
  openAddGuestModal(id);
}

function deleteGuest(id) {
  if (confirm('¿Estás seguro de eliminar este invitado?')) {
    store.guests = store.guests.filter(g => g.id !== id);
    saveData();
    showToast('Invitado eliminado');
  }
}

// ==========================================
// MÓDULO 11 & CONFIGURACIÓN: EXPORTACIÓN Y WEBHOOKS
// ==========================================
function renderConfiguracionModule() {
  return `
    <div class="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Configuración y Datos</h2>
        <p class="text-slate-500 text-sm">Gestiona respaldos de seguridad, exportaciones y conexiones externas.</p>
      </div>

      <!-- EXPORTACIÓN DE DATOS -->
      <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
          <i data-lucide="download" class="w-5 h-5 text-wedding-600"></i>
          Respaldo y Exportación a CSV / Excel
        </h3>
        <p class="text-slate-500 text-xs leading-relaxed">
          Descarga instantáneamente tu lista de invitados completa con todos sus datos de menú, acompañantes y confirmaciones para abrir en Microsoft Excel o Google Sheets.
        </p>
        <div class="flex flex-wrap gap-3 pt-2">
          <button onclick="exportGuestsToCSV()" class="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
            <i data-lucide="file-spreadsheet" class="w-4 h-4"></i>
            Exportar Invitados (CSV)
          </button>
          <button onclick="exportFullJSON()" class="inline-flex items-center gap-2 bg-slate-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-slate-900 transition-colors shadow-sm">
            <i data-lucide="database" class="w-4 h-4"></i>
            Respaldo Completo (JSON)
          </button>
        </div>
      </div>

      <!-- PANEL DE WEBHOOKS Y CONEXIÓN API -->
      <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
          <i data-lucide="webhook" class="w-5 h-5 text-wedding-600"></i>
          Integración Webhooks / API Externa
        </h3>
        <p class="text-slate-500 text-xs leading-relaxed">
          Prepara la sincronización con otras aplicaciones externas enviando notificaciones cuando un invitado confirme su asistencia.
        </p>
        
        <form onsubmit="saveWebhookConfig(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">URL Endpoint Webhook</label>
            <input type="url" id="webhook-url" value="${store.webhooks?.endpointUrl || ''}" placeholder="https://api.tuapp.com/v1/boda-sync" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Token Bearer de Autenticación</label>
            <input type="password" id="webhook-token" value="${store.webhooks?.authToken || ''}" placeholder="sk_live_..." class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
          </div>
          <button type="submit" class="bg-wedding-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-wedding-700 transition-colors shadow-sm">
            Guardar Configuración Webhook
          </button>
        </form>
      </div>

    </div>
  `;
}

function saveWebhookConfig(e) {
  e.preventDefault();
  store.webhooks = {
    endpointUrl: document.getElementById('webhook-url').value,
    authToken: document.getElementById('webhook-token').value
  };
  saveData();
  showToast('Configuración de Webhook guardada');
}

// EXPORTAR INVITADOS A CSV
function exportGuestsToCSV() {
  if (store.guests.length === 0) {
    showToast('No hay invitados para exportar');
    return;
  }

  const headers = ["Nombre", "Telefono", "Grupo", "Estado", "Menu", "Alergias", "Acompañante", "Menu Acompañante"];
  const rows = store.guests.map(g => [
    `"${g.name}"`,
    `"${g.phone || ''}"`,
    `"${g.group}"`,
    `"${g.status}"`,
    `"${g.menu}"`,
    `"${g.allergies || ''}"`,
    `"${g.plusOneAllowed ? (g.plusOneName || 'Si') : 'No'}"`,
    `"${g.plusOneMenu || ''}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `invitados_boda_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Archivo CSV descargado con éxito');
}

function exportFullJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `respaldo_boda_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('Respaldo JSON descargado');
}

// ==========================================
// COMPONENTES AUXILIARES: MODAL Y TOAST
// ==========================================
function openModal() {
  document.getElementById('modal-backdrop').classList.remove('hidden');
  document.getElementById('modal-container').classList.remove('hidden');
  document.getElementById('modal-container').classList.add('flex');
}

function closeModal() {
  document.getElementById('modal-backdrop').classList.add('hidden');
  document.getElementById('modal-container').classList.add('hidden');
  document.getElementById('modal-container').classList.remove('flex');
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-fade-in pointer-events-auto';
  toast.innerHTML = `
    <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    toast.remove();
  }, 3000);
}