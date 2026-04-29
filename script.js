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
  if (n > 6) {
    mostrarConstruccion();
    return;
  }
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
  const videos = { 0: "video-portada", 1: "video-p1", 2: "video-m1", 3: "video-m2", 4: "video-m3", 5: "video-m4", 6: "video-m5", 7: "video-m6", 8: "video-p8", 9: "video-p9" };
  if (!videos[n]) return;
  const video = document.getElementById(videos[n]);
  if (!video) return;
  videoTimer = setTimeout(() => {
    video.play().catch(() => { });
  }, 1500);
}

function irACita(refId) {
  irA(10);
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
  const videos = { 0: "video-portada", 1: "video-p1", 2: "video-m1", 3: "video-m2", 4: "video-m3", 5: "video-m4", 6: "video-m5", 7: "video-m6", 8: "video-p8", 9: "video-p9" };
  if (!videos[n]) return;
  const video = document.getElementById(videos[n]);
  if (!video) return;
  video.pause();
  video.currentTime = 0;
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

// Registro de si ya se procesó cada pregunta (evita doble conteo)
const evalProcesada = {};

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

  // Avanzar a la siguiente pregunta después de 2 segundos
  setTimeout(() => {
    document.getElementById("eq" + num).classList.remove("activa");

    if (num < 8) {
      evalActual = num + 1;
      document.getElementById("eq" + evalActual).classList.add("activa");
      document.getElementById("es" + evalActual).classList.add("activo");
    } else {
      mostrarResultadoFinal();
    }
  }, 2000);
}

/**
 * Muestra el resultado final de la evaluación.
 */
function mostrarResultadoFinal() {
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
    // Si no encuentra el archivo, mostrar mensaje informativo
    console.info(
      "Audio no encontrado: " +
      src +
      ". Agrega tus grabaciones en la carpeta /audio/",
    );
  });
}

