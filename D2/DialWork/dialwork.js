var dial = new Dial(200, "3em");

$(document).ready(function(){
	
	dial.addNewDial(1, function(dialData){
		
		console.log("dialid is: " + dialData.dialid);
		console.log("dialValue is: " + dialData.dialValue);
	});
	dial.addNewDial(2);
	
	/*
	var dialVal = 1;
	
	var dialProp = 
		new Propeller($(".dialHandle")[0], {
			angle: 0,
			inertia: 0, 
			step: 45,
			onRotate: function(){
								
				var overVal = false;
				
				console.log(this.angle);
								
				switch(this.angle){
					case 0:
					case -0:
					case 360:
					case -360:
						dialVal = 1;
						break;
					case 45:
					case -315:
						dialVal = 2;
						break;
					case 90:
					case -270:
						dialVal = 3;
						break;
					case 135:
					case -225:
						dialVal = 4;
						break;
					case 180:
					case -180:
						dialVal = 5;
						break;
					default:
						overVal = true;
						console.log("overVal");
						break;
				}
				
				if((dialVal == 1) && overVal){
					
					dialProp.stop();
					dialProp.angle = 0;
					
					console.log("run");
					
				}
				
				if((dialVal == 5) && overVal){
					
					dialProp.stop();
					dialProp.angle = -180;
					
					console.log("run");
					
				}
				
				$(".dialVal").text(dialVal);
				
			}
		});
	
	*/	
});



