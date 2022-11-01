const cardList = document.querySelector('.card-list');
const API_URL = 'https://635d4915b13fd8c8607a7d0a.mockapi.io/';
const host_URL = 'https://ntc2019.github.io/ShoppingCart/assets/images/';

fetch(`${API_URL}/dishes`).then(json=>json.json()).then((data) => {
    const dishObjList = data;
    dishObjList.forEach(dishObj => {
        const dishElement = buildCardTemplate(dishObj);
        cardList.appendChild(dishElement);
    })
})

function buildCardTemplate(dishObj){
    const cardTemplate = document.querySelector('#cardTemplate');
    const cardFragment = cardTemplate.content.cloneNode(true);
    const dishElement = cardFragment.querySelector('.col-4');

    dishElement.id = 'ID' + dishObj.id;
    const dishName = dishElement.querySelector('.dish-name');
    const description = dishElement.querySelector('.description');
    const price = dishElement.querySelector('.price');
    const discountPrice = dishElement.querySelector('.discount-price');
    const categories = dishElement.querySelector('.categories');
    const dishImg = dishElement.querySelector('.dish-img');
    const editBtn = dishElement.querySelector('.edit-btn');

    let categoriesStr = '';
    if(Array.isArray(dishObj.category)){
        for (let i =0; i< dishObj.category.length; i++){
            if (i == (dishObj.category.length - 1)) {
                categoriesStr += dishObj.category[i];
            } else {
                categoriesStr += dishObj.category[i] + ',';
            }
        }
    } else {
        categoriesStr = dishObj.category;
    }

    dishName.innerText = dishObj.dishName;
    description.innerText = dishObj.description;
    price.innerText = 'Price: '+ dishObj.price;
    discountPrice.innerText = 'Discount price: ' + dishObj.discountPrice;
    categories.innerText = 'Categories: ' + categoriesStr;
    dishImg.src = host_URL + dishObj.imgURL;

    editBtn.href = `./input.html?dishId=${dishObj.id}`;
    return dishElement;

}