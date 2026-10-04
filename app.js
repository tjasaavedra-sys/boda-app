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
      notes: "Acordado un presupuesto tope de 18,000€"
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
    if (!parsed.guests) parsed.guests = INITIAL_STATE.guests;
    if (!parsed.tasks) parsed.tasks = INITIAL_STATE.tasks;
    if (!parsed.expenses) parsed.expenses = INITIAL_STATE.expenses;
    if (!parsed.itinerary) parsed.itinerary = INITIAL_STATE.itinerary;
    if (!parsed.tables) parsed.tables = INITIAL_STATE.tables;
    if (!parsed.notes) parsed.notes = INITIAL_STATE.notes;
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

let supplierSearchQuery = "";
let supplierCategoryFilter = "todas";
let supplierStatusFilter = "todos";

let taskSearchQuery = "";
let taskStatusFilter = "todas";
let taskPhaseFilter = "todas";

let expenseSearchQuery = "";
let expenseCategoryFilter = "todas";

let itinerarySearchQuery = "";
let itineraryPhaseFilter = "todas";

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

const ITINERARY_PHASES = [
  "Mañana / Preparativos",
  "Ceremonia",
  "Recepción / Cóctel",
  "Banquete",
  "Fiesta / Protocolo",
  "Cierre / Post-boda"
];

const EXPENSE_CATEGORIES = [
  "Lugar y Catering",
  "Fotografía y Video",
  "Música y Animación",
  "Vestuario y Maquillaje",
  "Decoración y Flores",
  "Recuerdos y Papelería",
  "Imprevistos",
  "Otros"
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
// MÓDULO 2: LISTA DE INVITADOS
// ==========================================
function renderInvitadosModule() {
  const guests = store.guests || [];

  let filteredGuests = guests.filter(g => {
    const query = guestSearchQuery.toLowerCase();
    const matchesSearch = g.name.toLowerCase().includes(query) || 
                          (g.email && g.email.toLowerCase().includes(query)) ||
                          (g.phone && g.phone.toLowerCase().includes(query)) ||
                          (g.group && g.group.toLowerCase().includes(query));
    const matchesStatus = guestStatusFilter === "todos" || g.status === guestStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPrimary = guests.length;
  const totalCompanions = guests.reduce((acc, g) => acc + (g.plusOneAllowed && g.plusOneName ? 1 : 0), 0);
  const totalAllGuests = totalPrimary + totalCompanions;

  const confirmedGuests = guests.reduce((acc, g) => {
    let count = g.status === 'Confirmado' ? 1 : 0;
    if (g.status === 'Confirmado' && g.plusOneAllowed && g.plusOneName) count += 1;
    return acc + count;
  }, 0);

  const pendingGuests = guests.filter(g => g.status === 'Pendiente').length;
  const restrictionsCount = guests.filter(g => (g.allergies && g.allergies.trim() !== '')).length;

  return `
    <div class="space-y-6 animate-fade-in">
      
      <!-- ENCABEZADO Y ACCIONES -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Lista de Invitados</h2>
          <p class="text-slate-500 text-sm">Gestiona RSVP, menús especiales, alergias y acompañantes (+1).</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button onclick="triggerCSVImport()" class="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-colors">
            <i data-lucide="file-up" class="w-4 h-4"></i>
            <span>Importar CSV</span>
          </button>
          <button onclick="clearAllGuests()" class="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-colors">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
            <span>Vaciar Lista</span>
          </button>
          <button onclick="openAddGuestModal()" class="inline-flex items-center justify-center gap-2 bg-wedding-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-wedding-700 transition-colors shadow-sm active:scale-95">
            <i data-lucide="user-plus" class="w-4 h-4"></i>
            <span>+ Añadir Invitado</span>
          </button>
        </div>
      </div>

      <!-- 4 TARJETAS KPI DE RESUMEN SUPERIORES -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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

      <!-- BARRA DE BÚSQUEDA Y FILTROS -->
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

      <!-- TABLA DETALLADA DE INVITADOS -->
      <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        ${filteredGuests.length === 0 ? `
          <div class="p-12 text-center text-slate-500">
            <div class="p-4 bg-slate-50 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center text-slate-400">
              <i data-lucide="users-2" class="w-6 h-6"></i>
            </div>
            <p class="text-sm font-semibold text-slate-700">No hay invitados registrados que coincidan.</p>
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
                      <td class="py-4 px-5">
                        <div class="font-bold text-slate-900 text-sm leading-snug">${g.name}</div>
                        <div class="text-xs text-slate-400 space-y-0.5 mt-0.5">
                          ${g.email ? `<div class="flex items-center gap-1.5"><i data-lucide="mail" class="w-3 h-3 text-slate-400"></i> ${g.email}</div>` : ''}
                          ${g.phone ? `<div class="flex items-center gap-1.5"><i data-lucide="phone" class="w-3 h-3 text-slate-400"></i> ${g.phone}</div>` : ''}
                        </div>
                      </td>

                      <td class="py-4 px-4 whitespace-nowrap">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                          ${g.group || 'General'}
                        </span>
                      </td>

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

function triggerCSVImport() {
  document.getElementById('csv-file-input').click();
}

function importGuestsCSV(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const text = evt.target.result;
    const lines = text.split('\n');
    let importedCount = 0;

    lines.forEach((line, index) => {
      if (index === 0 || !line.trim()) return; // Ignorar cabecera o líneas vacías
      const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
      if (parts[0]) {
        store.guests.push({
          id: 'guest-' + Date.now() + '-' + Math.floor(Math.random()*1000),
          name: parts[0] || 'Invitado CSV',
          email: parts[1] || '',
          phone: parts[2] || '',
          group: parts[3] || 'Familia Novia',
          status: parts[4] || 'Pendiente',
          table: parts[5] || 'Sin asignar',
          menu: parts[6] || 'Adulto',
          allergies: parts[7] || '',
          plusOneAllowed: false,
          plusOneName: '',
          plusOneMenu: 'Adulto',
          wishes: ''
        });
        importedCount++;
      }
    });

    saveData();
    showToast(`¡Se importaron ${importedCount} invitados correctamente desde el CSV!`);
    e.target.value = '';
  };
  reader.readAsText(file);
}

function clearAllGuests() {
  if (confirm('⚠️ ¿Estás seguro de vaciar TODA la lista de invitados? Se perderán las asignaciones.')) {
    store.guests = [];
    saveData();
    showToast('Lista de invitados vaciada');
  }
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
            <option value="${t.id}" ${guest && (guest.table === t.id || guest.table === t.name) ? 'selected' : ''}>${t.name}</option>
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
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Espacios de la Boda</h2>
          <p class="text-slate-500 text-sm">Organiza y edita los detalles de la Ceremonia y Banquete.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="flex items-center gap-3">
                <div class="p-3 bg-wedding-100 text-wedding-600 rounded-2xl">
                  <i data-lucide="church" class="w-6 h-6"></i>
                </div>
                <div>
                  <span class="text-xs font-bold uppercase tracking-wider text-wedding-600">Ceremonia</span>
                  <h3 class="text-xl font-extrabold text-slate-900">${ceremony.name || 'Sin definir'}</h3>
                </div>
              </div>
              <button onclick="openEditSpaceModal('ceremony')" class="p-2 text-slate-400 hover:text-wedding-600 hover:bg-wedding-50 rounded-xl transition-colors">
                <i data-lucide="edit-3" class="w-5 h-5"></i>
              </button>
            </div>
            <p class="text-sm text-slate-600 mb-2">📍 ${ceremony.address || 'Sin dirección'}</p>
            <p class="text-xs text-slate-500 mb-2">🕒 Hora: ${ceremony.time || '--:--'} | 👥 Capacidad: ${ceremony.capacity || 0} pers.</p>
            <p class="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-100">${ceremony.notes || 'Sin notas adicionales.'}</p>
          </div>
          ${ceremony.mapUrl ? `
            <a href="${ceremony.mapUrl}" target="_blank" class="mt-4 inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors">
              <i data-lucide="map-pin" class="w-4 h-4"></i> Abrir en Google Maps
            </a>
          ` : ''}
        </div>

        <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="flex items-center gap-3">
                <div class="p-3 bg-wedding-100 text-wedding-600 rounded-2xl">
                  <i data-lucide="utensils-crossed" class="w-6 h-6"></i>
                </div>
                <div>
                  <span class="text-xs font-bold uppercase tracking-wider text-wedding-600">Banquete</span>
                  <h3 class="text-xl font-extrabold text-slate-900">${banquet.name || 'Sin definir'}</h3>
                </div>
              </div>
              <button onclick="openEditSpaceModal('banquet')" class="p-2 text-slate-400 hover:text-wedding-600 hover:bg-wedding-50 rounded-xl transition-colors">
                <i data-lucide="edit-3" class="w-5 h-5"></i>
              </button>
            </div>
            <p class="text-sm text-slate-600 mb-2">📍 ${banquet.address || 'Sin dirección'}</p>
            <p class="text-xs text-slate-500 mb-2">🕒 Hora: ${banquet.time || '--:--'} | 👥 Capacidad: ${banquet.capacity || 0} pers.</p>
            <p class="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-100">${banquet.notes || 'Sin notas adicionales.'}</p>
          </div>
          ${banquet.mapUrl ? `
            <a href="${banquet.mapUrl}" target="_blank" class="mt-4 inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors">
              <i data-lucide="map-pin" class="w-4 h-4"></i> Abrir en Google Maps
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function openEditSpaceModal(type) {
  const space = store.spaces ? store.spaces[type] || {} : {};
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  modalTitle.textContent = type === 'ceremony' ? 'Editar Espacio de Ceremonia' : 'Editar Espacio de Banquete';

  modalBody.innerHTML = `
    <form onsubmit="saveSpaceForm(event, '${type}')" class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Nombre del Lugar *</label>
        <input type="text" id="sp-name" required value="${space.name || ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Dirección Completa *</label>
        <input type="text" id="sp-address" required value="${space.address || ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Hora de Inicio</label>
          <input type="time" id="sp-time" value="${space.time || ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Capacidad (Personas)</label>
          <input type="number" id="sp-capacity" value="${space.capacity || 0}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Enlace Mapa (Google Maps URL)</label>
        <input type="url" id="sp-mapurl" value="${space.mapUrl || ''}" placeholder="https://maps.google.com/..." class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Notas e Instrucciones</label>
        <textarea id="sp-notes" rows="3" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">${space.notes || ''}</textarea>
      </div>
      <div class="pt-4 flex justify-end gap-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
        <button type="submit" class="px-5 py-2 text-xs font-semibold text-white bg-wedding-600 rounded-xl">Guardar Espacio</button>
      </div>
    </form>
  `;
  openModal();
}

function saveSpaceForm(e, type) {
  e.preventDefault();
  store.spaces[type] = {
    name: document.getElementById('sp-name').value,
    address: document.getElementById('sp-address').value,
    time: document.getElementById('sp-time').value,
    capacity: parseInt(document.getElementById('sp-capacity').value) || 0,
    mapUrl: document.getElementById('sp-mapurl').value,
    notes: document.getElementById('sp-notes').value
  };
  saveData();
  closeModal();
  showToast('Espacio actualizado correctamente');
}

// ==========================================
// MÓDULO 4: PROVEEDORES
// ==========================================
function renderProveedoresModule() {
  const suppliers = store.suppliers || [];

  const totalContracted = suppliers.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
  const totalPaid = suppliers.reduce((acc, s) => acc + (s.paidAmount || 0), 0);
  const totalPending = totalContracted - totalPaid;

  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Proveedores</h2>
          <p class="text-slate-500 text-sm">Gestiona contratos, saldos pagados y presupuestos pendientes.</p>
        </div>
        <button onclick="openSupplierModal()" class="inline-flex items-center gap-2 bg-wedding-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-wedding-700 transition-colors shadow-sm">
          <i data-lucide="plus-circle" class="w-4 h-4"></i>
          <span>+ Añadir Proveedor</span>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <span class="text-xs font-semibold text-slate-500 block mb-1">Total Contratado</span>
          <span class="text-xl font-bold text-slate-900">${formatMoney(totalContracted)}</span>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <span class="text-xs font-semibold text-emerald-600 block mb-1">Total Pagado</span>
          <span class="text-xl font-bold text-emerald-700">${formatMoney(totalPaid)}</span>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <span class="text-xs font-semibold text-rose-600 block mb-1">Saldo Pendiente</span>
          <span class="text-xl font-bold text-rose-700">${formatMoney(totalPending)}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${suppliers.map(s => `
          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-bold text-wedding-700 bg-wedding-50 px-2.5 py-0.5 rounded-full border border-wedding-100">${s.category}</span>
                <span class="text-xs font-semibold ${s.status === 'Reservado' ? 'text-emerald-600' : 'text-amber-600'}">${s.status}</span>
              </div>
              <h3 class="font-bold text-slate-900 text-lg">${s.name}</h3>
              <p class="text-xs text-slate-500 mt-1">👤 ${s.contactName || 'Sin contacto'} • 📞 ${s.phone || 'Sin teléfono'}</p>
              ${s.notes ? `<p class="text-xs text-slate-400 mt-2 italic bg-slate-50 p-2 rounded-xl">${s.notes}</p>` : ''}
            </div>

            <div class="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
              <div>
                <div class="text-xs text-slate-400">Monto: <strong class="text-slate-800">${formatMoney(s.totalAmount)}</strong></div>
                <div class="text-xs text-emerald-600">Pagado: <strong>${formatMoney(s.paidAmount)}</strong></div>
              </div>
              <div class="flex items-center gap-1">
                <button onclick="openSupplierModal('${s.id}')" class="p-1.5 text-slate-400 hover:text-wedding-600 rounded-lg">
                  <i data-lucide="pencil" class="w-4 h-4"></i>
                </button>
                <button onclick="deleteSupplier('${s.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function openSupplierModal(supplierId = null) {
  const supplier = supplierId ? store.suppliers.find(s => s.id === supplierId) : null;
  const isEdit = !!supplier;

  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  modalTitle.textContent = isEdit ? 'Editar Proveedor' : 'Añadir Proveedor';

  modalBody.innerHTML = `
    <form onsubmit="saveSupplierForm(event, '${supplierId || ''}')" class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Nombre o Empresa *</label>
        <input type="text" id="sup-name" required value="${supplier ? supplier.name : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
          <input type="text" id="sup-category" value="${supplier ? supplier.category : 'Catering'}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Estado Contrato</label>
          <select id="sup-status" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
            <option value="Cotizando" ${supplier && supplier.status === 'Cotizando' ? 'selected' : ''}>Cotizando</option>
            <option value="Reservado" ${!supplier || supplier.status === 'Reservado' ? 'selected' : ''}>Reservado</option>
            <option value="Pagado Total" ${supplier && supplier.status === 'Pagado Total' ? 'selected' : ''}>Pagado Total</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Persona de Contacto</label>
          <input type="text" id="sup-contact" value="${supplier ? (supplier.contactName || '') : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
          <input type="tel" id="sup-phone" value="${supplier ? (supplier.phone || '') : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Costo Total (${getCurrencySymbol()}) *</label>
          <input type="number" id="sup-total" required value="${supplier ? supplier.totalAmount : 0}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Monto Pagado (${getCurrencySymbol()})</label>
          <input type="number" id="sup-paid" value="${supplier ? supplier.paidAmount : 0}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Notas / Detalles del Servicio</label>
        <textarea id="sup-notes" rows="2" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">${supplier ? (supplier.notes || '') : ''}</textarea>
      </div>
      <div class="pt-4 flex justify-end gap-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
        <button type="submit" class="px-5 py-2 text-xs font-semibold text-white bg-wedding-600 rounded-xl">Guardar Proveedor</button>
      </div>
    </form>
  `;
  openModal();
}

function saveSupplierForm(e, supplierId) {
  e.preventDefault();

  const name = document.getElementById('sup-name').value;
  const category = document.getElementById('sup-category').value;
  const status = document.getElementById('sup-status').value;
  const contactName = document.getElementById('sup-contact').value;
  const phone = document.getElementById('sup-phone').value;
  const totalAmount = parseFloat(document.getElementById('sup-total').value) || 0;
  const paidAmount = parseFloat(document.getElementById('sup-paid').value) || 0;
  const notes = document.getElementById('sup-notes').value;

  if (supplierId) {
    const idx = store.suppliers.findIndex(s => s.id === supplierId);
    if (idx !== -1) {
      store.suppliers[idx] = { ...store.suppliers[idx], name, category, status, contactName, phone, totalAmount, paidAmount, notes };
    }
  } else {
    store.suppliers.push({
      id: "sup-" + Date.now(),
      name, category, status, contactName, phone, totalAmount, paidAmount, notes
    });
  }

  saveData();
  closeModal();
  showToast(supplierId ? 'Proveedor actualizado' : 'Proveedor guardado');
}

function deleteSupplier(id) {
  if (confirm('¿Deseas eliminar este proveedor?')) {
    store.suppliers = store.suppliers.filter(s => s.id !== id);
    saveData();
    showToast('Proveedor eliminado');
  }
}

// ==========================================
// MÓDULO 5: SITIO WEB / RSVP
// ==========================================
function renderWebInvitadosModule() {
  const guests = store.guests || [];

  return `
    <div class="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div class="bg-gradient-to-r from-wedding-800 via-wedding-700 to-wedding-600 text-white p-8 rounded-3xl text-center shadow-lg">
        <span class="text-xs font-bold uppercase tracking-widest text-rose-200">Invitación Digital & Portal RSVP</span>
        <h2 class="text-3xl font-extrabold mt-1 mb-2">${store.weddingDetails.coupleNames}</h2>
        <p class="text-xs text-rose-100">Simulación del formulario público de confirmación de asistencia.</p>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 class="font-bold text-slate-900 text-base">Probar Confirmación de Invitado</h3>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Selecciona un invitado registrado para simular su RSVP:</label>
          <select onchange="selectRsvpGuest(this.value)" class="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500 font-medium">
            <option value="">-- Seleccionar invitado --</option>
            ${guests.map(g => `<option value="${g.id}">${g.name} (${g.status})</option>`).join('')}
          </select>
        </div>

        <div id="rsvp-guest-editor"></div>
      </div>
    </div>
  `;
}

function selectRsvpGuest(guestId) {
  const container = document.getElementById('rsvp-guest-editor');
  if (!container || !guestId) {
    if (container) container.innerHTML = '';
    return;
  }

  const guest = store.guests.find(g => g.id === guestId);
  if (!guest) return;

  container.innerHTML = `
    <form onsubmit="savePublicRsvp(event, '${guest.id}')" class="space-y-4 pt-3 border-t border-slate-100">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">¿Asistirás a la boda?</label>
          <select id="rsvp-status" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold">
            <option value="Confirmado" ${guest.status === 'Confirmado' ? 'selected' : ''}>¡Sí, confirmo mi asistencia!</option>
            <option value="Rechazado" ${guest.status === 'Rechazado' ? 'selected' : ''}>Lamentablemente no podré asistir</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Menú Seleccionado</label>
          <select id="rsvp-menu" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
            <option value="Adulto" ${guest.menu === 'Adulto' ? 'selected' : ''}>Adulto (Estándar)</option>
            <option value="Vegetariano" ${guest.menu === 'Vegetariano' ? 'selected' : ''}>Vegetariano</option>
            <option value="Vegano" ${guest.menu === 'Vegano' ? 'selected' : ''}>Vegano</option>
            <option value="Celiaco" ${guest.menu === 'Celiaco' ? 'selected' : ''}>Celíaco (Sin Gluten)</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Alergias o Restricciones Alimentarias</label>
        <input type="text" id="rsvp-allergies" value="${guest.allergies || ''}" placeholder="Ej: Lactosa, marisco..." class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Mensaje o Felicitaciones para los Novios</label>
        <textarea id="rsvp-wishes" rows="2" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">${guest.wishes || ''}</textarea>
      </div>

      <button type="submit" class="w-full py-2.5 bg-wedding-600 text-white font-bold text-xs rounded-xl hover:bg-wedding-700 transition-colors shadow-sm">
        Guardar Confirmación RSVP
      </button>
    </form>
  `;
}

function savePublicRsvp(e, guestId) {
  e.preventDefault();
  const guest = store.guests.find(g => g.id === guestId);
  if (guest) {
    guest.status = document.getElementById('rsvp-status').value;
    guest.menu = document.getElementById('rsvp-menu').value;
    guest.allergies = document.getElementById('rsvp-allergies').value;
    guest.wishes = document.getElementById('rsvp-wishes').value;
    saveData();
    showToast('RSVP registrado correctamente');
  }
}

// ==========================================
// MÓDULO 6: TAREAS
// ==========================================
function renderTareasModule() {
  const tasks = store.tasks || [];

  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Checklist de Tareas</h2>
          <p class="text-slate-500 text-sm">Organizadas por fases cronológicas preparatorias.</p>
        </div>
        <button onclick="openTaskModal()" class="inline-flex items-center gap-2 bg-wedding-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-wedding-700 transition-colors shadow-sm">
          <i data-lucide="plus-circle" class="w-4 h-4"></i>
          <span>+ Añadir Tarea</span>
        </button>
      </div>

      <div class="bg-white rounded-3xl border border-slate-100 p-5 divide-y divide-slate-100 shadow-sm">
        ${tasks.map(t => `
          <div class="py-3 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <input type="checkbox" ${t.status === 'completada' ? 'checked' : ''} onchange="toggleTaskStatus('${t.id}')" class="w-4 h-4 rounded text-wedding-600 focus:ring-wedding-500 cursor-pointer">
              <div>
                <span class="${t.status === 'completada' ? 'line-through text-slate-400' : 'text-slate-800'} font-semibold text-sm block">${t.title}</span>
                <span class="text-xs text-slate-400">📅 Fecha Límite: ${t.dueDate || 'Sin fecha'}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 font-medium">${t.phase}</span>
              <button onclick="openTaskModal('${t.id}')" class="p-1.5 text-slate-400 hover:text-wedding-600 rounded-lg">
                <i data-lucide="pencil" class="w-4 h-4"></i>
              </button>
              <button onclick="deleteTask('${t.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function toggleTaskStatus(id) {
  const task = store.tasks.find(t => t.id === id);
  if (task) {
    task.status = task.status === 'completada' ? 'pendiente' : 'completada';
    saveData();
  }
}

function openTaskModal(taskId = null) {
  const task = taskId ? store.tasks.find(t => t.id === taskId) : null;
  const isEdit = !!task;

  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  modalTitle.textContent = isEdit ? 'Editar Tarea' : 'Añadir Tarea';

  modalBody.innerHTML = `
    <form onsubmit="saveTaskForm(event, '${taskId || ''}')" class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Título de la Tarea *</label>
        <input type="text" id="tk-title" required value="${task ? task.title : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Fase Preparatoria *</label>
          <select id="tk-phase" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
            ${TASK_PHASES.map(p => `<option value="${p}" ${task && task.phase === p ? 'selected' : ''}>${p}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Fecha Límite</label>
          <input type="date" id="tk-duedate" value="${task ? (task.dueDate || '') : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
        </div>
      </div>
      <div class="pt-4 flex justify-end gap-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
        <button type="submit" class="px-5 py-2 text-xs font-semibold text-white bg-wedding-600 rounded-xl">Guardar Tarea</button>
      </div>
    </form>
  `;
  openModal();
}

function saveTaskForm(e, taskId) {
  e.preventDefault();
  const title = document.getElementById('tk-title').value;
  const phase = document.getElementById('tk-phase').value;
  const dueDate = document.getElementById('tk-duedate').value;

  if (taskId) {
    const idx = store.tasks.findIndex(t => t.id === taskId);
    if (idx !== -1) {
      store.tasks[idx] = { ...store.tasks[idx], title, phase, dueDate };
    }
  } else {
    store.tasks.push({
      id: "task-" + Date.now(),
      title, phase, dueDate, priority: "Media", status: "pendiente"
    });
  }

  saveData();
  closeModal();
  showToast(taskId ? 'Tarea actualizada' : 'Tarea añadida');
}

function deleteTask(id) {
  if (confirm('¿Deseas eliminar esta tarea?')) {
    store.tasks = store.tasks.filter(t => t.id !== id);
    saveData();
    showToast('Tarea eliminada');
  }
}

// ==========================================
// MÓDULO 7: PRESUPUESTO
// ==========================================
function renderPresupuestoModule() {
  const expenses = store.expenses || [];
  const targetBudget = store.weddingDetails.totalBudget || 0;
  const totalReal = expenses.reduce((acc, e) => acc + (e.realCost || 0), 0);
  const totalPaid = expenses.reduce((acc, e) => acc + (e.paidAmount || 0), 0);

  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Presupuesto y Gastos</h2>
          <p class="text-slate-500 text-sm">Control detallado de costos estimados, reales y pagos efectuados.</p>
        </div>
        <button onclick="openExpenseModal()" class="inline-flex items-center gap-2 bg-wedding-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-wedding-700 transition-colors shadow-sm">
          <i data-lucide="plus-circle" class="w-4 h-4"></i>
          <span>+ Añadir Gasto</span>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <span class="text-xs font-semibold text-slate-500 block mb-1">Presupuesto Límite</span>
          <span class="text-xl font-bold text-slate-900">${formatMoney(targetBudget)}</span>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <span class="text-xs font-semibold text-purple-600 block mb-1">Gasto Real Total</span>
          <span class="text-xl font-bold text-purple-700">${formatMoney(totalReal)}</span>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <span class="text-xs font-semibold text-emerald-600 block mb-1">Total Pagado</span>
          <span class="text-xl font-bold text-emerald-700">${formatMoney(totalPaid)}</span>
        </div>
      </div>

      <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 divide-y divide-slate-100">
        ${expenses.map(e => `
          <div class="py-3 flex items-center justify-between">
            <div>
              <div class="font-bold text-slate-800 text-sm">${e.concept}</div>
              <div class="text-xs text-slate-400">${e.category}</div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <div class="font-bold text-slate-900 text-sm">${formatMoney(e.realCost)}</div>
                <div class="text-xs text-emerald-600">Pagado: ${formatMoney(e.paidAmount)}</div>
              </div>
              <div class="flex items-center gap-1">
                <button onclick="openExpenseModal('${e.id}')" class="p-1.5 text-slate-400 hover:text-wedding-600 rounded-lg">
                  <i data-lucide="pencil" class="w-4 h-4"></i>
                </button>
                <button onclick="deleteExpense('${e.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function openExpenseModal(expenseId = null) {
  const expense = expenseId ? store.expenses.find(e => e.id === expenseId) : null;
  const isEdit = !!expense;

  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  modalTitle.textContent = isEdit ? 'Editar Gasto' : 'Añadir Gasto';

  modalBody.innerHTML = `
    <form onsubmit="saveExpenseForm(event, '${expenseId || ''}')" class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Concepto *</label>
        <input type="text" id="ex-concept" required value="${expense ? expense.concept : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
        <select id="ex-category" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
          ${EXPENSE_CATEGORIES.map(c => `<option value="${c}" ${expense && expense.category === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Costo Real (${getCurrencySymbol()}) *</label>
          <input type="number" id="ex-real" required value="${expense ? expense.realCost : 0}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Monto Pagado (${getCurrencySymbol()})</label>
          <input type="number" id="ex-paid" value="${expense ? expense.paidAmount : 0}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
      </div>
      <div class="pt-4 flex justify-end gap-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
        <button type="submit" class="px-5 py-2 text-xs font-semibold text-white bg-wedding-600 rounded-xl">Guardar Gasto</button>
      </div>
    </form>
  `;
  openModal();
}

function saveExpenseForm(e, expenseId) {
  e.preventDefault();
  const concept = document.getElementById('ex-concept').value;
  const category = document.getElementById('ex-category').value;
  const realCost = parseFloat(document.getElementById('ex-real').value) || 0;
  const paidAmount = parseFloat(document.getElementById('ex-paid').value) || 0;

  if (expenseId) {
    const idx = store.expenses.findIndex(ex => ex.id === expenseId);
    if (idx !== -1) {
      store.expenses[idx] = { ...store.expenses[idx], concept, category, realCost, paidAmount };
    }
  } else {
    store.expenses.push({
      id: "exp-" + Date.now(),
      concept, category, estimatedCost: realCost, realCost, paidAmount
    });
  }

  saveData();
  closeModal();
  showToast(expenseId ? 'Gasto actualizado' : 'Gasto registrado');
}

function deleteExpense(id) {
  if (confirm('¿Deseas eliminar este registro de gasto?')) {
    store.expenses = store.expenses.filter(e => e.id !== id);
    saveData();
    showToast('Gasto eliminado');
  }
}

// ==========================================
// MÓDULO 8: ITINERARIO
// ==========================================
function renderItinerarioModule() {
  const items = store.itinerary || [];
  const sorted = [...items].sort((a, b) => (a.timeStart || '').localeCompare(b.timeStart || ''));

  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Itinerario del Día</h2>
          <p class="text-slate-500 text-sm">Cronograma cronológico de actividades del evento.</p>
        </div>
        <button onclick="openItineraryModal()" class="inline-flex items-center gap-2 bg-wedding-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-wedding-700 transition-colors shadow-sm">
          <i data-lucide="plus-circle" class="w-4 h-4"></i>
          <span>+ Añadir Evento</span>
        </button>
      </div>

      <div class="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-sm">
        ${sorted.map(i => `
          <div class="flex items-start justify-between gap-4 p-3.5 bg-slate-50 rounded-2xl">
            <div class="flex items-start gap-4">
              <span class="bg-slate-900 text-white font-black text-xs px-2.5 py-1 rounded-lg">${i.timeStart}</span>
              <div>
                <h3 class="font-bold text-slate-900 text-sm">${i.title}</h3>
                <p class="text-xs text-slate-500">📍 ${i.location \vert{}\vert{} 'Sin ubicación'} • 👤 ${i.responsible || 'Sin encargado'}</p>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <button onclick="openItineraryModal('${i.id}')" class="p-1.5 text-slate-400 hover:text-wedding-600 rounded-lg">
                <i data-lucide="pencil" class="w-4 h-4"></i>
              </button>
              <button onclick="deleteItineraryItem('${i.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function openItineraryModal(itemId = null) {
  const item = itemId ? store.itinerary.find(i => i.id === itemId) : null;
  const isEdit = !!item;

  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  modalTitle.textContent = isEdit ? 'Editar Evento' : 'Añadir Evento al Itinerario';

  modalBody.innerHTML = `
    <form onsubmit="saveItineraryForm(event, '${itemId || ''}')" class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Título de la Actividad *</label>
        <input type="text" id="it-title" required value="${item ? item.title : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Hora Inicio *</label>
          <input type="time" id="it-timestart" required value="${item ? item.timeStart : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Ubicación</label>
          <input type="text" id="it-location" value="${item ? (item.location || '') : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Encargado / Responsable</label>
        <input type="text" id="it-responsible" value="${item ? (item.responsible || '') : ''}" placeholder="Ej: DJ / Coordinadora / Fotógrafo" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
      </div>
      <div class="pt-4 flex justify-end gap-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
        <button type="submit" class="px-5 py-2 text-xs font-semibold text-white bg-wedding-600 rounded-xl">Guardar Evento</button>
      </div>
    </form>
  `;
  openModal();
}

function saveItineraryForm(e, itemId) {
  e.preventDefault();
  const title = document.getElementById('it-title').value;
  const timeStart = document.getElementById('it-timestart').value;
  const location = document.getElementById('it-location').value;
  const responsible = document.getElementById('it-responsible').value;

  if (itemId) {
    const idx = store.itinerary.findIndex(i => i.id === itemId);
    if (idx !== -1) {
      store.itinerary[idx] = { ...store.itinerary[idx], title, timeStart, location, responsible };
    }
  } else {
    store.itinerary.push({
      id: "it-" + Date.now(),
      title, timeStart, location, responsible
    });
  }

  saveData();
  closeModal();
  showToast(itemId ? 'Evento actualizado' : 'Evento añadido al itinerario');
}

function deleteItineraryItem(id) {
  if (confirm('¿Deseas eliminar este evento del itinerario?')) {
    store.itinerary = store.itinerary.filter(i => i.id !== id);
    saveData();
    showToast('Evento eliminado');
  }
}

// ==========================================
// MÓDULO 9: DISTRIBUCIÓN DE MESAS (SEATING CHART)
// ==========================================
function renderMesasModule() {
  const tables = store.tables || [];
  const guests = store.guests || [];

  const confirmedGuests = guests.filter(g => g.status === 'Confirmado');
  const unassignedGuests = confirmedGuests.filter(g => {
    const assignedTable = tables.find(t => t.id === g.table || t.name === g.table);
    return !assignedTable;
  });

  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Distribución de Mesas (Seating Chart)</h2>
          <p class="text-slate-500 text-sm">Acomoda a tus invitados confirmados y gestiona el aforo del salón.</p>
        </div>
        <button onclick="openTableModal()" class="inline-flex items-center gap-2 bg-wedding-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-wedding-700 transition-colors shadow-sm">
          <i data-lucide="plus-circle" class="w-4 h-4"></i>
          <span>+ Crear Nueva Mesa</span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- PANEL SIN ASIGNAR -->
        <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-3 h-fit">
          <h3 class="font-bold text-slate-900 text-sm flex items-center justify-between">
            <span>Confirmados Sin Mesa</span>
            <span class="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">${unassignedGuests.length}</span>
          </h3>

          <div class="space-y-2 max-h-80 overflow-y-auto no-scrollbar">
            ${unassignedGuests.length === 0 ? `
              <p class="text-xs text-slate-400 italic text-center py-4">¡Todos los invitados tienen mesa!</p>
            ` : unassignedGuests.map(g => `
              <div class="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs flex items-center justify-between">
                <div>
                  <div class="font-bold text-slate-800">${g.name}</div>
                  <div class="text-[10px] text-slate-400">${g.group}</div>
                </div>
                <select onchange="quickAssignGuest('${g.id}', this.value)" class="text-[11px] p-1 bg-white border border-slate-200 rounded-lg">
                  <option value="">Asignar...</option>
                  ${tables.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                </select>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- REJILLA DE MESAS -->
        <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${tables.map(t => {
            const assigned = guests.filter(g => g.status === 'Confirmado' && (g.table === t.id || g.table === t.name));
            let occupied = 0;
            assigned.forEach(g => {
              occupied += 1;
              if (g.plusOneAllowed && g.plusOneName) occupied += 1;
            });

            return `
              <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">${t.shape || 'Redonda'}</span>
                    <div class="flex items-center gap-1">
                      <button onclick="openTableModal('${t.id}')" class="p-1 text-slate-400 hover:text-wedding-600 rounded-lg">
                        <i data-lucide="pencil" class="w-4 h-4"></i>
                      </button>
                      <button onclick="deleteTable('${t.id}')" class="p-1 text-slate-400 hover:text-rose-600 rounded-lg">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                      </button>
                    </div>
                  </div>
                  <h3 class="font-bold text-slate-900 text-base">${t.name}</h3>
                  <p class="text-xs text-emerald-600 font-semibold mt-1">Ocupación: ${occupied} /${t.capacity} asientos</p>

                  <div class="mt-3 space-y-1">
                    ${assigned.map(ag => `
                      <div class="flex items-center justify-between text-xs bg-slate-50 px-2 py-1 rounded-lg">
                        <span>${ag.name}</span>
                        <button onclick="removeGuestFromTable('${ag.id}')" class="text-slate-400 hover:text-rose-600">×</button>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div class="pt-3 border-t border-slate-100 mt-4">
                  <select onchange="assignGuestToTable(this.value, '${t.id}')" class="w-full text-xs p-2 bg-wedding-50 text-wedding-900 font-semibold border border-wedding-200 rounded-xl">
                    <option value="">+ Añadir invitado a esta mesa...</option>
                    ${unassignedGuests.map(ug => `<option value="${ug.id}">${ug.name}</option>`).join('')}
                  </select>
                </div>
              </div>
            `;
          }).join('')}
        </div>

      </div>
    </div>
  `;
}

function quickAssignGuest(guestId, tableId) {
  if (!guestId || !tableId) return;
  assignGuestToTable(guestId, tableId);
}

function assignGuestToTable(guestId, tableId) {
  const guest = store.guests.find(g => g.id === guestId);
  const table = store.tables.find(t => t.id === tableId);
  if (guest && table) {
    guest.table = table.id;
    saveData();
    showToast(`${guest.name} asignado a ${table.name}`);
  }
}

function removeGuestFromTable(guestId) {
  const guest = store.guests.find(g => g.id === guestId);
  if (guest) {
    guest.table = "Sin asignar";
    saveData();
    showToast(`${guest.name} desasignado`);
  }
}

function openTableModal(tableId = null) {
  const table = tableId ? store.tables.find(t => t.id === tableId) : null;
  const isEdit = !!table;

  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  modalTitle.textContent = isEdit ? 'Editar Mesa' : 'Crear Nueva Mesa';

  modalBody.innerHTML = `
    <form onsubmit="saveTableForm(event, '${tableId || ''}')" class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Nombre / Número de Mesa *</label>
        <input type="text" id="tbl-name" required value="${table ? table.name : ''}" placeholder="Ej: Mesa 1 - Familia Novia" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Capacidad Total *</label>
          <input type="number" id="tbl-capacity" min="1" required value="${table ? table.capacity : 8}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Forma Geométrica</label>
          <select id="tbl-shape" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
            <option value="Redonda" ${!table || table.shape === 'Redonda' ? 'selected' : ''}>Redonda</option>
            <option value="Rectangular" ${table && table.shape === 'Rectangular' ? 'selected' : ''}>Rectangular</option>
            <option value="Imperial" ${table && table.shape === 'Imperial' ? 'selected' : ''}>Imperial (Presidencial)</option>
          </select>
        </div>
      </div>
      <div class="pt-4 flex justify-end gap-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
        <button type="submit" class="px-5 py-2 text-xs font-semibold text-white bg-wedding-600 rounded-xl">Guardar Mesa</button>
      </div>
    </form>
  `;
  openModal();
}

function saveTableForm(e, tableId) {
  e.preventDefault();
  const name = document.getElementById('tbl-name').value;
  const capacity = parseInt(document.getElementById('tbl-capacity').value) || 8;
  const shape = document.getElementById('tbl-shape').value;

  if (tableId) {
    const idx = store.tables.findIndex(t => t.id === tableId);
    if (idx !== -1) {
      store.tables[idx] = { ...store.tables[idx], name, capacity, shape };
    }
  } else {
    store.tables.push({ id: "tbl-" + Date.now(), name, capacity, shape });
  }

  saveData();
  closeModal();
  showToast(tableId ? 'Mesa actualizada' : 'Mesa agregada');
}

function deleteTable(id) {
  if (confirm('¿Deseas eliminar esta mesa? Los invitados pasarán a sin asignar.')) {
    store.tables = store.tables.filter(t => t.id !== id);
    saveData();
    showToast('Mesa eliminada');
  }
}

// ==========================================
// MÓDULO 10: NOTAS E IDEAS
// ==========================================
function renderNotasModule() {
  const notes = store.notes || [];

  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Notas, Ideas & Recordatorios</h2>
          <p class="text-slate-500 text-sm">Bitácora de inspiración y apuntes rápidos.</p>
        </div>
        <button onclick="openNoteModal()" class="inline-flex items-center gap-2 bg-wedding-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-wedding-700 transition-colors shadow-sm">
          <i data-lucide="plus-circle" class="w-4 h-4"></i>
          <span>+ Crear Nueva Nota</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${notes.map(n => `
          <div class="bg-white p-5 rounded-3xl border ${n.pinned ? 'border-wedding-300 ring-2 ring-wedding-100' : 'border-slate-100'} shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">${n.category}</span>
                <button onclick="togglePinNote('${n.id}')" class="text-slate-300 hover:text-wedding-600">📌</button>
              </div>
              <h3 class="font-bold text-slate-900 text-base mb-1">${n.title}</h3>
              <p class="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-2xl">${n.content}</p>
            </div>

            <div class="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
              ${n.url ? `<a href="${n.url}" target="_blank" class="text-xs text-wedding-600 hover:underline">Abrir Enlace</a>` : '<span></span>'}
              <div class="flex items-center gap-1">
                <button onclick="openNoteModal('${n.id}')" class="p-1.5 text-slate-400 hover:text-wedding-600 rounded-lg">
                  <i data-lucide="pencil" class="w-4 h-4"></i>
                </button>
                <button onclick="deleteNote('${n.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function togglePinNote(id) {
  const note = store.notes.find(n => n.id === id);
  if (note) {
    note.pinned = !note.pinned;
    saveData();
  }
}

function openNoteModal(noteId = null) {
  const note = noteId ? store.notes.find(n => n.id === noteId) : null;
  const isEdit = !!note;

  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  modalTitle.textContent = isEdit ? 'Editar Nota' : 'Crear Nueva Nota';

  modalBody.innerHTML = `
    <form onsubmit="saveNoteForm(event, '${noteId || ''}')" class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Título de la Nota *</label>
        <input type="text" id="nt-title" required value="${note ? note.title : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
        <select id="nt-category" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
          ${NOTE_CATEGORIES.map(c => `<option value="${c}" ${note && note.category === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Contenido / Apuntes *</label>
        <textarea id="nt-content" required rows="3" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-wedding-500">${note ? note.content : ''}</textarea>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Enlace de Referencia (Pinterest/Instagram/Web)</label>
        <input type="url" id="nt-url" value="${note ? (note.url || '') : ''}" placeholder="https://..." class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
      </div>
      <div class="pt-4 flex justify-end gap-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
        <button type="submit" class="px-5 py-2 text-xs font-semibold text-white bg-wedding-600 rounded-xl">Guardar Nota</button>
      </div>
    </form>
  `;
  openModal();
}

function saveNoteForm(e, noteId) {
  e.preventDefault();
  const title = document.getElementById('nt-title').value;
  const category = document.getElementById('nt-category').value;
  const content = document.getElementById('nt-content').value;
  const url = document.getElementById('nt-url').value;

  if (noteId) {
    const idx = store.notes.findIndex(n => n.id === noteId);
    if (idx !== -1) {
      store.notes[idx] = { ...store.notes[idx], title, category, content, url };
    }
  } else {
    store.notes.push({
      id: "note-" + Date.now(),
      title, category, content, url, pinned: false
    });
  }

  saveData();
  closeModal();
  showToast(noteId ? 'Nota actualizada' : 'Nota creada');
}

function deleteNote(id) {
  if (confirm('¿Deseas eliminar esta nota?')) {
    store.notes = store.notes.filter(n => n.id !== id);
    saveData();
    showToast('Nota eliminada');
  }
}

// ==========================================
// MÓDULO 11: CONFIGURACIÓN Y COPIAS DE SEGURIDAD
// ==========================================
function renderConfiguracionModule() {
  const details = store.weddingDetails || INITIAL_STATE.weddingDetails;

  return `
    <div class="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Configuración & Copias de Seguridad</h2>
        <p class="text-slate-500 text-sm">Personaliza los datos principales de tu boda y gestiona respaldos JSON.</p>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 class="font-bold text-slate-900 text-base border-b border-slate-100 pb-2">Ajustes Generales de la Boda</h3>
        <form onsubmit="saveWeddingDetailsForm(event)" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Nombres de la Pareja *</label>
              <input type="text" id="cfg-couple" required value="${details.coupleNames || ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Fecha de la Boda *</label>
              <input type="date" id="cfg-date" required value="${details.date || ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Lugar Principal *</label>
              <input type="text" id="cfg-location" required value="${details.location || ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Presupuesto Objetivo *</label>
              <input type="number" id="cfg-budget" required value="${details.totalBudget || 0}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Símbolo de Moneda *</label>
              <select id="cfg-currency" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
                <option value="€" ${details.currencySymbol === '€' ? 'selected' : ''}>€ (Euros)</option>
                <option value="$" ${details.currencySymbol === '$' ? 'selected' : ''}>$ (Dólares)</option>
                <option value="S/" ${details.currencySymbol === 'S/' ? 'selected' : ''}>S/ (Soles)</option>
                <option value="MXN $" ${details.currencySymbol === 'MXN $' ? 'selected' : ''}>MXN $ (Pesos)</option>
              </select>
            </div>
          </div>
          <button type="submit" class="bg-wedding-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl">Guardar Ajustes</button>
        </form>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <h3 class="font-bold text-slate-900 text-sm">Respaldos JSON</h3>
          <button onclick="exportFullJSON()" class="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl">Descargar Respaldo JSON</button>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <h3 class="font-bold text-slate-900 text-sm">Restaurar Respaldo</h3>
          <input type="file" accept=".json" onchange="handleImportJSON(event)" class="text-xs">
        </div>
      </div>

      <div class="bg-rose-50 p-6 rounded-3xl border border-rose-100 shadow-sm flex items-center justify-between">
        <div>
          <h3 class="font-bold text-rose-900 text-sm">Reiniciar Aplicación</h3>
          <p class="text-xs text-rose-700">Restablece la app a los datos iniciales de demostración.</p>
        </div>
        <button onclick="resetAllData()" class="bg-rose-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl">Restablecer Todo</button>
      </div>
    </div>
  `;
}

function saveWeddingDetailsForm(e) {
  e.preventDefault();
  store.weddingDetails = {
    coupleNames: document.getElementById('cfg-couple').value,
    date: document.getElementById('cfg-date').value,
    location: document.getElementById('cfg-location').value,
    totalBudget: parseFloat(document.getElementById('cfg-budget').value) || 0,
    currencySymbol: document.getElementById('cfg-currency').value
  };
  saveData();
  showToast('Configuración guardada correctamente');
}

function exportFullJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `boda_backup_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('Respaldo JSON descargado');
}

function handleImportJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed && typeof parsed === 'object') {
        store = parsed;
        saveData();
        showToast('Respaldo restaurado con éxito');
      }
    } catch (err) {
      alert('Error al leer el archivo JSON.');
    }
  };
  reader.readAsText(file);
}

function resetAllData() {
  if (confirm('⚠️ ¿Estás seguro de reiniciar todos los datos?')) {
    if (confirm('🚨 Confirmación final: Se borrarán los datos guardados.')) {
      store = JSON.parse(JSON.stringify(INITIAL_STATE));
      saveData();
      showToast('App reiniciada');
    }
  }
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