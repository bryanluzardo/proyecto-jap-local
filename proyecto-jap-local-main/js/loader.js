const page = document.body.dataset.page || "index";

const modulesByPage = {
  index: ["/js/navbar-icon.js", "/js/color-mode.js", "/js/authentication.js"],
  product: [
    "/js/authentication.js",
    "/js/product-info.js",
    "/js/ProductInfo.js",
    "/js/navbar-icon.js",
  ],
  cart: ["/js/authentication.js", "/js/cart.js", "/js/navbar-icon.js"],
  profile: ["/js/authentication.js", "/js/navbar-icon.js", "/js/my-profile.js"],
};

async function loadModules(list = []) {
  for (const path of list) {
    try {
      await import(path);
    } catch (err) {
      console.error("Fallo importando", path, err);
    }
  }
}

function loadClassicScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.defer = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

(async () => {
  const toLoad = modulesByPage[page] ?? modulesByPage.index;
  await loadModules(toLoad);
})();
