// Elementos del DOM para el chat
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const chatContainer = document.getElementById("chat-container");
const chatBtn = document.getElementById("chat-btn");

// Mensaje de bienvenida y opciones principales del chatbot
const welcomeMessage = "¡Hola! Soy el asistente virtual de Luna Mágica. ¿En qué puedo ayudarte?";
const optionsMessage = "Por favor, selecciona una opción:";

// Opciones del menú del chatbot
const mainOptions = [
    "Horarios",
    "Ubicación",
    "Menú",
    "Contacto"
];

// Función para agregar un mensaje al chat
function addMessage(content, sender = "bot", scrollToBottom = true) {
    // Crear un div para el mensaje
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    messageDiv.innerHTML = content;  // Asignar el contenido al mensaje
    chatBox.appendChild(messageDiv); // Agregar el mensaje al chat

    // Desplazar el chat hacia el fondo
    if (scrollToBottom) {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Función para mostrar las opciones principales
function showMainOptions() {
    addMessage(optionsMessage, "bot", false);  // Mostrar el mensaje de opciones

    const optionsContainer = document.createElement("div");
    optionsContainer.classList.add("options-container");

    // Crear botones para cada opción
    mainOptions.forEach(option => {
        const optionButton = document.createElement("button");
        optionButton.classList.add("option-button");
        optionButton.innerText = option;
        optionButton.onclick = function() {
            processOption(option); // Procesar la opción seleccionada
        };
        optionsContainer.appendChild(optionButton); // Agregar el botón al contenedor
    });

    chatBox.appendChild(optionsContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Función para procesar la opción seleccionada
function processOption(option) {
    addMessage(`Has seleccionado: "${option}"`, "user"); // Mostrar la opción seleccionada

    let response = '';  // Variable para la respuesta

    // Respuestas según la opción seleccionada
    switch (option) {
        case "Horarios":
            response = "Nuestro horario de atención es de lunes a sábado de 9:00 am a 2:00 pm y de 5:00 pm a 9:00 pm. ¡Los domingos descansamos!";
            break;
        case "Ubicación":
            response = "Luna Mágica se encuentra en la Calle Principal, frente al parque central. ¡Ven y disfruta de nuestra comida!";
            break;
        case "Menú":
            response = "¡Descubre nuestro menú digital! Tenemos platos deliciosos como entradas, platos principales, postres y bebidas. ¿Te gustaría ver alguna categoría específica?";
            break;
        case "Contacto":
            response = "Puedes contactarnos al número <strong>+584121234567</strong> o enviarnos un correo a <strong>contacto@lunamagica.com</strong>";
            break;
        default:
            response = "Opción no válida, por favor selecciona una opción del menú.";
    }

    addMessage(response, "bot");  // Mostrar la respuesta del bot
    askIfWantMore();  // Preguntar si el usuario quiere saber algo más
}

// Función para preguntar si el usuario desea saber más
function askIfWantMore() {
    addMessage("¿Deseas saber algo más? Si es así, responde solo 'Si'. Si no, siempre estaré aquí para ayudarte.", "bot", true);
}

// Función para procesar la respuesta del usuario
function processUserResponse(response) {
    const lowerResponse = response.toLowerCase();

    // Detecta agradecimientos comunes
    if (lowerResponse.includes("gracias") || lowerResponse.includes("muy amable") || lowerResponse.includes("te agradezco")) {
        addMessage("¡De nada! Estoy aquí si necesitas algo más.", "bot");
    } else if (lowerResponse === "si") {
        showMainOptions();  // Mostrar las opciones principales nuevamente
    } else {
        addMessage("¡Gracias por visitar Luna Mágica! Si necesitas algo más, siempre estaré aquí.", "bot");
    }
}

// Función para enviar el mensaje del usuario
function sendMessage() {
    const message = userInput.value.trim();
    if (message !== "") {
        addMessage(message, "user");  // Mostrar el mensaje del usuario
        userInput.value = "";  // Limpiar el campo de entrada
        processUserResponse(message);  // Procesar la respuesta del usuario
    }
}

// Función para alternar la visibilidad del chat
function toggleChat() {
    if (chatContainer.style.display === "none" || chatContainer.style.display === "") {
        chatContainer.style.display = "flex";  // Mostrar el chat
        chatBtn.style.display = "none";  // Ocultar el botón flotante
    } else {
        chatContainer.style.display = "none";  // Ocultar el chat
        chatBtn.style.display = "block";  // Mostrar el botón flotante
    }
}

// Función que se ejecuta cuando el DOM se ha cargado completamente
document.addEventListener("DOMContentLoaded", () => {
    addMessage(welcomeMessage, "bot", false);  // Mostrar el mensaje de bienvenida
    showMainOptions();  // Mostrar las opciones principales
});

// Asignar la función `sendMessage` al botón de enviar
document.getElementById("send-btn").onclick = sendMessage;
