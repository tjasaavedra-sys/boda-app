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
      notes: "Dress code: Etiqueta / Formal. Llevar 20 min antes."
    },
    banquet: {
      name: "Hacienda El Paraíso",
      address: "Carretera del Sol Km 15, Madrid, España",
      time: "19:00",
      capacity: 200,
      contactName: "Elena Rivas",
      contactPhone: "+34 600 333 444",
      mapUrl: "https://maps.google.com/?q=Hacienda+El+Paraiso+Madrid",
      notes: "Catering propio de la finca."
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
      notes: "Incluye cóctel de bienvenida, menú de 3 tiempos y recena."
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
      notes: "Cobertura completa de 10 horas y álbum."
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
      wishes: "¡Deseando bailar toda la noche!",
      table: "tbl-1",
      notes: ""
    },
    {
      id: "guest-2",
      name: "Roberto Gómez",
      email: "roberto.gomez@example.com",
      phone: "+34 622 987 654",
      group: "Amigos Novio",
      status: "Confirmado",
      menu: "Vegetariano",
      allergies: "Frutos secos",
      plusOneAllowed: false,
      plusOneName: "",
      plusOneMenu: "Adulto",
      wishes: "¡Felicidades pareja!",
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
      wishes: "Viaje de trabajo en esa fecha.",
      table: "Sin asignar",
      notes: ""
    },
    {
      id: "guest-4",
      name: "Andrés Fernández",
      email: "andres.f@example.com",
      phone: "+34 644 222 333",
      group: "Amigos Novia",
      status: "Pendiente",
      menu: "Adulto",
      allergies: "Celíaco",
      plusOneAllowed: true,
      plusOneName: "Sofia Ruiz",
      plusOneMenu: "Vegano",
      wishes: "¡A celebrar!",
      table: "Sin asignar",
      notes: ""
    }
  ],
  tasks: [
    {
      id: "task-1",
      title: "Definir presupuesto inicial y lista de invitados",
      phase: "10-12 meses antes",
      priority: "Alta",
      dueDate: "2026-11-01",
      status: "completada",
      notes: ""
    },
    {
      id: "task-2",
      title: "Reservar ceremonia",
      phase: "10-12 meses antes",
      priority: "Alta",
      dueDate: "2026-11-15",
      status: "completada",
      notes: ""
    }
  ],
  expenses: [
    {
      id: "exp-1",
      concept: "Alquiler Finca y Catering",
      category: "Lugar y Catering",
      estimatedCost: 7500,
      realCost: 8000,
      paidAmount: 3500,
      notes: ""
    }
  ],
  itinerary: [
    {
      id: "it-1",
      timeStart: "17:00",
      timeEnd: "18:00",
      title: "Ceremonia Nupcial",
      phase: "Ceremonia",
      location: "Parroquia San Francisco",
      responsible: "Padre Antonio",
      notes: ""
    }
  ],
  tables: [
    {
      id: "tbl-1",
      name: "Mesa 1 - Familia Novia",
      capacity: 8,
      shape: "Redonda",
      notes: ""
    }
  ],
  notes: [
    {
      id: "note-1",
      title: "Paleta de Colores",
      category: "Ideas & Inspiración",
      content: "Rosa empolvado, eucalipto y dorado.",
      url: "",
      pinned: true,
      date: "2026-09-20"
    }
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
    if (!parsed.guests) parsed.guests = INITIAL_STATE.guests;
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
  return store.weddingDetails?.currencySymbol || '€';
}

function formatMoney(amount) {
  return `${Number(amount || 0).toLocaleString('es-ES')} ${getCurrencySymbol()}`;
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
});

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW error:', err));
  }
}

function toggleMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (!drawer || !backdrop) return;
  const isOpen = !drawer.classList.contains('-translate-x-full');
  if (isOpen) closeMobileDrawer();
  else {
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
  setTimeout(() => backdrop.classList.add('hidden'), 300);
}

function renderNavigation() {
  const desktopNav = document.getElementById('desktop-menu');
  const mobileDrawerNav = document.getElementById('mobile-drawer-menu');
  const mobileBottomNav = document.getElementById('mobile-menu');

  if (desktopNav) {
    desktopNav.innerHTML = MODULES.map(mod => `
      <button onclick="switchModule('${mod.id}')" class="nav-item-transition group flex items-center w-full px-3.5 py-2.5 text-sm font-semibold rounded-xl ${
        activeModule === mod.id ? 'bg-wedding-50 text-wedding-700 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
      }">
        <i data-lucide="${mod.icon}" class="mr-3 h-5 w-5 ${activeModule === mod.id ? 'text-wedding-600' : 'text-slate-400'}"></i>
        ${mod.name}
      </button>
    `).join('');
  }

  if (mobileDrawerNav) {
    mobileDrawerNav.innerHTML = MODULES.map(mod => `
      <button onclick="switchModule('${mod.id}')" class="nav-item-transition flex items-center w-full px-4 py-3 text-sm font-semibold rounded-xl ${
        activeModule === mod.id ? 'bg-wedding-50 text-wedding-700 font-bold border border-wedding-200' : 'text-slate-700 hover:bg-slate-100'
      }">
        <i data-lucide="${mod.icon}" class="mr-3.5 h-5 w-5 ${activeModule === mod.id ? 'text-wedding-600' : 'text-slate-400'}"></i>
        <span>${mod.name}</span>
      </button>
    `).join('');
  }

  if (mobileBottomNav) {
    const mainMobileIds = ['resumen', 'invitados', 'mesas', 'configuracion'];
    let html = MODULES.filter(m => mainMobileIds.includes(m.id)).map(mod => `
      <button onclick="switchModule('${mod.id}')" class="flex flex-col items-center py-1 px-2.5 rounded-xl ${
        activeModule === mod.id ? 'text-wedding-600 font-bold' : 'text-slate-500'
      }">
        <i data-lucide="${mod.icon}" class="w-5 h-5"></i>
        <span class="text-[10px] mt-1">${mod.name}</span>
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
  }
  if (window.lucide) lucide.createIcons();
}

function renderResumenModule() {
  const today = new Date();
  const weddingDate = new Date(store.weddingDetails.date);
  const diffDays = Math.max(0, Math.ceil((weddingDate - today) / (1000 * 60 * 60 * 24)));
  const confirmed = store.guests.filter(g => g.status === 'Confirmado').length;

  return `
    <div class="space-y-6 animate-fade-in">
      <div class="bg-gradient-to-r from-wedding-800 via-wedding-700 to-wedding-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <h2 class="text-3xl font-extrabold">${store.weddingDetails.coupleNames}</h2>
        <p class="text-rose-100 text-sm mt-1">Lugar: ${store.weddingDetails.location}</p>
        <div class="mt-4 inline-block bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl">
          <span class="text-2xl font-black">${diffDays}</span> <span class="text-xs uppercase">Días Restantes</span>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p class="text-xs font-semibold text-slate-500">Invitados Confirmados</p>
          <h3 class="text-xl font-bold text-slate-900 mt-1">${confirmed} / ${store.guests.length}</h3>
        </div>
      </div>
    </div>
  `;
}

function renderInvitadosModule() {
  const guests = store.guests || [];
  let filtered = guests.filter(g => {
    const q = guestSearchQuery.toLowerCase();
    return (g.name.toLowerCase().includes(q) || g.group.toLowerCase().includes(q)) &&
           (guestStatusFilter === "todos" || g.status === guestStatusFilter);
  });

  const totalCompanions = guests.reduce((acc, g) => acc + (g.plusOneAllowed && g.plusOneName ? 1 : 0), 0);
  const totalAll = guests.length + totalCompanions;
  const confirmedCount = guests.filter(g => g.status === 'Confirmado').length;
  const pendingCount = guests.filter(g => g.status === 'Pendiente').length;
  const restrictionsCount = guests.filter(g => g.allergies && g.allergies.trim() !== '').length;

  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Lista de Invitados</h2>
          <p class="text-slate-500 text-sm">Gestiona RSVP, menús especiales, alergias y acompañantes (+1).</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="triggerCSVImport()" class="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl">Importar CSV</button>
          <button onclick="clearAllGuests()" class="bg-rose-50 text-rose-700 text-xs font-semibold px-3 py-2 rounded-xl">Vaciar Lista</button>
          <button onclick="openAddGuestModal()" class="bg-wedding-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl">+ Añadir Invitado</button>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-2xl border border-slate-100">
          <span class="text-xs text-slate-500 block">Total Invitados</span>
          <span class="text-2xl font-black">${totalAll}</span>
          <span class="text-[11px] text-slate-400 block">${guests.length} titulares + ${totalCompanions} (+1)</span>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-100">
          <span class="text-xs text-emerald-600 font-semibold block">Confirmados</span>
          <span class="text-2xl font-black text-emerald-700">${confirmedCount}</span>
          <span class="text-[11px] text-emerald-600 block">Asistencia asegurada</span>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-100">
          <span class="text-xs text-amber-600 font-semibold block">Pendientes</span>
          <span class="text-2xl font-black text-amber-700">${pendingCount}</span>
          <span class="text-[11px] text-amber-600 block">Por responder</span>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-100">
          <span class="text-xs text-rose-600 font-semibold block">Restricciones</span>
          <span class="text-2xl font-black text-rose-700">${restrictionsCount}</span>
          <span class="text-[11px] text-rose-600 block">Especiales / Alergias</span>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-3">
        <input type="text" value="${guestSearchQuery}" oninput="handleGuestSearch(this.value)" placeholder="Buscar por nombre, correo, teléfono o grupo..." class="flex-1 p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl">
        <select onchange="setGuestFilter(this.value)" class="p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-semibold">
          <option value="todos" ${guestStatusFilter === 'todos' ? 'selected' : ''}>Todos los estados</option>
          <option value="Confirmado" ${guestStatusFilter === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
          <option value="Pendiente" ${guestStatusFilter === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
          <option value="Rechazado" ${guestStatusFilter === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
        </select>
      </div>

      <div class="bg-white rounded-3xl border border-slate-100 overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600 min-w-[700px]">
          <thead class="bg-slate-50 text-slate-400 text-[11px] uppercase font-bold border-b border-slate-100">
            <tr>
              <th class="py-3 px-4">INVITADO / CONTACTO</th>
              <th class="py-3 px-4">GRUPO</th>
              <th class="py-3 px-4">ESTADO RSVP</th>
              <th class="py-3 px-4">MENÚ / RESTRICCIONES</th>
              <th class="py-3 px-4">ACOMPAÑANTE (+1)</th>
              <th class="py-3 px-4 text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${filtered.map(g => `
              <tr>
                <td class="py-3 px-4">
                  <div class="font-bold text-slate-900">${g.name}</div>
                  <div class="text-xs text-slate-400">${g.email || ''}${g.phone || ''}</div>
                </td>
                <td class="py-3 px-4"><span class="px-2.5 py-1 text-xs bg-slate-100 rounded-full font-semibold">${g.group}</span></td>
                <td class="py-3 px-4">
                  <select onchange="updateGuestStatus('${g.id}', this.value)" class="text-xs font-bold px-2.5 py-1 rounded-full border ${
                    g.status === 'Confirmado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    g.status === 'Pendiente' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  }">
                    <option value="Pendiente" ${g.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="Confirmado" ${g.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
                    <option value="Rechazado" ${g.status === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
                  </select>
                </td>
                <td class="py-3 px-4">
                  <div class="text-xs font-medium">🍽️ ${g.menu || 'Adulto'}</div>${g.allergies ? `<div class="text-[11px] text-rose-600 font-bold">⚠️ ${g.allergies}</div>` : ''}
                </td>
                <td class="py-3 px-4">${g.plusOneAllowed && g.plusOneName ? `👤 ${g.plusOneName}` : '<span class="text-xs text-slate-400 italic">Sin acompañante</span>'}</td>
                <td class="py-3 px-4 text-right">
                  <button onclick="openAddGuestModal('${g.id}')" class="p-1 text-slate-400 hover:text-wedding-600"><i data-lucide="pencil" class="w-4 h-4"></i></button>
                  <button onclick="deleteGuest('${g.id}')" class="p-1 text-slate-400 hover:text-rose-600"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
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
    const lines = evt.target.result.split('\n');
    let count = 0;
    lines.forEach((line, idx) => {
      if (idx === 0 || !line.trim()) return;
      const p = line.split(',').map(x => x.trim().replace(/^"|"$/g, ''));
      if (p[0]) {
        store.guests.push({
          id: 'guest-' + Date.now() + '-' + Math.random(),
          name: p[0], email: p[1] || '', phone: p[2] || '', group: p[3] || 'Familia Novia',
          status: p[4] || 'Pendiente', table: p[5] || 'Sin asignar', menu: p[6] || 'Adulto',
          allergies: p[7] || '', plusOneAllowed: false, plusOneName: '', plusOneMenu: 'Adulto', wishes: ''
        });
        count++;
      }
    });
    saveData();
    showToast(`Se importaron ${count} invitados desde CSV`);
    e.target.value = '';
  };
  reader.readAsText(file);
}

function clearAllGuests() {
  if (confirm('¿Vaciar toda la lista de invitados?')) {
    store.guests = [];
    saveData();
    showToast('Lista de invitados vaciada');
  }
}

function handleGuestSearch(v) { guestSearchQuery = v; renderModuleContent(); }
function setGuestFilter(v) { guestStatusFilter = v; renderModuleContent(); }

function updateGuestStatus(id, newStatus) {
  const g = store.guests.find(x => x.id === id);
  if (g) { g.status = newStatus; saveData(); showToast('Estado actualizado'); }
}

function openAddGuestModal(id = null) {
  const g = id ? store.guests.find(x => x.id === id) : null;
  document.getElementById('modal-title').textContent = g ? 'Editar Invitado' : 'Añadir Invitado';
  document.getElementById('modal-body').innerHTML = `
    <form onsubmit="saveGuestForm(event, '${id || ''}')" class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo *</label>
        <input type="text" id="g-name" required value="${g ? g.name : ''}" class="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Email</label>
          <input type="email" id="g-email" value="${g ? g.email : ''}" class="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
          <input type="tel" id="g-phone" value="${g ? g.phone : ''}" class="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Grupo</label>
          <select id="g-group" class="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
            <option value="Familia Novia" ${g && g.group === 'Familia Novia' ? 'selected' : ''}>Familia Novia</option>
            <option value="Familia Novio" ${g && g.group === 'Familia Novio' ? 'selected' : ''}>Familia Novio</option>
            <option value="Amigos Novia" ${g && g.group === 'Amigos Novia' ? 'selected' : ''}>Amigos Novia</option>
            <option value="Amigos Novio" ${g && g.group === 'Amigos Novio' ? 'selected' : ''}>Amigos Novio</option>
            <option value="Trabajo" ${g && g.group === 'Trabajo' ? 'selected' : ''}>Trabajo</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Estado RSVP</label>
          <select id="g-status" class="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
            <option value="Pendiente" ${g && g.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="Confirmado" ${g && g.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
            <option value="Rechazado" ${g && g.status === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Alergias / Restricciones</label>
        <input type="text" id="g-allergies" value="${g ? g.allergies : ''}" class="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs font-semibold bg-slate-100 rounded-xl">Cancelar</button>
        <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-wedding-600 rounded-xl">Guardar</button>
      </div>
    </form>
  `;
  openModal();
}

function saveGuestForm(e, id) {
  e.preventDefault();
  const name = document.getElementById('g-name').value;
  const email = document.getElementById('g-email').value;
  const phone = document.getElementById('g-phone').value;
  const group = document.getElementById('g-group').value;
  const status = document.getElementById('g-status').value;
  const allergies = document.getElementById('g-allergies').value;

  if (id) {
    const idx = store.guests.findIndex(x => x.id === id);
    if (idx !== -1) store.guests[idx] = { ...store.guests[idx], name, email, phone, group, status, allergies };
  } else {
    store.guests.push({
      id: "guest-" + Date.now(), name, email, phone, group, status, allergies,
      menu: "Adulto", table: "Sin asignar", plusOneAllowed: false, plusOneName: "", plusOneMenu: "Adulto", wishes: ""
    });
  }
  saveData();
  closeModal();
  showToast(id ? 'Invitado actualizado' : 'Invitado guardado');
}

function deleteGuest(id) {
  if (confirm('¿Eliminar invitado?')) {
    store.guests = store.guests.filter(x => x.id !== id);
    saveData();
    showToast('Invitado eliminado');
  }
}

function renderEspaciosModule() { return `<div class="p-4 bg-white rounded-2xl"><h2 class="text-xl font-bold">Espacios</h2><p class="text-sm text-slate-500 mt-2">Módulo Espacios listo.</p></div>`; }
function renderProveedoresModule() { return `<div class="p-4 bg-white rounded-2xl"><h2 class="text-xl font-bold">Proveedores</h2><p class="text-sm text-slate-500 mt-2">Módulo Proveedores listo.</p></div>`; }
function renderWebInvitadosModule() { return `<div class="p-4 bg-white rounded-2xl"><h2 class="text-xl font-bold">Sitio Web RSVP</h2><p class="text-sm text-slate-500 mt-2">Módulo RSVP listo.</p></div>`; }
function renderTareasModule() { return `<div class="p-4 bg-white rounded-2xl"><h2 class="text-xl font-bold">Checklist Tareas</h2><p class="text-sm text-slate-500 mt-2">Módulo Tareas listo.</p></div>`; }
function renderPresupuestoModule() { return `<div class="p-4 bg-white rounded-2xl"><h2 class="text-xl font-bold">Presupuesto</h2><p class="text-sm text-slate-500 mt-2">Módulo Presupuesto listo.</p></div>`; }
function renderItinerarioModule() { return `<div class="p-4 bg-white rounded-2xl"><h2 class="text-xl font-bold">Itinerario</h2><p class="text-sm text-slate-500 mt-2">Módulo Itinerario listo.</p></div>`; }
function renderMesasModule() { return `<div class="p-4 bg-white rounded-2xl"><h2 class="text-xl font-bold">Mesas</h2><p class="text-sm text-slate-500 mt-2">Módulo Mesas listo.</p></div>`; }
function renderNotasModule() { return `<div class="p-4 bg-white rounded-2xl"><h2 class="text-xl font-bold">Notas e Ideas</h2><p class="text-sm text-slate-500 mt-2">Módulo Notas listo.</p></div>`; }

function renderConfiguracionModule() {
  return `
    <div class="space-y-6 bg-white p-6 rounded-3xl border border-slate-100 max-w-xl mx-auto">
      <h2 class="text-2xl font-bold text-slate-900">Configuración</h2>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Nombres Pareja</label>
        <input type="text" id="cfg-names" value="${store.weddingDetails.coupleNames}" class="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">
      </div>
      <button onclick="saveConfig()" class="bg-wedding-600 text-white font-bold text-xs px-4 py-2 rounded-xl">Guardar Ajustes</button>
      <div class="pt-4 border-t border-slate-100 flex justify-between">
        <button onclick="exportJSON()" class="bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl">Exportar Respaldo</button>
        <button onclick="resetAllData()" class="bg-rose-600 text-white text-xs font-bold px-3 py-2 rounded-xl">Reiniciar App</button>
      </div>
    </div>
  `;
}

function saveConfig() {
  store.weddingDetails.coupleNames = document.getElementById('cfg-names').value;
  saveData();
  showToast('Configuración guardada');
}

function exportJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store, null, 2));
  const a = document.createElement('a');
  a.setAttribute("href", dataStr);
  a.setAttribute("download", `boda_backup.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function resetAllData() {
  if (confirm('¿Restablecer todos los datos?')) {
    store = JSON.parse(JSON.stringify(INITIAL_STATE));
    saveData();
    showToast('App reiniciada');
  }
}

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

function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = 'bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-fade-in';
  t.innerHTML = `<span>✓ ${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}