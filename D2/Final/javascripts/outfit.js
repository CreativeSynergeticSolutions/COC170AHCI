var wall = new wall();
function loadOutfit () {
    var outfits = wall.getOutfits();
    if(outfits.length>0){
        for(var i = 0; i < outfits.length; i++){
            var item = outfits[i],
                itemEle = document.createElement('div'),
                rmvEle = document.createElement('div'),
                rmvIcon = document.createElement('i');
            itemEle.className = "main-item item";
            itemEle.style.backgroundImage = "url('"+item.imgSrc+"')";
            itemEle.dataset.itemname = item.name;
            rmvEle.className = "remove-item";
            rmvIcon.className = "icon-cancel";
            rmvEle.appendChild(rmvIcon);
            itemEle.appendChild(rmvEle);
            document.getElementById(item.type+'-area').appendChild(itemEle);
        }
    }
}
function makeBasketItem(itemName) {
    var itemEle = document.createElement('div');
    itemEle.className = 'basket-item';
    itemEle.innerHTML = itemName;
    return itemEle;
}
function loadBasketList() {
    var basket = wall.getBasket();
    console.log(basket);
    if(basket.length>0){
        for(var i = 0; i < basket.length; i++){
            var item = basket[i];
            document.getElementById('basket').appendChild(makeBasketItem(item.name));
        }
    } else {
        document.getElementById('basket').appendChild(makeBasketItem('Your Basket is Empty'));    
    }
}
function loadOutfitList() {
    var outfit = wall.getOutfits();
    console.log(outfit);
}
function initialLoad() {
    loadOutfit();
    loadBasketList();
    loadOutfitList();
}
window.onload = function () {
    initialLoad();
    $('.outfit-btn').click(function(){
        var added = false;
        if(!$('.outfit-area').hasClass('active')){
            $('.outfit-area').addClass('active');
            added = true;
        }
        $('.outfits').slideToggle("fast",function(){
            if(!added){
                $('.outfit-area').removeClass('active');
            }
        });
    });
    $('.basket-btn').click(function(){
        var added = false;
        if(!$('.basket-area').hasClass('active')){
            $('.basket-area').addClass('active');
            added = true;
        }
        $('.basket').slideToggle("fast",function(){
            if(!added){
                $('.basket-area').removeClass('active');
            }
        });
    });
    $('.current-items-btn').click(function(){
        var added = false;
        if(!$('.current-items-area').hasClass('active')){
            $('.current-items-area').addClass('active');
            added = true;
        }
        $('.current-items').slideToggle("fast",function(){
            if(!added){
                $('.current-items-area').removeClass('active');
            }
        });
    });
    $('.outfit-name').focus(function () {
        $(this).parent().removeClass('saved').addClass('saving');    
    });    
    $('.outfit-name').focusout(function () {
        if($(this).val()!==""){
            $(this).parent().removeClass('saving').addClass('saved');
        } else {
            $(this).parent().removeClass('saving').removeClass('saved');
        }
    });
    $('.remove-item').on('click', function () {
        console.log($(this).parent().data('itemname'));
        wall.removeFromOutfit({'itemName':$(this).parent().data('itemname')});
        $(this).parent().remove();
    });
};