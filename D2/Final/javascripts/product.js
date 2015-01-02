var currentProduct = {
            name: "Crochet Shoulder Blouse",
            mainCategory: "Womens",
            subCategory: "Blouse",
            type: "body",
            price: "£14.00",
            images: {
                front: "images/stock/womens/body/Crochet Shoulder Blouse/front.png",
                back: "images/stock/womens/body/Crochet Shoulder Blouse/back.png",
                close: "images/stock/womens/body/Crochet Shoulder Blouse/close.png"
            },
            colours: [
                {
					name:"Cream",
					class:"cream"
				},
				{
					name:"Red",
					class:"red"
				}
            ],
            description: [
                {
                    content: "Invest in this gently unique crochet shoulder blouse this season. This lovely piece will add a delightful touch to every look and will work in perfect harmony with your formal outfits. Team with one of our camisole vests to complete the look.",
                    type: "paragraph"
                },
                {
                    content: "Button through fastening",
                    type: "bullet"
                },
                {
                    content: "Long sleeve",
                    type: "bullet"
                }
            ],
            fabric: "Main body: 100% Polyester Trim: 100% Cotton",
            productCode: "4931794",
            sizes: [
                "8",
                "10",
                "12",
                "14",
                "16"
            ],
			recommendations:["4943984","4929704"]
        };

var productImages = [];

var currentColor = null;
var currentSize = "";
var currentQuantity = 1;

$(document).ready(function(){
	
	var retrievedCode = items.getCodeFromSearch();
	
	console.log("Code is this: " + retrievedCode);
	
	if (retrievedCode != null) currentProduct = items.getItemByCode(retrievedCode);
	
	console.log(currentProduct);
	
	
	document.getElementById("basketRadio").checked = true;
	
	setupHeader();
	setupImageDisplay();
	setupProductDetails();
	setupRecommended();
	setupOptions();
	
	$("<style type='text/css'> #optionsWrapper * {	transition: 1s;	}</style>").appendTo("head");

		
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
	
}

function setupRecommended() {
	
	$("#recommendedSectionLabel input").change(function(){
				
		if(this.checked){
			
			$("#recommendedSectionLabel").css("cursor", "default");
			document.getElementById("recommendedCheck").disabled = true;
						
		}
		
	});
	
	$("#closeRecommendedBtn").click(function(){
		
		document.getElementById("recommendedCheck").disabled = false;
		
		$("#recommendedSectionLabel").css("cursor", "pointer");
		
	});
	
}

function setupOptions() {
	
	$("#optionSectionLabel input").change(function(){
				
		if(this.checked){
			
			$("#optionSectionLabel").css("cursor", "default");
			document.getElementById("optionsCheck").disabled = true;
						
		}
		
	});
	
	$("#closeOptionsBtn").click(function(){
		
		$('#basketSectionLabel input').prop('checked', true);
		
		document.getElementById("optionsCheck").disabled = false;
		
		$("#optionSectionLabel").css("cursor", "pointer");
		
	});
	
	
	$("#basketSectionLabel").css("cursor", "default");
	document.getElementById("basketRadio").disabled = true;
	
	$("#basketSectionLabel input").change(function(){
				
		if(this.checked){
			
			$("#basketSectionLabel").css("cursor", "default");
			document.getElementById("basketRadio").disabled = true;
			document.getElementById("outfitRadio").disabled = false;
			
			$("#basketContainer").addClass("basketContainerActive");
			
		}
		
	});
	
	$("#basketContainer").addClass("basketContainerActive");
	
	$("#outfitsSectionLabel input").change(function(){
				
		if(this.checked){
			
			$("#outfitsSectionLabel").css("cursor", "default");
			document.getElementById("outfitRadio").disabled = true;
			document.getElementById("basketRadio").disabled = false;
			
			$("#basketContainer").removeClass("basketContainerActive");
			
		}
		
	});
	
		
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
	
	
	
}

