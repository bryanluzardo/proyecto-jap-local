export const initTotal = () => {
  const total = document.querySelector(".total");
  const subtotal = document.querySelector(".subtotal");
  const radios = Array.from(document.querySelectorAll('input[name="envio"]'));
  const express = radios.find((r) => r.value === "express");
  const premium = radios.find((r) => r.value === "premium");
  const selected = () => {
    if (premium?.checked) return 0.15;
    if (express?.checked) return 0.07;
    return 0.05;
  };

  const updateTotal = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalAmount = cart.reduce((acc, p) => {
      const cost = Number(p.cost) || 0;
      const qty = Number(p.quantity) || 0;
      const costUSD = p.currency === "UYU" ? cost / 40 : cost;
      return acc + costUSD * qty;
    }, 0);
    const envio = totalAmount * selected();
    const subtotalSinEnvio = totalAmount;
    const totalConEnvio = subtotalSinEnvio + envio;
    if (cart.length === 0) {
      if (total) total.textContent = `Total: USD 0.00`;
      if (subtotal) subtotal.textContent = `Subtotal: USD 0.00`;
      return;
    }
    if (total) total.textContent = `Total: USD ${totalConEnvio.toFixed(2)}`;
    if (subtotal)
      subtotal.textContent = `Subtotal: USD ${subtotalSinEnvio.toFixed(2)}`;
  };

  document.addEventListener("totalAmountChanged", () => updateTotal());
  if (radios.length > 0) {
    radios.forEach((r) => r.addEventListener("change", updateTotal));
  }
  updateTotal();
};
