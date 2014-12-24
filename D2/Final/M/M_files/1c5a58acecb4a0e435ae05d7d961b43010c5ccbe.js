function getNewRepeat() {
    var e=new Date(),cval,f,ct=e.getTime();
    e.setTime(ct+30*24*60*60*1000);
    f=e.toUTCString();
	cval=ck('sc_nr');
	if(cval.length==0){
		document.cookie = "sc_nr="+f+"|; expires="+e.toUTCString();
		return 'New';
		}
	if(cval.length!=0&&ct-cval<30*60*1000){
		document.cookie = "sc_nr="+f+"|; expires="+e.toUTCString();
		return 'New';
		}
	if(cval<1123916400001){
		e.setTime(cval+30*24*60*60*1000);
		document.cookie = "sc_nr="+f+"|; expires="+e.toUTCString();
		return 'Repeat';
		}
	else return 'Repeat';
    }
    
function getDayOfWeek() {
    var r;
    switch(new Date().getDay()) { 
        case 0: r = "Sunday";    break;
        case 1: r = "Monday";    break;
        case 2: r = "Tuesday";   break;
        case 3: r = "Wednesday"; break;
        case 4: r = "Thursday";  break;
        case 5: r = "Friday";    break;
        case 6: r = "Saturday";  break;
    };
    return r;
}