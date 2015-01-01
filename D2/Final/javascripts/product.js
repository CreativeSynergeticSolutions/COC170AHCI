var imgs = ["DressFront.png", "DressBack.png", "DressPattern.png"];

$(document).ready(function(){
	
	document.getElementById("basketRadio").checked = true;
		
	setupImageDisplay();
	setupProductDetails();
	setupRecommended();
	setupOptions();
	
	$("<style type='text/css'> #optionsWrapper * {	transition: 1s;	}</style>").appendTo("head");

		
});

function setupImageDisplay() {
	
	for (var iC = 0; iC < imgs.length; iC++){
		$("#ulImages").append("<div class='imgBtns' data-Img="+ iC + " ></div>");
	}
	
	$(".imgBtns").each(function(){
		
		var index= $(this).attr("data-Img");
		$(this).css("background-image", "url(productImages/" + imgs[index] + ")");
		
		$(this).click(function(){$("#displayImg").css("background-image", "url(productImages/" + imgs[index] + ")")});
		
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
	
	$("#basketSectionLabel").css("cursor", "default");
	document.getElementById("basketRadio").disabled = true;
	
	
	
	//$("#optionSectionLabel").click();
	//$("#outfitsSectionLabel").click();
	
	
}

