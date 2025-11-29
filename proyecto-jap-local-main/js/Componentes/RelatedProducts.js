export const RelatedProducts = ({ id, name, image, isRelated = true }) => {
  return /* html */ `
    <div class="related-product" onclick="handleClick(${id})">
    <div class="related-product-image" style="background-image: url('${image}');"></div>
    <h4>${name}</h4>
    </div>
    `;
};
