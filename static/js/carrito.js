let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartContainer = document.getElementById("cart");
// Render carrito
function renderCart() {
  cartContainer.innerHTML = "";
  cart.forEach((item, index) => {
    cartContainer.innerHTML += `
      <div class="card p-2 mb-2">
        <strong>${item.name}</strong>
        <span>$${item.price}</span>
        <button onclick="removeCart(${index})">❌</button>
      </div>
    `;
  });
  localStorage.setItem("cart", JSON.stringify(cart));
}
// Agregar al carrito
document.querySelectorAll(".add-cart").forEach(btn => {
  btn.addEventListener("click", e => {
    const product = e.target.closest(".product");
    cart.push({
      name: product.dataset.name,
      price: product.dataset.price
    });
    renderCart();
  });
});
// Eliminar
function removeCart(index) {
  cart.splice(index, 1);
  renderCart();
}
// Cargar al iniciar
renderCart();
