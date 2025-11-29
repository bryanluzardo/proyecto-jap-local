import { Bolsa } from "../img/Bolsa-Compra.js";
export const debounce = (fn, ms = 300) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  };
};

export const updateButton = (button) => {
  if (window.innerWidth < 520) {
    button.textContent = "Agregar al carrito";
  } else {
    button.innerHTML = Bolsa();
  }
};

export const getReviews = async (id) => {
  const url = `http://localhost:9000/comments/${id}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
};

export function decodeToken(token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  while (payload.length % 4 !== 0) payload += "=";
  try {
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Error al decodificar token:", e);
    return null;
  }
}

export const getUserData = async (id) => {
  const url = `http://localhost:9000/usuarios/${id}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error(`Error fetching user ${id}: ${res.status}`);
  const data = await res.json();
  return {
    name: data.user_name ?? data.name ?? "",
    email: data.mail ?? data.email ?? "",
    telefono: data.tel ?? data.telefono ?? "",
    _raw: data,
  };
};

export function LoadingFunction(svgGroup) {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const spacing = 40;
  const center = { x: 100, y: 100 };
  function createDot(cx, cy, r = 1) {
    const dot = document.createElementNS(SVG_NS, "circle");
    dot.setAttribute("cx", cx);
    dot.setAttribute("cy", cy);
    dot.setAttribute("r", r);
    dot.classList.add("dot");
    svgGroup.appendChild(dot);
    return dot;
  }
  function clearDots() {
    svgGroup.querySelectorAll(".dot").forEach((d) => d.remove());
  }
  function animateSpinner() {
    clearDots();
    // centro
    createDot(center.x, center.y, 18);
    // cardinal
    const positions = [
      { cx: center.x, cy: center.y - spacing },
      { cx: center.x, cy: center.y + spacing },
      { cx: center.x - spacing, cy: center.y },
      { cx: center.x + spacing, cy: center.y },
    ];
    // diagonales
    const diagSpacing = spacing / Math.SQRT2;
    positions.push(
      { cx: center.x - diagSpacing, cy: center.y - diagSpacing },
      { cx: center.x + diagSpacing, cy: center.y - diagSpacing },
      { cx: center.x - diagSpacing, cy: center.y + diagSpacing },
      { cx: center.x + diagSpacing, cy: center.y + diagSpacing }
    );
    const allDots = [];
    // animar cada punto desde el centro => medio => destino
    positions.forEach((pos, i) => {
      const dot = createDot(center.x, center.y, 10);
      allDots.push(dot);
      const midX = (center.x + pos.cx) / 2;
      const midY = (center.y + pos.cy) / 2;
      // pequeña secuencia de tiempos escalonados para dar sensación más orgánica
      const delay = 60 + i * 30;
      setTimeout(() => {
        dot.setAttribute("r", 7);
        dot.setAttribute("cx", midX);
        dot.setAttribute("cy", midY);
      }, delay);
      setTimeout(() => {
        dot.setAttribute("r", 7);
        dot.setAttribute("cx", pos.cx);
        dot.setAttribute("cy", pos.cy);
      }, delay + 420);
    });
    // rotación del grupo (suave)
    setTimeout(() => {
      svgGroup.style.transition = "transform 0.6s linear";
      svgGroup.style.transform = "rotate(360deg)";
    }, 2200);
    // volver a centro
    setTimeout(() => {
      svgGroup.style.transition = "transform 0.35s linear";
      svgGroup.style.transform = "rotate(0deg)";
      allDots.forEach((d) => {
        d.setAttribute("cx", center.x);
        d.setAttribute("cy", center.y);
        d.setAttribute("r", 15);
      });
    }, 2700);
    // repetir
    setTimeout(() => {
      animateSpinner();
    }, 3300);
  }
  animateSpinner();
}
