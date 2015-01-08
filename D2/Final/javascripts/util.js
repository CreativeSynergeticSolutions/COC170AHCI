$(document.body).on('click', '.btn-link', function (e) {
    console.log(this);
    newLocation = $(this).data('href');
    $('body').fadeOut(500, function () {
        window.location = newLocation;
    });
});
var pageTimeout = null;
function setPageTimeout() {
    var page = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
    if(page != 'idle.html') {
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

function addNotification (icon,text) {
    if($('.notification').length > 4) {
        $('.notification:not(:animated)').first().fadeOut('fast', function () {
            $('.notification').first().remove();
        });
    }
    var notificationId = parseInt($('.notification').last().data('id'))+1 || 0;
    console.log(notificationId);
    $('.notification-area').append('<div class="notification notification-'+notificationId+'" data-id="'+notificationId+'"><i class="icon-'+icon+'"></i> '+text+'</div>');
    $('.notification-'+notificationId).fadeIn({duration: 500, queue: false}).css('display','none').slideDown(500);
    setTimeout(function () {
        $('.notification-'+notificationId).fadeOut({duration: 500, queue: false}).slideUp(500, function () {
            $('.notification-'+notificationId).remove();
        });
    }, 3000);
}
