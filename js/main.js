// app.js - Solución completa para Kiosco72
document.addEventListener('DOMContentLoaded', function() {
  // ==================== MENÚ MÓVIL ====================
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      mobileMenu.classList.toggle('show');
      const icon = this.querySelector('i');
      
      if (mobileMenu.classList.contains('show')) {
        icon.classList.replace('fa-bars', 'fa-times');
        document.addEventListener('click', closeMenuOnClickOutside);
      } else {
        icon.classList.replace('fa-times', 'fa-bars');
        document.removeEventListener('click', closeMenuOnClickOutside);
      }
    });

    function closeMenuOnClickOutside(e) {
      if (!mobileMenu.contains(e.target) && e.target !== menuBtn) {
        mobileMenu.classList.remove('show');
        const icon = menuBtn.querySelector('i');
        if (icon) {
          icon.classList.replace('fa-times', 'fa-bars');
        }
        document.removeEventListener('click', closeMenuOnClickOutside);
      }
    }

    // Cerrar menú al hacer clic en enlace
    document.querySelectorAll('.mobile-menu-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('show');
        const icon = menuBtn.querySelector('i');
        if (icon) {
          icon.classList.replace('fa-times', 'fa-bars');
        }
        document.removeEventListener('click', closeMenuOnClickOutside);
      });
    });
  }

  // ==================== SISTEMA DE CARRITO ====================
  if (document.getElementById('cart-sidebar')) {
    let cart = JSON.parse(localStorage.getItem('kiosco72-cart')) || [];

    const updateCart = () => {
      const cartItemsContainer = document.getElementById('cart-items');
      const cartTotalElement = document.getElementById('cart-total');
      const cartSubtotalElement = document.getElementById('cart-subtotal');
      const cartCountElement = document.getElementById('cart-count');
      const cartEmptyState = document.getElementById('cart-empty-state');
      
      // Verificar elementos existentes
      if (!cartItemsContainer || !cartTotalElement || !cartCountElement) return;
      
      cartItemsContainer.innerHTML = '';
      let total = 0;
      let count = 0;

      if (cart.length === 0) {
        // Mostrar estado vacío
        if (cartEmptyState) cartEmptyState.style.display = 'flex';
        if (cartItemsContainer) cartItemsContainer.style.display = 'none';
      } else {
        // Ocultar estado vacío
        if (cartEmptyState) cartEmptyState.style.display = 'none';
        if (cartItemsContainer) cartItemsContainer.style.display = 'block';
        
        cart.forEach((item, index) => {
          const itemTotal = item.price * item.quantity;
          total += itemTotal;
          count += item.quantity;
          
          const li = document.createElement('li');
          li.className = 'cart-item';
          li.innerHTML = `
            <div class="cart-item-info">
              <h4>${item.name}</h4>
              <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
              <span class="cart-item-total">$${itemTotal.toFixed(2)}</span>
              <button class="remove-item" data-index="${index}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
          cartItemsContainer.appendChild(li);
        });
      }

      // Actualizar totales
      cartTotalElement.textContent = total.toFixed(2);
      if (cartSubtotalElement) cartSubtotalElement.textContent = total.toFixed(2);
      cartCountElement.textContent = count;
      cartCountElement.classList.add('pulse');
      setTimeout(() => cartCountElement.classList.remove('pulse'), 500);
      
      localStorage.setItem('kiosco72-cart', JSON.stringify(cart));

      // Event listeners para botones de eliminar
      document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
          const index = parseInt(e.target.closest('button').getAttribute('data-index'));
          cart.splice(index, 1);
          updateCart();
        });
      });
    };

    // Botones "Agregar al carrito"
    document.querySelectorAll('.agregar-carrito').forEach(button => {
      button.addEventListener('click', function() {
        if (this.classList.contains('adding')) return;
        
        this.classList.add('adding');
        const id = this.dataset.id;
        const name = this.dataset.name;
        const price = parseFloat(this.dataset.price);
        
        // Buscar si el producto ya está en el carrito
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
          existingItem.quantity++;
        } else {
          cart.push({
            id,
            name,
            price,
            quantity: 1
          });
        }
        
        updateCart();
        
        // Animación de éxito
        this.classList.add('btn-success');
        this.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
        
        setTimeout(() => {
          this.classList.remove('btn-success', 'adding');
          this.innerHTML = 'Agregar';
        }, 2000);
      });
    });

    // Botones del carrito
    document.getElementById('carrito-icono')?.addEventListener('click', () => {
      document.getElementById('cart-sidebar').classList.add('show');
    });

    document.getElementById('close-cart')?.addEventListener('click', () => {
      document.getElementById('cart-sidebar').classList.remove('show');
    });

    // WhatsApp
    document.getElementById('send-whatsapp')?.addEventListener('click', function() {
      if (cart.length === 0) {
        alert("¡Tu carrito está vacío! Agrega productos antes de enviar el pedido.");
        return;
      }
      
      let message = "¡Hola Kiosco72! Quiero realizar el siguiente pedido:\n\n";
      let total = 0;
      
      cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        message += `- ${item.name} x ${item.quantity}: $${itemTotal.toFixed(2)}\n`;
        total += itemTotal;
      });
      
      message += `\nTotal: $${total.toFixed(2)}`;
      message += '\n\nPor favor, confírmenme cuando esté listo para recoger. ¡Gracias!';
      
      const whatsappUrl = `https://wa.me/5354833899?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    });

    // Cerrar carrito al hacer clic fuera
    document.addEventListener('click', (e) => {
      const cartSidebar = document.getElementById('cart-sidebar');
      const openCartBtn = document.getElementById('carrito-icono');
      
      if (cartSidebar?.classList.contains('show') && 
          !cartSidebar.contains(e.target) && 
          e.target !== openCartBtn && 
          !openCartBtn?.contains(e.target)) {
        cartSidebar.classList.remove('show');
      }
    });

    // Inicializar carrito
    updateCart();
  }

  // ==================== FILTRADO DE PRODUCTOS ====================
  if (document.querySelector('.category-filters')) {
    const categoryFilters = document.querySelectorAll('.category-filter');
    const products = document.querySelectorAll('.product-card');
    
    categoryFilters.forEach(filter => {
      filter.addEventListener('click', function() {
        const category = this.dataset.category;
        
        // Actualizar estado activo
        categoryFilters.forEach(f => f.classList.remove('active'));
        this.classList.add('active');
        
        // Filtrar productos
        products.forEach(product => {
          if (category === 'all') {
            product.style.display = 'block';
          } else {
            const categories = product.dataset.category.split(' ');
            if (categories.includes(category)) {
              product.style.display = 'block';
            } else {
              product.style.display = 'none';
            }
          }
        });
      });
    });
    
    // Búsqueda de productos
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        products.forEach(product => {
          const productName = product.querySelector('h3').textContent.toLowerCase();
          const isVisible = productName.includes(searchTerm);
          
          if (isVisible) {
            product.style.display = 'block';
          } else {
            product.style.display = 'none';
          }
        });
      });
    }
  }
});
