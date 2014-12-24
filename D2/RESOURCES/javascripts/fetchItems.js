var items;
$.getJSON("data/items.json")
.error(function () {
    console.log("Error in JSON");
})
.complete(function () {
    items = (typeof items === undefined ? {} : items);
})
.success(function (data) {
    items = data.items;
});
