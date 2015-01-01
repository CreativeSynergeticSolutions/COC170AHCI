$('.btn-link').click(function (e) {
    newLocation = $(this).data('href');
    $('body').fadeOut(500, function () {
        window.location = newLocation;
    });
});
var pageTimeout = null;
function setPageTimeout() {
    var page = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
    if(page != 'idle.html') {
        console.log("setting page timeout");
        pageTimeout = setTimeout(function () {
            $('body').fadeOut(500, function () {
                window.location = "idle.html";
            });
        }, 300000);
    }
}
function restartPageTimeout() {
    clearTimeout(pageTimeout);
    setPageTimeout();
}
var documentBody = document.getElementsByTagName('body')[0];
var events = ['click','dblclick','mousemove','contextmenu','wheel','focus','keydown','touchcancel','touchend','touchmove','touchstart'];
for(var event in events) {
    documentBody.addEventListener(events[event], restartPageTimeout, false);
}

setPageTimeout();
