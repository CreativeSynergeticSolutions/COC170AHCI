var wall = new wall();

var currentProduct = {
            name: "No Product Selected",
            mainCategory: "N/A",
            subCategory: "N/A",
            type: "N/A",
            price: "£00.00",
            images: {
                front: "images/stock/womens/body/Crochet Shoulder Blouse/front.png"
            },
            colours: [
                {
					name:"Cream",
					class:"cream"
				}
            ],
            description: [
                {
                    content: "No Product Selected",
                    type: "paragraph"
                }
            ],
            fabric: "No Product Selected",
            productCode: "00000000",
            sizes: [
                "0"
            ],
			recommendations:["00000000","00000000"]
        };

var productImages = [];

var currentColor = null;
var currentSize = "";
var currentQuantity = 1;

var currentOutfits = [];

var recommendedProducts = [];

$(document).ready(function(){
	
	var retrievedCode = items.getCodeFromSearch();
	
	//console.log("Code is this: " + retrievedCode);
	
	if (retrievedCode != null) currentProduct = items.getItemByCode(retrievedCode);
	
	console.log(currentProduct);
	
	//wall.addToBasket(item, quantity, size, colour);
	
	//wall.getOutfits();
	//wall.getCurrentOutfit();  - add to current outfit
	//wall.addOutfitItem(outfitName, item, quantity, size, colour);
	//wall.addOutfit(name);
	
	//{id:int, name: string, items: array of item objects}
	
	document.getElementById("basketRadio").checked = true;
	
	setupHeader();
	setupImageDisplay();
	setupProductDetails();
	setupRecommended();
	setupOptions();
	
	$("<style type='text/css'> #optionsWrapper * {	transition: 1s;	}</style>").appendTo("head");
	
	
	$("#backButton").click(function(){window.history.back();});
	$("#homeButton").click(function(){window.location = "shelf.html";});
	
});

function setupHeader() {
	
	$("#productTitle").text(currentProduct.name);
	$("#productCode").text(currentProduct.productCode);
	$("#productPrice").text(currentProduct.price);
	
}

function setupImageDisplay() {
		
	for(var key in currentProduct.images) productImages.push(currentProduct.images[key]);
	
	console.log(productImages);
	
	for (var iC = 0; iC < productImages.length; iC++){
		$("#ulImages").append("<div class='imgBtns' data-Img="+ iC + " ></div>");
	}
	
	$(".imgBtns").each(function(){
		
		var index= $(this).attr("data-Img");
		$(this).css("background-image", "url('" + productImages[index] + "')");
		
		$(this).click(function(){$("#displayImg").css("background-image", "url('" + productImages[index] + "')")});
		
	});
	
	$("#displayImgLabel input").change(function(){
		
		console.log("the state is: " + this.checked);
		
		if(this.checked) {
			
			$("#displayImg").panzoom("enable");
			$("#displayImgLabel").css("cursor", "default");
			document.getElementById("displayImgCheck").disabled = true;
						
		}
		
	});
	
	$("#closeDisplayImgBtn").click(function(){
		
		document.getElementById("displayImgCheck").disabled = false;
		
		$("#displayImgLabel").css("cursor", "pointer");
		
		$("#displayImg").panzoom("reset");
		$("#displayImg").panzoom("disable");
		
	});
	
	$(".imgBtns").first().click();
	

	$panzoom = $("#displayImg").panzoom();
	$panzoom.parent().on('mousewheel.focal', function( e ) {
		e.preventDefault();
		var delta = e.delta || e.originalEvent.wheelDelta;
		var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
		$panzoom.panzoom('zoom', zoomOut, {
	  		increment: 0.1,
	 		 animate: false,
	  		focal: e
		});
	});
	$("#displayImg").panzoom("disable");
	
}

function setupProductDetails() {
	
	$("#productSectionLabel input").change(function(){
				
		if(this.checked){
			
			$("#productSectionLabel").css("cursor", "default");
			document.getElementById("productDetailsCheck").disabled = true;
						
		}
		
	});
	
	$("#closeProductDetailsBtn").click(function(){
		
		document.getElementById("productDetailsCheck").disabled = false;
		
		$("#productSectionLabel").css("cursor", "pointer");
		
	});
	
	var productDescriptionHTML = "";
	
	for(var key in currentProduct.description){
		
		if (currentProduct.description[key].type == "paragraph") 
				productDescriptionHTML += currentProduct.description[key].content;
		else if(currentProduct.description[key].type == "bullet") {
			
			var bulletArray = currentProduct.description[key].content;
			
			productDescriptionHTML += "<ul>";
			
			for(var baIndex in bulletArray) productDescriptionHTML += "<li>" + bulletArray[baIndex] + "</li>";
			
			productDescriptionHTML += "</ul>";
			
		}
		
		productDescriptionHTML += "<br />";
		
	}
	
	$("#productDetails").append(productDescriptionHTML);
	
}

function setupRecommended() {
	
	$("#recommendedSectionLabel input").change(function(){
				
		if(this.checked){
			
			$("#recommendedSectionLabel").css("cursor", "default");
			document.getElementById("recommendedCheck").disabled = true;
			
			$(".rCard").css("pointer-events", "auto");
						
		}
		
	});
	
	$("#closeRecommendedBtn").click(function(){
		
		document.getElementById("recommendedCheck").disabled = false;
		
		$("#recommendedSectionLabel").css("cursor", "pointer");
		
		$(".rCard").css("pointer-events", "none");
		
	});
	
	
	for(var rIndex in currentProduct.recommendations)
			recommendedProducts.push(items.getItemByCode(currentProduct.recommendations[rIndex]));
		
	for(var rpIndex in recommendedProducts) {
		
		var cardHTML = "<div class='rCard' data-rcode=" + recommendedProducts[rpIndex].productCode + ">\
							<div class='rCardName'>" + recommendedProducts[rpIndex].name + "</div>\
							<div class='rCardPrice'>" + recommendedProducts[rpIndex].price + "</div>\
							<div class='rCardImg' style='background-image: url(" + recommendedProducts[rpIndex].images["front"].split(" ").join("%20") + ");'></div>\
						</div>";
		
		$("#recommndedList").append(cardHTML);
		
	}
	
	$(".rCard").each(function(){
		
		$(this).click(function(){
			
			var rCode= $(this).attr("data-rcode");
			
			window.location = "product.html?productCode=" + rCode;
			
		});
		
	});
	
	$(".rCard").css("pointer-events", "none");
	
}

function setupOptions() {
	
	$("#optionSectionLabel input").change(function(){
				
		if(this.checked){
			
			$("#optionSectionLabel").css("cursor", "default");
			document.getElementById("optionsCheck").disabled = true;
			
			document.getElementById("basketContainer").disabled = false;
			
		}
		
	});
	
	$("#closeOptionsBtn").click(function(){
		
		//$('#basketSectionLabel input').prop('checked', true);
		
		$('#basketSectionLabel input').click();
		
		document.getElementById("optionsCheck").disabled = false;
		
		$("#optionSectionLabel").css("cursor", "pointer");
		
	});
	
	
	$("#basketSectionLabel").css("cursor", "default");
	document.getElementById("basketRadio").disabled = true;
	
	$("#basketSectionLabel input").change(function(){
				
		if(this.checked){
			
			$("#basketSectionLabel").css("cursor", "default");
			document.getElementById("basketRadio").disabled = true;
			document.getElementById("basketContainer").disabled = false;
			document.getElementById("outfitRadio").disabled = false;
			
			$("#basketContainer").addClass("basketContainerActive");
			
		}
		
	});
	
	$("#basketContainer").addClass("basketContainerActive");
	
	$("#outfitsSectionLabel input").change(function(){
				
		if(this.checked){
			
			$("#outfitsSectionLabel").css("cursor", "default");
			document.getElementById("outfitRadio").disabled = true;
			document.getElementById("basketContainer").disabled = true;
			document.getElementById("basketRadio").disabled = false;
			
			$("#basketContainer").removeClass("basketContainerActive");
			
		}
		
	});
	
	$("#basketContainer").click(function(){
		
		wall.addToBasket(currentProduct, currentQuantity, currentSize, currentColor);
		alert("Added To Basket");
		
	});
	document.getElementById("basketContainer").disabled = true;
	
		
	for(var cIndex in currentProduct.colours){
		
		$("#colourList").append("<li class='" + currentProduct.colours[cIndex].class + "PC' data-colourobj="+ cIndex + " ></li>");
		
	}
	
	$("#colourList li").each(function(){
		
		$(this).click(function(){
			
			var cIndex = $(this).attr("data-colourobj");
			
			console.log(cIndex);
			
			currentColor = currentProduct.colours[cIndex];
			
			$("#basketColorVal").removeClass();
			$("#basketColorVal").addClass(currentColor.class + "PC");
			
		});
		
	});
	
	$("#colourList li").first().click();
	
	
	for(var sIndex in currentProduct.sizes){
		
		$("#sizeList").append("<li><span>" + currentProduct.sizes[sIndex] + "</span></li>");
		
	}
	
	$("#sizeList li").each(function(){
		
		$(this).click(function(){
			
			var sizeValue = $(this).text();
			
			currentSize = sizeValue;
			
			$("#basketSizeVal").text(currentSize);
						
		});
		
	});
	
	$("#sizeList li").first().click();
	
	
	currentOutfits = wall.getOutfits().reverse();
	
	console.log("current outfits: \n" + currentOutfits);
	
	for(var coKey in currentOutfits)
			$("#outfitsList").append("<li data-coindex=" + coKey + " ><span>" + currentOutfits[coKey].name + "</span></li>");
	
	
	$("#outfitsList li").each(function(){
		
		$(this).click(function(){
			
			var coIndex = $(this).attr("data-coindex");
			
			wall.addOutfitItem(currentOutfits[coIndex].name, currentProduct, currentQuantity, currentSize, currentColor);
			
			alert("added to outfit: " + currentOutfits[coIndex].name);
			
		});
		
	});
	
	$("#outfitsNewButton").click(function(){
		
		var newOutfitName = $("#newOutfitName").val();
		
		wall.addOutfit(newOutfitName);
		
		wall.addOutfitItem(newOutfitName, currentProduct, currentQuantity, currentSize, currentColor);
		
		wall.setCurrentOutfit(newOutfitName);
		
		currentOutfits = wall.getOutfits().reverse();
		
		$("#outfitsList").empty();
		
		for(var coKey in currentOutfits)
			$("#outfitsList").append("<li data-coindex=" + coKey + " ><span>" + currentOutfits[coKey].name + "</span></li>");
		
		$("#newOutfitName").val("");
		
	});
	
}

