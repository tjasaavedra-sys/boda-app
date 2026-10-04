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
      wishes: "¡Qué emoción verlos dar este paso!",
      table: "tbl-1",
      notes: "Necesita transporte desde el hotel"
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
      notes: "Llegada del fotógrafo a las 10:30 para fotos."
    }
  ],
  tables: [
    {
      id: "tbl-0",
      name: "Mesa Nupcial (Presidencial)",
      capacity: 6,
      shape: "Imperial",
      notes: "Ubicada en el centro del salón frente a la pista de baile."
    }
  ],
  notes: [
    {
      id: "note-1",
      title: "Inspiración Paleta de Colores y Flores",
      category: "Ideas & Inspiración",
      content: "Gama de tonos: Rosa empolvado, eucalipto y detalles dorados.",
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
  registerServiceWorker();
  renderNavigation();
  switchModule('invitados');
  setupPWAInstaller();
});

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW error:', err));
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
      if (outcome === 'accepted') btn.classList.add('hidden');
      deferredPrompt = null;
    });
  }
}

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
      <button onclick="switchModule('${mod.id}')" class="nav-item-transition group flex items-center w-full px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all ${activeModule === mod.id ? 'bg-wedding-50 text-wedding-700 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}">
        <i data-lucide="${mod.icon}" class="mr-3 h-5 w-5 ${activeModule === mod.id ? 'text-wedding-600' : 'text-slate-400 group-hover:text-slate-600'}"></i>${mod.name}
      </button>
    `).join('');
  }

  if (mobileDrawerNav) {
    mobileDrawerNav.innerHTML = MODULES.map(mod => `
      <button onclick="switchModule('${mod.id}')" class="nav-item-transition flex items-center w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all min-h-[44px] ${activeModule === mod.id ? 'bg-wedding-50 text-wedding-700 font-bold border border-wedding-200' : 'text-slate-700 hover:bg-slate-100 active:bg-slate-200'}">
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
      <button onclick="switchModule('${mod.id}')" class="flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${activeModule === mod.id ? 'text-wedding-600 font-bold' : 'text-slate-500 hover:text-slate-800'}">
        <i data-lucide="${mod.icon}" class="w-5 h-5"></i>
        <span class="text-[10px] mt-1">${mod.id === 'invitados' ? 'Invitados' : mod.id === 'configuracion' ? 'Ajustes' : mod.name}</span>
      </button>
    `).join('');
    const isOtherActive = !mainMobileIds.includes(activeModule);
    html += `
      <button onclick="toggleMobileDrawer()" class="flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${isOtherActive ? 'text-wedding-600 font-bold' : 'text-slate-500 hover:text-slate-800'}">
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

// ----------------------------------------------------
// 1. RESUMEN
// ----------------------------------------------------
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
      <div class="bg-gradient-to-r from-wedding-800 via-wedding-700 to-wedding-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between gap-6">
        <div>
          <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <i data-lucide="heart" class="w-3.5 h-3.5 fill-current"></i><span>${store.weddingDetails.location}</span>
          </div>
          <h2 class="text-2xl sm:text-4xl font-extrabold">${store.weddingDetails.coupleNames}</h2>
          <p class="text-rose-100 text-sm mt-1">Fecha oficial: ${new Date(store.weddingDetails.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center min-w-[180px]">
          <span class="text-4xl font-black block">${daysLeft}</span>
          <span class="text-xs font-medium text-rose-100 uppercase tracking-wider">Días Restantes</span>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div class="p-3 bg-blue-50 text-blue-600 rounded-2xl"><i data-lucide="users" class="w-6 h-6"></i></div>
          <div class="flex-1">
            <p class="text-xs font-semibold text-slate-500">Invitados Confirmados</p>
            <h3 class="text-xl font-bold text-slate-900 mt-0.5">${confirmedGuests} / ${totalGuests}</h3>
          </div>
        </div>
        <div class="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div class="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><i data-lucide="check-circle-2" class="w-6 h-6"></i></div>
          <div class="flex-1">
            <p class="text-xs font-semibold text-slate-500">Progreso de Tareas</p>
            <h3 class="text-xl font-bold text-slate-900 mt-0.5">${taskPercentage}%</h3>
          </div>
        </div>
        <div class="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div class="p-3 bg-purple-50 text-purple-600 rounded-2xl"><i data-lucide="wallet" class="w-6 h-6"></i></div>
          <div class="flex-1">
            <p class="text-xs font-semibold text-slate-500">Gasto Real / Presupuesto</p>
            <h3 class="text-xl font-bold text-slate-900 mt-0.5">${formatMoney(realTotalSpent)} / ${formatMoney(budgetTotal)}</h3>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 2. INVITADOS
// ----------------------------------------------------
function renderInvitadosModule() {
  const guests = store.guests || [];
  let filteredGuests = guests.filter(g => {
    const query = guestSearchQuery.toLowerCase();
    const matchesSearch = g.name.toLowerCase().includes(query) || (g.email && g.email.toLowerCase().includes(query)) || (g.group && g.group.toLowerCase().includes(query));
    const matchesStatus = guestStatusFilter === "todos" || g.status === guestStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPrimary = guests.length;
  const totalCompanions = guests.reduce((acc, g) => acc + (g.plusOneAllowed && g.plusOneName ? 1 : 0), 0);
  const totalAllGuests = totalPrimary + totalCompanions;

  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Lista de Invitados</h2>
          <p class="text-slate-500 text-sm">Gestiona RSVP, menús especiales y acompañantes.</p>
        </div>
        <button onclick="openAddGuestModal()" class="inline-flex items-center gap-2 bg-wedding-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-wedding-700">
          <i data-lucide="user-plus" class="w-4 h-4"></i> Añadir Invitado
        </button>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <input type="text" value="${guestSearchQuery}" oninput="handleGuestSearch(this.value)" placeholder="Buscar por nombre..." class="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none">
        <select onchange="setGuestFilter(this.value)" class="py-2.5 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl">
          <option value="todos" ${guestStatusFilter === 'todos' ? 'selected' : ''}>Todos</option>
          <option value="Confirmado" ${guestStatusFilter === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
          <option value="Pendiente" ${guestStatusFilter === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
          <option value="Rechazado" ${guestStatusFilter === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
        </select>
      </div>

      <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-600 min-w-[800px]">
            <thead class="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th class="py-4 px-5">INVITADO</th>
                <th class="py-4 px-4">ESTADO</th>
                <th class="py-4 px-4">MENÚ</th>
                <th class="py-4 px-4">ACOMPAÑANTE</th>
                <th class="py-4 px-5 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${filteredGuests.map(g => `
                <tr class="hover:bg-slate-50">
                  <td class="py-4 px-5 font-bold text-slate-900">${g.name}<div class="text-xs font-normal text-slate-400">${g.group}</div></td>
                  <td class="py-4 px-4">
                    <select onchange="updateGuestStatus('${g.id}', this.value)" class="text-xs font-bold px-3 py-1 rounded-full border ${g.status === 'Confirmado' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}">
                      <option value="Pendiente" ${g.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                      <option value="Confirmado" ${g.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
                      <option value="Rechazado" ${g.status === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
                    </select>
                  </td>
                  <td class="py-4 px-4 text-xs">${g.menu}${g.allergies ? `<br><span class="text-rose-600 font-bold">${g.allergies}</span>` : ''}</td>
                  <td class="py-4 px-4 text-xs">${g.plusOneAllowed && g.plusOneName ? `👤 ${g.plusOneName}` : 'Sin acompañante'}</td>
                  <td class="py-4 px-5 text-right">
                    <button onclick="openAddGuestModal('${g.id}')" class="p-2 text-slate-400 hover:text-wedding-600"><i data-lucide="pencil" class="w-4 h-4"></i></button>
                    <button onclick="deleteGuest('${g.id}')" class="p-2 text-slate-400 hover:text-rose-600"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
function handleGuestSearch(val) { guestSearchQuery = val; renderModuleContent(); }
function setGuestFilter(val) { guestStatusFilter = val; renderModuleContent(); }
function updateGuestStatus(id, newStatus) { const guest = store.guests.find(g => g.id === id); if (guest) { guest.status = newStatus; saveData(); } }
function openAddGuestModal(guestId = null) {
  const guest = guestId ? store.guests.find(g => g.id === guestId) : null;
  document.getElementById('modal-title').textContent = guest ? 'Editar Invitado' : 'Añadir Invitado';
  document.getElementById('modal-body').innerHTML = `
    <form onsubmit="saveGuestForm(event, '${guestId || ''}')" class="space-y-4">
      <div><label class="block text-xs font-semibold mb-1">Nombre *</label><input type="text" id="g-name" required value="${guest ? guest.name : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"></div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="block text-xs font-semibold mb-1">Grupo</label><input type="text" id="g-group" value="${guest ? guest.group : 'Familia'}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"></div>
        <div><label class="block text-xs font-semibold mb-1">Estado</label>
          <select id="g-status" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
            <option value="Pendiente" ${guest && guest.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="Confirmado" ${guest && guest.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
            <option value="Rechazado" ${guest && guest.status === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
          </select>
        </div>
      </div>
      <div><label class="block text-xs font-semibold mb-1">Mesa Asignada</label>
        <select id="g-table" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
          <option value="Sin asignar">Sin asignar</option>
          ${(store.tables || []).map(t => `<option value="${t.id}" ${guest && (guest.table === t.id \vert{}\vert{} guest.table === t.name) ? 'selected' : ''}>${t.name}</option>`).join('')}
        </select>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="block text-xs font-semibold mb-1">Menú</label><input type="text" id="g-menu" value="${guest ? guest.menu : 'Adulto'}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"></div>
        <div><label class="block text-xs font-semibold mb-1">Alergias</label><input type="text" id="g-allergies" value="${guest ? (guest.allergies || '') : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"></div>
      </div>
      <div class="border-t border-slate-100 pt-3">
        <label class="flex items-center gap-2"><input type="checkbox" id="g-plusone" ${guest && guest.plusOneAllowed ? 'checked' : ''}> <span class="text-xs font-semibold">Permitir +1</span></label>
        <input type="text" id="g-plusonename" value="${guest ? (guest.plusOneName || '') : ''}" placeholder="Nombre del +1" class="mt-2 w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
      </div>
      <div class="pt-4 flex justify-end gap-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs font-semibold bg-slate-100 rounded-xl">Cancelar</button>
        <button type="submit" class="px-5 py-2 text-xs font-semibold text-white bg-wedding-600 rounded-xl">Guardar</button>
      </div>
    </form>
  `;
  openModal();
}
function saveGuestForm(e, guestId) {
  e.preventDefault();
  const data = {
    name: document.getElementById('g-name').value,
    group: document.getElementById('g-group').value,
    status: document.getElementById('g-status').value,
    table: document.getElementById('g-table').value,
    menu: document.getElementById('g-menu').value,
    allergies: document.getElementById('g-allergies').value,
    plusOneAllowed: document.getElementById('g-plusone').checked,
    plusOneName: document.getElementById('g-plusonename').value,
  };
  if (guestId) {
    const idx = store.guests.findIndex(g => g.id === guestId);
    if (idx !== -1) store.guests[idx] = { ...store.guests[idx], ...data };
  } else {
    store.guests.push({ id: "guest-" + Date.now(), ...data });
  }
  saveData();
  closeModal();
  showToast('Invitado guardado');
}
function deleteGuest(id) { if (confirm('¿Eliminar invitado?')) { store.guests = store.guests.filter(g => g.id !== id); saveData(); showToast('Eliminado'); } }

// ----------------------------------------------------
// 3. ESPACIOS
// ----------------------------------------------------
function renderEspaciosModule() {
  const ceremony = store.spaces?.ceremony || {};
  const banquet = store.spaces?.banquet || {};
  return `
    <div class="space-y-6 animate-fade-in">
      <h2 class="text-2xl font-bold text-slate-900">Espacios de la Boda</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex justify-between">
              <h3 class="font-bold text-lg text-slate-900">💒 Ceremonia</h3>
              <button onclick="openSpaceModal('ceremony')" class="p-2 text-slate-400 hover:text-wedding-600"><i data-lucide="edit" class="w-5 h-5"></i></button>
            </div>
            <p class="text-sm font-semibold mt-2">${ceremony.name || 'Sin definir'}</p>
            <p class="text-xs text-slate-500 mt-1">${ceremony.address || ''}</p>
            <p class="text-xs text-slate-400 mt-1 italic">${ceremony.notes || ''}</p>
          </div>
        </div>
        <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex justify-between">
              <h3 class="font-bold text-lg text-slate-900">🍾 Banquete</h3>
              <button onclick="openSpaceModal('banquet')" class="p-2 text-slate-400 hover:text-wedding-600"><i data-lucide="edit" class="w-5 h-5"></i></button>
            </div>
            <p class="text-sm font-semibold mt-2">${banquet.name || 'Sin definir'}</p>
            <p class="text-xs text-slate-500 mt-1">${banquet.address || ''}</p>
            <p class="text-xs text-slate-400 mt-1 italic">${banquet.notes || ''}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}
function openSpaceModal(type) {
  const space = store.spaces[type] || {};
  document.getElementById('modal-title').textContent = type === 'ceremony' ? 'Editar Ceremonia' : 'Editar Banquete';
  document.getElementById('modal-body').innerHTML = `
    <form onsubmit="saveSpaceForm(event, '${type}')" class="space-y-4">
      <div><label class="block text-xs font-semibold mb-1">Nombre</label><input type="text" id="sp-name" value="${space.name || ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
      <div><label class="block text-xs font-semibold mb-1">Dirección</label><input type="text" id="sp-address" value="${space.address || ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
      <div><label class="block text-xs font-semibold mb-1">Notas</label><textarea id="sp-notes" rows="3" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl">${space.notes || ''}</textarea></div>
      <div class="pt-4 flex justify-end gap-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs bg-slate-100 rounded-xl">Cancelar</button>
        <button type="submit" class="px-5 py-2 text-xs text-white bg-wedding-600 rounded-xl">Guardar</button>
      </div>
    </form>
  `;
  openModal();
}
function saveSpaceForm(e, type) {
  e.preventDefault();
  store.spaces[type] = {
    ...store.spaces[type],
    name: document.getElementById('sp-name').value,
    address: document.getElementById('sp-address').value,
    notes: document.getElementById('sp-notes').value
  };
  saveData(); closeModal(); showToast('Espacio guardado');
}

// ----------------------------------------------------
// 4. PROVEEDORES
// ----------------------------------------------------
function renderProveedoresModule() {
  const suppliers = store.suppliers || [];
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-slate-900">Proveedores</h2>
        <button onclick="openSupplierModal()" class="bg-wedding-600 text-white font-semibold text-sm px-4 py-2 rounded-xl">+ Añadir</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${suppliers.map(s => `
          <div class="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm relative">
            <span class="text-[10px] font-bold text-wedding-700 bg-wedding-50 px-2 py-0.5 rounded-full">${s.category}</span>
            <h3 class="font-bold text-slate-900 text-base mt-2">${s.name}</h3>
            <p class="text-xs text-slate-500 mt-1">Total: ${formatMoney(s.totalAmount)} \vert{} Pagado:${formatMoney(s.paidAmount)}</p>
            <div class="absolute top-4 right-4 flex gap-1">
              <button onclick="openSupplierModal('${s.id}')" class="text-slate-400 hover:text-wedding-600"><i data-lucide="edit" class="w-4 h-4"></i></button>
              <button onclick="deleteSupplier('${s.id}')" class="text-slate-400 hover:text-rose-600"><i data-lucide="trash" class="w-4 h-4"></i></button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
function openSupplierModal(id = null) {
  const s = id ? store.suppliers.find(x => x.id === id) : null;
  document.getElementById('modal-title').textContent = s ? 'Editar Proveedor' : 'Añadir Proveedor';
  document.getElementById('modal-body').innerHTML = `
    <form onsubmit="saveSupplierForm(event, '${id || ''}')" class="space-y-4">
      <div><label class="block text-xs font-semibold mb-1">Nombre</label><input type="text" id="sup-name" required value="${s ? s.name : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
      <div><label class="block text-xs font-semibold mb-1">Categoría</label><input type="text" id="sup-category" value="${s ? s.category : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="block text-xs font-semibold mb-1">Costo Total</label><input type="number" id="sup-total" value="${s ? s.totalAmount : 0}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
        <div><label class="block text-xs font-semibold mb-1">Monto Pagado</label><input type="number" id="sup-paid" value="${s ? s.paidAmount : 0}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
      </div>
      <div class="pt-4 flex justify-end gap-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs bg-slate-100 rounded-xl">Cancelar</button>
        <button type="submit" class="px-5 py-2 text-xs text-white bg-wedding-600 rounded-xl">Guardar</button>
      </div>
    </form>
  `;
  openModal();
}
function saveSupplierForm(e, id) {
  e.preventDefault();
  const data = {
    name: document.getElementById('sup-name').value, category: document.getElementById('sup-category').value,
    totalAmount: parseFloat(document.getElementById('sup-total').value)||0, paidAmount: parseFloat(document.getElementById('sup-paid').value)||0
  };
  if (id) { const idx = store.suppliers.findIndex(x => x.id === id); if (idx !== -1) store.suppliers[idx] = { ...store.suppliers[idx], ...data }; }
  else { store.suppliers.push({ id: "sup-" + Date.now(), ...data }); }
  saveData(); closeModal(); showToast('Proveedor guardado');
}
function deleteSupplier(id) { if (confirm('¿Eliminar proveedor?')) { store.suppliers = store.suppliers.filter(x => x.id !== id); saveData(); showToast('Eliminado'); } }

// ----------------------------------------------------
// 5. WEB INVITADOS
// ----------------------------------------------------
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
function copyPublicLink() { navigator.clipboard.writeText(window.location.href); showToast('Enlace copiado al portapapeles'); }

// ----------------------------------------------------
// 6. TAREAS
// ----------------------------------------------------
function renderTareasModule() {
  const tasks = store.tasks || [];
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-slate-900">Lista de Tareas</h2>
        <button onclick="openTaskModal()" class="bg-wedding-600 text-white font-semibold text-sm px-4 py-2 rounded-xl">+ Añadir</button>
      </div>
      <div class="bg-white rounded-3xl border border-slate-100 p-4 divide-y divide-slate-100">
        ${tasks.map(t => `
          <div class="py-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <input type="checkbox" ${t.status === 'completada' ? 'checked' : ''} onchange="toggleTaskStatus('${t.id}')" class="w-4 h-4 text-wedding-600 rounded">
              <span class="${t.status === 'completada' ? 'line-through text-slate-400' : 'text-slate-800'} font-semibold text-sm">${t.title}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] px-2 py-1 bg-slate-100 rounded-lg text-slate-600">${t.phase}</span>
              <button onclick="openTaskModal('${t.id}')" class="text-slate-400 hover:text-wedding-600"><i data-lucide="edit" class="w-4 h-4"></i></button>
              <button onclick="deleteTask('${t.id}')" class="text-slate-400 hover:text-rose-600"><i data-lucide="trash" class="w-4 h-4"></i></button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
function toggleTaskStatus(id) { const task = store.tasks.find(t => t.id === id); if (task) { task.status = task.status === 'completada' ? 'pendiente' : 'completada'; saveData(); } }
function openTaskModal(id = null) {
  const t = id ? store.tasks.find(x => x.id === id) : null;
  document.getElementById('modal-title').textContent = t ? 'Editar Tarea' : 'Añadir Tarea';
  document.getElementById('modal-body').innerHTML = `
    <form onsubmit="saveTaskForm(event, '${id || ''}')" class="space-y-4">
      <div><label class="block text-xs font-semibold mb-1">Título</label><input type="text" id="tk-title" required value="${t ? t.title : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
      <div><label class="block text-xs font-semibold mb-1">Fase / Momento</label><input type="text" id="tk-phase" value="${t ? t.phase : 'General'}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
      <div class="pt-4 flex justify-end gap-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs bg-slate-100 rounded-xl">Cancelar</button>
        <button type="submit" class="px-5 py-2 text-xs text-white bg-wedding-600 rounded-xl">Guardar</button>
      </div>
    </form>
  `;
  openModal();
}
function saveTaskForm(e, id) {
  e.preventDefault();
  const data = { title: document.getElementById('tk-title').value, phase: document.getElementById('tk-phase').value };
  if (id) { const idx = store.tasks.findIndex(x => x.id === id); if (idx !== -1) store.tasks[idx] = { ...store.tasks[idx], ...data }; }
  else { store.tasks.push({ id: "task-" + Date.now(), status: "pendiente", ...data }); }
  saveData(); closeModal(); showToast('Tarea guardada');
}
function deleteTask(id) { if (confirm('¿Eliminar tarea?')) { store.tasks = store.tasks.filter(x => x.id !== id); saveData(); showToast('Eliminada'); } }

// ----------------------------------------------------
// 7. PRESUPUESTO
// ----------------------------------------------------
function renderPresupuestoModule() {
  const expenses = store.expenses || [];
  const totalReal = expenses.reduce((acc, e) => acc + (e.realCost || 0), 0);
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-slate-900">Presupuesto</h2>
        <button onclick="openExpenseModal()" class="bg-wedding-600 text-white font-semibold text-sm px-4 py-2 rounded-xl">+ Gasto</button>
      </div>
      <p class="text-sm text-slate-500 font-bold bg-slate-100 p-3 rounded-xl inline-block">Gasto Total Acumulado: ${formatMoney(totalReal)}</p>
      <div class="bg-white rounded-3xl border border-slate-100 p-4 divide-y divide-slate-100">
        ${expenses.map(e => `
          <div class="py-3 flex items-center justify-between">
            <div><div class="font-bold text-slate-800 text-sm">${e.concept}</div><div class="text-xs text-slate-400">${e.category}</div></div>
            <div class="flex items-center gap-4">
              <div class="font-bold text-slate-900 text-sm">${formatMoney(e.realCost)}</div>
              <div class="flex gap-1">
                <button onclick="openExpenseModal('${e.id}')" class="text-slate-400 hover:text-wedding-600"><i data-lucide="edit" class="w-4 h-4"></i></button>
                <button onclick="deleteExpense('${e.id}')" class="text-slate-400 hover:text-rose-600"><i data-lucide="trash" class="w-4 h-4"></i></button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
function openExpenseModal(id = null) {
  const e = id ? store.expenses.find(x => x.id === id) : null;
  document.getElementById('modal-title').textContent = e ? 'Editar Gasto' : 'Añadir Gasto';
  document.getElementById('modal-body').innerHTML = `
    <form onsubmit="saveExpenseForm(event, '${id || ''}')" class="space-y-4">
      <div><label class="block text-xs font-semibold mb-1">Concepto</label><input type="text" id="ex-concept" required value="${e ? e.concept : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
      <div><label class="block text-xs font-semibold mb-1">Categoría</label><input type="text" id="ex-category" value="${e ? e.category : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
      <div><label class="block text-xs font-semibold mb-1">Costo Real</label><input type="number" id="ex-real" value="${e ? e.realCost : 0}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
      <div class="pt-4 flex justify-end gap-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs bg-slate-100 rounded-xl">Cancelar</button>
        <button type="submit" class="px-5 py-2 text-xs text-white bg-wedding-600 rounded-xl">Guardar</button>
      </div>
    </form>
  `;
  openModal();
}
function saveExpenseForm(e, id) {
  e.preventDefault();
  const data = { concept: document.getElementById('ex-concept').value, category: document.getElementById('ex-category').value, realCost: parseFloat(document.getElementById('ex-real').value)||0 };
  if (id) { const idx = store.expenses.findIndex(x => x.id === id); if (idx !== -1) store.expenses[idx] = { ...store.expenses[idx], ...data }; }
  else { store.expenses.push({ id: "exp-" + Date.now(), ...data }); }
  saveData(); closeModal(); showToast('Gasto guardado');
}
function deleteExpense(id) { if (confirm('¿Eliminar gasto?')) { store.expenses = store.expenses.filter(x => x.id !== id); saveData(); showToast('Eliminado'); } }

// ----------------------------------------------------
// 8. ITINERARIO
// ----------------------------------------------------
function renderItinerarioModule() {
  const items = store.itinerary || [];
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-slate-900">Itinerario del Día</h2>
        <button onclick="openItineraryModal()" class="bg-wedding-600 text-white font-semibold text-sm px-4 py-2 rounded-xl">+ Evento</button>
      </div>
      <div class="bg-white rounded-3xl border border-slate-100 p-6 space-y-3">
        ${items.map(i => `
          <div class="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
            <div class="flex items-center gap-4">
              <span class="bg-slate-900 text-white font-black text-xs px-2.5 py-1 rounded-lg">${i.timeStart}</span>
              <div class="font-bold text-slate-900 text-sm">${i.title}</div>
            </div>
            <div class="flex gap-1">
              <button onclick="openItineraryModal('${i.id}')" class="text-slate-400 hover:text-wedding-600"><i data-lucide="edit" class="w-4 h-4"></i></button>
              <button onclick="deleteItinerary('${i.id}')" class="text-slate-400 hover:text-rose-600"><i data-lucide="trash" class="w-4 h-4"></i></button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
function openItineraryModal(id = null) {
  const i = id ? store.itinerary.find(x => x.id === id) : null;
  document.getElementById('modal-title').textContent = i ? 'Editar Evento' : 'Añadir Evento';
  document.getElementById('modal-body').innerHTML = `
    <form onsubmit="saveItineraryForm(event, '${id || ''}')" class="space-y-4">
      <div><label class="block text-xs font-semibold mb-1">Hora Inicio</label><input type="time" id="it-time" required value="${i ? i.timeStart : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
      <div><label class="block text-xs font-semibold mb-1">Título</label><input type="text" id="it-title" required value="${i ? i.title : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
      <div class="pt-4 flex justify-end gap-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs bg-slate-100 rounded-xl">Cancelar</button>
        <button type="submit" class="px-5 py-2 text-xs text-white bg-wedding-600 rounded-xl">Guardar</button>
      </div>
    </form>
  `;
  openModal();
}
function saveItineraryForm(e, id) {
  e.preventDefault();
  const data = { timeStart: document.getElementById('it-time').value, title: document.getElementById('it-title').value };
  if (id) { const idx = store.itinerary.findIndex(x => x.id === id); if (idx !== -1) store.itinerary[idx] = { ...store.itinerary[idx], ...data }; }
  else { store.itinerary.push({ id: "it-" + Date.now(), ...data }); }
  saveData(); closeModal(); showToast('Evento guardado');
}
function deleteItinerary(id) { if (confirm('¿Eliminar evento?')) { store.itinerary = store.itinerary.filter(x => x.id !== id); saveData(); showToast('Eliminado'); } }

// ----------------------------------------------------
// 9. MESAS
// ----------------------------------------------------
function renderMesasModule() {
  const tables = store.tables || [];
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-slate-900">Distribución de Mesas</h2>
        <button onclick="openTableModal()" class="bg-wedding-600 text-white font-semibold text-sm px-4 py-2 rounded-xl">+ Mesa</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${tables.map(t => `
          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative">
            <h3 class="font-bold text-slate-900 text-base">${t.name}</h3>
            <p class="text-xs text-slate-500 mt-1">Capacidad: ${t.capacity} personas (${t.shape})</p>
            <div class="absolute top-4 right-4 flex gap-1">
              <button onclick="openTableModal('${t.id}')" class="text-slate-400 hover:text-wedding-600"><i data-lucide="edit" class="w-4 h-4"></i></button>
              <button onclick="deleteTable('${t.id}')" class="text-slate-400 hover:text-rose-600"><i data-lucide="trash" class="w-4 h-4"></i></button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
function openTableModal(id = null) {
  const t = id ? store.tables.find(x => x.id === id) : null;
  document.getElementById('modal-title').textContent = t ? 'Editar Mesa' : 'Añadir Mesa';
  document.getElementById('modal-body').innerHTML = `
    <form onsubmit="saveTableForm(event, '${id || ''}')" class="space-y-4">
      <div><label class="block text-xs font-semibold mb-1">Nombre / Número de Mesa</label><input type="text" id="tbl-name" required value="${t ? t.name : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="block text-xs font-semibold mb-1">Capacidad</label><input type="number" id="tbl-capacity" value="${t ? t.capacity : 8}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
        <div><label class="block text-xs font-semibold mb-1">Forma</label><input type="text" id="tbl-shape" value="${t ? t.shape : 'Redonda'}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
      </div>
      <div class="pt-4 flex justify-end gap-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs bg-slate-100 rounded-xl">Cancelar</button>
        <button type="submit" class="px-5 py-2 text-xs text-white bg-wedding-600 rounded-xl">Guardar</button>
      </div>
    </form>
  `;
  openModal();
}
function saveTableForm(e, id) {
  e.preventDefault();
  const data = { name: document.getElementById('tbl-name').value, capacity: parseInt(document.getElementById('tbl-capacity').value)||8, shape: document.getElementById('tbl-shape').value };
  if (id) { const idx = store.tables.findIndex(x => x.id === id); if (idx !== -1) store.tables[idx] = { ...store.tables[idx], ...data }; }
  else { store.tables.push({ id: "tbl-" + Date.now(), ...data }); }
  saveData(); closeModal(); showToast('Mesa guardada');
}
function deleteTable(id) { if (confirm('¿Eliminar mesa?')) { store.tables = store.tables.filter(x => x.id !== id); saveData(); showToast('Eliminada'); } }

// ----------------------------------------------------
// 10. NOTAS
// ----------------------------------------------------
function renderNotasModule() {
  const notes = store.notes || [];
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-slate-900">Notas, Ideas & Recordatorios</h2>
        <button onclick="openNoteModal()" class="bg-wedding-600 text-white font-semibold text-sm px-4 py-2 rounded-xl">+ Nota</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${notes.map(n => `
          <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative">
            <span class="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">${n.category}</span>
            <h3 class="font-bold text-slate-900 text-base mt-2">${n.title}</h3>
            <p class="text-xs text-slate-600 mt-1 whitespace-pre-line">${n.content}</p>
            <div class="absolute top-4 right-4 flex gap-1">
              <button onclick="openNoteModal('${n.id}')" class="text-slate-400 hover:text-wedding-600"><i data-lucide="edit" class="w-4 h-4"></i></button>
              <button onclick="deleteNote('${n.id}')" class="text-slate-400 hover:text-rose-600"><i data-lucide="trash" class="w-4 h-4"></i></button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
function openNoteModal(id = null) {
  const n = id ? store.notes.find(x => x.id === id) : null;
  document.getElementById('modal-title').textContent = n ? 'Editar Nota' : 'Añadir Nota';
  document.getElementById('modal-body').innerHTML = `
    <form onsubmit="saveNoteForm(event, '${id || ''}')" class="space-y-4">
      <div><label class="block text-xs font-semibold mb-1">Título</label><input type="text" id="nt-title" required value="${n ? n.title : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
      <div><label class="block text-xs font-semibold mb-1">Categoría</label><input type="text" id="nt-category" value="${n ? n.category : ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
      <div><label class="block text-xs font-semibold mb-1">Contenido</label><textarea id="nt-content" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl">${n ? n.content : ''}</textarea></div>
      <div class="pt-4 flex justify-end gap-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs bg-slate-100 rounded-xl">Cancelar</button>
        <button type="submit" class="px-5 py-2 text-xs text-white bg-wedding-600 rounded-xl">Guardar</button>
      </div>
    </form>
  `;
  openModal();
}
function saveNoteForm(e, id) {
  e.preventDefault();
  const data = { title: document.getElementById('nt-title').value, category: document.getElementById('nt-category').value, content: document.getElementById('nt-content').value };
  if (id) { const idx = store.notes.findIndex(x => x.id === id); if (idx !== -1) store.notes[idx] = { ...store.notes[idx], ...data }; }
  else { store.notes.push({ id: "nt-" + Date.now(), ...data }); }
  saveData(); closeModal(); showToast('Nota guardada');
}
function deleteNote(id) { if (confirm('¿Eliminar nota?')) { store.notes = store.notes.filter(x => x.id !== id); saveData(); showToast('Eliminada'); } }

// ----------------------------------------------------
// 11. CONFIGURACIÓN Y COPIAS
// ----------------------------------------------------
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
            <div><label class="block text-xs font-semibold text-slate-700 mb-1">Nombres de la Pareja *</label><input type="text" id="cfg-couple" required value="${details.coupleNames || ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
            <div><label class="block text-xs font-semibold text-slate-700 mb-1">Fecha de la Boda *</label><input type="date" id="cfg-date" required value="${details.date || ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label class="block text-xs font-semibold text-slate-700 mb-1">Lugar Principal *</label><input type="text" id="cfg-location" required value="${details.location || ''}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
            <div><label class="block text-xs font-semibold text-slate-700 mb-1">Presupuesto *</label><input type="number" id="cfg-budget" required value="${details.totalBudget || 0}" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"></div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Moneda *</label>
              <select id="cfg-currency" class="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl">
                <option value="€" ${details.currencySymbol === '€' ? 'selected' : ''}>€ (Euros)</option>
                <option value="$" ${details.currencySymbol === '$' ? 'selected' : ''}>$ (Dólares/Pesos)</option>
                <option value="S/" ${details.currencySymbol === 'S/' ? 'selected' : ''}>S/ (Soles)</option>
              </select>
            </div>
          </div>
          <button type="submit" class="bg-wedding-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm">Guardar Ajustes</button>
        </form>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-6 rounded-3xl border shadow-sm space-y-3">
          <h3 class="font-bold text-slate-900 text-sm">Respaldos JSON</h3>
          <button onclick="exportFullJSON()" class="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm">Descargar Respaldo JSON</button>
        </div>
        <div class="bg-white p-6 rounded-3xl border shadow-sm space-y-3">
          <h3 class="font-bold text-slate-900 text-sm">Restaurar Respaldo</h3>
          <input type="file" accept=".json" onchange="handleImportJSON(event)" class="text-xs">
        </div>
      </div>
      <div class="bg-rose-50 p-6 rounded-3xl border border-rose-100 shadow-sm flex items-center justify-between">
        <div><h3 class="font-bold text-rose-900 text-sm">Reiniciar Aplicación</h3></div>
        <button onclick="resetAllData()" class="bg-rose-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm">Restablecer Todo</button>
      </div>
    </div>
  `;
}
function saveWeddingDetailsForm(e) { e.preventDefault(); store.weddingDetails = { coupleNames: document.getElementById('cfg-couple').value, date: document.getElementById('cfg-date').value, location: document.getElementById('cfg-location').value, totalBudget: parseFloat(document.getElementById('cfg-budget').value) || 0, currencySymbol: document.getElementById('cfg-currency').value }; saveData(); showToast('Configuración guardada'); }
function exportFullJSON() { const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store, null, 2)); const downloadAnchor = document.createElement('a'); downloadAnchor.setAttribute("href", dataStr); downloadAnchor.setAttribute("download", `boda_backup_${new Date().toISOString().slice(0,10)}.json`); document.body.appendChild(downloadAnchor); downloadAnchor.click(); downloadAnchor.remove(); showToast('Respaldo descargado'); }
function handleImportJSON(event) { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = function(e) { try { const parsed = JSON.parse(e.target.result); if (parsed && typeof parsed === 'object') { store = parsed; saveData(); showToast('Respaldo restaurado'); } } catch (err) { alert('Error al leer el archivo JSON.'); } }; reader.readAsText(file); }
function resetAllData() { if (confirm('¿Restablecer todos los datos?')) { store = JSON.parse(JSON.stringify(INITIAL_STATE)); saveData(); showToast('App reiniciada'); } }

// ----------------------------------------------------
// AUXILIARES
// ----------------------------------------------------
function openModal() { document.getElementById('modal-backdrop').classList.remove('hidden'); document.getElementById('modal-container').classList.remove('hidden'); document.getElementById('modal-container').classList.add('flex'); }
function closeModal() { document.getElementById('modal-backdrop').classList.add('hidden'); document.getElementById('modal-container').classList.add('hidden'); document.getElementById('modal-container').classList.remove('flex'); }
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-fade-in pointer-events-auto';
  toast.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i><span>${message}</span>`;
  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();
  setTimeout(() => { toast.remove(); }, 3000);
}