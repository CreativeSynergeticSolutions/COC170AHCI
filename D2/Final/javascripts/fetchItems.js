var items = {};
$.getJSON("data/items.json")
.error(function () {
    console.log("Error in JSON");
})
.complete(function () {
    items = (typeof items === undefined ? {} : items);
    items.getItemByCode = function (code) {
        var result = null;
        for(var i=0; i<this.length; i++){
            if (this[i].productCode==code) {
                result = this[i];
                break;
            }
        }
        return result;
    };
})
.success(function (data) {
    items = data.items;
});
console.log(items);
