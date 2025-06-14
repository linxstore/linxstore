// Función para el menú móvil
document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  menuBtn.addEventListener('click', function() {
    mobileMenu.classList.toggle('show');
    const icon = menuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });

  // Cerrar menú al hacer clic en un enlace
  document.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('show');
      menuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
    });
  });

  // Sistema de carrito (para productos.html)
  if (document.getElementById('cart-sidebar')) {
    let cart = [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');

    function updateCart() {
      cartItemsContainer.innerHTML = '';
      let total = 0;

      cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
          <span>${item.name}</span>
          <div class="cart-item-price">
            <span>$${item.price.toFixed(2)}</span>
            <button class="remove-item" data-index="${index}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `;
        cartItemsContainer.appendChild(li);
        total += item.price;
      });

      cartTotalElement.textContent = total.toFixed(2);
      cartCountElement.textContent = cart.length;

      document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
          const index = e.target.closest('button').getAttribute('data-index');
          cart.splice(index, 1);
          updateCart();
        });
      });
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('.product-title').textContent;
        const productPrice = parseFloat(
          productCard.querySelector('.product-price').textContent.replace('$', '')
        );
        
        cart.push({ name: productName, price: productPrice });
        updateCart();
        
        // Efecto visual
        this.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
        this.classList.add('btn-success');
        
        setTimeout(() => {
          this.innerHTML = 'Agregar';
          this.classList.remove('btn-success');
        }, 2000);
      });
    });

    // Botones del carrito
    document.getElementById('open-cart-btn').addEventListener('click', () => {
      document.getElementById('cart-sidebar').classList.add('show');
    });

    document.getElementById('close-cart').addEventListener('click', () => {
      document.getElementById('cart-sidebar').classList.remove('show');
    });

    // WhatsApp
    document.getElementById('send-whatsapp').addEventListener('click', function() {
      if (cart.length === 0) {
        alert("¡Tu carrito está vacío!");
        return;
      }
      
      let message = "¡Hola Kiosc072! Quiero pedir:%0A%0A";
      let total = 0;
      
      cart.forEach(item => {
        message += `- ${item.name}: $${item.price.toFixed(2)}%0A`;
        total += item.price;
      });
      
      message += `%0ATotal: $${total.toFixed(2)}%0A%0AMi dirección: [ESCRIBE AQUÍ]`;
      window.open(`https://wa.me/5255975867?text=${encodeURIComponent(message)}`, "_blank");
    });
  }
});
