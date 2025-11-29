export function Sell() {
  return /* html */ `
       <div class="sell">
  <div class="sell-title">
    <h2>Vender</h2>
    <p>Ingresa los datos del artículo a vender.</p>
  </div>
  <div class="center-container">
    <div class="sell-form-container">
      <h4>Información del producto</h4>
      <form id="sell-info">
        <div class="form-row">
          <div class="field">
            <label for="productName">Nombre: </label>
            <input type="text" id="productName" name="productName" />
            <div class="invalid-feedback hidden">Ingresa un nombre</div>
          </div>
        </div>
        <div class="form-row">
          <div class="field">
            <label>Imágenes</label>
            <div id="file-upload" class="dropzone">
              <div class="dz-message">Arrastra tus fotos aquí<br /></div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="productDescription">Descripción</label>
            <textarea id="productDescription" name="productDescription"></textarea>
          </div>
        </div>
        <div class="form-row">
          <div class="field small-field">
            <label for="productCostInput">Costo</label>
            <input
              type="number"
              id="productCostInput"
              name="productCostInput"
              value="0"
              min="0"
            />
            <div class="invalid-feedback hidden">El costo debe ser mayor que 0.</div>
          </div>
          <div class="field medium-field">
            <label for="productCurrency">Moneda</label>
            <select id="productCurrency" name="productCurrency">
              <option value="" hidden selected>Seleccionar moneda</option>
              <option>Pesos Uruguayos (UYU)</option>
              <option>Dólares (USD)</option>
            </select>
            <div class="invalid-feedback hidden">Ingresa una categoría válida.</div>
          </div>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="productCategory">Categoría</label>
            <select id="productCategory" name="productCategory">
              <option value="">Elija la categoría...</option>
              <option>Autos</option>
              <option>Juguetes</option>
              <option>Muebles</option>
              <option>Herramientas</option>
              <option>Computadoras</option>
              <option>Vestimenta</option>
            </select>
            <div class="invalid-feedback hidden">
              Por favor ingresa una categoría válida.
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="field small-field">
            <label for="productCountInput">Cantidad en stock</label>
            <input
              type="number"
              id="productCountInput"
              name="productCountInput"
              value="1"
              min="0"
            />
            <div class="invalid-feedback hidden">La cantidad es requerida.</div>
          </div>
        </div>
        <hr />
        <h5>Tipo de publicación</h5>
        <div class="radio-group">
          <label>
            <input type="radio" id="goldradio" name="publicationType" checked />
            Gold (13%)
          </label>
          <label>
            <input type="radio" id="premiumradio" name="publicationType" />
            Premium (7%)
          </label>
          <label>
            <input type="radio" id="standardradio" name="publicationType" />
            Estándar (3%)
          </label>
          <div>
            <button type="button" class="link-button" data-modal="contidionsModal">
              Ver condiciones
            </button>
          </div>
        </div>
        <hr />
        <h4>Costos</h4>
        <ul class="cost-list">
          <li class="cost-item">
            <div>
              <h6>Precio</h6>
              <small>Unitario del producto</small>
            </div>
            <span id="productCostText">-</span>
          </li>
          <li class="cost-item">
            <div>
              <h6>Porcentaje</h6>
              <small>Según el tipo de publicación</small>
            </div>
            <span id="comissionText">-</span>
          </li>
          <li class="cost-item">
            <span class="total">Total ($)</span>
            <strong id="totalCostText">-</strong>
          </li>
        </ul>
        <hr />
        <button class="primary-button" type="submit">Vender</button>
      </form>
    </div>
  </div>
</div>
        `;
}
