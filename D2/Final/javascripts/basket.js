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
function loadModal(index){
	var item = basket[index];
	$("#container").css('display','block');
	$("#inputText").html(item.name);
	$("#paragraph").html(item.description[0].content);
	$("#productCode").html(item.productCode);
	$("#image").html("<img src='"+item.images[0].front+"'>");
	var bullets = "<ul>";
	for (var i = 1; i < item.description.length; i++){
		bullets += "<li>"+item.description[i].content+"</li>";
	}
	bullets += "</ul>"
	$("#bullet").html(bullets);
	console.log(item);
	$("#containerInner").css("left","12.5%");
}
function deleteItem(index){
	$("#item"+index).remove();
}
function displayItems(){
	var html = "";
	var total = 0;
	for(var i = 0; i < basket.length;i++){
		html += "<div class='item' id='item"+i+"'>";
		html += "<div class='delete' onclick='deleteItem("+i+")'><div><span title='Delete Item'><i class='icon-trash-empty'></i></span></div></div>";
		html += "<div class='info' onclick='loadModal("+i+")'><div><span title='Product info'><i class='icon-info'></i></span></div></div>";
		html += "<div class='price'>"+basket[i].price+"</div>";
		html += "<div class='image'>";
		html += "<img src='"+basket[i].images[0].front+"'>";
		html += "</div>";
		html += "<p>"+basket[i].name+"</p>";
		html += "<a class='dial'>"+1+"</a>";
		html += "<p class='product'>Product Code: "+basket[i].productCode+"</p>";
		html += "</div>";
		//need quantity
		total += parseInt((basket[i].price).substring(1,basket[i].price.length));
	}
	$('#items').html(html);
	$('#total').html("&#163 "+total)
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
	$("#items").css('left','0');
	$("#total").css('left','0');
	$("#options").css('right','0');
}