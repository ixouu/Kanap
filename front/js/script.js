const apiUrl = "http://localhost:3000/api/products";
const items = document.getElementById('items');
/*
* Initialize class Collection
*/
class Collection{
/* 
* Fetching API
* apiURL {string} URL
*/ 
async fetchProducts(){
    fetch(apiUrl)
    .then(data => data.json())
    .then(jsonListProduct =>{
        // Iterate through the DOM and insert new card with the method insertCard
        for (let jsonProduct of jsonListProduct){
            let productCard = new Card(jsonProduct);
            productCard.insertCard();
        }
    })
}
}
/*
* Initialize class Card
*/
class Card{
    constructor(jsonProduct){
        this.a = document.createElement('a');
        this.a.setAttribute('href', `./product.html?id=${jsonProduct._id}`);
        this.name = jsonProduct.name;
        this.imageUrl = jsonProduct.imageUrl;
        this.description = jsonProduct.description;
        this.altTxt = jsonProduct.altTxt;
    }
/*
* Method insertCard
*
*/
    insertCard(){ 
        this.a.innerHTML =`
        <article>
            <img src="${this.imageUrl}" alt="${this.altTxt}">
            <h3 class="productName">${this.name}</h3>
            <p class="productDescription">${this.description}</p>
        </article>`;
        items.append(this.a);
    }
}

let collection = new Collection;
collection.fetchProducts();

