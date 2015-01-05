/*
** Java Hashcode implementation in JavaScript
*/
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
<<<<<<< HEAD
  if (this.length === 0) { return hash; }
=======
  if (this.length == 0) return hash;
>>>>>>> FETCH_HEAD
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
<<<<<<< HEAD
    this.userStorage = 'AHCI'+'-'+((this.user==='')?'local':this.user);
=======
    this.userStorage = 'AHCI'+'-'+((this.user=='')?'local':this.user);
>>>>>>> FETCH_HEAD
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
    var existing = this.getObjectFromStorage();
    if(existing===null){
        existing = {'basket':[],'outfits':[]};
    }
    localStorage.setItem(this.userStorage, JSON.stringify(existing));
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
        outfitIndex = this.getOutfitIndex(outfitName),
        outfit = outfits[outfitIndex];
    if(outfit===null){
        this.addOutfit(outfitName);
    }
    outfit.items.push(entry);
    this.saveObjectToStorage('outfits',outfits);
};
wall.prototype.removeOutfitItem = function (outfitName, itemName) {
    this.wallLog('Removing '+itemName+' from '+outfitName);
    var outfits = this.getOutfits(),
        outfitIndex = this.getOutfitIndex(outfitName);
    for(var i = 0; i < outfits[outfitIndex].items.length; i++) {
        if(outfits[outfitIndex].items[i].item.name == itemName){
            outfits[outfitIndex].items.splice(i, 1);
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
<<<<<<< HEAD
    var outfitid = (outfits.length===0) ? 0 : outfits[outfits.length-1].id+1;
=======
    var outfitid = (outfits.length==0) ? 0 : outfits[outfits.length-1].id+1;
>>>>>>> FETCH_HEAD
    outfits.push({"id": outfitid, "name":outfitName, items:[]});
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
<<<<<<< HEAD
};
=======
}
>>>>>>> FETCH_HEAD
wall.prototype.setCurrentOutfit = function (outfitName) {
    this.saveObjectToStorage('currentOutfit', this.getOutfit(outfitName));
};
wall.prototype.updateOutfit = function (outfitName, outfit) {
    var outfits = this.getOutfits(),
        outfitIndex = this.getOutfitIndex(outfitName);
    outfits[outfitIndex] = outfit;
    this.saveObjectToStorage('outfits',outfits);
};
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
<<<<<<< HEAD
        entry.id = (basket.length===0) ? 0 : basket[basket.length-1].id+1;
=======
        entry.id = (basket.length==0) ? 0 : basket[basket.length-1].id+1;
>>>>>>> FETCH_HEAD
        basket.push(entry);
        this.saveObjectToStorage('basket',basket);
    } else {
        this.removeItemFromBasket(entry);
    }
};
wall.prototype.removeItemFromBasket = function (id) {
    this.wallLog('Removing item from basket');
    var basket = this.getBasket();
    for(var i = 0; i < basket.length; i++) {
        var check = (basket[i].id == id);
        if(check){
            console.log('Removed at '+i);
            basket.splice(i, 1);
            break;
        }
    }
    this.saveObjectToStorage('basket',basket);
<<<<<<< HEAD
};
wall.prototype.updateBasketItemQuantity = function (id, quantity) {
    var basket = this.getBasket();
    for(var item in basket){
        if(basket[item].id==id){
            basket[item].quantity = quantity;
            break;
        }
    }
};
=======
}
>>>>>>> FETCH_HEAD
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
