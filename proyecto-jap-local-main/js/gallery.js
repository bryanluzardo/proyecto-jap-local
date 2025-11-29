export const changeGallery = ({
  images,
  currentImage,
  mainImage,
  gallery,
  div,
}) => {
  mainImage.src = images[currentImage];
  mainImage.alt = `Imagen ${currentImage + 1}`;
  gallery.innerHTML = "";
  images.forEach((imgSrc, index) => {
    if (index !== currentImage) {
      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = `Imagen ${index + 1}`;
      img.addEventListener("click", () => {
        currentImage = index;
        changeGallery({ images, currentImage: index, mainImage, gallery, div });
      });
      gallery.appendChild(img);
    }
  });
  if (!div.contains(mainImage)) div.appendChild(mainImage);
  if (!div.contains(gallery)) div.appendChild(gallery);
};
