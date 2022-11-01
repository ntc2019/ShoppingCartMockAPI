const API_URL = 'https://635d4915b13fd8c8607a7d0a.mockapi.io/';
const fixBtn = document.querySelector('.fix-btn');
fixBtn.addEventListener('click', () => {
    fixPriceTag();
})
const regex = /^£/;
function fixPriceTag() {
    fetch(`${API_URL}/dishes`).then(json => json.json()).then(dishesList => {
        dishesList.forEach(dishObj => {
            
            let newPrice = dishObj.price;
            let newDiscountPrice = dishObj.discountPrice;
            if(!regex.test(newPrice)){
                newPrice = '£' + dishObj.price;
            }
            if(!regex.test(newDiscountPrice) && newDiscountPrice){
                newDiscountPrice = '£' + dishObj.discountPrice;
            }
            const newObj = {
                price: newPrice,
                discountPrice : newDiscountPrice,
            }
            putNewObj(newObj, dishObj);
        })
    })    
}
function putNewObj(newObj,dishObj){
    fetch(`${API_URL}/dishes/${dishObj.id}`,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify(newObj)
    }).then(responseJson => {
        const isOk = responseJson.ok;
        if(!isOk){
            throw responseJson.status;
        }
        return responseJson.json();
    }).then(data => {
        const isOk = data.ok;

    }).catch(error => {
        if(error == 429){
            const newPutFunc = () => {
                putNewObj(newObj,dishObj);
            }
            setTimeout(newPutFunc,8000);           
        }
    })
}