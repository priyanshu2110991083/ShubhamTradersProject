const url = "http://localhost:300/strs"

const productContainer = document.getElementById('product-container');
const searchInput = document.getElementById('search-input');
const del1=document.getElementById("del1");
const del2=document.getElementById("del2");
const name1=document.getElementById("name1");
const name2=document.getElementById("name2");
const add1=document.getElementById("add1");
const add2=document.getElementById("add2");
const cart=document.getElementById("cart")
const order=document.getElementById("order")
//initially name ki display none rhegi
add1.style.display="none";
add2.style.display="none";
cart.style.display="none"
name1.style.display="none";
name2.style.display="none";
order.style.display="none";

// const username = document.cookie.get('username');

//below funcrion is to take cookie data as cookie comes in another format so we need to reduce it in simple format
var getCookies = function(){
    var pairs = document.cookie.split(";");
    var cookies = {};
    for (var i=0; i<pairs.length; i++){
      var pair = pairs[i].split("=");
      cookies[(pair[0]+'').trim()] = unescape(pair.slice(1).join('='));
    }
    return cookies;
  }

const h1 = document.getElementById("loginUser")
const cookies = getCookies();
console.log(cookies)
if((cookies.username.toLowerCase()==="priyanshu" || cookies.username.toLowerCase()==="tarun") && cookies.logged_In=="true"){
    add1.style.display="block"
    add2.style.display="block"
    del1.style.display="none"
    del2.style.display="none"
    h1.innerText = cookies.username;
    name1.style.display="block"
    name2.style.display="block"
    order.style.display="block"
}
else if (cookies.username && cookies.logged_In=="true") {
    name1.style.display="block"
    name2.style.display="block"
    del1.style.display="none"
    del2.style.display="none"
    h1.innerText = cookies.username;
    cart.style.display="block"
} 
else {
    name1.style.display="none"
    name2.style.display="none"
    del1.style.display="block"
    del2.style.display="block"
}



//adding to local host
if (cookies.username && cookies.logged_In === "true") {
    localStorage.setItem("username", cookies.username);

    // Fetch existing product IDs array from local storage
    var ProductArray = JSON.parse(localStorage.getItem("ProductArray")) || [];

    // Add a click event listener to the container holding all items
    document.addEventListener('click', async function (event) {
        const target = event.target;

        // Check if the clicked element is the "Buy Now" button
        if (target.classList.contains('buyNow')) {
            const response = await fetch(url);
            const data = await response.json();
            const itemId = target.parentNode.id;
            const product = getProductById(data, itemId);
            console.log(product,"p")
            console.log(ProductArray, "a")
            // Add the product ID to the array
            const duplicateIndex=ProductArray.findIndex(e => e.product._id===product._id)
            console.log(duplicateIndex)
            if(duplicateIndex!=-1){
                ProductArray[duplicateIndex].userQuantity++;
            }
            else{

                ProductArray.push({
                    product,
                    userQuantity:1,
                });
            }

            // Update local storage with the modified array
            localStorage.setItem("ProductArray", JSON.stringify(ProductArray));
            window.alert("Item Added to Cart")
        }
    });
} else {
    localStorage.clear();
}




//finding products
function getProductById(products, productId) {
    return products.find(product => product._id === productId);
}


function renderProducts(productList) {

    
    productContainer.innerHTML = '';

    productList.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('col-md-4');
        productCard.id=product._id;
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

        const buyNow = document.createElement('button');
        buyNow.textContent = 'Add To Cart';
        buyNow.classList.add("buyNow")
        buyNow.id="addToCart"
        // const form=document.createElement("form")
        // form.action="/payment"
        // form.method="post"
        // form.appendChild(buyNow)
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

    renderProducts(data);             //BUT WITH AXIOS WE NEED TO ISE RESPONSE.DATA TO FETCH OUT DATA
}
//initial()        //suddenly this option is closed to run this just call initial funcrion
// Assuming you are running this code in a web browser environment or using a tool like Node.js

