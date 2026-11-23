/**
 * ============================================================================
 * PETCARE PRO - LÓGICA CLIENTE (JAVASCRIPT ES6)
 * Archivo: main.js
 * Cumplimiento Etapa 3 (DGETI):
 *  1. Vinculado en todas las vistas HTML (<script src="main.js"></script>).
 *  2. Menú hamburguesa interactivo para versión móvil mediante evento 'click'.
 *  3. Validación JS completa del formulario de contacto antes de envío
 *     (email, teléfono a 10 dígitos, campos obligatorios y aviso de privacidad)
 *     con alertas y mensajes visuales en tiempo real y al enviar.
 *  4. Gestión de roles (Cliente / Administrador con PIN 2026), carrito de compras
 *     con Envío a Domicilio / Click & Collect y citas sin empalmes.
 * ============================================================================
 */

"use strict";

const ADMIN_PIN = "2026";

/**
 * Imagen SVG embebida (Data URI) para evitar errores 404 si alguna imagen
 * externa no responde o si el administrador registra un producto sin URL.
 */
const FALLBACK_IMG_SVG =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240">
      <rect width="320" height="240" fill="#e6f4f1"/>
      <circle cx="160" cy="105" r="46" fill="#0b5d56" fill-opacity="0.14"/>
      <text x="160" y="120" font-size="48" text-anchor="middle">🐾</text>
      <text x="160" y="175" font-family="sans-serif" font-size="15" font-weight="bold" fill="#063f3a" text-anchor="middle">Producto PetCare</text>
    </svg>`
  );

const INITIAL_PRODUCTS = [
  { id: 1, name: "Croquetas Adulto Raza Mediana 15kg", category: "Alimento", price: 980, stock: 14, img: "https://http2.mlstatic.com/D_NQ_NP_653192-MLA95696329010_102025-O.webp", desc: "Nutrición balanceada con omega 3 y 6 para pelaje brillante." },
  { id: 2, name: "Alimento Húmedo Renal Felino (Pack 6)", category: "Alimento", price: 340, stock: 9, img: "https://http2.mlstatic.com/D_NQ_NP_672718-MLC82504113847_022025-O-pack-x-6-latas-alimento-humedo-renal-para-gato-85g-vet-life.webp", desc: "Fórmula veterinaria baja en fósforo para cuidado renal." },
  { id: 3, name: "Tableta Antipulgas y Garrapatas 3 Meses", category: "Farmacia", price: 520, stock: 18, img: "https://http2.mlstatic.com/D_NQ_NP_822077-MLU94001328609_102025-O.webp", desc: "Protección oral masticable de acción rápida para perros." },
  { id: 4, name: "Shampoo Hipoalergénico Avena y Aloe", category: "Higiene", price: 215, stock: 22, img: "https://cyceanimalcare.com/wp-content/uploads/2026/02/Hipoalergenico-Shampoo-1L-scaled.png", desc: "Calma piel sensible y aporta suavidad sin parabenos." },
  { id: 5, name: "Pechera Ergonómica Antitirones", category: "Accesorios", price: 390, stock: 11, img: "https://http2.mlstatic.com/D_NQ_NP_937202-MLU98674329881_112025-O.webp", desc: "Bandas reflejantes nocturnas y ajuste acolchado." },
  { id: 6, name: "Cepillo Carda Autolimpiable Spa", category: "Higiene", price: 185, stock: 16, img: "https://shop.aksi.com.mx/cdn/shop/products/663203-A.jpg?v=1681773670", desc: "Retira pelo muerto sin lastimar la dermis de tu mascota." },
  { id: 7, name: "Suplemento Condroprotector Articular", category: "Farmacia", price: 460, stock: 7, img: "https://www.antonlc.com/cdn/shop/files/condroprotector-perros-gatos-apoyo-articular-fondo-blanco.webp?v=1781008211&width=1200", desc: "Glucosamina y condroitina para movilidad en perros senior." },
  { id: 8, name: "Cama Ortopédica Memory Foam M", category: "Accesorios", price: 790, stock: 5, img: "https://m.media-amazon.com/images/I/71Glb77vr1L._AC_SL1500_.jpg", desc: "Funda lavable impermeable y soporte articular." },
  { id: 9, name: "Premios Dentales Clorofila (30 pzas)", category: "Alimento", price: 165, stock: 25, img: "https://http2.mlstatic.com/D_NQ_NP_657468-MLC92707568383_092025-O.webp", desc: "Reduce el sarro y mantiene aliento fresco diariamente." },
  { id: 10, name: "Solución Ótica Limpiadora Veterinaria", category: "Farmacia", price: 240, stock: 12, img: "https://www.cosmos.com.ec/cdn/shop/files/350_41d170bc-e3da-4ffe-a557-0b012397af95.jpg?v=1776193892&width=1946", desc: "Prevención de otitis e higiene profunda del canal auditivo." },
  { id: 11, name: "Transportadora Rígida Ventilada IATA", category: "Accesorios", price: 850, stock: 4, img: "https://tse1.mm.bing.net/th/id/OIP.H6aTuS-TP4Psh2IPchxQvAHaFd?r=0&w=2136&h=1577&rs=1&pid=ImgDetMain&o=7&rm=3", desc: "Puerta metálica de seguridad ideal para viajes y clínica." },
  { id: 12, name: "Kit Cepillo y Pasta Enzimática", category: "Higiene", price: 195, stock: 19, img: "https://www.mascotastur.es/19323-large_default/virbac-pasta-enzimatica-kit-cepillos.jpg", desc: "Higiene bucal completa sabor pollo sin necesidad de enjuague." }
];

const INITIAL_APPOINTMENTS = [
  { id: 101, owner: "Laura Méndez", pet: "Max", species: "Perro", breed: "Golden Retriever", service: "Baño y Corte Estético ($380 MXN)", date: "2026-11-20", time: "10:30" },
  { id: 102, owner: "Jorge Ramírez", pet: "Luna", species: "Gato", breed: "Siamés", service: "Vacunación ($420 MXN)", date: "2026-11-20", time: "12:00" }
];

const INITIAL_RECORDS = [
  { id: 201, pet: "Max", breed: "Perro • Golden Retriever", owner: "Laura Méndez", vaccines: "Séxtuple, Rabia, Bordetella", allergies: "Ninguna conocida", treatment: "Baño dermatológico mensual" },
  { id: 202, pet: "Rocky", breed: "Perro • Bulldog Francés", owner: "Daniela Cruz", vaccines: "Quíntuple, Rabia", allergies: "Pollo y colorantes", treatment: "Dieta hipoalergénica + limpieza de pliegues" },
  { id: 203, pet: "Luna", breed: "Gato • Siamés", owner: "Jorge Ramírez", vaccines: "Triple Felina, Leucemia", allergies: "Ninguna", treatment: "Desparasitación trimestral" }
];

const TIME_SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

// Estado persistente en LocalStorage
let products = JSON.parse(localStorage.getItem("petcare_products")) || INITIAL_PRODUCTS;
let cart = JSON.parse(localStorage.getItem("petcare_cart")) || [];
let appointments = JSON.parse(localStorage.getItem("petcare_appointments")) || INITIAL_APPOINTMENTS;
let records = JSON.parse(localStorage.getItem("petcare_records")) || INITIAL_RECORDS;
let currentRole = localStorage.getItem("petcare_role") || "cliente";

function saveState() {
  localStorage.setItem("petcare_products", JSON.stringify(products));
  localStorage.setItem("petcare_cart", JSON.stringify(cart));
  localStorage.setItem("petcare_appointments", JSON.stringify(appointments));
  localStorage.setItem("petcare_records", JSON.stringify(records));
  localStorage.setItem("petcare_role", currentRole);
}

/**
 * Sanitiza texto ingresado por el usuario antes de inyectarlo en HTML (prevención XSS).
 */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================================================
// 1. CONTROL DE DÍAS HÁBILES (BLOQUEO DE SÁBADOS Y DOMINGOS)
// ==========================================================================
function isWeekend(dateStr) {
  if (!dateStr) return false;
  const [y, m, d] = dateStr.split("-").map(Number);
  const day = new Date(y, m - 1, d).getDay();
  return day === 0 || day === 6; // 0 = Domingo, 6 = Sábado
}

function getNextMonday(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.getDay();
  date.setDate(date.getDate() + (day === 6 ? 2 : 1));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function enforceWeekdaysOnly(inputEl, onChangeCallback = null) {
  if (!inputEl) return;
  inputEl.addEventListener("change", () => {
    if (isWeekend(inputEl.value)) {
      alert("📅 Nuestro horario de atención es de Lunes a Viernes. Los fines de semana están bloqueados; ajustamos la fecha al siguiente lunes hábil.");
      inputEl.value = getNextMonday(inputEl.value);
    }
    if (onChangeCallback) onChangeCallback();
  });
}

// ==========================================================================
// 2. MODALES COMPARTIDOS (PIN ADMIN, CARRITO Y COMPROBANTE DE ÉXITO)
// ==========================================================================
function injectSharedModals() {
  if (document.getElementById("cart-dialog")) return;
  document.body.insertAdjacentHTML("beforeend", `
    <dialog class="modal modal-sm" id="pin-dialog" aria-labelledby="pin-title">
      <article class="modal-content">
        <header class="modal-header">
          <h2 id="pin-title">🔐 Acceso Administrador</h2>
          <button type="button" class="btn btn-outline btn-sm" id="close-pin-btn">✕</button>
        </header>
        <form id="pin-form" class="styled-form" style="padding: 1rem;">
          <p style="font-size: 0.9rem; color: var(--text-muted);">Ingresa el PIN de seguridad de 4 dígitos para activar los permisos médicos y de inventario.</p>
          <label>PIN de Administrador *
            <input type="password" id="admin-pin-input" inputmode="numeric" maxlength="4" required placeholder="••••" style="text-align:center; font-size:1.35rem; letter-spacing:0.45rem;">
          </label>
          <p id="pin-error" class="error-text hidden"></p>
          <button type="submit" class="btn btn-primary">🔓 Verificar e Ingresar</button>
        </form>
      </article>
    </dialog>

    <dialog class="modal" id="cart-dialog" aria-labelledby="cart-title">
      <article class="modal-content">
        <header class="modal-header">
          <h2 id="cart-title">🛒 Finalizar Compra (Pago con Tarjeta)</h2>
          <button type="button" class="btn btn-outline btn-sm" id="close-cart-btn">✕</button>
        </header>
        <blockquote class="shipping-notice">
          <strong>🔒 Pago 100% Seguro:</strong> Liquida con tarjeta para apartar tu inventario. Elige <strong>Envío a Domicilio</strong> o <strong>Click &amp; Collect</strong>.
        </blockquote>
        <ul class="clean-list" id="cart-items-list"></ul>
        <p id="cart-total-display" style="font-weight: 800; font-size: 1.15rem; text-align: right; color: var(--primary-dark);">Total: $0.00 MXN</p>
        <form id="checkout-form" class="styled-form" style="padding: 1.1rem;">
          <fieldset class="single-col" style="padding: 0.9rem;">
            <legend>1️⃣ Modalidad de Entrega</legend>
            <section class="mode-selector">
              <label class="mode-option">
                <input type="radio" name="delivery-mode" value="envio" checked>
                <span><strong>🚚 Envío a Domicilio</strong><small>Entrega directa en tu dirección</small></span>
              </label>
              <label class="mode-option">
                <input type="radio" name="delivery-mode" value="click_collect">
                <span><strong>🏪 Click &amp; Collect</strong><small>Recoge en clínica con PIN</small></span>
              </label>
            </section>
            <section id="delivery-fields" style="display: flex; flex-direction: column; gap: 0.7rem; margin-top: 0.4rem;">
              <label>Dirección completa de entrega *
                <textarea id="ship-address" rows="2" required minlength="10" placeholder="Calle, número, colonia, C.P. y referencias..."></textarea>
              </label>
            </section>
            <section id="pickup-fields" class="hidden" style="display: flex; flex-direction: column; gap: 0.7rem; margin-top: 0.4rem;">
              <blockquote class="cc-requirements">
                <strong>📋 Requisitos Click &amp; Collect:</strong> Presentar <strong>PIN de 4 dígitos</strong> e identificación oficial en mostrador (Lunes a Viernes, plazo máx. 48 hrs).
              </blockquote>
              <label>Nombre completo de quien recoge *
                <input type="text" id="pickup-person" minlength="4" placeholder="Ej. Sofía Morales">
              </label>
              <label>Fecha programada de recolección (Lunes a Viernes) *
                <input type="date" id="pickup-date" value="2026-11-20">
                <small class="hint">Fines de semana bloqueados (atención Lunes a Viernes).</small>
              </label>
              <label>Bloque horario *
                <select id="pickup-slot">
                  <option value="09:00 - 11:00 hrs">09:00 - 11:00 hrs (Matutino)</option>
                  <option value="11:00 - 14:00 hrs">11:00 - 14:00 hrs (Mediodía)</option>
                  <option value="14:00 - 17:00 hrs">14:00 - 17:00 hrs (Vespertino)</option>
                  <option value="17:00 - 19:00 hrs">17:00 - 19:00 hrs (Cierre Clínico)</option>
                </select>
              </label>
            </section>
            <label>Celular de contacto (10 dígitos) *
              <input type="tel" id="ship-phone" inputmode="numeric" required pattern="[0-9]{10}" maxlength="10" placeholder="4771234567">
            </label>
          </fieldset>
          <fieldset style="padding: 0.9rem;">
            <legend>2️⃣ Pago con Tarjeta</legend>
            <label style="grid-column: 1 / -1;">Número de tarjeta (16 dígitos) *
              <input type="text" id="card-number" inputmode="numeric" required pattern="[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}" maxlength="19" placeholder="4532 8910 2345 6789">
            </label>
            <label style="grid-column: 1 / -1;">Nombre del titular *
              <input type="text" id="card-holder" required minlength="4" placeholder="Como aparece en la tarjeta">
            </label>
            <label>Vigencia (MM/AA) *
              <input type="text" id="card-expiry" inputmode="numeric" required pattern="(0[1-9]|1[0-2])/[0-9]{2}" maxlength="5" placeholder="08/29">
            </label>
            <label>CVV (3 dígitos) *
              <input type="password" id="card-cvv" inputmode="numeric" required pattern="[0-9]{3}" maxlength="3" placeholder="123">
            </label>
          </fieldset>
          <button type="submit" class="btn btn-accent" id="checkout-submit-btn">🔒 Confirmar Pago con Tarjeta</button>
        </form>
      </article>
    </dialog>

    <dialog class="modal modal-sm" id="success-dialog" aria-labelledby="success-title">
      <article class="modal-content" id="success-content"></article>
    </dialog>
  `);
}

function showSuccessModal({ badge, icon, title, subtitle, detailsHTML, highlightHTML = "", footerNote }) {
  const dialog = document.getElementById("success-dialog");
  const content = document.getElementById("success-content");
  if (!dialog || !content) return;
  content.innerHTML = `
    <header class="modal-header">
      <span class="category-pill">${badge}</span>
      <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('success-dialog').close()">✕</button>
    </header>
    <section class="receipt-hero">
      <span class="receipt-icon">${icon}</span>
      <h2 id="success-title">${title}</h2>
      <p>${subtitle}</p>
    </section>
    ${highlightHTML}
    <ul class="clean-list">${detailsHTML}</ul>
    <blockquote class="cc-requirements">${footerNote}</blockquote>
    <button type="button" class="btn btn-primary" onclick="document.getElementById('success-dialog').close()">✅ Entendido, Continuar</button>
  `;
  dialog.showModal();
}

// ==========================================================================
// 3. GESTIÓN DE ROLES CON PROTECCIÓN DE PIN
// ==========================================================================
function applyRoleUI() {
  const roleBtn = document.getElementById("role-toggle");
  const isAdmin = currentRole === "admin";
  document.body.classList.toggle("role-admin", isAdmin);
  if (roleBtn) {
    roleBtn.textContent = isAdmin ? "🛠️ Rol: Administrador" : "👤 Rol: Cliente";
    roleBtn.classList.toggle("is-admin", isAdmin);
  }
  if (isAdmin) document.getElementById("cart-dialog")?.close();
  renderProducts();
  renderAppointments();
  renderRecords();
}

window.toggleRole = function () {
  if (currentRole === "admin") {
    currentRole = "cliente";
    saveState();
    applyRoleUI();
    return;
  }
  const pinDialog = document.getElementById("pin-dialog");
  const pinInput = document.getElementById("admin-pin-input");
  const pinError = document.getElementById("pin-error");
  if (pinInput) pinInput.value = "";
  if (pinError) pinError.classList.add("hidden");
  pinDialog?.showModal();
  pinInput?.focus();
};

// ==========================================================================
// 4. CATÁLOGO DE PRODUCTOS (SIN ERRORES 404 EN IMÁGENES)
// ==========================================================================
function renderProducts() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;
  const query = (document.getElementById("product-search")?.value || "").toLowerCase();
  const cat = document.getElementById("category-filter")?.value || "Todas";
  const isAdmin = currentRole === "admin";
  const filtered = products.filter(p =>
    (p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query)) &&
    (cat === "Todas" || p.category === cat)
  );
  const counter = document.getElementById("product-counter");
  if (counter) counter.textContent = `Mostrando ${filtered.length} de ${products.length} productos`;

  grid.innerHTML = filtered.map(p => `
    <article class="card">
      <figure class="product-img-slot">
        <img src="${escapeHTML(p.img)}" alt="${escapeHTML(p.name)}" onerror="this.onerror=null; this.src='${FALLBACK_IMG_SVG}';">
      </figure>
      <header class="product-meta">
        <span class="category-pill">${escapeHTML(p.category)}</span>
        <span class="stock-pill ${p.stock <= 5 ? "low" : ""}">Stock: ${p.stock} u.</span>
      </header>
      <h3>${escapeHTML(p.name)}</h3>
      <p style="font-size: 0.88rem; color: var(--text-muted);">${escapeHTML(p.desc)}</p>
      <p class="price">$${Number(p.price).toFixed(2)} MXN</p>
      <footer class="card-actions">
        ${!isAdmin
          ? `<button type="button" class="btn btn-primary btn-sm" onclick="addToCart(${p.id})" ${p.stock === 0 ? "disabled" : ""}>${p.stock > 0 ? "🛒 Agregar al carrito" : "Agotado"}</button>`
          : `<button type="button" class="btn btn-outline btn-sm" onclick="editProductStock(${p.id})">✏️ Stock</button>
             <button type="button" class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">🗑️ Eliminar</button>`
        }
      </footer>
    </article>
  `).join("");
}

window.editProductStock = function (id) {
  if (currentRole !== "admin") return;
  const prod = products.find(p => p.id === id);
  if (!prod) return;
  const newStock = prompt(`Actualizar existencias para "${prod.name}":`, prod.stock);
  if (newStock !== null && newStock.trim() !== "" && !isNaN(newStock) && Number(newStock) >= 0) {
    prod.stock = parseInt(newStock, 10);
    saveState();
    renderProducts();
  }
};

window.deleteProduct = function (id) {
  if (currentRole !== "admin" || !confirm("¿Eliminar este producto del inventario?")) return;
  products = products.filter(p => p.id !== id);
  saveState();
  renderProducts();
};

// ==========================================================================
// 5. CARRITO Y MODALIDAD DE ENTREGA
// ==========================================================================
function updateCartUI() {
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.textContent = cart.reduce((acc, item) => acc + item.qty, 0);
  const listEl = document.getElementById("cart-items-list");
  const totalEl = document.getElementById("cart-total-display");
  if (!listEl || !totalEl) return;
  if (cart.length === 0) {
    listEl.innerHTML = "<li>Tu carrito está vacío. Agrega productos desde el catálogo.</li>";
    totalEl.textContent = "Total: $0.00 MXN";
    return;
  }
  let total = 0;
  listEl.innerHTML = cart.map(item => {
    total += item.price * item.qty;
    return `
      <li>
        <span><strong>${escapeHTML(item.name)}</strong><br><small>$${item.price.toFixed(2)} x ${item.qty}</small></span>
        <aside style="display:flex; gap:0.35rem; align-items:center;">
          <button type="button" class="btn btn-outline btn-sm" onclick="changeCartQty(${item.id}, -1)">-</button>
          <strong>${item.qty}</strong>
          <button type="button" class="btn btn-outline btn-sm" onclick="changeCartQty(${item.id}, 1)">+</button>
        </aside>
      </li>
    `;
  }).join("");
  totalEl.textContent = `Total: $${total.toFixed(2)} MXN`;
}

window.addToCart = function (productId) {
  if (currentRole === "admin") return;
  const prod = products.find(p => p.id === productId);
  if (!prod || prod.stock <= 0) return;
  const existing = cart.find(c => c.id === productId);
  if (existing) {
    if (existing.qty < prod.stock) existing.qty += 1;
    else { alert("Has alcanzado el máximo de existencias disponibles."); return; }
  } else {
    cart.push({ id: prod.id, name: prod.name, price: prod.price, qty: 1 });
  }
  saveState();
  updateCartUI();
};

window.changeCartQty = function (productId, delta) {
  const item = cart.find(c => c.id === productId);
  const prod = products.find(p => p.id === productId);
  if (!item || !prod) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== productId);
  else if (item.qty > prod.stock) item.qty = prod.stock;
  saveState();
  updateCartUI();
};

function syncDeliveryModeUI() {
  const isCC = (document.querySelector('input[name="delivery-mode"]:checked')?.value || "envio") === "click_collect";
  document.getElementById("delivery-fields")?.classList.toggle("hidden", isCC);
  document.getElementById("pickup-fields")?.classList.toggle("hidden", !isCC);
  const shipAddress = document.getElementById("ship-address");
  const pickupPerson = document.getElementById("pickup-person");
  const pickupDate = document.getElementById("pickup-date");
  const submitBtn = document.getElementById("checkout-submit-btn");
  if (shipAddress) shipAddress.required = !isCC;
  if (pickupPerson) pickupPerson.required = isCC;
  if (pickupDate) pickupDate.required = isCC;
  if (submitBtn) submitBtn.textContent = isCC ? "🔒 Pagar y Generar PIN Click & Collect" : "🔒 Pagar y Programar Envío";
}

// ==========================================================================
// 6. CITAS ANTI-EMPALMES Y EXPEDIENTES MÉDICOS
// ==========================================================================
function updateAvailableTimeSlots() {
  const dateInput = document.getElementById("cita-date");
  const timeSelect = document.getElementById("cita-time");
  if (!dateInput || !timeSelect) return;
  if (isWeekend(dateInput.value)) {
    timeSelect.innerHTML = `<option value="" disabled selected>Cerrado en fin de semana (Lun - Vie)</option>`;
    return;
  }
  const taken = appointments.filter(a => a.date === dateInput.value).map(a => a.time);
  timeSelect.innerHTML = TIME_SLOTS.map(slot => {
    const busy = taken.includes(slot);
    return `<option value="${slot}" ${busy ? "disabled" : ""}>${slot} hrs ${busy ? "(Ocupado)" : "(Disponible)"}</option>`;
  }).join("");
}

function renderAppointments() {
  const list = document.getElementById("appointments-list");
  if (!list) return;
  const isAdmin = currentRole === "admin";
  list.innerHTML = appointments.map(a => `
    <li>
      <span><strong>${escapeHTML(a.date)} • ${escapeHTML(a.time)} hrs</strong> — ${escapeHTML(a.service)}<br>
      <small>🐾 ${escapeHTML(a.pet)} (${escapeHTML(a.species)} - ${escapeHTML(a.breed)}) ${isAdmin ? `| Dueño: ${escapeHTML(a.owner)}` : ""}</small></span>
      ${isAdmin ? `<button type="button" class="btn btn-danger btn-sm" onclick="deleteAppointment(${a.id})">Eliminar</button>` : ""}
    </li>
  `).join("");
}

window.deleteAppointment = function (id) {
  if (currentRole !== "admin") return;
  appointments = appointments.filter(a => a.id !== id);
  saveState();
  renderAppointments();
  updateAvailableTimeSlots();
};

function renderRecords() {
  const grid = document.getElementById("records-grid");
  if (!grid) return;
  if (currentRole !== "admin") { grid.innerHTML = ""; return; }
  const query = (document.getElementById("record-search")?.value || "").toLowerCase();
  const filtered = records.filter(r =>
    r.pet.toLowerCase().includes(query) || r.owner.toLowerCase().includes(query) || r.allergies.toLowerCase().includes(query)
  );
  grid.innerHTML = filtered.map(r => `
    <article class="card">
      <header class="product-meta">
        <span class="category-pill">Expediente #${r.id}</span>
        <strong>${escapeHTML(r.breed)}</strong>
      </header>
      <h3>🐾 ${escapeHTML(r.pet)}</h3>
      <p><strong>Propietario:</strong> ${escapeHTML(r.owner)}</p>
      <p><strong>💉 Vacunas:</strong> ${escapeHTML(r.vaccines)}</p>
      <p><strong>⚠️ Alergias:</strong> ${escapeHTML(r.allergies)}</p>
      <p><strong>🩺 Tratamiento:</strong> ${escapeHTML(r.treatment)}</p>
      <footer class="card-actions">
        <button type="button" class="btn btn-danger btn-sm" onclick="deleteRecord(${r.id})">🗑️ Eliminar Expediente</button>
      </footer>
    </article>
  `).join("");
}

window.deleteRecord = function (id) {
  if (currentRole !== "admin") return;
  records = records.filter(r => r.id !== id);
  saveState();
  renderRecords();
};

// ==========================================================================
// 7. VALIDACIÓN JS COMPLETA DEL FORMULARIO DE CONTACTO (ETAPA 3)
// ==========================================================================
/**
 * Muestra u oculta el mensaje de error visual debajo de cada campo y colorea su borde.
 */
function setFieldValidationState(inputEl, errorEl, errorMsg) {
  if (!inputEl) return true;
  if (errorMsg) {
    inputEl.classList.remove("input-valid");
    inputEl.classList.add("input-error");
    inputEl.setAttribute("aria-invalid", "true");
    if (errorEl) errorEl.textContent = `⚠️ ${errorMsg}`;
    return false;
  } else {
    inputEl.classList.remove("input-error");
    inputEl.classList.add("input-valid");
    inputEl.removeAttribute("aria-invalid");
    if (errorEl) errorEl.textContent = "";
    return true;
  }
}

/**
 * Ejecuta la validación integral de todos los campos obligatorios, correo y teléfono.
 * @returns {boolean} true si todo el formulario es válido; false si hay errores.
 */
function validateContactForm() {
  const nameEl = document.getElementById("contact-name");
  const emailEl = document.getElementById("contact-email");
  const phoneEl = document.getElementById("contact-phone");
  const topicEl = document.getElementById("contact-topic");
  const msgEl = document.getElementById("contact-message");
  const privacyEl = document.getElementById("contact-privacy");
  const alertBox = document.getElementById("contact-form-alert");

  const errName = document.getElementById("err-contact-name");
  const errEmail = document.getElementById("err-contact-email");
  const errPhone = document.getElementById("err-contact-phone");
  const errTopic = document.getElementById("err-contact-topic");
  const errMsg = document.getElementById("err-contact-message");
  const errPrivacy = document.getElementById("err-contact-privacy");

  const errors = [];

  // 1. Validación de Nombre completo (obligatorio, mínimo 3 caracteres, solo letras y espacios)
  const nameVal = nameEl.value.trim();
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/;
  if (!nameVal) {
    setFieldValidationState(nameEl, errName, "El nombre completo es obligatorio.");
    errors.push({ el: nameEl, msg: "Nombre completo obligatorio." });
  } else if (!nameRegex.test(nameVal)) {
    setFieldValidationState(nameEl, errName, "Ingresa al menos 3 letras (sin números ni símbolos).");
    errors.push({ el: nameEl, msg: "Formato de nombre inválido." });
  } else {
    setFieldValidationState(nameEl, errName, "");
  }

  // 2. Validación de Correo electrónico (obligatorio + RegExp estándar)
  const emailVal = emailEl.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailVal) {
    setFieldValidationState(emailEl, errEmail, "El correo electrónico es obligatorio.");
    errors.push({ el: emailEl, msg: "Correo electrónico obligatorio." });
  } else if (!emailRegex.test(emailVal)) {
    setFieldValidationState(emailEl, errEmail, "Ingresa un correo válido (ej. usuario@dominio.com).");
    errors.push({ el: emailEl, msg: "Correo electrónico con formato inválido." });
  } else {
    setFieldValidationState(emailEl, errEmail, "");
  }

  // 3. Validación de Teléfono celular (obligatorio + exactamente 10 dígitos numéricos)
  const phoneVal = phoneEl.value.trim();
  const phoneRegex = /^\d{10}$/;
  if (!phoneVal) {
    setFieldValidationState(phoneEl, errPhone, "El teléfono celular es obligatorio.");
    errors.push({ el: phoneEl, msg: "Teléfono obligatorio." });
  } else if (!phoneRegex.test(phoneVal)) {
    setFieldValidationState(phoneEl, errPhone, "El teléfono debe contener exactamente 10 dígitos numéricos.");
    errors.push({ el: phoneEl, msg: "Teléfono debe tener 10 dígitos." });
  } else {
    setFieldValidationState(phoneEl, errPhone, "");
  }

  // 4. Validación de Motivo de consulta (select obligatorio)
  if (!topicEl.value) {
    setFieldValidationState(topicEl, errTopic, "Selecciona un motivo de consulta.");
    errors.push({ el: topicEl, msg: "Motivo de consulta sin seleccionar." });
  } else {
    setFieldValidationState(topicEl, errTopic, "");
  }

  // 5. Validación de Mensaje (obligatorio, mínimo 10 caracteres)
  const msgVal = msgEl.value.trim();
  if (!msgVal) {
    setFieldValidationState(msgEl, errMsg, "El detalle del mensaje es obligatorio.");
    errors.push({ el: msgEl, msg: "Mensaje vacío." });
  } else if (msgVal.length < 10) {
    setFieldValidationState(msgEl, errMsg, `Escribe al menos 10 caracteres (actual: ${msgVal.length}).`);
    errors.push({ el: msgEl, msg: "Mensaje demasiado corto (mínimo 10 caracteres)." });
  } else {
    setFieldValidationState(msgEl, errMsg, "");
  }

  // 6. Validación de Aviso de privacidad (checkbox obligatorio)
  if (!privacyEl.checked) {
    if (errPrivacy) errPrivacy.textContent = "⚠️ Debes aceptar el aviso de privacidad para continuar.";
    errors.push({ el: privacyEl, msg: "Aviso de privacidad no aceptado." });
  } else {
    if (errPrivacy) errPrivacy.textContent = "";
  }

  // Mostrar alerta visual superior resumiendo los errores si existen
  if (errors.length > 0) {
    if (alertBox) {
      alertBox.className = "alert-box alert-error";
      alertBox.innerHTML = `
        <strong>❌ No se pudo enviar el formulario. Corrige ${errors.length} campo(s):</strong>
        <ul style="margin: 0.4rem 0 0 1.2rem; font-weight: 500;">
          ${errors.map(err => `<li>${escapeHTML(err.msg)}</li>`).join("")}
        </ul>
      `;
    }
    errors[0].el.focus();
    return false;
  }

  if (alertBox) {
    alertBox.className = "alert-box alert-success";
    alertBox.textContent = "✅ Todos los campos fueron validados correctamente.";
  }
  return true;
}

function initContactValidation() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  // Validación dinámica en tiempo real mientras el usuario escribe o cambia campos
  ["contact-name", "contact-email", "contact-phone", "contact-topic", "contact-message", "contact-privacy"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const eventName = el.tagName === "SELECT" || el.type === "checkbox" ? "change" : "blur";
    el.addEventListener(eventName, () => validateContactForm());
  });

  // Validación completa interceptando el evento 'submit' antes de enviar
  contactForm.addEventListener("submit", e => {
    e.preventDefault();

    if (!validateContactForm()) {
      return;
    }

    const nombre = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const phone = document.getElementById("contact-phone").value.trim();
    const topic = document.getElementById("contact-topic").value;

    showSuccessModal({
      badge: "✉️ Solicitud Validada y Enviada",
      icon: "📨",
      title: "¡Mensaje Enviado con Éxito!",
      subtitle: `Gracias por escribirnos, ${escapeHTML(nombre)}. Nuestro equipo veterinario revisará tu consulta.`,
      detailsHTML: `
        <li><strong>📋 Motivo:</strong><span>${escapeHTML(topic)}</span></li>
        <li><strong>📧 Correo de respuesta:</strong><span>${escapeHTML(email)}</span></li>
        <li><strong>📱 Teléfono registrado:</strong><span>${escapeHTML(phone)}</span></li>
        <li><strong>⏱️ Horario de atención:</strong><span>Lunes a Viernes de 09:00 a 19:00 hrs</span></li>
      `,
      footerNote: "Para urgencias médicas inmediatas comunícate al (477) 555-0192."
    });

    contactForm.reset();
    contactForm.querySelectorAll(".input-valid, .input-error").forEach(el => {
      el.classList.remove("input-valid", "input-error");
    });
    const alertBox = document.getElementById("contact-form-alert");
    if (alertBox) alertBox.classList.add("hidden");
  });
}

// ==========================================================================
// 8. FILTROS DE TECLADO E INICIALIZACIÓN GLOBAL DEL DOM
// ==========================================================================
function enforceDigitsOnly(el, maxLen, formatter = null) {
  if (!el) return;
  el.addEventListener("beforeinput", e => { if (e.data && /\D/.test(e.data)) e.preventDefault(); });
  el.addEventListener("input", () => {
    const digits = el.value.replace(/\D/g, "").slice(0, maxLen);
    el.value = formatter ? formatter(digits) : digits;
  });
}

function enforceLettersOnly(el) {
  if (!el) return;
  el.addEventListener("beforeinput", e => { if (e.data && /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(e.data)) e.preventDefault(); });
  el.addEventListener("input", () => { el.value = el.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""); });
}

document.addEventListener("DOMContentLoaded", () => {
  injectSharedModals();

  // ------------------------------------------------------------------------
  // MENÚ HAMBURGUESA INTERACTIVO PARA VERSIÓN MÓVIL (EVENTO CLICK - ETAPA 3)
  // ------------------------------------------------------------------------
  const menuBtn = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.textContent = isOpen ? "✕" : "☰";
      menuBtn.setAttribute("aria-label", isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación");
    });

    // Cierra automáticamente el menú móvil al hacer clic en cualquier enlace
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        if (navLinks.classList.contains("open")) {
          navLinks.classList.remove("open");
          menuBtn.setAttribute("aria-expanded", "false");
          menuBtn.textContent = "☰";
        }
      });
    });
  }

  // Control de Rol y Modal PIN
  document.getElementById("role-toggle")?.addEventListener("click", toggleRole);
  document.getElementById("close-pin-btn")?.addEventListener("click", () => document.getElementById("pin-dialog")?.close());
  document.getElementById("pin-form")?.addEventListener("submit", e => {
    e.preventDefault();
    const entered = document.getElementById("admin-pin-input").value.trim();
    const pinError = document.getElementById("pin-error");
    if (entered === ADMIN_PIN) {
      currentRole = "admin";
      saveState();
      applyRoleUI();
      document.getElementById("pin-dialog").close();
    } else {
      pinError.textContent = "❌ PIN incorrecto. Intenta nuevamente (PIN: 2026).";
      pinError.classList.remove("hidden");
      document.getElementById("admin-pin-input").value = "";
    }
  });

  document.getElementById("logout-btn")?.addEventListener("click", () => {
    currentRole = "cliente";
    saveState();
    applyRoleUI();
    alert("Sesión cerrada. Has regresado al perfil de Cliente.");
  });

  // Carrito y Checkout
  const cartDialog = document.getElementById("cart-dialog");
  document.getElementById("open-cart-btn")?.addEventListener("click", () => {
    if (currentRole === "admin") return;
    updateCartUI();
    syncDeliveryModeUI();
    cartDialog?.showModal();
  });
  document.getElementById("close-cart-btn")?.addEventListener("click", () => cartDialog?.close());
  document.querySelectorAll('input[name="delivery-mode"]').forEach(r => r.addEventListener("change", syncDeliveryModeUI));

  // Bloqueo de fines de semana en Click & Collect
  const pickupDateInput = document.getElementById("pickup-date");
  enforceWeekdaysOnly(pickupDateInput);

  // Bloqueos de teclado en campos numéricos y de texto
  enforceDigitsOnly(document.getElementById("admin-pin-input"), 4);
  enforceDigitsOnly(document.getElementById("ship-phone"), 10);
  enforceDigitsOnly(document.getElementById("contact-phone"), 10);
  enforceDigitsOnly(document.getElementById("card-number"), 16, d => d.replace(/(.{4})/g, "$1 ").trim());
  enforceDigitsOnly(document.getElementById("card-expiry"), 4, d => (d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d));
  enforceDigitsOnly(document.getElementById("card-cvv"), 3);
  enforceLettersOnly(document.getElementById("card-holder"));
  enforceLettersOnly(document.getElementById("pickup-person"));
  enforceLettersOnly(document.getElementById("contact-name"));

  // Procesar Pago con Comprobante Diferenciado
  document.getElementById("checkout-form")?.addEventListener("submit", e => {
    e.preventDefault();
    if (currentRole === "admin") return;
    if (cart.length === 0) { alert("Tu carrito está vacío. Agrega al menos un producto."); return; }
    const mode = document.querySelector('input[name="delivery-mode"]:checked')?.value || "envio";
    const pDateEl = document.getElementById("pickup-date");
    if (mode === "click_collect" && isWeekend(pDateEl.value)) {
      alert("📅 No laboramos fines de semana. Selecciona un día de lunes a viernes.");
      pDateEl.value = getNextMonday(pDateEl.value);
      return;
    }
    const phone = document.getElementById("ship-phone").value.trim();
    const last4 = document.getElementById("card-number").value.replace(/\s/g, "").slice(-4);
    const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
    const itemsCount = cart.reduce((acc, i) => acc + i.qty, 0);

    cart.forEach(item => {
      const prod = products.find(p => p.id === item.id);
      if (prod) prod.stock = Math.max(0, prod.stock - item.qty);
    });
    cartDialog?.close();

    if (mode === "click_collect") {
      const person = document.getElementById("pickup-person").value.trim();
      const pDate = pDateEl.value;
      const pSlot = document.getElementById("pickup-slot").value;
      const folio = "CC-" + Math.floor(100000 + Math.random() * 900000);
      const pin = Math.floor(1000 + Math.random() * 9000);
      showSuccessModal({
        badge: "🏪 Pedido Click & Collect Confirmado",
        icon: "🎉",
        title: "¡Compra Realizada con Éxito!",
        subtitle: `Pago aprobado por $${total.toFixed(2)} MXN (${itemsCount} artículo/s) con tarjeta •••• ${last4}.`,
        highlightHTML: `<section class="pin-highlight"><small>TU PIN DE RECOLECCIÓN EN SUCURSAL</small><strong>${pin}</strong><span>Folio: ${folio}</span></section>`,
        detailsHTML: `
          <li><strong>👤 Persona autorizada:</strong><span>${escapeHTML(person)}</span></li>
          <li><strong>📅 Fecha y Horario:</strong><span>${escapeHTML(pDate)} (${escapeHTML(pSlot)})</span></li>
          <li><strong>📍 Sucursal:</strong><span>Blvd. Adolfo López Mateos #1420</span></li>
          <li><strong>📱 SMS enviado a:</strong><span>${escapeHTML(phone)}</span></li>
        `,
        footerNote: "Recuerda presentar este <strong>PIN de 4 dígitos</strong> junto con tu <strong>identificación oficial</strong> en mostrador (Lunes a Viernes, vigencia de 48 hrs)."
      });
    } else {
      const address = document.getElementById("ship-address").value.trim();
      const folio = "ENV-" + Math.floor(100000 + Math.random() * 900000);
      showSuccessModal({
        badge: "🚚 Envío a Domicilio Programado",
        icon: "✅",
        title: "¡Compra Realizada con Éxito!",
        subtitle: `Pago aprobado por $${total.toFixed(2)} MXN (${itemsCount} artículo/s) con tarjeta •••• ${last4}.`,
        highlightHTML: `<section class="pin-highlight"><small>NÚMERO DE GUÍA DE RASTREO</small><strong>${folio}</strong><span>Entrega estimada: 24 a 48 hrs hábiles (Lun - Vie)</span></section>`,
        detailsHTML: `
          <li><strong>🏠 Dirección de entrega:</strong><span>${escapeHTML(address)}</span></li>
          <li><strong>📱 Notificaciones al cel:</strong><span>${escapeHTML(phone)}</span></li>
        `,
        footerNote: "Tu paquete está siendo preparado en farmacia veterinaria. Te notificaremos por SMS cuando el repartidor vaya en camino."
      });
    }

    cart = [];
    saveState();
    updateCartUI();
    renderProducts();
    e.target.reset();
    syncDeliveryModeUI();
  });

  // Catálogo y Admin Productos
  document.getElementById("product-search")?.addEventListener("input", renderProducts);
  document.getElementById("category-filter")?.addEventListener("change", renderProducts);
  document.getElementById("add-product-form")?.addEventListener("submit", e => {
    e.preventDefault();
    if (currentRole !== "admin") return;
    products.unshift({
      id: Date.now(),
      name: document.getElementById("prod-name").value.trim(),
      category: document.getElementById("prod-category").value,
      price: parseFloat(document.getElementById("prod-price").value),
      stock: parseInt(document.getElementById("prod-stock").value, 10),
      img: document.getElementById("prod-img").value.trim() || FALLBACK_IMG_SVG,
      desc: document.getElementById("prod-desc").value.trim()
    });
    saveState();
    renderProducts();
    e.target.reset();
  });

  // Citas (Bloqueo de fines de semana + Anti-empalmes)
  const citaDate = document.getElementById("cita-date");
  if (citaDate) {
    citaDate.value = "2026-11-20";
    enforceWeekdaysOnly(citaDate, updateAvailableTimeSlots);
    updateAvailableTimeSlots();
  }
  document.getElementById("appointment-form")?.addEventListener("submit", e => {
    e.preventDefault();
    if (isWeekend(citaDate.value)) {
      alert("📅 No trabajamos fines de semana. Selecciona una fecha de lunes a viernes.");
      citaDate.value = getNextMonday(citaDate.value);
      updateAvailableTimeSlots();
      return;
    }
    const newAppt = {
      id: Date.now(),
      owner: document.getElementById("cita-owner").value.trim(),
      pet: document.getElementById("cita-pet").value.trim(),
      species: document.getElementById("cita-species").value,
      breed: document.getElementById("cita-breed").value.trim(),
      service: document.getElementById("cita-service").value,
      date: citaDate.value,
      time: document.getElementById("cita-time").value
    };
    appointments.push(newAppt);
    saveState();
    renderAppointments();
    updateAvailableTimeSlots();
    showSuccessModal({
      badge: "📅 Reservación Confirmada",
      icon: "🐾",
      title: "¡Cita Agendada con Éxito!",
      subtitle: `El horario ha quedado bloqueado exclusivamente para ${escapeHTML(newAppt.pet)}.`,
      highlightHTML: `<section class="pin-highlight"><small>FECHA Y HORA RESERVADA</small><strong>${escapeHTML(newAppt.date)} • ${escapeHTML(newAppt.time)} hrs</strong><span>Folio Cita: #CIT-${String(newAppt.id).slice(-5)}</span></section>`,
      detailsHTML: `
        <li><strong>🐶 Paciente:</strong><span>${escapeHTML(newAppt.pet)} (${escapeHTML(newAppt.species)} - ${escapeHTML(newAppt.breed)})</span></li>
        <li><strong>🩺 Servicio:</strong><span>${escapeHTML(newAppt.service)}</span></li>
        <li><strong>👤 Propietario:</strong><span>${escapeHTML(newAppt.owner)}</span></li>
      `,
      footerNote: "Por favor acude 10 minutos antes de tu cita a Blvd. Adolfo López Mateos #1420 (Atención Lunes a Viernes)."
    });
    e.target.reset();
    citaDate.value = newAppt.date;
    updateAvailableTimeSlots();
  });

  // Expedientes Médicos (Solo Admin)
  document.getElementById("record-search")?.addEventListener("input", renderRecords);
  document.getElementById("record-form")?.addEventListener("submit", e => {
    e.preventDefault();
    if (currentRole !== "admin") return;
    records.unshift({
      id: Math.floor(204 + Math.random() * 700),
      pet: document.getElementById("rec-pet").value.trim(),
      breed: document.getElementById("rec-breed").value.trim(),
      owner: document.getElementById("rec-owner").value.trim(),
      vaccines: document.getElementById("rec-vaccines").value.trim(),
      allergies: document.getElementById("rec-allergies").value.trim(),
      treatment: document.getElementById("rec-treatment").value.trim()
    });
    saveState();
    renderRecords();
    e.target.reset();
  });

  // Inicializar validación JS del formulario de contacto (Etapa 3)
  initContactValidation();

  // Render inicial de interfaz
  applyRoleUI();
  updateCartUI();
});