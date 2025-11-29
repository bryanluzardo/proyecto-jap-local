import { CartIcon, actualizarBadge } from "../img/Cart-icon.js";

export function initNavbarIcon() {
  const savedPfp = localStorage.getItem("profilePicture");
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
