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
	$("#inputText").html(item.items.name);
	$("#paragraph").html(item.items.description[0].content);
	$("#productCode").html(item.items.productCode);
	$("#image").html("<img src='"+item.items.images.front+"'>");
	var bullets = "<ul>";
	for (var i = 1; i < item.items.description.length; i++){
		bullets += "<li>"+item.items.description[i].content+"</li>";
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
	var total = parseInt(current) - (parseInt(basket[index].items.price.substring(1,basket[index].items.price.length)))*basket[index].quantity;

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
		html += "<div class='price'>"+basket[i].items.price+"</div>";
		html += "<div class='image'>";
		html += "<img src='"+basket[i].items.images.front+"'>";
		html += "</div>";
		html += "<p>"+basket[i].items.name+"</p>";
		html += "<a class='dial'>"+basket[i].quantity+"</a>";
		html += "<p class='product'>Size: "+basket[i].size+"</p>";
		html += "<p class='product'>Colour: "+basket[i].colour.name+"</p>";
		html += "<p class='product'>Product Code: "+basket[i].items.productCode+"</p>";
		html += "</div>";
		//need quantity
		total += parseInt((basket[i].items.price).substring(1,basket[i].items.price.length))*basket[i].quantity;
	}
	$('#items').html(html);
	$('#total').html("Total: &#163 "+add00(total))
}


window.onload = function () {
	loadBasketList();
	basket = [
		{
			"items":{
				"name": "Acid Wash Jeggings",
				"mainCategory": "Womens",
				"subCategory": "Jeans",
				"type": "bottom",
				"price": "£10.00",
				"images": {
					"front": "images/stock/womens/bottom/Acid Wash Jeggings/front.png",
					"back": "images/stock/womens/bottom/Acid Wash Jeggings/back.png"
				},
				"colours": [
					{
						"name":"Navy",
						"class":"navy"
					}
				],
				"description": [
					{
						"content": "We’re all for that grunge, messy hair look this season and with these acid wash jeggings you’re sure to be half way there. The perfect pick for an edgy new staple that will transform every look into a style statement instantly, you’re sure to adore these.",
						"type": "paragraph"
					},
					{
						"content": "Elasticated waistband",
						"type": "bullet"
					}
				],
				"fabric": "70% Cotton, 25% Polyester, 5% Elastane",
				"productCode": "4929029",
				"sizes": [
					"8",
					"10",
					"12",
					"14",
					"16"
				],
				"recommendations":["4869167","4868138"]
			},
			"quantity":3,
			"colour":{
				"name":"Navy",
				"class":"navy"
			},
			"size":"8"
		},
		{
			"items":{
				"name": "Acid Wash Jeggings",
				"mainCategory": "Womens",
				"subCategory": "Jeans",
				"type": "bottom",
				"price": "£10.00",
				"images": {
					"front": "images/stock/womens/bottom/Acid Wash Jeggings/front.png",
					"back": "images/stock/womens/bottom/Acid Wash Jeggings/back.png"
				},
				"colours": [
					{
						"name":"Navy",
						"class":"navy"
					}
				],
				"description": [
					{
						"content": "We’re all for that grunge, messy hair look this season and with these acid wash jeggings you’re sure to be half way there. The perfect pick for an edgy new staple that will transform every look into a style statement instantly, you’re sure to adore these.",
						"type": "paragraph"
					},
					{
						"content": "Elasticated waistband",
						"type": "bullet"
					}
				],
				"fabric": "70% Cotton, 25% Polyester, 5% Elastane",
				"productCode": "4929029",
				"sizes": [
					"8",
					"10",
					"12",
					"14",
					"16"
				],
				"recommendations":["4869167","4868138"]
			},
			"quantity":1,
			"colour":{
				"name":"Navy",
				"class":"navy"
			},
			"size":"14"
		}
	];


	displayItems();
	$("#items").css('left','0');
	$("#total").css('left','0');
	$("#options").css('right','0');

}
