// Product Data
const products = [
    {
        id: 1,
        name: "Classic Roasted Makhana",
        price: 199.00,
        description: "Lightly roasted with a pinch of Himalayan pink salt. The perfect everyday healthy snack.",
        image: "images/classic_roasted.png",
        featured: true
    },
    {
        id: 2,
        name: "Peri Peri Makhana",
        price: 249.00,
        description: "A spicy and tangy kick of authentic African bird's eye chili for your fiery cravings.",
        image: "images/peri_peri.png",
        featured: true
    },
    {
        id: 3,
        name: "Cheese Makhana",
        price: 249.00,
        description: "Rich, creamy cheese powder generously coating every single crunch. Kids love it!",
        image: "images/cheese.png",
        featured: true
    },
    {
        id: 4,
        name: "Mint Makhana",
        price: 229.00,
        description: "Refreshing minty flavor combined with a subtle zing of chat masala.",
        image: "images/mint.png",
        featured: false
    }
];

// Initialize Cart from LocalStorage
let cart = JSON.parse(localStorage.getItem('shrimala_cart')) || [];

// DOM Elements
const cartCountEl = document.getElementById('cart-count');
const featuredContainer = document.getElementById('featured-products-container');
const productsContainer = document.getElementById('all-products-container');
const cartItemsContainer = document.getElementById('cart-items-container');
const searchInput = document.getElementById('product-search');

// Update Cart Count Badge
function updateCartCount() {
    if (cartCountEl) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountEl.textContent = totalItems;
    }
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('shrimala_cart', JSON.stringify(cart));
    updateCartCount();
}

// Add Item to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    showToast(`Added ${product.name} to cart!`);
}

// Render Featured Products (Home Page)
function renderFeaturedProducts() {
    if (!featuredContainer) return;

    const featured = products.filter(p => p.featured);
    featuredContainer.innerHTML = featured.map(p => createProductCardHTML(p)).join('');
}

// Render All Products (Products Page)
function renderAllProducts(productsToRender = products) {
    if (!productsContainer) return;

    if (productsToRender.length === 0) {
        productsContainer.innerHTML = '<div class="col-12 text-center py-5"><h4>No products found matching your search.</h4></div>';
        return;
    }

    productsContainer.innerHTML = productsToRender.map(p => createProductCardHTML(p)).join('');
}

// Helper to generate Product Card HTML
function createProductCardHTML(product) {
    return `
        <div class="col-md-6 col-lg-4 mb-4 fade-in-up">
            <div class="product-card h-100">
                <div class="product-img-wrapper">
                    <img src="${product.image}" class="product-img" alt="${product.name}">
                </div>
                <div class="product-body">
                    <h5 class="product-title">${product.name}</h5>
                    <div class="product-price">₹${product.price.toFixed(2)}</div>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-action mt-auto">
                        <button class="btn btn-primary custom-btn btn-add-cart w-100" onclick="addToCart(${product.id})">
                            <i class="bi bi-cart-plus me-2"></i>Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Toast Notification System
function showToast(message) {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }

    const toastEl = document.createElement('div');
    toastEl.className = 'toast align-items-center text-white bg-success border-0';
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body fw-medium">
                <i class="bi bi-check-circle me-2"></i>${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();

    // Remove from DOM after it hides
    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
}

// Render Cart Items (Cart Page)
function renderCart() {
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-cart-x text-muted" style="font-size: 4rem;"></i>
                <h3 class="mt-3">Your cart is empty</h3>
                <p class="text-muted">Looks like you haven't added any premium makhana yet.</p>
                <a href="products.html" class="btn btn-primary custom-btn mt-3">Browse Products</a>
            </div>
        `;
        document.getElementById('cart-summary-card').style.display = 'none';
        return;
    }

    document.getElementById('cart-summary-card').style.display = 'block';

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="row cart-item align-items-center mb-3 pb-3 border-bottom">
            <div class="col-3 col-md-2">
                <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
            </div>
            <div class="col-9 col-md-4">
                <h6 class="mb-1">${item.name}</h6>
                <div class="text-primary fw-bold d-md-none mb-2">₹${item.price.toFixed(2)}</div>
                <button class="remove-btn text-danger small p-0" onclick="removeFromCart(${item.id})">
                    <i class="bi bi-trash"></i> Remove
                </button>
            </div>
            <div class="col-12 col-md-3 mt-3 mt-md-0 d-flex justify-content-center justify-content-md-start">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="col-12 col-md-3 mt-2 mt-md-0 text-end d-none d-md-block">
                <div class="fw-bold">₹${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        </div>
    `).join('');

    updateCartTotal();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCart();
        }
    }
}

function updateCartTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
    const total = subtotal + shipping;

    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const totalEl = document.getElementById('cart-total');

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;
}

// Search Functionality
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(p =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
        renderAllProducts(filteredProducts);
    });
}

// Payment Method Toggle UI
const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
const bankDetailsBox = document.getElementById('bankDetailsBox');

if (paymentRadios.length > 0 && bankDetailsBox) {
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'bank') {
                bankDetailsBox.classList.remove('d-none');
            } else {
                bankDetailsBox.classList.add('d-none');
            }
        });
    });
}

// Checkout Form Submission
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        // Get selected payment method
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        const btn = document.getElementById('btn-place-order');
        
        if (paymentMethod === 'online') {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading Razorpay...';
            btn.disabled = true;

            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = subtotal > 500 ? 0 : 50; 
            const total = subtotal + shipping;

            // Razorpay Options
            const options = {
                "key": "rzp_test_YOUR_KEY_ID", // Enter the Key ID generated from the Dashboard
                "amount": total * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                "currency": "INR",
                "name": "Shrimala E-Commerce",
                "description": "Premium Makhana Purchase",
                "image": "images/classic_roasted.png",
                "handler": function (response) {
                    alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
                    cart = [];
                    saveCart();
                    window.location.href = 'index.html';
                },
                "prefill": {
                    "name": "Customer Name",
                    "email": "customer@example.com",
                    "contact": "9999999999"
                },
                "theme": {
                    "color": "#3B7242"
                }
            };

            const rzp1 = new Razorpay(options);
            
            rzp1.on('payment.failed', function (response){
                alert('Payment failed. ' + response.error.description);
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
            
            rzp1.open();

            // Re-enable button when modal closes without payment
            btn.innerHTML = originalText;
            btn.disabled = false;

        } else if (paymentMethod === 'bank') {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Order placed successfully! Please transfer the amount to Patel Akshay (A/C: 42184608460). We will ship your order upon confirmation.');
                cart = [];
                saveCart();
                window.location.href = 'index.html';
            }, 1000);
        } else {
            // COD
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Order placed successfully! You will pay via Cash on Delivery.');
                cart = [];
                saveCart();
                window.location.href = 'index.html';
            }, 1000);
        }
    });
}

// Initialization on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderFeaturedProducts();
    renderAllProducts();
    renderCart();

    // Add scroll event for Navbar shadow
    const navbar = document.querySelector('.custom-navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.05)';
        }
    });
});
