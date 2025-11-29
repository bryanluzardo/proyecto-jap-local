import { changeGallery } from "./gallery.js";
import { actualizarBadge } from "../img/Cart-icon.js";

export const ProductInfo = ({
  id,
  category,
  cost,
  currency,
  description,
  images,
  name,
  soldCount,
}) => {
  const productDiv = document.createElement("div");
  productDiv.classList.add("product-info-container");
  const div1 = document.createElement("div");
  div1.classList.add("product-info-images");
  const div2 = document.createElement("div");
  div2.classList.add("product-info-details");
  let currentImage = 0;
  const mainImage = document.createElement("img");
  mainImage.classList.add("imagen-principal");
  const gallery = document.createElement("div");
  gallery.classList.add("galleria");
  changeGallery({
    images,
    currentImage,
    mainImage,
    gallery,
    div: div1,
    onChange: (i) => (currentImage = i),
  });
  const titleDiv = document.createElement("div");
  titleDiv.classList.add("titulo");
  const title = document.createElement("h2");
  title.textContent = name;
  titleDiv.appendChild(title);
  const review = document.createElement("small");
  const stars = `<span style="color: gold; font-size: 18px; margin-right: 60%;">★★★★★</span>`;
  review.innerHTML = `${stars} (${soldCount} vendidos)`;
  review.classList.add("review");
  titleDiv.appendChild(review);
  const price = document.createElement("h4");
  price.classList.add("precio");
  price.textContent = `${currency} ${cost}`;
  titleDiv.appendChild(price);
  div2.appendChild(titleDiv);
  div2.appendChild(document.createElement("hr"));
  const descripcionDiv = document.createElement("div");
  descripcionDiv.classList.add("descripcion-div");
  const productDescription = document.createElement("p");
  productDescription.classList.add("descripcion-producto");
  productDescription.textContent = description;
  descripcionDiv.appendChild(productDescription);
  div2.appendChild(descripcionDiv);
  div2.appendChild(document.createElement("hr"));
  const getCart = () => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch (e) {
      console.warn("Cart parse error, resetting cart", e);
      localStorage.setItem("cart", "[]");
      return [];
    }
  };
  const isInCart = () => getCart().some((p) => String(p.id) === String(id));
  const getTotalQuantity = (cart) =>
    cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const buyButton = document.createElement("div");
  buyButton.classList.add("buy-button");
  const quantity = document.createElement("input");
  quantity.classList.add("cantidad-productos");
  quantity.type = "number";
  quantity.value = 1;
  quantity.min = 1;
  quantity.max = 10;
  quantity.step = 1;
  buyButton.appendChild(quantity);
  const colorSelectWrapper = document.createElement("div");
  colorSelectWrapper.classList.add("color-select-wrapper");
  const selectedColor = document.createElement("div");
  selectedColor.classList.add("selected-color");
  selectedColor.style.backgroundColor = "#000000";
  colorSelectWrapper.appendChild(selectedColor);
  const colorOptions = document.createElement("div");
  colorOptions.classList.add("color-options");
  const colores = ["#000000", "#4f4f4fff", "#8b8b8bff", "#b8b8b8ff"];
  colores.forEach((c) => {
    const colorBtn = document.createElement("div");
    colorBtn.classList.add("color-btn");
    colorBtn.style.backgroundColor = c;
    colorBtn.addEventListener("click", () => {
      selectedColor.style.backgroundColor = c;
      colorOptions.style.display = "none";
    });
    colorOptions.appendChild(colorBtn);
  });
  colorSelectWrapper.appendChild(colorOptions);
  selectedColor.addEventListener("click", () => {
    colorOptions.style.display =
      colorOptions.style.display === "flex" ? "none" : "flex";
  });
  buyButton.appendChild(colorSelectWrapper);
  const button = document.createElement("button");
  button.classList.add("agregar-carrito");
  const cartBtn = document.createElement("button");
  cartBtn.classList.add("agregar-carrito");
  if (isInCart()) {
    button.innerText = "En el carrito";
    button.disabled = true;
    button.classList.add("in-cart");
    button.style.cursor = "not-allowed";
    button.style.backgroundColor = "green";
    cartBtn.innerText = "Ver carrito";
    cartBtn.onclick = () => (window.location.href = "#/cart");
  } else {
    button.innerText = "Agregar al carrito";
    button.disabled = false;
    cartBtn.innerText = "Comprar";
  }
  const addToCart = (goToCart = false) => {
    const currentCart = getCart();
    const productIndex = currentCart.findIndex(
      (p) => String(p.id) === String(id)
    );
    if (productIndex !== -1) {
      return currentCart;
    }
    const quantityValue = parseInt(quantity.value, 10) || 1;
    currentCart.push({
      id,
      cost,
      currency,
      description,
      images: images[currentImage],
      name,
      quantity: quantityValue,
    });
    localStorage.setItem("cart", JSON.stringify(currentCart));
    const totalCount = getTotalQuantity(currentCart);
    actualizarBadge(totalCount);
    button.innerText = "En el carrito";
    button.disabled = true;
    button.classList.add("in-cart");
    button.style.cursor = "not-allowed";
    button.style.backgroundColor = "green";
    cartBtn.innerText = "Ver carrito";
    cartBtn.onclick = () => (window.location.href = "#/cart");
    if (goToCart) {
      window.location.href = "#/cart";
    }
    return currentCart;
  };
  button.addEventListener("click", () => {
    if (isInCart()) return;
    addToCart(false);
  });
  cartBtn.addEventListener("click", () => {
    if (isInCart()) {
      window.location.href = "#/cart";
    } else {
      addToCart(true);
    }
  });
  buyButton.appendChild(cartBtn);
  buyButton.appendChild(button);
  div2.appendChild(buyButton);
  const divVerCarrito = document.createElement("div");
  divVerCarrito.classList.add("ver-carrito-div");
  const carritoIcon = document.createElement("img");
  carritoIcon.src = "img/carro-de-la-compra.png";
  carritoIcon.alt = "Icono carrito";
  carritoIcon.classList.add("carrito-icon");
  divVerCarrito.appendChild(carritoIcon);
  const verCarrito = document.createElement("p");
  verCarrito.classList.add("ver-carrito");
  verCarrito.innerText = "Ver carrito";
  verCarrito.onclick = () => (window.location.href = "#/cart");
  divVerCarrito.appendChild(verCarrito);
  div2.appendChild(divVerCarrito);
  div2.appendChild(document.createElement("hr"));
  const extras = document.createElement("div");
  extras.classList.add("extra-details");
  const categoryList = document.createElement("p");
  categoryList.classList.add("extra-details-p");
  categoryList.innerHTML = `<strong>Categoria:</strong> ${category}`;
  const tagList = document.createElement("p");
  tagList.innerHTML = `<strong>Tag:</strong> tag1, tag2`;
  extras.appendChild(categoryList);
  extras.appendChild(tagList);
  div2.appendChild(extras);
  productDiv.appendChild(div1);
  productDiv.appendChild(div2);
  return productDiv;
};
