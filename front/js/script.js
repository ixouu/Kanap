//Initialize class Collection
class Collection{

// Fetch the API, transform API Data to JSON format, iterate through the DOM and insert new card with 
// the method insertCard
    fetchProducts(){

        fetch("http://localhost:3000/api/products")
        .then(response => {
            if (response.status !== 200){
                return;
            } else {
                return response.json();
            }
        })
        .then(jsonListProducts =>{
            for (let jsonProduct of jsonListProducts){
                let productCard = new Card(jsonProduct);
                productCard.insertCard();
            }
        })
        .catch(error => console.log('Erreur : ' + error));
    }
}

// Initialize class Card and create card template
class Card{
    constructor(jsonProduct){
        this.a = document.createElement('a');
        this.id = jsonProduct._id;
        this.a.setAttribute('href', `./product.html?id=${this.id}`);
        this.name = jsonProduct.name;
        this.imageUrl = jsonProduct.imageUrl;
        this.description = jsonProduct.description;
        this.altTxt = jsonProduct.altTxt;
        this.article = document.createElement('article');
        this.img = document.createElement('img');
        this.img.setAttribute('src', `${this.imageUrl}`);
        this.img.setAttribute('alt', `${this.altTxt}`)
        this.title = document.createElement('h3');
        this.title.classList.add('productName')
        this.paragraph = document.createElement('p');
        this.paragraph.classList.add('productDescription');
    }

//Method who ensures data ID from backend is valid 
    validateId(){
        return this.id.length === 32 ? true : false;
    }
//Method who ensures data NAME from backend is valid 
    validateName(){
        return typeof(this.name) === "string" ? true : false;
    }
//Method who ensures data IMAGEURL from backend is valid 
    validateImageUrl(){
        let expectedExtension = 'jpeg';
        let imageUrlArray = this.imageUrl.split('.')
        let imageUrlExtension = imageUrlArray[[imageUrlArray.length]-1];
        return imageUrlExtension === expectedExtension ? true : false;
    }

//Method who ensures data from backend is valid 
    validateCard(){

        let isValid = [];
        isValid.push(this.validateId());
        isValid.push(this.validateName());
        isValid.push(this.validateImageUrl());
        if(isValid.includes(false)) {
            this.isValid = false;
            console.log('Les données de l\'Api ne sont pas conforme');
        }else{
            this.isValid = true;
        }
    }
        
// HTML content is added to the link
    insertCard(){
        
        this.validateCard()
        if (this.isValid == true){
        this.a.append(this.article)
        this.article.append(this.img, this.title, this.paragraph)
        this.title.innerText = `${this.name}`;
        this.paragraph.innerText = `${this.description}`
        document.getElementById('items').append(this.a);
        }
    }
}

// Create a new Collection and fetch the products
let collection = new Collection;
collection.fetchProducts();