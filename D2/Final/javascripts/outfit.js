var wall = new wall();

function makeEmptyEle(text, className){
    var emptyEle = document.createElement('div');
    emptyEle.className = className;
    emptyEle.innerHTML = text;
    return emptyEle;
}
function makeItemListItem (item) {
    console.log("Item" + item);
    var itemEle = document.createElement('div');
    itemEle.className = "current-item btn-link";
    itemEle.setAttribute("data-href","product.html?"+item.item.productCode);
    itemEle.innerHTML = item.item.name;
    return itemEle;
}
function loadItemList(outfit){
    var outfitItemListEle = document.getElementById("current-items");
    outfitItemListEle.innerHTML = "";
    if(outfit!=null&&outfit.items.length>0){
        for(var i=0; i<outfit.items.length; i++){
            console.log(outfit.items[i]);
            outfitItemListEle.appendChild(makeItemListItem(outfit.items[i]));
        }
    } else {
        outfitItemListEle.appendChild(makeEmptyEle('No items.','current-item'));
    }
}
function loadOutfit (outfit) {
    if(outfit!=null){
        $('.outfit-name').val(outfit.name);
    }
    if(outfit!=null&&outfit.items.length>0){
        $('.outfit-trash-area').show();
        for(var i = 0; i < outfit.items.length; i++){
            var item = outfit.items[i].item;
                itemEle = document.createElement('div'),
                addEle = document.createElement('div'),
                buyEle = document.createElement('div'),
                addIcon = document.createElement('i'),
                buyIcon = document.createElement('i');
            itemEle.className = "main-item item btn-link";
            itemEle.setAttribute("data-href","product.html?"+item.productCode);
            itemEle.style.backgroundImage = "url('"+item.images.front+"')";
            itemEle.dataset.itemname = item.name;
            addEle.className = "add-item";
            addIcon.className = "icon-plus";
            buyEle.className = "buy-item";
            buyIcon.className = "icon-basket";
            addEle.appendChild(addIcon);
            buyEle.appendChild(buyIcon);
            itemEle.appendChild(addEle);
            itemEle.appendChild(buyEle);
            $('#'+item.type+'-area').find('.add-area').hide();
            document.getElementById(item.type+'-area').appendChild(itemEle);
        }
        $('.item').draggable({
            cursor: '-webkit-grabbing',
            zIndex: 5,
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
    loadItemList(outfit);
}
function makeBasketItem(item) {
    var itemEle = document.createElement('div');
    itemEle.className = 'basket-item btn-link';
    itemEle.setAttribute("data-href","product.html?"+item.item.productCode);
    itemEle.innerHTML = item.item.name + " (" + item.size + ") " + "x" + item.quantity;
    return itemEle;
}
function loadBasketList() {
    var basket = wall.getBasket(),
        basketEle = document.getElementById('basket');
    basketEle.innerHTML = "";
    if(basket!=null&&basket.length>0){
        for(var i = 0; i < basket.length; i++){
            basketEle.appendChild(makeBasketItem(basket[i]));
        }
    } else {
        //document.getElementById('basket').appendChild(makeBasketItem('Your Basket is Empty'));
    }
}
function makeOutfitListItem(outfit, selected) {
    var selected = selected || false,
        itemEle = document.createElement('div'),
        nameEle = document.createElement('span'),
        toolsEle = document.createElement('span'),
        eyeIcon = document.createElement('i'),
        basketIcon = document.createElement('i'),
        itemClasses = "outfit-item " + ((selected) ? "outfit-selected" : "");
    itemEle.className = itemClasses;
    nameEle.className = "left outfit-name";
    toolsEle.className = "right outfit-tools";
    eyeIcon.className = "icon-eye";
    basketIcon.className = "icon-basket";
    nameEle.innerHTML = outfit.name;
    itemEle.appendChild(nameEle);
    toolsEle.appendChild(eyeIcon);
    toolsEle.innerHTML += " | ";
    toolsEle.appendChild(basketIcon);
    itemEle.appendChild(toolsEle);
    return itemEle;
}
function loadOutfitList() {
    var outfits = wall.getOutfits(),
        outfitsEle = document.getElementById('outfits');
    outfitsEle.innerHTML = "";
    if(outfits!=null&&outfits.length>0){
        for(var i=0; i<outfits.length; i++){
            var selected = (i==0 ? true : false);
            outfitsEle.appendChild(makeOutfitListItem(outfits[i], selected));
        }
    } else {
        //document.getElementById('outfits').appendChild(makeOutfitListItem('You have no outfits'));
    }
}
function initialLoad() {
    loadBasketList();
    loadOutfitList();
    var outfitName = $.trim($('.outfit-selected>.outfit-name').text());
    wall.setCurrentOutfit(outfitName);
    loadOutfit(wall.getCurrentOutfit());
}
window.onload = function () {
    $('.main-area').hide().fadeIn(500);
    initialLoad();
    $('.btn-link').click(function (e) {
        newLocation = $(this).data('href');
        $('.main-area').fadeOut(500, function () {
            window.location = newLocation;
        });
    });
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
    $('.buy-item').on('click', function () {
        var itemName = $(this).parent().data('itemname');
        var outfit = wall.getCurrentOutfit();
        for(var i=0; i<outfit.items.length; i++){
            var item = outfit.items[i];
            if(item.item.name==itemName){
                wall.addToBasket(item.item, item.quantity, item.size, item.colour);
                loadBasketList();
                break;
            }
        }
    });
    $('.outfit-trash-area').droppable({
        accept: '.item',
        tolerance: 'touch',
        over: function (event, ui) {
            $('.outfit-trash-area i').removeClass('icon-trash-empty').addClass('icon-trash');
            $(ui.draggable[0]).find('.add-item').fadeOut("fast", function () {});
        },
        drop: function (event, ui) {
            $('.outfit-trash-area i').removeClass('icon-trash').addClass('icon-trash-empty');
            //wall.removeFromOutfit({'itemName':$(this).parent().data('itemname')});
            ui.draggable[0].remove();
        },
        out: function (event, ui) {
            $('.outfit-trash-area i').removeClass('icon-trash').addClass('icon-trash-empty');
            $(ui.draggable[0]).find('.add-item').fadeIn("fast", function () {});
        }
    });
};
