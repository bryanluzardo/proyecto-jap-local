const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

function sortCategories(criteria, array) {
  if (!array) return [];
  let result = [...array];
  if (criteria === ORDER_ASC_BY_NAME) {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (criteria === ORDER_DESC_BY_NAME) {
    result.sort((a, b) => b.name.localeCompare(a.name));
  } else if (criteria === ORDER_BY_PROD_COUNT) {
    result.sort((a, b) => parseInt(b.productCount) - parseInt(a.productCount));
  }
  return result;
}

function showCategoriesList() {
  let htmlContentToAppend = "";
  for (let i = 0; i < currentCategoriesArray.length; i++) {
    let category = currentCategoriesArray[i];
    if (
      (minCount == undefined ||
        (minCount != undefined &&
          parseInt(category.productCount) >= minCount)) &&
      (maxCount == undefined ||
        (maxCount != undefined && parseInt(category.productCount) <= maxCount))
    ) {
      htmlContentToAppend += `
      <div class="list-group-item list-group-item-action cursor-active" data-cat-id="${category.id}">
        <div class="row">
          <div class="col-3">
            <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
          </div>
          <div class="col">
            <div class="d-flex w-100 justify-content-between">
              <h4 class="mb-1">${category.name}</h4>
              <small class="text-muted">${category.productCount} artículos</small>
            </div>
            <p class="mb-1">${category.description}</p>
          </div>
        </div>
      </div>
      `;
    }
  }
  const container = document.getElementById("cat-list-container");
  if (container) container.innerHTML = htmlContentToAppend;
}

function sortAndShowCategories(sortCriteria, categoriesArray) {
  currentSortCriteria = sortCriteria;
  if (categoriesArray != undefined) currentCategoriesArray = categoriesArray;
  currentCategoriesArray = sortCategories(
    currentSortCriteria,
    currentCategoriesArray
  );
  showCategoriesList();
}

export function initCategories() {
  getJSONData(CATEGORIES_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      currentCategoriesArray = resultObj.data;
      currentCategoriesArray = sortCategories(
        currentSortCriteria,
        currentCategoriesArray
      );
      showCategoriesList();
    }
  });
  const sortAscBtn = document.getElementById("sortAsc");
  if (sortAscBtn)
    sortAscBtn.addEventListener("click", function () {
      sortAndShowCategories(ORDER_ASC_BY_NAME);
    });
  const sortDescBtn = document.getElementById("sortDesc");
  if (sortDescBtn)
    sortDescBtn.addEventListener("click", function () {
      sortAndShowCategories(ORDER_DESC_BY_NAME);
    });
  const sortByCountBtn = document.getElementById("sortByCount");
  if (sortByCountBtn)
    sortByCountBtn.addEventListener("click", function () {
      sortAndShowCategories(ORDER_BY_PROD_COUNT);
    });
  const clearRangeFilterBtn = document.getElementById("clearRangeFilter");
  if (clearRangeFilterBtn)
    clearRangeFilterBtn.addEventListener("click", function () {
      const minInput = document.getElementById("rangeFilterCountMin");
      const maxInput = document.getElementById("rangeFilterCountMax");
      if (minInput) minInput.value = "";
      if (maxInput) maxInput.value = "";
      minCount = undefined;
      maxCount = undefined;
      showCategoriesList();
    });
  const applyRangeFilterBtn = document.getElementById("rangeFilterCount");
  if (applyRangeFilterBtn)
    applyRangeFilterBtn.addEventListener("click", function () {
      const minVal = document.getElementById("rangeFilterCountMin")?.value;
      const maxVal = document.getElementById("rangeFilterCountMax")?.value;
      if (minVal != undefined && minVal !== "" && !isNaN(parseInt(minVal))) {
        minCount = parseInt(minVal);
      } else {
        minCount = undefined;
      }
      if (maxVal != undefined && maxVal !== "" && !isNaN(parseInt(maxVal))) {
        maxCount = parseInt(maxVal);
      } else {
        maxCount = undefined;
      }
      showCategoriesList();
    });
  document.addEventListener("click", function (e) {
    const card = e.target.closest("[data-cat-id]");
    if (!card) return;
    const id = card.dataset.catId;
    if (!id) return;
    localStorage.setItem("catID", id);
    window.location.href = "#/products";
  });
}
