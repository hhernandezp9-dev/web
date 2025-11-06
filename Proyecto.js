let alumno = { nombre: '', codigo: '' };


const LIMITE_PREGUNTAS = 15;
let operacionActual = '';
let num1 = 0, num2 = 0;
let preguntaCount = 0;
let puntuacion = 0;
let correctas = 0;
let incorrectas = 0;
let respuestaCorrecta = null;
let yaRespondida = false;


const loginScreen = document.getElementById('loginScreen');
const menuScreen = document.getElementById('menuScreen');
const gameScreen = document.getElementById('gameScreen');
const resultScreen = document.getElementById('resultScreen');

const inputNombre = document.getElementById('inputNombre');
const inputCodigo = document.getElementById('inputCodigo');
const btnIniciar = document.getElementById('btnIniciar');
const errorLogin = document.getElementById('errorLogin');

const saludo = document.getElementById('saludo');
const opButtons = document.querySelectorAll('.opBtn');
const btnCerrarSesion = document.getElementById('btnCerrarSesion');

const tituloOperacion = document.getElementById('tituloOperacion');
const alumnoNombreSpan = document.getElementById('alumnoNombre');
const alumnoCodigoSpan = document.getElementById('alumnoCodigo');
const numPreguntaSpan = document.getElementById('numPregunta');
const preguntaTexto = document.getElementById('pregunta');
const inputRespuesta = document.getElementById('respuesta');
const btnVerificar = document.getElementById('verificar');
const btnSiguiente = document.getElementById('siguiente');
const feedback = document.getElementById('feedback');
const puntuacionSpan = document.getElementById('puntuacion');
const correctasSpan = document.getElementById('correctas');
const incorrectasSpan = document.getElementById('incorrectas');

const resumenAlumno = document.getElementById('resumenAlumno');
const resumenResultado = document.getElementById('resumenResultado');
const btnReiniciar = document.getElementById('btnReiniciar');
const btnVolverMenu = document.getElementById('btnVolverMenu');


function mostrarPantalla(pantalla) {

  [loginScreen, menuScreen, gameScreen, resultScreen].forEach(el => el.classList.add('oculto'));
  pantalla.classList.remove('oculto');
}


btnIniciar.addEventListener('click', () => {
  const nombre = inputNombre.value.trim();
  const codigo = inputCodigo.value.trim();
  if (!nombre || !codigo) {
    errorLogin.textContent = 'Por favor ingresa nombre y código';
    errorLogin.classList.remove('oculto');
    return;
  }
  errorLogin.classList.add('oculto');
  alumno.nombre = nombre;
  alumno.codigo = codigo;

  saludo.textContent = `¡Hola, ${alumno.nombre}!`;
  mostrarPantalla(menuScreen);
});

btnCerrarSesion.addEventListener('click', () => {

  alumno = { nombre: '', codigo: '' };
  inputNombre.value = '';
  inputCodigo.value = '';
  mostrarPantalla(loginScreen);
});


opButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    operacionActual = btn.dataset.op;
    iniciarJuego();
  });
});

function iniciarJuego() {

  preguntaCount = 0;
  puntuacion = 0;
  correctas = 0;
  incorrectas = 0;
  respuestaCorrecta = null;
  yaRespondida = false;

  tituloOperacion.textContent = `Practicando: ${operacionActual}`;
  alumnoNombreSpan.textContent = alumno.nombre;
  alumnoCodigoSpan.textContent = alumno.codigo;
  actualizarPuntuaciones();
  mostrarPantalla(gameScreen);
  nuevaPregunta();
}

function nuevaPregunta() {
  if (preguntaCount >= LIMITE_PREGUNTAS) {
    finalizarJuego();
    return;
  }
  preguntaCount++;
  numPreguntaSpan.textContent = preguntaCount;

  const max = 12;
  num1 = Math.floor(Math.random() * max) + 1;
  num2 = Math.floor(Math.random() * max) + 1;

  switch (operacionActual) {
    case 'suma':
      preguntaTexto.textContent = `¿Cuánto es ${num1} + ${num2}?`;
      respuestaCorrecta = num1 + num2;
      break;
    case 'resta':
 
      if (num2 > num1) [num1, num2] = [num2, num1];
      preguntaTexto.textContent = `¿Cuánto es ${num1} - ${num2}?`;
      respuestaCorrecta = num1 - num2;
      break;
    case 'multiplicacion':
      preguntaTexto.textContent = `¿Cuánto es ${num1} × ${num2}?`;
      respuestaCorrecta = num1 * num2;
      break;
    case 'division':
      respuestaCorrecta = num1; 
      const producto = num1 * num2;
      preguntaTexto.textContent = `¿Cuánto es ${producto} ÷ ${num2}?`;
      respuestaCorrecta = producto / num2; 
      break;
  }
  
  inputRespuesta.value = '';
  feedback.textContent = '';
  yaRespondida = false;
  btnVerificar.disabled = false;
}

btnVerificar.addEventListener('click', () => {
  const val = inputRespuesta.value.trim();
  if (val === '') {
    feedback.textContent = 'Por favor escribe una respuesta';
    feedback.classList.add('error');
    return;
  }

  if (yaRespondida) return; 

  const respNum = Number(val);
  if (Number.isNaN(respNum)) {
    feedback.textContent = 'Respuesta no válida';
    feedback.classList.add('error');
    return;
  }

  if (Math.abs(respNum - respuestaCorrecta) < 1e-9) {
    feedback.textContent = '¡Correcto! 🎉';
    feedback.classList.remove('error');
    correctas++;
    puntuacion++;
  } else {
    feedback.textContent = `Incorrecto. La respuesta correcta es ${respuestaCorrecta}`;
    feedback.classList.add('error');
    incorrectas++;
  }

  yaRespondida = true;
  btnVerificar.disabled = true;
  actualizarPuntuaciones();
});


btnSiguiente.addEventListener('click', () => {
  if (!yaRespondida) {
    feedback.textContent = 'Primero verifica tu respuesta antes de continuar';
    feedback.classList.add('error');
    return;
  }
  if (preguntaCount >= LIMITE_PREGUNTAS) {
    finalizarJuego();
    return;
  }
  nuevaPregunta();
});

function actualizarPuntuaciones() {
  puntuacionSpan.textContent = puntuacion;
  correctasSpan.textContent = correctas;
  incorrectasSpan.textContent = incorrectas;
}


function finalizarJuego() {
  resumenAlumno.textContent = `Alumno: ${alumno.nombre} — Código: ${alumno.codigo}`;
  resumenResultado.innerHTML = `Aciertos: ${correctas} <br> Errores: ${incorrectas} <br> Puntuación final: ${puntuacion} / ${LIMITE_PREGUNTAS}`;
  
  
  guardarPuntaje(alumno.nombre, alumno.codigo, puntuacion, operacionActual);
  
  mostrarPantalla(resultScreen);
}


function mostrarResultados() {
  document.getElementById('resumenPuntaje').textContent = 
    `Respondiste ${correctas} correctamente y ${incorrectas} incorrectamente.`;

 
  guardarEnBaseDeDatos(alumno.nombre, alumno.codigo, correctas);

  mostrarPantalla(resultScreen);
}


btnReiniciar.addEventListener('click', () => {
  preguntaCount = 0;
  puntuacion = 0;
  correctas = 0;
  incorrectas = 0;
  respuestaCorrecta = null;
  yaRespondida = false;
  actualizarPuntuaciones();
  mostrarPantalla(gameScreen);
  nuevaPregunta();
});

btnVolverMenu.addEventListener('click', () => {
  mostrarPantalla(menuScreen);
});

const btnVolverMenuJuego = document.getElementById('btnVolverMenuJuego');

btnVolverMenuJuego.addEventListener('click', () => {
  mostrarPantalla(menuScreen);
});


mostrarPantalla(loginScreen);

inputNombre.addEventListener('keydown', (e) => { if (e.key === 'Enter') inputCodigo.focus(); });
inputCodigo.addEventListener('keydown', (e) => { if (e.key === 'Enter') btnIniciar.click(); });
inputRespuesta.addEventListener('keydown', (e) => { if (e.key === 'Enter') btnVerificar.click(); });


function guardarPuntaje(nombre, codigo, puntaje, tipoJuego) {
  const datos = new FormData();
  datos.append('nombre', nombre);
  datos.append('codigo', codigo);
  datos.append('puntaje', puntaje);
  datos.append('tipo_juego', tipoJuego);

  fetch('guardar_puntaje.php', {
    method: 'POST',
    body: datos
  })
  .then(response => response.text())
  .then(data => {
    console.log('Respuesta del servidor:', data);

    alert('✅ Puntaje guardado: ' + data);
  })
  .catch(error => {
    console.error('Error al guardar puntaje:', error);
  });
}
