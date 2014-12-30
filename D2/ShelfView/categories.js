
var currentCategory="";
var currentSubCategory="";
var currentSelection="";

var CAT={

	"Christmas": [
		"Women",
		"Men",
		"Boys",
		"Girls",
		"Baby",
		"Christmas Jumpers",
		"Novelty",
		"Gifts by Price",
		"Home Decor",
		"Trees and Decorations"
	],
	"Home and Garden":[
		"Just Arrived",
		"Furnishings",
		"Office",
		"Bedroom",
		"Bathroom",
		"Kids",
		"Nursery",
		"Outdoor",
		"Living Room",
		"Appliances",
		"Kitchen and Dining"
	],
	"Women":[
		"Clothing",
		"Footwear",
		"Christmas",
		"Collections",
		"Latest Trends",
		"Shop By Fit",
		"Offers",
		"Electrical Beauty",
	],
	"Lingerie":[
		"Bras",
		"Help to Buy",
		"Underwear and Lingerie",
		"Nightwear and Slippers",
		"Christmas",
		"Offers"
	],
	"Men":[
		"Clothing",
		"Footwear",
		"Christmas",
		"Brands",
		"Collections",
		"Offers",
		"Christmas",
		"Personal Grooming"
	],
	"Boys":[
		"Clothing",
		"Footwear",
		"School",
		"Collections",
		"Christmas",
		"Shop by",
		"Character",
		"Kids Home",
	],
	"Girls":[
		"Clothing",
		"Footwear",
		"School",
		"Collections",
		"Christmas",
		"Shop by",
		"Character",
		"Kids Home"

	],
	"Baby":[
		"New in",
		"New Baby",
		"Baby Accessories",
		"Girls",
		"Boys",
		"Collections",
		"Christmas",
		"Offers",
		"Nursery"
	],
	"School":[
		"Boys",
		"Girls",
		"Older Boys",
		"Older Girls",
		"Last Chance"
	],
	"Fancy Dress":[
		"Fancy Dress",
		"Fancy Dress Accessories",
		"Christmas"
	],
	"Sale":[
		"Shop by"
	]


};
var SUB_CAT={

	//category_subcategory
	"Christmas_Women":
		[
			"Shop all Gifts",
			"Accessories",
			"Coats and Jackets",
			"Dresses and Jumpsuits",
			"Jumpers and Cardigans",
			"Lingerie",
			"Nightwear and Slippers",
			"Onesies"

		],
	"Christmas_Men":[
		"Shop all Gifts",
		"Accessories",
		"Coats and Jackets",
		"Jumpers and Cardigans",
		"Nightwear and Slippers",
		"Onesies",
		"Tops",
		"Underwear and Socks"
	],
	"Christmas_Boys":[
		"Shop all Gifts",
		"Accessories",
		"Coats and Jackets",
		"Fancy Dress",
		"Jumpers and Cardigans",
		"Nightwear and Slippers",
		"Onesies",
		"Tops",
	],
	"Christmas_Girls":[
		"Shop all Gifts",
		"Accessories",
		"Coats and Jackets",
		"Fancy Dress",
		"Jumpers and Cardigans",
		"Nightwear and Slippers",
		"Onesies",
	],
	"Christmas_Baby":[
		"Shop all Gifts",
		"Accessories",
		"All in Ones",
		"Jumpers and Cardigans",
		"Coats and Pramsuits",
		"Fancy Dress",
		"Outfits",
		"Sleepsuits and Pyjamas"
	],
	"Christmas_Christmas Jumpers":[],
	"Christmas_Novelty":[],
	"Christmas_Gifts by Price":[],
	"Christmas_Home Decor":[],
	"Christmas_Trees and Decorations":[],

	"Home and Garden_Just Arrived":[],
	"Home and Garden_Furnishings":[],
	"Home and Garden_Office":[],
	"Home and Garden_Bedroom":[],
	"Home and Garden_Bathroom":[],
	"Home and Garden_Kids":[],
	"Home and Garden_Nursery":[],
	"Home and Garden_Outdoor":[],
	"Home and Garden_Living Room":[],
	"Home and Garden_Appliances":[],
	"Home and Garden_Kitchen and Dining":[],

	"Women_Clothing":[],
	"Women_Footwear":[],
	"Women_Christmas":[],
	"Women_Collections":[],
	"Women_Latest Trends":[],
	"Women_Shop By Fit":[],
	"Women_Offers":[],
	"Women_Electrical Beauty":[],

	"Lingerie_Bras":[],
	"Lingerie_Help to Buy":[],
	"Lingerie_Underwear and Lingerie":[],
	"Lingerie_Nightwear and Slippers":[],
	"Lingerie_Christmas":[],
	"Lingerie_Offers":[],

	"Men_Clothing":[],
	"Men_Footwear":[],
	"Men_Christmas":[],
	"Men_Brands":[],
	"Men_Collections":[],
	"Men_Offers":[],
	"Men_Christmas":[],
	"Men_Personal Grooming":[],

	"Boys_Clothing":[],
	"Boys_Footwear":[],
	"Boys_School":[],
	"Boys_Collections":[],
	"Boys_Christmas":[],
	"Boys_Shop by":[],
	"Boys_Character":[],
	"Boys_Kids Home":[],

	"Girls_Clothing":[],
	"Girls_Footwear":[],
	"Girls_School":[],
	"Girls_Collections":[],
	"Girls_Christmas":[],
	"Girls_Shop by":[],
	"Girls_Character":[],
	"Girls_Kids Home":[],

	"Baby_New in":[],
	"Baby_New Baby":[],
	"Baby_Baby Accessories":[],
	"Baby_Girls":[],
	"Baby_Boys":[],
	"Baby_Collections":[],
	"Baby_Christmas":[],
	"Baby_Offers":[],
	"Baby_Nursery":[],

	"School_Boys":[],
	"School_Girls":[],
	"School_Older Boys":[],
	"School_Older Girls":[],
	"School_Last Chance":[],
	"School_Fancy Dress":[],
	"School_Fancy Dress":[],
	"School_Fancy Dress Accessories":[],
	"School_Christmas":[],

	"Sale_Shop by":[]


};

var IMG_CAT={

	"Accessories":[
		"image1.png",
		"image2.png",
		"image3.png",
		"image4.png",
	]
};