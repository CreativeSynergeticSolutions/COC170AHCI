var wall = new wall();
var basket;
function loadBasketList() {
    basket = wall.getBasket();
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
function displayItems(){
	var html = "";
	for(var i = 0; i < basket.length;i++){
		html += "<div class='item'>";
		html += "<div class='price'>"+basket[i].price+"</div>";
		html += "<div class='image'>";
		html += "<img src='"+basket[i].images[0].front+"'>";
		html += "</div>";
		html += "<p>"+basket[i].name+"</p>";
		html += "</div>";
	}
	$('#items').html(html);
}


window.onload = function () {
	loadBasketList();
	var items;
	$.getJSON("data/items.json")//just for testing//////////////////////////////////////////
	.error(function () {
		console.log("Error in JSON");
	})
	.complete(function () {
		items = (typeof items === undefined ? {} : items);
	})
	.success(function (data) {
		items = data.items;
		console.log(items);
		console.log("success");
		basket = items;
		displayItems();
	});/////////////////////////////////////////////////////////////////////////////////////
}