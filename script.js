// Product data map keyed by product ID used in URL parameter "product"
const productData = {
  "basmati-rice": {
    name: "Basmati Rice",
    price: "₹120 / kg",
    desc: "Premium long-grain basmati rice, aromatic and fluffy.",
    farmer: "Aman Singh, Punjab",
    image: "images/Basmati.webp"
  },
  "assam-tea-leaves": {
    name: "Assam Tea Leaves",
    price: "₹80 / 250g",
    desc: "Fresh black tea leaves, hand-plucked from Assam gardens.",
    farmer: "Rashmi Barman, Assam",
    image: "images/assam-green-tea-leaves.png"
  },
  "alphonso-mangoes": {
    name: "Alphonso Mangoes",
    price: "₹300 / dozen",
    desc: "Juicy, sweet Alphonso mangoes at peak ripeness.",
    farmer: "Shantanu Patil, Ratnagiri, Maharashtra",
    image: "images/Alponso mago.jpg"
  },
  "fresh-okra": {
    name: "Fresh Okra (Ladyfinger)",
    price: "₹55 / kg",
    desc: "Crisp okra, ideal for sabzi and curries.",
    farmer: "Mangesh Pawar, Nagpur, Maharashtra",
    image: "images/Lady_Finger-okra.webp"
  },
  "coriander-seeds": {
    name: "Coriander Seeds",
    price: "₹30 / 100g",
    desc: "Whole, sun-dried coriander for fresh ground masala.",
    farmer: "Aarti Reddy, Warangal, Telangana",
    image: "images/Coriander leaves.jpg"
  },
  "green-chillies": {
    name: "Green Chillies",
    price: "₹38 / 100g",
    desc: "Whole, fresh green Chillies for spicy food.",
    farmer: "Neena Reddy, Gundur, Telangana",
    image: "images/green-chilli-200-g-product-images-o590003533-p590003533-0-202408070949.webp"
  },
  "red-onions": {
    name: "Red Onions",
    price: "₹38 / 100g",
    desc: "Whole, fresh Red onions for wholesome food.",
    farmer: "Mangal Singh, Dholakpur, Punjab",
    image: "images/onions.webp"
  },
  "pumpkins": {
    name: "Pumpkins",
    price: "₹38 / 100g",
    desc: "Whole, fresh Pumpkins for good healthy body.",
    farmer: "Neena Reddy, Matheran, Maharashtra",
    image: "images/Pumpkins.webp"
  },

};

// Utility to get URL query parameter by name
function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

// Display product details based on "product" URL param
function displayProductDetails() {
  const productId = getQueryParam('product');
  const container = document.getElementById('product-details');

  if (!productId || !productData[productId]) {
    container.innerHTML = '<h2>Product not found</h2>';
    return;
  }

  const product = productData[productId];
  container.innerHTML = `
    <img src="${product.image}" alt="${product.name}" />
    <h2>${product.name}</h2>
    <p><strong>Price: </strong>${product.price}</p>
    <p>${product.desc}</p>
    <p><em>By ${product.farmer}</em></p>
    <button class="buy-btn" onclick="alert('Purchase flow not implemented; this is a demo.')">Proceed to Buy</button>
  `;
}

// Run display on DOM ready
document.addEventListener('DOMContentLoaded', displayProductDetails);
