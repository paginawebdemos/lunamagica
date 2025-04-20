// 🟢 URL de tu backend
const API_URL = "https://lunamagica.onrender.com";

// 🔐 Login seguro con backend
document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/api/login`, {
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

// 🔄 Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  location.reload();
});

// 📦 Cargar menú
async function loadMenu() {
  const res = await fetch(`${API_URL}/api/menu`);
  const data = await res.json();

  const menuList = document.getElementById("menu-list");
  menuList.innerHTML = "";

  data.forEach((dish) => {
    const card = document.createElement("div");
    card.classList.add("dish-card");
    card.innerHTML = `
      <img src="${dish.img}" alt="${dish.name}" width="100">
      <h5>${dish.name}</h5>
      <p><strong>Precio:</strong> $${dish.price}</p>
      <p><strong>Categoría:</strong> ${dish.category}</p>
      <p><strong>Descripción:</strong> ${dish.description}</p>
      <button onclick="deleteDish(${dish.id})">Eliminar</button>
    `;
    menuList.appendChild(card);
  });
}

// ❌ Eliminar
window.deleteDish = async function (id) {
  await fetch(`${API_URL}/api/menu/${id}`, { method: "DELETE" });
  loadMenu();
};

// ☁️ Subir imagen a Cloudinary
async function uploadToCloudinary(file) {
  const url = "https://api.cloudinary.com/v1_1/drjrnf6rr/image/upload";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.secure_url;
}

// ➕ Agregar plato
document.getElementById("add-dish-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("dish-name").value;
  const category = document.getElementById("dish-category").value;
  const price = document.getElementById("dish-price").value;
  const description = document.getElementById("dish-description").value;
  const file = document.getElementById("dish-img-upload").files[0];

  if (!file) {
    alert("Por favor, selecciona una imagen.");
    return;
  }

  try {
    const imgURL = await uploadToCloudinary(file);

    const data = {
      name,
      category,
      price,
      description,
      image: imgURL // 🔥 Enviar como JSON, no FormData
    };

    await fetch(`${API_URL}/api/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    document.getElementById("add-dish-form").reset();
    loadMenu();
  } catch (error) {
    alert("Error al subir imagen a Cloudinary.");
  }
});
