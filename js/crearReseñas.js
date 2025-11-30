import { getReviews } from "./utils.js";

export async function crearResenia() {
  const productId = window.localStorage.getItem("currentProductID");
  const contenedorResenias = document.createElement("div");
  contenedorResenias.classList.add("contenedor-reseñas");
  const calificaciones = document.createElement("dialog");
  calificaciones.classList.add("calificaciones");
  const botonMostrar = document.createElement("button");
  botonMostrar.classList.add("button-show");
  botonMostrar.textContent = "Escribir reseña";
  botonMostrar.addEventListener("click", () => {
    if (!calificaciones.isConnected) {
      document.body.appendChild(calificaciones);
    }
    calificaciones.showModal();
  });
  const boton = document.createElement("button");
  boton.textContent = "Escribir mi opinión";
  const comentario = document.createElement("textarea");
  comentario.placeholder = "Escriba su reseña aquí...";
  comentario.classList.add("comentar-resenia");
  const estrellasContainer = document.createElement("div");
  estrellasContainer.classList.add("estrellas-container");
  let rating = 0;
  for (let i = 1; i <= 5; i++) {
    const estrella = document.createElement("span");
    estrella.classList.add("estrella");
    estrella.textContent = "☆";
    estrella.dataset.value = i;
    estrella.addEventListener("mouseover", () => pintarEstrellas(i));
    estrella.addEventListener("mouseout", () => pintarEstrellas(rating));
    estrella.addEventListener("click", () => {
      rating = i;
      pintarEstrellas(rating);
    });
    estrellasContainer.appendChild(estrella);
  }
  function pintarEstrellas(n) {
    const estrellas = estrellasContainer.querySelectorAll(".estrella");
    estrellas.forEach((e, index) => {
      e.textContent = index < n ? "★" : "☆";
    });
  }
  const enviar = document.createElement("button");
  enviar.textContent = "Enviar";
  calificaciones.appendChild(comentario);
  calificaciones.appendChild(estrellasContainer);
  calificaciones.appendChild(enviar);
  const listaResenas = document.createElement("div");
  listaResenas.classList.add("lista-resenas");
  const usuarioResenas = localStorage.getItem("username") || "Invitado";
  function mostrarResena(r) {
    const div = document.createElement("div");
    div.classList.add("resena");
    div.innerHTML = `
      <div class="resena-header">
        <img src="${
          r.foto || "https://avatar.iran.liara.run/public"
        }" alt="foto de ${r.user}">
        <div>
          <p class="resena-nombre"><strong>${r.user}</strong></p>
          <div class="resena-estrellas">${"★".repeat(r.score)}</div>
        </div>
      </div>
    </div>
            <p class="resena-fecha"><em>${r.dateTime}</em></p>
</div>
    <p class="resena-mensaje">${r.description}</p>
  `;
    if (r.user === usuarioResenas) {
      const botonEliminar = document.createElement("button");
      botonEliminar.textContent = "X";
      botonEliminar.classList.add("eliminar");
      botonEliminar.addEventListener("click", () => eliminarResena(r.id));
      div.appendChild(botonEliminar);
    }
    listaResenas.appendChild(div);
  }
  function guardarResena(r) {
    let todas = JSON.parse(localStorage.getItem("reseñas")) || {};
    if (!todas[productId]) todas[productId] = [];
    todas[productId].push(r);
    localStorage.setItem("reseñas", JSON.stringify(todas));
  }
  async function cargarResenas() {
    listaResenas.innerHTML = "";
    const apiReviews = await getReviews(productId);
    apiReviews.forEach((r) => {
      r.user = r.user.replace("_", " ");
      mostrarResena(r);
    });
    let allReviews = JSON.parse(localStorage.getItem("reseñas")) || [];
    let localReviews = allReviews[productId] || [];
    const checkForID = (reviews) =>
      reviews.map((r) => {
        if (!r.id) r.id = Date.now() + Math.random();
        return r;
      });
    checkForID(apiReviews);
    checkForID(localReviews);
    allReviews[productId] = localReviews;
    localStorage.setItem("reseñas", JSON.stringify(allReviews));
    localReviews.forEach((r) => mostrarResena(r));
  }
  function eliminarResena(id) {
    let todasLasResenas = JSON.parse(localStorage.getItem("reseñas")) || {};
    let reseñas = todasLasResenas[productId] || [];
    reseñas = reseñas.filter((r) => r.id !== id);
    todasLasResenas[productId] = reseñas;
    localStorage.setItem("reseñas", JSON.stringify(todasLasResenas));
    cargarResenas();
  }
  enviar.addEventListener("click", () => {
    const mensaje = comentario.value.trim();
    if (!mensaje) return alert("Por favor escriba una reseña");
    if (rating === 0) return alert("Seleccione una calificación con estrellas");
    const nuevaResena = {
      description: mensaje,
      score: rating,
      user: usuarioResenas,
      dateTime: new Date().toLocaleString(),
      id: Date.now() + Math.random(),
      product: window.localStorage.getItem("currentProduct"),
    };
    guardarResena(nuevaResena);
    mostrarResena(nuevaResena);
    comentario.value = "";
    rating = 0;
    pintarEstrellas(0);
    calificaciones.close();
  });
  cargarResenas();
  contenedorResenias.appendChild(listaResenas);
  contenedorResenias.appendChild(botonMostrar);
  contenedorResenias.appendChild(calificaciones);
  return contenedorResenias;
}
