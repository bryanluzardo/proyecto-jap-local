import { LoadingFunction } from "./utils.js";
import { Loading } from "./Componentes/Loading.js";

const loginForm = document.getElementById("login-form");
const password = document.getElementById("password");
const alertElement = document.querySelector(".alert");
const togglePassword = document.getElementById("togglePassword");
const btnLogin = document.getElementById("btn-login");

function showAlert(msg) {
  if (!alertElement) {
    alert(msg);
    return;
  }
  alertElement.textContent = msg;
  alertElement.classList.remove("hidden");
  alertElement.classList.add("animando");
  alertElement.addEventListener(
    "animationend",
    () => {
      alertElement.classList.add("hidden");
      alertElement.classList.remove("animando");
    },
    { once: true }
  );
}

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const user = document.getElementById("username").value.trim();
    const pass = password.value.trim();
    if (user === "" || pass === "") {
      showAlert("Por favor completa los campos.");
      return;
    }
    const body = {
      user_name: user,
      user_password: pass,
    };
    try {
      if (btnLogin) {
        btnLogin.innerHTML = Loading();
        const svgGroup = document.querySelector("#gooey");
        if (svgGroup) LoadingFunction(svgGroup);
      }
      const res = await fetch("http://localhost:9000/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.status === "ok") {
        if (data.token) {
          localStorage.setItem("token", data.token);
          try {
            const pl = JSON.parse(atob(data.token.split(".")[1]));
            if (pl && pl.id) localStorage.setItem("user_id", pl.id);
          } catch (err) {}
        }
        localStorage.setItem("x", "0");
        window.location.href = "/";
        window.location.hash = "#/index";
        return;
      }
      if (res.status === 401) {
        if (btnLogin) btnLogin.innerText = "Iniciar sesión";
        showAlert(data.message || "Credenciales inválidas");
        return;
      }
      if (res.status === 400) {
        if (btnLogin) btnLogin.innerText = "Iniciar sesión";
        showAlert(data.message || "Petición inválida");
        return;
      }
      console.error("Login error:", res.status, data);
      showAlert(
        "Ocurrió un error al iniciar sesión. Intentá de nuevo más tarde."
      );
    } catch (err) {
      console.error("Network or unexpected error:", err);
      showAlert(
        "No se pudo conectar al servidor. Verificá que el backend esté corriendo."
      );
    }
  });
}

if (togglePassword && password) {
  togglePassword.addEventListener("click", function () {
    if (password.type === "password") {
      password.type = "text";
      togglePassword.classList.remove("fa-eye");
      togglePassword.classList.add("fa-eye-slash");
    } else {
      password.type = "password";
      togglePassword.classList.remove("fa-eye-slash");
      togglePassword.classList.add("fa-eye");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const from = params.get("from");
  if (from === "sign-up") {
    const url = new URL(window.location);
    url.searchParams.delete("from");
    history.replaceState(null, "", url.toString());
    const alertEl = document.querySelector(".alert");
    if (alertEl) {
      alertEl.textContent = "Cuenta creada! Iniciá sesión para continuar.";
      alertEl.classList.remove("hidden");
      alertEl.classList.add("animando");
      alertEl.addEventListener(
        "animationend",
        () => {
          alertEl.classList.add("hidden");
          alertEl.classList.remove("animando");
        },
        { once: true }
      );
    }
  }
});
