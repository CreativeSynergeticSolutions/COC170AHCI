var imgs = ["DressFront.jpg", "DressBack.png", "DressPattern.jpg"];

$(document).ready(function(){
	
	$(".imgBtns").click(function(){
		
		var index= $(this).attr("data-Img");
		
		$("#productBox").css("background-image", "url(productImages/" + imgs[index] + ")")
		
	});
	
	$("#frontImg").click();
	
	$("li[data-colour=1]").css("background-color", "white", "important");
	$("li[data-colour=2]").css("background-color", "black", "important");
	$("li[data-colour=3]").css("background-color", "grey",  "important");
	
});