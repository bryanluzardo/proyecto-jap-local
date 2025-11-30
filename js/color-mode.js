document.addEventListener("click", (e) => {
  const btn = e.target.closest("#toggle-theme");
  if (!btn) return;
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  const darkIcon = btn.querySelector(".icon-dark");
  const lightIcon = btn.querySelector(".icon-light");
  if (darkIcon && lightIcon) {
    darkIcon.style.display = isDark ? "inline" : "none";
    lightIcon.style.display = isDark ? "none" : "inline";
  }
});

export function applySavedTheme() {
  const saved = localStorage.getItem("theme") || "light";
  const isDark = saved === "dark";
  if (isDark) document.body.classList.add("dark-mode");
  else document.body.classList.remove("dark-mode");
  const toggleBtn = document.querySelector("#toggle-theme");
  if (toggleBtn) {
    const darkIcon = toggleBtn.querySelector(".icon-dark");
    const lightIcon = toggleBtn.querySelector(".icon-light");
    if (darkIcon && lightIcon) {
      darkIcon.style.display = isDark ? "inline" : "none";
      lightIcon.style.display = isDark ? "none" : "inline";
    }
    toggleBtn.setAttribute("aria-pressed", isDark ? "true" : "false");
  }
}
