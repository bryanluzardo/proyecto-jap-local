import { HouseIcon } from "../../img/HouseIcon.js";
import { ColorModeIcon } from "../../img/ColorModeIcon.js";
import { ProfileIcon } from "../../img/ProfileIcon.js";

export function Nav() {
  const currentTheme = localStorage.getItem("theme");
  const color = currentTheme === "dark" ? "#fff" : "#000";

  return /* html */ `
    <nav class="site-nav">
      <div class="nav-inner">
        <div class="nav-group" id="nav-left">
          <a class="nav-link" href="#/index">${HouseIcon({ color })}</a>
          <li class="nav-item cart-icon" aria-label="Carrito"> </li>
          <button id="toggle-theme" class="btn-link" aria-pressed="${
            currentTheme === "dark" ? "true" : "false"
          }">
            ${ColorModeIcon({ currentTheme })}
          </button>
        </div>
        <div class="nav-group" id="nav-right">
          <a class="nav-link" style="color: var(--icon-color);" href="#/categories">Categorías</a>
          <a class="nav-link" style="color: var(--icon-color);" href="#/sell">Vender</a>
          <a class="nav-link" href="#/my-profile">${ProfileIcon()}</a>
          <a class="nav-link" id="usuarioIcon" href="#/my-profile" aria-label="Perfil">
            <img class="navbar-icon" src="https://avatar.iran.liara.run/public" alt="Foto de perfil" />
          </a>
          <button id="cerrar-sesion" class="btn-link" style="color: var(--icon-color);">Cerrar sesión</button>
        </div>
      </div>
    </nav>
  `;
}
