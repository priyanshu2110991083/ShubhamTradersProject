const url = "http://localhost:300/strs"

const productContainer = document.getElementById('product-container');
const searchInput = document.getElementById('search-input');

function renderProducts(productList) {

    productList.forEach(p => console.log(p)); 
    
    productContainer.innerHTML = '';

    productList.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('col-md-4');

        const image = document.createElement('img');
        image.src = product.image;
        image.alt = product.name;
        image.style.maxWidth = '100%';
        image.style.maxHeight = '50%';

        const name = document.createElement('h3');
        name.textContent = product.name;

        const use = document.createElement('p');
        use.textContent = product.use;

        const price = document.createElement('p');
        price.textContent = `₹${product.price.toFixed(2)}`;

        const buyNow = document.createElement('a');
        buyNow.href = "Payment.html";
        buyNow.textContent = 'Buy Now';
        
            // const Add_To_Cart = document.createElement('button');
            // Add_To_Cart.textContent = 'Add To Cart';
            // Add_To_Cart.style.borderRadius="10px"
            // Add_To_Cart.style.marginLeft="10px"
            // Add_To_Cart.style.backgroundColor="skyblue"
        

        productCard.appendChild(image);
        productCard.appendChild(name);
        productCard.appendChild(use);
        productCard.appendChild(price);
        productCard.appendChild(buyNow);
        // productCard.appendChild(Add_To_Cart);

        productContainer.appendChild(productCard);
        
    });
}


async function searchProducts(){

        const data=await fetch(url)
        const product = await data.json();
        const searchTerm = searchInput.value.toLowerCase();
        if(!searchTerm){
            renderProducts([]);
            return;
        }
        // console.log(searchTerm)
        const searchResults = product.filter(prod =>
            prod.name.toLowerCase().includes(searchTerm) ||
            prod.use.toLowerCase().includes(searchTerm) ||
            prod.type.toLowerCase().includes(searchTerm) || 
            prod.name.toLowerCase().includes(searchTerm.substring(0,4))||
            prod.name.toLowerCase().includes(searchTerm.substring(0,2))
        );
            // console.log(searchTerm.substring(0,4))
        renderProducts(searchResults);
}
searchProducts()
    // Initial rendering of all products
async function initial(){
    const response=await fetch(url);  
    const data=await response.json()    //WITH FETCH WE WILL USE .JSON() KEYWORD TO TAKE OUT DATA FROM RESPONSE
    console.log(data)  
    renderProducts(data);             //BUT WITH AXIOS WE NEED TO ISE RESPONSE.DATA TO FETCH OUT DATA
}
//initial()        //suddenly this option is closed to run this just call initial funcrion
// Assuming you are running this code in a web browser environment or using a tool like Node.js

