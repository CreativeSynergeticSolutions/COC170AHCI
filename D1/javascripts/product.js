$(document).ready(function() {
	
	$("#productColor .selectionOptions").click(function(){
		
		$("#selectedProductColor").html($(this).text());
		
	});
	
	$("#productSize .selectionOptions").click(function(){
		
		$("#selectedProductSize").html($(this).text());
		
		quantitySelectionState();
		
	});
	
	$("#productQuantity .selectionOptions").click(function(){
		
		$("#selectedProductQuantity").html($(this).text());
		
	});
	
	quantitySelectionState();
	
});

function quantitySelectionState(){
	
	if( $("#selectedProductSize").text() === "") {
		
		$("#labelProductQuantity input").prop("disabled", true);
		
		$("#labelProductQuantity").addClass("disabled");
	}
	else {
		
		$("#labelProductQuantity input").prop("disabled", false);
		
		$("#labelProductQuantity").removeClass("disabled");
		
	}
	
}