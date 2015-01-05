var shelfView=new wall();

window.onload=function(){
	
	$("#backButton").click(function(){window.history.back();});
	loadRecommendations();
	loadOutfits();
	loadSelectedProducts();

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

function addToBasket(index){
	shelfView.addToBasket(items[index],1,items[index]["sizes"][0],items[index]["colours"][0]);
	loadSelectedProducts();
}

function addToOutfit(index){
	
}

function loadOutfits(){
	
	var outfits=shelfView.getOutfits();
	
	var output='<div class="side_title">Outfits</div>';
	
	for (var i=0;i<outfits.length;i++){
		output+="<div class='outfit'>";
		output+="<div class='outfitName'>"+outfits[i].name+"</div>";
		output+="<div class='outfitBin' ><span id='o_"+i+"' class='icon-trash-empty' onclick='deleteOutfit(this.id)'></span></div>";
		output+="</div>";
	}

	$("#outfit_header").html(output);

}

function deleteOutfit(ch){
	var outfits=shelfView.getOutfits();
	var index=ch.substring(2,ch.length);
	var name=outfits[index]["name"];
	shelfView.removeOutfit(name);
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
	var savedItems=shelfView.getBasket();
	
	var output="";
	if(savedItems.length>0){
		output="";
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
		items+=("<td>"+savedItems[i]["quantity"]+"</td>");
		items+="</tr>";
		items+="<tr>";
		items+=("<td>"+savedItems[i]["colour"]["name"]+"</td>");
		items+="</tr>";
		items+="<tr>";
		items+=("<td>"+savedItems[i]["item"]["price"]+"</td>");
		items+="</tr>";
		items+="</table>";
		items+="</div><!--END OF BOTTOM BAR RIGHT -->";
	
		
		output+=("<div class='itemI'>"+items+"</div>");
		
	}
	$("#basketItems").html(output);
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
		output+="<br/>";
		output+="<div class='addBasket' onclick='addToBasket("+index+")' >Add To Basket</div>";
		output+="<div class='addBasket' onclick='addToOufit("+index+")' >Add To Outfit</div>";
		output+="</div>";
		output+="</div>";
		

	}

	//Reload New Div HTML content
	document.getElementById("selection").innerHTML=output;
}

