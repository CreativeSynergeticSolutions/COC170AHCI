var wall = new wall();
var basket;
function loadBasketList() {
    basket = wall.getBasket();
    console.log(basket);
    if(basket!=null&&basket.length>0){
        /* for(var i = 0; i < basket.length; i++){
            var item = basket[i];
            document.getElementById('basket').appendChild(makeBasketItem(item.name));
        } */
    } else {
        //document.getElementById('basket').appendChild(makeBasketItem('Your Basket is Empty'));
		console.log("empty basket")
    }
}
function loadModal(index){
	var item = basket[index];
	$("#container").css('display','block');
	$("#inputText").html(item.item.name);
	$("#paragraph").html(item.item.description[0].content);
	$("#productCode").html(item.item.productCode);
	$("#image").html("<img src='"+item.item.images.front+"'>");
	var bullets = "<ul>";
	for (var i = 1; i < item.item.description.length; i++){
		bullets += "<li>"+item.item.description[i].content+"</li>";
	}
	bullets += "</ul>"
	$("#bullet").html(bullets);
	console.log(item);
	$("#containerInner").css("left","12.5%");
}
function deleteItem(index){
	$("#item"+index).remove();
	var current = ($("#total").text()).substring(9,($("#total").text()).length);
	console.log(current);
	var total = parseInt(current) - (parseInt(basket[index].item.price.substring(1,basket[index].item.price.length)))*basket[index].quantity;

	$("#total").html("Total: &#163 "+ add00(total));
}
function add00(a){
	if(toString(a).indexOf('.')!=-1){
		return a
	}else{
		return a+".00";
	}

}
function displayItems(){
	var html = "";
	var total = 0;
	for(var i = 0; i < basket.length;i++){
		html += "<div class='item' id='item"+i+"'>";
		html += "<div class='delete' onclick='deleteItem("+i+")'><div><span title='Delete Item'><i class='icon-trash-empty'></i></span></div></div>";
		html += "<div class='info' onclick='loadModal("+i+")'><div><span title='Product info'><i class='icon-info'></i></span></div></div>";
		html += "<div class='price'>"+basket[i].item.price+"</div>";
		html += "<div class='image'>";
		html += "<img src='"+basket[i].item.images.front+"'>";
		html += "</div>";
		html += "<p>"+basket[i].item.name+"</p>";
		html += "<a class='dial'>"+basket[i].quantity+"</a>";
		html += "<p class='product'>Size: "+basket[i].size+"</p>";
		html += "<p class='product'>Colour: "+basket[i].colour.name+"</p>";
		html += "<p class='product'>Product Code: "+basket[i].item.productCode+"</p>";
		html += "</div>";
		//need quantity
		total += parseInt((basket[i].item.price).substring(1,basket[i].item.price.length))*basket[i].quantity;
	}
	$('#items').html(html);
	$('#total').html("Total: &#163 "+add00(total))
}


window.onload = function () {
	loadBasketList();
	displayItems();
	$("#items").css('left','0');
	$("#total").css('left','0');
	$("#options").css('right','0');

}
