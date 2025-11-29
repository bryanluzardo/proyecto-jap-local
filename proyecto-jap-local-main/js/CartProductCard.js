import { actualizarBadge } from "../img/Cart-icon.js";

const containerSelector = ".cart-container";

let cart = JSON.parse(localStorage.getItem("cart") || "[]");

// helper para obtener imagen válida (string o array)
const resolveImageSrc = (images) => {
  if (!images) return "";
  if (typeof images === "string") return images;
  if (Array.isArray(images) && images.length > 0) return images[0];
  // si viene objeto u otra estructura, intentar acceder a propiedades comunes
  if (images && typeof images === "object") {
    if (images.url) return images.url;
    if (images.src) return images.src;
  }
  return "";
};

// helper para asegurar número
const toNumberSafe = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const CartProductCard = ({ product }) => {
  // producto puede venir como id (string/number) o como objeto
  if (!product) {
    const emptyCard = document.createElement("div");
    emptyCard.classList.add("cart-product-card");
    emptyCard.textContent = "Producto inválido";
    return emptyCard;
  }
  // si nos pasa solo un id (string/number) lo dejamos visible pero sin imagen/datos
  const prod = typeof product === "object" ? { ...product } : { id: product };
  // asegurar campos mínimos
  prod.id = prod.id ?? prod._id ?? null;
  prod.name = prod.name ?? prod.title ?? "Producto";
  prod.description = prod.description ?? "";
  prod.images = prod.images ?? prod.image ?? prod.img ?? "";
  prod.currency = prod.currency ?? "USD";
  prod.cost = toNumberSafe(prod.cost ?? prod.price ?? prod.costo, 0);
  prod.quantity = toNumberSafe(prod.quantity ?? prod.cant ?? 1, 1);
  const costUSD = prod.currency === "UYU" ? prod.cost / 40 : prod.cost;
  const card = document.createElement("div");
  card.classList.add("cart-product-card");
  const img = document.createElement("img");
  const imgSrc = resolveImageSrc(prod.images);
  if (imgSrc) {
    img.src = imgSrc;
  } else {
    // imagen por defecto si no hay
    img.src = "/assets/no-image.png";
  }
  img.alt = prod.description || prod.name || "Producto";
  card.appendChild(img);
  const name = document.createElement("h4");
  name.textContent = prod.name;
  card.appendChild(name);
  const price = document.createElement("p");
  price.textContent = `USD ${costUSD.toFixed(2)}`;
  card.appendChild(price);
  const quantityContainer = document.createElement("div");
  quantityContainer.style.display = "flex";
  quantityContainer.style.alignItems = "center";
  quantityContainer.style.gap = "5px";
  const decrease = document.createElement("button");
  decrease.textContent = "-";
  decrease.style.cursor = "pointer";
  decrease.setAttribute("aria-label", "Disminuir cantidad");
  const quantity = document.createElement("span");
  quantity.textContent = prod.quantity;
  const increase = document.createElement("button");
  increase.classList.add("increase");
  increase.textContent = "+";
  increase.style.cursor = "pointer";
  increase.setAttribute("aria-label", "Aumentar cantidad");
  decrease.addEventListener("click", () => {
    // encontrar el producto real en el array por id si existe, sino por referencia
    const idx = findProductIndex(prod);
    if (idx === -1) return;
    if (!cart[idx].quantity) cart[idx].quantity = 1;
    if (cart[idx].quantity > 1) {
      cart[idx].quantity = Number(cart[idx].quantity) - 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  });
  increase.addEventListener("click", () => {
    const idx = findProductIndex(prod);
    if (idx === -1) return;
    if (!cart[idx].quantity) cart[idx].quantity = 0;
    cart[idx].quantity = Number(cart[idx].quantity) + 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  });
  quantityContainer.appendChild(decrease);
  quantityContainer.appendChild(quantity);
  quantityContainer.appendChild(increase);
  card.appendChild(quantityContainer);
  const subtotal = document.createElement("p");
  subtotal.textContent = `Subtotal: USD ${(costUSD * prod.quantity).toFixed(
    2
  )}`;
  card.appendChild(subtotal);
  const remove = document.createElement("button");
  remove.textContent = "🗑";
  remove.style.cursor = "pointer";
  remove.setAttribute("aria-label", "Eliminar producto");
  remove.addEventListener("click", () => {
    const idx = findProductIndex(prod);
    if (idx > -1) {
      cart.splice(idx, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  });
  card.appendChild(remove);
  return card;
};

// encuentra el índice del producto en el carrito por id (si existe), si no por referencia
const findProductIndex = (product) => {
  if (!product) return -1;
  cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (product.id != null) {
    return cart.findIndex(
      (p) =>
        String(p.id) === String(product.id) ||
        String(p._id) === String(product.id)
    );
  }
  // fallback a comparar por referencia e incluso por nombre/cost como último recurso
  const byRef = cart.indexOf(product);
  if (byRef !== -1) return byRef;
  return cart.findIndex(
    (p) =>
      p.name &&
      product.name &&
      p.name === product.name &&
      p.cost === product.cost
  );
};

const getContainer = () => document.querySelector(containerSelector);

const renderCart = () => {
  const container = getContainer();
  cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (!container) return;
  container.innerHTML = "";
  if (!Array.isArray(cart) || cart.length === 0) {
    container.innerHTML = '<h1 class="empty-cart">El carrito está vacío</h1>';
    actualizarBadge(0);
    document.dispatchEvent(
      new CustomEvent("totalAmountChanged", { detail: { value: 0 } })
    );
    return;
  }
  cart.forEach((product) => {
    container.appendChild(CartProductCard({ product }));
  });
  const totalAmount = cart.reduce((acc, p) => {
    const cost = toNumberSafe(p.cost ?? p.price ?? 0, 0);
    const currency = p.currency ?? "USD";
    const costUSD = currency === "UYU" ? cost / 40 : cost;
    const qty = toNumberSafe(p.quantity ?? 1, 1);
    return acc + costUSD * qty;
  }, 0);
  const value = totalAmount;
  document.dispatchEvent(
    new CustomEvent("totalAmountChanged", { detail: { value } })
  );
  const total = document.createElement("p");
  total.textContent = `Total: USD ${totalAmount.toFixed(2)}`;
  total.classList.add("total-amount");
  container.appendChild(total);
  let count = 0;
  cart.forEach((item) => (count += toNumberSafe(item.quantity ?? 1, 1)));
  actualizarBadge(count);
};

if (window.location.hash === "#/cart") {
  setTimeout(renderCart, 0);
}

window.addEventListener("hashchange", () => {
  if (window.location.hash === "#/cart") {
    loadCartPage();
  }
});

export { renderCart };

// Validación y feedback de compra
function buyValidation() {
  const finishBuying = document.querySelector("#finish-buy-button");
  if (!finishBuying) return; // evita crash si no existe el botón en la página
  const feedbackContainer = document.createElement("div");
  feedbackContainer.id = "feedbackCompra";
  feedbackContainer.style.margin = "12px 0";
  const cartSection = document.querySelector("#feedback-compra");
  if (cartSection) cartSection.appendChild(feedbackContainer);
  finishBuying.addEventListener("click", () => onFinishClick());
  function onFinishClick(e) {
    clearFeedback();
    const errors = [];
    const addressOK = validateAddress(errors);
    const shippingOK = validateShipping(errors);
    const productsOK = validateQuantities(errors);
    const paymentOK = validatePayment(errors);
    if (errors.length > 0) {
      showErrors(errors);
      return;
    }
    showSuccess("¡Compra realizada con éxito!");
    console.log("buyValidation se ejecuta");
    console.log(
      "finish-buy-button:",
      document.querySelector("#finish-buy-button")
    );
  }

  function validateAddress(errors) {
    const address = (getValue("#calle") || "").trim();
    const city = (getValue("#esquina") || "").trim();
    const country = (getValue("#numero") || "").trim();
    if (!address || !city || !country) {
      errors.push("Por favor completá la dirección y la ciudad.");
      highlightIfExists("#calle");
      highlightIfExists("#esquina");
      highlightIfExists("#numero");
      return false;
    }
    return true;
  }

  function validateShipping(errors) {
    const radio = document.querySelector('input[name="envio"]:checked');
    if (!radio) {
      errors.push("Por favor seleccioná un método de envío.");
      return false;
    }
    return true;
  }

  function validateQuantities(errors) {
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (localCart.length === 0) {
      errors.push("El carrito está vacío.");
      return false;
    }
    let ok = true;
    localCart.forEach((item, i) => {
      const cantidad = Number(item.quantity);
      if (!Number.isFinite(cantidad) || cantidad <= 0) {
        ok = false;
        errors.push(
          `La cantidad del producto ${item.name || i + 1} debe ser mayor a 0.`
        );
      }
    });

    const inputs = document.querySelectorAll(".cantidad");
    inputs.forEach((input) => {
      const val = Number(input.value);
      if (!Number.isFinite(val) || val <= 0) {
        input.classList.add("input-error");
      } else {
        input.classList.remove("input-error");
      }
    });
    return ok;
  }

  function validatePayment(errors) {
    const radio = document.querySelector('input[name="pago"]:checked');
    let metodo = radio
      ? radio.value || radio.parentElement.textContent.trim()
      : null;
    if (!metodo) {
      errors.push("Por favor seleccioná un método de pago.");
      return false;
    }
    if (/tarjeta|crédito/i.test(metodo)) {
      const nro = (getValue("#numero-tarjeta") || "").trim();
      const venc = (getValue("#vencimiento") || "").trim();
      const cvv = (getValue("#cvc") || "").trim();
      if (!nro || !venc || !cvv) {
        errors.push(
          "Completá todos los datos de la tarjeta (número, titular, venc., CVV)."
        );
        ["#numero-tarjeta", "#vencimiento", "#cvc"].forEach(highlightIfExists);
        return false;
      }
    }
    return true;
  }

  // para utilidades
  function getValue(selector) {
    const el = document.querySelector(selector);
    return el ? el.value : "";
  }

  function highlightIfExists(selector) {
    const el = document.querySelector(selector);
    if (el) el.classList.add("input-error");
  }

  function clearFeedback() {
    feedbackContainer.innerHTML = "";
    document
      .querySelectorAll(".input-error")
      .forEach((el) => el.classList.remove("input-error"));
  }

  function showErrors(errores) {
    const ul = document.createElement("ul");
    ul.style.color = "#b71c1c";
    ul.style.background = "#ffebee";
    ul.style.padding = "10px";
    ul.style.borderRadius = "6px";
    ul.style.margin = "0";
    errores.forEach((msg) => {
      const li = document.createElement("li");
      li.textContent = msg;
      ul.appendChild(li);
    });
    feedbackContainer.appendChild(ul);
    feedbackContainer.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function showSuccess(msg) {
    const p = document.createElement("p");
    p.textContent = msg;
    p.style.color = "#1b5e20";
    p.style.background = "#e8f5e9";
    p.style.padding = "12px";
    p.style.borderRadius = "6px";
    p.style.margin = "0";
    feedbackContainer.appendChild(p);
    feedbackContainer.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function loadCartPage() {
  setTimeout(() => {
    renderCart();
    buyValidation();
  }, 0);
}

if (window.location.hash === "#/cart") {
  loadCartPage();
}
