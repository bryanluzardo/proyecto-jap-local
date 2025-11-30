const CATEGORIES_URL = "http://localhost:9000/categories";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
//const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
//const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

function getSpinner() {
  return document.getElementById("spinner-wrapper");
}

let showSpinner = function(){
  const spinner = getSpinner();
  if (!spinner) return; 
  spinner.style.display = "block";
}

let hideSpinner = function(){
  const spinner = getSpinner();
  if (!spinner) return;
  spinner.style.display = "none";
}

async function getJSONData(url){
  const result = {};
  showSpinner();
  try {
    const response = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${localStorage.getItem("token")}`} });
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();
    result.status = 'ok';
    result.data = data;
  } catch (error) {
    result.status = 'error';
    result.data = error;
  } finally {
    hideSpinner();
  }
  return result;
}
