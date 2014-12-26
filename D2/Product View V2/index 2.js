var imgs = ["DressFront.png", "DressBack.png", "DressPattern.png"];

$(document).ready(function(){
	
	for (var iC = 0; iC < imgs.length; iC++){
		$("#ulImages").append("<div class='imgBtns' data-Img="+ iC + " ></div>");
	}
	
	$(".imgBtns").each(function(){
		
		var index= $(this).attr("data-Img");
		$(this).css("background-image", "url(productImages/" + imgs[index] + ")");
		
		$(this).click(function(){$("#displayImg").css("background-image", "url(productImages/" + imgs[index] + ")")});
		
	});
	
	$("#displayImgLabel input").change(function(){
		
		if(this.checked) {
			
			$("#displayImg").panzoom("enable");
			$("#displayImgLabel").css("cursor", "default");
			$(this).prop("disabled", true);
			
		} else {
			
			$("#displayImgLabel").css("cursor", "pointer");
			
			$("#displayImg").panzoom("reset");
			$("#displayImg").panzoom("disable");
			
		}
		
	});
	
	$("#closeDisplayImg").click(function(){
		
		$("#displayImgLabel input").prop("disabled", false);
		$("#displayImgLabel").click()
		
	});
	
	
	/*
	$("li[data-colour=1]").css("background-color", "white", "important");
	$("li[data-colour=2]").css("background-color", "black", "important");
	$("li[data-colour=3]").css("background-color", "grey",  "important");
	*/
		
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
		
});

