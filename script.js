/* ============================================================
ODC ALDO — Universidad de Cundinamarca
Archivo: script.js
Descripción: Lógica de navegación, actividades y evaluación
Versión: 1.0 | 2025
   ============================================================ */

/* ════════════════════════════════════════════════════════════
1. NAVEGACIÓN ENTRE PANTALLAS
   ════════════════════════════════════════════════════════════ */

const PANTALLAS = [
  "p0",
  "p1",
  "p-prisma",
  "p2",
  "p3",
  "p4",
  "p5",
  "p6",
  "p7",
  "p8",
  "p9",
  "p10",
  "p11",
];
let pantallaActual = 0;

/**
 * Navega a la pantalla indicada por índice.
 * @param {number} n - Índice de la pantalla destino
 */
function irA(n) {
  // if (n > 8) {
  //   mostrarConstruccion();
  //   return;
  // }
  detenerVideoModulo(pantallaActual);
  document.getElementById(PANTALLAS[pantallaActual]).classList.remove("activa");
  pantallaActual = n;
  document.getElementById(PANTALLAS[n]).classList.add("activa");
  window.scrollTo({ top: 0, behavior: "smooth" });
  cerrarMenu();
  reproducirVideoModulo(n);
}


let videoTimer = null;

function reproducirVideoModulo(n) {
  const videos = { 0: "video-portada", 1: "video-p1", 3: "video-m1", 4: "video-m2", 5: "video-m3", 6: "video-m4", 7: "video-m5", 8: "video-m6", 9: "video-p8", 10: "video-p9" };
  if (!videos[n]) return;
  const video = document.getElementById(videos[n]);
  if (!video) return;
  videoTimer = setTimeout(() => {
    video.play().catch(() => { });
  }, 1500);
}

function irACita(refId) {
  irA(11);
  setTimeout(() => {
    const el = document.getElementById(refId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("ref-highlight");
    setTimeout(() => el.classList.remove("ref-highlight"), 2500);
  }, 600);
}

function detenerVideoModulo(n) {
  clearTimeout(videoTimer);
  videoTimer = null;
  const videos = { 0: "video-portada", 1: "video-p1", 3: "video-m1", 4: "video-m2", 5: "video-m3", 6: "video-m4", 7: "video-m5", 8: "video-m6", 9: "video-p8", 10: "video-p9" };
  if (videos[n]) {
    const video = document.getElementById(videos[n]);
    if (video) { video.pause(); video.currentTime = 0; }
  }
  // Detener iframe de YouTube si existe en la pantalla actual
  const pantalla = document.getElementById(PANTALLAS[n]);
  if (pantalla) {
    const iframe = pantalla.querySelector("iframe.yt-frame");
    if (iframe) { iframe.src = iframe.src; }
  }
}

document.addEventListener("DOMContentLoaded", () => reproducirVideoModulo(0));

function mostrarConstruccion() {
  cerrarMenu();
  document.getElementById("modalConstruccion").classList.add("abierto");
}

function cerrarConstruccion() {
  document.getElementById("modalConstruccion").classList.remove("abierto");
}

/* ════════════════════════════════════════════════════════════
  2. MENÚ DE NAVEGACIÓN
  ════════════════════════════════════════════════════════════ */

function abrirMenu() {
  document.getElementById("menuOverlay").classList.add("abierto");
}

function cerrarMenu() {
  document.getElementById("menuOverlay").classList.remove("abierto");
}

// Cerrar menú al hacer clic fuera del panel
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("menuOverlay")
    .addEventListener("click", function (e) {
      if (e.target === this) cerrarMenu();
    });

  iniciarDragOrden();
});

/* ════════════════════════════════════════════════════════════
3. ACTIVIDAD — VERDADERO O FALSO
   ════════════════════════════════════════════════════════════ */

/**
 * Verifica la respuesta de una pregunta Verdadero/Falso.
 * @param {string} id        - ID del contenedor de la pregunta
 * @param {string} respuesta - Respuesta seleccionada ('V' o 'F')
 * @param {string} correcta  - Respuesta correcta ('V' o 'F')
 */
function verificarVF(id, respuesta, correcta) {
  const retro = document.getElementById("retro-" + id);
  const btns = document.querySelectorAll("#" + id + " .btn-opcion");

  btns.forEach((b) => (b.disabled = true));
  retro.classList.add("visible");

  const esCorrecta = respuesta === correcta;
  retro.className = "retro visible " + (esCorrecta ? "ok" : "mal");

  // Retroalimentación específica por pregunta
  const mensajes = {
    "vf-m1-q1": {
      ok: "✓ Correcto. Según SPADIES 2023, la deserción acumulada es del 24,15% — equivalente a 1 de cada 4 estudiantes.",
      mal: "✗ Incorrecto. La deserción acumulada sí es del 24,15% según SPADIES 2023. Efectivamente, 1 de cada 4 estudiantes no culmina sus estudios.",
    },
    "vf-m1-q2": {
      ok: "✓ Correcto. Los programas virtuales en zonas rurales presentan tasas significativamente más altas (Aparicio-Gómez et al., 2021).",
      mal: "✗ Incorrecto. La deserción NO afecta por igual: la modalidad virtual rural amplifica el riesgo por conectividad limitada y aislamiento geográfico.",
    },
  };

  retro.textContent = mensajes[id]
    ? esCorrecta
      ? mensajes[id].ok
      : mensajes[id].mal
    : esCorrecta
      ? "✓ Respuesta correcta."
      : "✗ Respuesta incorrecta. Revisa el contenido.";
}

/* ════════════════════════════════════════════════════════════
  4. ACTIVIDAD — SELECCIÓN MÚLTIPLE (módulos)
  ════════════════════════════════════════════════════════════ */

// Almacena la opción seleccionada por grupo
const selecciones = {};

/**
 * Registra la opción seleccionada visualmente.
 * @param {string} grupo - Identificador del grupo de opciones
 * @param {Element} elem - Elemento li seleccionado
 * @param {string} letra - Letra de la opción ('a','b','c','d')
 */
function seleccionarOpcion(grupo, elem, letra) {
  const selector =
    "#opciones-" + grupo + " .opcion-item, #" + grupo + "-opts .opcion-item";
  document
    .querySelectorAll(selector)
    .forEach((i) => i.classList.remove("seleccionada"));
  elem.classList.add("seleccionada");
  selecciones[grupo] = letra;
}

/**
 * Verifica la respuesta de una pregunta de selección múltiple.
 * @param {string} grupo    - Identificador del grupo
 * @param {string} correcta - Letra de la opción correcta
 * @param {string} retroOk  - Texto de retroalimentación si es correcto
 * @param {string} retroMal - Texto de retroalimentación si es incorrecto
 */
function verificarSM(grupo, correcta, retroOk, retroMal) {
  const sel = selecciones[grupo];
  if (!sel) return;

  const retro = document.getElementById("retro-" + grupo);
  const selector =
    "#opciones-" + grupo + " .opcion-item, #" + grupo + "-opts .opcion-item";
  const items = document.querySelectorAll(selector);

  items.forEach((i) => {
    i.style.pointerEvents = "none";
    const letra = i.querySelector(".opcion-letra").textContent.toLowerCase();
    if (letra === correcta) i.classList.add("correcto");
    else if (letra === sel && sel !== correcta) i.classList.add("incorrecto");
  });

  retro.classList.add("visible");
  const esCorrecta = sel === correcta;
  retro.className = "retro visible " + (esCorrecta ? "ok" : "mal");
  retro.textContent = esCorrecta ? "✓ " + retroOk : "✗ " + retroMal;
}

/* ════════════════════════════════════════════════════════════
  4b. ACTIVIDAD — SELECCIÓN MÚLTIPLE (varias respuestas correctas)
  ════════════════════════════════════════════════════════════ */

const seleccionesMulti = {};

function toggleOpcionMulti(grupo, elem, letra) {
  if (!seleccionesMulti[grupo]) seleccionesMulti[grupo] = new Set();
  if (elem.classList.contains("seleccionada")) {
    elem.classList.remove("seleccionada");
    seleccionesMulti[grupo].delete(letra);
  } else {
    elem.classList.add("seleccionada");
    seleccionesMulti[grupo].add(letra);
  }
}

function verificarMulti(grupo, correctas, retroOk, retroMal) {
  const sel = seleccionesMulti[grupo];
  if (!sel || sel.size === 0) return;

  const retro = document.getElementById("retro-" + grupo);
  const items = document.querySelectorAll("#opciones-" + grupo + " .opcion-item");
  const correctasSet = new Set(correctas);

  let esCorrecta = sel.size === correctasSet.size;
  if (esCorrecta) {
    for (const c of correctasSet) {
      if (!sel.has(c)) { esCorrecta = false; break; }
    }
  }

  items.forEach((i) => {
    i.style.pointerEvents = "none";
    const letra = i.querySelector(".opcion-letra").textContent.toLowerCase();
    if (correctasSet.has(letra)) i.classList.add("correcto");
    else if (sel.has(letra)) i.classList.add("incorrecto");
  });

  retro.classList.add("visible");
  retro.className = "retro visible " + (esCorrecta ? "ok" : "mal");
  retro.textContent = esCorrecta ? "✓ " + retroOk : "✗ " + retroMal;
}

/* ════════════════════════════════════════════════════════════
  5. ACTIVIDAD — COMPLETAR LA FRASE (Módulo 5)
  ════════════════════════════════════════════════════════════ */

let completarSel = null;

/**
 * Selecciona una opción para completar la frase.
 * @param {Element} btn - Botón seleccionado
 * @param {string}  val - Valor de la opción
 */
function seleccionarCompletar(btn, val) {
  document
    .querySelectorAll(".btn-completar")
    .forEach((b) => b.classList.remove("seleccionado"));
  btn.classList.add("seleccionado");
  completarSel = val;
  document.getElementById("blank-m5").textContent = val;
}

/**
 * Verifica la respuesta de completar la frase.
 * @param {string} correcta - Valor correcto
 * @param {string} retroOk  - Retroalimentación si es correcto
 * @param {string} retroMal - Retroalimentación si es incorrecto
 */
function verificarCompletar(correcta, retroOk, retroMal) {
  if (!completarSel) return;

  const retro = document.getElementById("retro-m5");
  retro.classList.add("visible");

  const esCorrecta = completarSel === correcta;
  retro.className = "retro visible " + (esCorrecta ? "ok" : "mal");
  retro.textContent = esCorrecta ? "✓ " + retroOk : "✗ " + retroMal;

  document
    .querySelectorAll(".btn-completar")
    .forEach((b) => (b.disabled = true));
}

/* ════════════════════════════════════════════════════════════
  6. ACTIVIDAD — DRAG & DROP ORDENAR (Módulo 2)
  ════════════════════════════════════════════════════════════ */

/**
 * Inicializa el drag and drop de la lista de orden del Módulo 2.
 */
function iniciarDragOrden() {
  const lista = document.getElementById("drag-lista");
  if (!lista) return;

  let dragSrc = null;

  lista.querySelectorAll(".drag-item").forEach((item) => {
    item.addEventListener("dragstart", () => {
      dragSrc = item;
      item.classList.add("dragging");
    });
    item.addEventListener("dragend", () => item.classList.remove("dragging"));
    item.addEventListener("dragover", (e) => e.preventDefault());
    item.addEventListener("drop", (e) => {
      e.preventDefault();
      if (dragSrc !== item) {
        const items = [...lista.querySelectorAll(".drag-item")];
        const srcIdx = items.indexOf(dragSrc);
        const tgtIdx = items.indexOf(item);
        if (srcIdx < tgtIdx) lista.insertBefore(dragSrc, item.nextSibling);
        else lista.insertBefore(dragSrc, item);
      }
    });
  });
}

/**
 * Verifica el orden de los factores de riesgo (Módulo 2).
 * Orden correcto: bajo rendimiento → virtual rural → estrato bajo → psicosocial
 */
function verificarOrden() {
  const items = [...document.querySelectorAll("#drag-lista .drag-item")];
  const orden = items.map((i) => i.dataset.id);
  const correcto = ["4", "3", "2", "1"];

  const retro = document.getElementById("retro-orden");
  retro.classList.add("visible");

  if (JSON.stringify(orden) === JSON.stringify(correcto)) {
    retro.className = "retro visible ok";
    retro.textContent =
      "✓ Orden correcto. Bajo rendimiento en primer semestre es el mayor predictor (Acero et al., 2019), seguido de modalidad virtual rural, estrato bajo y factores psicosociales.";
  } else {
    retro.className = "retro visible mal";
    retro.textContent =
      "✗ No exactamente. El orden correcto según la evidencia es: 1° Bajo rendimiento primer semestre, 2° Modalidad virtual en zona rural, 3° Estrato socioeconómico bajo, 4° Factores psicosociales.";
  }
}

/* ════════════════════════════════════════════════════════════
  7. ACTIVIDAD — DRAG & DROP CLASIFICAR (Módulo 3)
  ════════════════════════════════════════════════════════════ */

let dragFact = null;

function dragFactor(e) {
  dragFact = e.target;
}

function allowDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.add("drag-over");
}

function dropFactor(e, cat) {
  e.preventDefault();
  e.currentTarget.classList.remove("drag-over");
  if (dragFact) {
    e.currentTarget.appendChild(dragFact);
    dragFact = null;
  }
}

// Remover clase drag-over al salir
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".drag-col").forEach((col) => {
    col.addEventListener("dragleave", () => col.classList.remove("drag-over"));
  });
});

/**
 * Verifica la clasificación de factores de riesgo (Módulo 3).
 */
function verificarFactores() {
  const resultados = { academico: [], socioeconomico: [], psicosocial: [] };

  ["academico", "socioeconomico", "psicosocial"].forEach((cat) => {
    document
      .querySelectorAll("#col-" + cat + " .drag-item")
      .forEach((i) => resultados[cat].push(i.dataset.cat));
  });

  const retro = document.getElementById("retro-factores");
  retro.classList.add("visible");

  const correcto =
    resultados.academico.every((c) => c === "academico") &&
    resultados.academico.length === 2 &&
    resultados.socioeconomico.every((c) => c === "socioeconomico") &&
    resultados.socioeconomico.length === 2 &&
    resultados.psicosocial.every((c) => c === "psicosocial") &&
    resultados.psicosocial.length === 2;

  if (correcto) {
    retro.className = "retro visible ok";
    retro.textContent =
      "✓ Clasificación correcta. Un modelo de IA efectivo necesita variables de las tres categorías para alcanzar alta precisión predictiva.";
  } else {
    retro.className = "retro visible mal";
    retro.textContent =
      "✗ Revisa la clasificación. Académico: nota parcial y asistencia. Socioeconómico: necesidad de trabajar y acceso a internet. Psicosocial: apoyo familiar y motivación.";
  }
}

/* ════════════════════════════════════════════════════════════
  8. EVALUACIÓN FINAL (8 preguntas)
  ════════════════════════════════════════════════════════════ */

let evalActual = 1;
let evalCorrectas = 0;

const evalProcesada = {};

function evalNavegar(num) {
  const currentBox = document.getElementById("eq" + evalActual);
  if (currentBox) currentBox.classList.remove("activa");
  const currentStep = document.getElementById("es" + evalActual);
  if (currentStep) currentStep.classList.remove("activo");

  evalActual = num;
  document.getElementById("eq" + evalActual).classList.add("activa");
  const targetStep = document.getElementById("es" + evalActual);
  if (targetStep && !targetStep.classList.contains("resuelto")) {
    targetStep.classList.add("activo");
  }
}

// Respuestas correctas de la evaluación
const EVAL_CORRECTAS = {
  1: "b",
  2: "c",
  3: "b",
  4: "b",
  5: "c",
  6: "b",
  7: "b",
  8: "c",
};

/**
 * Verifica una pregunta de la evaluación final.
 * @param {number} num      - Número de pregunta (1-8)
 * @param {string} correcta - Letra de la opción correcta
 * @param {string} retroOk  - Retroalimentación si es correcto
 * @param {string} retroMal - Retroalimentación si es incorrecto
 */
function evalVerificar(num, correcta, retroOk, retroMal) {
  const sel = selecciones["eq" + num];
  if (!sel) return;

  const retro = document.getElementById("retro-eq" + num);
  const items = document.querySelectorAll("#eq" + num + "-opts .opcion-item");

  // Marcar opciones correctas e incorrectas
  items.forEach((i) => {
    i.style.pointerEvents = "none";
    const letra = i.querySelector(".opcion-letra").textContent.toLowerCase();
    if (letra === correcta) i.classList.add("correcto");
    else if (letra === sel && sel !== correcta) i.classList.add("incorrecto");
  });

  // Mostrar retroalimentación
  retro.classList.add("visible");
  const esCorrecta = sel === correcta;
  retro.className = "retro visible " + (esCorrecta ? "ok" : "mal");
  retro.textContent = esCorrecta ? "✓ " + retroOk : "✗ " + retroMal;

  // Contar aciertos (solo una vez por pregunta)
  if (!evalProcesada[num]) {
    if (esCorrecta) evalCorrectas++;
    evalProcesada[num] = true;
  }

  // Deshabilitar el botón verificar
  document.querySelector("#eq" + num + " .btn-verificar").disabled = true;

  // Actualizar indicador de progreso
  const step = document.getElementById("es" + num);
  step.classList.remove("activo");
  step.classList.add("resuelto");
  step.textContent = esCorrecta ? "✓" : "✗";

  // Mostrar botones de navegación de la pregunta
  document.getElementById("eval-nav-" + num).style.display = "flex";
}

/**
 * Muestra el resultado final de la evaluación.
 */
function mostrarResultadoFinal() {
  const currentBox = document.getElementById("eq" + evalActual);
  if (currentBox) currentBox.classList.remove("activa");
  const currentStep = document.getElementById("es" + evalActual);
  if (currentStep) currentStep.classList.remove("activo");
  document.getElementById("eq-resultado").classList.add("activa");

  const score = document.getElementById("resultado-score");
  const msg = document.getElementById("resultado-msg");

  score.textContent = evalCorrectas + "/8";

  if (evalCorrectas >= 6) {
    score.className = "resultado-score aprobado";
    msg.textContent =
      "¡Felicitaciones! Lograste el objetivo de aprendizaje. Identificaste correctamente las técnicas de IA para detección temprana de deserción y los factores de riesgo clave según la evidencia científica.";
  } else {
    score.className = "resultado-score repaso";
    msg.textContent =
      "Necesitas repasar algunos módulos. El mínimo para aprobar es 6 de 8 preguntas. Puedes volver al índice y revisar los contenidos antes de continuar.";
  }
}

/* ════════════════════════════════════════════════════════════
  9. REPRODUCCIÓN DE AUDIO DEL AVATAR
  ════════════════════════════════════════════════════════════ */

/**
 * Reproduce o pausa el audio del avatar en la pantalla actual.
 * Los archivos de audio deben estar en la carpeta /audio/
 * con nombres: p0.mp3, p1.mp3, p2.mp3 ... p11.mp3
 *
 * INSTRUCCIONES PARA AGREGAR TU VOZ:
 * 1. Graba los audios siguiendo los guiones proporcionados
 * 2. Guárdalos en una carpeta llamada "audio" junto a este archivo
 * 3. Nombra cada archivo según la pantalla: p1.mp3, p2.mp3, etc.
 * 4. Los botones de reproducción funcionarán automáticamente
 */
let audioActual = null;

function reproducirAudio(pantalla) {
  // Detener audio previo si existe
  if (audioActual) {
    audioActual.pause();
    audioActual.currentTime = 0;
  }

  const src = "audio/" + pantalla + ".mp3";
  audioActual = new Audio(src);

  audioActual.play().catch(() => {
    console.info(
      "Audio no encontrado: " +
      src +
      ". Agrega tus grabaciones en la carpeta /audio/",
    );
  });
}


/* ════════════════════════════════════════════════════════════
   MODAL PREGUNTA DE INVESTIGACIÓN
   ════════════════════════════════════════════════════════════ */
function mostrarPregunta() {
  document.getElementById('preguntaModal').classList.add('activo');
}

function cerrarPregunta() {
  document.getElementById('preguntaModal').classList.remove('activo');
  detenerLectura();
}

function leerPregunta() {
  if (!('speechSynthesis' in window)) return;

  const btn = document.getElementById('btnLeer');

  // Si ya está leyendo, detener
  if (window.speechSynthesis.speaking) {
    detenerLectura();
    return;
  }

  const texto = document.getElementById('preguntaTexto').innerText;
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'es-CO';
  utterance.rate = 0.88;
  utterance.pitch = 1.05;

  // Preferir voz en español si está disponible
  const voces = window.speechSynthesis.getVoices();
  const vozES = voces.find(v => v.lang.startsWith('es')) || null;
  if (vozES) utterance.voice = vozES;

  utterance.onstart = () => {
    btn.textContent = '⏹ Detener';
    btn.classList.add('leyendo');
  };
  utterance.onend = utterance.onerror = () => {
    btn.textContent = '🔊 Escuchar';
    btn.classList.remove('leyendo');
  };

  window.speechSynthesis.speak(utterance);
}

function detenerLectura() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  const btn = document.getElementById('btnLeer');
  if (btn) {
    btn.textContent = '🔊 Escuchar';
    btn.classList.remove('leyendo');
  }
}

/* ════════════════════════════════════════════════════════════
   OCULTAR TOOLTIPS AL HACER SCROLL (móvil)
   ════════════════════════════════════════════════════════════ */
(function () {
  let scrollTimer = null;

  window.addEventListener('scroll', function () {
    document.body.classList.add('tooltips-ocultos');
    clearTimeout(scrollTimer);
  }, { passive: true });

  document.addEventListener('touchstart', function () {
    document.body.classList.remove('tooltips-ocultos');
  }, { passive: true });

  document.addEventListener('mousemove', function () {
    document.body.classList.remove('tooltips-ocultos');
  }, { passive: true });
}());



