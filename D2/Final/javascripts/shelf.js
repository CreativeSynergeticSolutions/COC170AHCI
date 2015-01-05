<<<<<<< HEAD
var shelfView=new wall();

window.onload=function(){
	
	$("#backButton").click(function(){window.history.back();});
	loadRecommendations();
	loadOutfits();
	loadSelectedProducts();
=======

var basket=new Array();

var outfits=new Array();
	outfits.push("New Year");
	outfits.push("Kids Birthdays");
	outfits.push("60th Birthday");
	outfits.push("Sisters Wedding");
	outfits.push("Cousins Wedding");
	outfits.push("Funeral");
	outfits.push("Daves Party");
	outfits.push("Best Friends Wedding");
	outfits.push("Jims going away");
	outfits.push("Garden Party");

window.onload=function(){
	
	loadRecommendations();
	loadOutfits();
>>>>>>> FETCH_HEAD

}


function randomN(){
	var arr = []
	while(arr.length < 5){
  		var randomnumber=Math.ceil(Math.random()*10)
  		var found=false;
  		for(var i=0;i<arr.length;i++){
    		if(arr[i]==randomnumber){found=true;break}
  		}
  		if(!found)arr[arr.length]=randomnumber;
		}
		return arr;
	}


function loadSubCategory(category){
	//Run text through loop (output)
	var output="";
	var array=new Array();
	array=CAT[category];
	

	for (var i=0;i<array.length;i++){
		//Concatenate "_"
		var id="subc_"+array[i];

		//Load Next div  with id,className and Test Text
		output+="<div class='SubCategories' onclick=loadSubSubCategory('"+array[i]+"') id='"+id+"'>"+array[i]+"</div>";

	}
	currentCategory=category;
	//Reload New Div HTML content
	document.getElementById("sub_categories").innerHTML=output;
	loadSubSubCategory("");
	

}

/*------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------*/
function loadPage(){

	//loadSubCategory("Christmas");
	//loadSubSubCategory("Women");
	//loadSelection("Women");
}

<<<<<<< HEAD
function addToBasket(index){
	shelfView.addToBasket(items[index],1,items[index]["sizes"][0],items[index]["colours"][0]["name"]);
	loadSelectedProducts();
}

function loadOutfits(){
	
	var outfits=shelfView.getOutfits();
	
=======


function addToSelectedProducts(index){
	var price=items[index]["price"];
	var code=items[index]["productCode"];
	var name=items[index]["name"];
	
	var item=new Array();
	item["price"]=price.replace(/\£/g, "&pound");
	item["code"]=code;
	item["name"]=name;
	item["index"]=index;
	
	basket.push(item);
	loadSelectedProducts();
	
	
}

function loadOutfits(){

>>>>>>> FETCH_HEAD
	var output='<div class="side_title">Outfits</div>';
	
	for (var i=0;i<outfits.length;i++){
		output+="<div class='outfit'>";
<<<<<<< HEAD
		output+="<div class='outfitName'>"+outfits[i].name+"</div>";
=======
		output+="<div class='outfitName'>"+outfits[i]+"</div>";
>>>>>>> FETCH_HEAD
		output+="<div class='outfitBin' ><span id='o_"+i+"' class='icon-trash-empty' onclick='deleteOutfit(this.id)'></span></div>";
		output+="</div>";
	}

	$("#outfit_header").html(output);

}

function deleteOutfit(ch){
<<<<<<< HEAD
	var outfits=shelfView.getOutfits();
	var index=ch.substring(2,ch.length);
	var name=outfits[index]["name"];
	shelfView.removeOutfit(name);
=======
	var index=ch.substring(2,ch.length);
	outfits.splice(index,1);
>>>>>>> FETCH_HEAD
	loadOutfits();
}


function loadRecommendations(){
<<<<<<< HEAD
	
	
=======
>>>>>>> FETCH_HEAD
	var output='<div class="side_title">Recommendations</div>';
	
	var randomNumbers=randomN();
	
	
	for (var i=0;i<randomNumbers.length;i++){
		var index=randomNumbers[i];
		
		var img=items[index]["images"]["front"];
		output+='<div class="recommendBox"><img src="'+img+'"/></div>';
		
	}
	$("#rec_header").html(output);
	
}


function loadSelectedProducts(){
<<<<<<< HEAD
	//load from localStorage
	var savedItems=shelfView.getBasket();
	
	var output="";
	if(savedItems.length>0){
		output="<tr><th>Item Details</th> <th>Quantity</th><th>Delivery Options</th><th>Subtotal</th></tr>";
	}
	var total=0;
	
	for (var i=0;i<savedItems.length;i++){
		var howMany=1;
		var price=savedItems[i]["item"]["price"];
		var amount=price.substring(1,price.length-1);
		
		
		if(savedItems[i]["quantity"]>0){
			howMany=savedItems[i]["quantity"];
		}
		total+=parseInt(amount*howMany);
		
		var items="<div class='bottomBarLeft'>";
		items+="<img src='"+savedItems[i]["item"]["images"]["front"]+"' class='productI' />";
		items+="</div><!--END OF BOTTOM LEFT -->";
		items+="<div class='bottomBarRight'>";
		items+="<table id='ItemDetails'>";
		items+="<tr>";
		items+=("<td>"+savedItems[i]["item"]["name"]+"</td>");
		items+="</tr>";
		items+="<tr>";
		items+=("<td>"+savedItems[i]["size"]+"</td>");
		items+="</tr>";
		items+="<tr>";
		items+=("<td>"+savedItems[i]["colour"]+"</td>");
		items+="</tr>";
		items+="<tr>";
		items+=("<td>"+savedItems[i]["item"]["price"]+"</td>");
		items+="</tr>";
		items+="</table>";
		items+="</div><!--END OF BOTTOM BAR RIGHT -->";
		
		
		var deliveryOptions="<img src='images/DeliveryIcons.png' />";
		var subtotal="<div>&pound 10</div>";
		
		output+="<tr>";
		output+=("<td class='itemI'>"+items+"</td>");
		output+=("<td class='quantityI'>"+howMany+"</td>");
		output+=("<td class='deliveryI'>"+deliveryOptions+"</td>");
		output+=("<td class='subtotalI'>"+subtotal+"</td>");
		
		output+="</tr>";
	}
	if(shelfView.getBasket().length>0){
		output+="<tr><td class='basketFooter' colspan='3'>Basket Total</td><td>&pound "+total+"</td></tr>";
	}
	$("#basketItems").html(output);
}

=======
	var output="";
	if(basket.length>0){
		output="<tr><th>Product</th> <th>Price</th><th>Code</th><th></th></tr>";
	}
	
	
	for (var i=0;i<basket.length;i++){
		output+="<tr>";
		output+=("<td>"+basket[i]["name"]+"</td>");
		output+=("<td>"+basket[i]["price"]+"</td>");
		output+=("<td>"+basket[i]["code"]+"</td>");
		output+="<td><div id='"+i+"' onclick='deleteItem(this.id)' class='icon-trash-empty'></div></td>";
		output+="</tr>";
	}
	$("#basketItems").html(output);
}
function clearSelectedProducts(){
	
	basket= new Array();
	loadSelectedProducts();
	
}
function deleteItem(id){
	for (var i=0;i<basket.length;i++){
		if(i==id){
			basket.splice(i,1);
		}
	}
	loadSelectedProducts();
}
>>>>>>> FETCH_HEAD

function loadSubSubCategory(subCategory){
	var output="";

	if(SUB_CAT[currentCategory+"_"+subCategory]!=null){

		var array=new Array();
		array=SUB_CAT[currentCategory+"_"+subCategory];


		for (var i=0;i<array.length;i++){
			//Concatenate "_"
			var id="subsubc_"+array[i];
			//Load Next div  with id,className and Test Text
			output+='<div class="SubSubCategories" ';
			output+='onclick="loadSelection('+i+')" >';
			output+=array[i];
			output+='</div>';

		}
	}
	currentSubCategory=subCategory;
	//Reload New Div HTML content
	$("#sub_categories_sub").html(output);
}
function loadSelection(index){
	var output="";
	
	var finder=SUB_CAT[currentCategory+"_"+currentSubCategory];
	
	currentSelection=finder[index];
	var array=new Array();
	
	if(currentCategory=="Women"){
		
		for (var i=0;i<items.length;i++){
			var sub=items[i]["subCategory"];
			var main=items[i]["mainCategory"];
		
			if(main=="Womens" && sub==currentSelection ){
				array.push(i);
			}
		}
	
	}
	
	for (var i=0;i<array.length;i++){
		//Concatenate "_"
		var index=array[i];
		var sub=items[index]["subCategory"];
		var name=items[index]["name"];
		var main=items[index]["mainCategory"];
		var price=items[index]["price"];
		
		var img=items[index]["images"]["front"];
		
		var id="sel_"+i.toString();

		//Load Next div  with id,className and Test Text
		output+="<div class='SubCategorySelection' >";
		output+="<img id='"+id+"' src='"+img+"'  />";
		output+="<br /><br />";
		output+="<div class='itemContainer'>";
		output+="<div class='clothesInfo' >"+name+"</div>";
		output+="<div class='clothesInfo' >"+price.replace(/\£/g, "&pound")+"</div>";
<<<<<<< HEAD
		output+="<br/>";
		output+="<div class='addBasket' onclick='addToBasket("+index+")' >Add To Basket</div>";
		
=======
		output+="<div class='viewProduct' >VIEW PRODUCT</div>";
		output+="<div class='addBasket' onclick='addToSelectedProducts("+index+")' >ADD TO BASKET</div>";
>>>>>>> FETCH_HEAD
		output+="</div>";
		output+="</div>";
		

	}

	//Reload New Div HTML content
	document.getElementById("selection").innerHTML=output;
}

