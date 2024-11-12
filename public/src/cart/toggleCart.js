const cartOverlay = document.getElementById('cart-overlay');
const cartContainer = document.querySelector('.cart-container')
const cartCloseBtn = document.querySelector('.cart-close')
const cartIcon = document.querySelector('.cart-icon')

cartIcon.addEventListener('click', (e)=>{
    cartContainer.classList.add('show')
    cartOverlay.style.display = 'block';
})
cartCloseBtn.addEventListener('click', ()=>{
    cartContainer.classList.remove('show')
    cartOverlay.style.display = 'none';
    
})



export const openCart = () => {
    //cartOverlay.classList.add('show')
};

