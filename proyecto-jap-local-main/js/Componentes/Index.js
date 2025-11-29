export function Index() {
  return /* html */ `
    <section class="hero-section">
      <h1 style="color: var(--icon-color);">NEBULA</h1>
    </section>
    <section class="categories-section">
      <div class="container">
        <div class="card-grid">
          <article class="card cursor-active" id="autos">
            <img
              src="img/cars_index.jpg"
              alt="Imagen representativa de la categoría 'Autos'"
              class="card-img"
            />
            <h3 class="card-title">Autos</h3>
            <p class="card-text">
              Los mejores precios en autos 0 kilómetro, de alta y media gama.
            </p>
          </article>
          <article class="card cursor-active" id="juguetes">
            <img
              src="img/toys_index.jpg"
              alt="Imagen representativa de la categoría 'Juguetes'"
              class="card-img"
            />
            <h3 class="card-title">Juguetes</h3>
            <p class="card-text">
              Encuentra aquí los mejores precios para niños/as de cualquier edad.
            </p>
          </article>
          <article class="card cursor-active" id="muebles">
            <img
              src="img/furniture_index.jpg"
              alt="Imagen representativa de la categoría 'Muebles'"
              class="card-img"
            />
            <h3 class="card-title">Muebles</h3>
            <p class="card-text">
              Muebles antiguos, nuevos y para ser armados por uno mismo.
            </p>
          </article>
        </div>
        <div class="more-section">
          <a class="btn-more" href="#/categories">¡Y mucho más!</a>
        </div>
      </div>
    </section>
    `;
}
