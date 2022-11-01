const API_URL = 'https://635d4915b13fd8c8607a7d0a.mockapi.io/';
const dishesForm = document.querySelector('#dishes-form');
// get modal button
const closeModalBtn = document.querySelector('#leavePageModal .close-modal');
const backIndexBtn = document.querySelector('#leavePageModal .back-index');
const deleteConfirmBtn = document.querySelector('#deleteRecordModal .delete-confirm-btn');
const deleteDenyBtn = document.querySelector('#deleteRecordModal .not-delete-btn');
// get input field element
const dishName = document.querySelector('#dish-name');
const description = document.querySelector('#description'); 
const price = document.querySelector('#price');
const discountPrice = document.querySelector('#discountPrice');
const imgUrl = document.querySelector('#imgUrl');
const category = document.querySelector('#category');
// get search query
const search = window.location.search;
const searchParams = new URLSearchParams(search);
const dishId = searchParams.get('dishId');
const submitBtn = document.querySelector('#submit-button');
const deleteBtn = document.querySelector('#delete-button');
// declare CONST variable
const INPUT_NUM_ARR = [price,discountPrice];
const CATEGORY_VALUE_ARR = {
    1:'burger',
    2:'cold drink',
    3:'hot drink',
    4:'pasta',
    5:'pizza',
    6:'sweet snack',
}
// handle page load if editing
if(dishId){
    submitBtn.innerText = 'Commit Edit';
    deleteBtn.style.display = 'block';
    fetch(`${API_URL}/dishes/${dishId}`).then(json=>json.json()).then(dishObj => {
        dishName.value = dishObj.dishName;
        description.value = dishObj.description;
        price.value = dishObj.price;
        discountPrice.value = dishObj.discountPrice;
        imgUrl.value = dishObj.imgURL;
        for( const key in CATEGORY_VALUE_ARR){
            if(dishObj.category === CATEGORY_VALUE_ARR[key]);
            category.value = key;
        }
    })
}


// handle submit button on click
dishesForm.addEventListener('submit',(e) => {
    e.preventDefault();
    let isValid = true;
    INPUT_NUM_ARR.forEach(inputElement => {
        if(isNaN(Number(inputElement.value))){
            inputElement.nextElementSibling.style.display = 'inline';
            isValid = false;
            return;
        }
    })
    if(category.value < 1){
        category.nextElementSibling.style.display = 'inline';
        isValid = false;
    }
    if(!isValid){
        return;
    }
    const dishObj = {
        dishName: dishName.value,
        description: description.value,
        price: price.value,
        discountPrice: discountPrice.value,
        category: CATEGORY_VALUE_ARR[category.value],
        imgURL: imgUrl.value,
    };
    const forwardUrl = dishId ? `${API_URL}/dishes/${dishId}`: `${API_URL}/dishes`;
    fetch(forwardUrl,{
        method: dishId ? 'PUT' : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dishObj)
    }).then(json => json.json()).then(data => {
        if(dishId){
            $('#leavePageModal').modal('show');            
        }
        for ( key in data){
            if(key !== 'discountPrice'){
                if(!data[key]){
                    window.alert('Some field are not enter correctly.Please Edit or Delete the record');
                    window.location.href = `./input.html?=dishId=${data.id}`;
                }
            }
            window.alert(`Successfully added ${data.dishName}`);
            dishesForm.reset();
            return;
        }
    })
})
INPUT_NUM_ARR.forEach(inputElement => {
    inputElement.addEventListener('input',() => { 
        if(isNaN(Number(inputElement.value))){
            inputElement.nextElementSibling.style.display = 'inline';          
        } else {
            inputElement.nextElementSibling.style.display = 'none';    
        }
    })
})
category.addEventListener('input',() => { 
    if(category.value < 1){
        category.nextElementSibling.style.display = 'inline';          
    } else {
        category.nextElementSibling.style.display = 'none';    
    }
})

// handle delete btn on click
deleteBtn.addEventListener('click',() => {
    $('#deleteRecordModal').modal('show');
    
})


// add events to modal buttons
//          For leavePageModal
closeModalBtn.addEventListener('click', () => {
    window.location.href = './input.html';
});
backIndexBtn.addEventListener('click',() => {
    window.location.href = `./index.html#ID${dishId}`;
})

//          For deleteRecordModal
deleteDenyBtn.addEventListener('click',() => {
    $('#deleteRecordModal').modal('hide');
})
deleteConfirmBtn.addEventListener('click',() => {
    fetch(`${API_URL}/dishes/${dishId}`,{
        method: 'DELETE'
    }).then(json => json.json()).then(data => {
        $('#deleteRecordModal').modal('hide');
        alert('Delete succesfully');
        $('#leavePageModal').modal('show');
    }).catch(error => {
        alert(error)
    })

})