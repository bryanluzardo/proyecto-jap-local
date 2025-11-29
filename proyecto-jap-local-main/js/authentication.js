// Este archivo protege páginas y contiene la función saveProducts
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

const userId = localStorage.getItem("user_id") || null;

// Guardar productos del localStorage al servidor (ids: array de strings o números)
export const saveProducts = async (userIdParam, productsArray) => {
  if (!userIdParam) {
    console.warn("saveProducts: falta userId");
    return null;
  }
  if (!Array.isArray(productsArray)) {
    console.warn("saveProducts: productsArray no es array", productsArray);
    return null;
  }
  const currentProducts = JSON.parse(localStorage.getItem("cart") || "[]");
  const newParams = productsArray.map((id) => {
    const found = currentProducts.find((p) => String(p.id) === String(id));
    const qty =
      found && Number.isFinite(Number(found.quantity))
        ? Number(found.quantity)
        : 1;
    return `${id}-qty-${qty}`;
  });
  const url = `http://localhost:9000/cart?ids=${newParams.join(
    ","
  )}&id=${userIdParam}`;
  console.log(url);
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) {
      console.error("Save cart failed", res.status);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("Fetch error saving cart", err);
    return null;
  }
};

document.addEventListener("click", (e) => {
  const target = e.target.closest("#cerrar-sesion");
  if (!target) return;
  cerrarSesion();
});

async function cerrarSesion() {
  try {
    const currentProducts = JSON.parse(localStorage.getItem("cart") || "[]");
    const ids = currentProducts.map((p) => p.id);
    await saveProducts(userId, ids); // esperamos que termine
  } catch (err) {
    console.error("Error guardando carrito antes de cerrar sesión", err);
    // no cortamos el flujo de logout por este error
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    window.location.href = "login.html";
  }
}
