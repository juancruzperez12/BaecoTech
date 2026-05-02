(function () {
  function isMobileNav() {
    return window.matchMedia("(max-width: 767px)").matches;
  }

  document.querySelectorAll(".nav-dropdown-trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function (e) {
      if (!isMobileNav()) return;
      var li = this.closest(".nav-dropdown");
      if (!li) return;
      var open = li.classList.contains("nav-dropdown--mobile-open");
      if (!open) {
        e.preventDefault();
        document.querySelectorAll(".nav-dropdown--mobile-open").forEach(function (x) {
          if (x !== li) x.classList.remove("nav-dropdown--mobile-open");
        });
        li.classList.add("nav-dropdown--mobile-open");
      }
    });
  });

  document.querySelectorAll(".nav-dropdown-link").forEach(function (link) {
    link.addEventListener("click", function () {
      document.querySelectorAll(".nav-dropdown--mobile-open").forEach(function (x) {
        x.classList.remove("nav-dropdown--mobile-open");
      });
      var nav = document.querySelector(".top-nav");
      if (nav) nav.classList.remove("show");
    });
  });

  document.addEventListener("click", function (e) {
    if (!isMobileNav()) return;
    if (e.target.closest(".nav-dropdown")) return;
    document.querySelectorAll(".nav-dropdown--mobile-open").forEach(function (x) {
      x.classList.remove("nav-dropdown--mobile-open");
    });
  });

  document.querySelectorAll(".top-nav > .nav-item:not(.nav-dropdown) > a").forEach(function (link) {
    link.addEventListener("click", function () {
      var nav = document.querySelector(".top-nav");
      if (nav) nav.classList.remove("show");
    });
  });

  document.querySelectorAll(".top-nav > .nav-item > .navlist-contacto").forEach(function (link) {
    link.addEventListener("click", function () {
      var nav = document.querySelector(".top-nav");
      if (nav) nav.classList.remove("show");
    });
  });
})();
