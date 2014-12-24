var wall = new wall();
function loadOutfit () {
    var outfits = wall.getOutfits();
    if(outfits!=null&&outfits.length>0){
        $('.outfit-trash-area').show();
        for(var i = 0; i < outfits.length; i++){
            var item = outfits[i],
                itemEle = document.createElement('div'),
                addEle = document.createElement('div'),
                addIcon = document.createElement('i');
            itemEle.className = "main-item item";
            itemEle.style.backgroundImage = "url('"+item.imgURL+"')";
            itemEle.dataset.itemname = item.name;
            addEle.className = "add-item";
            addIcon.className = "icon-plus";
            addEle.appendChild(addIcon);
            itemEle.appendChild(addEle);
            $('#'+item.type+'-area').find('.add-area').hide();
            document.getElementById(item.type+'-area').appendChild(itemEle);
        }
        $('.item').draggable({
            cursor: '-webkit-grabbing',
            zIndex: 100,
            drag: function (event, ui) {
                 $(this).css('transform','rotate(0deg)');
            },
            stop: function(event, ui) {
                $(this).css('transform','none');
                this._originalPosition = this._originalPosition || ui.originalPosition;
                ui.helper.animate( this._originalPosition );
            }
        });
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
    if(basket!=null&&basket.length>0){
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
    $('.add-item').on('click', function () {

    });
    $('.outfit-trash-area').droppable({
        accept: '.item',
        tolerance: 'touch',
        over: function (event, ui) {
            $('.outfit-trash-area i').removeClass('icon-trash-empty').addClass('icon-trash');
            $(ui.draggable[0]).find('.add-item').fadeOut("fast", function () {});
        },
        drop: function (event, ui) {
            //wall.removeFromOutfit({'itemName':$(this).parent().data('itemname')});
            ui.draggable[0].remove();
        },
        out: function (event, ui) {
            $('.outfit-trash-area i').removeClass('icon-trash').addClass('icon-trash-empty');
            $(ui.draggable[0]).find('.add-item').fadeIn("fast", function () {});
        }
    });
};
