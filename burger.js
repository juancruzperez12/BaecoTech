(function () {
  var menu = document.getElementById("hamburger-menu");
  if (!menu) return;
  menu.addEventListener("click", function () {
    var nav = document.querySelector(".top-nav");
    if (nav) nav.classList.toggle("show");
    document.querySelectorAll(".nav-dropdown--mobile-open").forEach(function (el) {
      el.classList.remove("nav-dropdown--mobile-open");
    });
  });
})();
