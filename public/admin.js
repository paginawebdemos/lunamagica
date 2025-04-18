document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("admin-content").style.display = "block";
    loadMenu();
  } else {
    document.getElementById("error-message").style.display = "block";
  }
});

document.getElementById("logout-btn").addEventListener("click", () => {
  location.reload();
});

async function loadMenu() {
  const res = await fetch("/api/menu");
  const data = await res.json();

  const menuList = document.getElementById("menu-list");
  menuList.innerHTML = "";
  data.forEach((dish) => {
    const card = document.createElement("div");
    card.classList.add("dish-card");
    card.innerHTML = `
      <img src="${dish.img}" alt="${dish.name}" width="100">
      <h5>${dish.name}</h5>
      <p><strong>Precio:</strong> ${dish.price}</p>
      <p><strong>Categoría:</strong> ${dish.category}</p>
      <p><strong>Descripción:</strong> ${dish.description}</p>
      <button onclick="deleteDish(${dish.id})">Eliminar</button>
    `;
    menuList.appendChild(card);
  });
}

window.deleteDish = async function (id) {
  await fetch(`/api/menu/${id}`, { method: "DELETE" });
  loadMenu();
};

document.getElementById("add-dish-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", document.getElementById("dish-name").value);
  formData.append("category", document.getElementById("dish-category").value);
  formData.append("price", document.getElementById("dish-price").value);
  formData.append("description", document.getElementById("dish-description").value);
  formData.append("image", document.getElementById("dish-img-upload").files[0]);

  await fetch("/api/menu", {
    method: "POST",
    body: formData,
  });

  document.getElementById("add-dish-form").reset();
  loadMenu();
});

  