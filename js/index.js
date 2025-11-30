import { actualizarBadge } from "../img/Cart-icon.js";
import { Nav } from "./Componentes/Nav.js";
import { Index } from "./Componentes/Index.js";
import { Categories } from "./Componentes/Categories.js";
import { Sell } from "./Componentes/Sell.js";
import { initCategories } from "./categories.js";
import { Products } from "./Componentes/Products.js";
import { initProducts } from "./products.js";
import { ProductInfo } from "./Componentes/ProductInfo.js";
import { initProductPage } from "./product-info.js";
import { Cart } from "./Componentes/Cart.js";
import { renderCart } from "./CartProductCard.js";
import { MyProfile } from "./Componentes/MyProfile.js";
import { initNavbarIcon } from "./navbar-icon.js";
import { applySavedTheme } from "./color-mode.js";
import { initProfileScript } from "./my-profile.js";
import { initTotal } from "./cart.js";
import { IndexNoToken } from "./Componentes/IndexNoToken.js";

async function init() {
  // token y payload (si hay)
  let token = localStorage.getItem("token");
  let payload = null;
  if (token) {
    try {
      payload = JSON.parse(atob(token.split(".")[1]));
      if (payload && payload.id) {
        localStorage.setItem("user_id", payload.id);
      }
    } catch (e) {
      console.error("token inválido", e);
      token = null;
      localStorage.removeItem("token");
    }
  }
  // userId disponible (por si payload no existe)
  const userId = localStorage.getItem("user_id");
  if (token && localStorage.getItem("x") === "0") {
    const getCartIds = async (userIdParam) => {
      if (!userIdParam) return [];
      try {
        const url = `http://localhost:9000/cart?id=${userIdParam}`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) {
          if (res.status === 404) return [];
          console.warn("getCartIds: response not ok", res.status);
          return [];
        }
        const data = await res.json().catch(() => ({}));
        const productsIds = Array.isArray(data.products)
          ? data.products
          : data.products
          ? String(data.products).split(",")
          : [];
        return productsIds;
      } catch (err) {
        console.error("fetch failed getCartIds", err);
        return [];
      }
    };
    const getCartProducts = async (cartIdsArr, userIdParam) => {
      if (!cartIdsArr || cartIdsArr.length === 0) return [];
      const products = cartIdsArr.join(",");
      try {
        const url = `http://localhost:9000/products?ids=${encodeURIComponent(
          products
        )}&id=${encodeURIComponent(userIdParam)}`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) {
          console.warn("getCartProducts: response not ok", res.status);
          return [];
        }
        const data = await res.json().catch(() => []);
        return Array.isArray(data) ? data : [];
      } catch (err) {
        console.log("fetch failed getCartProducts", err);
        return [];
      }
    };
    const cartIds = await getCartIds(userId);
    const products = await getCartProducts(cartIds, userId);
    localStorage.setItem("cart", JSON.stringify(products || []));
    localStorage.setItem("x", "1");
  }
  const nav = document.querySelector(".navbar>.container");
  const root = document.querySelector("#root");
  if (nav) {
    nav.innerHTML = Nav();
    initNavbarIcon();
    applySavedTheme();
  }
  // manejo expiración token (si existe payload)
  if (payload && payload.exp) {
    const expires = payload.exp * 1000;
    const currentTime = Date.now();
    const timeLeft = expires - currentTime;
    if (timeLeft <= 0) {
      localStorage.removeItem("token");
      token = null;
    } else {
      setTimeout(() => {
        localStorage.removeItem("token");
        token = null;
      }, timeLeft);
    }
  }
  async function router() {
    const path = window.location.hash.slice(1) || "/";
    if (!root) return;
    if (token === null) {
      root.innerHTML = IndexNoToken();
      const backToLogin = document.querySelector("#backToLogin");
      if (backToLogin) {
        backToLogin.addEventListener("click", () => {
          window.location.href = "login.html";
        });
      }
    } else if (path === "/" || path === "/index") {
      root.innerHTML = Index();
    } else if (path === "/categories") {
      root.innerHTML = Categories();
      initCategories();
    } else if (path === "/sell") {
      root.innerHTML = Sell();
    } else if (path === "/products") {
      root.innerHTML = Products();
      initProducts();
    } else if (path === "/product-info") {
      root.innerHTML = ProductInfo();
      initProductPage();
    } else if (path === "/cart") {
      root.innerHTML = Cart();
      renderCart();
      initTotal();
    } else if (path === "/my-profile") {
      root.innerHTML = MyProfile();
      await initProfileScript();
    } else {
      root.innerHTML = `<h2>404 - Página no encontrada</h2>`;
    }
    attachCategoryListeners();
  }
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    const href = link.getAttribute("href");
    if (href && href.startsWith("/")) {
      e.preventDefault();
      window.location.hash = href;
    }
  });
  function attachCategoryListeners() {
    const autos = document.querySelector("#autos");
    const juguetes = document.querySelector("#juguetes");
    const muebles = document.querySelector("#muebles");
    if (autos)
      autos.addEventListener("click", () => {
        localStorage.setItem("catID", 101);
        window.location.hash = "#/products";
      });
    if (juguetes)
      juguetes.addEventListener("click", () => {
        localStorage.setItem("catID", 102);
        window.location.hash = "#/products";
      });
    if (muebles)
      muebles.addEventListener("click", () => {
        localStorage.setItem("catID", 103);
        window.location.hash = "#/products";
      });
  }
  window.addEventListener("hashchange", router);
  const count = JSON.parse(localStorage.getItem("cart")).reduce(
    (acc, p) => acc + p.quantity,
    0
  );
  actualizarBadge(count);
  await router();
}

init();
