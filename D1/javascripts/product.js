$(document).ready(function() {
	
	$('#productColor .selectionOptions').click(function(){
		
		$('#selectedProductColor').html($(this).text());
		
	});
	
	$('#productSize .selectionOptions').click(function(){
		
		$('#selectedProductSize').html($(this).text());
		
	});
	
	$('#productQuantity .selectionOptions').click(function(){
		
		$('#selectedProductQuantity').html($(this).text());
		
	});
	
});