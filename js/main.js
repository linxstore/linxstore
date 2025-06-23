document.addEventListener('DOMContentLoaded', function() {
// Menú móvil - Funcionalidad mejorada
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
menuBtn.addEventListener('click', function() {
mobileMenu.classList.toggle('show');
const icon = this.querySelector('i');
icon.classList.toggle('fa-bars');
icon.classList.toggle('fa-times');

// Cerrar menú al hacer clic fuera de él  
  if (mobileMenu.classList.contains('show')) {  
    document.addEventListener('click', closeMenuOnClickOutside);  
  } else {  
    document.removeEventListener('click', closeMenuOnClickOutside);  
  }  
});  

function closeMenuOnClickOutside(e) {  
  if (!mobileMenu.contains(e.target) && e.target !== menuBtn) {  
    mobileMenu.classList.remove('show');  
    menuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');  
    document.removeEventListener('click', closeMenuOnClickOutside);  
  }  
}  

// Cerrar menú al hacer clic en enlace  
document.querySelectorAll('.mobile-menu-link').forEach(link => {  
  link.addEventListener('click', () => {  
    mobileMenu.classList.remove('show');  
    menuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');  
    document.removeEventListener('click', closeMenuOnClickOutside);  
  });  
});

}

// Sistema de carrito mejorado
if (document.getElementById('cart-sidebar')) {
let cart = JSON.parse(localStorage.getItem('kiosc072-cart')) || [];

const updateCart = () => {  
  const cartItemsContainer = document.getElementById('cart-items');  
  const cartTotalElement = document.getElementById('cart-total');  
  const cartCountElement = document.getElementById('cart-count');  
  const cartEmptyElement = document.getElementById('cart-empty');  
    
  cartItemsContainer.innerHTML = '';  
  let total = 0;  

  if (cart.length === 0) {  
    cartEmptyElement.style.display = 'flex';  
  } else {  
    cartEmptyElement.style.display = 'none';  
    cart.forEach((item, index) => {  
      const li = document.createElement('li');  
      li.className = 'cart-item';  
      li.innerHTML = `  
        <span>${item.name}</span>  
        <div class="cart-item-price">  
          <span>$${item.price.toFixed(2)}</span>  
          <button class="remove-item" data-index="${index}" aria-label="Eliminar producto">  
            <i class="fas fa-trash"></i>  
          </button>  
        </div>  
      `;  
      cartItemsContainer.appendChild(li);  
      total += item.price;  
    });  
  }  

  cartTotalElement.textContent = total.toFixed(2);  
  cartCountElement.textContent = cart.length;  
  localStorage.setItem('kiosc072-cart', JSON.stringify(cart));  

  // Event listeners para botones de eliminar  
  document.querySelectorAll('.remove-item').forEach(button => {  
    button.addEventListener('click', (e) => {  
      const index = e.target.closest('button').getAttribute('data-index');  
      cart.splice(index, 1);  
      updateCart();  
        
      // Feedback visual  
      e.target.closest('button').innerHTML = '<i class="fas fa-check"></i>';  
      setTimeout(() => {  
        updateCart();  
      }, 500);  
    });  
  });  
};  

// Botones "Agregar al carrito" con prevención de doble clic  
document.querySelectorAll('.add-to-cart').forEach(button => {  
  button.addEventListener('click', function() {  
    if (this.classList.contains('adding')) return;  
      
    this.classList.add('adding');  
    const productCard = this.closest('.product-card');  
    const productName = productCard.querySelector('.product-title').textContent;  
    const productPrice = parseFloat(  
      productCard.querySelector('.product-price').textContent.replace('$', '')  
    );  
      
    cart.push({ name: productName, price: productPrice });  
    updateCart();  
      
    // Efecto visual mejorado  
    this.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';  
    this.classList.add('btn-success');  
      
    setTimeout(() => {  
      this.innerHTML = 'Agregar';  
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

// WhatsApp con validación mejorada  
document.getElementById('send-whatsapp')?.addEventListener('click', function() {  
  if (cart.length === 0) {  
    alert("¡Tu carrito está vacío! Agrega productos antes de enviar el pedido.");  
    return;  
  }  
    
  let message = "¡Hola Kiosc072! Quiero hacer este pedido:%0A%0A";  
  let total = 0;  
    
  cart.forEach(item => {  
    message += `- ${item.name}: $${item.price.toFixed(2)}%0A`;  
    total += item.price;  
  });  
    
  message += `%0A*Total:* $${total.toFixed(2)}%0A%0A*Dirección de entrega:*%0A[Por favor escribe tu dirección aquí]%0A%0A*Notas adicionales:*%0A[Indica si tienes alguna instrucción especial]`;  
    
  window.open(`https://wa.me/5255975867?text=${encodeURIComponent(message)}`, "_blank");  
});  

// Inicializar carrito  
updateCart();  

// Cerrar carrito al hacer clic fuera  
document.addEventListener('click', (e) => {  
  const cartSidebar = document.getElementById('cart-sidebar');  
  const openCartBtn = document.getElementById('open-cart-btn');  
    
  if (cartSidebar.classList.contains('show') &&   
      !cartSidebar.contains(e.target) &&   
      e.target !== openCartBtn) {  
    cartSidebar.classList.remove('show');  
  }  
});

}
});
Quiero que me envíes el archivo ya modificado completo para solo copiar y pegar

        
