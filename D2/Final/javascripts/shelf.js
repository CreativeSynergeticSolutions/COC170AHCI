var shelfView=new wall();
var recHeaderScrollY = 0,
    basketScrollY = 0,
    categoriesScrollX = 0,
    subScrollX = 0,
    subSubScrollX = 0,
    selectionScrollX = 0,
    caScrollX = 0;

window.onload=function(){

	$("#backButton").click(function(){window.history.back();});
	loadRecommendations();
	loadOutfits();
	loadSelectedProducts();
    if(!("ontouchstart" in window)) {
    	$("#rec_header").mousemove(function(event){
			if(event.pageY == recHeaderScrollY) return false;
            var modifier = (event.pageY < recHeaderScrollY ? 5 : -5);
            $("#rec_header").scrollTop($("#rec_header").scrollTop() + modifier);
			recHeaderScrollY = event.pageY;
		});
    	$("#basketContainer").mousemove(function(event){
			if(event.pageY == basketScrollY) return false;
            var modifier = (event.pageY < basketScrollY ? 5 : -5);
            $("#basketContainer").scrollTop($("#basketContainer").scrollTop() + modifier);
			basketScrollY = event.pageY;
		});
    	$("#categories").parent().mousemove(function(event){
			if(event.pageX == categoriesScrollX) return false;
            var modifier = (event.pageX < categoriesScrollX ? 5 : -5);
            $("#categories").parent().scrollLeft($("#categories").parent().scrollLeft() + modifier);
			categoriesScrollX = event.pageY;
		});
    	$("#sub_categories").parent().mousemove(function(event){
			if(event.pageX == subScrollX) return false;
            var modifier = (event.pageX < subScrollX ? 5 : -5);
            $("#sub_categories").parent().scrollLeft($("#sub_categories").parent().scrollLeft() + modifier);
			subScrollX = event.pageY;
		});
    	$("#sub_categories_sub").parent().mousemove(function(event){
			if(event.pageX == subSubScrollX) return false;
            var modifier = (event.pageX < subSubScrollX ? 5 : -5);
            $("#sub_categories_sub").parent().scrollLeft($("#sub_categories_sub").parent().scrollLeft() + modifier);
			subSubScrollX = event.pageY;
		});
    	$("#selection").parent().mousemove(function(event){
			if(event.pageX == selectionScrollX) return false;
            var modifier = (event.pageX < selectionScrollX ? 5 : -5);
            $("#selection").parent().scrollLeft($("#selection").parent().scrollLeft() + modifier);
			selectionScrollX = event.pageY;
		});
	}
};


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
		output+="<a href='outfit.html?outfitName="+outfits[i].name+"'><div class='outfitName'>"+outfits[i].name+"</div></a>";
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
		var index = randomNumbers[i],
            img = items[index].images.front,
            prodCode = items[index].productCode;
		output+='<div class="recommendBox"><a href="product.html?productCode='+prodCode+'"><img src="'+img+'"/></a></div>';

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
		items+=("<td>x"+savedItems[i]["quantity"]+"</td>");
		items+="</tr>";
		items+="<tr>";
		items+=("<td>"+savedItems[i]["colour"]["name"]+"</td>");
		items+="</tr>";
		items+="<tr>";
		items+=("<td>"+savedItems[i]["item"]["price"]+"</td>");
		items+="</tr>";
		items+="</table>";
		items+="</div><!--END OF BOTTOM BAR RIGHT -->";


		output+=("<div class='itemI'><a href='product.html?productCode="+savedItems[i].item.productCode+"'>"+items+"</a></div>");

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




	for (var i=0;i<items.length;i++){
		var sub=items[i]["subCategory"];
		var main=items[i]["mainCategory"];

		if(main==currentCategory && sub==currentSelection ){
			array.push(i);
		}
	}



	for (var i=0;i<array.length;i++){
		//Concatenate "_"
		var index=array[i],
            sub=items[index]["subCategory"],
            name=items[index]["name"],
            main=items[index]["mainCategory"],
            price=items[index]["price"],
            productCode = items[index].productCode;

		var img=items[index]["images"]["front"];

		var id="sel_"+i.toString();

		//Load Next div  with id,className and Test Text
		output+="<div class='SubCategorySelection' >";
		output+="<a href='product.html?productCode="+productCode+"'>";
		output+="<img id='"+id+"' src='"+img+"'  />";
		output+="<br /><br />";
		output+="<div class='itemContainer'>";
		output+="<div class='clothesInfo' >"+name+"</div>";
		output+="<div class='clothesInfo' >"+price.replace(/\£/g, "&pound")+"</div>";
		output+="<br/>";
        output+="</a>";
		output+="<div class='addBasket' onclick='addToBasket("+index+")' >Add To Basket</div>";
		output+="<div class='addBasket' onclick='addToOufit("+index+")' >Add To Outfit</div>";
		output+="</div>";
		output+="</div>";


	}

	//Reload New Div HTML content
	document.getElementById("selection").innerHTML=output;
}

