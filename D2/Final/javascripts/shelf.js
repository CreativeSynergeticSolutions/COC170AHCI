var basket=new Array();
var outfits=new Array();


window.onload=function(){
	
	
	loadRecommendations();
	loadOutfits();
	loadSelectedProducts();

}

function loadStorage(){
	
	if(localStorage["savedItems"]!=null){
		basket = JSON.parse(localStorage.getItem('savedItems'));
	}
	if(localStorage["outfits"]!=null){
		outfits = JSON.parse(localStorage.getItem('outfits'));
		
	}
}
function saveToStorage(){
	
	
	localStorage.setItem("savedItems",JSON.stringify(basket));
	localStorage.setItem("outfits",JSON.stringify(outfits));
	

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



function addToSelectedProducts(index){
	
	loadStorage();
	var price=items[index]["price"];
	var code=items[index]["productCode"];
	var name=items[index]["name"];
	
	var item={};
	item["price"]=price.replace(/\£/g, "&pound");
	item["code"]=code;
	item["name"]=name;
	item["index"]=index;
	
	basket[basket.length]=item;
	
	saveToStorage();
	loadSelectedProducts();
	
	
}

function loadOutfits(){
	
	//load from localStorage
	loadStorage();
	
	var output='<div class="side_title">Outfits</div>';
	
	for (var i=0;i<outfits.length;i++){
		output+="<div class='outfit'>";
		output+="<div class='outfitName'>"+outfits[i]+"</div>";
		output+="<div class='outfitBin' ><span id='o_"+i+"' class='icon-trash-empty' onclick='deleteOutfit(this.id)'></span></div>";
		output+="</div>";
	}

	$("#outfit_header").html(output);

}

function deleteOutfit(ch){
	var index=ch.substring(2,ch.length);
	outfits.splice(index,1);
	saveToStorage();
	loadOutfits();
}


function loadRecommendations(){
	
	
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
	//load from localStorage
	loadStorage();
	
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
	
	basket=new Array();
	saveToStorage();
	loadSelectedProducts();
	
}
function deleteItem(id){
	for (var i=0;i<basket.length;i++){
		if(i==id){
			basket.splice(i,1);
		}
	}
	saveToStorage();
	loadSelectedProducts();
}

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
		output+="<div class='viewProduct' >VIEW PRODUCT</div>";
		output+="<div class='addBasket' onclick='addToSelectedProducts("+index+")' >ADD TO BASKET</div>";
		output+="</div>";
		output+="</div>";
		

	}

	//Reload New Div HTML content
	document.getElementById("selection").innerHTML=output;
}

