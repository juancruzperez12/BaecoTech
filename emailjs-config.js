// Configuración de EmailJS
(function () {
  // Inicializar EmailJS con tu User ID
  emailjs.init("pORWEzBp4OPe4K78m");
})();

// Variables para control de seguridad
let lastSubmissionTime = 0;
const MIN_INTERVAL = 30000; // 30 segundos entre envíos
const MAX_DAILY_SUBMISSIONS = 10; // Máximo 10 envíos por día
const DAILY_RESET_TIME = 24 * 60 * 60 * 1000; // 24 horas en ms

// Función para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Función para validar contenido
function isValidContent(content) {
  // Rechazar contenido sospechoso
  const suspiciousPatterns = [
    /http[s]?:\/\//, // URLs
    /[A-Z]{10,}/, // Muchas mayúsculas
    /[!@#$%^&*()]{5,}/, // Muchos caracteres especiales
    /(spam|viagra|casino|loan)/i, // Palabras spam
  ];

  return !suspiciousPatterns.some((pattern) => pattern.test(content));
}

// Función para verificar rate limiting
function checkRateLimit() {
  const now = Date.now();

  // Verificar intervalo mínimo entre envíos
  if (now - lastSubmissionTime < MIN_INTERVAL) {
    return {
      allowed: false,
      message: `Por favor espera ${Math.ceil(
        (MIN_INTERVAL - (now - lastSubmissionTime)) / 1000
      )} segundos antes de enviar otro mensaje.`,
    };
  }

  // Verificar límite diario
  const dailySubmissions = localStorage.getItem("dailySubmissions");
  const lastReset = localStorage.getItem("lastReset");

  if (lastReset && now - parseInt(lastReset) > DAILY_RESET_TIME) {
    // Reset diario
    localStorage.setItem("dailySubmissions", "1");
    localStorage.setItem("lastReset", now.toString());
  } else if (
    dailySubmissions &&
    parseInt(dailySubmissions) >= MAX_DAILY_SUBMISSIONS
  ) {
    return {
      allowed: false,
      message: "Has alcanzado el límite diario de mensajes. Intenta mañana.",
    };
  } else {
    // Incrementar contador
    const currentCount = dailySubmissions ? parseInt(dailySubmissions) : 0;
    localStorage.setItem("dailySubmissions", (currentCount + 1).toString());
    if (!lastReset) {
      localStorage.setItem("lastReset", now.toString());
    }
  }

  return { allowed: true };
}

// Función para verificar reCAPTCHA
function verifyRecaptcha() {
  if (typeof grecaptcha === "undefined") {
    return { verified: false, message: "reCAPTCHA no está disponible." };
  }

  const response = grecaptcha.getResponse();
  if (!response) {
    return { verified: false, message: "Por favor completa el reCAPTCHA." };
  }

  return { verified: true, response: response };
}

// Función para enviar el formulario
function sendEmail(e) {
  e.preventDefault();

  // Verificar rate limiting
  const rateLimitCheck = checkRateLimit();
  if (!rateLimitCheck.allowed) {
    document.getElementById("errorMessage").style.display = "block";
    document.getElementById("errorMessage").querySelector("p").textContent =
      rateLimitCheck.message;
    setTimeout(() => {
      document.getElementById("errorMessage").style.display = "none";
    }, 5000);
    return;
  }

  // Obtener datos del formulario
  const nombre = document.querySelector('input[name="nombre"]').value.trim();
  const email = document.querySelector('input[name="email"]').value.trim();
  const asunto = document.querySelector('input[name="asunto"]').value.trim();
  const mensaje = document
    .querySelector('textarea[name="mensaje"]')
    .value.trim();

  // Validaciones adicionales
  if (!nombre || !email || !asunto || !mensaje) {
    document.getElementById("errorMessage").style.display = "block";
    document.getElementById("errorMessage").querySelector("p").textContent =
      "Todos los campos son obligatorios.";
    setTimeout(() => {
      document.getElementById("errorMessage").style.display = "none";
    }, 5000);
    return;
  }

  if (!isValidEmail(email)) {
    document.getElementById("errorMessage").style.display = "block";
    document.getElementById("errorMessage").querySelector("p").textContent =
      "Por favor ingresa un email válido.";
    setTimeout(() => {
      document.getElementById("errorMessage").style.display = "none";
    }, 5000);
    return;
  }

  if (!isValidContent(mensaje) || !isValidContent(asunto)) {
    document.getElementById("errorMessage").style.display = "block";
    document.getElementById("errorMessage").querySelector("p").textContent =
      "El contenido contiene elementos no permitidos.";
    setTimeout(() => {
      document.getElementById("errorMessage").style.display = "none";
    }, 5000);
    return;
  }

  // Verificar reCAPTCHA
  const recaptchaCheck = verifyRecaptcha();
  if (!recaptchaCheck.verified) {
    document.getElementById("errorMessage").style.display = "block";
    document.getElementById("errorMessage").querySelector("p").textContent =
      recaptchaCheck.message;
    setTimeout(() => {
      document.getElementById("errorMessage").style.display = "none";
    }, 5000);
    return;
  }

  // Mostrar indicador de carga
  const submitButton = document.querySelector(".submit-form");
  const originalText = submitButton.textContent;
  submitButton.textContent = "Enviando...";
  submitButton.disabled = true;

  // Ocultar mensajes anteriores
  document.getElementById("successMessage").style.display = "none";
  document.getElementById("errorMessage").style.display = "none";

  // Obtener los datos del formulario
  const formData = {
    // Campos que coinciden exactamente con tu plantilla de EmailJS
    name: nombre,
    title: asunto,
    message: `Email: ${email}\n\nMensaje:\n${mensaje}`,
    email: email,
    time: new Date().toLocaleString("es-ES"), // Agregamos la hora actual
  };

  // Debug: Mostrar los datos que se están enviando
  console.log("Datos del formulario:", formData);

  // Actualizar tiempo del último envío
  lastSubmissionTime = Date.now();

  // Enviar email usando EmailJS
  emailjs
    .send("service_7jznohp", "template_6te4zmu", formData)
    .then(function (response) {
      console.log("SUCCESS!", response.status, response.text);

      // Mostrar mensaje de éxito
      document.getElementById("successMessage").style.display = "block";

      // Limpiar formulario
      document.getElementById("contactForm").reset();

      // Resetear reCAPTCHA
      if (typeof grecaptcha !== "undefined") {
        grecaptcha.reset();
      }

      // Restaurar botón
      submitButton.textContent = originalText;
      submitButton.disabled = false;

      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        document.getElementById("successMessage").style.display = "none";
      }, 5000);
    })
    .catch(function (error) {
      console.log("FAILED...", error);

      // Mostrar mensaje de error
      document.getElementById("errorMessage").style.display = "block";

      // Resetear reCAPTCHA
      if (typeof grecaptcha !== "undefined") {
        grecaptcha.reset();
      }

      // Restaurar botón
      submitButton.textContent = originalText;
      submitButton.disabled = false;

      // Ocultar mensaje de error después de 5 segundos
      setTimeout(() => {
        document.getElementById("errorMessage").style.display = "none";
      }, 5000);
    });
}

// Agregar event listener al formulario cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", sendEmail);
  }
  
  // Verificar si reCAPTCHA se carga correctamente
  window.addEventListener("load", function() {
    setTimeout(function() {
      if (typeof grecaptcha === "undefined") {
        console.error("reCAPTCHA no se cargó. Verifica que el dominio esté autorizado en Google reCAPTCHA Admin.");
      } else {
        console.log("reCAPTCHA cargado correctamente");
      }
    }, 2000);
  });
});
