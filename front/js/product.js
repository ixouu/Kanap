const apiUrl = "http://localhost:3000/api/products";
const addToCartBtn = document.getElementById('addToCart');
const colorsOptions = document.getElementById('colors');
const quantityOption = document.getElementById('quantity');
let basket = [];
let currentId;

//Initialize class Item
class Item {
    constructor() {
        this.properties = [];
    }
    //Search and return product's ID
    findIdByUrl() {
        let searchParams = new URLSearchParams(document.location.search);
        let findCurrentItemId = searchParams.get('id');
        return findCurrentItemId;
    };

    //Fetch the API, transform API Data to JSON format, iterate through the DOM and insert item's details
    async fetchItem() {
        currentId = this.findIdByUrl();
        fetch(`${apiUrl}/${currentId}`)
            .then(response => {
                if (response.status !== 200) {
                    return;
                } else {
                    return response.json();
                }
            })
            .then(jsonItem => {
                let item = new ItemContent(jsonItem);
                item.insertItemDetails();
            })
    };

    // Create an array for the current item and store into the local storage the selected options
    storeNewItemToBasket() {
        this.id = currentId;
        this.color = colorsOptions.value;
        this.quantity = parseInt(quantityOption.value);
        this.properties.push(this.id, this.color, this.quantity);
        this.saveItem();
    }

    //save Item into the localStorage
    saveItem() {
        let basket = JSON.parse(localStorage.getItem("basket"));
        // The basket doesn't exist in the localStorage, creation of basket
        if (basket == null) {
            localStorage.setItem('basket', JSON.stringify(this.properties));
            alert('L\'article a bien été ajouté au panier');
            // The basket exists in the localStorage
        } else if (basket != null) {
            let findColor = basket.find(find => find == this.color);
            let findId = basket.find(find => find == this.id);
            // The Color and the ID exist : Item's quantity is update in the basket
            if (findId == this.id && findColor == this.color) {
                let itemToRemove = (basket.indexOf(this.color)) + 1;
                basket.splice(`${itemToRemove}`, 1, this.quantity);
                localStorage.setItem('basket', JSON.stringify(basket));
                alert('La quantité de cet article a été mise à jour dans votre panier');
            }
            // the ID exist : new color and quantity are added to the basket
            else if (findId == this.id && findColor == undefined) {
                basket.push(this.id, this.color, this.quantity);
                localStorage.setItem('basket', JSON.stringify(basket));
                alert('L\'article a bien été ajouté au panier');
            }
            // The ID doesn't exist, the item is added to the basket
            else if (findId !== this.id) {
                basket.push(this.id, this.color, this.quantity);
                localStorage.setItem('basket', JSON.stringify(basket));
                alert('L\'article a bien été ajouté au panier');
            }
        }
    }
};

//Initialize class Item Content
class ItemContent {
    constructor(jsonItem) {
        this.imageUrl = jsonItem.imageUrl;
        this.description = jsonItem.description;
        this.altTxt = jsonItem.altTxt;
        this.img = document.createElement('img');
        this.img.setAttribute('src', `${this.imageUrl}`);
        this.img.setAttribute('alt', `${this.altTxt}`);
        this.itemImg = document.querySelector('.item__img');
        this.name = jsonItem.name;
        this.titleElement = document.getElementById('title');
        this.price = jsonItem.price;
        this.priceElement = document.getElementById('price');
        this.descriptionElement = document.getElementById('description');
        this.colors = jsonItem.colors;
        this.colorSelectElement = document.getElementById('colors');
    }

    //HTML content is added, a new image is created and item's details are displayed
    insertItemDetails() {
        this.itemImg.append(this.img);
        this.titleElement.innerText = `${this.name}`;
        document.title = `${this.name}`;
        this.priceElement.innerText = `${this.price}`;
        this.descriptionElement.innerText = `${this.description}`;
        for (let color of this.colors) {
            this.colorOption = document.createElement('option');
            this.colorOption.setAttribute('value', `${color}`);
            this.colorOption.innerText = `${color}`;
            this.colorSelectElement.appendChild(this.colorOption);
        };
    }
}
//Listen add to cart Button and store into localStorage the new item if the inputs has been chosen;
addToCartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (colorsOptions.value == "" && parseInt(quantityOption.value) < 1) {
        alert('vous n\'avez pas sélectionné une couleur ou une quantité valide');
        return;
    } else {
        item.storeNewItemToBasket();
    }
});

// A new item is created and his data is fetched
let item = new Item;
item.fetchItem();