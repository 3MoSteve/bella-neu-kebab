function getOrderStatus(statusCode) {
    switch (statusCode) {
        case 0:
            return 'Bearbeitung';
        case 1:
            return 'Im Lieferung';
        case 2:
            return 'Geliefert';
        default:
            return 'Unbekannt';
    }
}
document.addEventListener('DOMContentLoaded', function () {

    var pass = (new URLSearchParams(location.search)).get("pass");

    const viewOrderButtons = document.querySelectorAll('.view-order-btn');
    viewOrderButtons.forEach(button => {
        button.addEventListener('click', function () {
            const orderNumber = this.getAttribute('data-order-number');
            // Call function to view order details
            viewOrderDetails(orderNumber);
        });
    });

    function viewOrderDetails(orderNumber) {
        // Fetch request to get order details
        fetch(`/admin/order/${orderNumber}`,
        {
            method: "GET",
            headers: {
                Authorization: pass
            }
        })
            .then(response => response.json())
            .then(order => {
                // Format order date

    
                // Create HTML content for order details
                let htmlContent = `
                    <p><strong style="color:#401AFF;">Bestell Nr:</strong> ${order.number}</p>
                    <p><strong style="color:#401AFF;">Status:</strong> ${getOrderStatus(order.status)}</p>
                    <p><strong style="color:#401AFF;">Bestelldatum:</strong> ${order.date}</p>
                    <p><strong style="color:#00C4FF;">Bestellte Artikel:</strong></p>
                    <ul>
                `;

                let maxPreis = 0;

    
                // Loop through ordered items
                Object.values(order.order).forEach(item => {
                    // Format extras
                    let extras = '';
                    if (item.extras.length > 0) {
                        extras = `<p><strong style="color:#0583A9;">Zusätze:</strong> ${item.extras.map(extra => extra.name).join(', ')}</p>`;
                    }
    
                    // Add item details to HTML content
                    htmlContent += `
                        <li>
                            <p><strong style="color:#0583A9;">Name:</strong> ${item.name}</p>
                            <p><strong style="color:#0583A9;">Größe:</strong> ${item.size || 'Standard'}</p>
                            ${extras}
                            <p><strong style="color:orange;">Preis:</strong> ${item.totalPrice}€</p>
                        </li>
                    `;
                    maxPreis += Number(item.totalPrice);

                });
    
                // Close HTML content
                htmlContent += `</ul><p><strong style="color:green;">Gesamtpreis:</strong> ${maxPreis.toFixed(2)}€</p><span style="font-size: 1.2rem;color:red;">* </span><span style="font-size: 0.9rem;color:orange;">Bitte überprüfen Sie der Gesamtpreis auch einmal! Es kann auch fehlern passieren manchmal!</span>`;

    
                // Display order details using SweetAlert2
                Swal.fire({
                    title: 'Bestellungsdetails',
                    html: htmlContent,
                    confirmButtonText: 'Schließen'
                });
            })
            .catch(error => {
                console.error('Error fetching order details:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut!'
                });
            });
    }


    // Add event listener for "Status ändern" button
    const changeStatusButtons = document.querySelectorAll('.change-status-btn');
    changeStatusButtons.forEach(button => {
        button.addEventListener('click', function () {
            const orderNumber = this.getAttribute('data-order-number');
            // Call function to change order status
            changeOrderStatus(orderNumber);
        });
    });

    // Add event listener for "Bestellung löschen" button
    const deleteOrderButtons = document.querySelectorAll('.delete-order-btn');
    deleteOrderButtons.forEach(button => {
        button.addEventListener('click', function () {
            const orderNumber = this.getAttribute('data-order-number');
            // Call function to delete order
            deleteOrder(orderNumber);
        });
    });

    // Function to change order status
    function changeOrderStatus(orderNumber) {
        Swal.fire({
            title: 'Status ändern',
            input: 'select',
            inputOptions: {
                '0': 'Bearbeitung',
                '1': 'Im Lieferung',
                '2': 'Geliefert'
            },
            inputPlaceholder: 'Wähle den neuen Status',
            showCancelButton: true,
            confirmButtonText: 'Bestätigen',
            cancelButtonText: 'Abbrechen',
            inputValidator: (value) => {
                if (!value) {
                    return 'Du musst einen Status wählen!'
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Call function to update order status via fetch request
                updateOrderStatus(orderNumber, result.value);
            }
        });
    }

    // Function to delete order
    function deleteOrder(orderNumber) {
        Swal.fire({
            title: 'Bestellung löschen',
            text: 'Bist du sicher, dass du diese Bestellung löschen möchtest?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'Ja, löschen',
            cancelButtonText: 'Abbrechen'
        }).then((result) => {
            if (result.isConfirmed) {
                // Call function to delete order via fetch request
                deleteOrderRequest(orderNumber);
            }
        });
    }

    // Function to update order status via fetch request
    function updateOrderStatus(orderNumber, status) {
        fetch("/admin/status/"+orderNumber, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: pass

            },
            body: JSON.stringify({
                status: status
            })
        }).then(async res => {
            if (!res.ok) {
                Swal.fire("Fehler", (await res.text())||"Unbekannte Fehler", "info");location.reload();
                
            } else {
                Swal.fire("Erfolgreisch", "Die Status wurde geändert.", "success");
            }
        })
    }

    // Function to delete order via fetch request
    function deleteOrderRequest(orderNumber) {
        fetch("/admin/delete/"+orderNumber, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: pass
            }
        }).then(async res => {
            if (res.ok) {
                Swal.fire("Erfolgreisch", "Die Bestellung wurde gelöscht!", "success");
                location.reload();

            } else Swal.fire("Fehler", ((await res.text()) || "Unbekannten Fehler", "info"));
        })
    }

    // Function to get order status based on status code
    
});
