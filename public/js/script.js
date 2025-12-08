(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


// light and dark mode toggle js
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("themeToggle");

  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
      if (toggleBtn) {
        toggleBtn.innerHTML = '<i class="fa-regular fa-sun"></i>';
      }
    } else {
      document.body.classList.remove("dark-mode");
      if (toggleBtn) {
        toggleBtn.innerHTML = '<i class="fa-regular fa-moon"></i>';
      }
    }
    localStorage.setItem("theme", theme);
  }

  // Load saved theme or system preference
  let savedTheme = localStorage.getItem("theme");
  if (!savedTheme) {
    const prefersDark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    savedTheme = prefersDark ? "dark" : "light";
  }
  applyTheme(savedTheme);

  // Toggle on click
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark-mode");
      applyTheme(isDark ? "light" : "dark");
    });
  }
});
