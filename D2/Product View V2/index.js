var imgs = ["DressFront.png", "DressBack.png", "DressPattern.png"];

$(document).ready(function(){
	
	setupImageDisplay();
	setupProductDetails();
	setupRecommended();
	
	//$("#recommendedSectionLabel").click();
	
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
