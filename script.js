const products = [
        { id: 1, name: "Product 1", price: 10 },
        { id: 2, name: "Product 2", price: 20 },
        { id: 3, name: "Product 3", price: 30 },
        { id: 4, name: "Product 4", price: 40 },
        { id: 5, name: "Product 5", price: 50 },
      ];

      // DOM elements
      const productList = document.getElementById("product-list");
      const cartList = document.getElementById("cart-list");
      const clearCartBtn = document.getElementById("clear-cart-btn");

      // Cart data - using in-memory storage for artifact compatibility
      // In real environment, this would use sessionStorage
      let cart = [];

      // Load cart from storage
      function loadCart() {
        try { 
          const savedCart = sessionStorage.getItem('cart');
          return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
          console.error('Error loading cart:', error);
          return [];
        }
      }

      // Save cart to storage
      function saveCart() {
        try {
          // In real environment:
          sessionStorage.setItem('cart', JSON.stringify(cart));
          // For artifact environment, cart is already in memory
        } catch (error) {
          console.error('Error saving cart:', error);
        }
      }

      // Render product list
      function renderProducts() {
        products.forEach((product) => {
          const li = document.createElement("li");
          li.innerHTML = `${product.name} - $${product.price} <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>`;
          productList.appendChild(li);
        });

        // Add event listeners to add-to-cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
          button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
          });
        });
      }

      // Render cart list
      function renderCart() {
        cartList.innerHTML = '';
        
        if (cart.length === 0) {
          const li = document.createElement("li");
          li.className = "empty-cart";
          li.textContent = "Your cart is empty";
          cartList.appendChild(li);
          return;
        }

        // Group items by id and count quantities
        const groupedItems = {};
        cart.forEach(item => {
          if (groupedItems[item.id]) {
            groupedItems[item.id].quantity++;
          } else {
            groupedItems[item.id] = { ...item, quantity: 1 };
          }
        });

        // Render grouped items
        Object.values(groupedItems).forEach(item => {
          const li = document.createElement("li");
          const totalPrice = item.price * item.quantity;
          li.innerHTML = `
            ${item.name} - $${item.price} 
            ${item.quantity > 1 ? `(Qty: ${item.quantity}) = $${totalPrice}` : ''}
            <button class="remove-btn" data-id="${item.id}">Remove</button>
          `;
          cartList.appendChild(li);
        });

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-btn').forEach(button => {
          button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
          });
        });
      }

      // Add item to cart
      function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
          cart.push(product);
          saveCart();
          renderCart();
        }
      }

      // Remove item from cart
      function removeFromCart(productId) {
        const index = cart.findIndex(item => item.id === productId);
        if (index > -1) {
          cart.splice(index, 1);
          saveCart();
          renderCart();
        }
      }

      // Clear cart
      function clearCart() {
        cart = [];
        saveCart();
        renderCart();
      }

      // Initialize the application
      function init() {
        cart = loadCart();
        renderProducts();
        renderCart();
        
        // Add event listener for clear cart button
        clearCartBtn.addEventListener('click', clearCart);
      }

      // Initial render
      init();