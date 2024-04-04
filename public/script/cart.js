document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cartItems');

    // Get cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart'));
    
    // Check if cart is not empty
    if (cartItems && Object.keys(cartItems).length > 0) {
        // Display each cart item
        Object.keys(cartItems).forEach(key => {
            const item = cartItems[key];
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h2 class="cart-item-name">${item.name}</h2>
                    ${item.size ? `<p class="cart-item-description">Größe: ${item.size}</p>` : ""}
                    ${
                        item.extras ? 
                        item.extras.map(ext => {
                            console.log(ext);
                            return `<span>${ext.name}: ${ext.value ? ext.value : ""} <span style="color:green">+${ext.price}€</span></span>`
                        }).join("<br/>") : ""
                    }

                    <p class="cart-item-price">${Number(item.totalPrice).toFixed(2)}€</p>
                    <button class="delete-btn" data-key="${key}">X</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });
        
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.onclick =e => {
                let key = e.target.getAttribute("data-key");
                if (cartItems[key]) {
                    delete cartItems[key];
                    localStorage.setItem('cart', JSON.stringify(cartItems));
                    Swal.fire({
                        icon:'success',
                        title: 'Der Artikel wurde erfolgreich aus dem Warenkorb entfernt.',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(r => {
                        window.location.reload();

                    })                    
                }
            }
        })
    } else {
        // Display message if cart is empty
        const emptyCartMessage = document.createElement('p');
        emptyCartMessage.style.color = "white";
        emptyCartMessage.textContent = 'Ihre Warenkorb ist leer.';
        cartItemsContainer.appendChild(emptyCartMessage);
    }

    // Add event listener for "Finish Ordering" button
    const finishOrderBtn = document.getElementById('finishOrderBtn');
    finishOrderBtn.addEventListener('click', function () {
        let _data = JSON.parse(localStorage.cart);

        Swal.fire({
            title: 'Bitte geben Sie Ihre Adresse ein',
            html:
                '<input id="firstName" class="swal2-input" placeholder="Vorname">' +
                '<input id="lastName" class="swal2-input" placeholder="Nachname">' +
                '<input id="street" class="swal2-input" placeholder="Straße, Hausnr">' +
                '<input id="postalCode" class="swal2-input" placeholder="PLZ">' +
                '<input id="city" class="swal2-input" placeholder="Ort">',
            focusConfirm: false,
            preConfirm: () => {
                // Retrieve user input
                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const street = document.getElementById('street').value;
                const postalCode = document.getElementById('postalCode').value;
                const city = document.getElementById('city').value;
    
                // Validate input
                if (!firstName || !lastName || !street || !postalCode || !city) {
                    Swal.showValidationMessage('Bitte füllen Sie alle Felder aus');
                }
    
                // Return an object with user input
                return {
                    firstName: firstName,
                    lastName: lastName,
                    street: street,
                    postalCode: postalCode,
                    city: city
                };
            }
        }).then(result => {
            // Display user input
            if (result.isConfirmed) {
                const address = result.value;
                fetch("/foods/order", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({order: _data, user: address})
                }).then(async res => {
                    if (res.ok) {
                        let dat = await res.json();
        
                        Swal.fire("Erfolgreisch", `Ihre Bestellung ist jetzt im bearbeitung.<br/>Sie können jederzeit die Status deiner Bestellung <a href="/status/${dat.number}">Hier</a> rufen`, "success").then(() => {
                            Swal.fire("WICHTIG", "Bitte merken Sie sich ihre Bestell-Nr!<br/>"+dat.number, "info");
                        });
        
        
                    } else {
                        let txt = await res.text();
                        Swal.fire("Fehler", txt||"Unerwartende Fehler, bitte Rufen Sie uns an für die Bestellung!", "error");
        
                    }
                })
            }
        });
        
        // window.location.href = '/'; // Change the URL to your desired destination
    });
});
