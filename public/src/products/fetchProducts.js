import {formatPrice} from '../utils/utils.js'
const setStorageItem = (name, item) => {
  localStorage.setItem(name, JSON.stringify(item));
};
const getStorageItem = (item) => {
  let storageItem = localStorage.getItem(item);
  if (storageItem) {
    storageItem = JSON.parse(localStorage.getItem(item));
  } else storageItem = [];

  return storageItem;
};
let store = getStorageItem('store')

const fetchProducts = async () => {
  try {
    const response = await fetch("/api/v1/products");
    if (!response.ok) {
      throw new Error(`error: ${response.status}`);
    }
    const data = await response.json();
    return data.products;
    
  } catch (error) {
    console.error("Fetch error:", error);
  }
};
const productsContainer = document.querySelector('.products')
const display =(products,element)=>{
  element.innerHTML = products.map((product)=>{
    const {id, name,image,price} = product
    return `<article class="product">
          <div class="product-container">
            <img src = "${image}"
            class = "product-img" alt ="product image"
            >

            <!-- product-icon -->
            <div class="product-icons">
              <a href = "product.html?id=${id}" class="product-icon">
                <i class ="fas fa-search"></i>
              </a>
              <button class = "product-cart-btn product-icon" data-id=${id}>
                <i class="fas fa-shopping-cart"></i>
              </button>
            </div>
          </div>
            <footer>
              <p class="product-name">${name}</p>
              <h4 class="product-price">${formatPrice(price)}</h4>
            </footer>
         
        </article>`;
  }).join('')
  
}

const populateStoreProducts = async (products) => {
   // Fetch the products here
  store = products.map((product)=>{
    const {image, name,description,featured} = product
    return { image, name, description,featured };
  })
  setStorageItem('store',store)
}
const init = async () => {
  const products = await fetchProducts();
  populateStoreProducts(products);
  const featuredProducts = store.filter((product) => {
    return product.featured === true;
  });
  display(products,productsContainer);
};

window.addEventListener('DOMContentLoaded', init)


