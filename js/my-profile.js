import { decodeToken, getUserData } from "./utils.js";

const safeSetText = (el, text) => {
  if (el) el.textContent = text ?? "";
};
const safeSetHref = (el, href) => {
  if (el) el.href = href ?? "#";
};

export async function initProfileScript() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("login.html");
      return;
    }
    const payload = decodeToken(token);
    if (!payload || !payload.id) {
      localStorage.removeItem("token");
      window.location.replace("login.html");
      return;
    }
    const id = payload.id;
    let userData = {};
    try {
      userData = await getUserData(id);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
    const user_name =
      userData.user_name ?? userData.name ?? userData.userName ?? "";
    const mail = userData.mail ?? userData.email ?? userData.correo ?? "";
    const tel =
      userData.tel ?? userData.telefono ?? userData.telefono_contacto ?? "";
    const nombreUsuario = document.getElementById("nombre-usuario");
    const emailUsuario = document.getElementById("email-usuario");
    const telUsuario = document.getElementById("tel-usuario");
    const formUserName = document.querySelector("#nombre");
    const formEmail = document.querySelector("#email");
    const formTel = document.querySelector("#telefono");
    formUserName.value = user_name;
    formEmail.value = mail;
    formTel.value = tel;
    safeSetText(nombreUsuario, user_name);
    if (emailUsuario) {
      safeSetText(emailUsuario, mail);
      if (mail) safeSetHref(emailUsuario, `mailto:${mail}`);
    }
    safeSetText(telUsuario, tel || "+598");
    const showPopup = document.getElementById("ShowPopup");
    const popup = document.getElementById("popup");
    const popupClose = document.getElementById("popup-close");
    const form = document.querySelector("#popup form");
    const profilePicture = document.getElementById("profile-picture");
    const navbarIcons = document.querySelectorAll(".navbar-icon");
    const newPfp = document.getElementById("newPfp");
    const uploadPfp = document.getElementById("uploadPfp");
    const setNavbarIconsSrc = (src) => {
      if (!src) return;
      if (navbarIcons && navbarIcons.length) {
        navbarIcons.forEach((icon) => {
          try {
            icon.src = src;
          } catch (err) {}
        });
      }
    };
    const savedPfp = localStorage.getItem(`porfilePicture-${id}`);
    if (savedPfp) {
      if (profilePicture) profilePicture.src = savedPfp;
      setNavbarIconsSrc(savedPfp);
    }
    if (showPopup && popup) {
      showPopup.addEventListener("click", () => {
        popup.style.display = "flex";
      });
    }
    if (popupClose && popup) {
      popupClose.addEventListener("click", () => {
        popup.style.display = "none";
      });
    }
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && popup && popup.style.display === "flex") {
        popup.style.display = "none";
      }
    });
    if (popup) {
      popup.addEventListener("click", (ev) => {
        if (ev.target === popup) popup.style.display = "none";
      });
    }
    if (newPfp && profilePicture) {
      newPfp.addEventListener("change", () => {
        const file = newPfp.files && newPfp.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
          alert("El archivo seleccionado no es una imagen.");
          return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
          const data = ev.target.result;
          if (profilePicture) profilePicture.src = data;
          setNavbarIconsSrc(data);
          try {
            localStorage.setItem(`porfilePicture-${id}`, data);
          } catch (e) {
            console.error("No se pudo guardar la imagen en localStorage:", e);
            alert(
              "No se pudo guardar la foto (espacio insuficiente en localStorage)."
            );
          }
        };
        reader.onerror = (err) => {
          console.error("FileReader error:", err);
          alert("Error leyendo la imagen.");
        };
        reader.readAsDataURL(file);
      });
    }
    if (uploadPfp) {
      uploadPfp.addEventListener("click", (ev) => {
        ev.preventDefault();
        const file = newPfp && newPfp.files && newPfp.files[0];
        if (!file) {
          alert("Por favor elija una imagen primero.");
          return;
        }
        if (!file.type.startsWith("image/")) {
          alert("El archivo seleccionado no es una imagen.");
          return;
        }
        const saved = localStorage.getItem(`porfilePicture-${id}`);
        if (saved) {
          if (profilePicture) profilePicture.src = saved;
          setNavbarIconsSrc(saved);
          alert("¡Foto de perfil actualizada y persistida!");
        } else {
          alert(
            "No se encontró la imagen guardada. Intente seleccionar la imagen nuevamente."
          );
        }
      });
    }
    if (form) {
      form.addEventListener("submit", async (ev) => {
        ev.preventDefault();
        const nombre = form.querySelector("#nombre")?.value.trim() ?? "";
        const email = form.querySelector("#email")?.value ?? "";
        const telefono = form.querySelector("#telefono")?.value ?? "";
        const advertencia = document.querySelector(".advertencia-username");
        if (nombre !== user_name.trim()) {
          if (nombre.length < 5 || nombre.length > 16) {
            advertencia.classList.remove("hidden");
            return;
          }
        }
        advertencia.classList.add("hidden");
        safeSetText(nombreUsuario, nombre || user_name);
        safeSetText(emailUsuario, email || mail);
        if (email || mail) safeSetHref(emailUsuario, `mailto:${email || mail}`);
        safeSetText(telUsuario, telefono || tel);
        try {
          const res = await fetch(`http://localhost:9000/usuarios/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_name: nombre || user_name,
              mail: email || mail,
              tel: telefono || tel,
            }),
          });
          if (!res.ok) {
            alert("No se pudo actualizar en el servidor.");
            return;
          }
          alert("Perfil actualizado con éxito.");
          if (popup) popup.style.display = "none";
        } catch (err) {
          alert("Error de red al actualizar.");
        }
      });
    }
  } catch (err) {
    console.error("initProfileScript error:", err);
  }
  const deleteAcc = document.getElementById("DeleteAcc");
  const deletePopup = document.getElementById("deletePopup");
  const confirmarDelete = document.getElementById("confirmarDelete");
  if (deleteAcc && deletePopup) {
    deleteAcc.addEventListener("click", () => {
      deletePopup.style.display = "flex";
    });
  }
  if (deletePopup) {
    deletePopup.addEventListener("click", (ev) => {
      if (ev.target === deletePopup) {
        deletePopup.style.display = "none";
      }
    });
  }
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && deletePopup.style.display === "flex") {
      deletePopup.style.display = "none";
    }
  });
  if (confirmarDelete) {
    confirmarDelete.addEventListener("click", async () => {
      const token = localStorage.getItem("token");
      const payload = decodeToken(token);
      const id = payload?.id;
      if (!id) {
        alert("No se encontró el usuario.");
        return;
      }
      try {
        const res = await fetch(`http://localhost:9000/usuario/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const data = await res.json();
          alert("No se pudo eliminar la cuenta: " + (data.message || "Error"));
          return;
        }
        localStorage.removeItem("token");
        alert("Cuenta eliminada con éxito.");
        window.location.href = "login.html";
      } catch (err) {
        console.error("Error:", err);
        alert("Error de red. Intenta nuevamente.");
      }
    });
  }
}
