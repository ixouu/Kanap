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
        this.colorIsReadytoStore = false;
        this.quantityIsReadytoStore = false;
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
            .catch(error => alert('Erreur : ' + error));
    };

    // Create an array for the current item and store into the local storage the selected options
    storeNewItemToBasket() {

        this.id = currentId;
        this.color = colorsOptions.value;
        this.quantity = parseInt(quantityOption.value);
        this.checkColorsOptionsValue(this.color);
        this.checkQuantityValue(this.quantity);
        this.properties.push(this.id, this.color, this.quantity);
        if (this.colorIsReadytoStore == false && this.quantityIsReadytoStore == false){
            alert('Vous n\'avez pas sélectionné une couleur et une quantité valide');
        }else if(this.colorIsReadytoStore == true && this.quantityIsReadytoStore == false){
            alert('Vous n\'avez pas sélectionné une quantité valide');
        }else if (this.colorIsReadytoStore == false && this.quantityIsReadytoStore == true){
            alert('Vous n\'avez pas sélectionné une couleur valide');
        }else if (this.colorIsReadytoStore == true && this.quantityIsReadytoStore == true){
            this.saveItem();
            alert('votre article a été ajouté au panier');
        }
    }

    //Check if the color value isn't empty
    checkColorsOptionsValue(value){
        
        if (value == ""){
            this.colorIsReadytoStore = false;
        } else if (value !== ""){
            this.colorIsReadytoStore = true;
        }
        return  this.colorIsReadytoStore
    }
    //Check if the quantity value is correct
    checkQuantityValue(value){
        if(value <= 0){
            this.quantityIsReadytoStore = false;
        }else if (value >= 100){
            this.quantityIsReadytoStore = false;
        }else if (0 <= value <= 100) {
            this.quantityIsReadytoStore = true;
        }
        return this.quantityIsReadytoStore 
    }

    //save Item into the localStorage
    saveItem() {
        let basket = JSON.parse(localStorage.getItem("basket"));
        // The basket doesn't exist in the localStorage, creation of basket
        if (basket == null) {
            localStorage.setItem('basket', JSON.stringify(this.properties));
            // The basket exists in the localStorage
        } else if (basket != null) {
            let findColor = basket.find(find => find == this.color);
            let findId = basket.find(find => find == this.id);
            // The Color and the ID exist : Item's quantity is update in the basket
            if (findId == this.id && findColor == this.color) {
                let itemToRemove = (basket.indexOf(this.color)) + 1;
                basket.splice(`${itemToRemove}`, 1, this.quantity);
                localStorage.setItem('basket', JSON.stringify(basket));
            }
            // the ID exist : new color and quantity are added to the basket
            else if (findId == this.id && findColor == undefined) {
                basket.push(this.id, this.color, this.quantity);
                localStorage.setItem('basket', JSON.stringify(basket));
            }
            // The ID doesn't exist, the item is added to the basket
            else if (findId !== this.id) {
                basket.push(this.id, this.color, this.quantity);
                localStorage.setItem('basket', JSON.stringify(basket));
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
    item.storeNewItemToBasket();
});

// A new item is created and his data is fetched
let item = new Item;
item.fetchItem();