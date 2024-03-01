
const url = "http://localhost:300/strs";

function updateTotal(price, quantity,id) {
    const MainDiv=document.getElementById(id);
    const totalElement = MainDiv.querySelector('#total');
    const total = (price * quantity).toFixed(2);
    totalElement.innerText = total;
    const productString=localStorage.getItem("ProductArray");
    const productArray=JSON.parse(productString)
    for(let item of productArray){
        if(item.product._id==id){
            item.userQuantity=quantity;
        }
    }
    localStorage.setItem("ProductArray",JSON.stringify(productArray))
    const Price=GrandPrice()
    const body=document.body;
    const grandTotalDiv=body.querySelector('.grand-total');
    grandTotalDiv.remove(); //first remove the element
    //then add new one
    createPaymentForm(Price)
}

const body = document.body;
//converting string to array
const productIds = JSON.parse(localStorage.getItem("ProductArray")) || [];

function GrandPrice(){
    const product=JSON.parse(localStorage.getItem("ProductArray")) || [];
    var grandPrice=0;
    for(var i=0;i<product.length;i++){
        grandPrice+=product[i].product.price*product[i].userQuantity;
    }

    return grandPrice;
}



var getCookies = function () {
    var pairs = document.cookie.split(";");
    var cookies = {};
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split("=");
        cookies[(pair[0] + '').trim()] = unescape(pair.slice(1).join('='));
    }
    return cookies;
}

const cookies = getCookies();
if (cookies.logged_In == "true" && cookies.username && productIds.length > 0) {
    async function productData(productId) {
        const response = await fetch(url);
        const products = await response.json();
        const data = products.find(product => product._id === productId.product._id);
        

        if (data) {
            const container = document.createElement("div");
            container.classList.add("container");
            container.id=data._id
            
            const product = document.createElement("div");
            product.classList.add("product");
            
            const product_image = document.createElement("div");
            product_image.classList.add("product-image");

            const product_details = document.createElement("div");
            product_details.classList.add("product-details");
            
            const img = document.createElement("img");
            product_image.appendChild(img);
            img.src = data.image;
            img.alt = "Product Image";

            product.appendChild(product_image);
            product.appendChild(product_details);

            container.appendChild(product);

            const h1 = document.createElement("h1");
            h1.innerHTML = data.name;
            const p = document.createElement("p");
            p.innerHTML = data.use;
            const price_quantity = document.createElement("div");
            price_quantity.classList.add("price-quantity");
            const price = document.createElement("p");
            const span = document.createElement("span");
            span.id = 'price';
            span.innerHTML = (data.price);
            price.appendChild(span);
            const label = document.createElement("label");
            label.for = "quantity";
            
           
            const input = document.createElement("input");
            input.type = "number";
            input.id = "quantity";
            input.name = "quantity";
            input.min = "1";
            input.value = productId.userQuantity;
            const maxQuantity = productId.product.quantity; // Change this to your desired maximum quantity

        input.addEventListener('input', function () {
            // Parse the input value to an integer
            let quantity = parseInt(input.value);

            // Check if the quantity exceeds the maximum allowed
            if (quantity > maxQuantity) {
                // If it does, set it to the maximum allowed quantity
                quantity = maxQuantity;
                input.value = quantity;

                const errorMessage = document.getElementById('error-message');
                if (!errorMessage) {
                    const message = document.createElement('p');
                    message.id = 'error-message';
                    message.style.color = 'red';
                    message.textContent = `Only ${maxQuantity} in stock`;
                    input.parentNode.appendChild(message);
                }
            }
            else {
                // If the quantity is within the allowed range, remove the error message
                const errorMessage = document.getElementById('error-message');
                if (errorMessage) {
                    errorMessage.parentNode.removeChild(errorMessage);
                }
            }

            // Call your updateTotal function with the updated quantity
            updateTotal(data.price, quantity, data._id);
        });
            
            price_quantity.appendChild(price);
            price_quantity.appendChild(label);
            price_quantity.appendChild(input);
            
            const total_buy_now = document.createElement("div");
            total_buy_now.classList.add("total-buy-now");
            const total = document.createElement("p");
            const span2 = document.createElement("span");
            span2.id = "total";
            span2.innerHTML = data.price*productId.userQuantity;
            total.appendChild(span2);
            const button = document.createElement("button");
            button.classList.add("add-to-cart");
            button.innerHTML = "Buy Now";
            
            const deleteItem = document.createElement("button");
            deleteItem.classList.add("delete-from-cart");
            deleteItem.id = "del";
            deleteItem.innerHTML = "Delete";
            deleteItem.addEventListener('click', function () {
                const deletedProductId = data._id;
                const updatedProductIds = productIds.filter(id => id.product._id !== deletedProductId);
                localStorage.setItem("ProductArray", JSON.stringify(updatedProductIds));
                
                // Remove the container with the matching product ID
                container.parentNode.removeChild(container);
                GrandPrice();
                location.reload();
            });
            
            const order_info = document.createElement("div");
            order_info.classList.add("order_info");
            const idP = document.createElement("p");
            const idS = document.createElement("span");
            idP.innerHTML = "Order ID : ";
            idS.id = "orderId";
            idS.innerHTML = data._id;
            idP.appendChild(idS);
            order_info.appendChild(idP);
            
            total_buy_now.appendChild(total);
            total_buy_now.appendChild(button);
            total_buy_now.appendChild(deleteItem);
            
            product_details.appendChild(order_info);
            product_details.appendChild(h1);
            product_details.appendChild(p);
            product_details.appendChild(price_quantity);
            product_details.appendChild(total_buy_now);
            
            body.appendChild(container);
            
        }
    }
    
    // Fetch product data for each product ID
    productIds.forEach(productId => {
        productData(productId);
    });
}

function fetchData() {
    return new Promise(resolve => {
        // Simulating asynchronous behavior with setTimeout
        setTimeout(() => {
            resolve();
        }, 500); // Replace with your actual asynchronous logic
    });
}



// Function to create and append the payment form
function createPaymentForm(grandPrice) {
    const grandTotalDiv = document.createElement('div');
    grandTotalDiv.classList.add('grand-total');
    grandTotalDiv.innerHTML = `<p>Grand Total: $${grandPrice}</p>`; // You can customize this content

    // Create a form element
    const paymentForm = document.createElement('form');
    paymentForm.method = 'post';
    paymentForm.action = '/payment';

    

    // Create a submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'buy-now-btn';
    submitButton.textContent = 'Buy Now';

    // Append the input field and submit button to the form
    paymentForm.appendChild(submitButton);

    // Append the form to the grand total div
    grandTotalDiv.appendChild(paymentForm);

    // Append the grand total div to the body
    document.body.appendChild(grandTotalDiv);

    const product=JSON.parse(localStorage.getItem("ProductArray")) || [];
    const user=localStorage.getItem("username")
}

// Check if the body contains a div with class "container" after asynchronous function
fetchData().then(() => {
    const containerDiv = document.querySelector('body .container');

    if (containerDiv) {
        const Price = GrandPrice(); // Replace with your actual grand total

        // Create and append the payment form with the Buy Now button
        createPaymentForm(Price);
    }
});