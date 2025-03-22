var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _selectValue, _isOpen, _content, _container, _data, _cssType, _onFavoriteClick, _onFoodItemClick, _foodItems, _selectedFilter, _selectedSortType, _currentMenu, _currentMenu2, _onTabChange;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
class Dropdown {
  constructor({ name, options, onChange }) {
    __publicField(this, "container");
    __publicField(this, "name");
    __publicField(this, "options");
    __publicField(this, "onChange");
    __privateAdd(this, _selectValue, "");
    this.container = document.createElement("div");
    this.options = options;
    this.name = name;
    this.onChange = onChange;
    this.render();
    this.setDropdownValue();
  }
  get selectValue() {
    return __privateGet(this, _selectValue);
  }
  get element() {
    return this.container.firstElementChild;
  }
  render() {
    this.container.innerHTML = `
        <select name=${this.name} id=${this.name}>
            ${this.options.map((option) => `<option value="${option.value}">${option.label}</option>`).join("")}
        </select>
    `;
  }
  setDropdownValue() {
    this.container.querySelectorAll("select").forEach(
      (element) => element.addEventListener("change", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLSelectElement)) return;
        __privateSet(this, _selectValue, target.value);
        this.onChange(__privateGet(this, _selectValue));
      })
    );
  }
}
_selectValue = new WeakMap();
class DropdownContainer {
  constructor({ dropdowns }) {
    __publicField(this, "container");
    __publicField(this, "dropdowns");
    this.container = document.createElement("div");
    this.container.classList.add("restaurant-filter-container");
    this.dropdowns = dropdowns;
    this.render();
  }
  get element() {
    return this.container;
  }
  render() {
    this.container.innerHTML = "";
    this.dropdowns.forEach((dropdown) => {
      if (dropdown.element) {
        this.container.appendChild(dropdown.element);
      }
    });
  }
}
const SELECT_OPTIONS = {
  category: [
    { value: "한식", label: "한식" },
    { value: "중식", label: "중식" },
    { value: "일식", label: "일식" },
    { value: "양식", label: "양식" },
    { value: "아시안", label: "아시안" },
    { value: "기타", label: "기타" }
  ],
  distance: [
    { value: "5", label: "5분 내" },
    { value: "10", label: "10분 내" },
    { value: "15", label: "15분 내" },
    { value: "20", label: "20분 내" },
    { value: "30", label: "30분 내" }
  ]
};
const DROPDOWN_OPTIONS = {
  category: [
    { value: "", label: "전체" },
    { value: "한식", label: "한식" },
    { value: "중식", label: "중식" },
    { value: "일식", label: "일식" },
    { value: "양식", label: "양식" },
    { value: "아시안", label: "아시안" },
    { value: "기타", label: "기타" }
  ],
  sort: [
    { value: "이름순", label: "이름순" },
    { value: "거리순", label: "거리순" }
  ]
};
const NAME_MAX_LENGTH = 20;
const DESCRIPTION_MAX_LENGTH = 200;
const CAPTION = {
  description: "메뉴 등 추가 정보를 입력해 주세요",
  link: "매장 정보를 확인할 수 있는 링크를 입력해 주세요"
};
const DELETE = "정말 삭제하시겠습니까? 삭제 이후에는 복구할 수 없습니다.";
const EMPTY_LIST = "음식점이 없습니다.";
const ERROR_MESSAGE = {
  required: "필수 입력 항목이 비어있습니다.",
  length: (length) => `최대 ${length}자까지 입력할 수 있습니다.`,
  url: "올바르지 않는 URL입니다. (http(s)~ 로 시작하는 URL을 입력해주세요.)"
};
function validateRequiredInput(input) {
  if (input.length === 0) {
    throw new Error(ERROR_MESSAGE.required);
  }
}
function validateLength(input, maxLength) {
  if (input.length > maxLength) {
    throw new Error(ERROR_MESSAGE.length(maxLength));
  }
}
function validateURL(input) {
  if (input.length === 0) {
    return;
  }
  try {
    new URL(input);
  } catch (error) {
    throw new Error(ERROR_MESSAGE.url);
  }
}
function Button({ name, type = "button", cssType = "primary", innerText, onClick = () => {
} }) {
  const button = document.createElement("button");
  button.name = name;
  button.type = type;
  button.classList.add("button");
  button.classList.add(`button--${cssType}`);
  button.classList.add("text-caption");
  button.innerText = innerText;
  button.addEventListener("click", () => {
    onClick();
  });
  return button;
}
function ButtonContainer({ buttons = [] }) {
  const container = document.createElement("div");
  container.className = "button-container";
  buttons.forEach((button) => container.appendChild(button));
  return container;
}
function renderCaption(caption) {
  return caption ? `<span class="help-text text-caption">${caption}</span>` : "";
}
function Input({ isRequired = false, name, label, caption = "" }) {
  const container = document.createElement("div");
  container.classList.add("form-item");
  if (isRequired) {
    container.classList.add("form-item--required");
  }
  container.innerHTML = `
  <label for="link text-caption">${label}</label>
  <input type="text" name="${name}" id="${name}" ${isRequired ? "required" : ""}/>
  ${renderCaption(caption)}
  `;
  return container;
}
function SelectInput({ isRequired = false, name, label, optionList = [] }) {
  const container = document.createElement("div");
  container.classList.add("form-item");
  if (isRequired) {
    container.classList.add("form-item--required");
  }
  container.innerHTML = `         
           <label for="category text-caption">${label}</label>
            <select name=${name} id=${name} ${isRequired ? "required" : ""}>
            <option value="">선택해 주세요</option>
            ${optionList.map((option) => {
    return `<option value="${option.value}">${option.label}</option>`;
  })}
            </select>
    `;
  return container;
}
function TextareaInput({ isRequired = false, name, label, caption }) {
  const container = document.createElement("div");
  container.classList.add("form-item");
  if (isRequired) {
    container.classList.add("form-item--required");
  }
  container.innerHTML = `
                <label for="description text-caption">${label}</label>
              <textarea
                name=${name}
                id="description"
                cols="30"
                rows="5"
                ${isRequired ? "required" : ""}
              ></textarea>
              <span class="help-text text-caption"
                >${caption}</span
              >
  `;
  return container;
}
const Alert = ({ message }) => {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.classList.add("text-body");
  alert.innerText = message;
  return alert;
};
function alertError(error) {
  if (!document.querySelector(".alert")) {
    document.querySelector("body").appendChild(Alert({ message: error }));
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 1500);
  }
}
const DEV_ERROR_MESSAGE = {
  invalidElement: "올바르지 않은 요소입니다.",
  notFound: (element) => `${element} : 요소를 찾을 수 없습니다.`,
  invalidErrorObject: "Error 인스턴스가 아닌 예외가 발생했습니다."
};
function isCategoryType(category) {
  const CATEGORY_VALUES = ["한식", "양식", "일식", "중식", "기타", "아시안"];
  return CATEGORY_VALUES.includes(category);
}
function isDistanceType(value) {
  const DISTANCE_VALUES = ["5", "10", "15", "20", "30"];
  return DISTANCE_VALUES.includes(value);
}
class FoodForm {
  constructor({ onCancel = () => {
  }, onSubmit = () => {
  } }) {
    __publicField(this, "container");
    this.container = document.createElement("form");
    this.container.setAttribute("novalidate", "true");
    const title = document.createElement("h2");
    title.classList.add("modal-title", "text-title");
    title.innerText = "새로운 음식점";
    this.container.appendChild(title);
    this.container.appendChild(
      SelectInput({
        isRequired: true,
        name: "category",
        label: "카테고리",
        optionList: SELECT_OPTIONS.category
      })
    );
    this.container.appendChild(
      Input({
        isRequired: true,
        name: "name",
        label: "이름"
      })
    );
    this.container.appendChild(
      SelectInput({
        isRequired: true,
        name: "distance",
        label: "거리(도보 이동 시간)",
        optionList: SELECT_OPTIONS.distance
      })
    );
    this.container.appendChild(
      TextareaInput({
        isRequired: false,
        label: "설명",
        name: "description",
        caption: CAPTION.description
      })
    );
    this.container.appendChild(
      Input({
        isRequired: false,
        label: "참고 링크",
        name: "link",
        caption: CAPTION.link
      })
    );
    this.container.appendChild(
      ButtonContainer({
        buttons: [
          Button({
            name: "cancel",
            cssType: "secondary",
            innerText: "취소하기",
            onClick: onCancel
          }),
          Button({
            name: "submit",
            type: "submit",
            cssType: "primary",
            innerText: "추가하기"
          })
        ]
      })
    );
    this.container.onsubmit = (e) => {
      e.preventDefault();
      try {
        const formData = this.getFormInputs();
        this.validateFoodForm(formData);
        onSubmit(formData);
        this.container.reset();
      } catch (error) {
        if (!(error instanceof Error)) {
          throw new Error(DEV_ERROR_MESSAGE.invalidErrorObject);
        }
        alertError(error.message);
      }
    };
  }
  getFormInputs() {
    const formData = new FormData(this.container);
    const formObject = Object.fromEntries(formData.entries());
    const category = String(formObject.category);
    if (!isCategoryType(category)) throw new Error("잘못된 카테고리");
    const distance = String(formObject.distance);
    if (!isDistanceType(distance)) throw new Error("잘못된 거리");
    const foodItem = {
      id: crypto.randomUUID(),
      isFavorite: false,
      name: String(formObject.name),
      category,
      distance,
      description: String(formObject.description),
      link: String(formObject.link)
    };
    return foodItem;
  }
  validateFoodForm(formData) {
    validateRequiredInput(formData.category);
    validateRequiredInput(formData.name);
    validateLength(formData.name, NAME_MAX_LENGTH);
    validateRequiredInput(formData.distance);
    if (formData.description) {
      validateLength(formData.description, DESCRIPTION_MAX_LENGTH);
    }
    if (formData.link) {
      validateURL(formData.link);
    }
  }
  get element() {
    return this.container;
  }
}
class Modal {
  constructor({ content }) {
    __privateAdd(this, _isOpen, false);
    __privateAdd(this, _content);
    __privateAdd(this, _container);
    __privateSet(this, _content, content);
    __privateSet(this, _container, document.createElement("div"));
    __privateGet(this, _container).classList.add("modal");
    __privateGet(this, _container).innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-container">
      </div>
      
`;
    __privateGet(this, _container).querySelector(".modal-container").appendChild(__privateGet(this, _content));
    __privateGet(this, _container).querySelector(".modal-backdrop").addEventListener("click", () => this.close());
    this.close();
  }
  open() {
    __privateSet(this, _isOpen, true);
    __privateGet(this, _container).classList.add("modal--open");
  }
  close() {
    __privateSet(this, _isOpen, false);
    __privateGet(this, _container).classList.remove("modal--open");
  }
  get isOpen() {
    return __privateGet(this, _isOpen);
  }
  get element() {
    return __privateGet(this, _container);
  }
}
_isOpen = new WeakMap();
_content = new WeakMap();
_container = new WeakMap();
const categoryMap = {
  한식: { imgAlt: "한식", imgSrc: "./category-korean.png" },
  중식: { imgAlt: "중식", imgSrc: "./category-chinese.png" },
  일식: { imgAlt: "일식", imgSrc: "./category-japanese.png" },
  양식: { imgAlt: "양식", imgSrc: "./category-western.png" },
  아시안: { imgAlt: "아시안", imgSrc: "./category-asian.png" },
  기타: { imgAlt: "기타", imgSrc: "./category-etc.png" }
};
function getImgSrcAlt(category) {
  return categoryMap[category] || categoryMap["기타"];
}
class FoodItem {
  constructor({ data, cssType, onFavoriteClick, onFoodItemClick }) {
    __publicField(this, "container");
    __privateAdd(this, _data);
    __privateAdd(this, _cssType);
    __privateAdd(this, _onFavoriteClick);
    __privateAdd(this, _onFoodItemClick);
    __privateSet(this, _data, data);
    __privateSet(this, _cssType, cssType);
    __privateSet(this, _onFavoriteClick, onFavoriteClick);
    __privateSet(this, _onFoodItemClick, onFoodItemClick);
    this.container = document.createElement("div");
    this.render();
    this.setUpFavoriteToggle();
    this.setUpDetailModal();
  }
  get element() {
    return this.container.firstElementChild;
  }
  render() {
    const { imgAlt, imgSrc } = getImgSrcAlt(__privateGet(this, _data).category);
    this.container.innerHTML = `
              <li class="restaurant">
            <div class="restaurant__category">
              <img
                src=${imgSrc}
                alt=${imgAlt}
                class="category-icon"
              />
            </div>
            <div class="restaurant__info">
              <h3 class="restaurant__name text-subtitle">${__privateGet(this, _data).name}</h3>
              <span class="restaurant__distance text-body"
                >캠퍼스부터 ${__privateGet(this, _data).distance}분 내</span
              >
              <p class="restaurant__description ${__privateGet(this, _cssType) === "column" ? "restaurant__description-detail" : ""} text-body">
               ${__privateGet(this, _data).description}
              </p>
              ${__privateGet(this, _cssType) === "column" && __privateGet(this, _data).link ? `<p>${__privateGet(this, _data).link}</p>` : ""}
              <img src=${this.getBookmarkIconSrc()} alt="즐겨찾기" class="favorite-icon">
            </div>
          </li>
  `;
    this.setDetailCss();
  }
  setUpFavoriteToggle() {
    const bookmarkIcon = this.container.querySelector(".favorite-icon");
    if (!bookmarkIcon) {
      throw new Error(DEV_ERROR_MESSAGE.notFound("favorite-icon"));
    }
    bookmarkIcon.addEventListener("click", this.handleFavoriteClick.bind(this));
  }
  handleFavoriteClick(event) {
    event.stopPropagation();
    __privateGet(this, _onFavoriteClick).call(this, __privateGet(this, _data).id);
    this.render();
    this.updateFavoriteIcon();
  }
  updateFavoriteIcon() {
    const bookmarkIcon = this.container.querySelector(".favorite-icon");
    if (!bookmarkIcon) {
      throw new Error(DEV_ERROR_MESSAGE.notFound("favorite-icon"));
    }
    bookmarkIcon.setAttribute("src", this.getBookmarkIconSrc());
  }
  getBookmarkIconSrc() {
    return __privateGet(this, _data).isFavorite ? "./favorite-icon-filled.png" : "./favorite-icon-lined.png";
  }
  setDetailCss() {
    const listItem = this.container.querySelector("li");
    if (!listItem) {
      throw new Error(DEV_ERROR_MESSAGE.notFound("listItem"));
    }
    if (__privateGet(this, _cssType) === "column") {
      listItem.classList.add("restaurant-detail");
    }
  }
  setUpDetailModal() {
    const listItem = this.container.querySelector("li");
    if (!listItem) {
      throw new Error(DEV_ERROR_MESSAGE.notFound("listItem"));
    }
    listItem.addEventListener("click", () => {
      __privateGet(this, _onFoodItemClick).call(this, __privateGet(this, _data));
    });
  }
}
_data = new WeakMap();
_cssType = new WeakMap();
_onFavoriteClick = new WeakMap();
_onFoodItemClick = new WeakMap();
const FOOD_ITEMS_KEY = "foodItems";
function storeFoodItems(foodItems) {
  localStorage.setItem(FOOD_ITEMS_KEY, JSON.stringify(foodItems));
}
function getStoredFoodItems() {
  const storedItems = localStorage.getItem(FOOD_ITEMS_KEY);
  return storedItems ? JSON.parse(storedItems) : [];
}
function filterFoodItemsByCategory(category, foodItems) {
  if (category === "") {
    return foodItems;
  }
  return foodItems.filter((foodItem) => foodItem.category === category);
}
function sortFoodItem(sortOption, foodItems) {
  if (sortOption === "이름순") {
    foodItems.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sortOption === "거리순") {
    foodItems.sort((a, b) => Number(a.distance) - Number(b.distance));
  }
  return foodItems;
}
class FoodListManager {
  constructor(initialFoodItems) {
    __privateAdd(this, _foodItems);
    __privateAdd(this, _selectedFilter, "");
    __privateAdd(this, _selectedSortType, "이름순");
    __privateAdd(this, _currentMenu, "all");
    __privateSet(this, _foodItems, initialFoodItems);
  }
  getItems() {
    return [...__privateGet(this, _foodItems)];
  }
  setFilterType(category) {
    __privateSet(this, _selectedFilter, category);
  }
  setSortType(sortType) {
    __privateSet(this, _selectedSortType, sortType);
  }
  setCurrentMenu(currentMenu) {
    __privateSet(this, _currentMenu, currentMenu);
  }
  processFoodItems() {
    const filteredFavoriteFoodItems = this.filterFavoriteFoodItems(__privateGet(this, _currentMenu));
    const filteredFoodItems = filterFoodItemsByCategory(__privateGet(this, _selectedFilter), filteredFavoriteFoodItems);
    return sortFoodItem(__privateGet(this, _selectedSortType), filteredFoodItems);
  }
  addItem(foodItem) {
    __privateSet(this, _foodItems, [...__privateGet(this, _foodItems), foodItem]);
    storeFoodItems(__privateGet(this, _foodItems));
  }
  deleteFoodItem(id) {
    __privateSet(this, _foodItems, __privateGet(this, _foodItems).filter((foodItem) => foodItem.id !== id));
    storeFoodItems(__privateGet(this, _foodItems));
  }
  toggleFavoriteFoodItem(id) {
    __privateSet(this, _foodItems, __privateGet(this, _foodItems).map((foodItem) => {
      if (foodItem.id === id) {
        return { ...foodItem, isFavorite: !foodItem.isFavorite };
      }
      return foodItem;
    }));
    storeFoodItems(__privateGet(this, _foodItems));
  }
  filterFavoriteFoodItems(tabMenu) {
    let favoriteFoodItems;
    if (tabMenu === "favorite") {
      favoriteFoodItems = __privateGet(this, _foodItems).filter((foodItem) => foodItem.isFavorite);
      return favoriteFoodItems;
    }
    return [...__privateGet(this, _foodItems)];
  }
}
_foodItems = new WeakMap();
_selectedFilter = new WeakMap();
_selectedSortType = new WeakMap();
_currentMenu = new WeakMap();
class FoodList {
  constructor({ foodItems }) {
    __publicField(this, "foodListManager");
    __publicField(this, "foodList");
    this.foodListManager = new FoodListManager(foodItems);
    this.foodList = document.createElement("ul");
    this.foodList.className = "restaurant-list";
    console.log(foodItems);
    this.updateSortItem("이름순");
  }
  get element() {
    return this.foodList;
  }
  render(foodItems = this.foodListManager.getItems()) {
    this.foodList.innerHTML = "";
    if (foodItems.length === 0) {
      this.showEmptyListMessage();
      return;
    }
    const foodFragment = document.createDocumentFragment();
    foodItems.forEach((foodItem) => {
      const foodItemElement = new FoodItem({
        data: foodItem,
        cssType: "row",
        onFavoriteClick: (id) => {
          this.updateFavoriteItem(id);
        },
        onDeleteClick: (id) => {
          this.updateDeleteItem(id);
        },
        onFoodItemClick: (foodItem2) => {
          this.renderDetailModal(foodItem2);
        }
      }).element;
      if (!foodItemElement) {
        throw new Error(DEV_ERROR_MESSAGE.notFound("foodItemElement"));
      }
      foodFragment.appendChild(foodItemElement);
    });
    this.foodList.appendChild(foodFragment);
  }
  renderDetailModal(foodItem) {
    const fragment = document.createDocumentFragment();
    const detailFoodItem = new FoodItem({
      data: foodItem,
      cssType: "column",
      onFavoriteClick: (id) => {
        this.updateFavoriteItem(id);
      },
      onDeleteClick: (id) => {
        this.updateDeleteItem(id);
        detailModal.close();
      },
      onFoodItemClick: () => {
      }
    });
    if (!detailFoodItem.element) {
      throw new Error(DEV_ERROR_MESSAGE.notFound("detailFoodItem.element"));
    }
    fragment.appendChild(detailFoodItem.element);
    const buttonContainer = ButtonContainer({
      buttons: [
        Button({
          name: "delete",
          innerText: "삭제하기",
          cssType: "secondary",
          onClick: () => {
            this.updateDeleteItem(foodItem.id);
            detailModal.close();
          }
        }),
        Button({ name: "close", innerText: "닫기", onClick: () => detailModal.close() })
      ]
    });
    fragment.appendChild(buttonContainer);
    const detailModal = new Modal({ content: fragment });
    detailModal.open();
    document.body.appendChild(detailModal.element);
  }
  showEmptyListMessage() {
    this.foodList.innerHTML = `
      <p class="empty-message">${EMPTY_LIST}</p>
    `;
  }
  updateAddItem(foodItem) {
    this.foodListManager.addItem(foodItem);
    this.render(this.foodListManager.processFoodItems());
  }
  updateFavoriteItem(id) {
    this.foodListManager.toggleFavoriteFoodItem(id);
    this.render(this.foodListManager.processFoodItems());
  }
  updateDeleteItem(id) {
    if (confirm(DELETE)) {
      this.foodListManager.deleteFoodItem(id);
      this.render(this.foodListManager.processFoodItems());
    }
  }
  updateFilterItem(category) {
    this.foodListManager.setFilterType(category);
    this.render(this.foodListManager.processFoodItems());
  }
  updateSortItem(sortType) {
    this.foodListManager.setSortType(sortType);
    this.render(this.foodListManager.processFoodItems());
  }
  updateFavoriteList(tabMenu) {
    this.foodListManager.setCurrentMenu(tabMenu);
    this.render(this.foodListManager.processFoodItems());
  }
}
function IconButton({ cssType = "primary", name, imgSrc, label, onClick = () => {
} }) {
  const container = document.createElement("div");
  container.innerHTML = `
    <button type="button" class="icon-button--${cssType}" aria-label="${label}" name=${name}>
    <img src="${imgSrc}" alt="${label}" /></button
  >
  `;
  container.querySelector("button").addEventListener("click", () => {
    onClick();
  });
  return container.firstElementChild;
}
function Header({ title = "제목", onAddClick = () => {
} }) {
  const header = document.createElement("header");
  header.className = "gnb";
  header.innerHTML = `
    <h1 class="gnb__title text-title">${title}</h1>
   `;
  header.appendChild(
    IconButton({
      name: "add",
      imgSrc: "./add-button.png",
      label: "음식점 추가",
      onClick: onAddClick
    })
  );
  return header;
}
class TabMenu {
  constructor({ onTabChange }) {
    __publicField(this, "container");
    __privateAdd(this, _currentMenu2, "all");
    __privateAdd(this, _onTabChange, () => {
    });
    this.container = document.createElement("div");
    this.container.classList.add("tabmenu-container");
    this.render();
    __privateSet(this, _onTabChange, onTabChange);
  }
  get element() {
    return this.container;
  }
  get currentMenu() {
    return __privateGet(this, _currentMenu2);
  }
  render() {
    this.container.innerHTML = `
     <button class="tabmenu-item" data-tab="all">모든 음식점</button>
     <button class="tabmenu-item" data-tab="favorite">자주 가는 음식점</button>
    `;
    this.setActiveTabStyle();
    this.handleCurrentMenu();
  }
  handleCurrentMenu() {
    const tabMenuItem = this.container.querySelectorAll(".tabmenu-item");
    if (!tabMenuItem) {
      throw new Error(DEV_ERROR_MESSAGE.notFound("tabmenu-item"));
    }
    tabMenuItem.forEach(
      (tabMenu) => tabMenu.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLButtonElement)) {
          throw new Error(DEV_ERROR_MESSAGE.invalidElement);
        }
        const currentMenu = target.dataset.tab;
        if (currentMenu === "all" || currentMenu === "favorite") {
          __privateSet(this, _currentMenu2, currentMenu);
          this.setActiveTabStyle();
          __privateGet(this, _onTabChange).call(this, this.currentMenu);
        }
      })
    );
  }
  setActiveTabStyle() {
    const tabMenuActiveClass = this.container.querySelector(".tabmenu--active");
    if (tabMenuActiveClass) {
      tabMenuActiveClass.classList.remove("tabmenu--active");
    }
    const currentMenuTab = this.container.querySelector(`[data-tab=${__privateGet(this, _currentMenu2)}]`);
    if (!currentMenuTab) {
      throw new Error(DEV_ERROR_MESSAGE.notFound(`[data-tab=${__privateGet(this, _currentMenu2)}]`));
    }
    currentMenuTab.classList.add("tabmenu--active");
  }
}
_currentMenu2 = new WeakMap();
_onTabChange = new WeakMap();
class MainPage {
  constructor() {
    __publicField(this, "container");
    __publicField(this, "foodList");
    __publicField(this, "modal");
    __publicField(this, "foodForm");
    __publicField(this, "tabMenu");
    __publicField(this, "filterDropdown");
    __publicField(this, "sortDropdown");
    __publicField(this, "dropdownContainer");
    this.foodList = new FoodList({ foodItems: getStoredFoodItems() });
    this.foodForm = new FoodForm({
      onCancel: () => this.modal.close(),
      onSubmit: (formItem) => this.handleSubmit(formItem)
    });
    this.modal = new Modal({
      content: this.foodForm.element
    });
    this.tabMenu = new TabMenu({ onTabChange: (currentMenu) => this.foodList.updateFavoriteList(currentMenu) });
    this.filterDropdown = new Dropdown({ name: "category", options: DROPDOWN_OPTIONS.category, onChange: this.handleFilterChange.bind(this) });
    this.sortDropdown = new Dropdown({ name: "sort", options: DROPDOWN_OPTIONS.sort, onChange: this.handleSortChange.bind(this) });
    this.dropdownContainer = new DropdownContainer({ dropdowns: [this.filterDropdown, this.sortDropdown] });
    this.container = document.createElement("div");
    this.render();
  }
  handleFilterChange() {
    this.foodList.updateFilterItem(this.filterDropdown.selectValue);
  }
  handleSortChange() {
    this.foodList.updateSortItem(this.sortDropdown.selectValue);
  }
  handleSubmit(foodItem) {
    this.foodList.updateAddItem(foodItem);
    this.modal.close();
  }
  render() {
    this.container.innerHTML = "";
    const body = document.querySelector("body");
    body.appendChild(this.modal.element);
    body.appendChild(Header({ title: "점심 뭐 먹지?", onAddClick: () => this.modal.open() }));
    body.appendChild(this.tabMenu.element);
    body.appendChild(this.container);
    this.renderDynamicSection();
  }
  renderDynamicSection() {
    this.container.appendChild(this.dropdownContainer.element);
    this.container.appendChild(this.foodList.element);
  }
}
window.addEventListener("load", () => {
  new MainPage();
});
