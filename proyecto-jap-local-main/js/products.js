import { ProductCard } from "./ProductCard.js";
import { debounce, updateButton } from "./utils.js";

let productosAPI = [];
let listaActual = [];
let _productsInitDone = false;

export async function initProducts() {
  if (_productsInitDone) {
    const existingCat = localStorage.getItem("catID");
    if (!existingCat) return;
    await loadAndRender(existingCat);
    return;
  }
  _productsInitDone = true;
  const observer = new ResizeObserver(() => {
    document.querySelectorAll(".boton").forEach((btn) => updateButton(btn));
  });
  observer.observe(document.body);
  document.addEventListener("click", (e) => {
    const card = e.target.closest("[data-product-id]");
    if (!card) return;
    const id = card.dataset.productId;
    if (!id) return;
    localStorage.setItem("productID", id);
    window.location.href = "#/product-info";
  });
  const search = document.querySelector("#buscador");
  if (search) {
    search.addEventListener(
      "input",
      debounce(() => {
        buscar({
          list: productosAPI,
          input: search.value.trim().toLowerCase(),
        });
      }, 500)
    );
  }
  const formFiltro = document.getElementById("filtroPrecios");
  if (formFiltro) {
    formFiltro.addEventListener("submit", (e) => {
      e.preventDefault();
      aplicarFiltrosYOrden();
    });
  }
  const selectOrden = document.getElementById("ordenar");
  if (selectOrden) selectOrden.addEventListener("change", aplicarFiltrosYOrden);
  const catID = localStorage.getItem("catID");
  if (!catID) {
    const divProductos = document.getElementById("productos");
    if (divProductos)
      divProductos.innerHTML = "<p>No se seleccionó categoría.</p>";
    return;
  }
  await loadAndRender(catID);
  async function loadAndRender(catID) {
    const url = `http://localhost:9000/categories/${catID}`;
    const divProductos = document.getElementById("productos");
    const contenedor =
      document.getElementById("contenedorProductos") ||
      document.getElementById("productos");
    const divTituloExtra = document.getElementById("tituloExtraCategoria");
    if (!contenedor) return;
    try {
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      if (divProductos) {
        divProductos.innerHTML = "";
        const h2 = document.createElement("h4");
        h2.textContent = `Te encuentras en la categoría: ${
          data.catName || "Sin nombre"
        }`;
        divProductos.appendChild(h2);
      }
      if (divTituloExtra) {
        divTituloExtra.innerHTML = "";
        const h1 = document.createElement("h1");
        h1.textContent = data.catName || "Categoría";
        divTituloExtra.appendChild(h1);
      }
      productosAPI = Array.isArray(data.products) ? data.products : [];
      listaActual = productosAPI.slice();
      render(listaActual);
    } catch (err) {
      console.error("Error cargando productos:", err);
      if (divProductos)
        divProductos.innerHTML =
          "<p>Error cargando productos. Reintentá luego.</p>";
    }
  }
  function render(lista) {
    const contenedor =
      document.getElementById("contenedorProductos") ||
      document.getElementById("productos");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    if (!lista || lista.length === 0) {
      contenedor.innerHTML = "<p>No hay productos para mostrar.</p>";
      return;
    }
    lista.forEach((p) => {
      const card = ProductCard({ ...p });
      if (typeof card === "string") {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = card;
        contenedor.appendChild(wrapper.firstElementChild);
      } else {
        contenedor.appendChild(card);
      }
    });
  }
  function aplicarFiltrosYOrden() {
    const min = +(document.getElementById("precioMin")?.value || 0);
    const maxRaw = document.getElementById("precioMax")?.value;
    const max = maxRaw === "" || maxRaw === undefined ? Infinity : +maxRaw;
    const criterio = document.getElementById("ordenar")?.value;
    let lista = productosAPI.filter((p) => p.cost >= min && p.cost <= max);
    if (criterio === "precioAsc") lista.sort((a, b) => a.cost - b.cost);
    if (criterio === "precioDesc") lista.sort((a, b) => b.cost - a.cost);
    if (criterio === "relevancia")
      lista.sort((a, b) => b.soldCount - a.soldCount);
    listaActual = lista;
    render(listaActual);
  }
  function buscar({ list, input }) {
    if (!input) return render(list);
    const term = input.trim().toLowerCase();
    const filteredData = list.filter(
      (x) =>
        (x.description && x.description.toLowerCase().includes(term)) ||
        (x.name && x.name.toLowerCase().includes(term))
    );
    render(filteredData);
  }
}
