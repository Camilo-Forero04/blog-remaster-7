/*
 * *CONTACTO: 
 */
/* =========================================================
   LOS BACKROOMS · Interacciones de la página de contacto
   La idea: los canales no abren correo ni WhatsApp reales.
   En su lugar, el visitante conversa con alguien atrapado.
   ========================================================= */

// Respuestas que puede dar la persona atrapada según el canal elegido.
const conversaciones = {
    cliente: {
        titulo: "ATENCIÓN AL CLIENTE · NIVEL 0",
        inicio: "¿Hola? ¿De verdad puedes leer esto? Llevo horas intentando contactar con alguien.",
        respuestas: [
            "No llames a atención al cliente. Ellos dejaron de contestar hace mucho.",
            "Si estás viendo las paredes amarillas, no sigas el zumbido. No viene de las luces.",
            "Me dijeron que mi visita había terminado. Entonces, ¿por qué sigo aquí?"
        ]
    },
    proveedor: {
        titulo: "ATENCIÓN A PROVEEDORES · NIVEL ?",
        inicio: "¿Trajiste el equipo? La orden decía que lo dejaras junto a la puerta. Ya no encuentro la puerta.",
        respuestas: [
            "La orden de compra tiene una firma que no es humana. No la revises demasiado.",
            "Escuché una máquina al otro lado de la pared. Está repitiendo mi nombre.",
            "Diles que no voy a entregar nada más. No pienso volver a ese pasillo."
        ]
    },
    pqrs: {
        titulo: "RADICACIÓN DE PQRS · SIN CONEXIÓN",
        inicio: "Presenté una queja hace tres días. La respuesta llegó antes de enviarla: «Su caso ha sido cerrado».",
        respuestas: [
            "¿Puedes radicar otra por mí? La queja dice que llevo aquí 184 días. Yo solo recuerdo una noche.",
            "No hay número de radicado. Solo una coordenada y la palabra «permanezca».",
            "Acaban de responder: «Gracias por elegirnos». Yo nunca los elegí."
        ]
    },
    whatsapp: {
        titulo: "MENSAJERÍA · SEÑAL INESTABLE",
        inicio: "Por fin alguien conectado. No envíes tu ubicación. Creo que ellos también pueden verla.",
        respuestas: [
            "Mensaje no entregado. Ja. Aquí nunca hay señal, pero los mensajes siempre llegan.",
            "Si recibes un audio mío, no lo reproduzcas después de medianoche.",
            "Hay alguien detrás de mí. Voy a fingir que no lo veo. No cierres esta ventana todavía."
        ]
    },
    formulario: {
        titulo: "REGISTRO DE VISITANTES · NIVEL 0",
        inicio: "Tu solicitud parece haberse enviado… aunque aquí no existe ningún servidor.",
        respuestas: [
            "Registro actualizado: visitante localizado. No recuerdo haber autorizado eso.",
            "El sistema dice que tu caso está cerrado. Yo sigo escuchando pasos en el pasillo.",
            "No respondas si alguien te llama por tu nombre desde una habitación vacía."
        ]
    },
    general: {
        titulo: "SOPORTE · CONEXIÓN DESCONOCIDA",
        inicio: "¿Hay alguien ahí? Esta línea no debería estar activa.",
        respuestas: [
            "No sé cuánto tiempo llevo aquí. Los relojes cambian cuando dejo de mirarlos.",
            "La salida está cerca. Eso es lo que dicen todos los carteles. Ninguno señala el mismo lugar.",
            "Si encuentras a alguien con uniforme, no le preguntes dónde estás."
        ]
    }
};

// Agrega los estilos de la ventana de conversación sin modificar el HTML.
function crearEstilosChat() {
    const estilos = document.createElement("style");
    estilos.textContent = `
        .backrooms-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: grid;
            place-items: center;
            padding: 1rem;
            background: color-mix(in srgb, var(--void) 82%, transparent);
            backdrop-filter: blur(5px);
        }
        .backrooms-chat {
            width: min(100%, 34rem);
            max-height: 85vh;
            overflow-y: auto;
            padding: 1.5rem;
            color: var(--neon);
            background: var(--void);
            border: 1px solid var(--bg-wall);
            border-radius: 0.75rem;
            box-shadow: 0 0 28px color-mix(in srgb, var(--bg-wall) 18%, transparent);
            font-family: var(--font-title);
        }
        .backrooms-chat__estado {
            margin: 0 0 1rem;
            color: var(--bg-wall);
            font-size: 0.75rem;
            letter-spacing: 0.12em;
        }
        .backrooms-chat__titulo {
            margin: 0 0 1.25rem;
            font-size: 1.15rem;
            overflow-wrap: anywhere;
        }
        .backrooms-chat__mensaje {
            min-height: 5rem;
            padding: 1rem;
            line-height: 1.6;
            white-space: pre-wrap;
            overflow-wrap: anywhere;
            background: color-mix(in srgb, var(--carpet) 22%, transparent);
            border-left: 3px solid var(--bg-wall);
        }
        .backrooms-chat__acciones {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            margin-top: 1.25rem;
        }
        .backrooms-chat__boton {
            padding: 0.7rem 1rem;
            color: var(--neon);
            background: var(--text);
            border: 1px solid var(--carpet);
            border-radius: 0.4rem;
            font: inherit;
            cursor: pointer;
        }
        .backrooms-chat__boton:hover,
        .backrooms-chat__boton:focus-visible {
            color: var(--void);
            background: var(--bg-wall);
            outline: 2px solid var(--bg-wall);
            outline-offset: 2px;
        }
        .backrooms-chat__nota {
            margin: 1rem 0 0;
            color: color-mix(in srgb, var(--neon) 65%, var(--void));
            font-size: 0.75rem;
        }
        @media (prefers-reduced-motion: no-preference) {
            .backrooms-chat {
                animation: aparicionBackrooms 180ms ease-out;
            }
            @keyframes aparicionBackrooms {
                from { opacity: 0; transform: translateY(8px) scale(0.99); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
        }
    `;
    document.head.appendChild(estilos);
}

// Abre una ventana de chat y permite recibir varias respuestas de la persona atrapada.
function abrirConversacion(tipo) {
    const conversacion = conversaciones[tipo] || conversaciones.general;
    let indiceRespuesta = 0;

    // Evita que se abran varias ventanas superpuestas.
    document.querySelector(".backrooms-overlay")?.remove();

    const overlay = document.createElement("div");
    overlay.className = "backrooms-overlay";
    overlay.setAttribute("role", "presentation");

    const chat = document.createElement("section");
    chat.className = "backrooms-chat";
    chat.setAttribute("role", "dialog");
    chat.setAttribute("aria-modal", "true");
    chat.setAttribute("aria-labelledby", "backrooms-chat-titulo");

    const estado = document.createElement("p");
    estado.className = "backrooms-chat__estado";
    estado.textContent = "● CONEXIÓN ESTABLE… POR AHORA";

    const titulo = document.createElement("h2");
    titulo.className = "backrooms-chat__titulo";
    titulo.id = "backrooms-chat-titulo";
    titulo.textContent = conversacion.titulo;

    const mensaje = document.createElement("p");
    mensaje.className = "backrooms-chat__mensaje";
    mensaje.setAttribute("aria-live", "polite");
    mensaje.textContent = conversacion.inicio;

    const acciones = document.createElement("div");
    acciones.className = "backrooms-chat__acciones";

    const responder = document.createElement("button");
    responder.className = "backrooms-chat__boton";
    responder.type = "button";
    responder.textContent = "Responder…";

    const cerrar = document.createElement("button");
    cerrar.className = "backrooms-chat__boton";
    cerrar.type = "button";
    cerrar.textContent = "Cerrar conexión";

    const nota = document.createElement("p");
    nota.className = "backrooms-chat__nota";
    nota.textContent = "AVISO: esta conversación no se transmite a ningún servidor.";

    responder.addEventListener("click", () => {
        // Recorre las respuestas y vuelve al inicio cuando se agotan.
        mensaje.textContent = conversacion.respuestas[
            indiceRespuesta % conversacion.respuestas.length
        ];
        indiceRespuesta++;

        // La conexión parece empeorar a medida que avanza la conversación.
        estado.textContent = indiceRespuesta >= 2
            ? "● SEÑAL INESTABLE · NO MIRES ATRÁS"
            : "● MENSAJE RECIBIDO";

        if (indiceRespuesta >= conversacion.respuestas.length) {
            responder.textContent = "Volver a preguntar…";
        }
    });

    function cerrarConversacion() {
        overlay.remove();
    }

    cerrar.addEventListener("click", cerrarConversacion);
    overlay.addEventListener("click", (evento) => {
        // Cierra solo si se hace clic fuera de la ventana de chat.
        if (evento.target === overlay) cerrarConversacion();
    });

    chat.append(estado, titulo, mensaje, acciones, nota);
    acciones.append(responder, cerrar);
    overlay.appendChild(chat);
    document.body.appendChild(overlay);
    responder.focus();

    // Permite cerrar la ventana con la tecla Escape.
    function manejarEscape(evento) {
        if (evento.key === "Escape") {
            cerrarConversacion();
            document.removeEventListener("keydown", manejarEscape);
        }
    }
    document.addEventListener("keydown", manejarEscape);
}

// Relaciona cada canal de contacto con una conversación ficticia.
function configurarEnlacesContacto() {
    const enlacesContacto = document.querySelectorAll(
        ".canal a, footer a[href^='mailto:']"
    );

    enlacesContacto.forEach((enlace) => {
        enlace.addEventListener("click", (evento) => {
            // Impide abrir el correo o WhatsApp real.
            evento.preventDefault();

            const tarjeta = enlace.closest(".canal");
            const textoTarjeta = tarjeta?.querySelector("h2")?.textContent.toLowerCase() || "";
            let tipo = "general";

            if (textoTarjeta.includes("cliente")) tipo = "cliente";
            else if (textoTarjeta.includes("proveedor")) tipo = "proveedor";
            else if (textoTarjeta.includes("pqrs")) tipo = "pqrs";
            else if (textoTarjeta.includes("whatsapp")) tipo = "whatsapp";

            abrirConversacion(tipo);
        });
    });
}

// Simula el envío del formulario: valida los campos, pero no envía datos reales.
function configurarFormulario() {
    const formulario = document.querySelector("#formContacto");
    if (!formulario) return;

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        abrirConversacion("formulario");
        formulario.reset();
    });
}

// Inicializa las interacciones cuando el HTML ya está disponible.
document.addEventListener("DOMContentLoaded", () => {
    crearEstilosChat();
    configurarEnlacesContacto();
    configurarFormulario();
});


const contenido = document.querySelector('#contenido');
const enlace = document.querySelector('#contenido a');
const infoAbout = document.querySelector('#info-about');
const presentacion = document.querySelector('#presentacion');

function mostrarInfo(e) {
    e.preventDefault();
    contenido.classList.add('oculto');
    infoAbout.classList.remove('oculto');
}

function mostrarPresentacion() {
    infoAbout.classList.add('oculto');
    presentacion.classList.remove('oculto');
}


function volverAlInicio() {
    presentacion.classList.add('oculto');
    contenido.classList.remove('oculto');
}

enlace.addEventListener('click', mostrarInfo);
infoAbout.addEventListener('click', mostrarPresentacion);
presentacion.addEventListener('click', volverAlInicio);