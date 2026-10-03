// Archivo: app.js

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
  spaces: {
    ceremony: {
      name: "Parroquia San Francisco",
      address: "Calle Mayor 12, Madrid, España",
      time: "17:00",
      capacity: 150,
      contactName: "Padre Antonio",
      contactPhone: "+34 600 111 222",
      mapUrl: "https://maps.google.com/?q=Parroquia+San+Francisco+Madrid",
      notes: "Dress code: Etiqueta / Formal. Se solicita a los invitados llegar 20 minutos antes. Hay estacionamiento municipal a 100 metros."
    },
    banquet: {
      name: "Hacienda El Paraíso",
      address: "Carretera del Sol Km 15, Madrid, España",
      time: "19:00",
      capacity: 200,
      contactName: "Elena Rivas (Coordinadora)",
      contactPhone: "+34 600 333 444",
      mapUrl: "https://maps.google.com/?q=Hacienda+El+Paraiso+Madrid",
      notes: "Catering propio de la finca. Cóctel de bienvenida en el jardín exterior. Horario límite de música hasta las 04:00 AM."
    }
  },
  guests: [
    {
      id: "guest-1",
      name: "María García",
      email: "maria.garcia@example.com",
      phone: "+34 612 345 678",
      group: "Familia Novia",
      status: "Confirmado",
      menu: "Adulto",
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
      email: "roberto.gomez@example.com",
      phone: "+34 622 987 654",
      group: "Amigos Novio",
      status: "Pendiente",
      menu: "Vegetariano",
      allergies: "Alergia a los frutos secos",
      plusOneAllowed: false,
      plusOneName: "",
      plusOneMenu: "Adulto",
      table: "Sin asignar",
      notes: ""
    },
    {
      id: "guest-3",
      name: "Laura Martínez",
      email: "laura.m@example.com",
      phone: "+34 633 111 222",
      group: "Trabajo",
      status: "Rechazado",
      menu: "Adulto",
      allergies: "",
      plusOneAllowed: false,
      plusOneName: "",
      plusOneMenu: "Adulto",
      table: "Sin asignar",
      notes: "Viaje de trabajo en esa fecha"
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
    const parsed = JSON.parse(data);
    // Asegurar estructura de Espacios si venía de versión previa
    if (!parsed.spaces) {
      parsed.spaces = INITIAL_STATE.spaces;
    }
    return parsed;
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
  { id: 'invitados', name: 'Lista de Invitados', icon: 'users' },
  { id: 'espacios', name: 'Espacios', icon: 'map-pin' },
  { id: 'proveedores', name: 'Proveedores', icon: 'briefcase' },
  { id: 'web-invitados', name: 'Sitio Web', icon: 'globe' },
  { id: 'tareas', name: 'Lista de Tareas', icon: 'check-square' },
  { id: 'presupuesto', name: 'Presupuesto', icon: 'wallet' },
  { id: 'itinerario', name: 'Itinerario', icon: 'clock' },
  { id: 'mesas', name: 'Distribución Mesas', icon: 'grid' },
  { id: 'notas', name: 'Notas', icon: 'file-text' },
  { id: 'configuracion', name: 'Configuración', icon: 'settings' }
];

let activeModule = 'espacios';

// Filtros del módulo de invitados
let guestSearchQuery = "";
let guestStatusFilter = "todos";

// ==========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();
  renderNavigation();
  switchModule('espacios');
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
// CONTROL DEL MENÚ LATERAL MÓVIL (DRAWER)
// ==========================================
function toggleMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (!drawer || !backdrop) return;

  const isOpen = !drawer.classList.contains('-translate-x-full');

  if (isOpen) {
    closeMobileDrawer();
  } else {
    backdrop.classList.remove('hidden');
    setTimeout(() => {
      backdrop.classList.remove('opacity-0');
      drawer.classList.remove('-translate-x-full');
    }, 10);
  }
}

function closeMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (!drawer || !backdrop) return;

  drawer.classList.add('-translate-x-full');
  backdrop.classList.add('opacity-0');
  setTimeout(() => {
    backdrop.classList.add('hidden');
  }, 300);
}

// ==========================================
// RENDERIZADO DE MENÚS Y NAVEGACIÓN
// ==========================================
function renderNavigation() {
  const desktopNav = document.getElementById('desktop-menu');
  const mobileDrawerNav = document.getElementById('mobile-drawer-menu');
  const mobileBottomNav = document.getElementById('mobile-menu');

  if (desktopNav) {
    desktopNav.innerHTML = MODULES.map(mod => `
      <button onclick="switchModule('${mod.id}')" class="nav-item-transition group flex items-center w-full px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
        activeModule === mod.id 
          ? 'bg-wedding-50 text-wedding-700 shadow-sm' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }">
        <i data-lucide="${mod.icon}" class="mr-3 h-5 w-5 ${activeModule === mod.id ? 'text-wedding-600' : 'text-slate-400 group-hover:text-slate-600'}"></i>
        ${mod.name}
      </button>
    `).join('');
  }

  if (mobileDrawerNav) {
    mobileDrawerNav.innerHTML = MODULES.map(mod => `
      <button onclick="switchModule('${mod.id}')" class="nav-item-transition flex items-center w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all min-h-[44px] ${
        activeModule === mod.id 
          ? 'bg-wedding-50 text-wedding-700 font-bold border border-wedding-200' 
          : 'text-slate-700 hover:bg-slate-100 active:bg-slate-200'
      }">
        <i data-lucide="${mod.icon}" class="mr-3.5 h-5 w-5 ${activeModule === mod.id ? 'text-wedding-600' : 'text-slate-400'}"></i>
        <span>${mod.name}</span>
        ${activeModule === mod.id ? '<i data-lucide="chevron-right" class="ml-auto w-4 h-4 text-wedding-600"></i>' : ''}
      </button>
    `).join('');
  }

  if (mobileBottomNav) {
    const mainMobileIds = ['resumen', 'invitados', 'espacios', 'presupuesto'];
    const mainMobileModules = MODULES.filter(m => mainMobileIds.includes(m.id));

    let html = mainMobileModules.map(mod => `
      <button onclick="switchModule('${mod.id}')" class="flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
        activeModule === mod.id ? 'text-wedding-600 font-bold' : 'text-slate-500 hover:text-slate-800'
      }">
        <i data-lucide="${mod.icon}" class="w-5 h-5"></i>
        <span class="text-[10px] mt-1">${mod.id === 'invitados' ? 'Invitados' : mod.id === 'espacios' ? 'Espacios' : mod.name}</span>
      </button>
    `).join('');

    const isOtherActive = !mainMobileIds.includes(activeModule);
    html += `
      <button onclick="toggleMobileDrawer()" class="flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
        isOtherActive ? 'text-wedding-600 font-bold' : 'text-slate-500 hover:text-slate-800'
      }">
        <i data-lucide="menu" class="w-5 h-5"></i>
        <span class="text-[10px] mt-1">Más</span>
      </button>
    `;

    mobileBottomNav.innerHTML = html;
  }

  if (window.lucide) lucide.createIcons();
}

function switchModule(moduleId) {
  activeModule = moduleId;
  const modObj = MODULES.find(m => m.id === moduleId);
  
  const titleElem = document.getElementById('mobile-title');
  if (titleElem && modObj) titleElem.textContent = modObj.name;

  closeMobileDrawer();
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
    case 'espacios':
      container.innerHTML = renderEspaciosModule();
      break;
    case 'configuracion':
      container.innerHTML = renderConfiguracionModule();
      break;
    default:
      container.innerHTML = `
        <div class="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-100 shadow-sm max-w-lg mx-auto my-6 sm:my-12">
          <div class="p-4 bg-rose-50 text-wedding-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <i data-lucide="construction" class="w-8 h-8"></i>
          </div>
          <h2 class="text-xl font-bold text-slate-900 mb-2">Módulo en Desarrollo</h2>
          <p class="text-slate-500 text-sm mb-6">El módulo de <strong>${MODULES.find(m => m.id === activeModule)?.name}</strong> se integrará con su interfaz completa a continuación.</p>
          <button onclick="switchModule('espacios')" class="bg-wedding-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-wedding-700 transition-colors shadow-sm">
            Ir a Espacios
          </button>
        </div>
      `;
  }
  if (window.lucide) lucide.createIcons();
}

// ==========================================
// MÓDULO 1: RESUMEN (PANEL DE CONTROL)
// ==========================================
function renderResumenModule() {
  const today = new Date();
  const weddingDate = new Date(store.weddingDetails.date);
  const diffTime = weddingDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const daysLeft = diffDays > 0 ? diffDays : 0;

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

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
    </div>
  `;
}

// ==========================================
// MÓDULO 2: LISTA DE INVITADOS (COMPLETO)
// ==========================================
function renderInvitadosModule() {
  let filteredGuests = store.guests.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(guestSearchQuery.toLowerCase()) || 
                          (g.email && g.email.toLowerCase().includes(guestSearchQuery.toLowerCase())) ||
                          (g.phone && g.phone.toLowerCase().includes(guestSearchQuery.toLowerCase())) ||
                          g.group.toLowerCase().includes(guestSearchQuery.toLowerCase());
    const matchesStatus = guestStatusFilter === "todos" || g.status === guestStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPrimary = store.guests.length;
  const totalCompanions = store.guests.reduce((acc, g) => acc + (g.plusOneAllowed && g.plusOneName ? 1 : 0), 0);
  const totalAllGuests = totalPrimary + totalCompanions;

  const confirmedGuests = store.guests.reduce((acc, g) => {
    let c = g.status === 'Confirmado' ? 1 : 0;
    if (g.status === 'Confirmado' && g.plusOneAllowed && g.plusOneName) c += 1;
    return acc + c;
  }, 0);

  const pendingGuests = store.guests.filter(g => g.status === 'Pendiente').length;

  const totalDietaryRestrictions = store.guests.reduce((acc, g) => {
    let count = 0;
    if ((g.menu && g.menu !== 'Adulto' && g.menu !== 'Niño') || (g.allergies && g.allergies.trim() !== '')) {
      count += 1;
    }
    if (g.plusOneAllowed && g.plusOneName) {
      if (g.plusOneMenu && g.plusOneMenu !== 'Adulto' && g.plusOneMenu !== 'Niño') {
        count += 1;
      }
    }
    return acc + count;
  }, 0);

  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Lista de Invitados</h2>
          <p class="text-slate-500 text-sm">Gestiona RSVP, menús especiales, alergias y acompañantes (+1).</p>
        </div>
        <button onclick="openAddGuestModal()" class="inline-flex items-center justify-center gap-2 bg-wedding-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-wedding-700 transition-colors shadow-sm active:scale-95">
          <i data-lucide="user-plus" class="w-4 h-4"></i>
          Añadir Invitado
        </button>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div onclick="setGuestFilter('todos')" class="cursor-pointer bg-white p-4 rounded-2xl border ${guestStatusFilter === 'todos' ? 'border-wedding-500 ring-2 ring-wedding-100' : 'border-slate-100'} shadow-sm transition-all hover:border-wedding-300">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-slate-500">Total Invitados</span>
            <div class="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
              <i data-lucide="users" class="w-4 h-4"></i>
            </div>
          </div>
          <span class="text-2xl font-black text-slate-900">${totalAllGuests}</span>
          <span class="text-[11px] text-slate-400 block mt-0.5">${totalPrimary} titulares + ${totalCompanions} (+1)</span>
        </div>

        <div onclick="setGuestFilter('Confirmado')" class="cursor-pointer bg-white p-4 rounded-2xl border ${guestStatusFilter === 'Confirmado' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-100'} shadow-sm transition-all hover:border-emerald-300">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-emerald-600">Confirmados</span>
            <div class="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <i data-lucide="user-check" class="w-4 h-4"></i>
            </div>
          </div>
          <span class="text-2xl font-black text-emerald-700">${confirmedGuests}</span>
          <span class="text-[11px] text-emerald-600/70 block mt-0.5">Asistencia asegurada</span>
        </div>

        <div onclick="setGuestFilter('Pendiente')" class="cursor-pointer bg-white p-4 rounded-2xl border ${guestStatusFilter === 'Pendiente' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-100'} shadow-sm transition-all hover:border-amber-300">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-amber-600">Pendientes</span>
            <div class="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <i data-lucide="clock" class="w-4 h-4"></i>
            </div>
          </div>
          <span class="text-2xl font-black text-amber-700">${pendingGuests}</span>
          <span class="text-[11px] text-amber-600/70 block mt-0.5">Por responder</span>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-rose-600">Restricciones</span>
            <div class="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <i data-lucide="utensils" class="w-4 h-4"></i>
            </div>
          </div>
          <span class="text-2xl font-black text-rose-700">${totalDietaryRestrictions}</span>
          <span class="text-[11px] text-rose-600/70 block mt-0.5">Especiales / Alergias</span>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <i data-lucide="search" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input type="text" value="${guestSearchQuery}" oninput="handleGuestSearch(this.value)" placeholder="Buscar por nombre, correo, teléfono o grupo..." class="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500 focus:bg-white transition-all">
        </div>
        <select onchange="setGuestFilter(this.value)" class="py-2.5 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500 font-medium text-slate-700">
          <option value="todos" ${guestStatusFilter === 'todos' ? 'selected' : ''}>Todos los estados</option>
          <option value="Confirmado" ${guestStatusFilter === 'Confirmado' ? 'selected' : ''}>Confirmados</option>
          <option value="Pendiente" ${guestStatusFilter === 'Pendiente' ? 'selected' : ''}>Pendientes</option>
          <option value="Rechazado" ${guestStatusFilter === 'Rechazado' ? 'selected' : ''}>Rechazados</option>
        </select>
      </div>

      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        ${filteredGuests.length === 0 ? `
          <div class="p-12 text-center text-slate-500">
            <div class="p-4 bg-slate-50 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center text-slate-400">
              <i data-lucide="users" class="w-6 h-6"></i>
            </div>
            <p class="text-sm font-semibold text-slate-700">No hay invitados registrados o que coincidan con el filtro.</p>
            <p class="text-xs text-slate-400 mt-1">Usa el botón "Añadir Invitado" para agregar el primero.</p>
          </div>
        ` : `
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-600 min-w-[640px]">
              <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th class="py-3.5 px-4">Invitado / Contacto</th>
                  <th class="py-3.5 px-4">Grupo</th>
                  <th class="py-3.5 px-4">Estado RSVP</th>
                  <th class="py-3.5 px-4">Menú / Restricciones</th>
                  <th class="py-3.5 px-4">Acompañante (+1)</th>
                  <th class="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${filteredGuests.map(g => `
                  <tr class="hover:bg-slate-50/60 transition-colors">
                    <td class="py-3.5 px-4">
                      <div class="font-bold text-slate-900">${g.name}</div>
                      <div class="text-xs text-slate-400 space-x-2 mt-0.5">
                        ${g.email ? `<span>📧 ${g.email}</span>` : ''}
                        ${g.phone ? `<span>📱 ${g.phone}</span>` : ''}
                      </div>
                    </td>
                    <td class="py-3.5 px-4">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        ${g.group}
                      </span>
                    </td>
                    <td class="py-3.5 px-4">
                      <select onchange="updateGuestStatus('${g.id}', this.value)" class="text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${
                        g.status === 'Confirmado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        g.status === 'Pendiente' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }">
                        <option value="Pendiente" ${g.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="Confirmado" ${g.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
                        <option value="Rechazado" ${g.status === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
                      </select>
                    </td>
                    <td class="py-3.5 px-4">
                      <div class="text-slate-800 font-medium">${g.menu}</div>
                      ${g.allergies ? `<div class="text-xs text-rose-600 font-medium mt-0.5 flex items-center gap-1"><i data-lucide="alert-circle" class="w-3 h-3 inline"></i> ${g.allergies}</div>` : ''}
                    </td>
                    <td class="py-3.5 px-4 text-xs">
                      ${g.plusOneAllowed ? `
                        <div class="font-semibold text-slate-800">${g.plusOneName || 'Por definir'}</div>
                        <div class="text-slate-400 font-medium">${g.plusOneMenu}</div>
                      ` : '<span class="text-slate-400">Sin acompañante</span>'}
                    </td>
                    <td class="py-3.5 px-4 text-right">
                      <div class="flex items-center justify-end gap-1">
                        <button onclick="openAddGuestModal('${g.id}')" title="Editar" class="p-1.5 text-slate-400 hover:text-wedding-600 hover:bg-wedding-50 rounded-lg transition-colors">
                          <i data-lucide="edit-3" class="w-4 h-4"></i>
                        </button>
                        <button onclick="deleteGuest('${g.id}')" title="Eliminar" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
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

function updateGuestStatus(id, newStatus) {
  const guest = store.guests.find(g => g.id === id);
  if (guest) {
    guest.status = newStatus;
    saveData();
    showToast(`Estado actualizado a ${newStatus}`);
  }
}

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
        <input type="text" id="g-name" required value="${guest ? guest.name : ''}" placeholder="Ej: María García" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
          <input type="email" id="g-email" value="${guest ? (guest.email || '') : ''}" placeholder="maria@example.com" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
          <input type="tel" id="g-phone" value="${guest ? (guest.phone || '') : ''}" placeholder="+34 612 345 678" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Grupo / Familia</label>
          <select id="g-group" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
            <option value="Familia Novia" ${guest && guest.group === 'Familia Novia' ? 'selected' : ''}>Familia Novia</option>
            <option value="Familia Novio" ${guest && guest.group === 'Familia Novio' ? 'selected' : ''}>Familia Novio</option>
            <option value="Amigos Novia" ${guest && guest.group === 'Amigos Novia' ? 'selected' : ''}>Amigos Novia</option>
            <option value="Amigos Novio" ${guest && guest.group === 'Amigos Novio' ? 'selected' : ''}>Amigos Novio</option>
            <option value="Trabajo" ${guest && guest.group === 'Trabajo' ? 'selected' : ''}>Trabajo</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Estado RSVP</label>
          <select id="g-status" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
            <option value="Pendiente" ${guest && guest.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="Confirmado" ${guest && guest.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
            <option value="Rechazado" ${guest && guest.status === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Menú Específico</label>
          <select id="g-menu" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
            <option value="Adulto" ${guest && guest.menu === 'Adulto' ? 'selected' : ''}>Adulto (Estándar)</option>
            <option value="Niño" ${guest && guest.menu === 'Niño' ? 'selected' : ''}>Niño</option>
            <option value="Vegetariano" ${guest && guest.menu === 'Vegetariano' ? 'selected' : ''}>Vegetariano</option>
            <option value="Vegano" ${guest && guest.menu === 'Vegano' ? 'selected' : ''}>Vegano</option>
            <option value="Celiaco" ${guest && guest.menu === 'Celiaco' ? 'selected' : ''}>Celíaco (Sin Glutén)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Alergias / Restricciones</label>
          <input type="text" id="g-allergies" value="${guest ? (guest.allergies || '') : ''}" placeholder="Ej: Sin marisco, lactosa..." class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
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
          <input type="text" id="g-plusone-name" value="${guest ? (guest.plusOneName || '') : ''}" placeholder="Nombre del acompañante" class="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Menú Acompañante</label>
          <select id="g-plusone-menu" class="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
            <option value="Adulto" ${guest && guest.plusOneMenu === 'Adulto' ? 'selected' : ''}>Adulto (Estándar)</option>
            <option value="Niño" ${guest && guest.plusOneMenu === 'Niño' ? 'selected' : ''}>Niño</option>
            <option value="Vegetariano" ${guest && guest.plusOneMenu === 'Vegetariano' ? 'selected' : ''}>Vegetariano</option>
            <option value="Vegano" ${guest && guest.plusOneMenu === 'Vegano' ? 'selected' : ''}>Vegano</option>
            <option value="Celiaco" ${guest && guest.plusOneMenu === 'Celiaco' ? 'selected' : ''}>Celíaco (Sin Glutén)</option>
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
  const email = document.getElementById('g-email').value;
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
        name, email, phone, group, status, menu, allergies,
        plusOneAllowed, plusOneName, plusOneMenu
      };
    }
  } else {
    store.guests.push({
      id: "guest-" + Date.now(),
      name, email, phone, group, status, menu, allergies,
      plusOneAllowed, plusOneName, plusOneMenu,
      table: 'Sin asignar', notes: ''
    });
  }

  saveData();
  closeModal();
  showToast(guestId ? 'Invitado actualizado' : 'Invitado guardado correctamente');
}

function deleteGuest(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este invitado?')) {
    store.guests = store.guests.filter(g => g.id !== id);
    saveData();
    showToast('Invitado eliminado');
  }
}

// ==========================================
// MÓDULO 3: ESPACIOS (CEREMONIA Y BANQUETE)
// ==========================================
function renderEspaciosModule() {
  const ceremony = store.spaces?.ceremony || {};
  const banquet = store.spaces?.banquet || {};

  return `
    <div class="space-y-6 animate-fade-in">
      
      <!-- CABECERA DE MÓDULO -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Espacios de la Boda</h2>
          <p class="text-slate-500 text-sm">Organiza los detalles de la Ceremonia y del Banquete en un solo lugar.</p>
        </div>
      </div>

      <!-- TARJETAS DE MÓDULO (CEREMONIA Y BANQUETE) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- ESPACIO 1: CEREMONIA -->
        <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-wedding-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>

          <div>
            <!-- Encabezado de Tarjeta -->
            <div class="flex items-start justify-between gap-3 mb-4 relative z-10">
              <div class="flex items-center gap-3">
                <div class="p-3 bg-wedding-100 text-wedding-600 rounded-2xl">
                  <i data-lucide="church" class="w-6 h-6"></i>
                </div>
                <div>
                  <span class="text-xs font-bold uppercase tracking-wider text-wedding-600">Lugar de la</span>
                  <h3 class="text-xl font-extrabold text-slate-900">${ceremony.name || 'Ceremonia por definir'}</h3>
                </div>
              </div>
              <button onclick="openEditSpaceModal('ceremony')" class="p-2 text-slate-400 hover:text-wedding-600 hover:bg-wedding-50 rounded-xl transition-colors">
                <i data-lucide="edit-3" class="w-5 h-5"></i>
              </button>
            </div>

            <!-- Datos Clave -->
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span class="text-[11px] font-semibold text-slate-400 uppercase block">Hora de inicio</span>
                <span class="text-base font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <i data-lucide="clock" class="w-4 h-4 text-wedding-600"></i>
                  ${ceremony.time || '--:--'}
                </span>
              </div>
              <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span class="text-[11px] font-semibold text-slate-400 uppercase block">Capacidad</span>
                <span class="text-base font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <i data-lucide="users" class="w-4 h-4 text-wedding-600"></i>
                  ${ceremony.capacity ? ceremony.capacity + ' pers.' : 'Sin especificar'}
                </span>
              </div>
            </div>

            <!-- Dirección y Contacto -->
            <div class="space-y-3 text-sm text-slate-600 mb-4">
              <div class="flex items-start gap-2.5">
                <i data-lucide="map-pin" class="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0"></i>
                <span class="text-slate-700">${ceremony.address || 'Sin dirección ingresada'}</span>
              </div>

              <div class="flex items-center gap-2.5">
                <i data-lucide="user-check" class="w-4 h-4 text-slate-400 flex-shrink-0"></i>
                <span class="text-slate-700 font-medium">${ceremony.contactName || 'Sin contacto'}</span>
                ${ceremony.contactPhone ? `
                  <a href="tel:${ceremony.contactPhone}" class="ml-auto text-xs font-bold text-wedding-600 hover:underline flex items-center gap-1">
                    <i data-lucide="phone" class="w-3.5 h-3.5"></i> ${ceremony.contactPhone}
                  </a>
                ` : ''}
              </div>
            </div>

            <!-- Notas de Logística -->
            ${ceremony.notes ? `
              <div class="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-3 text-xs text-amber-900 mb-4 space-y-1">
                <span class="font-bold flex items-center gap-1 text-amber-800">
                  <i data-lucide="notebook-tabs" class="w-3.5 h-3.5"></i> Notas y Recomendaciones:
                </span>
                <p class="leading-relaxed text-amber-800/90">${ceremony.notes}</p>
              </div>
            ` : ''}
          </div>

          <!-- Botón a Mapa -->
          <div class="pt-3 border-t border-slate-100">
            ${ceremony.mapUrl ? `
              <a href="${ceremony.mapUrl}" target="_blank" rel="noopener noreferrer" class="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold text-xs py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-sm active:scale-95">
                <i data-lucide="navigation" class="w-4 h-4 text-rose-400"></i>
                Ver Ubicación en Mapa
              </a>
            ` : `
              <button onclick="openEditSpaceModal('ceremony')" class="w-full inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-500 font-semibold text-xs py-2.5 rounded-xl hover:bg-slate-200 transition-colors">
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                Añadir enlace de mapa
              </button>
            `}
          </div>

        </div>

        <!-- ESPACIO 2: BANQUETE -->
        <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-wedding-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>

          <div>
            <!-- Encabezado de Tarjeta -->
            <div class="flex items-start justify-between gap-3 mb-4 relative z-10">
              <div class="flex items-center gap-3">
                <div class="p-3 bg-wedding-100 text-wedding-600 rounded-2xl">
                  <i data-lucide="utensils-crossed" class="w-6 h-6"></i>
                </div>
                <div>
                  <span class="text-xs font-bold uppercase tracking-wider text-wedding-600">Lugar del</span>
                  <h3 class="text-xl font-extrabold text-slate-900">${banquet.name || 'Banquete por definir'}</h3>
                </div>
              </div>
              <button onclick="openEditSpaceModal('banquet')" class="p-2 text-slate-400 hover:text-wedding-600 hover:bg-wedding-50 rounded-xl transition-colors">
                <i data-lucide="edit-3" class="w-5 h-5"></i>
              </button>
            </div>

            <!-- Datos Clave -->
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span class="text-[11px] font-semibold text-slate-400 uppercase block">Hora de inicio</span>
                <span class="text-base font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <i data-lucide="clock" class="w-4 h-4 text-wedding-600"></i>
                  ${banquet.time || '--:--'}
                </span>
              </div>
              <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span class="text-[11px] font-semibold text-slate-400 uppercase block">Capacidad</span>
                <span class="text-base font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <i data-lucide="users" class="w-4 h-4 text-wedding-600"></i>
                  ${banquet.capacity ? banquet.capacity + ' pers.' : 'Sin especificar'}
                </span>
              </div>
            </div>

            <!-- Dirección y Contacto -->
            <div class="space-y-3 text-sm text-slate-600 mb-4">
              <div class="flex items-start gap-2.5">
                <i data-lucide="map-pin" class="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0"></i>
                <span class="text-slate-700">${banquet.address || 'Sin dirección ingresada'}</span>
              </div>

              <div class="flex items-center gap-2.5">
                <i data-lucide="user-check" class="w-4 h-4 text-slate-400 flex-shrink-0"></i>
                <span class="text-slate-700 font-medium">${banquet.contactName || 'Sin contacto'}</span>
                ${banquet.contactPhone ? `
                  <a href="tel:${banquet.contactPhone}" class="ml-auto text-xs font-bold text-wedding-600 hover:underline flex items-center gap-1">
                    <i data-lucide="phone" class="w-3.5 h-3.5"></i> ${banquet.contactPhone}
                  </a>
                ` : ''}
              </div>
            </div>

            <!-- Notas de Logística -->
            ${banquet.notes ? `
              <div class="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-3 text-xs text-amber-900 mb-4 space-y-1">
                <span class="font-bold flex items-center gap-1 text-amber-800">
                  <i data-lucide="notebook-tabs" class="w-3.5 h-3.5"></i> Notas y Recomendaciones:
                </span>
                <p class="leading-relaxed text-amber-800/90">${banquet.notes}</p>
              </div>
            ` : ''}
          </div>

          <!-- Botón a Mapa -->
          <div class="pt-3 border-t border-slate-100">
            ${banquet.mapUrl ? `
              <a href="${banquet.mapUrl}" target="_blank" rel="noopener noreferrer" class="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold text-xs py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-sm active:scale-95">
                <i data-lucide="navigation" class="w-4 h-4 text-rose-400"></i>
                Ver Ubicación en Mapa
              </a>
            ` : `
              <button onclick="openEditSpaceModal('banquet')" class="w-full inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-500 font-semibold text-xs py-2.5 rounded-xl hover:bg-slate-200 transition-colors">
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                Añadir enlace de mapa
              </button>
            `}
          </div>

        </div>

      </div>

    </div>
  `;
}

// ==========================================
// FORMULARIO Y MODAL DE ESPACIOS
// ==========================================
function openEditSpaceModal(type) {
  const isCeremony = type === 'ceremony';
  const spaceData = store.spaces ? store.spaces[type] || {} : {};

  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  modalTitle.textContent = isCeremony ? 'Editar Espacio de Ceremonia' : 'Editar Espacio del Banquete';

  modalBody.innerHTML = `
    <form onsubmit="saveSpaceForm(event, '${type}')" class="space-y-4">
      
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Nombre del Lugar *</label>
        <input type="text" id="s-name" required value="${spaceData.name || ''}" placeholder="Ej: Hacienda El Paraíso" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Dirección Completa *</label>
        <input type="text" id="s-address" required value="${spaceData.address || ''}" placeholder="Calle, Número, Ciudad, País" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Hora de Inicio</label>
          <input type="time" id="s-time" value="${spaceData.time || ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Capacidad Máxima (personas)</label>
          <input type="number" id="s-capacity" value="${spaceData.capacity || ''}" placeholder="Ej: 150" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Nombre de Contacto</label>
          <input type="text" id="s-contact-name" value="${spaceData.contactName || ''}" placeholder="Ej: Antonio (Coordinador)" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Teléfono de Contacto</label>
          <input type="tel" id="s-contact-phone" value="${spaceData.contactPhone || ''}" placeholder="+34 600 000 000" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Enlace a Google Maps / Waze</label>
        <input type="url" id="s-map-url" value="${spaceData.mapUrl || ''}" placeholder="https://maps.google.com/..." class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Notas de Logística / Recomendaciones</label>
        <textarea id="s-notes" rows="3" placeholder="Dress code, estacionamiento, horarios de montaje..." class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">${spaceData.notes || ''}</textarea>
      </div>

      <div class="pt-4 flex justify-end gap-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
          Cancelar
        </button>
        <button type="submit" class="px-5 py-2 text-xs font-semibold text-white bg-wedding-600 rounded-xl hover:bg-wedding-700 transition-colors shadow-sm">
          Guardar Espacio
        </button>
      </div>

    </form>
  `;

  openModal();
}

function saveSpaceForm(e, type) {
  e.preventDefault();

  const name = document.getElementById('s-name').value;
  const address = document.getElementById('s-address').value;
  const time = document.getElementById('s-time').value;
  const capacity = parseInt(document.getElementById('s-capacity').value) || 0;
  const contactName = document.getElementById('s-contact-name').value;
  const contactPhone = document.getElementById('s-contact-phone').value;
  const mapUrl = document.getElementById('s-map-url').value;
  const notes = document.getElementById('s-notes').value;

  if (!store.spaces) store.spaces = {};
  
  store.spaces[type] = {
    name,
    address,
    time,
    capacity,
    contactName,
    contactPhone,
    mapUrl,
    notes
  };

  saveData();
  closeModal();
  showToast(`Espacio de ${type === 'ceremony' ? 'Ceremonia' : 'Banquete'} guardado`);
}

// ==========================================
// MÓDULO 11 & CONFIGURACIÓN
// ==========================================
function renderConfiguracionModule() {
  return `
    <div class="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Configuración y Datos</h2>
        <p class="text-slate-500 text-sm">Gestiona respaldos de seguridad, exportaciones y conexiones externas.</p>
      </div>

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
    </div>
  `;
}

function exportGuestsToCSV() {
  if (store.guests.length === 0) {
    showToast('No hay invitados para exportar');
    return;
  }

  const headers = ["Nombre", "Email", "Telefono", "Grupo", "Estado", "Menu", "Alergias", "Acompañante", "Menu Acompañante"];
  const rows = store.guests.map(g => [
    `"${g.name}"`,
    `"${g.email || ''}"`,
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
// AUXILIARES: MODAL Y TOAST
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