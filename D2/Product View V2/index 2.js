var imgs = ["DressFront.png", "DressBack.png", "DressPattern.png"];

$(document).ready(function(){
	
	setupDisplay();
	
		
});

function setupDisplay() {
	
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
	
	$("#closeDisplayImg").click(function(){
		
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

