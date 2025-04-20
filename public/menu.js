// 🔁 CAMBIA ESTA URL si tu dominio en Render es diferente
const API_URL = "https://TU_BACKEND.onrender.com";

let menuItems = [];
const menuSection = document.getElementById("menu");
const modal = document.getElementById("myModal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.getElementsByClassName("close")[0];
const searchBox = document.getElementById("search");
const categoryFilterSelect = document.getElementById("category-filter-select");

// Cargar platos desde la API
async function loadMenu() {
  try {
    const res = await fetch(`${API_URL}/api/menu`);
    const data = await res.json();
    menuItems = data;
    renderMenu(menuItems);
  } catch (error) {
    console.error("Error al cargar el menú:", error);
  }
}

// Mostrar platos en el HTML
function renderMenu(items) {
  menuSection.innerHTML = "";
  items.forEach((item) => {
    const menuItem = document.createElement("div");
    menuItem.classList.add("menu-item");
    menuItem.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>Precio: <strong>$${item.price}</strong></p>
      <button class="pedido-button">Comprar</button>
      <button class="read-more-button">Leer más</button>
    `;

    menuItem.querySelector(".pedido-button").addEventListener("click", () => goToOrderPage(item.id));
    menuItem.querySelector(".read-more-button").addEventListener("click", () => showDescription(item.id));

    menuSection.appendChild(menuItem);
  });

  const loadingContainer = document.getElementById("loading-container");
  if (loadingContainer) loadingContainer.style.display = "none";
}

// Redirigir a order.html
window.goToOrderPage = function (id) {
  const selectedItem = menuItems.find((item) => item.id === id);
  localStorage.setItem("selectedItem", JSON.stringify(selectedItem));
  window.location.href = "order.html";
};

// Mostrar descripción en el modal
window.showDescription = function (id) {
  const item = menuItems.find((i) => i.id === id);
  modalTitle.textContent = item.name;
  modalDescription.textContent = item.description;
  modalImg.src = item.img;
  document.getElementById("orderButton").onclick = () => goToOrderPage(id);
  modal.style.display = "block";
};

// Cerrar modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Búsqueda y filtro
searchBox.addEventListener("input", filterMenu);
categoryFilterSelect.addEventListener("change", filterMenu);

function filterMenu() {
  const searchQuery = searchBox.value.toLowerCase();
  const selectedCategory = categoryFilterSelect.value;
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery);
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  renderMenu(filteredItems);
}

// Iniciar
loadMenu();
