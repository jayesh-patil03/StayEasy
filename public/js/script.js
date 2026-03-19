(() => {
  "use strict";

  const initValidation = () => {
    const forms = document.querySelectorAll(".needs-validation");

    Array.from(forms).forEach((form) => {
      form.addEventListener(
        "submit",
        (event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add("was-validated");
        },
        false
      );
    });
  };

  const initThemeToggle = () => {
    const toggleBtn = document.getElementById("themeToggle");
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateIcon = (theme) => {
      if (!toggleBtn) return;

      const isDark = theme === "dark";
      toggleBtn.innerHTML = isDark
        ? '<i class="fa-regular fa-sun"></i>'
        : '<i class="fa-regular fa-moon"></i>';
      toggleBtn.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
      toggleBtn.setAttribute("aria-pressed", String(isDark));
    };

    const applyTheme = (theme, persist = true) => {
      document.body.classList.toggle("dark-mode", theme === "dark");
      updateIcon(theme);

      if (persist) {
        localStorage.setItem("theme", theme);
      }
    };

    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme || (mediaQuery.matches ? "dark" : "light");
    applyTheme(initialTheme, Boolean(savedTheme));

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
        applyTheme(nextTheme);
      });
    }

    mediaQuery.addEventListener("change", (event) => {
      if (!localStorage.getItem("theme")) {
        applyTheme(event.matches ? "dark" : "light", false);
      }
    });
  };

  const initPasswordToggles = () => {
    const buttons = document.querySelectorAll("[data-password-toggle]");

    buttons.forEach((button) => {
      const targetId = button.getAttribute("data-target");
      const input = targetId ? document.getElementById(targetId) : null;
      if (!input) return;

      button.addEventListener("click", () => {
        const shouldShow = input.type === "password";
        input.type = shouldShow ? "text" : "password";
        button.innerHTML = shouldShow
          ? '<i class="fa-regular fa-eye-slash me-2"></i>Hide'
          : '<i class="fa-regular fa-eye me-2"></i>Show';
        button.setAttribute("aria-pressed", String(shouldShow));
      });
    });
  };

  const initAlerts = () => {
    const alerts = document.querySelectorAll("[data-auto-dismiss]");

    const dismissAlert = (alert) => {
      if (!alert || alert.dataset.dismissed === "true") return;
      alert.dataset.dismissed = "true";
      alert.style.transition = "opacity 0.25s ease, transform 0.25s ease";
      alert.style.opacity = "0";
      alert.style.transform = "translateY(-6px)";
      window.setTimeout(() => alert.remove(), 260);
    };

    alerts.forEach((alert) => {
      const delay = Number(alert.getAttribute("data-auto-dismiss")) || 4500;
      const closeBtn = alert.querySelector(".alert-close");

      if (closeBtn) {
        closeBtn.addEventListener("click", () => dismissAlert(alert));
      }

      window.setTimeout(() => dismissAlert(alert), delay);
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    initValidation();
    initThemeToggle();
    initPasswordToggles();
    initAlerts();
  });
})();
