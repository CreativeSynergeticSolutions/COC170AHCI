var wall = new wall();
var dial = new Dial(150, "1.5em");
var basket;
function loadBasketList() {
    basket = wall.getBasket();
    console.log("basket");
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
function LoadProduct(){
	window.location.href = 'product.html?productCode='+$("#productCode").text();
}
function deleteItem(index){
	wall.removeItemFromBasket(document.getElementById("item"+index).getAttribute("data"));
	$("#item"+index).remove();
	var current = ($("#total").text()).substring(9,($("#total").text()).length);
	console.log(current);
	console.log(old[index]);
	console.log((parseInt(basket[index].item.price.substring(1,basket[index].item.price.length))) *old[index]);
	var total = parseInt(current) - (parseInt(basket[index].item.price.substring(1,basket[index].item.price.length))) *old[index] ;

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
		html += "<div class='item' id='item"+i+"' data='"+ basket[i].id +"' >";
		html += "<div class='delete' onclick='deleteItem("+i+")'><div><span title='Delete Item'><i class='icon-trash-empty'></i></span></div></div>";
		html += "<div class='info' onclick='loadModal("+i+")'><div><span title='Product info'><i class='icon-info'></i></span></div></div>";
		html += "<div class='price'>"+basket[i].item.price+"</div>";
		html += "<div class='image'>";
		html += "<img src='"+basket[i].item.images.front+"'>";
		html += "</div>";
		html += "<p>"+basket[i].item.name+"</p>";
		//html += "<a class='dial'>"+basket[i].quantity+"</a>";
		
		
		html += "<p class='product'>Size: "+basket[i].size+"</p>";
		html += "<p class='product'>Colour: "+basket[i].colour.name+"</p>";
		html += "<p class='product'>Product Code: "+basket[i].item.productCode+"</p>";
		
		html += "<div id='quantityContainer'>";
		html +=	"<div id='quantityImg' data-dialid="+i+"></div>";
		html +=	"</div>";
		html += "</div>";
		//need quantity
		total += parseInt((basket[i].item.price).substring(1,basket[i].item.price.length))*basket[i].quantity;
		
	}
	$('#items').html(html);
	$('#total').html("Total: &#163 "+add00(total))
}
function removeAll(){
	console.log(basket.length);
	for(i=0; i<basket.length; i++){
		if($('#item'+i).length){
			deleteItem(i);
		}
	}
}
function Resize(){
	var width = window.innerWidth;
	var height = window.innerHeight;
	var height_item = $("#item0").height();
	dial = new Dial(height_item, "150%");
	
}
function loadContainer2(){
	$("#container2").css('display','block');
}
function closeAll(){
	removeAll();
	window.location.href = 'idle.html'
}

var blScrollY = 0;
var old = [];
window.onload = function () {
	
	loadBasketList();
	displayItems();
	$("#items").css('left','0');
	$("#total").css('left','0');
	$("#options").css('right','0');
	for(j =0; j< basket.length; j++){
		old[j]=-1;
		console.log("j: " + j);
		dial.addNewDial(j, function(dialData){
			console.log("inner j: " + j);
			var total;
			console.log("dialid is: " + dialData.dialid);
			console.log("dialValue is: " + dialData.dialValue);
			currentQuantity = dialData.dialValue;
			$("#basketQuantityVal").text(currentQuantity);
			
			if (old [dialData.dialid] == -1){
				old[dialData.dialid] = basket[dialData.dialid].quantity;
				console.log("you FAIL");
			}else{
				var tot = ($("#total").text()).substring(9,($("#total").text()).length);
				total = parseInt(tot);
				console.log("first Total: " + total);
				total -= (parseInt(basket[dialData.dialid].item.price.substring(1,basket[dialData.dialid].item.price.length)))*old[dialData.dialid];
				console.log("old val: " + old[dialData.dialid]);
				console.log("second Total: " + total);
				total += (parseInt(basket[dialData.dialid].item.price.substring(1,basket[dialData.dialid].item.price.length)))*dialData.dialValue;
				console.log("final Total: " + total);
				$("#total").html("Total: &#163 "+ add00(total));
			}
			old[dialData.dialid] = dialData.dialValue;
			console.log(old);
		});
		dial.setDialValue(j, basket[j].quantity);
	}
	Resize();
	
	
	if(!("ontouchstart" in window)) {
    	
    	$("#items").mousemove(function(event){
			
			if(event.pageY == blScrollY) return false;
			
			if(event.pageY < blScrollY) $("#items").scrollTop($("#items").scrollTop() + 10);
			else $("#items").scrollTop($("#items").scrollTop() - 10);
			
			blScrollY = event.pageY;

		});
    	
	}
	
}
window.onresize = function(){
	Resize();	
}