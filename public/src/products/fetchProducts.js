
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

const populateStoreProducts = async () => {
  const products = await fetchProducts(); // Fetch the products here
  store = products.map((product)=>{
    const {image, name,description} = product
    return { image, name, description };
  })
  setStorageItem('store',store)
}
console.log(store)
window.addEventListener('DOMContentLoaded', populateStoreProducts)


