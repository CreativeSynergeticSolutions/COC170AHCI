var Dial = function(dimensions, fontSize){

	this.dialsArray = [];
	this.dialsValueArray = [];

	var cssText = "	.dialImage { height: " + dimensions + "px; width: " + dimensions + "px; background-image: url(images/Dial.png); background-size: 100%; background-repeat: no-repeat; background-position: center center; }\
					.dialImage * {	transition: 0s !important;	}\
					.dialHandle { position: relative; top: 14%; left: 11%; height: 71%; width: 71%; z-index: 20;}\
					.dialHandle:after { content: ''; position: absolute; top: 48.5%; left: 2%; height: 3%; width: 30%; border-radius: 50px; background-color: #FFCC00; opacity: 0.3; transition: 0.2s; }\
					.dialHandle:active { top: -50%; left: -50%; height: 200%; width: 200%; }\
					.dialHandle:active:after { top: 48.5%; left: 20%; height: 3%; width: 20%; opacity: 1;}\
					.dialTextValue { position: absolute; top: 35%; left: 31%; height: 30%; width: 30%; color: #FC0; font-size: " + fontSize + "; text-align: center; font-weight: bold; }";

	$("head").append("<style  type='text/css'>" + cssText + "</style>");

}

Dial.prototype.addNewDial = function(dialid, selectedDialFunction){

	var dialObject = this;

	$("*[data-dialid=" + dialid + "]").addClass("dialImage");

	$("*[data-dialid=" + dialid + "]").append("<span class='dialTextValue'>1</span><div class='dialHandle'></div>");

	dialObject.dialsValueArray[dialid] = 1;

	var newDial = new Propeller($("*[data-dialid=" + dialid + "] .dialHandle")[0],
			{	angle: 0,
				inertia: 0,
				step: 45,
				onRotate: function(){

					var overVal = false;

					switch(this.angle){
						case 0:
						case -0:
						case 360:
						case -360:
							dialObject.dialsValueArray[dialid] = 1;
							break;
						case 45:
						case -315:
							dialObject.dialsValueArray[dialid] = 2;
							break;
						case 90:
						case -270:
							dialObject.dialsValueArray[dialid] = 3;
							break;
						case 135:
						case -225:
							dialObject.dialsValueArray[dialid] = 4;
							break;
						case 180:
						case -180:
							dialObject.dialsValueArray[dialid] = 5;
							break;
						default:
							overVal = true;
							console.log("overVal");
							break;
					}

					if((dialObject.dialsValueArray[dialid] == 1) && overVal){

						newDial.stop();
						newDial.angle = 0;

					}

					if((dialObject.dialsValueArray[dialid] == 5) && overVal){

						newDial.stop();
						newDial.angle = -180;

					}

					$("*[data-dialid=" + dialid + "] .dialTextValue").text(dialObject.dialsValueArray[dialid]);

					if(selectedDialFunction != null) selectedDialFunction({dialid: dialid, dialValue: dialObject.dialsValueArray[dialid]});

				}	});

	dialObject.dialsArray[dialid] = newDial;

};

Dial.prototype.setDialValue = function(dialid, quantityValue){

	switch(quantityValue){
		case 1:
			if(quantityValue != this.dialsValueArray[dialid]) this.dialsArray[dialid].angle = 0;
			this.dialsValueArray[dialid] = 1;
            $("*[data-dialid=" + dialid + "]").trigger('value-change', [1]);
            console.log([1]);
			break;
		case 2:
			if(quantityValue != this.dialsValueArray[dialid]) this.dialsArray[dialid].angle = 45;
			this.dialsValueArray[dialid] = 2;
            $("*[data-dialid=" + dialid + "]").trigger('value-change', [2]);
            console.log([2]);
			break;
		case 3:
			if(quantityValue != this.dialsValueArray[dialid]) this.dialsArray[dialid].angle = 90;
			this.dialsValueArray[dialid] = 3;
            $("*[data-dialid=" + dialid + "]").trigger('value-change', [3]);
            console.log([3]);
			break;
		case 4:
			if(quantityValue != this.dialsValueArray[dialid]) this.dialsArray[dialid].angle = 135;
			this.dialsValueArray[dialid] = 4;
            $("*[data-dialid=" + dialid + "]").trigger('value-change', [4]);
            console.log([4]);
			break;
		case 5:
			if(quantityValue != this.dialsValueArray[dialid]) this.dialsArray[dialid].angle = 180;
			this.dialsValueArray[dialid] = 5;
            $("*[data-dialid=" + dialid + "]").trigger('value-change', [5]);
            console.log([5]);
			break;
		default:
			this.dialsArray[dialid].angle = 0;
			this.dialsValueArray[dialid] = 1;
            $("*[data-dialid=" + dialid + "]").trigger('value-change', [1]);
            console.log([1]);
			break;
	}

};

Dial.prototype.currentValues = function(){

	var dialsValueArray = this.dialsValueArray;

	for(var key in dialsValueArray) console.log("key is: " + key + ", with val: " + dialsValueArray[key]);

}
