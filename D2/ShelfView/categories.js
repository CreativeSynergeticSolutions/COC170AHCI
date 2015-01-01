
var currentCategory="";
var currentSubCategory="";
var currentSelection="";

var CAT={

	
	
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
		
		"Offers"
	],
	"Men":[
		"Clothing",
		"Footwear",
		"Christmas",
		"Brands",
		"Collections",
		"Offers",
		
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

	],
	"Sale":[
		"Shop by"
	]


};
var SUB_CAT={

	

	"Home and Garden_Just Arrived":[
		"New In"
	],
	"Home and Garden_Furnishings":[
		"Candles and Diffusers",
		"Curtains", 
		"Cushions and Throws",
		"Frames and Albums",
		"Home and Accessories",
		"Lighting",
		"Mirrors",
		"Paint and Wallpaper",
		"Rugs, Runners & Mats",
		"Storage",
		"Vases and Ornaments"
	],
	"Home and Garden_Office":[
		"View all Office"
	],
	"Home and Garden_Bedroom":[
		"Bedding",
		"Beds", 
		"Bedside Tables",
		"Chest of Drawers",
		"Dressing Tables",
		"Duvets & Pillows",
		"Sofabeds",
		"Wardrobes"
	],
	"Home and Garden_Bathroom":[
		"Bathroom Accessories",
		"Bathroom Fittings",
		"Shower Curtains",
		"Showers",
		"Toilet Seats",
		"Towels and Bath Mats"
	],
	"Home and Garden_Kids":[
		"View all Kids",
		"Bedroom",
		"Dining",
		"Furniture"
	],
	"Home and Garden_Nursery":[
		"Bedding & Blankets",
		"Changing Units",
		"Cots and Matresses",
		"Nursing Chairs",
		"Nursery Decor",
		"Towels",
		"Wardrobes"
		
	],
	"Home and Garden_Outdoor":[
		"View all Outdoor"
	],
	"Home and Garden_Living Room":[
		"Bookcases & Cabinets",
		"Coffee & Side Tables",
		"Footstools & Pouffes",
		"Sideboards & Storage",
		"Sofas & Armchairs",
		"TV Units"
	],
	"Home and Garden_Appliances":[
		"Blenders & Processors",
		"Coffee Machines",
		"Cooking Appliances",
		"Fans & Heating",
		"Irons",
		"Kettles",
		"Microwaves",
		"Toasters",
		"Vacuums & Steam Mops"
	],
	"Home and Garden_Kitchen and Dining":[
		"Baking",
		"Bar Stools",
		"Bins",
		"Cleaning",
		"Cups & Mugs",
		"Cutlery",
		"Dining Tables & Chairs",
		"Glassware",
		"Laundry",
		"Ovenware",
		"Tableware",
		"Utensils & Gadgets"
	],

	"Women_Clothing":[
		"New In",
		"Accessories",
		"Blouses & Shirts",
		"Coats & Jackets",
		"Dresses",
		"Hats, Gloves & Scarves",
		"Jeans",
		"Jumpers & Cardigans",
		"Jumpsuits & Playsuits",
		"Leggings",
		"Maternity",
		"Nightwear & Slippers",
		"Onesies",
		"Plus Size",
		"Skirts",
		"Swimwear",
		"Tops",
		"Trousers & Shorts",
		"Tunics",
		"Last Chance To Buy"
	],
	"Women_Footwear":[
		"All Footwear",
		"Boots & Wellies",
		"Flats",
		"Heels",
		"Sandals & Flip-flops",
		"Shoes",
		"Slippers",
		"Trainers"
	],
	"Women_Collections":[
		"Character Shop",
		"Fancy Dress",
		"Graduate Fashion Week",
		"Holiday Shop",
		"Sportswear",
		"The Contemporary Collection",
		"Thermal",
		"Tickled Pink",
		"Winter Warmers",
		"Workwear"
	],
	
	"Women_Latest Trends":[
		"Autumn"
	],
	"Women_Shop By Fit":[
		"Maternity",
		"Petite",
		"Plus Size"
	],
	"Women_Offers":[
		"Mix & Match Lingerie - 3 for £6",
		"Mix & Match Nightwear - 2 for £10",
		"Mix & Match Socks - 4 for £4.50"
	],
	"Women_Electrical Beauty":[
		"Hairdryers",
		"Hair Removal",
		"Hair Straighteners",
		"Hair Styling",
		"Spa and Massage"
	],

	"Lingerie_Bras":[
		"All Bras",
		"Balcony Bras",
		"Branded Bras",
		"DD+ Bras",
		"Nursing Bras",
		"Plunge Bras",
		"Post Surgery",
		"Sports Bras",
		"T-Shirt Bras"
	],
	"Lingerie_Help to Buy":[
		"Fit Guide"
	],
	"Lingerie_Underwear and Lingerie":[
		"Branded Lingerie",
		"Knickers",
		"Lingerie Sets",
		"Lingerie Solutions",
		"Shapewear",
		"Socks",
		"Tights",
		"Thermals"
		
	],
	"Lingerie_Nightwear and Slippers":[
		"All Nightwear",
		"Dressing Gowns",
		"Nightdresses",
		"Onesies",
		"Pyjamas",
		"Slippers"
	],

	"Lingerie_Offers":[
		"Mix and Match Lingerie - 3 for £6",
		"Mix and Match Nightwear - 2 for £10",
		
	],

	"Men_Clothing":[
		"New In",
		"Accessories",
		"Coats & Jackets",
		"Jeans",
		"Jumpers & Cardigans",
		"Nightwear & Slippers",
		"Onesies",
		"Shirts",
		"Socks",
		"Suits & Tailoring",
		"Sweatshirts & Hoodies",
		"Swimwear",
		"Ties",
		"Trousers & Shorts",
		"T-Shirts & Polos",
		"Underwear & Polos",
		"Underwear",
		"Last Chance To Buy"
	],
	"Men_Footwear":[
		"All Footwear",
		"Boots",
		"Casual Shoes",
		"Formal Shoes",
		"Slippers",
		"Trainers"
	],
	"Men_Brands":[
		"Boston Crew"
	],
	"Men_Collections":[
		"Character Shop",
		"Fancy Dress",
		"Officewear",
		"Outdoor Workwear",
		"Sportswear",
		"Thermal",
		"Winter Warmers"
	],
	"Men_Offers":[
		
	],

	"Men_Personal Grooming":[
		"Clippers, Trimmers and Shavers"
	],

	"Boys_Clothing":[
		"New In",
		"Accessories",
		"Coats & Jackets",
		"Jeans",
		"Jumpers & Cardigans",
		"Nightwear & Slippers",
		"Onesies",
		"Outfits",
		"Shirts",
		"Suits",
		"Sweatshirts & Hoodies",
		"Swimwear",
		"Trousers & Shorts",
		"Underwear & Socks",
	],
	"Boys_Footwear":[
		"All Footwear",
		"Boots & Wellies",
		"Sandals & Flip-flops",
		"School Shoes",
		"Trainers & Pumps"
	],
	"Boys_School":[
		"Blazers & Coats",
		"Jumpers",
		"Polo Shirts",
		"Shirts",
		"Shoes & Trainers",
		"Shorts",
		"Sportswear",
		"Sweatshirts",
		"Trousers",
		"Underwear & Socks"
	],
	"Boys_Collections":[
		"Winter Warmers"
	],

	"Boys_Shop by":[
		"Last Chance to Buy"
	],
	"Boys_Character":[
		"Character Shop"
	],
	"Boys_Kids Home":[
		"Furniture",
		"Dining",
		"Bedroom",
		"Wooden Toys"
	],

	"Girls_Clothing":[
		"New In",
		"Accessories",
		"Coats & Jackets",
		"Dancewear",
		"Dresses & Outfits",
		"Fancy Dress",
		"Jeans",
		"Jumpers & Cardigans",
		"Leggings",
		"Nightwear & Slippers",
		"Onesies",
		"Playsuits & Jumpsuits",
		"Skirts",
		"Sweatshirts & Hoodies",
		"Swimwear",
		"Tops",
		"Trousers & Shorts",
		"Underwear & Socks"

	],
	"Girls_Footwear":[
		"All Footwear",
		"Boots & Wellies",
		"Sandals & Flip-flops",
		"School Shoes",
		"Shoes",
		"Trainers & Pumps",
		
	],
	"Girls_School":[
		"Accessories",
		"Blazers & Coats",
		"Dancewear",
		"Gingham Dresses",
		"Jumpers and Cardigans",
		"Pinafores",
		"Polo Shirts",
		"Shirts and Blouses",
		"Shoes & Trainers",
		"Shorts",
		"Skirts",
		"Sportswear",
		"Sweatshirts",
		"Trousers",
		"Underwear & Socks"
	],
	"Girls_Collections":[
		"Frozen",
		"One Direction",
		"Winter Warmers"
	],

	"Girls_Shop by":[
		"Last Chance to Buy"
	],
	"Girls_Character":[
		"Character Shop"
	],
	"Girls_Kids Home":[
		"Furniture",
		"Dining",
		"Bedroom",
		"Wooden Toys"
	],

	"Baby_New In":[
		"New In",
		"Last Chance to Buy"
	],
	"Baby_New Baby":[
		"All in Ones & Outfits",
		"Bodysuits",
		"Hospital List",
		"Sleepsuits",
		"Starter Packs",
	],
	"Baby_Baby Accessories":[
		"Shoes",
		"Bibs & Muslim Squares",
		"Blankets & Shawls",
		"Sleeping Bags",
		"Socks & Tights"
	],
	"Baby_Boys":[
		"Accessories",
		"All in Ones",
		"Bodysuits",
		"Coats & Pramsuits",
		"Cardigans & Jumpers",
		"Outfits",
		"Sleepsuits & Pyjamas",
		"Swimwear",
		"Tops",
		"Trousers & Jeans"
	],
	"Baby_Girls":[
		"Accessories",
		"All in Ones",
		"Bodysuits",
		"Coats & Pramsuits",
		"Dresses and Outfits",
		"Cardigans & Jumpers",
		"Leggings & Jeans",
		"Sleepsuits & Pyjamas",
		"Socks and Tights",
		"Swimwear",
		"Tops",
	],
	
	"Baby_Collections":[
		"Character Shop",
		"Dreamskin",
		"Fancy Dress",
		"Premature",
		"Winter Warmers"
	],

	"Baby_Nursery":[
		"Bedding & Blankets",
		"Changing Units",
		"Cots & Matresses",
		"Nursery Decor",
		"Nursing Chairs",
		"Towels",
		"Wardrobes"
	],

	"School_Accessories":[
		"Lunch Boxes & Bottles",
		"School Bags",
		"Stationery & Craft"
	]

};

var IMG_CAT={

	"Accessories":[
		"image1.png",
		"image2.png",
		"image3.png",
		"image4.png",
	]
};