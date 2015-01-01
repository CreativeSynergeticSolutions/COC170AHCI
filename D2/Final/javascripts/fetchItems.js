var items = {};
$.ajax({
    async: false,
    url: "data/items.json"
})
.fail(function () {
    console.log("Error in JSON");
})
.always(function () {
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
    items.getSearchPairs = function () {
        var result = null,
            wSearch = window.location.search;
        wSearch = wSearch.slice(1, wSearch.length).split("&");
        var keyValuePairs = {};
        for(pair in wSearch) {
            var parts = wSearch[pair].split("="),
                part1 = parts[0],
                part2 = null;
            console.log(parts);
            if(parts.length>1){
                part2 = parts[1];
            }
            keyValuePairs[part1] = part2;
        }
        return keyValuePairs;
    };
    items.getCodeFromSearch = function (code) {
        var pairs = this.getSearchPairs();
        return (pairs.hasOwnProperty("productCode") ? pairs.productCode : null);
    };
})
.done(function (data) {
    items = data.items;
});
console.log(items);
