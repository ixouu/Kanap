const totalArticle = document.getElementById('totalQuantity');
const totalPrice = document.getElementById('totalPrice');

class Basket {
    // return the calculated quantity of articles
    get totalArticle() {
        let totalQuantity = 0;
        document.querySelectorAll('.itemQuantity').forEach(element => {
            totalQuantity += parseInt(element.value)
        });
        return totalQuantity;
    }
    // return the calculated total Price
    get totalPrice() {
        let totalPrice = 0;
        let items = document.getElementsByClassName('cart__item');
        for (let item of items) {
            let productPrice = parseFloat(item.querySelector('.cart__item__content__description').lastElementChild.textContent.slice(0, -5));
            let productContent = item.querySelector('.itemQuantity').value;
            totalPrice += productPrice * productContent;
        }
        return totalPrice;
    }
    // Return an array of the localStorage
    get basket() {
        let basket = localStorage.getItem("basket");
        if (basket == null) {
            return [];
        } else {
            return JSON.parse(basket);
        }
    }
    // Display the total Price
    displayTotalPrice() {
        totalPrice.textContent = `${this.totalPrice},00`;
    }
    // Display the total number of articles
    displayTotalArticle() {
        totalArticle.textContent = this.totalArticle;
    }
    // Update the localStorage Data
    saveBasket(basket) {
        this.displayTotalPrice();
        this.displayTotalArticle();
        localStorage.setItem("basket", JSON.stringify(basket));
    }
    // Remove product in the localStorage
    removeItemFromBasket(id, color){
        let basket = this.basket;
        let foundProduct = basket.find(p => p.id == id && p.color == color)
        basket = basket.filter(p => p != foundProduct);
        this.saveBasket(basket)
    }
    // update the localStorage
    updateItemFromBasket(id, color, quantity){
        let basket = this.basket;
        let foundProduct = basket.find(p => p.id == id && p.color == color)
        switch (foundProduct.quantity >= 1) {
            case false:
                alert('Pas de valeur trouvée'); 
                break;
            case true:
                foundProduct.quantity = quantity;
                this.saveBasket(basket);
                break;
            default:
                alert('Pas de valeur trouvée');
                break;
        }
    }
    // fetch the API and create new objects
    apiData() {
        let basket = this.basket;
        for (let i = 0; i < basket.length; i++) {
            let productId = basket[i].id
            let productColor = basket[i].color;
            let productQuantity = basket[i].quantity;
            fetch(`http://localhost:3000/api/products/${productId}`)
                .then(response => {
                    if (response.status !== 200) {
                        console.log('Erreur status code : ' + response.status)
                        return;
                    } else {
                        return response.json();
                    }
                })
                .then(data => {
                    let item = new Item(data, productColor, productQuantity);
                    item.displayItems();
                    this.displayTotalPrice();
                    this.displayTotalArticle();
                })
                .catch(error => console('Erreur : ' + error));
        }       
    }

}

class Item {
    constructor(data, color, quantity) {
        this.itemId = data._id;
        this.itemName = data.name;
        this.itemPrice = `${data.price + ',00'}`
        this.itemImageUrl = data.imageUrl;
        this.itemAltTxt = data.altTxt;
        this.itemColor = color;
        this.itemQuantity = quantity;
    }
    // Remove HTML element and update the localStorage
    deleteArticle(article) {
        let articleId = article.getAttribute('data-id');
        let articleColor = article.getAttribute('data-color');
        article.remove();
        cart.removeItemFromBasket(articleId, articleColor);
        cart.displayTotalPrice();
        cart.displayTotalArticle();
    }

    // Listen every changes of items quantities, update totalPrice, item quantity and the basket
    // in the localStorage
     updateQuantity(article) {
        let articleId = article.getAttribute('data-id');
        let articleColor = article.getAttribute('data-color');
        let articleQuantity = article.querySelector('.itemQuantity').value;
        let productQuantityParagraph = article.querySelector('.itemQuantity').previousElementSibling;
        productQuantityParagraph.textContent = `Qté : ${articleQuantity} `;
        cart.updateItemFromBasket(articleId ,articleColor, articleQuantity)
        cart.displayTotalPrice();
        cart.displayTotalArticle()
    }
    // Create HTML elements and add them in the DOM
    displayItems() {
        let newArticle = document.createElement('article');
        newArticle.classList.add('cart__item')
        newArticle.setAttribute('data-id', `${this.itemId}`);
        newArticle.setAttribute('data-color', `${this.itemColor}`);

        let newQuantity = document.createElement('p');
        newQuantity.innerText = `${this.itemQuantity}`;


        let newImgDiv = document.createElement('div');
        newImgDiv.classList = "cart__item__img";
        newImgDiv.innerHTML = `
            <img src="${this.itemImageUrl}" alt="${this.itemAltTxt}">
        `

        let newCartItemContent = document.createElement('div');
        newCartItemContent.classList = 'cart__item__content';
        newCartItemContent.innerHTML = `
            <div class="cart__item__content__description">
                <h2>${this.itemName}</h2>
                <p>${this.itemColor}</p>
                <p>${this.itemPrice} €</p>
            </div>
        `;

        let newCartContentSettings = document.createElement('div');
        newCartContentSettings.classList = 'cart__item__content__settings';
        newCartContentSettings.innerHTML = `
            <div class="cart__item__content__settings__quantity">
                <p>Qté : ${this.itemQuantity}</p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${this.itemQuantity}">
            </div>
            <div class="cart__item__content__settings__delete">
            </div>
        `;
        let deleteItemBtn = document.createElement('p');
        deleteItemBtn.classList = 'deleteItem';
        deleteItemBtn.innerText = 'Supprimer';
        deleteItemBtn.addEventListener('click', (e) => {
            this.deleteArticle(e.target.closest('article'));
        });
        // Listen the click of .deleteItem elements, remove the html article, save the basket,
        // update the total quantity, total price and reload the location function 
        newCartItemContent.append(newCartContentSettings);
        newArticle.append(newImgDiv, newCartItemContent);
        document.getElementById('cart__items').append(newArticle);
        document.querySelectorAll('.cart__item__content__settings__delete').forEach(element => {
            element.append(deleteItemBtn)
        })
        document.querySelectorAll('.itemQuantity').forEach(element => {
            element.addEventListener('input', (e) => {
                this.updateQuantity(e.target.closest('article'))
            });
        });
     }
}

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
    firstName: new RegExp('(^[a-zA-Zéè -]{4,20}$)'),
    lastName: new RegExp('(^[a-zA-Z -]{4,30}$)'),
    address: new RegExp('(^[a-zA-Z 0-9,-]{4,50}$)'),
    city: new RegExp('(^[a-zA-Zàéè -]{4,30}$)'),
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
    } else if (cart.basket === []) {
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
    for (let i = 0; i < cart.basket.length; i ++) {
        products.push(cart.basket[i].id)
    }
    let data = {
        contact,
        products
    };
    if (products == []) {
        alert('Votre panier est vide, veuillez y ajouter des produits avant de passer commande')
        return
    } else {
        fetch('http://localhost:3000/api/products/order', {
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
            .catch(error => console('Erreur : ' + error));
    }
}

let item;
let cart = new Basket;
cart.apiData();