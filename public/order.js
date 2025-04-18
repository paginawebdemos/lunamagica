// Cargar los datos del plato seleccionado desde localStorage
const selectedItem = JSON.parse(localStorage.getItem("selectedItem"));
const totalPriceElement = document.getElementById("totalPrice");

if (selectedItem) {
    document.getElementById("plateName").value = selectedItem.name;
    document.getElementById("platePrice").value = selectedItem.price;

    const initialQuantity = 1;
    const initialPrice = parseFloat(selectedItem.price.replace('$', ''));
    const initialTotal = initialQuantity * initialPrice;
    totalPriceElement.textContent = `$${initialTotal.toFixed(2)}`;
}

// Actualizar el total al cambiar la cantidad
document.getElementById("quantity").addEventListener("input", function () {
    const quantity = parseInt(this.value);
    const price = parseFloat(selectedItem.price.replace('$', ''));
    const total = quantity * price;
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
});

// Función para enviar el pedido a WhatsApp
function submitOrder() {
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const address = document.getElementById('address').value;
    const contact = document.getElementById('contact').value;
    const quantity = document.getElementById('quantity').value;
    const total = (parseFloat(selectedItem.price.replace('$', '')) * quantity).toFixed(2);

    // Crear el mensaje de WhatsApp
    const message = `
📌 *Nuevo Pedido de Delivery* 📌

👤 *Cliente:* ${name} ${surname}
🏠 *Dirección:* ${address}
📞 *Contacto:* ${contact}

🍽️ *Detalles del Pedido:*
📌 *Plato:* ${selectedItem.name}
🔢 *Cantidad:* ${quantity}
💰 *Precio por unidad:* ${selectedItem.price}
🧾 *Total:* $${total}

✅ *Por favor, confirmar el pedido.*`;

    // Redirigir a WhatsApp con el mensaje
    window.location.href = `https://wa.me/584246516245?text=${encodeURIComponent(message)}`;
}
