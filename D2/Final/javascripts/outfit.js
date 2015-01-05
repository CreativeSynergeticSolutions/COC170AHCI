var wall = new wall();
var dial = new Dial(50,"0.8em");

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
    itemEle.setAttribute("data-href","product.html?productCode="+item.item.productCode);
    itemEle.innerHTML = "<i class='icon-info-circled'></i> "+item.item.name;
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
        outfitItemListEle.appendChild(makeEmptyEle('No items.','current-item empty-item'));
    }
}
function loadOutfit () {
    var outfit = wall.getCurrentOutfit();
    $('.main-outfit-area > * > *:not(.add-area)').each(function () {
        $(this).remove();
    });
    $('.add-area').show();
    if(outfit!=null){
        $('.current-outfit-name').val(outfit.name);
    } else {
        $('.current-outfit-name').val('');
    }
    if(outfit!=null&&outfit.items.length>0){
        $('.outfit-trash-area').show();
        for(var i = 0; i < outfit.items.length; i++){
            var item = outfit.items[i].item,
                itemEle = document.createElement('div'),
                addEle = document.createElement('div'),
                buyEle = document.createElement('div'),
                addIcon = document.createElement('i'),
                buyIcon = document.createElement('i');
            itemEle.className = "main-item item btn-link";
            itemEle.setAttribute("data-href","product.html?productCode="+item.productCode);
            itemEle.style.backgroundImage = "url('"+item.images.front+"')";
            itemEle.dataset.itemname = item.name;
            addEle.className = "add-item btn-link";
            addEle.setAttribute("data-href","shelf.html?type="+item.type);
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
    var itemEle = document.createElement('div'),
        itemName = document.createElement('div'),
        itemSize = document.createElement('div'),
        itemColour = document.createElement('div'),
        itemQuantity = document.createElement('div'),
        itemRemove = document.createElement('div'),
        infoIcon = document.createElement('i'),
        removeIcon = document.createElement('i');
    itemEle.className = 'basket-item';
    itemEle.setAttribute("data-item-id",item.id);
    infoIcon.className = 'icon-info-circled';
    itemName.className = 'basket-item__name btn-link';
    itemName.setAttribute("data-href","product.html?productCode="+item.item.productCode);
    itemName.appendChild(infoIcon);
    itemName.innerHTML += " "+item.item.name;
    itemSize.className = 'basket-item__size';
    itemSize.innerHTML = "(" + item.size + ")";
    itemColour.className = 'basket-item__colour';
    itemColour.className = item.colour.class;
    itemQuantity.className = 'basket-item__quantity';
    itemQuantity.innerHTML = '<div class="basket-dial" data-dialid="'+item.id+'" data-quantity="'+item.quantity+'"></div>';
    itemRemove.className = 'basket-item__remove';
    removeIcon.className = 'icon-cancel';
    itemRemove.appendChild(removeIcon);

    itemEle.appendChild(itemName);
    itemEle.appendChild(itemSize);
    itemEle.appendChild(itemRemove);
    itemEle.appendChild(itemQuantity);
    return itemEle;
}
function getNumberOfItemInBasket (basket) {
    var number = 0;
    for(var item in basket) {
        number += basket[item].quantity;
    }
    return number;
}
function getBasketTotal (basket) {
    var number = 0;
    for(var item in basket) {
        var itemPrice = basket[item].item.price;
        number += basket[item].quantity * itemPrice.slice(1,itemPrice.length);
    }
    return number;
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
        basketEle.appendChild(makeEmptyEle('Your basket is empty.','basket-item empty-item'));
    }
    $('.basket-btn .btn .itemCount').remove();
    $('.basket-btn .btn .priceCount').remove();
    if(basket.length > 0) {
        var itemInBasket = getNumberOfItemInBasket(basket);
        $('.basket-btn .btn .inner').append('<span class="itemCount"> | '+ itemInBasket + ((itemInBasket > 1) ? ' items' : ' item') +' | </span>');
        $('.basket-btn .btn .inner').append('<span class="priceCount">&pound;'+getBasketTotal(basket)+'</span>');
    }
    $('.basket-dial').each(function () {
        var dialid = parseInt($(this).data('dialid')),
            dialQuantity = parseInt($(this).data('quantity')),
            _this = this;
        dial.addNewDial(dialid, function (dialData) {
            if($(_this).data('quantity')!=dialData.dialValue) {
                $(_this).data('quantity',dialData.dialValue);
                var itemid = $(this).parent().parent().data('item-id');
                wall.updateBasketItemQuantity(itemid, $(_this).data('quantity'));
                loadBasketList();
            }
        });
        dial.setDialValue(dialid, dialQuantity);
    });
}
function makeOutfitListItem(outfit, selected) {
    var selected = selected || false,
        itemEle = document.createElement('div'),
        nameEle = document.createElement('span'),
        toolsEle = document.createElement('span'),
        eyeIcon = document.createElement('i'),
        basketIcon = document.createElement('i'),
        removeIcon = document.createElement('i'),
        itemClasses = "outfit-item " + ((selected) ? "outfit-selected" : "");
    itemEle.className = itemClasses;
    nameEle.className = "left outfit-name";
    toolsEle.className = "right outfit-tools";
    eyeIcon.className = "icon-eye view-outfit";
    basketIcon.className = "icon-basket buy-outfit";
    removeIcon.className = "icon-cancel remove-outfit";
    nameEle.innerHTML = outfit.name;
    itemEle.appendChild(nameEle);
    toolsEle.appendChild(eyeIcon);
    toolsEle.innerHTML += " | ";
    toolsEle.appendChild(basketIcon);
    toolsEle.innerHTML += " | ";
    toolsEle.appendChild(removeIcon);
    itemEle.appendChild(toolsEle);
    return itemEle;
}
function loadOutfitList() {
    var outfits = wall.getOutfits(),
        outfitsEle = document.getElementById('outfits');
    outfitsEle.innerHTML = "";
    if(outfits!=null&&outfits.length>0){
        for(var i=0; i<outfits.length; i++){
            var currentOutfit = wall.getCurrentOutfit();
                isCurrentOutfit = false;
            if(typeof currentOutfit !== "undefined") {
                isCurrentOutfit = (outfits[i].name==currentOutfit.name);
            }
            outfitsEle.appendChild(makeOutfitListItem(outfits[i], currentOutfit));
        }
    } else {
        wall.addOutfit('First outfit');
        loadOutfitList();
    }
}
function getSearchPairs () {
    var result = null,
        wSearch = window.location.search;
    wSearch = wSearch.slice(1, wSearch.length).split("&");
    var keyValuePairs = {};
    for(var pair in wSearch) {
        var parts = wSearch[pair].split("="),
            part1 = parts[0],
            part2 = null;
        if(parts.length>1){
            part2 = parts[1];
        }
        keyValuePairs[part1] = part2;
    }
    return keyValuePairs;
};
function initialLoad() {
    var pairs = getSearchPairs(),
        outfits = wall.getOutfits();
    if(pairs.hasOwnProperty('outfitName')) {
        for(var o in outfits){
            var encodedOutfitName = encodeURI(outfits[o].name);
            if(encodedOutfitName == pairs.outfitName) {
                wall.setCurrentOutfit(outfits[o].name);
                break;
            }
        }
    }
    console.log(wall.getCurrentOutfit());
    loadBasketList();
    loadOutfitList();
    if(typeof wall.getCurrentOutfit()==="undefined"){
        var outfitName = $.trim($('.outfit-name').first().text());
        wall.setCurrentOutfit(outfitName);
    }
    loadOutfit();
}

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
window.onload = function () {
    $('.main-area').hide().fadeIn(500);
    initialLoad();
    $('.outfit-btn').click(function(){
        var added = false;
        if(!$('.outfit-area').hasClass('active')){
            $('.outfit-area').addClass('active');
            added = true;
            $('.outfits').css('overflow','auto');
        }
        $('.outfits').slideToggle("fast",function(){
            if(!added){
                $('.outfit-area').removeClass('active');
                $('.outfits').css('overflow','hidden');
            }
        });
    });
    $('.basket-btn').click(function(){
        var added = false;
        if(!$('.basket-area').hasClass('active')){
            $('.basket-area').addClass('active');
            added = true;
            $('.basket').css('overflow','auto');
        }
        $('.basket').slideToggle("fast",function(){
            if(!added){
                $('.basket-area').removeClass('active');
                $('.basket').css('overflow','hidden');
            }
        });
    });
    $('.current-items-btn').click(function(){
        var added = false;
        if(!$('.current-items-area').hasClass('active')){
            $('.current-items-area').addClass('active');
            added = true;
            $('.current-items').css('overflow','auto');
        }
        $('.current-items').slideToggle("fast",function(){
            if(!added){
                $('.current-items-area').removeClass('active');
                $('.current-items').css('overflow','hidden');
            }
        });
    });
    $(document.body).on('click', '.add-item', function (e) {
        e.stopPropagation();
    });
    $(document.body).on('click', '.buy-item', function (e) {
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
        addNotification('basket',item.item.name+' added to basket.');
        e.stopPropagation();
    });
    $(document.body).on('click', '.view-outfit', function () {

    });
    $(document.body).on('click', '.buy-outfit', function (e) {
        var outfitName = $.trim($(this).parent().parent().find('.outfit-name').text()),
            outfit = wall.getOutfit(outfitName);
        for(var i=0; i<outfit.items.length; i++){
            var item = outfit.items[i];
            wall.addToBasket(item.item, item.quantity, item.size, item.colour);
        }
        loadBasketList();
        addNotification('basket','Outfit "'+outfitName+'" added to basket.');
        e.stopPropagation();
    });
    $(document.body).on('click', '.outfit-item', function () {
        $('.outfit-selected').removeClass('outfit-selected');
        $(this).addClass('outfit-selected');
        var outfitName = $.trim($('.outfit-selected>.outfit-name').text());
        wall.setCurrentOutfit(outfitName);
        loadOutfit();
        addNotification('child','Outfit changed to "'+outfitName+'".');
    });
    $(document.body).on('click', '.remove-outfit', function (e) {
        var outfitName = $.trim($(this).parent().parent().find('.outfit-name').text());
        wall.removeOutfit(outfitName);
        loadOutfitList();
        loadOutfit();
        addNotification('cancel','Outfit "'+outfitName+'" deleted.');
        e.stopPropagation();
    });
    $(document.body).on('click', '.basket-item__remove', function () {
        var toRemove = $(this).parent().data('item-id');
        var itemName = $.trim($(this).parent().find('.basket-item__name').text());
        wall.removeItemFromBasket(toRemove);
        loadBasketList();
        addNotification('cancel',itemName+' removed from basket.');
    });
    $(document.body).on('click', '.add-outfit-btn', function () {
        var outfits = wall.getOutfits(),
            outfitName = 'Outfit '+(outfits.length+1);
        wall.addOutfit(outfitName);
        wall.setCurrentOutfit(outfitName);
        loadOutfit();
        loadOutfitList();
        addNotification('heart','Outfit "'+outfitName+'" added.');
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
            var area = $('#'+$(ui.draggable[0]).parent()[0].id);
            var itemName = $(ui.draggable[0]).data('itemname');
            wall.removeOutfitItem(wall.getCurrentOutfit().name,itemName);
            ui.draggable[0].remove();
            console.log(area);
            if(area.children().length === 1) {
                area.find('.add-area').show();
            }
        },
        out: function (event, ui) {
            $('.outfit-trash-area i').removeClass('icon-trash').addClass('icon-trash-empty');
            $(ui.draggable[0]).find('.add-item').fadeIn("fast", function () {});
        }
    });
    $('.current-outfit-name').on('focus', function () {
        $('.current-outfit-name-input').removeClass('saved').addClass('saving');
    });
    $('.current-outfit-name').on('focusout', function () {
        var newOutfit = wall.getCurrentOutfit(),
            oldName = newOutfit.name;
        newOutfit.name = $.trim($(this).val());
        wall.updateOutfit(oldName, newOutfit);
        wall.setCurrentOutfit(newOutfit.name);
        loadOutfitList();
        $('.current-outfit-name-input').removeClass('saving').addClass('saved');
        addNotification('pencil','Outfit renamed to "'+newOutfit.name+'".');
    });
    function resizeInput() {
        $(this).attr('size', $(this).val().length);
    }
    //$('.current-outfit-name').keyup(resizeInput).each(resizeInput);
};
