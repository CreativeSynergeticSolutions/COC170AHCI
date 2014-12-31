/*
** Java Hashcode implementation in JavaScript
*/
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

/*
**  Generic Interfaces
*/
var wall = function (options) {
    options = options || {};
    this.user = options.user || '';
    this.userStorage = 'AHCI'+'-'+((this.user=='')?'local':this.user);
    this.saveObjectToStorage = function (name, toSave) {
        this.wallLog('Saving '+name);
        this.wallLog('Getting existing '+name);
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

/*
**  Outfits Interfaces
*/
wall.prototype.addOutfitItem = function (outfitName, item, quantity, size, colour) {
    this.wallLog('Adding an outfit');
    var entry = {
            "item": item,
            "quantity": quantity,
            "size": size,
            "colour": colour
        },
        outfits = this.getOutfits(),
        outfitIndex = this.getOutfitIndex(outfitName);
        outfit = outfits[outfitIndex];
    if(outfit===null){
        this.addOutfit(outfitName);
    }
    outfit.items.push(entry);
    this.saveObjectToStorage('outfits',outfits);
};
wall.prototype.removeOutfitItem = function (item) {
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
wall.prototype.getOutfitItems = function (outfitName) {
    this.wallLog('Getting outfit items | '+outfitName);
    var outfit = this.getOutfit(outfitName);
    return outfit.items;
};
wall.prototype.addOutfit = function (outfitName) {
    this.wallLog('Adding outfit | '+outfitName);
    var outfits = this.getOutfits();
    if(outfits===null){
        outfits = [];
    }
    outfits.push({"name":outfitName, items:[]});
    this.saveObjectToStorage('outfits',outfits);
};
wall.prototype.removeOutfit = function (outfitName) {
    this.wallLog('Removing outfit | '+outfitName);
    var outfits = this.getOutfits();
    for(var i = 0; i < outfits.length; i++) {
        if(outfits[i].name == outfitName){
            outfits.splice(i, 1);
            break;
        }
    }
    this.saveObjectToStorage('outfits',outfits);
};
wall.prototype.getOutfitIndex = function (outfitName) {
    this.wallLog('Getting outfit index | '+outfitName);
    var outfits = this.getOutfits(),
        index = null;
    for(var i=0; i<outfits.length;i++){
        if(outfits[i].name==outfitName){
            index = i;
            break;
        }
    }
    return index;
};
wall.prototype.getOutfit = function (outfitName) {
    this.wallLog('Getting outfit | '+outfitName);
    var outfits = this.getOutfits(),
        outfitIndex = this.getOutfitIndex(outfitName);
    return outfits[outfitIndex];
};
wall.prototype.getOutfits = function () {
    this.wallLog('Getting outfits');
    var userStorage = this.getObjectFromStorage('outfits');
    return (userStorage===null ? null : userStorage);
};
wall.prototype.getCurrentOutfit = function () {
    return this.getObjectFromStorage('currentOutfit');
}
wall.prototype.setCurrentOutfit = function (outfitName) {
    this.saveObjectToStorage('currentOutfit', this.getOutfit(outfitName));
}
/*
**  Basket Interfaces
*/
wall.prototype.addToBasket = function (item, quantity, size, colour) {
    this.wallLog('Adding item to basket');
    var entry = {
        "item": item,
        "quantity": quantity,
        "size": size,
        "colour": colour
    };
    if(entry.quantity>0){
        var basket = this.getBasket();
        if(basket===null){
            basket = [];
        }
        entry.id = basket.length;
        basket.push(entry);
        this.saveObjectToStorage('basket',basket);
    } else {
        this.removeItemFromBasket(entry);
    }
};
wall.prototype.removeItemFromBasket = function (entry) {
    this.wallLog('Removing item from basket');
    var basket = this.getBasket();
    for(var i = 0; i < basket.length; i++) {
        var check = (basket[i].item.name == entry.item.name)
                    && (basket[i].quantity == entry.quantity)
                    && (basket[i].size == entry.size)
                    && (basket[i].colour == entry.colour);
        if(check){
            console.log('Removed at '+i);
            basket.splice(i, 1);
            break;
        }
    }
    this.saveObjectToStorage('basket',basket);
}
wall.prototype.updateBasket = function (items) {
    this.wallLog('Updating basket');
    for(var i = 0; i < items.length; i++){
        this.addToBasket(items[i]);
    }
};
wall.prototype.getBasket = function () {
    this.wallLog('Getting basket');
    var userStorage = this.getObjectFromStorage('basket');
    return (userStorage===null ? null : userStorage);
};
