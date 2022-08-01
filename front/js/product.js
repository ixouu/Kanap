//Initialize class Item
class Item {

    //Search and return product's ID
    findIdByUrl() {
        let searchParams = new URLSearchParams(document.location.search);
        let findCurrentItemId = searchParams.get('id');
        return findCurrentItemId;
    }

    // Return an array of the localStorage
    get displayBasket(){
        let basket = localStorage.getItem('basket')
        if (basket == null){
            return [];
        }else{
            console.log(basket)
            return JSON.parse(basket)
        }
    }

    // Save the current item in the local Storage
    checkEmptyChoices(color, quantity) {
        if ( color == '' && quantity == 0 ){
            alert('Vous n\'avez pas sélectionné une couleur et une quantité valide');
            return false
        }else if(color !== '' && quantity == 0){
            alert('Vous n\'avez pas sélectionné une quantité valide');
            return false
        }else if (color == '' && quantity !== 0){
            alert('Vous n\'avez pas sélectionné une couleur valide');
            return false
        }else if ( color !== ''&& quantity !== 0){
            return true
        }
    }
    //Set the item basket into the localStorage
    saveBasket(basket){
        localStorage.setItem("basket", JSON.stringify(basket))
    }


    // add the product to the local Storage
    addBasket(product){
        let checkUserChoices = this.checkEmptyChoices(product.color, product.quantity);
        if ( checkUserChoices == true ){
            let basket = this.displayBasket;
            let foundProduct = basket.find(p => p.id == product.id && p.color == product.color)
            if (foundProduct == undefined){
                basket.push(product);
                this.saveBasket(basket);
                alert('Votre article a été ajouté au panier')
                return
            } else {
                if(foundProduct.quantity == product.quantity ){
                    alert('Veuillez changer la quantité ou la couleur')
                    return
                }else if (foundProduct.quantity !== product.quantity){
                    alert('La quantité de ce produit a été mis à jour dans votre panier')
                    foundProduct.quantity = product.quantity;
                    this.saveBasket(basket);
                }
            }
        }else{
            return
        }
    }
    //Fetch the API, transform API Data to JSON format, iterate through the DOM and insert item's details
    async fetchItem() {
        this.id = this.findIdByUrl();
        fetch(`http://localhost:3000/api/products/${this.id}`)
            .then(response => {
                if (response.status !== 200) {
                    console.log('Erreur status code : ' + response.status)
                    return;
                } else {
                    return response.json();
                }
            })
            .then(data => {
                let item = new ItemContent(data);
                item.insertItemDetails();
            })
            .catch(error => console('Erreur : ' + error));
    }
}


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
        }
    }
}
//Listen add to cart Button and store into localStorage the new item if the inputs has been chosen;
document.getElementById('addToCart').addEventListener('click', (e) => {
    e.preventDefault();
    let product = {
        id : item.findIdByUrl(),
        color : document.getElementById('colors').value,
        quantity : parseInt(document.getElementById('quantity').value)
    };
    item.addBasket(product)
});

// A new item is created and his data is fetched
let item = new Item;
item.fetchItem();