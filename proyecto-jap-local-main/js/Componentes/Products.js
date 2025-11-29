export function Products() {
  return /* html */ `
    <div id="tituloExtraCategoria"></div>
    <div class="filtros">
      <div class="search-bar">
        <label for="buscador"
          >Buscar:
          <input type="text" id="buscador" placeholder="Buscar..." />
        </label>
      </div>
      <form id="filtroPrecios">
        <label for="precioMin"
          >Precio Mínimo:
          <input
            type="number"
            id="precioMin"
            min="0"
            step="1"
            placeholder="Ej: 50"
          />
        </label>
        <label for="precioMax"
          >Precio Máximo:
          <input
            type="number"
            id="precioMax"
            min="0"
            step="1"
            placeholder="Ej: 5000"
          />
        </label>
        <button type="submit">Filtrar</button>
      </form>
      <div>
        <label for="ordenar">Ordenar por:</label>
        <select id="ordenar">
          <option value="precioAsc">Precio (menor a mayor)</option>
          <option value="precioDesc">Precio (mayor a menor)</option>
          <option value="relevancia" selected>Relevancia (mas vendidos)</option>
        </select>
      </div>
    </div>
      <div class="contenedorcito" id="contenedorProductos">
      <div id="productos"></div>
    </div>
        `;
}
