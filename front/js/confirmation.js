const currentUrl = new URL(window.location.href);
const orderId = new URLSearchParams(currentUrl.search).get('order_id');

// display the order's ID in the div #orderId 
function displayOrderId(num) {

    document.getElementById('orderId').innerText = `${num}`
}

displayOrderId(orderId);