import {
  validateUserName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateTerms,
} from "./validations.js";
import { Loading } from "./Componentes/Loading.js";
import { LoadingFunction } from "./utils.js";
const userName = document.getElementById("username");
const email = document.getElementById("mail");
const cellphone = document.getElementById("cellphone");
const password = document.getElementById("password");
const form = document.querySelector("#sign-up-form");
const btnLogin = document.getElementById("btn-login");
const userAdvertencia = document.querySelector(".advertencia-username");
const emailAdvertencia = document.querySelector(".advertencia-mail");
const telAdvertencia = document.querySelector(".advertencia-cellphone");
const passAdvertencia = document.querySelector(".advertencia-password");
const termsAdvertencia = document.querySelector(".advertencia-terminos");
const emailExistenteAdvertencia = document.querySelector(
  ".advertencia-mail-existe"
);
const usernameExistenteAdvertencia = document.querySelector(
  ".advertencia-username-existe"
);
const togglePassword = document.getElementById("togglePassword");
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

function clearAllWarnings() {
  [
    userAdvertencia,
    emailAdvertencia,
    telAdvertencia,
    passAdvertencia,
    termsAdvertencia,
    emailExistenteAdvertencia,
    usernameExistenteAdvertencia,
  ].forEach((el) => {
    if (el) el.classList.add("hidden");
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearAllWarnings();
  const body = {
    user_name: userName.value.trim(),
    mail: email.value.trim(),
    tel: cellphone.value.trim(),
    user_password: password.value.trim(),
  };
  if (!validacion(body)) {
    if (!validateUserName(body.user_name) && userAdvertencia)
      userAdvertencia.classList.remove("hidden");
    if (!validateEmail(body.mail) && emailAdvertencia)
      emailAdvertencia.classList.remove("hidden");
    if (!validatePhone(body.tel) && telAdvertencia)
      telAdvertencia.classList.remove("hidden");
    if (!validatePassword(body.user_password) && passAdvertencia)
      passAdvertencia.classList.remove("hidden");
    if (!validateTerms() && termsAdvertencia)
      termsAdvertencia.classList.remove("hidden");
    return;
  }
  try {
    btnLogin.innerHTML = Loading();
    const svgGroup = document.querySelector("#gooey");
    LoadingFunction(svgGroup);
    const res = await fetch("http://localhost:9000/sign-up", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.status === "ok") {
      window.location.href = "/login.html?from=sign-up";
      return;
    }
    if (data.status === "mail-existe" || data.message === "El mail ya existe") {
      if (emailExistenteAdvertencia)
        emailExistenteAdvertencia.classList.remove("hidden");
      return;
    }
    if (
      data.status === "username-existe" ||
      data.message === "El username ya existe"
    ) {
      if (usernameExistenteAdvertencia)
        usernameExistenteAdvertencia.classList.remove("hidden");
      return;
    }
    if (data.message && data.message.includes("constraint")) {
      alert("Ya existe un usuario con ese email o username.");
      return;
    }
    console.error("Sign-up error:", res.status, data);
    alert("Ocurrió un error al registrarte. Intentá de nuevo más tarde.");
  } catch (err) {
    console.error("Network or unexpected error:", err);
    alert(
      "No se pudo conectar al servidor. Verificá que el backend esté corriendo."
    );
  }
});

function validacion(body) {
  return (
    validateUserName(body.user_name) &&
    validateEmail(body.mail) &&
    validatePhone(body.tel) &&
    validatePassword(body.user_password) &&
    validateTerms()
  );
}
