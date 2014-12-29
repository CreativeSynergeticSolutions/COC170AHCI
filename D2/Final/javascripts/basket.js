var wall = new wall();

function loadBasketList() {
    var basket = wall.getBasket();
    console.log(basket);
	console.log(items);
    if(basket!=null&&basket.length>0){
        for(var i = 0; i < basket.length; i++){
            var item = basket[i];
            document.getElementById('basket').appendChild(makeBasketItem(item.name));
        }
    } else {
        //document.getElementById('basket').appendChild(makeBasketItem('Your Basket is Empty'));
		console.log("empty basket")
    }
}

window.onload = function () {
	loadBasketList();
}