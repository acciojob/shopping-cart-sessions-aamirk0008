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

      let cart = [];


      function loadCart() {
        try {
          const savedCart = sessionStorage.getItem('cart');
          return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
          console.error('Error loading cart:', error);
          return [];
        }
      }

      function saveCart() {
        try {
          sessionStorage.setItem('cart', JSON.stringify(cart));
        } catch (error) {
          console.error('Error saving cart:', error);
        }
      }

      function renderProducts() {
        products.forEach((product) => {
          const li = document.createElement("li");
          li.innerHTML = `${product.name} - $${product.price} <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>`;
          productList.appendChild(li);
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
          button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
          });
        });
      }

      function renderCart() {
        cartList.innerHTML = '';
        
        if (cart.length === 0) {
          return;
        }

        const groupedItems = {};
        cart.forEach(item => {
          if (groupedItems[item.id]) {
            groupedItems[item.id].quantity++;
          } else {
            groupedItems[item.id] = { ...item, quantity: 1 };
          }
        });

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

        document.querySelectorAll('.remove-btn').forEach(button => {
          button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
          });
        });
      }

      function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
          cart.push(product);
          saveCart();
          renderCart();
        }
      }

      function removeFromCart(productId) {
        const index = cart.findIndex(item => item.id === productId);
        if (index > -1) {
          cart.splice(index, 1);
          saveCart();
          renderCart();
        }
      }

    
      function clearCart() {
        cart = [];
        saveCart();
        renderCart();
      }

      function init() {
        cart = loadCart();
        renderProducts();
        renderCart();
        
        clearCartBtn.addEventListener('click', clearCart);
      }

      init();