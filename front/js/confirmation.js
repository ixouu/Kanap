const currentUrl = new URL(window.location.href);
const orderId = new URLSearchParams(currentUrl.search).get('order_id');

function displayOrderId(num) {

    document.getElementById('orderId').innerText = `${num}`
}

displayOrderId(orderId);