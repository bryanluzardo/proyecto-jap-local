import { initProductPage } from "./product-info.js";

window.handleClick = (id) => {
  window.localStorage.removeItem("currentProduct");
  window.localStorage.setItem("currentProductID", id);
  initProductPage();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const ProductCard = ({
  id,
  cost,
  currency,
  description,
  image,
  name,
  soldCount,
  isRelated = false,
}) => {
  return /* html */ `
    <div class= "producto" onclick="handleClick(${id})">
    <div class= "informacion-producto">
    <h3>${name}</h3>
    <p>${currency} ${cost}</p>
    <p>${description}</p>
    <p>${soldCount} vendidos</p>
    <span style="color: #FFCC00; font-size: 18px; margin-right: 60%;">★★★★★</span>
    </div>
    <div class= "imagen" style="background-image: url('${image}');"></div>
    </div>
    `;
};
