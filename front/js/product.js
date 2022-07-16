const apiUrl = "http://localhost:3000/api/products";

//Initialize class Item
class Item{

//Search and return product ID
    findItemIdByUrl(){
        let searchParams = new URLSearchParams(document.location.search);
        let findCurrentItemId = searchParams.get('id');
        return findCurrentItemId;
    };

//Fetch the API, transform API Data to JSON format, iterate through the DOM and insert items Details
    async fetchItem(){
        let currentId = this.findItemIdByUrl();
        fetch(`${apiUrl}/${currentId}`)
        .then(response => {
            if (response.status !== 200){
                return;
            }else{
                return response.json();
            }
        })
        .then(jsonItem =>{
            let item = new ItemContent(jsonItem);
            item.insertItemDetails();
        })
    };
};

//Initialize class Item Content
class ItemContent{
    constructor(jsonItem){
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
        this.colorSelectElement = document.getElementById('colors')
    }

//HTML content is added, a new image is created and item's details are displayed
    insertItemDetails(){
        this.itemImg.append(this.img);
        this.titleElement.innerText = `${this.name}`;
        this.priceElement.innerText = `${this.price}`;
        this.descriptionElement.innerText = `${this.description}`;
        for (let color of this.colors){
            this.colorOption = document.createElement('option');
            this.colorOption.setAttribute('value', `${color}`);
            this.colorOption.innerText = `${color}`;
            this.colorSelectElement.appendChild(this.colorOption)
        };
    }
}

// A new item is created and his data are fetched
let item = new Item;
item.fetchItem();