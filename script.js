// Product data map keyed by product ID used in URL parameter "product"
const productData = {
    "basmati-rice": {
        name: "Basmati Rice",
        price: "₹120 / kg",
        basePrice: 120,
        unit: "kg",
        desc: "Premium long-grain basmati rice, aromatic and fluffy.",
        farmer: "Aman Singh, Punjab",
        image: "images/Basmati.webp"
    },
    "assam-tea-leaves": {
        name: "Assam Tea Leaves",
        price: "₹80 / 250g",
        basePrice: 80,
        unit: "250g",
        desc: "Fresh black tea leaves, hand-plucked from Assam gardens.",
        farmer: "Rashmi Barman, Assam",
        image: "images/assam-green-tea-leaves.png"
    },
    "alphonso-mangoes": {
        name: "Alphonso Mangoes",
        price: "₹300 / dozen",
        basePrice: 300,
        unit: "dozen",
        desc: "Juicy, sweet Alphonso mangoes at peak ripeness.",
        farmer: "Shantanu Patil, Ratnagiri, Maharashtra",
        image: "images/Alponso mago.jpg"
    },
    "fresh-okra": {
        name: "Fresh Okra (Ladyfinger)",
        price: "₹55 / kg",
        basePrice: 55,
        unit: "kg",
        desc: "Crisp okra, ideal for sabzi and curries.",
        farmer: "Mangesh Pawar, Nagpur, Maharashtra",
        image: "images/Lady_Finger-okra.webp"
    },
    "coriander-seeds": {
        name: "Coriander Seeds",
        price: "₹30 / 100g",
        basePrice: 30,
        unit: "100g",
        desc: "Whole, sun-dried coriander for fresh ground masala.",
        farmer: "Aarti Reddy, Warangal, Telangana",
        image: "images/Coriander leaves.jpg"
    },
    "green-chillies": {
        name: "Green Chillies",
        price: "₹38 / 100g",
        basePrice: 38,
        unit: "100g",
        desc: "Whole, fresh green Chillies for spicy food.",
        farmer: "Neena Reddy, Gundur, Telangana",
        image: "images/green-chilli-200-g-product-images-o590003533-p590003533-0-202408070949.webp"
    },
    "red-onions": {
        name: "Red Onions",
        price: "₹38 / 100g",
        basePrice: 38,
        unit: "100g",
        desc: "Whole, fresh Red onions for wholesome food.",
        farmer: "Mangal Singh, Dholakpur, Punjab",
        image: "images/onions.webp"
    },
    "pumpkins": {
        name: "Pumpkins",
        price: "₹38 / 100g",
        basePrice: 38,
        unit: "100g",
        desc: "Whole, fresh Pumpkins for good healthy body.",
        farmer: "Neena Reddy, Matheran, Maharashtra",
        image: "images/Pumpkins.webp"
    },
    "tomatoes": {
        name: "Tomatoes",
        price: "₹40 / kg",
        basePrice: 40,
        unit: "kg",
        desc: "Whole, fresh juicy Tomatoes for tasty food.",
        farmer: "Indhumathi, Dholakpur, Punjab",
        image: "images/Tomatos.jpg"
    },
    "sweet-corn": {
        name: "Sweet Corn",
        price: "₹30 / ear",
        basePrice: 30,
        unit: "ear",
        desc: "Golden, tender corn ears for boiling or grilling.",
        farmer: "Ritu Agarwal, Ranchi, Jharkhand",
        image: "images/Sweet Corn.jpg"
    }
};

// Utility to get URL query parameter by name
function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

// Navigate to buy page with product ID
function buyNow(productId) {
    window.location.href = `buy.html?product=${productId}`;
}

// Calculate and update total price based on quantity
function updateTotalPrice() {
    const productId = getQueryParam('product');
    const product = productData[productId];
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    
    const totalPrice = product.basePrice * quantity;
    document.getElementById('total-price').textContent = `₹${totalPrice}`;
}

// Display product details based on "product" URL param
function displayProductDetails() {
    const productId = getQueryParam('product');
    const container = document.getElementById('product-details');

    if (!productId || !productData[productId]) {
        container.innerHTML = `
            <h2>Product Not Found</h2>
            <p>Sorry, the product you're looking for doesn't exist.</p>
            <a href="products.html" class="back-btn">Back to Products</a>
        `;
        return;
    }

    const product = productData[productId];
    
    container.innerHTML = `
        <h1>${product.name}</h1>
        <div class="product-detail-section">
            <img src="${product.image}" alt="${product.name}" class="product-image-large">
            <div class="product-info">
                <p><strong>Description:</strong> ${product.desc}</p>
                <p><strong>Farmer:</strong> ${product.farmer}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                
                <div class="quantity-selector">
                    <label for="quantity">Quantity:</label>
                    <input type="number" id="quantity" name="quantity" min="1" value="1" onchange="updateTotalPrice()">
                </div>
                
                <div class="price-display">
                    <h3>Total Price:</h3>
                    <div class="total-price" id="total-price">₹${product.basePrice}</div>
                    <div class="unit-price">(${product.price})</div>
                </div>
                
                <button class="checkout-btn" onclick="proceedToCheckout()">Proceed to Checkout</button>
                <a href="products.html" class="back-btn">Back to Products</a>
            </div>
        </div>
    `;
}

// Proceed to checkout function - redirects to payment.html with order details
function proceedToCheckout() {
    const productId = getQueryParam('product');
    const product = productData[productId];
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const totalPrice = product.basePrice * quantity;
    
    // Redirect to payment.html with order details as URL parameters
    window.location.href = `payment.html?product=${productId}&quantity=${quantity}&total=${totalPrice}`;
}

// Run display on DOM ready
document.addEventListener('DOMContentLoaded', displayProductDetails);
