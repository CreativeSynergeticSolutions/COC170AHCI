# Final Product
## data/items.json

```js
{
    "items": [
        {
            "name": "Acid Wash Jeggings",
            "mainCategory": "Womens",
            "subCategory": "Jeans",
            "type": "bottom",
            "price": "£10.00",
            "images": {
                "front": "images/stock/womens/bottom/Acid Wash Jeggings/front.png",
                "back": "images/stock/womens/bottom/Acid Wash Jeggings/back.png"
            },
            "colours": [
                {
					"name":"Navy",
					"class":"navy"
				}
            ],
            "description": [
                {
                    "content": "We’re all for that grunge, messy hair look this season and with these acid wash jeggings you’re sure to be half way there. The perfect pick for an edgy new staple that will transform every look into a style statement instantly, you’re sure to adore these.",
                    "type": "paragraph"
                },
                {
                    "content": "Elasticated waistband",
                    "type": "bullet"
                }
            ],
            "fabric": "70% Cotton, 25% Polyester, 5% Elastane",
            "productCode": "4929029",
            "sizes": [
                "8",
                "10",
                "12",
                "14",
                "16"
            ],
			"recommendations":["4869167","4868138"]
        }, etc
    ]
}
```

## javascripts/fetchItems.js

```html
    <script type="text/javascript" src="javascripts/fetchItems.js"></script>
```
This will make the array of items objects available in the ``` items ``` global variable.

### Fetch Item by Product Code

```js
    var itemToBeFound = items.getItemByCode("ProductCode"); // returns item object
```
This function is in the items object, and allows an item to be retrieved via its product code.

### Get Product Code from query string

```js
    var productCode = items.getCodeFromSearch();
```
This function looks for and returns any parameters in the query string such that productCode=value, and returns the value.

## javascripts/Wall.js
Exposes useful functions for basket and outfit management with localStorage.

### Basket
#### Add Items to Basket
```js
    wall.addToBasket(items[0], 2, "10", {"name": "Navy", "class": "navy"});
```
#### Get Items in Basket
```js
    var basket = wall.getBasket();
```

### Outfit
#### Add Outfit

```js
    wall.addOutfit();
```

#### Remove Outfit

```js
    wall.removeOutfit();
```

#### Get Outfits

```js
    wall.getOutfits();
```

#### Add Items to Outfit

```js
    wall.addOutfitItem();
```

#### Remove Item from Outfit

```js
    wall.removeOutfitItem();
```

#### Get Items in Outfit

```js
    wall.getOutfitItems();
```

## On Screen Keyboard (OSK)
```html
    <link rel="stylesheet" href="vendor/ahci-icon-font/css/ahci.css">
    <link rel="stylesheet" href="stylesheets/keyboard.css">
    <script type="text/javascript" src="vendor/jquery-1.11.1.min.js"></script>
    <script type="text/javascript" src="javascripts/keyboard.js"></script>
```

Including these files will add an on screen keyboard attached to all the text inputs on the page.
