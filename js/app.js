$(document).ready(function () {
    $.getJSON('data/myProjects.json', function (data) {
        const projectsList = $('#project-list');
        data.forEach(function (projectsItem) {
            const projectsElement = `
                <div class="myProjects">
                    <h3>${projectsItem.title}</h3>
                    <p><strong>Fecha:</strong> ${projectsItem.date}</p>
                    <p>${projectsItem.description}</p>
                </div>
            `;
            projectsList.append(projectsElement);
        });
    });

    // Variables para el modal y las imágenes
    let modal = document.getElementById('galleryModal');
    let closeModalButton = document.querySelector('.modal-close span');
    let galleryItems = document.querySelectorAll('.gallery-item');

    // Función para abrir el modal al hacer clic en una imagen de la galería
    function openModal() {
        modal.style.display = "flex";
    }

    // Función para cerrar el modal
    function closeModal() {
        modal.style.display = "none";
    }

    // Añadir event listeners a los elementos de la galería
    galleryItems.forEach(item => {
        item.addEventListener('click', openModal);
    });

    // Añadir event listener al botón de cerrar
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }

    // Añadir event listener para cerrar el modal al hacer clic fuera del contenido del modal
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Formulario de presupuesto
    const form = document.getElementById('budget-form');
    const nameInput = document.getElementById('name');
    const surnameInput = document.getElementById('surname');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const productSelect = document.getElementById('product');
    const timeframeInput = document.getElementById('timeframe');
    const extra1Checkbox = document.getElementById('extra1');
    const extra2Checkbox = document.getElementById('extra2');
    const extra3Checkbox = document.getElementById('extra3');
    const totalInput = document.getElementById('total');
    const privacyCheckbox = document.getElementById('privacy');

    // Función para validar los datos de contacto
    function validateContactData() {
        let valid = true;
        // Validamos el nombre
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]{1,15}$/.test(nameInput.value)) {
            document.getElementById('name-error').textContent = 'El nombre debe contener solo letras y tener un máximo de 15 caracteres.';
            valid = false;
        } else {
            document.getElementById('name-error').textContent = '';
        }

        // Validamos el apellido
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]{1,40}$/.test(surnameInput.value)) {
            document.getElementById('surname-error').textContent = 'El apellido debe contener solo letras y tener un máximo de 40 caracteres.';
            valid = false;
        } else {
            document.getElementById('surname-error').textContent = '';
        }

        // Validamos el teléfono
        if (!/^\d{9}$/.test(phoneInput.value)) {
            document.getElementById('phone-error').textContent = 'El teléfono debe contener solo números y tener exactamente 9 dígitos.';
            valid = false;
        } else {
            document.getElementById('phone-error').textContent = '';
        }

        // Validamos el email
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        if (!emailRegex.test(emailInput.value)) {
            document.getElementById('email-error').textContent = 'El correo electrónico no es válido.';
            valid = false;
        } else {
            document.getElementById('email-error').textContent = '';
        }

        // Validamos la aceptación de condiciones de privacidad
        if (!privacyCheckbox.checked) {
            document.getElementById('privacy-error').textContent = 'Debes aceptar las condiciones de privacidad.';
            valid = false;
        } else {
            document.getElementById('privacy-error').textContent = '';
        }

        return valid;
    }
    // Función para calcular el total del presupuesto
    function calculateTotal() {
        const productPrice = parseFloat(productSelect.value);
        const timeframe = parseInt(timeframeInput.value);
        let extrasTotal = 0;

        if (extra1Checkbox.checked) {
            extrasTotal += parseFloat(extra1Checkbox.value);
        }
        if (extra2Checkbox.checked) {
            extrasTotal += parseFloat(extra2Checkbox.value);
        }
        if (extra3Checkbox.checked) {
            extrasTotal += parseFloat(extra3Checkbox.value);
        }

        let discount = 0;
        if (timeframe >= 6) {
            discount = 0.1;  // 10% de descuento si el plazo es 6 meses o más
        }

        let total = productPrice + extrasTotal;
        total = total - (total * discount);
        totalInput.value = total.toFixed(2) + '€';
    }

    // Cuando se cambia cualquier valor en el formulario, se recalcula el presupuesto
    form.addEventListener('input', function () {
        if (validateContactData()) {
            calculateTotal();
        } else {
            totalInput.value = ''; // Clear the total if validation fails
        }
    });

    // Al enviar el formulario, se verifica si los datos son correctos
    form.addEventListener('submit', function (event) {
        if (!validateContactData()) {
            event.preventDefault(); // Prevenimos que se envíe el formulario si hay errores
            alert('Por favor, completa todos los campos correctamente.');
        } else {
            alert('Presupuesto enviado con éxito!');
        }
    });

    // Al restablecer el formulario, se limpian los mensajes de error y el total
    form.addEventListener('reset', function () {
        document.getElementById('name-error').textContent = '';
        document.getElementById('surname-error').textContent = '';
        document.getElementById('phone-error').textContent = '';
        document.getElementById('email-error').textContent = '';
        document.getElementById('privacy-error').textContent = '';
        totalInput.value = '';
    });
});

$(document).ready(function () {
    // Initializamos el mapa
    let map = L.map('map').setView([40.349899, -3.823231], 13);

    // Añadimos la capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Añadimos un marcador con la ubicación de la empresa
    L.marker([40.349899, -3.823231]).addTo(map)
        .bindPopup('MasterD<br> AV, Leganés, 6 Local 3, Alcorcón, Madrid')
        .openPopup();

    // Calculamos la distancia entre dos coordenadas
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distancia en km
    }

    //Obtenemos la ubicación actual del usuario y calculamos la distancia
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            const companyLat = 40.349899;
            const companyLon = -3.823231;
            const distance = calculateDistance(userLat, userLon, companyLat, companyLon);
            $('#distance').text(`Distancia a la empresa: ${distance.toFixed(2)} km`);
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
});