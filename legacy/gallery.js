document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const galleryContainer = document.getElementById("gallery-container");
  const indicatorContainer = document.getElementById("indicator-container");
  const slides = document.getElementById("gallery-slide");
  const largeImages = slides.querySelectorAll(".large-screen");
  const smallImages = slides.querySelectorAll(".small-screen");
  let totalSlides = largeImages.length;
  let slideIndex = 0;
  let slideInterval;

  const slideDuration = 12000;

  function adjustGalleryHeight() {
    const navbarHeight = navbar.offsetHeight;
    galleryContainer.style.height = `calc(100% - ${navbarHeight}px)`;
    galleryContainer.style.top = `${navbarHeight}px`;
  }

  function checkScreenSize() {
    if (window.innerWidth <= 768) {
      totalSlides = smallImages.length;
    } else {
      totalSlides = largeImages.length;
    }
  }

  // Crear indicadores
  function createIndicators() {
    indicatorContainer.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
      const indicator = document.createElement("div");
      indicator.classList.add("indicator");
      indicator.setAttribute("data-slide-to", i);
      if (i === slideIndex) {
        indicator.classList.add("active");
      }
      indicator.addEventListener("click", function () {
        slideIndex = parseInt(this.getAttribute("data-slide-to"));
        changeSlide(0);
      });
      indicatorContainer.appendChild(indicator);
    }
  }

  // Actualizar indicadores
  function updateIndicators() {
    const indicators = document.querySelectorAll(".indicator");
    indicators.forEach((indicator, index) => {
      if (index === slideIndex) {
        indicator.classList.add("active");
      } else {
        indicator.classList.remove("active");
      }
    });
  }

  // Cambiar imagen
  function changeSlide(n) {
    slideIndex += n;

    if (slideIndex >= totalSlides) {
      slideIndex = 0;
    }
    if (slideIndex < 0) {
      slideIndex = totalSlides - 1;
    }

    const offset = -slideIndex * 100;
    slides.style.transform = `translateX(${offset}%)`;
    updateIndicators();

    // Reiniciar el intervalo cuando se cambia manualmente
    clearInterval(slideInterval);
    slideInterval = setInterval(() => changeSlide(1), slideDuration);
  }

  // Inicializar la galería
  function initGallery() {
    adjustGalleryHeight();
    checkScreenSize();
    createIndicators();
    changeSlide(0);
    slideInterval = setInterval(() => changeSlide(1), slideDuration);
  }

  // Ajustar la altura de la galería al cambiar el tamaño de la ventana
  window.addEventListener("resize", () => {
    adjustGalleryHeight();
    checkScreenSize();
    createIndicators();
    changeSlide(0);
  });

  // Agregar eventos de clic a las flechas
  document
    .getElementById("prev")
    .addEventListener("click", () => changeSlide(-1));
  document
    .getElementById("next")
    .addEventListener("click", () => changeSlide(1));

  // Inicializar
  initGallery();
});
