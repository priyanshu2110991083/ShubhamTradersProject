const url = "http://localhost:300/store.json"


    const productContainer = document.getElementById('product-container');
    const searchInput = document.getElementById('search-input');

    function renderProducts(productList) {
        console.log({productList}); 

        productList.forEach(p => console.log(p)); 
        
        productContainer.innerHTML = '';

        productList.forEach(product => {
            console.log("in for each"); 
            console.log(product.name); 
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
            buyNow.href = product.buyNow;
            buyNow.textContent = 'Buy Now';

            productCard.appendChild(image);
            productCard.appendChild(name);
            productCard.appendChild(use);
            productCard.appendChild(price);
            productCard.appendChild(buyNow);

            productContainer.appendChild(productCard);
            
        });
    }


async function searchProducts(){
        const data=await fetch(url)
        const product = await data.json();
        const searchTerm = searchInput.value.toLowerCase();
        console.log(searchTerm)
        const searchResults = product.filter(prod =>
            prod.name.toLowerCase().includes(searchTerm) ||
            prod.use.toLowerCase().includes(searchTerm) ||
            prod.type.toLowerCase().includes(searchTerm) || 
            prod.name.toLowerCase().includes(searchTerm.substring(0,4))||
            prod.name.toLowerCase().includes(searchTerm.substring(0,2))
        );
            console.log(searchTerm.substring(0,4))
        renderProducts(searchResults);
}

    // Initial rendering of all products
async function initial(){
      const response=await fetch(url);
      const data=await response.json()
      console.log(data)
      renderProducts(data);
}
initial()        //suddenly this option is closed to run this just call initial funcrion
