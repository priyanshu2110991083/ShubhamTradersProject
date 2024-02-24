
const url = "http://localhost:300/strs";

function updateTotal(price, quantity) {
    const totalElement = document.getElementById('total');
    const total = (price * quantity).toFixed(2);
    totalElement.innerText = total;
}

const body = document.body;
const productIds = JSON.parse(localStorage.getItem("ProductArray")) || [];
const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

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
        const data = products.find(product => product._id === productId);

        if (data) {
            const container = document.createElement("div");
            container.classList.add("container");

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
            span.innerHTML = data.price;
            price.appendChild(span);
            const label = document.createElement("label");
            label.for = "quantity";

            const input = document.createElement("input");
            input.type = "number";
            input.id = "quantity";
            input.name = "quantity";
            input.min = "1";
            input.value = "1";
            input.addEventListener('input', function () {
                updateTotal(data.price, parseInt(input.value));
            });

            price_quantity.appendChild(price);
            price_quantity.appendChild(label);
            price_quantity.appendChild(input);

            const total_buy_now = document.createElement("div");
            total_buy_now.classList.add("total-buy-now");
            const total = document.createElement("p");
            const span2 = document.createElement("span");
            span2.id = "total";
            span2.innerHTML = data.price;
            total.appendChild(span2);
            const button = document.createElement("button");
            button.classList.add("add-to-cart");
            button.innerHTML = "Buy Now";
            button.addEventListener('click', function () {
                const cartItem = {
                    productId: data._id,
                    productName: data.name,
                    productPrice: data.price,
                    quantity: parseInt(input.value)
                };
                cartItems.push(cartItem);
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                window.location.href = 'cart.html';
            });

            const deleteItem = document.createElement("button");
            deleteItem.classList.add("delete-from-cart");
            deleteItem.id = "del";
            deleteItem.innerHTML = "Delete";
            deleteItem.addEventListener('click', function () {
                const deletedProductId = data._id;
                const updatedProductIds = productIds.filter(id => id !== deletedProductId);
                localStorage.setItem("ProductArray", JSON.stringify(updatedProductIds));

                // Remove the container with the matching product ID
                container.parentNode.removeChild(container);

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
