import { ProductInfo } from "./ProductInfo.js";
import { crearResenia } from "./crearReseñas.js";
import { RelatedProducts } from "./Componentes/RelatedProducts.js";

export async function initProductPage() {
  const currentProduct = window.localStorage.getItem("currentProductID");
  const url = `http://localhost:9000/products/${currentProduct}`;
  let contenedor = document.querySelector(".contenedor");
  if (!contenedor) {
    const root = document.querySelector("#root");
    contenedor =
      (root && root.querySelector(".contenedor")) || root || document.body;
  }
  if (!contenedor) {
    contenedor = document.createElement("div");
    contenedor.className = "contenedor";
    document.body.appendChild(contenedor);
  }
  if (contenedor.dataset.currentProduct === String(currentProduct)) return;
  contenedor.dataset.currentProduct = String(currentProduct);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const product = await response.json();
    contenedor.innerHTML = "";
    contenedor.appendChild(ProductInfo({ ...product }));
    const reviews = await crearResenia();
    if (reviews) contenedor.appendChild(reviews);
    const relatedWrapper = document.createElement("div");
    relatedWrapper.classList.add("related-wrapper");
    const titulo = document.createElement("h3");
    titulo.classList.add("titulo-related");
    titulo.textContent = "Productos relacionados";
    relatedWrapper.appendChild(titulo);
    function htmlToElement(html) {
      const template = document.createElement("template");
      template.innerHTML = html.trim();
      return template.content.firstChild;
    }
    const relatedProductsContainer = document.createElement("div");
    relatedProductsContainer.classList.add("related-products");
    if (Array.isArray(product.relatedProducts)) {
      Array.from(product.relatedProducts).forEach((rel) => {
        relatedProductsContainer.appendChild(
          htmlToElement(RelatedProducts({ ...rel, isRelated: true }))
        );
      });
    }
    relatedWrapper.appendChild(relatedProductsContainer);
    contenedor.appendChild(relatedWrapper);
  } catch (err) {
    console.error("Error cargando product-info:", err);
  }
}

if (window.location.hash === "#/product-info") {
  initProductPage();
}

window.addEventListener("hashchange", () => {
  if (window.location.hash === "#/product-info") initProductPage();
});
