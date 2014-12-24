window.onload = function () {
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    function getRandomItemElement() {
        var itemNumber = getRandomNumber(0, items.length),
            item = items[itemNumber],
            itemEle = document.createElement('div'),
            itemImgEle = document.createElement('div'),
            itemImg = document.createElement('img'),
            itemName = document.createElement('div'),
            itemPrice = document.createElement('div');
        itemImgEle.className = "item-img";
        itemName.className = "item-name";
        itemPrice.className = "item-price";
        itemImg.src = item.imgURL;
        itemName.innerHTML = item.name;
        itemPrice.innerHTML = item.price;
        itemImgEle.appendChild(itemImg);
        itemEle.appendChild(itemImgEle);
        itemEle.appendChild(itemName);
        itemEle.appendChild(itemPrice);
        return itemEle;
    }
    function animateInOut (item, interval){
       setTimeout(function () {
            item.animate({opacity: 0}, 5000, function () {
                item.html(getRandomItemElement().innerHTML);
                item.animate({opacity: 1}, 5000, function () {
                    var intervalNext = getRandomNumber(3000,15000);
                    animateInOut(item, intervalNext);
                });
            });
        }, interval);
    }
    $('.item').each(function () {
        var interval = getRandomNumber(3000,15000),
            item = $(this);
        item.html(getRandomItemElement().innerHTML);
        animateInOut(item, interval);
    });
};
