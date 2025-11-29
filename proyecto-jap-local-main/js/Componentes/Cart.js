document.addEventListener("click", (e) => {
  if (e.target.id === "checkout-button") {
    const tipoEnvio = document.getElementById("checkout-card");
    const datosEnvio = document.getElementById("datos-envio-card");
    tipoEnvio.style.display =
      tipoEnvio.style.display === "none" ? "block" : "none";
    datosEnvio.style.display = "none";
  }
  if (e.target.id === "continuar") {
    const tipoEnvio = document.getElementById("checkout-card");
    const datosEnvio = document.getElementById("datos-envio-card");
    datosEnvio.style.display = "block";
    tipoEnvio.style.display = "none";
  }
});

export function Cart() {
  return /* html */ `
  <h1>Mi carrito</h1>
  <div class="cart-container"></div>
  <div class="checkout-boton-bloque">
    <button id="checkout-button">Comprar ahora</button>
  </div>
  <div class="tipo-envio-bloque" id="checkout-card" style="display: none;">
    <h5>Tipo de envío</h5>
    <div class="opciones">
    <label>
      <div class="opciones-individuales">
          <input type="radio" name="envio" value="standard" checked> Standard (12 a 15 días)
          <p>+5%</p>
      </div>
    </label>
    <label>
      <div class="opciones-individuales">
          <input type="radio" name="envio" value="express"> Express (5 a 8 días)
          <p>+7%</p>
          </div>
    </label>
    <label>
    <div class="opciones-individuales">
      <input type="radio" name="envio" value="premium"> Premium (2 a 5 días)
      <p>+15%</p>
    </div>
    </label>
      <div class="total-envio">
        <p>Subtotal</p>
        <p class="valor subtotal">Usd xxx</p>
      </div>
      <hr />
      <div class="total-envio">
        <p>Total</p>
        <p class="valor total">Usd xxx</p>
      </div>
    </div>
    <button id="continuar">Continuar</button>
  </div>
  <div class="datos-envio-bloque" id="datos-envio-card" style="display: none;">
    <div class="direccion-de-envio">
      <h5>Dirección de envío</h5>
      <p class="subtitulo-bloque">CALLE *</p>
      <input type="text" id="calle" required />
      <p class="subtitulo-bloque">PAÍS *</p>
      <input type="text" id="numero" required />
      <p class="subtitulo-bloque">CIUDAD *</p>
      <input type="text" id="esquina" required />
      <div class="input-doble">
        <div class="bloquecito">
          <p class="subtitulo-bloque">DEPARTAMENTO</p>
          <input type="text" id="departamento" />
        </div>
        <div class="bloquecito">
          <p class="subtitulo-bloque">CÓDIGO POSTAL</p>
          <input type="text" id="codigo-postal" />
        </div>
      </div>
    </div>
    <div class="metodo-de-pago">
      <h5>Método de pago</h5>
      <div class="metodos-pago">
        <label>
          <input type="radio" name="pago"> Tarjeta de crédito
        </label>
      </div>
      <div class="metodos-pago">
        <label>
          <input type="radio" name="pago"> Transferencia bancaria
        </label>
      </div>
      <hr class="barrita-divisoria" />
      <p class="subtitulo-bloque">NÚMERO DE TARJETA</p>
      <input type="text" id="numero-tarjeta" placeholder="1234 1234 1234 1234" required />
      <div class="vencimiento-cvs">
        <div class="input-doble">
          <div class="bloquecito">
            <p class="subtitulo-bloque">VENCIMIENTO</p>
            <input type="text" id="vencimiento" placeholder="MM/YY" />
          </div>
          <div class="bloquecito">
            <p class="subtitulo-bloque">CVC</p>
            <input type="text" id="cvc" placeholder="código CVC" />
          </div>
        </div>
      </div>
    </div>
    <div class="finalizar-compra-boton">
      <button id="finish-buy-button">Finalizar Compra</button>
    </div>
  </div>
  `;
}
