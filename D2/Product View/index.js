var imgs = ["DressFront.jpg", "DressBack.png", "DressPattern.jpg"];

$(document).ready(function(){
	
	$(".imgBtns").click(function(){
		
		var index= $(this).attr("data-Img");
		
		$("#productBox").css("background-image", "url(productImages/" + imgs[index] + ")")
		
	});
	
	$("#frontImg").click();
	
});