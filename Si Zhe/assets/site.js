(function () {
  const themeKey = "guopop-clone-theme";
  const root = document.documentElement;
  const body = document.body;
  const page = body ? body.getAttribute("data-page") : "";

  const savedTheme = localStorage.getItem(themeKey);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const useDark = savedTheme ? savedTheme === "dark" : prefersDark;

  if (useDark) {
    root.classList.add("dark");
  }

  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = root.classList.toggle("dark");
      localStorage.setItem(themeKey, isDark ? "dark" : "light");
    });
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (page) {
    const navLinks = document.querySelectorAll("a[data-nav]");
    navLinks.forEach((link) => {
      if (link.getAttribute("data-nav") === page) {
        link.classList.add("active");
      }
    });
  }
})();
