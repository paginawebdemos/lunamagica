document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("confirmarReserva").addEventListener("click", function () {
        // Obtener los valores del formulario
        var nombre = document.getElementById("nombre").value;
        var correo = document.getElementById("correo").value;
        var fecha = document.getElementById("fecha").value;
        var hora = document.getElementById("hora").value;
        var personas = document.getElementById("personas").value;

        // Verificar que todos los campos estén llenos
        if (!nombre || !correo || !fecha || !hora || !personas) {
            alert("Por favor, completa todos los campos antes de confirmar la reserva.");
            return;
        }

        // Crear el mensaje formateado para WhatsApp
        var mensaje = `🔔 *Nueva Reserva* 🔔%0A%0A` +
                      `👤 *Nombre:* ${nombre}%0A` +
                      `📧 *Correo:* ${correo}%0A` +
                      `📅 *Fecha:* ${fecha}%0A` +
                      `⏰ *Hora:* ${hora}%0A` +
                      `👥 *Número de Personas:* ${personas}%0A%0A` +
                      `✅ *Por favor, confirma esta reserva lo antes posible.*`;

        // Número de teléfono de WhatsApp (Reemplázalo con tu número)
        var telefono = "+584246516245"; 

        // Crear el enlace de WhatsApp
        var urlWhatsApp = `https://wa.me/${telefono}?text=${mensaje}`;

        // Redirigir al usuario a WhatsApp
        window.open(urlWhatsApp, '_blank');
    });
});

