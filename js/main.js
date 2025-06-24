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
      const cartCountElement = document.getElementById('cart-count');
      const cartEmptyElement = document.getElementById('cart-empty');
      
      if (!cartItemsContainer || !cartTotalElement || !cartCountElement || !cartEmptyElement) return;
      
      cartItemsContainer.innerHTML = '';
      let total = 0;
      let itemCount = 0;

      if (cart.length === 0) {
        cartEmptyElement.style.display = 'flex';
        cartItemsContainer.style.display = 'none';
      } else {
        cartEmptyElement.style.display = 'none';
        cartItemsContainer.style.display = 'block';
        
        cart.forEach((item, index) => {
          const itemTotal = item.price * item.quantity;
          total += itemTotal;
          itemCount += item.quantity;
          
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

      cartTotalElement.textContent = total.toFixed(2);
      cartCountElement.textContent = itemCount;
      localStorage.setItem('kiosco72-cart', JSON.stringify(cart));

      // Event listeners para botones de eliminar
      document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
          const index = parseInt(e.target.closest('button').getAttribute('data-index'));
          cart.splice(index, 1);
          updateCart();
          
          // Feedback visual
          const icon = e.target.closest('button').querySelector('i');
          if (icon) {
            icon.classList.replace('fa-trash', 'fa-check');
            setTimeout(() => {
              updateCart();
            }, 500);
          }
        });
      });
    };

    // Botones "Agregar al carrito"
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function() {
        if (this.classList.contains('adding')) return;
        
        this.classList.add('adding');
        const productId = this.getAttribute('data-id');
        const productName = this.getAttribute('data-name');
        const productPrice = parseFloat(this.getAttribute('data-price'));
        
        // Verificar si el producto ya está en el carrito
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({ 
            id: productId,
            name: productName, 
            price: productPrice,
            quantity: 1
          });
        }
        
        updateCart();
        
        // Efecto visual
        const originalHTML = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
        this.classList.add('btn-success');
        
        // Animación de botón de carrito
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
          cartCount.classList.add('pulse');
          setTimeout(() => {
            cartCount.classList.remove('pulse');
          }, 500);
        }
        
        setTimeout(() => {
          this.innerHTML = originalHTML;
          this.classList.remove('btn-success', 'adding');
        }, 2000);
      });
    });

    // Botones del carrito
    document.getElementById('open-cart-btn')?.addEventListener('click', () => {
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
      
      let message = "¡Hola Kiosco72! Quiero hacer este pedido:%0A%0A";
      let total = 0;
      
      cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        message += `- ${item.name} x${item.quantity}: $${itemTotal.toFixed(2)}%0A`;
        total += itemTotal;
      });
      
      message += `%0A*Total:* $${total.toFixed(2)}%0A%0A*Dirección de entrega:*%0A[Por favor escribe tu dirección aquí]%0A%0A*Notas adicionales:*%0A[Indica si tienes alguna instrucción especial]`;
      
      window.open(`https://wa.me/5255975867?text=${encodeURIComponent(message)}`, "_blank");
    });

    // Cerrar carrito al hacer clic fuera
    document.addEventListener('click', (e) => {
      const cartSidebar = document.getElementById('cart-sidebar');
      const openCartBtn = document.getElementById('open-cart-btn');
      
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
});
