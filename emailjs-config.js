// Configuración de EmailJS
(function () {
  // Inicializar EmailJS con tu User ID
  // Reemplaza 'TU_USER_ID' con tu User ID real de EmailJS
  emailjs.init("TU_USER_ID");
})();

// Función para enviar el formulario
function sendEmail(e) {
  e.preventDefault();

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
    nombre: document.querySelector('input[name="nombre"]').value,
    email: document.querySelector('input[name="email"]').value,
    asunto: document.querySelector('input[name="asunto"]').value,
    mensaje: document.querySelector('textarea[name="mensaje"]').value,
  };

  // Enviar email usando EmailJS
  // Reemplaza 'TU_SERVICE_ID' y 'TU_TEMPLATE_ID' con tus IDs reales
  emailjs
    .send("TU_SERVICE_ID", "TU_TEMPLATE_ID", formData)
    .then(function (response) {
      console.log("SUCCESS!", response.status, response.text);

      // Mostrar mensaje de éxito
      document.getElementById("successMessage").style.display = "block";

      // Limpiar formulario
      document.getElementById("contactForm").reset();

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
});
