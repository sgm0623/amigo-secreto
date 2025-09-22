// =======================
// Estado
// =======================
const amigos = [];
const normalizados = new Set(); // evitar duplicados ignorando mayúsculas y espacios


const $ = (id) => document.getElementById(id);

function normalizaNombre(txt) {
  return txt.trim().toLowerCase().replace(/\s+/g, " ");
}

function limpiarResultado() {
  const res = $("resultado");
  if (res) res.innerHTML = "";
}

function ponerMensajeResultado(texto) {
  const res = $("resultado");
  if (!res) return;
  res.innerHTML = "";
  const li = document.createElement("li");
  li.textContent = texto;
  res.appendChild(li);
}

function renderLista() {
  const ul = $("listaAmigos");
  if (!ul) return;
  ul.innerHTML = "";

  amigos.forEach((nombre, idx) => {
    const li = document.createElement("li");

    // Contenido: nombre
    const span = document.createElement("span");
    span.textContent = nombre;

    // Botón eliminar (❌)
    const btn = document.createElement("button");
    btn.textContent = "✖";
    btn.title = `Eliminar a ${nombre}`;
    btn.style.marginLeft = "8px";
    btn.style.padding = "2px 8px";
    btn.style.borderRadius = "12px";
    btn.onclick = () => eliminarAmigo(idx);

    li.appendChild(span);
    li.appendChild(btn);
    ul.appendChild(li);
  });
}


function agregarAmigo() {
  const input = $("amigo");
  if (!input) return;

  const crudo = input.value;
  const nombre = crudo.trim();

  // Validaciones de entrada
  if (!nombre) {
    ponerMensajeResultado("⚠️ Escribe un nombre antes de agregar.");
    input.focus();
    return;
  }

  const clave = normalizaNombre(nombre);
  if (normalizados.has(clave)) {
    ponerMensajeResultado("⚠️ Ese nombre ya está en la lista.");
    input.select();
    return;
  }

  // Actualiza estado
  amigos.push(nombre);
  normalizados.add(clave);

  // UI
  input.value = "";
  input.focus();
  limpiarResultado();
  renderLista();
}

function sortearAmigo() {
  if (amigos.length === 0) {
    ponerMensajeResultado("⚠️ No hay participantes para sortear.");
    return;
  }
  const indice = Math.floor(Math.random() * amigos.length);
  const elegido = amigos[indice];

  const res = $("resultado");
  if (!res) return;
  res.innerHTML = "";
  const li = document.createElement("li");
  li.innerHTML = `🎁 El amigo secreto es: <strong>${elegido}</strong>`;
  res.appendChild(li);
}


// Eliminar un nombre específico

function eliminarAmigo(index) {
  const nombre = amigos[index];
  if (typeof nombre === "undefined") return;
  amigos.splice(index, 1);
  normalizados.delete(normalizaNombre(nombre));
  renderLista();
  limpiarResultado();
}


// Limpiar lista completa

function limpiarLista() {
  amigos.length = 0;
  normalizados.clear();
  renderLista();
  ponerMensajeResultado("Lista vaciada 🧹");
}


//  emparejar a todos 

function sortearParejas() {
  const n = amigos.length;
  if (n < 2) {
    ponerMensajeResultado("⚠️ Se requieren al menos 2 participantes para emparejar.");
    return;
  }

  // Copia de índices [0..n-1]
  const idx = Array.from({ length: n }, (_, i) => i);

  
  for (let i = n - 1; i > 0; i--) {
    
    const j = Math.floor(Math.random() * i);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }

  
  const receptores = idx.map(k => amigos[k]);

  
  for (let i = 0; i < n; i++) {
    if (amigos[i] === receptores[i]) {
      
      return sortearParejas();
    }
  }

  // Render del resultado
  const res = $("resultado");
  if (!res) return;

  const items = amigos
    .map((dador, i) => `<li>${dador} → <strong>${receptores[i]}</strong></li>`)
    .join("");

  res.innerHTML = items;
}


 Enter para agregar

document.addEventListener("DOMContentLoaded", () => {
  const input = $("amigo");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") agregarAmigo();
    });
  }
});

// Exponer en el ámbito global 
window.agregarAmigo = agregarAmigo;
window.sortearAmigo = sortearAmigo;
window.eliminarAmigo = eliminarAmigo;
window.limpiarLista = limpiarLista;
window.sortearParejas = sortearParejas;
