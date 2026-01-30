let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const favoritesContainer = document.getElementById("favorites");
// Render favoritos
function renderFavorites() {
  favoritesContainer.innerHTML = "";
  favorites.forEach((item, index) => {
    favoritesContainer.innerHTML += `
      <div class="card p-2 mb-2">
        <strong>${item.name}</strong>
        <span>$${item.price}</span>
        <button onclick="removeFav(${index})">❌</button>
      </div>
    `;
  });
  localStorage.setItem("favorites", JSON.stringify(favorites));
}
// Agregar a favoritos (sin duplicados)
document.querySelectorAll(".add-fav").forEach(btn => {
  btn.addEventListener("click", e => {
    const product = e.target.closest(".product");
    const exists = favorites.some(p => p.name === product.dataset.name);
    if (!exists) {
      favorites.push({
        name: product.dataset.name,
        price: product.dataset.price
      });
      renderFavorites();
    }
  });
});
//Eliminar
function removeFav(index) {
  favorites.splice(index, 1);
  renderFavorites();
}
// Cargar al iniciar
renderFavorites();