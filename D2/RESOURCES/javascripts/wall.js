var wall = function (options) {
    options = options || {};
    this.user = options.user || '';
    this.userStorage = 'AHCI'+'-'+((this.user=='')?'local':this.user);
    this.saveObjectToStorage = function (name, toSave) {
        this.wallLog('Saving '+name+'.');
        this.wallLog('Getting existing '+name+'.');
        var existing = this.getObjectFromStorage();
        if(existing===null){
            existing = {'basket':[],'outfits':[]};
        }
        existing[name] = toSave;
        localStorage.setItem(this.userStorage, JSON.stringify(existing));
    };
    this.getObjectFromStorage = function (name) {
        var existing = JSON.parse(localStorage.getItem(this.userStorage));
        if(existing===null){
            return null;    
        } else {
            if(typeof name === 'undefined'){
                return  existing;    
            } else {
                return existing[name];
            }
        }
    };
    this.wallLog = function (message) {
        var wallStyle = 'background-color:#fea;color:#a80;font-weight:bold;padding:2px;',
        messageStyle = 'background-color:#fea;color:#000000;padding:2px;';
        console.log('%c Wall | %c'+message+' ',wallStyle,messageStyle);   
    };
};
wall.prototype.addToOutfit = function (outfit) {
    this.wallLog('Adding an outfit.');
    var outfits = this.getOutfits();
    if(outfits===null){
        outfits = [];
    }
    outfit.id = outfits.length;
    outfits.push(outfit);
    this.saveObjectToStorage('outfits',outfits);
};
wall.prototype.removeOutfit = function (outfitName) {
    this.wallLog('Removing an outfit.');
    var outfits = this.getOutfits();
    for(var i = 0; i < outfits.length; i++) {
        if(outfits[i].name == outfitName){
            outfits.splice(i, 1);
            break;
        }
    }
    this.saveObjectToStorage('outfits',outfits);
};
wall.prototype.removeFromOutfit = function (item) {
    this.wallLog('Removing '+item.name+' from an outfit.');
    var outfits = this.getOutfits();
    for(var i = 0; i < outfits.length; i++) {
        if(outfits[i].name == item.name){
            outfits.splice(i, 1);
            break;
        }
    }
    this.saveObjectToStorage('outfits',outfits);
};
wall.prototype.getOutfits = function () {
    this.wallLog('Getting outfits.');
    var userStorage = this.getObjectFromStorage('outfits');
    return (userStorage===null ? null : userStorage); 
};
wall.prototype.addToBasket = function (item) {
    this.wallLog('Adding item to basket.');
    if(item.quantity>0){
        var basket = this.getBasket();
        if(basket===null){
            basket = [];
        }
        item.id = basket.length;
        basket.push(item);  
        this.saveObjectToStorage('basket',basket);
    } else {
        this.removeItemFromBasket(item);    
    }
};
wall.prototype.removeItemFromBasket = function (item) {
    this.wallLog('Removing item from basket.');
    var basket = this.getBasket();
    for(var i = 0; i < basket.length; i++) {
        if(basket[i].name == item.name){
            console.log('Removed at '+i);
            basket.splice(i, 1);
            break;
        }
    }
    this.saveObjectToStorage('basket',basket);    
}
wall.prototype.updateBasket = function (items) {
    this.wallLog('Updating basket.');
    for(var i = 0; i < items.length; i++){
        this.addToBasket(items[i]);
    }
};
wall.prototype.getBasket = function () {
    this.wallLog('Getting basket.');
    var userStorage = this.getObjectFromStorage('basket');
    return (userStorage===null ? null : userStorage);
};