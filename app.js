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
    totalBudget: 18000,
    currencySymbol: "€"
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
      notes: "Dress code: Etiqueta / Formal. Se solicita a los invitados llegar 20 minutos antes."
    },
    banquet: {
      name: "Hacienda El Paraíso",
      address: "Carretera del Sol Km 15, Madrid, España",
      time: "19:00",
      capacity: 200,
      contactName: "Elena Rivas (Coordinadora)",
      contactPhone: "+34 600 333 444",
      mapUrl: "https://maps.google.com/?q=Hacienda+El+Paraiso+Madrid",
      notes: "Catering propio de la finca. Cóctel de bienvenida en el jardín exterior."
    }
  },
  suppliers: [
    {
      id: "sup-1",
      name: "Catering Gourmet El Paraíso",
      category: "Catering",
      contactName: "Javier López",
      phone: "+34 611 222 333",
      email: "contacto@cateringgourmet.es",
      website: "https://cateringgourmet.es",
      status: "Reservado",
      totalAmount: 6500,
      paidAmount: 2500,
      notes: "Incluye cóctel de bienvenida, menú de 3 tiempos, recena y barra libre por 4 horas."
    },
    {
      id: "sup-2",
      name: "Estudio Creativo Fotografía",
      category: "Fotografía/Video",
      contactName: "Laura Ramos",
      phone: "+34 622 444 555",
      email: "laura@estudiocreativo.es",
      website: "https://instagram.com/estudiocreativofoto",
      status: "Reservado",
      totalAmount: 1800,
      paidAmount: 600,
      notes: "Cobertura completa de 10 horas, 2 fotógrafos, dron y entrega de álbum impreso."
    },
    {
      id: "sup-3",
      name: "DJ & Sound Experiencias",
      category: "Música/DJ",
      contactName: "Carlos Beats",
      phone: "+34 633 777 888",
      email: "reserva@djsound.com",
      website: "https://djsound.com",
      status: "Cotizando",
      totalAmount: 1200,
      paidAmount: 0,
      notes: "Presupuesto pendiente de confirmar si se añade iluminación robotizada extra."
    }
  ],
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
      wishes: "¡Qué emoción verlos dar este paso! Deseando bailar con ustedes toda la noche.",
      table: "tbl-1",
      notes: "Necesita transporte desde el hotel"
    },
    {
      id: "guest-2",
      name: "Roberto Gómez",
      email: "roberto.gomez@example.com",
      phone: "+34 622 987 654",
      group: "Amigos Novio",
      status: "Confirmado",
      menu: "Vegetariano",
      allergies: "Alergia a los frutos secos",
      plusOneAllowed: false,
      plusOneName: "",
      plusOneMenu: "Adulto",
      wishes: "¡Felicidades pareja! Nos vemos en la pista de baile.",
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
      wishes: "Lo siento muchísimo chicos, me coincide con un viaje de trabajo. ¡Un abrazo enorme!",
      table: "Sin asignar",
      notes: "Viaje de trabajo en esa fecha"
    },
    {
      id: "guest-4",
      name: "Andrés Fernández",
      email: "andres.f@example.com",
      phone: "+34 644 222 333",
      group: "Amigos Novia",
      status: "Pendiente",
      menu: "Adulto",
      allergies: "Celíaco (Sin Gluten)",
      plusOneAllowed: true,
      plusOneName: "Sofia Ruiz",
      plusOneMenu: "Vegano",
      wishes: "¡A celebrar por lo alto!",
      table: "Sin asignar",
      notes: ""
    }
  ],
  tasks: [
    {
      id: "task-1",
      title: "Definir presupuesto inicial y lista preliminar de invitados",
      phase: "10-12 meses antes",
      priority: "Alta",
      dueDate: "2026-11-01",
      status: "completada",
      notes: "Acordado un presupuesto tope"
    },
    {
      id: "task-2",
      title: "Reservar iglesia / lugar de la ceremonia",
      phase: "10-12 meses antes",
      priority: "Alta",
      dueDate: "2026-11-15",
      status: "completada",
      notes: "Reservada la Parroquia San Francisco"
    },
    {
      id: "task-3",
      title: "Contratar servicio de catering y espacio del banquete",
      phase: "6-9 meses antes",
      priority: "Alta",
      dueDate: "2026-12-20",
      status: "pendiente",
      notes: "Hacienda El Paraíso pre-reservada"
    }
  ],
  expenses: [
    {
      id: "exp-1",
      concept: "Alquiler Finca y Catering Banquete",
      category: "Lugar y Catering",
      estimatedCost: 7500,
      realCost: 8000,
      paidAmount: 3500,
      notes: "Incremento por adición de recena de hamburguesas gourmet"
    },
    {
      id: "exp-2",
      concept: "Cobertura Fotográfica y Video Profesional",
      category: "Fotografía y Video",
      estimatedCost: 2000,
      realCost: 1800,
      paidAmount: 600,
      notes: "Descuento aplicado por contratación anticipada"
    }
  ],
  itinerary: [
    {
      id: "it-1",
      timeStart: "09:30",
      timeEnd: "12:00",
      title: "Maquillaje y Peinado de Novia y Damas",
      phase: "Mañana / Preparativos",
      location: "Suite Presidencial Hotel Real",
      responsible: "Laura Ramos (Estilista) - +34 600 111 000",
      notes: "Llegada del fotógrafo a las 10:30 para fotos de 'Getting Ready'."
    },
    {
      id: "it-2",
      timeStart: "17:00",
      timeEnd: "18:00",
      title: "Ceremonia Nupcial Religiosa",
      phase: "Ceremonia",
      location: "Altar Principal Parroquia San Francisco",
      responsible: "Padre Antonio",
      notes: "Música de violín en vivo para la entrada de la novia y salida de los esposos."
    }
  ],
  tables: [
    {
      id: "tbl-0",
      name: "Mesa Nupcial (Presidencial)",
      capacity: 6,
      shape: "Imperial",
      notes: "Ubicada en el centro del salón frente a la pista de baile."
    },
    {
      id: "tbl-1",
      name: "Mesa 1 - Familia Novia",
      capacity: 8,
      shape: "Redonda",
      notes: "Cerca de la entrada principal."
    }
  ],
  notes: [
    {
      id: "note-1",
      title: "Preguntas clave para el Catering",
      category: "Preguntas para Proveedores",
      content: "1. ¿Tienen cristalería y vajilla incluida en el menú estándar?\n2. ¿Cuál es el costo por hora extra de barra libre?\n3. ¿Hasta cuándo podemos ajustar el número final de platos?",
      url: "https://pinterest.com",
      pinned: true,
      date: "2026-09-20"
    },
    {
      id: "note-2",
      title: "Inspiración Paleta de Colores y Flores",
      category: "Ideas & Inspiración",
      content: "Gama de tonos: Rosa empolvado, eucalipto y detalles dorados. Ramos con peonías, hortensias y toques de lavanda silvestre.",
      url: "https://instagram.com",
      pinned: true,
      date: "2026-09-22"
    }
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
    if (!parsed.weddingDetails) parsed.weddingDetails = INITIAL_STATE.weddingDetails;
    if (!parsed.weddingDetails.currencySymbol) parsed.weddingDetails.currencySymbol = "€";
    if (!parsed.spaces) parsed.spaces = INITIAL_STATE.spaces;
    if (!parsed.suppliers) parsed.suppliers = INITIAL_STATE.suppliers;
    if (!parsed.tasks || parsed.tasks.length === 0) parsed.tasks = INITIAL_STATE.tasks;
    if (!parsed.expenses || parsed.expenses.length === 0) parsed.expenses = INITIAL_STATE.expenses;
    if (!parsed.itinerary || parsed.itinerary.length === 0) parsed.itinerary = INITIAL_STATE.itinerary;
    if (!parsed.tables || parsed.tables.length === 0) parsed.tables = INITIAL_STATE.tables;
    if (!parsed.notes || parsed.notes.length === 0) parsed.notes = INITIAL_STATE.notes;
    return parsed;
  } catch (e) {
    return INITIAL_STATE;
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  updateUI();
}

function getCurrencySymbol() {
  return (store.weddingDetails && store.weddingDetails.currencySymbol) ? store.weddingDetails.currencySymbol : '€';
}

function formatMoney(amount) {
  const symbol = getCurrencySymbol();
  return `${Number(amount || 0).toLocaleString('es-ES')} ${symbol}`;
}

// ==========================================
// DEFINICIÓN DE MÓDULOS DE NAVEGACIÓN
// ==========================================
const MODULES = [
  { id: 'resumen', name: 'Resumen', icon: 'layout-dashboard' },
  { id: 'invitados', name: 'Lista de Invitados', icon: 'users' },
  { id: 'espacios', name: 'Espacios', icon: 'map-pin' },
  { id: 'proveedores', name: 'Proveedores', icon: 'briefcase' },
  { id: 'web-invitados', name: 'Sitio Web & RSVP', icon: 'globe' },
  { id: 'tareas', name: 'Lista de Tareas', icon: 'check-square' },
  { id: 'presupuesto', name: 'Presupuesto', icon: 'wallet' },
  { id: 'itinerario', name: 'Itinerario', icon: 'clock' },
  { id: 'mesas', name: 'Distribución Mesas', icon: 'grid' },
  { id: 'notas', name: 'Notas e Ideas', icon: 'file-text' },
  { id: 'configuracion', name: 'Configuración y Copias', icon: 'settings' }
];

let activeModule = 'invitados';

// Filtros globales por módulo
let guestSearchQuery = "";
let guestStatusFilter = "todos";

let unassignedSearchQuery = "";
let noteSearchQuery = "";
let noteCategoryFilter = "todas";

const NOTE_CATEGORIES = [
  "Ideas & Inspiración",
  "Preguntas para Proveedores",
  "Pendientes Rápidos",
  "Notas Generales"
];

const TASK_PHASES = [
  "10-12 meses antes",
  "6-9 meses antes",
  "3-5 meses antes",
  "1 mes antes",
  "Semana del evento",
  "Día de la boda"
];

// ==========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();
  renderNavigation();
  switchModule('invitados');
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
    const mainMobileIds = ['resumen', 'invitados', 'mesas', 'configuracion'];
    const mainMobileModules = MODULES.filter(m => mainMobileIds.includes(m.id));

    let html = mainMobileModules.map(mod => `
      <button onclick="switchModule('${mod.id}')" class="flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
        activeModule === mod.id ? 'text-wedding-600 font-bold' : 'text-slate-500 hover:text-slate-800'
      }">
        <i data-lucide="${mod.icon}" class="w-5 h-5"></i>
        <span class="text-[10px] mt-1">${mod.id === 'invitados' ? 'Invitados' : mod.id === 'configuracion' ? 'Ajustes' : mod.name}</span>
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
    case 'proveedores':
      container.innerHTML = renderProveedoresModule();
      break;
    case 'web-invitados':
      container.innerHTML = renderWebInvitadosModule();
      break;
    case 'tareas':
      container.innerHTML = renderTareasModule();
      break;
    case 'presupuesto':
      container.innerHTML = renderPresupuestoModule();
      break;
    case 'itinerario':
      container.innerHTML = renderItinerarioModule();
      break;
    case 'mesas':
      container.innerHTML = renderMesasModule();
      break;
    case 'notas':
      container.innerHTML = renderNotasModule();
      break;
    case 'configuracion':
      container.innerHTML = renderConfiguracionModule();
      break;
    default:
      container.innerHTML = `
        <div class="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm max-w-lg mx-auto my-6">
          <p class="text-slate-500 text-sm">Módulo disponible.</p>
        </div>
      `;
  }
  if (window.lucide) lucide.createIcons();
}

// ==========================================
// MÓDULO 1: RESUMEN
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

  const completedTasks = (store.tasks || []).filter(t => t.status === 'completada').length;
  const totalTasks = (store.tasks || []).length;
  const taskPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const budgetTotal = store.weddingDetails.totalBudget || 0;
  const realTotalSpent = (store.expenses || []).reduce((acc, e) => acc + (e.realCost || 0), 0);

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
            <h3 class="text-xl font-bold text-slate-900 mt-0.5">${taskPercentage}% <span class="text-xs font-normal text-slate-400">(${completedTasks}/${totalTasks})</span></h3>
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
            <p class="text-xs font-semibold text-slate-500">Gasto Real / Presupuesto</p>
            <h3 class="text-xl font-bold text-slate-900 mt-0.5">${formatMoney(realTotalSpent)} <span class="text-xs font-normal text-slate-400">/ ${formatMoney(budgetTotal)}</span></h3>
            <div class="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div class="${realTotalSpent > budgetTotal ? 'bg-rose-500' : 'bg-purple-600'} h-1.5 rounded-full" style="width: ${budgetTotal > 0 ? Math.min((realTotalSpent/budgetTotal)*100, 100) : 0}%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// MÓDULO 2: LISTA DE INVITADOS (RESTAURADO Y MEJORADO)
// ==========================================
function renderInvitadosModule() {
  const guests = store.guests || [];

  // Filtrado de invitados por búsqueda y por estado
  let filteredGuests = guests.filter(g => {
    const query = guestSearchQuery.toLowerCase();
    const matchesSearch = g.name.toLowerCase().includes(query) || 
                          (g.email && g.email.toLowerCase().includes(query)) ||
                          (g.phone && g.phone.toLowerCase().includes(query)) ||
                          (g.group && g.group.toLowerCase().includes(query));
    const matchesStatus = guestStatusFilter === "todos" || g.status === guestStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Métricas y Cálculos de KPI
  const totalPrimary = guests.length;
  const totalCompanions = guests.reduce((acc, g) => acc + (g.plusOneAllowed && g.plusOneName ? 1 : 0), 0);
  const totalAllGuests = totalPrimary + totalCompanions;

  const confirmedGuests = guests.reduce((acc, g) => {
    let count = g.status === 'Confirmado' ? 1 : 0;
    if (g.status === 'Confirmado' && g.plusOneAllowed && g.plusOneName) count += 1;
    return acc + count;
  }, 0);

  const pendingGuests = guests.filter(g => g.status === 'Pendiente').length;

  // Conteo de restricciones o alergias registradas
  const restrictionsCount = guests.filter(g => (g.allergies && g.allergies.trim() !== '')).length;

  return `
    <div class="space-y-6 animate-fade-in">
      
      <!-- 1. ENCABEZADO Y ACCIÓN PRINCIPAL -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Lista de Invitados</h2>
          <p class="text-slate-500 text-sm">Gestiona RSVP, menús especiales, alergias y acompañantes (+1).</p>
        </div>
        <button onclick="openAddGuestModal()" class="inline-flex items-center justify-center gap-2 bg-wedding-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-wedding-700 transition-colors shadow-sm active:scale-95">
          <i data-lucide="user-plus" class="w-4 h-4"></i>
          <span>+ Añadir Invitado</span>
        </button>
      </div>

      <!-- 2. TARJETAS DE RESUMEN SUPERIORES (4 KPI CARDS) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <!-- Card 1: Total Invitados -->
        <div onclick="setGuestFilter('todos')" class="cursor-pointer bg-white p-4 rounded-2xl border ${guestStatusFilter === 'todos' ? 'border-wedding-500 ring-2 ring-wedding-100' : 'border-slate-100'} shadow-sm transition-all hover:border-wedding-300">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-semibold text-slate-500">Total Invitados</span>
            <div class="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
              <i data-lucide="users" class="w-4 h-4"></i>
            </div>
          </div>
          <span class="text-2xl font-black text-slate-900">${totalAllGuests}</span>
          <span class="text-[11px] text-slate-400 block mt-0.5">${totalPrimary} titulares + ${totalCompanions} (+1)</span>
        </div>

        <!-- Card 2: Confirmados -->
        <div onclick="setGuestFilter('Confirmado')" class="cursor-pointer bg-white p-4 rounded-2xl border ${guestStatusFilter === 'Confirmado' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-100'} shadow-sm transition-all hover:border-emerald-300">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-semibold text-emerald-600">Confirmados</span>
            <div class="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <i data-lucide="user-check" class="w-4 h-4"></i>
            </div>
          </div>
          <span class="text-2xl font-black text-emerald-700">${confirmedGuests}</span>
          <span class="text-[11px] text-emerald-600/70 block mt-0.5 font-medium">Asistencia asegurada</span>
        </div>

        <!-- Card 3: Pendientes -->
        <div onclick="setGuestFilter('Pendiente')" class="cursor-pointer bg-white p-4 rounded-2xl border ${guestStatusFilter === 'Pendiente' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-100'} shadow-sm transition-all hover:border-amber-300">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-semibold text-amber-600">Pendientes</span>
            <div class="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <i data-lucide="clock" class="w-4 h-4"></i>
            </div>
          </div>
          <span class="text-2xl font-black text-amber-700">${pendingGuests}</span>
          <span class="text-[11px] text-amber-600/70 block mt-0.5 font-medium">Por responder</span>
        </div>

        <!-- Card 4: Restricciones / Alergias -->
        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-semibold text-rose-600">Restricciones</span>
            <div class="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <i data-lucide="alert-circle" class="w-4 h-4"></i>
            </div>
          </div>
          <span class="text-2xl font-black text-rose-700">${restrictionsCount}</span>
          <span class="text-[11px] text-rose-600/70 block mt-0.5 font-medium">Especiales / Alergias</span>
        </div>

      </div>

      <!-- 3. BARRA DE BÚSQUEDA Y FILTROS -->
      <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <i data-lucide="search" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input type="text" value="${guestSearchQuery}" oninput="handleGuestSearch(this.value)" placeholder="Buscar por nombre, correo, teléfono o grupo..." class="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500 focus:bg-white transition-all">
        </div>
        <select onchange="setGuestFilter(this.value)" class="py-2.5 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500 font-semibold text-slate-700 cursor-pointer">
          <option value="todos" ${guestStatusFilter === 'todos' ? 'selected' : ''}>Todos los estados</option>
          <option value="Confirmado" ${guestStatusFilter === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
          <option value="Pendiente" ${guestStatusFilter === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
          <option value="Rechazado" ${guestStatusFilter === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
        </select>
      </div>

      <!-- 4. TABLA DE INVITADOS COMPLETA -->
      <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        ${filteredGuests.length === 0 ? `
          <div class="p-12 text-center text-slate-500">
            <div class="p-4 bg-slate-50 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center text-slate-400">
              <i data-lucide="users-2" class="w-6 h-6"></i>
            </div>
            <p class="text-sm font-semibold text-slate-700">No hay invitados que coincidan con la búsqueda o filtro.</p>
            <p class="text-xs text-slate-400 mt-1">Prueba a limpiar la búsqueda o añadir un nuevo invitado.</p>
          </div>
        ` : `
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-600 min-w-[800px]">
              <thead class="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th class="py-4 px-5">INVITADO / CONTACTO</th>
                  <th class="py-4 px-4">GRUPO</th>
                  <th class="py-4 px-4">ESTADO RSVP</th>
                  <th class="py-4 px-4">MENÚ / RESTRICCIONES</th>
                  <th class="py-4 px-4">ACOMPAÑANTE (+1)</th>
                  <th class="py-4 px-5 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${filteredGuests.map(g => {
                  return `
                    <tr class="hover:bg-slate-50/70 transition-colors">
                      
                      <!-- Columna 1: Invitado / Contacto -->
                      <td class="py-4 px-5">
                        <div class="font-bold text-slate-900 text-sm leading-snug">${g.name}</div>
                        <div class="text-xs text-slate-400 space-y-0.5 mt-0.5">
                          ${g.email ? `<div class="flex items-center gap-1.5"><i data-lucide="mail" class="w-3 h-3 text-slate-400"></i> ${g.email}</div>` : ''}
                          ${g.phone ? `<div class="flex items-center gap-1.5"><i data-lucide="phone" class="w-3 h-3 text-slate-400"></i> ${g.phone}</div>` : ''}
                        </div>
                      </td>

                      <!-- Columna 2: Grupo -->
                      <td class="py-4 px-4 whitespace-nowrap">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                          ${g.group || 'General'}
                        </span>
                      </td>

                      <!-- Columna 3: Estado RSVP -->
                      <td class="py-4 px-4 whitespace-nowrap">
                        <select onchange="updateGuestStatus('${g.id}', this.value)" class="text-xs font-bold px-3 py-1 rounded-full border cursor-pointer focus:outline-none transition-all ${
                          g.status === 'Confirmado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          g.status === 'Pendiente' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-rose-50 text-rose-700 border-rose-200'
                        }">
                          <option value="Pendiente" ${g.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                          <option value="Confirmado" ${g.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
                          <option value="Rechazado" ${g.status === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
                        </select>
                      </td>

                      <!-- Columna 4: Menú / Restricciones -->
                      <td class="py-4 px-4">
                        <div class="space-y-1">
                          <span class="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                            🍽️ ${g.menu || 'Adulto'}
                          </span>
                          ${g.allergies && g.allergies.trim() !== '' ? `
                            <div class="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-lg">
                              <i data-lucide="alert-triangle" class="w-3 h-3 text-rose-600"></i>
                              <span>${g.allergies}</span>
                            </div>
                          ` : ''}
                        </div>
                      </td>

                      <!-- Columna 5: Acompañante (+1) -->
                      <td class="py-4 px-4">
                        ${g.plusOneAllowed && g.plusOneName ? `
                          <div>
                            <div class="font-bold text-slate-900 text-xs">👤 ${g.plusOneName}</div>
                            <div class="text-[11px] text-wedding-700 font-medium">Menú: ${g.plusOneMenu || 'Adulto'}</div>
                          </div>
                        ` : `
                          <span class="text-xs text-slate-400 italic">Sin acompañante</span>
                        `}
                      </td>

                      <!-- Columna 6: Acciones -->
                      <td class="py-4 px-5 text-right whitespace-nowrap">
                        <div class="flex items-center justify-end gap-1">
                          <button onclick="openAddGuestModal('${g.id}')" title="Editar invitado" class="p-2 text-slate-400 hover:text-wedding-600 hover:bg-wedding-50 rounded-xl transition-colors">
                            <i data-lucide="pencil" class="w-4 h-4"></i>
                          </button>
                          <button onclick="deleteGuest('${g.id}')" title="Eliminar invitado" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                          </button>
                        </div>
                      </td>

                    </tr>
                  `;
                }).join('')}
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
    showToast(`Estado de ${guest.name} actualizado a ${newStatus}`);
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

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Mesa Asignada</label>
        <select id="g-table" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
          <option value="Sin asignar" ${!guest || guest.table === 'Sin asignar' ? 'selected' : ''}>Sin asignar</option>
          ${(store.tables || []).map(t => `
            <option value="${t.id}" ${guest && (guest.table === t.id \vert{}\vert{} guest.table === t.name) ? 'selected' : ''}>${t.name}</option>
          `).join('')}
        </select>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Menú Específico</label>
          <select id="g-menu" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
            <option value="Adulto" ${guest && guest.menu === 'Adulto' ? 'selected' : ''}>Adulto (Estándar)</option>
            <option value="Niño" ${guest && guest.menu === 'Niño' ? 'selected' : ''}>Niño</option>
            <option value="Vegetariano" ${guest && guest.menu === 'Vegetariano' ? 'selected' : ''}>Vegetariano</option>
            <option value="Vegano" ${guest && guest.menu === 'Vegano' ? 'selected' : ''}>Vegano</option>
            <option value="Celiaco" ${guest && guest.menu === 'Celiaco' ? 'selected' : ''}>Celíaco (Sin Gluten)</option>
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
            <option value="Celiaco" ${guest && guest.plusOneMenu === 'Celiaco' ? 'selected' : ''}>Celíaco (Sin Gluten)</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Mensaje / Dedicatoria</label>
        <textarea id="g-wishes" rows="2" placeholder="Mensaje para los novios..." class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">${guest ? (guest.wishes || '') : ''}</textarea>
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
  const table = document.getElementById('g-table')?.value || 'Sin asignar';
  const menu = document.getElementById('g-menu').value;
  const allergies = document.getElementById('g-allergies').value;
  const plusOneAllowed = document.getElementById('g-plusone-allowed').checked;
  const plusOneName = document.getElementById('g-plusone-name')?.value || '';
  const plusOneMenu = document.getElementById('g-plusone-menu')?.value || '';
  const wishes = document.getElementById('g-wishes')?.value || '';

  if (guestId) {
    const idx = store.guests.findIndex(g => g.id === guestId);
    if (idx !== -1) {
      store.guests[idx] = {
        ...store.guests[idx],
        name, email, phone, group, status, table, menu, allergies,
        plusOneAllowed, plusOneName, plusOneMenu, wishes
      };
    }
  } else {
    store.guests.push({
      id: "guest-" + Date.now(),
      name, email, phone, group, status, table, menu, allergies,
      plusOneAllowed, plusOneName, plusOneMenu, wishes,
      notes: ''
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
// MÓDULO 3: ESPACIOS
// ==========================================
function renderEspaciosModule() {
  const ceremony = store.spaces?.ceremony || {};
  const banquet = store.spaces?.banquet || {};

  return `
    <div class="space-y-6 animate-fade-in">
      <h2 class="text-2xl font-bold text-slate-900">Espacios de la Boda</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <h3 class="font-bold text-lg text-slate-900">💒 Ceremonia</h3>
          <p class="text-sm text-slate-600 mt-1">${ceremony.name || 'Sin definir'}</p>
          <p class="text-xs text-slate-400 mt-0.5">${ceremony.address || ''}</p>
        </div>
        <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <h3 class="font-bold text-lg text-slate-900">🍾 Banquete</h3>
          <p class="text-sm text-slate-600 mt-1">${banquet.name || 'Sin definir'}</p>
          <p class="text-xs text-slate-400 mt-0.5">${banquet.address || ''}</p>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// MÓDULO 4: PROVEEDORES
// ==========================================
function renderProveedoresModule() {
  const suppliers = store.suppliers || [];
  return `
    <div class="space-y-6 animate-fade-in">
      <h2 class="text-2xl font-bold text-slate-900">Proveedores</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${suppliers.map(s => `
          <div class="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <span class="text-[10px] font-bold text-wedding-700 bg-wedding-50 px-2 py-0.5 rounded-full">${s.category}</span>
            <h3 class="font-bold text-slate-900 text-base mt-2">${s.name}</h3>
            <p class="text-xs text-slate-500 mt-1">${formatMoney(s.totalAmount)} (Pagado:${formatMoney(s.paidAmount)})</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ==========================================
// MÓDULO 5: SITIO WEB / RSVP
// ==========================================
function renderWebInvitadosModule() {
  return `
    <div class="space-y-6 animate-fade-in max-w-2xl mx-auto text-center">
      <div class="bg-wedding-800 text-white p-8 rounded-3xl shadow-lg">
        <h2 class="text-3xl font-extrabold mb-2">${store.weddingDetails.coupleNames}</h2>
        <p class="text-xs text-rose-100">Sitio Web & Portal RSVP Oficial</p>
      </div>
      <button onclick="copyPublicLink()" class="bg-slate-900 text-white font-semibold text-xs px-5 py-2.5 rounded-xl">
        Copiar Enlace de Confirmación
      </button>
    </div>
  `;
}

function copyPublicLink() {
  navigator.clipboard.writeText(window.location.href);
  showToast('Enlace copiado al portapapeles');
}

// ==========================================
// MÓDULO 6: TAREAS
// ==========================================
function renderTareasModule() {
  const tasks = store.tasks || [];
  return `
    <div class="space-y-6 animate-fade-in">
      <h2 class="text-2xl font-bold text-slate-900">Checklist de Tareas</h2>
      <div class="bg-white rounded-3xl border border-slate-100 p-4 divide-y divide-slate-100">
        ${tasks.map(t => `
          <div class="py-3 flex items-center justify-between">
            <span class="${t.status === 'completada' ? 'line-through text-slate-400' : 'text-slate-800'} font-semibold text-sm">${t.title}</span>
            <span class="text-xs px-2 py-1 bg-slate-100 rounded-lg text-slate-600">${t.phase}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ==========================================
// MÓDULO 7: PRESUPUESTO
// ==========================================
function renderPresupuestoModule() {
  const expenses = store.expenses || [];
  const totalReal = expenses.reduce((acc, e) => acc + (e.realCost || 0), 0);
  return `
    <div class="space-y-6 animate-fade-in">
      <h2 class="text-2xl font-bold text-slate-900">Presupuesto</h2>
      <p class="text-sm text-slate-500">Gasto total acumulado: ${formatMoney(totalReal)}</p>
      <div class="bg-white rounded-3xl border border-slate-100 p-4 divide-y divide-slate-100">
        ${expenses.map(e => `
          <div class="py-3 flex items-center justify-between">
            <div>
              <div class="font-bold text-slate-800 text-sm">${e.concept}</div>
              <div class="text-xs text-slate-400">${e.category}</div>
            </div>
            <div class="font-bold text-slate-900 text-sm">${formatMoney(e.realCost)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ==========================================
// MÓDULO 8: ITINERARIO
// ==========================================
function renderItinerarioModule() {
  const items = store.itinerary || [];
  return `
    <div class="space-y-6 animate-fade-in">
      <h2 class="text-2xl font-bold text-slate-900">Itinerario del Día</h2>
      <div class="bg-white rounded-3xl border border-slate-100 p-6 space-y-3">
        ${items.map(i => `
          <div class="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
            <span class="bg-slate-900 text-white font-black text-xs px-2.5 py-1 rounded-lg">${i.timeStart}</span>
            <div class="font-bold text-slate-900 text-sm">${i.title}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ==========================================
// MÓDULO 9: DISTRIBUCIÓN DE MESAS
// ==========================================
function renderMesasModule() {
  const tables = store.tables || [];
  return `
    <div class="space-y-6 animate-fade-in">
      <h2 class="text-2xl font-bold text-slate-900">Distribución de Mesas</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${tables.map(t => `
          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <h3 class="font-bold text-slate-900 text-base">${t.name}</h3>
            <p class="text-xs text-slate-500 mt-1">Capacidad: ${t.capacity} personas (${t.shape})</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ==========================================
// MÓDULO 10: NOTAS E IDEAS
// ==========================================
function renderNotasModule() {
  const notes = store.notes || [];
  return `
    <div class="space-y-6 animate-fade-in">
      <h2 class="text-2xl font-bold text-slate-900">Notas, Ideas & Recordatorios</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${notes.map(n => `
          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <span class="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">${n.category}</span>
            <h3 class="font-bold text-slate-900 text-base mt-2">${n.title}</h3>
            <p class="text-xs text-slate-600 mt-1 whitespace-pre-line">${n.content}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ==========================================
// MÓDULO 11: CONFIGURACIÓN Y COPIAS DE SEGURIDAD
// ==========================================
function renderConfiguracionModule() {
  const details = store.weddingDetails || INITIAL_STATE.weddingDetails;
  
  const rawData = localStorage.getItem(STORAGE_KEY) || "";
  const storageKb = (rawData.length / 1024).toFixed(2);

  return `
    <div class="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Configuración & Copias de Seguridad</h2>
        <p class="text-slate-500 text-sm">Personaliza los datos principales de tu boda, exporta e importa respaldos y gestiona la PWA.</p>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div class="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div class="p-2.5 bg-wedding-100 text-wedding-600 rounded-2xl">
            <i data-lucide="heart" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900">Detalles Generales del Evento</h3>
            <p class="text-xs text-slate-400">Esta información actualiza los encabezados y presupuestos en toda la app.</p>
          </div>
        </div>

        <form onsubmit="saveWeddingDetailsForm(event)" class="space-y-4 pt-2">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Nombres de la Pareja *</label>
              <input type="text" id="cfg-couple" required value="${details.coupleNames || ''}" placeholder="Ej: Ana & Carlos" class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500 font-medium">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Fecha Oficial de la Boda *</label>
              <input type="date" id="cfg-date" required value="${details.date || ''}" class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500 font-medium">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="sm:col-span-1">
              <label class="block text-xs font-semibold text-slate-700 mb-1">Ciudad / Lugar Principal *</label>
              <input type="text" id="cfg-location" required value="${details.location || ''}" placeholder="Ej: Hacienda El Paraíso, Madrid" class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500 font-medium">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Presupuesto Objetivo Total *</label>
              <input type="number" id="cfg-budget" min="0" required value="${details.totalBudget || 18000}" class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500 font-medium">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Símbolo de Moneda *</label>
              <select id="cfg-currency" required class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500 font-medium text-slate-800">
                <option value="€" ${details.currencySymbol === '€' ? 'selected' : ''}>€ (Euros - EUR)</option>
                <option value="$" ${details.currencySymbol === '$' ? 'selected' : ''}>$ (Dólares / Pesos - USD)</option>
                <option value="S/" ${details.currencySymbol === 'S/' ? 'selected' : ''}>S/ (Soles - PEN)</option>
                <option value="MXN $" ${details.currencySymbol === 'MXN $' ? 'selected' : ''}>MXN $ (Pesos Mexicanos)</option>
                <option value="COP $" ${details.currencySymbol === 'COP $' ? 'selected' : ''}>COP $ (Pesos Colombianos)</option>
                <option value="CLP $" ${details.currencySymbol === 'CLP $' ? 'selected' : ''}>CLP $ (Pesos Chilenos)</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <button type="submit" class="inline-flex items-center gap-2 bg-wedding-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-wedding-700 transition-colors shadow-sm">
              <i data-lucide="save" class="w-4 h-4"></i>
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-3 mb-3">
              <div class="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                <i data-lucide="download" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900">Exportar Copia de Seguridad</h3>
                <p class="text-xs text-slate-400">Descarga un respaldo completo en tu dispositivo.</p>
              </div>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              Genera un archivo <strong>.JSON</strong> con absolutamente todos los datos de tu boda.
            </p>
          </div>

          <div class="space-y-2 pt-2">
            <button onclick="exportFullJSON()" class="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold text-xs px-4 py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
              <i data-lucide="database" class="w-4 h-4"></i>
              Descargar Respaldo JSON Completo
            </button>
            <button onclick="exportGuestsToCSV()" class="w-full inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-200 transition-colors">
              <i data-lucide="file-spreadsheet" class="w-4 h-4"></i>
              Exportar Lista de Invitados (CSV)
            </button>
          </div>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-3 mb-3">
              <div class="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                <i data-lucide="upload" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900">Importar / Restaurar Respaldo</h3>
                <p class="text-xs text-slate-400">Carga una copia de seguridad previamente descargada.</p>
              </div>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              Selecciona un archivo <strong>.JSON</strong> válido de Mi Boda para reemplazar el estado actual.
            </p>
          </div>

          <div class="pt-2">
            <label class="w-full cursor-pointer inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold text-xs px-4 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
              <i data-lucide="folder-open" class="w-4 h-4"></i>
              <span>Seleccionar Archivo JSON</span>
              <input type="file" accept=".json" onchange="handleImportJSON(event)" class="hidden">
            </label>
          </div>
        </div>

      </div>

      <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div class="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div class="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
            <i data-lucide="smartphone" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900">Estado PWA y Rendimiento Local</h3>
            <p class="text-xs text-slate-400">Verificación de persistencia offline e instalación.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span class="text-slate-400 block font-medium mb-1">Estado Conexión</span>
            <span class="font-bold text-emerald-600 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ${navigator.onLine ? 'En línea (Sincronizado)' : 'Modo Offline (Local)'}
            </span>
          </div>

          <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span class="text-slate-400 block font-medium mb-1">Espacio de Almacenamiento</span>
            <span class="font-bold text-slate-900">${storageKb} KB utilizados en localStorage</span>
          </div>

          <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span class="text-slate-400 block font-medium mb-1">Instalación PWA</span>
            <span class="font-bold text-wedding-700">Listo para pantalla de inicio</span>
          </div>
        </div>
      </div>

      <div class="bg-rose-50/60 p-6 rounded-3xl border border-rose-100 shadow-sm space-y-4">
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-rose-100 text-rose-700 rounded-2xl">
            <i data-lucide="alert-triangle" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-rose-900">Zona de Peligro: Restablecer Aplicación</h3>
            <p class="text-xs text-rose-700">Elimina todos los registros guardados y restaura los datos iniciales de fábrica.</p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
          <p class="text-xs text-rose-800 leading-relaxed max-w-xl">
            Si deseas reiniciar completamente el planificador para comenzar desde cero, haz clic en el botón. Esta acción no se podrá deshacer a menos que tengas un respaldo JSON descargado.
          </p>

          <button onclick="resetAllData()" class="inline-flex items-center gap-2 bg-rose-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-rose-700 transition-colors shadow-sm whitespace-nowrap">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
            Restablecer Todo
          </button>
        </div>
      </div>

    </div>
  `;
}

function saveWeddingDetailsForm(e) {
  e.preventDefault();

  const coupleNames = document.getElementById('cfg-couple').value;
  const date = document.getElementById('cfg-date').value;
  const location = document.getElementById('cfg-location').value;
  const totalBudget = parseFloat(document.getElementById('cfg-budget').value) || 0;
  const currencySymbol = document.getElementById('cfg-currency').value;

  store.weddingDetails = {
    coupleNames,
    date,
    location,
    totalBudget,
    currencySymbol
  };

  saveData();
  showToast('Configuración general actualizada correctamente');
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

function exportGuestsToCSV() {
  if (!store.guests || store.guests.length === 0) {
    showToast('No hay invitados para exportar');
    return;
  }

  const headers = ["Nombre", "Email", "Telefono", "Grupo", "Estado", "Mesa", "Menu", "Alergias"];
  const rows = store.guests.map(g => [
    `"${g.name}"`,
    `"${g.email || ''}"`,
    `"${g.phone || ''}"`,
    `"${g.group}"`,
    `"${g.status}"`,
    `"${g.table || 'Sin asignar'}"`,
    `"${g.menu || 'Adulto'}"`,
    `"${g.allergies || ''}"`
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

function handleImportJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed && typeof parsed === 'object' && parsed.weddingDetails) {
        store = parsed;
        saveData();
        showToast('¡Copia de seguridad restaurada exitosamente!');
      } else {
        alert('El archivo JSON no tiene una estructura válida de respaldo de Mi Boda.');
      }
    } catch (err) {
      alert('Error al procesar el archivo JSON. Asegúrate de que sea un archivo de respaldo válido.');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function resetAllData() {
  const confirm1 = confirm('⚠️ ATENCIÓN: ¿Estás seguro de que deseas borrar todos los datos guardados en la aplicación?');
  if (!confirm1) return;

  const confirm2 = confirm('🚨 CONFIRMACIÓN FINAL: Esta acción borrará permanentemente tus invitados, gastos y notas. ¿Deseas reiniciar al estado inicial?');
  if (!confirm2) return;

  store = JSON.parse(JSON.stringify(INITIAL_STATE));
  saveData();
  showToast('La aplicación se ha reiniciado a su estado inicial');
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