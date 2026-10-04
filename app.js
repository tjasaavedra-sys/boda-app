// Archivo: app.js
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
    ceremony: { name: "Parroquia San Francisco", address: "Calle Mayor 12", notes: "" },
    banquet: { name: "Hacienda El Paraíso", address: "Carretera del Sol Km 15", notes: "" }
  },
  suppliers: [
    { id: "sup-1", name: "Catering Gourmet", category: "Catering", totalAmount: 6500, paidAmount: 2500 }
  ],
  guests: [
    { id: "guest-1", name: "María García", group: "Familia", status: "Confirmado", menu: "Adulto", allergies: "", plusOneAllowed: false, plusOneName: "", table: "Sin asignar" }
  ],
  tasks: [
    { id: "task-1", title: "Definir presupuesto inicial", phase: "10-12 meses antes", status: "completada" }
  ],
  expenses: [
    { id: "exp-1", concept: "Alquiler Finca", category: "Lugar", realCost: 8000 }
  ],
  itinerary: [
    { id: "it-1", timeStart: "17:00", title: "Ceremonia Nupcial" }
  ],
  tables: [
    { id: "tbl-1", name: "Mesa 1", capacity: 8, shape: "Redonda" }
  ],
  notes: [
    { id: "note-1", title: "Ideas de decoración", category: "Ideas & Inspiración", content: "Flores silvestres y tonos pasteles." }
  ]
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

function formatMoney(amount) {
  const symbol = (store.weddingDetails && store.weddingDetails.currencySymbol) ? store.weddingDetails.currencySymbol : '€';
  return `${Number(amount || 0).toLocaleString('es-ES')} ${symbol}`;
}

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
let guestSearchQuery = "";
let guestStatusFilter = "todos";

document.addEventListener('DOMContentLoaded', () => {
  renderNavigation();
  switchModule('invitados');
});

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
  setTimeout(() => { backdrop.classList.add('hidden'); }, 300);
}

function renderNavigation() {
  const desktopNav = document.getElementById('desktop-menu');
  const mobileDrawerNav = document.getElementById('mobile-drawer-menu');
  const mobileBottomNav = document.getElementById('mobile-menu');

  if (desktopNav) {
    desktopNav.innerHTML = MODULES.map(mod => `
      <button onclick="switchModule('${mod.id}')" class="flex items-center w-full px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all ${activeModule === mod.id ? 'bg-wedding-50 text-wedding-700 shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
        <i data-lucide="${mod.icon}" class="mr-3 h-5 w-5 ${activeModule === mod.id ? 'text-wedding-600' : 'text-slate-400'}"></i>${mod.name}
      </button>
    `).join('');
  }

  if (mobileDrawerNav) {
    mobileDrawerNav.innerHTML = MODULES.map(mod => `
      <button onclick="switchModule('${mod.id}')" class="flex items-center w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all ${activeModule === mod.id ? 'bg-wedding-50 text-wedding-700 font-bold border border-wedding-200' : 'text-slate-700 hover:bg-slate-100'}">
        <i data-lucide="${mod.icon}" class="mr-3.5 h-5 w-5 ${activeModule === mod.id ? 'text-wedding-600' : 'text-slate-400'}"></i>
        <span>${mod.name}</span>
      </button>
    `).join('');
  }

  if (mobileBottomNav) {
    const mainMobileIds = ['resumen', 'invitados', 'mesas', 'configuracion'];
    const mainMobileModules = MODULES.filter(m => mainMobileIds.includes(m.id));
    let html = mainMobileModules.map(mod => `
      <button onclick="switchModule('${mod.id}')" class="flex flex-col items-center py-1 px-2.5 rounded-xl ${activeModule === mod.id ? 'text-wedding-600 font-bold' : 'text-slate-500'}">
        <i data-lucide="${mod.icon}" class="w-5 h-5"></i>
        <span class="text-[10px] mt-1">${mod.id === 'invitados' ? 'Invitados' : mod.id === 'configuracion' ? 'Ajustes' : mod.name}</span>
      </button>
    `).join('');
    html += `
      <button onclick="toggleMobileDrawer()" class="flex flex-col items-center py-1 px-2.5 rounded-xl text-slate-500">
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

function renderModuleContent() {
  const container = document.getElementById('app-content');
  if (!container) return;
  switch (activeModule) {
    case 'resumen': container.innerHTML = renderResumenModule(); break;
    case 'invitados': container.innerHTML = renderInvitadosModule(); break;
    case 'espacios': container.innerHTML = renderEspaciosModule(); break;
    case 'proveedores': container.innerHTML = renderProveedoresModule(); break;
    case 'web-invitados': container.innerHTML = renderWebInvitadosModule(); break;
    case 'tareas': container.innerHTML = renderTareasModule(); break;
    case 'presupuesto': container.innerHTML = renderPresupuestoModule(); break;
    case 'itinerario': container.innerHTML = renderItinerarioModule(); break;
    case 'mesas': container.innerHTML = renderMesasModule(); break;
    case 'notas': container.innerHTML = renderNotasModule(); break;
    case 'configuracion': container.innerHTML = renderConfiguracionModule(); break;
    default: container.innerHTML = `<div class="p-8 text-center"><p>Módulo disponible.</p></div>`;
  }
  if (window.lucide) lucide.createIcons();
}

// ---------------- MÓDULOS ----------------
function renderResumenModule() {
  return `<div class="bg-white p-6 rounded-3xl shadow-sm"><h2 class="text-2xl font-bold">Resumen de la Boda</h2><p class="text-slate-500 mt-2">${store.weddingDetails.coupleNames} - ${store.weddingDetails.date}</p></div>`;
}

function renderInvitadosModule() {
  const guests = store.guests || [];
  return `
    <div class="space-y-4">
      <div class="flex justify-between items-center"><h2 class="text-2xl font-bold">Invitados (${guests.length})</h2>
      <button onclick="openAddGuestModal()" class="bg-wedding-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">+ Añadir</button></div>
      <div class="bg-white rounded-2xl p-4 shadow-sm divide-y">
        ${guests.map(g => `<div py-2 flex justify-between items-center><span><b>${g.name}</b> (${g.group})</span> <button onclick="deleteGuest('${g.id}')" class="text-rose-600 text-xs">Eliminar</button></div>`).join('')}
      </div>
    </div>
  `;
}
function openAddGuestModal() {
  store.guests.push({ id: "guest-" + Date.now(), name: "Nuevo Invitado", group: "Amigos", status: "Pendiente", menu: "Adulto" });
  saveData();
}
function deleteGuest(id) { store.guests = store.guests.filter(g => g.id !== id); saveData(); }

function renderEspaciosModule() { return `<div class="bg-white p-6 rounded-3xl shadow-sm"><h2 class="text-2xl font-bold">Espacios</h2><p class="mt-2">Ceremonia: ${store.spaces.ceremony.name}</p></div>`; }
function renderProveedoresModule() { return `<div class="bg-white p-6 rounded-3xl shadow-sm"><h2 class="text-2xl font-bold">Proveedores</h2></div>`; }
function renderWebInvitadosModule() { return `<div class="bg-white p-6 rounded-3xl shadow-sm"><h2 class="text-2xl font-bold">Sitio Web & RSVP</h2></div>`; }
function renderTareasModule() { return `<div class="bg-white p-6 rounded-3xl shadow-sm"><h2 class="text-2xl font-bold">Tareas</h2></div>`; }
function renderPresupuestoModule() { return `<div class="bg-white p-6 rounded-3xl shadow-sm"><h2 class="text-2xl font-bold">Presupuesto</h2></div>`; }
function renderItinerarioModule() { return `<div class="bg-white p-6 rounded-3xl shadow-sm"><h2 class="text-2xl font-bold">Itinerario</h2></div>`; }
function renderMesasModule() { return `<div class="bg-white p-6 rounded-3xl shadow-sm"><h2 class="text-2xl font-bold">Mesas</h2></div>`; }
function renderNotasModule() { return `<div class="bg-white p-6 rounded-3xl shadow-sm"><h2 class="text-2xl font-bold">Notas</h2></div>`; }
function renderConfiguracionModule() { return `<div class="bg-white p-6 rounded-3xl shadow-sm"><h2 class="text-2xl font-bold">Configuración</h2></div>`; }