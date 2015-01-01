
var currentCategory="";
var currentSubCategory="";
var currentSelection="";

var CAT={

	"Home and Garden":[
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

var items= [
    {
		"name": "Acid Wash Jeggings",
		"mainCategory": "Womens",
		"subCategory": "Jeans",
		"type": "bottom",
		"price": "£10.00",
		"images": [
			{
				"front": "images/stock/womens/bottom/Acid%20Wash%20Jeggings/front.png",
				"back": "images/stock/womens/bottom/Acid%20Wash%20Jeggings/back.png"
			}
		],
		"colour": "Navy",
		"description": [
			{
				"content":"We’re all for that grunge, messy hair look this season and with these acid wash jeggings you’re sure to be half way there. The perfect pick for an edgy new staple that will transform every look into a style statement instantly, you’re sure to adore these.",
				"type":"paragraph"
			},
			{
				"content":"Elasticated waistband",
				"type":"bullet"
			}
		],
		"fabric": "70% Cotton, 25% Polyester, 5% Elastane",
		"productCode": "4929029"
	},
	{
		"name": "Jeggings",
		"mainCategory": "Womens",
		"subCategory": "Jeans",
		"type": "bottom",
		"price": "£12.00",
		"images": [
			{
				"front": "images/stock/womens/bottom/Jeggings/front.png",
				"close": "images/stock/womens/bottom/Jeggings/close.png"
			}
		],
		"colour": "Black",
		"description": [
			{
				"content":"Go for a stylish staple you’ll be wearing year-round with these great jeggings. Crafted with soft fabric and featuring an elasticated waistband, these are a comfy alternative to jeans that you’re sure to adore. ",
				"type":"paragraph"
			},
			{
				"content":"Twin back pockets",
				"type":"bullet"
			},
			{
				"content":"Elasticated waistband",
				"type":"bullet"
			}
		],
		"fabric": "72% Cotton, 25% Polyester, 3% Elastane",
		"productCode": "4869167"
	},
	{
		"name": "Skinny Jeans",
		"mainCategory": "Womens",
		"subCategory": "Jeans",
		"type": "bottom",
		"price": "£8.00",
		"images": [
			{
				"front": "images/stock/womens/bottom/Skinny%20Jeans/front.png",
				"back": "images/stock/womens/bottom/Skinny%20Jeans/back.png"
			}
		],
		"colour": "Navy",
		"description": [
			{
				"content":"Bound to become your keep-forever favourites, these skinny jeans are a stylish must-have. With a versatile design and a flattering fit, these are an indispensable staple you’ll be wearing time and again. ",
				"type":"paragraph"
			},
			{
				"content":"Zip and button fly fastening",
				"type":"bullet"
			},
			{
				"content":"Twin front and back pockets",
				"type":"bullet"
			}
		],
		"fabric": "80% Cotton, 19% Polyester, 1% Elastane",
		"productCode": "4868138"
	},
	{
		"name": "Floral Chiffon Wrap Blouse",
		"mainCategory": "Womens",
		"subCategory": "Blouses & Shirts",
		"type": "top",
		"price": "£12.00",
		"images": [
			{
				"front": "images/stock/womens/bottom/Floral%20Chiffon%20Wrap%20Blouse/front.png",
				"back": "images/stock/womens/bottom/Floral%20Chiffon%20Wrap%20Blouse/back.png"
			}
		],
		"colour": "Multi",
		"description": [
			{
				"content":"Give your formal wardrobe a wonderful update with this floral chiffon wrap blouse. Crafted with light fabric, this piece is a stunning fusion of comfort and style that will take you from your desk to the dancefloor time and again. ",
				"type":"paragraph"
			},
			{
				"content":"Elasticated waistband",
				"type":"bullet"
			},
			{
				"content":"Long sleeve",
				"type":"bullet"
			}
		],
		"fabric": "Outer: 100% Polyester Inner: 95% Viscose, 5% Elastane",
		"productCode": "4943984"
	},
	{
		"name": "Crochet Shoulder Blouse",
		"mainCategory": "Womens",
		"subCategory": "Blouse",
		"type": "top",
		"price": "£14.00",
		"images": [
			{
				"front": "images/stock/womens/bottom/Crochet%20Shoulder%20Blouse/front.png",
				"back": "images/stock/womens/bottom/Crochet%20Shoulder%20Blouse/back.png",
				"close": "images/stock/womens/bottom/Crochet%20Shoulder%20Blouse/close.png"
			}
		],
		"colour": "Cream",
		"description": [
			{
				"content":"Invest in this gently unique crochet shoulder blouse this season. This lovely piece will add a delightful touch to every look and will work in perfect harmony with your formal outfits. Team with one of our camisole vests to complete the look.",
				"type":"paragraph"
			},
			{
				"content":"Button through fastening",
				"type":"bullet"
			},
			{
				"content":"Long sleeve",
				"type":"bullet"
			}
		],
		"fabric": "Main body: 100% Polyester Trim: 100% Cotton",
		"productCode": "4931794"
	},
	{
		"name": "Turn-up Sleeve Blouse",
		"mainCategory": "Womens",
		"subCategory": "Blouse",
		"type": "top",
		"price": "£10.00",
		"images": [
			{
				"front": "images/stock/womens/bottom/Turn-up Sleeve Blouse/front.png",
				"back": "images/stock/womens/bottom/Turn-up Sleeve Blouse/back.png"
			}
		],
		"colour": "Red",
		"description": [
			{
				"content":"Infuse some colour into your formal wardrobe with this stunning turn-up sleeve blouse this season. This versatile piece is guaranteed to become your go-to for an instant fashion fix.",
				"type":"paragraph"
			},
			{
				"content":"Dipped hem",
				"type":"bullet"
			},
			{
				"content":"V-neck",
				"type":"bullet"
			}
		],
		"fabric": "100% Polyester",
		"productCode": "4929704"
	},
	{
		"name": "Butterfly Sweater",
		"mainCategory": "Womens",
		"subCategory": "Jumpers & Cardigans",
		"type": "top",
		"price": "£10.00",
		"images": [
			{
				"front": "images/stock/womens/bottom/Butterfly%20Sweater/front.png",
				"back": "images/stock/womens/bottom/Butterfly%20Sweater/back.png"
			}
		],
		"colour": "Multi",
		"description": [
			{
				"content":"Go for an ethereal feel with this lovely butterfly sweater this winter. Crafted using soft fabric to keep you warm and with a pretty butterfly design, you’ll be completing your casual looks with this again and again. ",
				"type":"paragraph"
			},
			{
				"content":"Long sleeve",
				"type":"bullet"
			}
		],
		"fabric": "67% Cotton, 29% Polyester, 4% Elastane",
		"productCode": "4941316"
	},
	{
		"name": "Tunic Dress",
		"mainCategory": "Womens",
		"subCategory": "Dresses",
		"type": "top",
		"price": "£8.00",
		"images": [
			{
				"front": "images/stock/womens/bottom/Tunic%20Dress/front.png",
				"back": "images/stock/womens/bottom/Tunic%20Dress/back.png"
			}
		],
		"colour": "Black",
		"description": [
			{
				"content":"This minimalist tunic dress is the perfect, eminently wearable staple. Ideal for acing that layered look or as a comfy and stylish foundation, you’ll be wearing this piece time and again. ",
				"type":"paragraph"
			},
			{
				"content":"Cropped sleeve",
				"type":"bullet"
			},
			{
				"content":"Length: 33½ Inches / 85cm",
				"type":"bullet"
			}
		],
		"fabric": "95% Viscose, 5% Elastane",
		"productCode": "4897338"
	},
	{
		"name": "Longline Cardigan",
		"mainCategory": "Womens",
		"subCategory": "Jumpers & Cardigan",
		"type": "top",
		"price": "£14.00",
		"images": [
			{
				"front": "images/stock/womens/bottom/Longline%20Cardigan/front.png",
				"back": "images/stock/womens/bottom/Longline%20Cardigan/back.png"
			}
		],
		"colour": "Navy",
		"description": [
			{
				"content":"Cover up in warm and wonderful style this season with this eminently wearable longline cardigan. Created with soft fabric, this versatile piece is perfect for adding a little cosiness to your everyday outfits.",
				"type":"paragraph"
			},
			{
				"content":"Twin front pockets",
				"type":"bullet"
			},
			{
				"content":"Long sleeve",
				"type":"bullet"
			},
			{
				"content":"Open front",
				"type":"bullet"
			}
		],
		"fabric": "30% Nylon, 30% Polyester, 20% Cotton, 20% Viscose",
		"productCode": "4890728"
	},
	{
		"name": "Tube Skirt",
		"mainCategory": "Womens",
		"subCategory": "Skirt",
		"type": "bottom",
		"price": "£5.00",
		"images": [
			{
				"front": "images/stock/womens/bottom/Tube%20Skirt/front.png"
			}
		],
		"colour": "Black",
		"description": [
			{
				"content":"For a cute and trendy new staple, invest in this wonderful tube skirt. With a versatile design and figure hugging cut, this piece is sure to become your go-to for completing your outfits.",
				"type":"paragraph"
			},
			{
				"content":"Elasticated waistband",
				"type":"bullet"
			},
			{
				"content":"Length: 14½ Inches / 37cm",
				"type":"bullet"
			}
		],
		"fabric": "96% Cotton, 4% Elastane",
		"productCode": "4977698"
	},
	{
		"name": "Aztec Print Shorts",
		"mainCategory": "Womens",
		"subCategory": "Trousers & Shorts",
		"type": "bottom",
		"price": "£6.00",
		"images": [
			{
				"front": "images/stock/womens/bottom/Aztec%20Print%20Shorts/front.png"
			}
		],
		"colour": "Multi",
		"description": [
			{
				"content":"Day to night, these Aztec print shorts will transform both your formal and casual looks effortlessly. With an elasticated waistband and light fabric, these are a comfy staple you’ll be able to wear time and again.",
				"type":"paragraph"
			},
			{
				"content":"Elasticated waistband",
				"type":"bullet"
			}
		],
		"fabric": "96% Viscose, 4% Elastane",
		"productCode": "4949187"
	}
	
];
