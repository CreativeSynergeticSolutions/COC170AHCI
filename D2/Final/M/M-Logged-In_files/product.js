/* JS functions specific to George's site */
var appGerogeSelectedVariant;
var errorMessageShown = false;

(function(app){
	if (app) {
		// add Product namespace to app namespace
		app.Product = function(response) {
			// product private data

			// product json data
			var model 			= response.data;
			if (model.variant == false && model.master==false && model.productSet==false) {
			thisProduct = model;
			}
			// div cotainer id
			var myContainerId	= "";

			// boolean flag to track the variants data request, reset in loadVariants() when the variants data is loaded
			var isLoadingVar	= false;

			// helper function to load variants data from the server
			// once the data is retrieved, it fires VariationsLoaded event so that UI can be refreshed appropriately
			var loadVariants	= function(thisProduct) {
				isLoadingVar = true;
				// build the url and load variants data
				app.ajax.getJson({
					url		: app.URLs.getVariants,
					data	: {"pid": thisProduct.pid, "format": "json"},
					callback: function(data){

						if (!data || !data.variations || !data.variations.variants) {
							return;
						}
						model.variations.variants = data.variations.variants;
						isLoadingVar = false; // we have loaded the variants
						thisProduct.varAttrSelected({data: {id: '', val: ''}});
						jQuery(thisProduct).trigger("VariationsLoaded");
					}
				});
			}

			// helper function to load variants data from the server
			// once the data is retrieved, it fires VariationsLoaded event so that UI can be refreshed appropriately
			var loadFitsme	= function(thisProduct) {
				isLoadingVar = true;
				// build the url and load variants data
				app.ajax.getJson({
					url		: app.URLs.getFitsme,
					data	: {"pid": thisProduct.pid, "colour": jQuery("#colour").val(), "format": "json"},
					callback: function(data){
						if (!data) {
							return;
						}
						data.SelectSize = function(sizeId) {
							if(sizeId != undefined) {
								jQuery('#size option[value="' + sizeId + '"]:not(:disabled)').attr("selected", "selected");
								jQuery('#size').trigger('change');
							}
						};
						FitsMeData = data;
						isLoadingVar = false; // we have loaded the variants
						return;
					}
				});
			}

			// helper function to reload availability data.
			// by default, availability data is based on a quantity of 1.
			// if a customer changes the quantity, use this method
			// to reload the availability based on the new quantity.
			var reloadAvailability = function(thisProduct, quantity) {
				var id = ((thisProduct.master || thisProduct.variant) ? thisProduct.selectedVar.id : thisProduct.pid);

				app.ajax.getJson({
					url		: app.URLs.getAvailability,
					data	: {"pid": id, "Quantity": quantity, "format": "json"},
					callback: function(data){

						if (!data || !data.avLevels) {
							return;
						}

						// update the data in the variant
						if (thisProduct.master || thisProduct.variant) {
							thisProduct.selectedVar.avLevels = data.avLevels;
							thisProduct.selectedVar.avStatusQuantity = data.avStatusQuantity;
						} else {
							model.avLevels = data.avLevels;
							model.avStatusQuantity = data.avStatusQuantity;
						}

						var availability = thisProduct.callCreateAvMessage(thisProduct, data.avStatusQuantity);
						if(thisProduct.productSetProduct || thisProduct.subProducts.length > 0) {
							//thisProduct.callCalculateCartTotal();
						}

						var actuallyAvailableItems = availability.backOrderLevel + availability.inStockLevel + availability.preOrderLevel;
						thisProduct.showUpdatedPrice(thisProduct.getPrice(), null, null, actuallyAvailableItems);

						$('form.jNice').form();
					}
				});

			}

			/**
			 * Checks is there only only available variant size or 0;
			 */
			var checkIsThereOnlyOneAvailableVariabt = function( variants ) {
				var firstAvailableVariant = null;
				var currentAvailableVariant = null;
				var iteration = 0;
				for (var i=0; i < variants.length ; i++) {
					var variant = variants[i];
					if( (variant.inBackorder || variant.inStock) && variant.ATS > 0) {
						if(firstAvailableVariant == null) {
							firstAvailableVariant = iteration;
						}
						currentAvailableVariant = iteration;
					}
					iteration++;
				}
				if(firstAvailableVariant == null) {
					return 0;
				}

				if(firstAvailableVariant == currentAvailableVariant) {
					return variants[currentAvailableVariant].attributes.size;
				}

				return 0;
			}

			// build the tooltip string for non selected variations
			var getNonSelectedTooltip = function(nonSelectedVars) {
				var tooltipStr = '';
				var nsLen = nonSelectedVars.length;

					for (var i = (nsLen-1); i >= 0; i--) {

						tooltipStr += nonSelectedVars[i];

						if (i != 0)
						{
							tooltipStr += ", ";
						}
					}

				return tooltipStr;
			}

			// returns the aggregate available to sell value
			// from all variants
			var getATS = function(variants) {
				var atsCount = 0;
				for (var i=0; i<variants.length; i++) {
					variant = variants[i];
					if (variant.ATS > 0) {
						atsCount = atsCount + variant.ATS;
					}
				}
				return atsCount;
			}

			/**
			 * Private. Computes price of a given product instance based on the selected options.
			 *
			 * @param thisProduct - the product instance
			 * @return price of the product to 2 decimal points.
			 */
			var computePrice = function(thisProduct) {
				var price = thisProduct.selectedVar != null ? thisProduct.selectedVar.pricing.sale : model.pricing.sale;
				if (!thisProduct.variant && !thisProduct.master) {
					return price;
				}
				// calculate price based on the selected options prices
				jQuery.each(thisProduct.selectedPrice, function(){
					price = (new Number(price) + new Number(this)).toFixed(2);
				});
				return price;
			}

			// bind qty box keyup handler
			// the handler grabs the value and updates
			// product.selectedOption.Quantity
			// show the updated availabilty message in case the available qty is different than available etc.
			// trigger CalculateCartTotal event
			var getQtyBox = function(thisProduct) {
				jQuery(thisProduct.containerId+" .quantityinput:last").change(function(e){
					var val = null;

					try {
						val = parseInt(jQuery(thisProduct.containerId+" .quantityinput:last").val());
					} catch(e){
						val = null
					};

					if (val) {
						thisProduct.selectedOptions.Quantity = val;

						// if the product has variations check for non selected ones and display missing value
						if (model.variations != undefined) {
							var nonSelectedVars = [];

							// get the non-selected variations
							jQuery.each(model.variations.attributes, function(){
								if (!thisProduct.selectedVarAttribs[this.id] || thisProduct.selectedVarAttribs[this.id] == "" ) {
									nonSelectedVars.push(this.name);
								}
							});

							if (nonSelectedVars.length > 0) {
								// make sure there is something to sell
								var atsCount = getATS(model.variations.variants);
								if (atsCount == 0) {
									return;
								}
								var tooltipStr = getNonSelectedTooltip(nonSelectedVars);
								var missingMsg = jQuery.format("Please enter {0}", tooltipStr);
								return;
							}
						}

						// If the quantity value is different than
						// when we loaded the availability data, then
						// refresh availability data for this variant
						if (val != thisProduct.getAvailabilityQty()) {
							$(document).trigger('app.geroge.updateProductQuantity');
							thisProduct.showUpdatedPrice(thisProduct.getPrice(), null, null, val);
							jQuery(thisProduct).trigger("CalculateCartTotal");
						} else {
							jQuery(thisProduct).trigger("CalculateCartTotal");
							price = val * thisProduct.getPrice();
							thisProduct.showUpdatedPrice(thisProduct.getPrice(), null, null, val);
						}
					}
				});

				// grab the currently displayed value basically the initial displayed value
				thisProduct.selectedOptions.Quantity = jQuery(thisProduct.containerId+" .quantityinput:last").val();
			}

			// binds A2C button click handler
			var getAddToCartBtn = function(thisProduct) {
				var addToCartBtn = jQuery(thisProduct.containerId+" .addToBasket input[name=addProduct]").click(function(e) {
					var isSetClothing = (jQuery('[data-id="setClothing"]').length != 0);
					if (model.master || model.variant) {
						if (thisProduct.selectedVar == null) {
							if (model.variations != undefined) {
								var nonSelectedVars = [];

								// get the non-selected variations
								jQuery.each(model.variations.attributes, function(){
									if (!thisProduct.selectedVarAttribs[this.id] || thisProduct.selectedVarAttribs[this.id] == "" ) {
										nonSelectedVars.push(this.name);
									}
								});

								if (nonSelectedVars.length > 0) {
									if ( model.productSetProduct && model.template == "george_home" ) {
										var tooltipStr = getNonSelectedTooltip(nonSelectedVars);
										var errorMsg = jQuery.format("Select a product {0} and Quantity before adding to Basket", tooltipStr);
										jQuery(thisProduct.containerId +' .errorMessage').html(errorMsg);
										jQuery(thisProduct.containerId +' .errorMessage').show();
										var container = jQuery("#ModalContent .jspContainer").first();
										var errorMessageHeight = jQuery(thisProduct.containerId +' .errorMessage').parent().height();
										var containerHeight = container.height();
										if(containerHeight + errorMessageHeight <= mbH && !errorMessageShown) {
											container.css("height", containerHeight + errorMessageHeight);
											thisProduct.disableA2CButton();
											errorMessageShown = true;
										}
									}
									else {
										var tooltipStr = getNonSelectedTooltip(nonSelectedVars);
										var errorMsg = jQuery.format("Select a product {0} and Quantity before adding to Basket", tooltipStr);
										if (isSetClothing) {
											jQuery(thisProduct.containerId +' .errorMessage').html(errorMsg);
											jQuery(thisProduct.containerId +' .errorMessage').removeClass('hidden');
											jQuery(thisProduct.containerId +' .errorMessage').show();
										} else {
											jQuery('.errorMessage:last').html(errorMsg);
											jQuery('.errorMessage:last').show();
										}
										var container = jQuery("#ModalContent .jspContainer").first();
										var errorMessageHeight = jQuery('.errorMessage:last').parent().height();
										var containerHeight = container.height();
										if(containerHeight + errorMessageHeight <= mbH && !errorMessageShown) {
											container.css("height", containerHeight + errorMessageHeight);
											thisProduct.disableA2CButton();
											errorMessageShown = true;
										}
									}
									e.preventDefault();
								}
								else
								{
									if ( model.productSetProduct && model.template == "george_home" ) {
										jQuery(thisProduct.containerId +' .errorMessage').hide(100);
									}
									else {
										jQuery('.errorMessage:last').hide(100);
									}
								}
							}

							e.preventDefault();
						}
						else if (thisProduct.getPrice() <= 0) {
							thisProduct.disableA2CButton();
							e.preventDefault();
						}

						// it is necessary to update the option id to be variant-specific
						jQuery(thisProduct.containerId+" .product_options:last select").each(function(){
							 var value = thisProduct.selectedOptions[this.id];
							 var newId = this.id.replace(thisProduct.pid, thisProduct.selectedVar.id);
							 thisProduct.selectedOptions[newId] = value;
							 delete thisProduct.selectedOptions[this.id];
							});

						if (thisProduct.selectedVar != null) {
							thisProduct.selectedOptions.pid = thisProduct.selectedVar.id;
							thisProduct.selectedOptions.masterPid = thisProduct.pid;
						}

					}
					else {
						// check if we are adding a bundle/productset to the cart
						if (model.bundle || model.productSet) {
							var subProducts = thisProduct.subProducts;
							var comma 		= ",";
							var tempQty 	= "";
							var subproduct 	= null;
							var notSelectedSubProducts = 0;

							thisProduct.selectedOptions.childPids = "";

							if (model.productSet) {
								thisProduct.selectedOptions.Quantity = "";
								//Get product set error msg from properties file or set default.
								var errorProductSetMsg = defaultProductSetErrorMsg || 'Select at least one product before adding to Basket';
								jQuery('.errorMessage:last').html(errorProductSetMsg);
							}

							// process each individual products in the set/bundle
							// and prepare product.selectedOptions for final submission
							for (var i = 0; i < subProducts.length; i++) {
								subproduct = subProducts[i];
								if (!subproduct.selected) {
									notSelectedSubProducts++;
									continue;
								}

								// see if any of the sub products are variations, if so then get the selected variation id
								// from selectedVar property and make it a comma separated list
								if (subproduct.variant || subproduct.master) {
									if (subproduct.selectedVar == null) {
										e.preventDefault();
									}
									thisProduct.selectedOptions.childPids += subproduct.selectedVar.id+comma;
								}
								else {
									thisProduct.selectedOptions.childPids += subproduct.pid+comma;
								}

								var tempPid = subproduct.selectedOptions.pid;
								subproduct.selectedOptions.pid = null;
								// merge selected options of sub product with the main product
								thisProduct.selectedOptions = jQuery.extend({}, thisProduct.selectedOptions, subproduct.selectedOptions);
								subproduct.selectedOptions.pid = tempPid;

								// if it is a product set then sub products can have their separate qty
								if (model.productSet) {
									tempQty += subproduct.selectedOptions.Quantity+comma;
								}
							}

							if ( notSelectedSubProducts == subProducts.length && !model.bundle )
							{
								jQuery('.errorMessage:last').show(100);
								e.preventDefault();
							}
						}

						// if it is a product set then sub products can have their separate qty
						// tempQty is a comma separated list of qty for each product in the set
						if (model.productSet) {
							thisProduct.selectedOptions.Quantity = tempQty;
							var q = thisProduct.selectedOptions.Quantity;
							var pids = thisProduct.selectedOptions.childPids;

							if(q.substr(q.length - 1, q.length) == ',')
								thisProduct.selectedOptions.Quantity = q.substr(0, q.length-1);
							if(pids.substr(pids.length - 1, pids.length) == ',')
								thisProduct.selectedOptions.selectedPids = pids.substr(0, pids.length-1);
						}

						// make sure the pid which gets submitted is for the main product
						thisProduct.selectedOptions.pid = thisProduct.pid;
					}

					if (!model.productSet || model.bundle) {
						// grab the user entered qty
						thisProduct.selectedOptions.Quantity = jQuery(thisProduct.containerId+" .quantityinput:last").val();
						thisProduct.selectedOptions.selectedPids = thisProduct.selectedOptions.pid;
					}

					if ( model.productSetProduct && model.template == "george_home" ) {
						if ( model.master || model.variant) {

						}
						else {
							if ( thisProduct.selectedOptions.Quantity <= 0 || $.trim(thisProduct.selectedOptions.Quantity) == '' ) {
								//Get product set error msg from properties file or set default.
								var errorProductSetMsg = defaultProductQuantityErrorMsg || 'Select a product Quantity before adding to Basket';
								jQuery(thisProduct.containerId +' .errorMessage').html(errorProductSetMsg);
								jQuery(thisProduct.containerId +' .errorMessage').show(100);
							}
							else
							{
								jQuery(thisProduct.containerId +' .errorMessage:last').hide(100);
							}
						}
					}

					// if it is not a productset then make sure qty is specified greater than 0
					if (model.productSet || thisProduct.selectedOptions.Quantity > 0) {
						app.minicart.add(thisProduct.selectedOptions, thisProduct.containerId);
					}
					e.preventDefault();
				} );

				return addToCartBtn;
			}

			var checkVariationOptionSelected = function(containerId, selectElemName) {
				obj = jQuery(containerId + " .options div."+selectElemName+" select");
				if(obj.val() == "" || obj.val() == "-" || obj.val() == undefined) {
					return false;
				} else {
					return true;
				}
			}

			var variationOptionExists = function(containerId, selectElemName) {
				obj = jQuery(containerId + " .options div."+selectElemName+" select");
				return obj.val() != undefined;
			}

			var changePrice = function (containerId, product, e) {
				var currentPriceHtmlElement =  $(containerId+ ' .productPrice');
				product = product.selectedVar != null ? product.selectedVar : product;

				if ($(containerId).data('copiedthepricehtml') == null) {
					$(containerId).data('copiedthepricehtml', $(containerId+ ' .productPrice').html());
				}

				if (product != null && product.pricing != undefined) {

					var sale = Number(product.pricing.sale);
					var standard = Number(product.pricing.standard);
					var save = Number(standard - sale);
					var currentPriceHtml = '';

					if (sale == standard && ( (jQuery(containerId + " .options div.size select option:selected").val() != "" && thisProduct.template != 'george_home') || thisProduct.template == 'george_home' )) {
						currentPriceHtml =  '<span class="pounds">'+
												'<span class="currency">&#163;</span>'+
												 standard.toFixed(2)+
											'</span>';
						
    currentPriceHtml= $(currentPriceHtml);
    
    //Change the position of wasPrice
    currentPriceHtml.find('.newPrice').after(currentPriceHtml.find('.wasPriceFrom, .wasPrice'));
    
    currentPriceHtmlElement.html(currentPriceHtml);
					}
					else {

						if(model.productSetProduct) {
						currentPriceHtml =  '<div class="bothPrices">'+
												'<span class="wasPriceHolder">'+
													'<span class="wasPriceFrom">Was </span>'+
													'<span class="wasPrice">'+
														'<span class="currency">&#163;</span>'+
														standard.toFixed(2)+
													'</span>'+
												'</span>'+
												'<span class="newPriceHolder">'+
													'<span class="nowPriceFrom">Now </span>'+
													'<span class="newPrice">'+
														'<span class="currency">&#163;</span>'+
														sale.toFixed(2)+
													'</span>'+
												'</span>'+
												'<span class="savedPriceHolder">'+
													'<span class="savedPriceLabel">&nbsp;Save&nbsp;</span>'+
													'<span class="savedPrice">'+
														'<span class="currency">&#163;</span>'+
														save.toFixed(2)+
													'</span>'+
												'</span>'+
											'</div>';
						} else {
							if(thisProduct.template == 'george_home') {
								currentPriceHtml ='<span class="productPrice">'+
														'<span class="wasPriceFrom">Was  </span><span class="wasPrice"><span class="currency">&#163;</span>'+
														standard.toFixed(2)+
													'</span>'+
														'<br>'+
									            	'<span class="nowPriceFrom">Now  </span><span class="newPrice"><span class="currency">&#163;</span>'+
									            		sale.toFixed(2)+
									            	'</span>'+
										        	'<span class="savedPriceHolder">'+
										        		'<span class="savedPriceLabel">&nbsp;Save&nbsp;</span>'+
											        		'<span class="savedPrice">'+
											        			'<span class="currency">&#163;</span>'+
											        			save.toFixed(2)+
											        		'</span>'+
										        		'</span>'+
										        	'</span>';
							} else {
								if(jQuery(containerId + " .options div.size select option:selected").val() != "") {
									currentPriceHtml =  '<span class="wasPriceFrom">Was </span><span class="wasPrice">&#163;'+
															standard.toFixed(2)+
														'</span>'+
										            	'<span class="nowPriceFrom"> Now </span><span class="newPrice">&#163;'+
										            		sale.toFixed(2)+
										            	'</span>';
								}
							}
						}
						if((thisProduct.template != 'george_home' && jQuery(containerId + " .options div.size select option:selected").val() != "") || thisProduct.template == 'george_home' ) {
							
    currentPriceHtml= $(currentPriceHtml);
    
    //Change the position of wasPrice
    currentPriceHtml.find('.newPrice').after(currentPriceHtml.find('.wasPriceFrom, .wasPrice'));
    
    currentPriceHtmlElement.html(currentPriceHtml);
						}
					}
				}
				else {
					if(thisProduct.template == 'george_home') {
						currentPriceHtmlElement.html($(containerId).data('copiedthepricehtml'));
					}
				}
			}

			var backorderHandling = function (containerId, product) {

				var ats = (product.ATS) === undefined ? product.getATS() : product.ATS ;

				if ( product != null && product.inBackorder && ats > 0 ) {

					var inStockDate = new Date(Date.parse(product.inStockDate));
					var formattedDate = inStockDate.getDate() + '/' + (inStockDate.getMonth() + 1) + '/' +  inStockDate.getFullYear();
					var backorderMsg = app.resources["BACKORDER_WITH_ALLOCATION"] + ' ' + formattedDate;

					jQuery(containerId + ' .backorderMessage:last').html(backorderMsg).show();
				}
				else {
					jQuery(containerId + ' .backorderMessage:last').hide(100);
				}
			}

			var toggleVarOptionCombos = function(containerId, product) {

				if(product != undefined) {
					thisProduct = product;
				}

				sizeCombo = jQuery(containerId + " .options div.size select");
				quantityCombo = jQuery(containerId + " .options div.quantity select");

				var colourComboExists = variationOptionExists(containerId, 'colour');
				var colourComboSelected = checkVariationOptionSelected(containerId, 'colour');
				var sizeComboExists = variationOptionExists(containerId, 'size');
				var sizeComboSelected = checkVariationOptionSelected(containerId, 'size');

				if(thisProduct.template == "george_home") {

					var variations = [];
					var isVariationOptionsSelected = false;

					if (thisProduct.productSetProduct) {
						jQuery(containerId+" .options .variantdropdown").each(function(){
							var classes = jQuery.trim($(this).attr('class'));
							var lastClass = classes.substring(classes.lastIndexOf(" ")+1);
							variations.push(lastClass);
						});
					}
					else {
						jQuery(".options .variantdropdown").each(function(){
							var classes = jQuery.trim($(this).attr('class'));
							var lastClass = classes.substring(classes.lastIndexOf(" ")+1);
							variations.push(lastClass);
						});
					}

					jQuery.each(variations, function(key, value) {
						isVariationOptionsSelected = checkVariationOptionSelected(containerId, value);
					});

					if (sizeCombo.length > 0) {
						if (jQuery.inArray( "colour", variations ) != "-1" && !checkVariationOptionSelected(containerId, 'colour')) {
							thisProduct.selectedVarAttribs['size'] = null;
							sizeCombo[0].options[0].selected = true;
							sizeCombo.attr("disabled","true");
						} else {
							// remove current selection
							sizeCombo.removeAttr("disabled");
							sizeCombo.parent().removeClass("ui-state-disabled");
						}
					}

					if (jQuery(containerId + " .options div.quantity").hasClass('outOfStockLine')) {
						quantityCombo[0].options[0].selected = true;

						quantityCombo.empty();
						var options = "";
						options += '<option value="-">-</option>';
						quantityCombo.append(options);
						quantityCombo.val("-");

						quantityCombo.attr("disabled","true");
					}
					else {
						if(isVariationOptionsSelected || variations.length == 0) {
							quantityCombo.removeAttr("disabled");
							quantityCombo.parent().removeClass("ui-state-disabled");
						} else {
							quantityCombo[0].options[0].selected = true;

							quantityCombo.empty();
							var options = "";
							options += '<option value="-">-</option>';
							quantityCombo.append(options);
							quantityCombo.val("-");

							quantityCombo.attr("disabled","true");
						}
					}
				}
				else if (thisProduct.template == "default") {
					if(sizeComboExists && !sizeComboSelected && model.variations.variants != undefined) {
						var options = jQuery(containerId + " .options div.size select option").not("[value='']").map( function(){
							return {
								'value': jQuery(this).val(),
								'instock': ($(this).text().toString().indexOf(app.resources['SOLD_OUT']) === -1)
							};
						}).get();

						var recomendedSize = app.sizeSelectorHelper.checkSizes( options );

						if(recomendedSize !== false) {
							sizeComboSelected = app.ProductCache.selectSize(recomendedSize, containerId);
						}
					}

					if (!thisProduct.variant && !thisProduct.master && !thisProduct.productSet) {
						quantityCombo.removeAttr("disabled");
						quantityCombo.parent().removeClass("ui-state-disabled");
					} else {

						// Disable "size" drop-down only when "colour" drop-down exists but no colour has been selected
						var disableSizeCombo = colourComboExists && !colourComboSelected;
						// Disable "quantity" drop-down only when "colour" drop-down exists but no colour has been selected OR "size" drop-down exists but no size has been selected
						var disableQtyCombo = (colourComboExists && !colourComboSelected) || (sizeComboExists && !sizeComboSelected);

						if (disableSizeCombo && sizeComboExists) {
							thisProduct.selectedVarAttribs['size'] = null;
							sizeCombo[0].options[0].selected = true;
							sizeCombo.attr("disabled","true");
						} else {
							sizeCombo.removeAttr("disabled");
							sizeCombo.parent().removeClass("ui-state-disabled");
						}

						if (disableQtyCombo) {
							quantityCombo[0].options[0].selected = true;
							thisProduct.showUpdatedPrice(0);

							quantityCombo.empty();
							var options = "";
							options += '<option value="-">-</option>';
							quantityCombo.append(options);
							quantityCombo.val("-");

							quantityCombo.attr("disabled","true");
						} else {
							quantityCombo.removeAttr("disabled");
							quantityCombo.parent().removeClass("ui-state-disabled");
						}
					}
				}

				$('form.jNice').form();
			}

			var toggleQtyCombo = function(containerId) {
				qtyCombo = jQuery(containerId + " .options div.quantity select");
			}

			// based on availability status, creates a message
			// param val - the stock value to compare i.e. qty entered by user
			var createAvMessage = function(thisProduct, val) {

				var availabilityObj;
				var avStatus 	= thisProduct.getAvStatus(); // availability status
				var avMessage 	= app.resources[avStatus];
				var ats 		= thisProduct.getATS(); // get available to sell qty
				var avLevels	= thisProduct.getAvLevels();

				// get ats levels per-status
				var inStockLevel = avLevels[app.constants.AVAIL_STATUS_IN_STOCK];
				var backOrderLevel = avLevels[app.constants.AVAIL_STATUS_BACKORDER];

				var preOrderLevel = avLevels[app.constants.AVAIL_STATUS_PREORDER];
				var notAvailLevel = avLevels[app.constants.AVAIL_STATUS_NOT_AVAILABLE];
				if (val > inStockLevel && avStatus !== app.constants.AVAIL_STATUS_NOT_AVAILABLE) {

					avMessage = "";
					if (val > inStockLevel) {
						avMessage = jQuery.format(app.resources["QTY_"+app.constants.AVAIL_STATUS_IN_STOCK], inStockLevel);
					}
				}
				availabilityObj = {"avStatus": avStatus, "avMessage": avMessage, "ats": ats, "avLevels": avLevels, "inStockLevel": inStockLevel, "backOrderLevel": backOrderLevel, "preOrderLevel": preOrderLevel, "notAvailLevel": notAvailLevel};
				return availabilityObj;
			}

			// Product instance
			return {
				pid					: model.ID,
				masterID            : model.masterID,
				variant				: model.variant,
				master				: model.master,
				bundled				: model.bundled,
				selectedVarAttribs	: {}, // object containing variation attributes values as name value e.g. {color: "blue", size: "3", width: ""}
				selectedVar			: null, // currently selected variant
				selectedOptions		: {}, // holds currently selected options object {optionName, selected val}
				selectedPrice		: {}, // holds prices for selected options as {warranty: ""}
				containerId			: null, // holds the html container id of this product
				subProducts			: [], // array to keep sub products instances
				selected			: model.selected,
				productSet			: model.productSet,
				productSetProduct	: model.productSetProduct,
				template			: model.template,
				inStock				: model.inStock,
				inBackorder			: model.inBackorder,
				inStockDate 		: model.inStockDate,

				calculateDimentions : function (link) {
					var winSize = {x: window.innerWidth, y: window.innerHeight};
					var height = winSize.y > 790 ? 790 : (winSize.y < 400 ? 400 : winSize.y - 100 );
					var width = Math.round(height / 1.082); // this is the proportions of height/width of fullscreen image window.
					var href = jQuery(link).attr('href');
					var params = app.getUrlVars(href);
					href = href.split('?')[0] + '?';
					var counter = 0;
					for(key in params) {
						switch (key) {
							case 'length' :
								break;
							case 'width' :
								href += key + '=' + width;
								break;
							case 'height' :
								href += key + '=' + height;
								break;
							default:
								href += key + '=' + params[key];
								break;
						}

						href += counter < params.length - 1 ? '&' : '';
						counter ++;
					};

					jQuery(link).attr('href', href);
				},

				selectSize : function (sizeId, containerId) {
					if (sizeId.instock) {
						jQuery(containerId + ' #size option[value="' + sizeId.value + '"]:not(:disabled)').attr("selected", "selected");
						jQuery(containerId + ' #size').trigger("change");
						return true;
					} else {
						jQuery(containerId + ' #size option[value=""]').attr("selected", "selected");
						var qtyCombo = jQuery(containerId + " .options div.quantity select");
						qtyCombo.empty();
						qtyCombo.append('<option value="-">-</option>');
						qtyCombo.val("-");
						qtyCombo.attr("disabled", "true");
						qtyCombo.parent().addClass("ui-state-disabled").addClass("ui-form-dropdown-container");
						return false;
					}
					return false;
				},

				selectProdToBuy:function() {
					this.selected = true;
				},

				unselectProdToBuy:function() {
					this.selected = false;
				},

				/**
				 * Enable 'Select Item' checkbox.
				 */
				enableItemSelectedChk: function() {
					this.selectProdToBuy();
					elemId = this.containerId+" #"+this.pid+"_selected:last";
					obj = jQuery(elemId);
					if(obj) {
						obj.removeAttr("disabled"); //check the checkbox
						obj.prop('checked', true);
						obj.closest('div').css('color', '#000');

						var checkBoxParent = jQuery(elemId).parent();
						checkBoxParent.find('.jNiceCheckbox:last').addClass('jNiceChecked');
						var uiElement = jQuery(elemId).next();
						if (uiElement.hasClass('ui-form-checkbox-unchecked'))
							uiElement.toggleClass('ui-form-checkbox-unchecked ui-form-checkbox-checked');
					}
				},

				/**
				 * Disable 'Select Item' checkbox.
				 */
				disableItemSelectedChk: function() {
					this.unselectProdToBuy();
					jQuery(this).trigger("CalculateCartTotal");
					elemId = this.containerId+" #"+this.pid+"_selected:last";
					obj = jQuery(elemId);
					if(obj) {
						obj.removeAttr('checked'); //uncheck the checkbox
						obj.attr("disabled", "true");
						obj.closest('div').css('font-weight', 'normal');

						var checkBoxParent = jQuery(elemId).parent();
						checkBoxParent.find('.jNiceCheckbox:last').removeClass('jNiceChecked');
						var uiElement = jQuery(elemId).next();
						if (uiElement.hasClass('ui-form-checkbox-checked')) {
							uiElement.toggleClass('ui-form-checkbox-checked ui-form-checkbox-unchecked');
					}
					}
				},

				callCreateAvMessage : function (thisProduct, val) {
					return createAvMessage(thisProduct, val);
				},

				/**
				 * Enable Add to Cart Button.
				 */
				enableA2CButton: function() {
					jQuery(this.containerId+" .addToBasket input[name='addProduct']").removeAttr("disabled");
					if(this.selectedVar != null && this.selectedVar.avStatus == "PREORDER"){
						jQuery(this.containerId+" .addToBasket input[name='addProduct']").addClass("preorder");
					}
					else{
						jQuery(this.containerId+" .addToBasket input[name='addProduct']").removeClass("preorder");
					}
				},

				/**
				 * Disable Add to Cart Button.
				 */
				disableA2CButton: function() {
					//We don't need to disable button, but we need the function for backward compatibility
					return;
					jQuery(this.containerId+" .addToBasket input[name='addProduct']").attr("disabled", "true");
				},

				getDefaultColour: function(e) {
					var defaultColour = '';

					jQuery.each(model.variations.variants, function() {
						if (this.defaultVariant == "true") {
							defaultColour = this.attributes.colour;
						}
					});

					return defaultColour;
				},

				/**
				* Event handler when a variation attribute is selected/deselected.
				*/
				varAttrSelected: function(e) {

					this.selectedVarAttribs[e.data.id] = e.data.val;
					var colourCombo = jQuery(this.containerId + " .options div.colour select");

					if ( ( e.data.id == 'colour') && ( !colourCombo.attr('disabled') ) && ( !colourCombo.attr('disabled') ) && jQuery('#quickBuyDialog').length < 1 ) {
						if( e.data.val != null ) {
							this.changeProductImgByVariationValue(e.data.val, this.containerId);
						} else {
							this.changeProductImgByVariationValue(this.getDefaultColour(), this.containerId);
						}
					}

					// if this is a deselection and user landed on a variant page then reset its variant flag
					// as now user has deselected an attribute thus making it essentially a master product view
					if (e.data.val == null && this.master) {
						this.variant = false;
					}

					// store this ref
					var that = this;

					// trigger update event which will update every other variation attribute i.e. enable/disable etc.

					// first reset the contents of each attribute display
					// when we have got the varriations data
					if (!isLoadingVar) {
						// find variants which match the current selection
						var selectedVarAttrVariants = (e.data.val != null) ? this.findVariations({id: e.data.id, val: e.data.val}): null;
						var selectedVarAttrs = jQuery.extend({}, {}, this.selectedVarAttribs);
						var validVariants = null;
						var unselectedVarAttrs = new Array();

						for (var selectedVar in selectedVarAttrs) {
							if (selectedVarAttrs[selectedVar]) {
								validVariants = this.findVariations({id: selectedVar, val: selectedVarAttrs[selectedVar]}, validVariants);
							}
							else {
								unselectedVarAttrs.push(selectedVar);
							}
						}
						// update each variation attribute display
						jQuery.each(model.variations.attributes, function (key, value) {
							if ((this.id != e.data.id || e.data.val == null) && selectedVarAttrs[this.id] == null) {
								that.varAttrDisplayHandler(this.id, validVariants, e.autotriggered);
							}
							else if (this.id != e.data.id && selectedVarAttrs[this.id] != null) {
								that.varAttrDisplayHandler(this.id, selectedVarAttrVariants, e.autotriggered);
							}
						});

						var containerId = this.containerId;
						var currentPriceHtmlElement =  $(containerId+ ' .detailsRight .productPrice');

						if (containerId == "#productDetail") {
							currentPriceHtmlElement =  $(containerId+ ' .rightcontent .productPrice');
						}
						var haveWeCopiedThePriceHtml = $(containerId).data("havewecopiedthepricehtml");

						if (!haveWeCopiedThePriceHtml) {
							$(containerId).data('copiedthepricehtml', currentPriceHtmlElement.html());
							$(containerId).data('havewecopiedthepricehtml', true);
						}

						if (validVariants != null && validVariants.length == 1 && e.data.val != null && validVariants[0].template == "george_home" ) {
							changePrice (containerId, validVariants[0]);
						}

						// based on the currently selected variation attribute values, try to find a matching variant
						this.selectedVar = this.findVariation(this.selectedVarAttribs);
					}

					// lets fire refresh view event to enable/disable variations attrs
					this.refreshView();
				},

				/**
				 * refresh the UI i.e. availability, price, A2C button and variation attributes display
				 */
				refreshView: function() {
					var thisProduct = this;
					var isSetClothing = (jQuery('[data-id="setClothing"]').length != 0);

					var sizeComboExists = variationOptionExists(thisProduct.containerId, 'size');
					var sizeComboSelected = checkVariationOptionSelected(thisProduct.containerId, 'size');

					if(sizeComboExists && sizeComboSelected && thisProduct.template != "george_home") {
						var sizeSelected = jQuery(thisProduct.containerId + " .options div.size select").val();
						app.sizeSelectorHelper.storeSize(sizeSelected);
					}

					if (!isLoadingVar && this.selectedVar == null && model.variant) {
						// if we have loaded the variations data then lets if the user has already selected some values
						// find a matching variation
						this.selectedVar = this.findVariation(this.selectedVarAttribs);
					}

					if (!model.variant && !model.master && !model.productSet) {
						// NOT A VARIANT NOR MASTER NOR PRODUCT SET
						var availability = createAvMessage(thisProduct, 1);
						// update quantity
						var productIdNoVariant=thisProduct.containerId;
						thisProduct.selectedOptions.Quantity = this.updateQtySelectBox(model, productIdNoVariant);
						// update price
						this.showUpdatedPrice(computePrice(model), model.pricing.standard, productIdNoVariant, thisProduct.selectedOptions.Quantity);
//
						if (!(!model.inStock && model.avStatus === app.constants.AVAIL_STATUS_NOT_AVAILABLE) && (this.getPrice() > 0 || this.isPromoPrice())) {
//							// enable add to cart button
							this.enableItemSelectedChk();
							jQuery(this).trigger("CalculateCartTotal");
						} else {
								this.disableItemSelectedChk();
								jQuery(this).trigger("AddtoCartDisabled");
						}
						return;

					} else if (!isLoadingVar && this.selectedVar != null) {
						// update availability
						var availability = createAvMessage(thisProduct, 1);
						// update quantity
						thisProduct.selectedOptions.Quantity = this.updateQtySelectBox(this.selectedVar, thisProduct.containerId);
						// update price
						this.showUpdatedPrice(computePrice(thisProduct), this.selectedVar.pricing.standard, thisProduct.containerId, thisProduct.selectedOptions.Quantity);
//
						if (!(!this.selectedVar.inStock && this.selectedVar.avStatus === app.constants.AVAIL_STATUS_NOT_AVAILABLE) && (this.getPrice() > 0 || this.isPromoPrice())) {
//							// enable add to cart button
							this.enableItemSelectedChk();
							jQuery(this).trigger("CalculateCartTotal");
						}
						else {
							this.disableItemSelectedChk();
							jQuery(this).trigger("AddtoCartDisabled");
						}
						this.handleAvailableFromMessage(this.selectedVar);
					}
					else {
						thisProduct.selectedOptions.Quantity = this.updateQtySelectBox(model, thisProduct.containerId);
						thisProduct.selectedOptions.pid = model.ID;
						thisProduct.selectedOptions.selectedPids = model.ID;
						thisProduct.showUpdatedPrice(computePrice(thisProduct), model.pricing.standard, thisProduct.containerId, thisProduct.selectedOptions.Quantity);
						// disable add to cart button
						this.enableA2CButton();
						jQuery(this).trigger("AddtoCartDisabled");
					}
					var nonSelectedVars = [];
					var validVariants = null;

					for (var selectedVar in this.selectedVarAttribs) {
						if (this.selectedVarAttribs[selectedVar]) {
							validVariants = this.findVariations({id: selectedVar, val: this.selectedVarAttribs[selectedVar]}, validVariants);
						}
					}

					// update selected var attr vals and refresh their display
					if (thisProduct.variations!=undefined) {
					jQuery.each(thisProduct.variations.attributes, function(){
						if (!thisProduct.selectedVarAttribs[this.id] || thisProduct.selectedVarAttribs[this.id] == "" ) {
							nonSelectedVars.push(this.name);

							thisProduct.varAttrDisplayHandler(this.id, validVariants);
						}
					});
					}
					// process non-selected vals and show updated tooltip for A2C button as a reminder
					// and show it along availability
					var tooltipStr = getNonSelectedTooltip(nonSelectedVars);
					if (nonSelectedVars.length > 0) {

						var availMsg = jQuery.format(app.resources["MISSING_VAL"], tooltipStr);
					}

					if ( thisProduct.productSetProduct && thisProduct.template == "george_home" ) {
						jQuery(thisProduct.containerId +' .errorMessage').hide(100);
					}
					else {
						if (isSetClothing) {
							jQuery(thisProduct.containerId +' .errorMessage').hide(100);
						} else {
							jQuery('.errorMessage:last').hide(100);
						}
					}
					if(errorMessageShown) {
						jQuery("#ModalContent .jspContainer").css("height", jQuery("#ModalContent .jspContainer").height() - jQuery('.errorMessage:last').parent().height());
						errorMessageShown = false;
					}


					toggleVarOptionCombos(thisProduct.containerId, thisProduct);
					// TODO move this only for color selector - currently all methods executing on dropdown colour select are executed more than once,
					// so this one will work better here, until changes are made on the functionality
					if(app.URLs.getFitsme != undefined) {
						loadFitsme(this);
					}
				},
				// return available to sell qty
				getATS: function() {
					if ((this.variant || this.master) && this.selectedVar != null) {
						return this.selectedVar.ATS;
					}
					else {
						return model.ATS;
					}
				},
				// return the availability levels
				getAvLevels: function() {
					if ((this.variant || this.master) && this.selectedVar != null) {
						return this.selectedVar.avLevels;
					}
					else {
						return model.avLevels;
					}
				},

				// returns current availability status e.g. in_stock, preorder etc.
				getAvStatus: function() {
					if ((this.variant || this.master) && this.selectedVar != null) {
						return this.selectedVar.avStatus;
					}
					else {
						return model.avStatus;
					}
				},

				handleAvailableFromMessage: function(selectedVar){

					if(selectedVar != null && selectedVar.inStockDate != ""){
						var inStockDate = new Date(selectedVar.inStockDate);
						var formattedDate = inStockDate.getDate() + '/' + (inStockDate.getMonth() + 1) + '/' +  inStockDate.getFullYear();
						jQuery(".availfrom").text(app.resources["AVAILABLE_FROM"] + " " + formattedDate + app.resources["AVAILABLE_FROM_PAYMENT_NOW"]);
					}
					else {
						jQuery(".availfrom").empty();
					}
				},

				/**
				 * renders pricing div given a sale price and optional standard price
				 * To format the price display, it goes to server via an ajax call.
				 *
				 * @param sale - sale price
				 * @param standard - standard price
				 */
				showUpdatedPrice: function(sale, standard, containerId, selectedQuantity) {
					var standardPrice 	= Number(standard || 0);
					var salePrice 		= Number(sale || 0);
					var selectedQty		= Number(selectedQuantity || 1);
					var priceHtml 		= "";
					var formattedPrices = {"salePrice": salePrice, "standardPrice": standardPrice};

					if(thisProduct.template != "george_home") {
						if(model.variations != undefined && model.variations.variants != undefined) {

							var selectedColour = jQuery(this.containerId + " .options div.colour select option:selected").val();
							var selectedSize = jQuery(this.containerId + " .options div.size select option:selected").val();
							var priceArr = new Array();
							var wasPriceArr = new Array();
							jQuery.grep(model.variations.variants, function( element, index ) {
								if(element.avLevels.NOT_AVAILABLE != 1) {
									if(selectedColour != "") {
										if(element.attributes.colour == selectedColour) {
											priceArr.push(element.pricing.sale);
											wasPriceArr.push(element.pricing.standard);
										}
									} else {
										priceArr.push(element.pricing.sale);
										wasPriceArr.push(element.pricing.standard);
									}
								}
								return;
							});

							var productCurrency = "&#163;";
							var minStandardPrice = new Number(Math.min.apply( Math, wasPriceArr )).toFixed(2);
							var maxStandardPrice = new Number(Math.max.apply( Math, wasPriceArr )).toFixed(2);
							var minSalesPrice = new Number(Math.min.apply( Math, priceArr )).toFixed(2);
							var maxSalesPrice = new Number(Math.max.apply( Math, priceArr )).toFixed(2);

							if(priceArr.length > 0) {
								if(selectedColour == "" && selectedSize == "") {
									if(minSalesPrice != maxSalesPrice) {
										if(minSalesPrice != minStandardPrice) {
											if ( !jQuery('#productPrice').hasClass('ofASet')) {
												jQuery('#productPrice .productPrice').html(
													'<span class="wasPriceFrom">' +
														app.resources['WAS_PRICE'] + ' ' + app.resources['FROM_PRICE'] +
													'</span> ' +
													'<span class="wasPrice">' + productCurrency + minStandardPrice + '</span>' +
													'<span class="nowPriceFrom"> ' +
														app.resources['NOW_PRICE'] + ' ' + app.resources['FROM_PRICE'] +
													'</span>' +
													'<span class="newPrice">' + productCurrency + minSalesPrice + '</span>');
											}
										} else {
											if ( !jQuery('#productPrice').hasClass('ofASet')) {
												jQuery('#productPrice .productPrice').html(
													'<span class="nowPriceFrom">' +
														app.resources['FROM_PRICE'] +
													'</span>' +
													'<span class="newPrice">' + productCurrency + minSalesPrice + '</span>');
											}
										}
									} else {
										if(minSalesPrice == minStandardPrice) {
											if ( !jQuery('#productPrice').hasClass('ofASet')) {
												jQuery('#productPrice .productPrice').html('<span class="newPrice">' + productCurrency + minSalesPrice + '</span>');
											}
										} else {
											if(minSalesPrice != minStandardPrice && minStandardPrice != maxStandardPrice) {
												if ( !jQuery('#productPrice').hasClass('ofASet')) {
													jQuery('#productPrice .productPrice').html(
														'<span class="wasPriceFrom">' +
															app.resources['WAS_PRICE'] + ' ' + app.resources['FROM_PRICE'] +
														'</span> ' +
														'<span class="wasPrice">' + productCurrency + minStandardPrice + '</span>' +
														'<span class="nowPriceFrom"> ' +
															app.resources['NOW_PRICE'] + ' ' +
														'</span>' +
														'<span class="newPrice">' + productCurrency + minSalesPrice + '</span>');
												}
											} else {
												if ( !jQuery('#productPrice').hasClass('ofASet')) {
													jQuery('#productPrice .productPrice').html('<span class="wasPriceFrom">' +
															app.resources['WAS_PRICE'] +
														'</span> ' +
														'<span class="wasPrice">' + productCurrency + minStandardPrice + '</span>' +
														'<span class="nowPriceFrom"> ' +
															app.resources['NOW_PRICE'] + ' ' +
														'</span>' +
														'<span class="newPrice">' + productCurrency + minSalesPrice + '</span>');
												}
											}
										}
									}
								}

								if(selectedColour != "" && selectedSize == "") {
									if(minSalesPrice != maxSalesPrice) {
										if(minSalesPrice != minStandardPrice) {
											if ( !jQuery('#productPrice').hasClass('ofASet')) {
												jQuery('#productPrice .productPrice').html('<span class="wasPriceFrom">' +
														app.resources['WAS_PRICE'] + ' ' + app.resources['FROM_PRICE'] +
													'</span> ' +
													'<span class="wasPrice">' + productCurrency + minStandardPrice + '</span>' +
													'<span class="nowPriceFrom"> ' +
														app.resources['NOW_PRICE'] + ' ' + app.resources['FROM_PRICE'] +
													'</span>' +
													'<span class="newPrice">' + productCurrency + minSalesPrice + '</span>');
											}
										} else {
											if ( !jQuery('#productPrice').hasClass('ofASet')) {
												jQuery('#productPrice .productPrice').html(
													'<span class="nowPriceFrom">' +
														app.resources['FROM_PRICE'] +
													'</span>' +
													'<span class="newPrice">' + productCurrency + minSalesPrice + '</span>');
											}
										}
									} else {
										if(minSalesPrice == minStandardPrice) {
											if ( !jQuery('#productPrice').hasClass('ofASet')) {
												jQuery('#productPrice .productPrice').html('<span class="newPrice">' + productCurrency + minSalesPrice + '</span>');
											}
										} else {
											if(minSalesPrice != minStandardPrice && minStandardPrice != maxStandardPrice) {
												if ( !jQuery('#productPrice').hasClass('ofASet')) {
													jQuery('#productPrice .productPrice').html(
														'<span class="wasPriceFrom">' +
															app.resources['WAS_PRICE'] + ' ' + app.resources['FROM_PRICE'] +
														'</span> ' +
														'<span class="wasPrice">' + productCurrency + minStandardPrice + '</span>' +
														'<span class="nowPriceFrom"> ' +
															app.resources['NOW_PRICE'] + ' ' +
														'</span>' +
														'<span class="newPrice">' + productCurrency + minSalesPrice + '</span>');
												}
											} else {
												if ( !jQuery('#productPrice').hasClass('ofASet')) {
													jQuery('#productPrice .productPrice').html('<span class="wasPriceFrom">' +
															app.resources['WAS_PRICE'] +
														'</span> ' +
														'<span class="wasPrice">' + productCurrency + minStandardPrice + '</span>' +
														'<span class="nowPriceFrom"> ' +
															app.resources['NOW_PRICE'] + ' ' +
														'</span>' +
														'<span class="newPrice">' + productCurrency + minSalesPrice + '</span>');
												}
											}
										}
									}
								}
							} else {
								jQuery('#productPrice .newPrice .currency').removeClass('currency');
								if(selectedColour != "") {
									// Disable out of stock colour
									jQuery(this.containerId + " .options div.colour select option:selected").text(selectedColour + ' - ' + app.resources['SOLD_OUT'])
																											.attr('disabled', 'disabled');
								}
							}
							jQuery('#productPrice').removeClass('hidden');
						}
					}

					if ( thisProduct.productSet )
					{
						var totalPrice = new Number(0);

						for (subProductIterator = 0; subProductIterator < thisProduct.subProducts.length; subProductIterator++)
						{
							var subProduct = thisProduct.subProducts[subProductIterator];

							if ( subProduct.selectedVar != null )
							{
								var selectedQuantity = jQuery('#' + subProduct.pid + '_quantity').val();

								if ( selectedQuantity == 0 )
								{
									continue;
								}

								totalPrice += Number(selectedQuantity) * subProduct.selectedVar.pricing.sale;
							}

						}

						var priceLine = jQuery('#productPrice');

						if ( !priceLine.hasClass('ofASet') )
						{
							return 0;
						}

						var poundsLine = jQuery( priceLine.find('.pounds:last'));
						var priceMessageLine = jQuery( priceLine.find('.priceMessage:last'));

						if ( totalPrice == 0 )
						{
							poundsLine.addClass('hidden');
							poundsLine.find('.currencyOfASet:last').addClass('hidden');

							priceMessageLine.addClass('hidden');

							jQuery('.infoMsg').addClass('hidden');

							return;
						}

						poundsLine.removeClass('hidden');
						poundsLine.find('.currencyOfASet:last').removeClass('hidden');

						priceMessageLine.removeClass('hidden');

						jQuery('.infoMsg').removeClass('hidden');

						jQuery('#productSetPrice').html(totalPrice.toFixed(2));

						return;
					}

					if(salePrice <= 0) {
						jQuery('.productSubtotal:last').addClass('hidden');
						hideClass = " hidden";
						return;
					} else {
						hideClass = "";
						jQuery('.productSubtotal:last').removeClass('hidden');
					}

					var currency = jQuery('.productSubtotal .subTlPrice .currency').html();

					var currencySpan = '<span class="currency">' + currency + '</span>';

					var qtyPriceHtml = (formattedPrices.salePrice * selectedQty).toFixed(2);

					jQuery('.productSubtotal .subTlPrice').html( currencySpan + qtyPriceHtml );

				},

				// when the selected variant ATS is different - update the quantity box
				updateQtySelectBox: function(variant, containerId) {
					var targetQtyBox = jQuery(containerId).find('.quantityinput');
					targetQtyBox.empty();

					var ats = variant.ATS;
					var step = variant.StepQty;
					var min = variant.MinQty;
					var max = variant.MaxQty;

					var newAts = 0;

					newAts = Math.min(ats, 10);

					newAts = ( max > 0 ) ? Math.min(max, newAts) : newAts;

					var options = ( min > 0 ) ? '<option value="' + min + '" selected="selected">' + min + '</option>' : '';

					var selectedFlag = ( min > 0 ) ? true : false;
					var selectedStr = '';

					var nextOptionValue = min + step;
					var selectFirstElement = true; // auto select first option in the size select

					while ( nextOptionValue <= newAts )
					{

						if ( !selectedFlag )
						{
							selectedStr = 'selected="selected"';
							selectedFlag = true;
					}
						else
						{
							selectedStr = '';
						}

						options += '<option value="' + nextOptionValue + '" ' + selectedStr +'>' + nextOptionValue + '</option>';

						nextOptionValue = nextOptionValue + step;
					}

					targetQtyBox.append(options);
					targetQtyBox.val("1");

					return Number(targetQtyBox.val());
				},

				// return the quantity that was used to calculate availability
				getAvailabilityQty: function() {
					if ((this.variant || this.master) && this.selectedVar != null) {
						return this.selectedVar.avStatusQuantity;
					}
					else {
						return model.avStatusQuantity;
					}
				},
				/**
				 * returns a computed price for this product
				 */
				getPrice: function() {
					return computePrice(this);
				},
				// determine if A2C button is enabled or disabled
				// true if enabled, false otherwise
				isA2CEnabled: function() {
					if (this.variant || this.master) {
						if (this.selectedVar != null) {
							return (this.selectedVar.avStatus === app.constants.AVAIL_STATUS_IN_STOCK ||
									this.selectedVar.avStatus === app.constants.AVAIL_STATUS_BACKORDER ||
									this.selectedVar.avStatus === app.constants.AVAIL_STATUS_PREORDER);
						}
						else {
							return false;
						}
					}
					else {

						return (model.avStatus === app.constants.AVAIL_STATUS_IN_STOCK ||
								model.avStatus === app.constants.AVAIL_STATUS_BACKORDER ||
								model.avStatus === app.constants.AVAIL_STATUS_PREORDER);
					}
				},
				/**
				 * Determines if the selected product has promotional price.
				 * 			 *
				 * @return boolean true if promotional price is present otherwise false
				 */
				isPromoPrice: function() {
					return (this.selectedVar != null ? this.selectedVar.pricing.isPromoPrice : model.pricing.isPromoPrice);
				},
				/**
				* given a variation attribute id and valid variants, it would adjust the ui i.e. enable/disable
				* appropriate attribute values.
				*
				* @param attrId - String, id of the variation attribute
				* @param validVariants - Array of json objects of valid variants for the given attribute id
				* */
				varAttrDisplayHandler: function (attrId, validVariants, preventTriggerChangeEvent) {

					var that = this; // preserve this instance

					// loop thru all the non-swatches(drop down) attributes
					jQuery(this.containerId + " .options .variantdropdown select").each(function(){

						var vaId = jQuery(this).data("data").id;  // data is id set via app.hiddenData api
						var vaId = jQuery(this).attr('id');
						if (vaId === attrId) {
							var len = this.options.length;

							if ( attrId == 'colour' )
							{
								return;
							}

							var colourCombo = jQuery(this.containerId + " .options div.colour select");
							var selector = this;
							var options = '<option value="">Select Size</option>';

							if (validVariants != null) {

								jQuery.each(validVariants, function(key, value) {
									options += '<option value="'+ value.attributes.size +'">' + value.attributes.size + '</option>';
								});
							}
							else if (colourCombo.length > 0) {
								$(selector).html(options);
							}

							jQuery.each(this.options, function(){
								if (len > 1 && this.index == 0) {
									return; // very first option when the length is greater than 1 is 'Select ...' message so skip it
								}

								// find A variation with this val
								var filteredVariants = that.findVariations({id:attrId, val:this.value}, validVariants);

								if (filteredVariants.length > 0) {
									// found at least 1 so keep it enabled
									this.disabled = false;

									jQuery(this).removeClass("hiddenOption");

									if ( attrId == 'size')
									{
										if ( this.text.indexOf(" - " + app.resources["SOLD_OUT"]) != -1 )
										{
											this.text = this.text.substr(0,this.text.indexOf(" - " + app.resources["SOLD_OUT"]));
										}
										else if ( this.text.indexOf(" - " + app.resources["PREORDER"]) != -1 )
										{
											this.text = this.text.substr(0,this.text.indexOf(" - " + app.resources["PREORDER"]));
										}
										else if ( this.text.indexOf(" - " + app.resources["BACKORDER"]) != -1 )
										{
											this.text = this.text.substr(0,this.text.indexOf(" - " + app.resources["BACKORDER"]));
										}
										else if ( this.text.indexOf(" - " + app.resources["LOW_STOCK"]) != -1 )
										{
											this.text = this.text.substr(0,this.text.indexOf(" - " + app.resources["LOW_STOCK"]));
										}

										if ( !(filteredVariants[0].inStock ||
											 filteredVariants[0].avStatus == app.constants.AVAIL_STATUS_PREORDER ||
											 filteredVariants[0].avStatus == app.constants.AVAIL_STATUS_BACKORDER))
										{
											this.text += " - " + app.resources["SOLD_OUT"];

											this.disabled = true;

											if (this.selected) {
												// remove the currently selected value if the value is not selectable
												that.selectedVarAttribs[attrId] = null;
											}
											// remove current selection
											this.selected = false;
										}
										else if(filteredVariants[0].avStatus == app.constants.AVAIL_STATUS_PREORDER)
										{
											this.text += " - " + app.resources["PREORDER"];
										}
										else if(filteredVariants[0].avStatus == app.constants.AVAIL_STATUS_BACKORDER)
										{
											this.text += " - " + app.resources["BACKORDER"];
										}
										else if ( filteredVariants[0].lowStock )
										{
											this.text += " - " + app.resources["LOW_STOCK"];
										}
									}
								}
								else {
									// no variant found with this value combination so disable it
									this.disabled = true;
									if ( attrId == 'size')
									{
										jQuery(this).addClass("hiddenOption");
										var soldOutText = app.resources["SOLD_OUT"];
										var lowStockText = app.resources["LOW_STOCK"];
										if ((this.text.indexOf(soldOutText) == -1) && (this.text.indexOf(lowStockText) == -1)) {
											this.text += " - " + app.resources["SOLD_OUT"];
										}
									}

									if (this.selected) {
										// remove the currently selected value if the value is not selectable
										that.selectedVarAttribs[attrId] = null;
									}
									// remove current selection
									this.selected = false;
								}
							});

						}


						$('form.jNice').form();
					});
				},

				/*
				* find 0 or more variants matching the given attribs object(s) and in stock
				* return null or found variants
				*/
				findVariations: function(attr, variants) {
					var foundVariants = new Array();
					variants = variants || model.variations.variants;

					var variant = null;
					for (var i=0; i<variants.length; i++) {
						variant = variants[i];
						if (variant.attributes[attr.id] === attr.val)
							foundVariants.push(variant);
					}

					return foundVariants;
				},
				/*
				* find a variant with the given attribs object
				* return null or found variation json
				*/
				findVariation: function(attrs) {
					if (!this.checkAttrs(attrs)) {
						return null;
					}

					var attrToStr = function(attrObj) {
						var result = "";
						jQuery.each(model.variations.attributes, function(){
							result += attrObj[this.id];
						});
						return result;
					}

					var attrsStr = attrToStr(attrs);

					for (var i=0; i<model.variations.variants.length; i++) {
						variant = model.variations.variants[i];
						if (attrToStr(variant.attributes) === attrsStr) {
							return variant;
						}
					}
					return null;
				},



				/*
				* see if the specified attrs object has all the variation attributes present in it
				* return true/false
				*/
				checkAttrs: function(attrs) {
					for (var i=0; i<model.variations.attributes.length; i++) {
						if (attrs[model.variations.attributes[i].id] == null) {
							return false;
						}
					}
					return true;
				},
				updateProductDetails: function(selectedVariant) {
					var name = selectedVariant.name;
					var description = selectedVariant.description;

					if(typeof description != 'undefined') {
						jQuery("#tabContentsProduct div#tab1_pd_content").html(description);
					}
					if(typeof shortDescription != 'undefined') {
						jQuery("#tabContentsProduct div#tab2_pd_content").html(shortDescription);
					}


				},
				updateProductRecommendations: function(selectedVariant) {
					app.ajax.load({
						selector: "#carouselsSection",
						url: app.URLs.getRecommendations,
						data:{pid: selectedVariant.id, cgid: model.CID}
					});
				},
				/**
				* Event handler when a subproduct of a product set or a bundle is selected.
				* Basically enable the add to cart button or do other screen refresh if needed like price etc.
				*/
				calculateCartHandler: function(e) {
					thisProduct = e.data.productObject;
					// enable Add to cart button if all the sub products have been selected
					// and show the updated price
					var enableAddToCart = true;
					var subProducts = thisProduct.subProducts;
					var price = new Number();
					if(model.productSet) {
						for (var i = 0; i < subProducts.length; i++) {
							if (!subProducts[i].bundled && (subProducts[i].selectedOptions["Quantity"] == undefined ||
								subProducts[i].selectedOptions["Quantity"] <= 0)) {
								enableAddToCart = false;
								break;
							}
							else {
								if (subProducts[i].selectedVar != null) {
									subProducts[i].selectedOptions.pid = subProducts[i].selectedVar.pid;
								}
								else {
									subProducts[i].selectedOptions.pid = subProducts[i].pid;
								}

								// Multiply the subproduct quantity-one price by the entered quantity.
								// Important note:  This value will be incorrect if subproduct uses
								// tiered pricing !!!!!
								var subproductQuantity = subProducts[i].selectedOptions["Quantity"];
								if (subproductQuantity == undefined) {
									subproductQuantity = 1;
								}
								if(subProducts[i].selected)
									price += new Number(subproductQuantity * subProducts[i].getPrice());
							}
						}
					}
					if (enableAddToCart) {
						thisProduct.enableA2CButton();
						// show total price except for a bundle
						if (!model.bundle && model.productSet) {
							thisProduct.showUpdatedPrice(price);
						}
					}
					else {
						thisProduct.disableA2CButton();
					}
				},

				changeProductImgByVariationValue : function( variationValue, containerID )
				{

					var isSetClothing = (jQuery('[data-id="setClothing"]').length != 0);
					var imageContainer = (jQuery(containerID +' .detailsLeft img').length != 0 ? jQuery(containerID +' .detailsLeft img') : jQuery(containerID +' .leftcontent img#prodImg'));
					if ( imageContainer.length == 0 ) {
						return;
					}

					if (variationValue == null) {
						var primaryimage = imageContainer.data('primaryimage');
						var currentImgSrc = imageContainer.prop('src');
						var primaryimageUrl  = null;
						var currentImgUrl = null;

						if (currentImgSrc.indexOf("?")>-1){
							currentImgUrl = currentImgSrc.substr(0,currentImgSrc.indexOf("?"));
						}

						if (primaryimage.indexOf("?")>-1){
							primaryimageUrl = primaryimage.substr(0,primaryimage.indexOf("?"));
						}

						if (currentImgUrl != primaryimageUrl) {
							imageContainer.fadeTo(800,0.30, function() {
								imageContainer
								  .attr({
									  'src':primaryimage,
									  'alt': thisProduct.pid
								  });
							}).fadeTo(500,1);
						}
					}

					var variants = variants || model.variations.variants;
					var variant = null;
					var foundVariant = false;
					var iterator = 0;

					while( (iterator < variants.length) && foundVariant == false )
					{
						var tmpVariant = variants[iterator];
						if (tmpVariant.attributes.colour === variationValue || tmpVariant.attributes.size === variationValue)
						{
							foundVariant = true;
							variant = tmpVariant;
						}

						iterator++;
					}

					if ( typeof variant === null || variant === null )
					{
						return;
					}

					var variantImages = variant.images;
					var generatedLinks = "";

					jQuery('#imageNavigator').removeAttr('style');
					jQuery('#imageSlideInner').html('');

					jQuery('#imageNavigator').find('.slideUp:last').remove();
					jQuery('#imageNavigator').find('.slideDown:last').remove();

					var imageNavigator = jQuery('#imageNavigator').html();
					jQuery('#imageNavigator').html('');
					jQuery('#imageNavigator').html('<a href="#" class="slideUp hidden"></a>' + imageNavigator + '<a href="#" class="slideDown hidden"></a>');
					jQuery('#imageSlideInner').css('top',0);

					iterator = 0;
					for (var imageKey in variantImages)
					{
						var variantImageData = variantImages[imageKey];
						var variantImageDataUrl = variantImageData.img_src;
						if (this.template == "george_home") {
							variantImageDataUrl = variantImageDataUrl + '&wid=80&hei=80';
						}
						var generatedImg = '<img src="' + variantImageDataUrl + '" alt="' + variantImageData.img_alt + '"/>';

						generatedLinks += '<a id="' + variantImageData.id + '" href="' + variantImageData.a_href + '" class="' + variantImageData.css_class + '">' + generatedImg + '</a>';

						iterator++;
						if (isSetClothing && iterator == 5) {
							break;
						}
					}

					jQuery('#imageSlideInner').html( generatedLinks );

					var zoomOptions = {
						    zoomWidth: 478,
						    zoomHeight: 488,
				            xOffset: 25,
				            yOffset: 0,
				            position: "right",
				            title: false
						};

					jQuery('.productImageLink').noTabletJqzoom(zoomOptions);

					var imageChanger = new app.changeImages();
					if (this.template == "george_home") {
						imageChanger.init({width : 450, height : 450, container : '#' + 'imageSlideInner', image : '#' + 'prodImg', zoomOptions : zoomOptions});
					}
					else {
						imageChanger.init({width : 305, height : 382, container : '#' + 'imageSlideInner', image : '#' + 'prodImg', zoomOptions : zoomOptions});
					}
					jQuery('#th_prImg').click();

					var href = jQuery('a#fullscreen').attr('href') || '';

					var firstSide = href.indexOf('=') + 1;
					var secondSide = href.length;

					var id2replace = href.substr(firstSide,secondSide-firstSide);

					jQuery('a#fullscreen').attr('href',href.replace(id2replace,variant.id));
					jQuery("div#imagesContainer").show();
				},

				changeVideoImagesSpinSetByColor : function( colour, template )
				{
					if ( thisProduct.subProducts.length > 0 )
						return;

					var variants = variants || model.variations.variants;

					var variant = null;
					var foundVariant = false;
					var iterator = 0;

					while( (iterator < variants.length) && foundVariant == false )
					{
						var tmpVariant = variants[iterator];

						if (tmpVariant.attributes.colour === colour)
						{
							foundVariant = true;
							variant = tmpVariant;
						}

						iterator++;
					}

					if ( typeof variant === null )
					{
						return;
					}

					var variantImages = variant.images;
					var generatedLinks = "";

					jQuery('#imageNavigator').removeAttr('style');
					jQuery('#imageSlideInner').html('');

					jQuery('#imageNavigator').find('.slideUp:last').remove();
					jQuery('#imageNavigator').find('.slideDown:last').remove();

					var imageNavigator = jQuery('#imageNavigator').html();
					jQuery('#imageNavigator').html('');
					jQuery('#imageNavigator').html('<a href="#" class="slideUp hidden"></a>' + imageNavigator + '<a href="#" class="slideDown hidden"></a>');
					jQuery('#imageSlideInner').css('top',0);

					for (var imageKey in variantImages)
					{
						var variantImageData = variantImages[imageKey];
						var variantImageDataUrl = variantImageData.img_src;
						if (template == "george_home") {
							variantImageDataUrl = variantImageDataUrl + '&wid=80&hei=80';
						}
						var generatedImg = '<img src="' + variantImageDataUrl + '" alt="' + variantImageData.img_alt + '"/>';

						generatedLinks += '<a id="' + variantImageData.id + '" href="' + variantImageData.a_href + '" class="' + variantImageData.css_class + '">' + generatedImg + '</a>';
					}

					jQuery('#imageSlideInner').html( generatedLinks );

					var zoomOptions = {
						    zoomWidth: 478,
						    zoomHeight: 488,
				            xOffset: 25,
				            yOffset: 0,
				            position: "right",
				            title: false
						};

					jQuery('.productImageLink').noTabletJqzoom(zoomOptions);

					var imageChanger = new app.changeImages();
					if (template == "george_home") {
						imageChanger.init({width : 450, height : 450, container : '#' + 'imageSlideInner', image : '#' + 'prodImg', zoomOptions : zoomOptions});
					}
					else {
						imageChanger.init({width : 305, height : 382, container : '#' + 'imageSlideInner', image : '#' + 'prodImg', zoomOptions : zoomOptions});
					}
					jQuery('#th_prImg').click();

					var href = jQuery('a#fullscreen').attr('href') || '';

					var firstSide = href.indexOf('=') + 1;
					var secondSide = href.length;

					var id2replace = href.substr(firstSide,secondSide-firstSide);

					jQuery('a#fullscreen').attr('href',href.replace(id2replace,variant.id));
					jQuery("div#videoContainer").hide();
					jQuery("div#video360Container").hide();
					jQuery("div#imagesContainer").show();

					var variantVideos = variant.videos;

					var video360IdSpan = jQuery('#product360VideoId');
					var videoIdSpan = jQuery('#productVideoId');

					if ( video360IdSpan.html() != variantVideos.video360 )
					{
						video360IdSpan.html(variantVideos.video360);
					}

					if ( videoIdSpan.html() != variantVideos.video )
					{
						videoIdSpan.html(variantVideos.video);
					}

				},

				saveForLaterItemView : function (selectedOptions, thisProduct) {
					var context = jQuery(thisProduct.containerId);

					jQuery.ajax({
						// selectedOptions is a list structure having Quantity, pid, masterPid, childPids,selectedPids
						// ex. Object {Quantity: "1", pid: "001736477", selectedPids: "001736477"}
						url: saveForLaterLink + '?pid=' + selectedOptions.selectedPids,
						type: 'GET'
					}).done(function(){

						jQuery('.saveForLaterBtn', context).addClass('itemSaved');
						jQuery.ajax({
							url: miniCartGeorgeLink,
							type: 'GET'
						}).done(function(response){
							// response has some HTML that we do not need, that's why the stripping.
							var result = response.split("<!-- Start: george/cart/minicartlineitem_george -->");
							result = result[1].split("<!-- End: george/cart/minicartlineitem_george -->");

							//Trigger custom event for updating top nav button.
							jQuery('#userControls .sfl-counter').trigger('sflTopUpdateEvent');

							jQuery('.viewSavedItems', context).removeClass('hidden');

						// replace the content
							jQuery('#basketContents').html(result[0]);
							jQuery.ajax({
								type	: "POST",
								url		: app.minicart.summaryUrl,
								cache	: true,
								success	: function(e) {
									jQuery('.basketSummary').html(e);
								}
							});

							//iScroll minicart re-initialization
							jspMiniCartScroll();
							jQuery('.addToBasket .loading', context).addClass('itemAdded').removeClass('loading');
							setTimeout(function() { jQuery('.addToBasket .itemAdded').removeClass('itemAdded');},1500);
							setTimeout(function() { jQuery('.saveForLaterBtn', context).removeClass('itemSaved')}, 2000);
						});

					});
				},

				saveForLater: function(saveForLaterItemViewCallback, thisProduct) {
					var context = jQuery(thisProduct.containerId);
					var saveForLaterBtn = jQuery(".saveForLaterBtn", context).click(function(e) {
						var isSetClothing = (jQuery('[data-id="setClothing"]').length != 0);
						var isOutOfStock = (jQuery('.stockOut', context).length > 0);
						if (model.master || model.variant) {
							if (thisProduct.selectedVar == null) {
								if (model.variations != undefined) {
									var nonSelectedVars = [];

									// get the non-selected variations
									jQuery.each(model.variations.attributes, function(){
										if (!thisProduct.selectedVarAttribs[this.id] || thisProduct.selectedVarAttribs[this.id] == "" ) {
											nonSelectedVars.push(this.name);
										}
									});

									if (isSetClothing) {
										var errorMsgElement = jQuery('.errorMessage', context);
									} else {
										var errorMsgElement = jQuery('.errorMessage:last', context);
									}

									if (nonSelectedVars.length > 0) {

										var tooltipStr = getNonSelectedTooltip(nonSelectedVars);
										var errorMsg = jQuery.format("Select a product {0} and Quantity before adding to Save For Later List", tooltipStr);

										errorMsgElement.removeClass('hidden');
										errorMsgElement.html(errorMsg).show();
										if (isOutOfStock) {
											errorMsgElement.addClass('clothingOutOfStockSubItem');
										}
										var container = jQuery("#ModalContent .jspContainer").first();
										var errorMessageHeight = errorMsgElement.parent().height();
										var containerHeight = container.height();
										if(containerHeight + errorMessageHeight <= mbH && !errorMessageShown) {
											container.css("height", containerHeight + errorMessageHeight);

											errorMessageShown = true;
										}
										e.preventDefault();
									}
									else
									{
										errorMsgElement.hide(100);
									}
								}

								e.preventDefault();
							}

							else if (thisProduct.getPrice() <= 0) {
								e.preventDefault();
							}

							// it is necessary to update the option id to be variant-specific
							jQuery(".product_options:last select", context).each(function(){
								 var value = thisProduct.selectedOptions[this.id];
								 var newId = this.id.replace(thisProduct.pid, thisProduct.selectedVar.id);
								 thisProduct.selectedOptions[newId] = value;
								 delete thisProduct.selectedOptions[this.id];
								});

							if (thisProduct.selectedVar != null) {
								thisProduct.selectedOptions.pid = thisProduct.selectedVar.id;
								thisProduct.selectedOptions.masterPid = thisProduct.pid;
							}

						} else {
							// check if we are adding a bundle/productset to the cart
							if (model.bundle || model.productSet) {
								var subProducts = thisProduct.subProducts;
								var comma 		= ",";
								var tempQty 	= "";
								var subproduct 	= null;
								var notSelectedSubProducts = 0;

								thisProduct.selectedOptions.childPids = "";

								if (model.productSet) {
									thisProduct.selectedOptions.Quantity = "";
									//Get Save For Later product set error msg from properties file or set default.
									var errorProductSetMsg = sflProductSetErrorMsg || 'Select at least one product before adding to Save for Later List';
									jQuery('.errorMessage:last').html(errorProductSetMsg);
								}

								// process each individual products in the set/bundle
								// and prepare product.selectedOptions for final submission
								for (var i = 0; i < subProducts.length; i++) {
									subproduct = subProducts[i];
									if (!subproduct.selected) {
										notSelectedSubProducts++;
										continue;
									}

									// see if any of the sub products are variations, if so then get the selected variation id
									// from selectedVar property and make it a comma separated list
									if (subproduct.variant || subproduct.master) {
										if (subproduct.selectedVar == null) {
											e.preventDefault();
										}
										thisProduct.selectedOptions.childPids += subproduct.selectedVar.id+comma;
									}
									else {
										thisProduct.selectedOptions.childPids += subproduct.pid+comma;
									}

									var tempPid = subproduct.selectedOptions.pid;
									subproduct.selectedOptions.pid = null;
									// merge selected options of sub product with the main product
									thisProduct.selectedOptions = jQuery.extend({}, thisProduct.selectedOptions, subproduct.selectedOptions);
									subproduct.selectedOptions.pid = tempPid;

									// if it is a product set then sub products can have their separate qty
									if (model.productSet) {
										tempQty += subproduct.selectedOptions.Quantity+comma;
									}
								}

								if ( notSelectedSubProducts == subProducts.length && !model.bundle)
								{
									jQuery('.errorMessage:last').show(100);
									e.preventDefault();
								}
							}

							// if it is a product set then sub products can have their separate qty
							// tempQty is a comma separated list of qty for each product in the set
							if (model.productSet) {
								thisProduct.selectedOptions.Quantity = tempQty;
								var q = thisProduct.selectedOptions.Quantity;
								var pids = thisProduct.selectedOptions.childPids;

								if(q.substr(q.length - 1, q.length) == ',')
									thisProduct.selectedOptions.Quantity = q.substr(0, q.length-1);
								if(pids.substr(pids.length - 1, pids.length) == ',')
									thisProduct.selectedOptions.selectedPids = pids.substr(0, pids.length-1);
							}

							// make sure the pid which gets submitted is for the main product
							thisProduct.selectedOptions.pid = thisProduct.pid;
						}


						if (model.bundle) {
							thisProduct.selectedOptions.Quantity = "1"; // hard coded qty=1 when we the product is a bundle
							thisProduct.selectedOptions.selectedPids = thisProduct.selectedOptions.pid;
						}
						else if (!model.productSet) {
							// grab the user entered qty
							thisProduct.selectedOptions.Quantity = jQuery(".quantityinput:last", context).val();
							thisProduct.selectedOptions.selectedPids = thisProduct.selectedOptions.pid;
						}

						// if it is not a productset then make sure qty is specified greater than 0
						if (model.productSet || thisProduct.selectedOptions.Quantity > 0) {
							if(model.productSet && thisProduct.selectedOptions.childPids == "" ) {
								return;
							}
							saveForLaterItemViewCallback(thisProduct.selectedOptions, thisProduct);
						}
						else if (thisProduct.template == "george_home" && jQuery(".options div.size select", context).length == 0 && jQuery(".options div.colour select", context).length == 0) {
							saveForLaterItemViewCallback(thisProduct.selectedOptions, thisProduct);
						}

						e.preventDefault();
					});

					return saveForLaterBtn;
				},

				/**
				 * work horse of the product detail page getting everything tied together i.e. all the dynamic stuff
				 * and one time initialization. called only ONCE
				 * bind all the product display events and handlers
				 * load variants in case this is a variation product
				 * bind subproducts a2c button enable event handler
				 *
				 * @param options.cotainerId - id of the containing div
				 * @param options.source - source of this product show request, mainly quickview
				 */
				show: function(options) {
					// preserve this instance
					var thisProduct = this;

					// bind VariationsLoaded which gets fired when the variation data is received from the server
					// and we need to refresh the ui
					jQuery(this).bind("VariationsLoaded", {}, function(e, source){
						// enable/disable unavailable values
						// and set the currently selected values
						// reset the currently selected variation attributes i.e. reset the ui
						//thisProduct.resetVariations();

						// non-swatch variation attributes
						jQuery(thisProduct.containerId + " .options .variantdropdown select").each(function(){
							if (this.selectedIndex >= 0 && this.options[this.selectedIndex].value != "") {
								this.selectedColour = this.options[this.selectedIndex].value;
								thisProduct.varAttrSelected({data: {id: jQuery(this).attr('id'), val: this.options[this.selectedIndex].value}});
							}
						});
					});


					jQuery(this).bind("UpdateDetailSections",{}, function(){

						if(isLoadingVar || this.selectedVar === null && this.selectedVarAttribs === null) {
							return;
						}

						if(this.selectedVar != null) {
							if (thisProduct.template == "george_home") {
								jQuery("#furnitureSwatch .asset").addClass('hidden');
								if(this.selectedVar.furnitureSwatch != "null" && this.selectedVar.inStock) {
									jQuery("#furnitureSwatch .furnitureSwatch").html(this.selectedVar.furnitureSwatch);
									jQuery("#furnitureSwatch .furnitureSwatch").removeClass('hidden');
								} else {
									jQuery("#furnitureSwatch .furnitureSwatch").addClass('hidden');
								}
							}
							var selectedVariant = this.selectedVar;
						} else {
							var showAsset = false;
							for (i = 0; i < model.variations.variants.length; i++) {
								if(model.variations.variants[i].furnitureSwatch != "null") {
									showAsset = true;
								}
								colour = model.variations.variants[i].attributes.colour;
								if(colour == this.selectedVarAttribs.colour || this.selectedVarAttribs.colour === null || this.selectedVarAttribs.colour === undefined) {
									var selectedVariant = model.variations.variants[i];
								}
							}
							if (thisProduct.template == "george_home") {
								jQuery("#furnitureSwatch .furnitureSwatch").addClass('hidden');
							}
						}

						backorderHandling(thisProduct.containerId, selectedVariant);
						changePrice (thisProduct.containerId, thisProduct);

						appGerogeSelectedVariant = {'pid' : this.pid, 'id' : selectedVariant.id};
						$(document).trigger('app.geroge.updateProductSize');
						if(thisProduct.template != "george_home") {
							thisProduct.updateProductDetails(selectedVariant);
						}
						thisProduct.updateProductRecommendations(selectedVariant);
					});

					this.containerId 	= "#"+options.containerId;
					var isQuickView 	= false;
					myContainerId = this.containerId;
//					// variation attributes handling in case it is a master or a variant product
					if (model.master || model.variant) {
						loadVariants(this); // make a server call to load the variants, this is due to the performance reasons
//						// meanwhile display the available variation attributes

//						// loop thru all the non-swatches attributes and bind events etc.
						jQuery(thisProduct.containerId + " .options .variantdropdown select").each(function(){
							// default ui i.e. drop down
							jQuery(this).data("data", {id: jQuery(this).attr('id'), val: ''}).change(function(e, autotriggered){
								// if there is only 1 value to be selected then return i.e. no deselection available
								if (this.selectedIndex == 0 && this.options.length == 1) { return; }

								e.data = jQuery(this).data("data"); // data is id
								e.data.val = (this.selectedIndex == 0) ? null: this.options[this.selectedIndex].value;
								e.autotriggered = autotriggered;
								thisProduct.varAttrSelected(e);
								jQuery(thisProduct).trigger("UpdateDetailSections");
							});
						});
					}

					if(!model.productSet) {
						jQuery(thisProduct).bind("CalculateCartTotal", {productObject:thisProduct}, thisProduct.calculateCartHandler);
						// quantity box
						if (!model.bundle) {
							getQtyBox(this);
						}
					}

					if (!model.variant && !model.master && !model.productSetProduct) {
						getQtyBox(this);
						toggleVarOptionCombos("#productDetail");
						this.refreshView();
						$('form.jNice').form();

					}

					if (!model.variant && !model.master && thisProduct.template == "george_home") {
						getQtyBox(this);
						toggleVarOptionCombos( (thisProduct.containerId != null) ? thisProduct.containerId : "#productDetail" );
						this.refreshView();
						$('form.jNice').form();
						backorderHandling(thisProduct.containerId, thisProduct);
					}

					this.saveForLater(this.saveForLaterItemView, this);

					// Add to cart button click binding
					getAddToCartBtn(this);
					// intial display of A2C button
					// if the price is 0 or not available, its disabled
					// if not in stock, its disabled
					// isPromoPrice would be true in case if a product has a promotional price which could make product's price 0
					if (!(this.getPrice() > 0 || this.isPromoPrice()) ||
						model.master || model.variant || model.productSet || model.bundle ||
						(!model.inStock && model.avStatus === app.constants.AVAIL_STATUS_NOT_AVAILABLE && !model.productSet)) {
						this.disableA2CButton();
						this.disableItemSelectedChk();
					}
					// For product-sets, enable or disable the add-to-cart button.
					// The button should be disabled if the selected item checkbox of any of the subproducts is checked.
					// For product-sets, display a price which is the sum of the set-products prices as long as the add-to-cart button is enabled.
					if (model.productSet) {
						//Click event for each select product checkbox.
						jQuery(thisProduct.containerId+" .check_selected").each(function(i,e){
							jQuery(this).click(function(){

								for(var iterator = 0; iterator < thisProduct.subProducts.length; iterator++)
								{
									var subProduct = thisProduct.subProducts[iterator];

									if ( subProduct.pid == this.value)
									{
										var colourSelect = jQuery('select[name=' + subProduct.pid + '_colour]');

										if ( !colourSelect.attr('disabled'))
										{
											colourSelect[0].options[0].selected = true;
										}
										else
										{
											var sizeSelect = jQuery('select[name=' + subProduct.pid + '_size]');
											sizeSelect[0].options[0].selected = true;
										}

										thisProduct.subProducts[iterator].selected = false;
										thisProduct.subProducts[iterator].selectedVar = null;

										this.disabled = true;
										thisProduct.subProducts[iterator].selectedVarAttribs['size'] = null;

										toggleVarOptionCombos(subProduct.containerId);
										thisProduct.showUpdatedPrice(0);

										$(subProduct).trigger("CalculateCartTotal");

										$('form.jNice').form();

										return;
									}

								}

								productSelected = e.checked;
								subProductId = e.value; //Value of the checkbox should be Set Product's id
								for(i=0; i < thisProduct.subProducts.length; i++){
									if(thisProduct.subProducts[i].pid == subProductId) {
										thisProduct.subProducts[i].selected = productSelected ? true : false;
										jQuery(thisProduct.subProducts[i]).trigger("CalculateCartTotal");
									}
								}

							})
						});

						var bundleA2CEnabled = false;
						var price = new Number();

						for (var i = 0; i < thisProduct.subProducts.length; i++) {
							var subProduct = thisProduct.subProducts[i];
							bundleA2CEnabled = subProduct.isA2CEnabled(); //In fact here inStock or preorder/backorder availability is checked
							if (bundleA2CEnabled) {
								// collect price info
								price += new Number(subProduct.getPrice());
							}
						}
							this.enableA2CButton();
							this.enableItemSelectedChk();
					}
					jQuery.each(thisProduct.subProducts, function(){
						jQuery(this).bind("AddtoCartDisabled", {},
							/**
							* Event handler when a subproduct of a product set or a bundle is selected.
							* disable the add to cart button
							*/
							function() {
								thisProduct.disableA2CButton();
								this.disableItemSelectedChk();
						});

						// see if have any sub-products and bind CalculateCartTotal event
						jQuery(this).bind("CalculateCartTotal", {productObject:thisProduct}, thisProduct.calculateCartHandler);

					});

					if ( !this.productSet )
					{
						toggleVarOptionCombos(thisProduct.containerId);
					}
				},

				toString: function() {
					return this.model;
				}
			}
		} // Product defintion end
	} else {
		// dw namespace has not been defined yet i.e. app object is unavailable
		alert("app is undefined!");
	}
})(app);
var FitsMeData;