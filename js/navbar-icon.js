import { CartIcon, actualizarBadge } from "../img/Cart-icon.js";
import { decodeToken } from "./utils.js";

export function initNavbarIcon() {
  const token = localStorage.getItem("token");
  const payload = decodeToken(token);
  const id = payload.id;
  const savedPfp = localStorage.getItem(`porfilePicture-${id}`);
  if (savedPfp) {
    document.querySelectorAll(".navbar-icon").forEach((icon) => {
      icon.src = savedPfp;
    });
  }
  let count = 0;
  const items = JSON.parse(localStorage.getItem("cart"));
  items?.forEach((item) => (count += item.quantity));
  actualizarBadge(count);
  const cart = document.querySelector(".cart-icon");
  if (!cart) return;
  cart.innerHTML = CartIcon({ count });
  cart.style.cursor = "pointer";
  cart.addEventListener("click", () => (window.location.href = "#/cart"));
}
