const apiUrl = "http://localhost:3000/api/products";
let basket = getBasket();

// Fetch the API and display the product on the HTML Page
async function displayItems() {

    for (let i = 0; i < basket.length; i += 3) {
        let itemId = basket[i];
        let itemColor = basket[i + 1];
        let itemQuantity = basket[i + 2];

        fetch(`${apiUrl}/${itemId}`)
            .then(res => res.json())
            .then((data) => {

                let newArticle = document.createElement('article');
                newArticle.classList.add('cart__item')
                newArticle.setAttribute('data-id', `${itemId}`);
                newArticle.setAttribute('data-color', `${itemColor}`);

                let newQuantity = document.createElement('p');
                newQuantity.innerText = `${itemQuantity}`;


                let newImgDiv = document.createElement('div');
                newImgDiv.classList = "cart__item__img";
                newImgDiv.innerHTML = `
                <img src="${data.imageUrl}" alt="${data.altTxt}">
                `

                let newCartItemContent = document.createElement('div');
                newCartItemContent.classList = 'cart__item__content';
                newCartItemContent.innerHTML = `
                <div class="cart__item__content__description">
                    <h2>${data.name}</h2>
                    <p>${itemColor}</p>
                    <p>${data.price + ',00'} €</p>
                  </div>
                `;

                let newCartContentSettings = document.createElement('div');
                newCartContentSettings.classList = 'cart__item__content__settings';
                newCartContentSettings.innerHTML = `
                <div class="cart__item__content__settings__quantity">
                <p>Qté : ${itemQuantity}</p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${itemQuantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                </div>
                `;
                let deleteItemBtn = document.createElement('p');
                deleteItemBtn.classList = 'deleteItem'
                deleteItemBtn.innerText = 'Supprimer'
                deleteItemBtn.addEventListener('click', () => {
                    deleteArticle(itemId, itemColor);
                })

                newCartItemContent.append(newCartContentSettings);
                newArticle.append(newImgDiv, newCartItemContent);
                document.getElementById('cart__items').append(newArticle);
                document.querySelectorAll('.cart__item__content__settings__delete').forEach(element => {
                    element.append(deleteItemBtn)
                })

            })
            .then(() => {
                getTotalQuantity();
                changeArticleQuantity();
                getTotalPrice();
            }
            )
            .catch(error => console.log('Erreur : ' + error));
    }
}


// Get LocalStorage data and parse it into an array
function getBasket() {

    let basket = localStorage.getItem("basket");
    if (basket == null) {
        return [];
    } else {
        return JSON.parse(basket);
    }
}

// Update the localStorage Data
function saveBasket(basket) {

    localStorage.setItem("basket", JSON.stringify(basket));
}

// Update the HTML element #totalQuantity
function getTotalQuantity() {

    let totalQuantity = 0;
    document.querySelectorAll('.itemQuantity').forEach(element => {
        totalQuantity += parseInt(element.value)
    })
    document.getElementById('totalQuantity').textContent = totalQuantity;
}

// Update de HTML element #totalPrice 
function getTotalPrice() {

    let totalPrice = 0;
    let items = document.getElementsByClassName('cart__item');
    for (let item of items) {
        let productPrice = parseFloat(item.querySelector('.cart__item__content__description').lastElementChild.textContent.slice(0, -5));
        let productContent = item.querySelector('.itemQuantity').value;
        totalPrice += productPrice * productContent;
    }
    document.getElementById('totalPrice').textContent = `${totalPrice + ',00'}`;
}

// Listen every changes of items quantities, update totalPrice, item quantity and the basket
// in the localStorage
function changeArticleQuantity() {

    document.querySelectorAll('.itemQuantity').forEach(element => {
        element.addEventListener('input', e => {
            getTotalQuantity();
            let productId = e.target.closest('article').getAttribute('data-id');
            let productColor = e.target.closest('article').getAttribute('data-color');
            let productQuantityParagraph = e.target.previousElementSibling;
            productQuantityParagraph.textContent = `Qté : ${e.target.value} `
            let basket = getBasket();
            let findProduct = basket.find(i => i == productId);
            basket.splice(findProduct, 3, productId, productColor, parseInt(element.value));
            getTotalPrice()
            saveBasket(basket);
        })
    });

}

// Listen the click of .deleteItem elements, remove the html article, save the basket,
// update the total quantity, total price and reload the location 
function deleteArticle(itemId, itemColor) {

    let basket = getBasket();
    let findProduct = basket.find(i => i === itemId || i === itemColor);
    basket.splice(findProduct, 3);
    saveBasket(basket);
    let articles = document.querySelectorAll('.cart__item');
    for (let i = 0; i < articles.length; i++) {
        console.log(articles[i])
        if (articles[i].getAttribute('data-id') === itemId && articles[i].getAttribute('data-color') === itemColor) {
            articles[i].remove()
        }
    }
    getTotalQuantity();
    getTotalPrice();
    alert('L\'artcile a bien été supprimé de votre panier')
}

displayItems();


/**************
FORM
***************/

// Create an objet to store user infos
let contact = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    email: ''
}

// Verifies if the form inputs are valids or not 
let isValidInputs = {
    firstName: false,
    lastName: false,
    address: false,
    city: false,
    email: false
}
// Define all RegExps
const regExpList = {
    firstName: new RegExp('(^[a-zA-Z ]{3,20}$)'),
    lastName: new RegExp('(^[a-zA-Z -]{3,30}$)'),
    address: new RegExp('(^[a-zA-Z 0-9,-]{3,50}$)'),
    city: new RegExp('(^[a-zA-Z -]{3,20}$)'),
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
}
// Check user input and store the answer, change the value of isValidinput Object
function checkUserInformations(input, regex, id) {

    if (regex.test(input.value)) {
        input.style.border = '2px solid Green';
        document.getElementById(`${id}ErrorMsg`).innerText = '';
        contact[id] = input.value;
        isValidInputs[id] = true;
    } else {
        input.style.border = '2px solid Red';
        isValidInputs[id] = false;
        if (id == "firstName" || id == "lastName") {
            document.getElementById(`${id}ErrorMsg`).innerText = 'Le format renseignée n\'est pas valide (ex : "Julien")';
        } else if (id == 'email') {
            document.getElementById(`${id}ErrorMsg`).innerText = 'Le format renseignée n\'est pas valide (ex: " johndoe@aol.com ") ';
        } else {
            document.getElementById(`${id}ErrorMsg`).innerText = 'L\'information renseignée n\'est pas valide';
        }
    }
}
//Listen Inputs of the form and fire validity function on change
for (let input of document.querySelector('.cart__order__form')) {
    if (input.type == "text" || input.type == "email") {
        input.addEventListener('change', (e) => {
            checkUserInformations(e.target, regExpList[e.target.id], e.target.id);
        })
    }
}
//Listen order Button and verifies if all inputs values are corrects and if 
//the basket isn't empty,then call the function postOrder
document.getElementById('order').addEventListener('click', e => {
    e.preventDefault();
    let checkInputValidity = Object.values(isValidInputs).includes(false);
    
    if (checkInputValidity == true) {
        alert('Les données renseignées dans le formulaire ne sont pas valides');
        return;
    } else if (getBasket() === []) {
        alert('Votre panier est vide');
        return;
    }
    else if (checkInputValidity == false) {
        postOrder();
    }
});

// Store the product Id's , create an object data with contact details and product Id's. Then this data is send to the API,
// if an error appears, it will raise an error, else the user will be redirected to the confirmation page 
async function postOrder() {

    let products = [];
    console.log(products)
    for (let i = 0; i < basket.length; i += 3) {
        products.push(basket[i])
    }
    let data = {
        contact,
        products,
    };
    if (products == []){
        alert('Votre panier est vide, veuillez y ajouter des produits avant de passer commande')
        return
    }else {
        fetch(`${apiUrl}/order`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((res) => {
                if (res.status == 201) {
                    alert('Votre commande a bien été validée');
                    return res.json();
                } else if (res.status !== 201) {
                    alert('une erreur est survenue lors de l\'envoi du formulaire, veuillez réessayer')
                }
            })
            .then((res) => {
                localStorage.clear();
                window.location.href = `../html/confirmation.html?order_id=${res.orderId}`;
            })
    }
}

