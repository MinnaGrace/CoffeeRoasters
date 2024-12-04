export const formatPrice = (price)=>{
    let formatttedPrice = new Intl.NumberFormat('en-US',{
        style:'currency',
        currency:'USD'
    }).format(price/100)
    return formatttedPrice
}

