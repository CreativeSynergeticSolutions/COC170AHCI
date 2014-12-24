// Bundled with Fusion v0.1



/*
 * File: require_jquery.js
 */
if(typeof jQuery === 'undefined') {
	//document.write is evil but is necessary in this case in order to include jquery before direct.js and george.js has been loaded.
	//document.write('<scr' + 'ipt src="' + mw_global_config.asset_host + "javascript/vendor/jquery-1.7.2.min.js" + '"></'+'scr' + 'ipt>'); // ADG-850 Fix
}


/*
 * File: http://d1topzp4nao5hp.cloudfront.net/uranium-upload/0.1.123/uranium-pretty.js
 */
(function () {
/**
  Basics
  ======
    
    xui is available as the global `x$` function. It accepts a CSS selector string or DOM element, or an array of a mix of these, as parameters,
    and returns the xui object. For example:
    
        var header = x$('#header'); // returns the element with id attribute equal to "header".
        
    For more information on CSS selectors, see the [W3C specification](http://www.w3.org/TR/CSS2/selector.html). Please note that there are
    different levels of CSS selector support (Levels 1, 2 and 3) and different browsers support each to different degrees. Be warned!
    
  The functions described in the docs are available on the xui object and often manipulate or retrieve information about the elements in the
  xui collection.

*/
var undefined,
    xui,
    window     = this,
    string     = new String('string'), // prevents Goog compiler from removing primative and subsidising out allowing us to compress further
    document   = window.document,      // obvious really
    simpleExpr = /^#?([\w-]+)$/,   // for situations of dire need. Symbian and the such        
    idExpr     = /^#/,
    tagExpr    = /<([\w:]+)/, // so you can create elements on the fly a la x$('<img href="/foo" /><strong>yay</strong>')
    slice      = function (e) { return [].slice.call(e, 0); };
    try { var a = slice(document.documentElement.childNodes)[0].nodeType; }
    catch(e){ slice = function (e) { var ret=[]; for (var i=0; e[i]; i++) ret.push(e[i]); return ret; }; }

window.x$ = window.xui = xui = function(q, context) {
    return new xui.fn.find(q, context);
};

// patch in forEach to help get the size down a little and avoid over the top currying on event.js and dom.js (shortcuts)
if (! [].forEach) {
    Array.prototype.forEach = function(fn) {
        var len = this.length || 0,
            i = 0,
            that = arguments[1]; // wait, what's that!? awwww rem. here I thought I knew ya!
                                 // @rem - that that is a hat tip to your thats :)

        if (typeof fn == 'function') {
            for (; i < len; i++) {
                fn.call(that, this[i], i, this);
            }
        }
    };
}
/*
 * Array Remove - By John Resig (MIT Licensed) 
 */
function removex(array, from, to) {
    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from: from;
    return array.push.apply(array, rest);
}

// converts all CSS style names to DOM style names, i.e. margin-left to marginLeft
function domstyle(name) {
  return name.replace(/\-[a-z]/g,function(m) { return m[1].toUpperCase(); });
}

// converts all DOM style names to CSS style names, i.e. marginLeft to margin-left
function cssstyle(name) {
  return name.replace(/[A-Z]/g, function(m) { return '-'+m.toLowerCase(); })
}

xui.fn = xui.prototype = {

/**
  extend
  ------

  Extends XUI's prototype with the members of another object.

  ### syntax ###

    xui.extend( object );

  ### arguments ###

  - object `Object` contains the members that will be added to XUI's prototype.
 
  ### example ###

  Given:

    var sugar = {
        first: function() { return this[0]; },
        last:  function() { return this[this.length - 1]; }
    }

  We can extend xui's prototype with members of `sugar` by using `extend`:

    xui.extend(sugar);

  Now we can use `first` and `last` in all instances of xui:

    var f = x$('.button').first();
    var l = x$('.notice').last();
*/
    extend: function(o) {
        for (var i in o) {
            xui.fn[i] = o[i];
        }
    },

/**
  find
  ----

  Find the elements that match a query string. `x$` is an alias for `find`.

  ### syntax ###

    x$( window ).find( selector, context );

  ### arguments ###

  - selector `String` is a CSS selector that will query for elements.
  - context `HTMLElement` is the parent element to search from _(optional)_.
 
  ### example ###

  Given the following markup:

    <ul id="first">
        <li id="one">1</li>
        <li id="two">2</li>
    </ul>
    <ul id="second">
        <li id="three">3</li>
        <li id="four">4</li>
    </ul>

  We can select list items using `find`:

    x$('li');                 // returns all four list item elements.
    x$('#second').find('li'); // returns list items "three" and "four"
*/
    find: function(q, context) {
        var ele = [], tempNode;
            
        if (!q) {
            return this;
        } else if (context == undefined && this.length) {
            ele = this.each(function(el) {
                ele = ele.concat(slice(xui(q, el)));
            }).reduce(ele);
        } else {
            context = context || document;
            // fast matching for pure ID selectors and simple element based selectors
            if (typeof q == string) {
              if (simpleExpr.test(q) && context.getElementById && context.getElementsByTagName) {
                  ele = idExpr.test(q) ? [context.getElementById(q.substr(1))] : context.getElementsByTagName(q);
                  // nuke failed selectors
                  if (ele[0] == null) { 
                    ele = [];
                  }
              // match for full html tags to create elements on the go
              } else if (tagExpr.test(q)) {
                  tempNode = document.createElement('i');
                  tempNode.innerHTML = q;
                  slice(tempNode.childNodes).forEach(function (el) {
                    ele.push(el);
                  });
              } else {
                  // one selector, check if Sizzle is available and use it instead of querySelectorAll.
                  if (window.Sizzle !== undefined) {
                    ele = Sizzle(q, context);
                  } else {
                    ele = context.querySelectorAll(q);
                  }
              }
              // blanket slice
              ele = slice(ele);
            } else if (q instanceof Array) {
                ele = q;
            } else if (q.nodeName || q === window) { // only allows nodes in
                // an element was passed in
                ele = [q];
            } else if (q.toString() == '[object NodeList]' ||
q.toString() == '[object HTMLCollection]' || typeof q.length == 'number') {
                ele = slice(q);
            }
        }
        // disabling the append style, could be a plugin (found in more/base):
        // xui.fn.add = function (q) { this.elements = this.elements.concat(this.reduce(xui(q).elements)); return this; }
        return this.set(ele);
    },

/**
  set
  ---

  Sets the objects in the xui collection.

  ### syntax ###

    x$( window ).set( array );
*/
    set: function(elements) {
        var ret = xui();
        ret.cache = slice(this.length ? this : []);
        ret.length = 0;
        [].push.apply(ret, elements);
        return ret;
    },

/**
  reduce
  ------

  Reduces the set of elements in the xui object to a unique set.

  ### syntax ###

    x$( window ).reduce( elements, index );

  ### arguments ###

  - elements `Array` is an array of elements to reduce _(optional)_.
  - index `Number` is the last array index to include in the reduction. If unspecified, it will reduce all elements _(optional)_.
*/
    reduce: function(elements, b) {
        var a = [],
        elements = elements || slice(this);
        elements.forEach(function(el) {
            // question the support of [].indexOf in older mobiles (RS will bring up 5800 to test)
            if (a.indexOf(el, 0, b) < 0)
            a.push(el);
        });

        return a;
    },

/**
  has
  ---

  Returns the elements that match a given CSS selector.

  ### syntax ###

    x$( window ).has( selector );

  ### arguments ###

  - selector `String` is a CSS selector that will match all children of the xui collection.

  ### example ###

  Given:

    <div>
        <div class="round">Item one</div>
        <div class="round">Item two</div>
    </div>
  
  We can use `has` to select specific objects:

    var divs    = x$('div');          // got all three divs.
    var rounded = divs.has('.round'); // got two divs with the class .round
*/
     has: function(q) {
         var list = xui(q);
         return this.filter(function () {
             var that = this;
             var found = null;
             list.each(function (el) {
                 found = (found || el == that);
             });
             return found;
         });
     },

/**
  filter
  ------

  Extend XUI with custom filters. This is an interal utility function, but is also useful to developers.

  ### syntax ###

    x$( window ).filter( fn );

  ### arguments ###

  - fn `Function` is called for each element in the XUI collection.

          // `index` is the array index of the current element
          function( index ) {
              // `this` is the element iterated on
              // return true to add element to new XUI collection
          }

  ### example ###

  Filter all the `<input />` elements that are disabled:

    x$('input').filter(function(index) {
        return this.checked;
    });
*/
    filter: function(fn) {
        var elements = [];
        return this.each(function(el, i) {
            if (fn.call(el, i)) elements.push(el);
        }).set(elements);
    },

/**
  not
  ---

  The opposite of `has`. It modifies the elements and returns all of the elements that do __not__ match a CSS query.

  ### syntax ###

    x$( window ).not( selector );

  ### arguments ###

  - selector `String` a CSS selector for the elements that should __not__ be matched.

  ### example ###

  Given:

    <div>
        <div class="round">Item one</div>
        <div class="round">Item two</div>
        <div class="square">Item three</div>
        <div class="shadow">Item four</div>
    </div>

  We can use `not` to select objects:

    var divs     = x$('div');          // got all four divs.
    var notRound = divs.not('.round'); // got two divs with classes .square and .shadow
*/
    not: function(q) {
        var list = slice(this),
            omittedNodes = xui(q);
        if (!omittedNodes.length) {
            return this;
        }
        return this.filter(function(i) {
            var found;
            omittedNodes.each(function(el) {
                return found = list[i] != el;
            });
            return found;
        });
    },

/**
  each
  ----

  Element iterator for an XUI collection.

  ### syntax ###

    x$( window ).each( fn )

  ### arguments ###

  - fn `Function` callback that is called once for each element.

        // `element` is the current element
        // `index` is the element index in the XUI collection
        // `xui` is the XUI collection.
        function( element, index, xui ) {
            // `this` is the current element
        }

  ### example ###

    x$('div').each(function(element, index, xui) {
        alert("Here's the " + index + " element: " + element);
    });
*/
    each: function(fn) {
        // we could compress this by using [].forEach.call - but we wouldn't be able to support
        // fn return false breaking the loop, a feature I quite like.
        for (var i = 0, len = this.length; i < len; ++i) {
            if (fn.call(this[i], this[i], i, this) === false)
            break;
        }
        return this;
    }
};

xui.fn.find.prototype = xui.fn;
xui.extend = xui.fn.extend;
/**
  DOM
  ===

  Set of methods for manipulating the Document Object Model (DOM).

*/
xui.extend({
/**
  html
  ----

  Manipulates HTML in the DOM. Also just returns the inner HTML of elements in the collection if called with no arguments.

  ### syntax ###

    x$( window ).html( location, html );

  or this method will accept just a HTML fragment with a default behavior of inner:

    x$( window ).html( html );

  or you can use shorthand syntax by using the location name argument as the function name:

    x$( window ).outer( html );
    x$( window ).before( html );
  
  or you can just retrieve the inner HTML of elements in the collection with:
  
      x$( document.body ).html();

  ### arguments ###

  - location `String` can be one of: _inner_, _outer_, _top_, _bottom_, _remove_, _before_ or _after_.
  - html `String` is a string of HTML markup or a `HTMLElement`.

  ### example ###

    x$('#foo').html('inner', '<strong>rock and roll</strong>');
    x$('#foo').html('outer', '<p>lock and load</p>');
    x$('#foo').html('top',   '<div>bangers and mash</div>');
    x$('#foo').html('bottom','<em>mean and clean</em>');
    x$('#foo').html('remove');
    x$('#foo').html('before', '<p>some warmup html</p>');
    x$('#foo').html('after',  '<p>more html!</p>');

  or

    x$('#foo').html('<p>sweet as honey</p>');
    x$('#foo').outer('<p>free as a bird</p>');
    x$('#foo').top('<b>top of the pops</b>');
    x$('#foo').bottom('<span>bottom of the barrel</span>');
    x$('#foo').before('<pre>first in line</pre>');
    x$('#foo').after('<marquee>better late than never</marquee>');
*/
    html: function(location, html) {
        clean(this);

        if (arguments.length == 0) {
            var i = [];
            this.each(function(el) {
                i.push(el.innerHTML);
            });
            return i;
        }
        if (arguments.length == 1 && arguments[0] != 'remove') {
            html = location;
            location = 'inner';
        }
        if (location != 'remove' && html && html.each !== undefined) {
            if (location == 'inner') {
                var d = document.createElement('p');
                html.each(function(el) {
                    d.appendChild(el);
                });
                this.each(function(el) {
                    el.innerHTML = d.innerHTML;
                });
            } else {
                var that = this;
                html.each(function(el){
                    that.html(location, el);
                });
            }
            return this;
        }
        return this.each(function(el) {
            var parent, 
                list, 
                len, 
                i = 0;
            if (location == "inner") { // .html
                if (typeof html == string || typeof html == "number") {
                    el.innerHTML = html;
                    list = el.getElementsByTagName('SCRIPT');
                    len = list.length;
                    for (; i < len; i++) {
                        eval(list[i].text);
                    }
                } else {
                    el.innerHTML = '';
                    el.appendChild(html);
                }
            } else {
              if (location == 'remove') {
                el.parentNode.removeChild(el);
              } else {
                var elArray = ['outer', 'top', 'bottom'],
                    wrappedE = wrapHelper(html, (elArray.indexOf(location) > -1 ? el : el.parentNode )),
                    children = wrappedE.childNodes;
                if (location == "outer") { // .replaceWith
                  el.parentNode.replaceChild(wrappedE, el);
                } else if (location == "top") { // .prependTo
                    el.insertBefore(wrappedE, el.firstChild);
                } else if (location == "bottom") { // .appendTo
                    el.insertBefore(wrappedE, null);
                } else if (location == "before") { // .insertBefore
                    el.parentNode.insertBefore(wrappedE, el);
                } else if (location == "after") { // .insertAfter
                    el.parentNode.insertBefore(wrappedE, el.nextSibling);
                }
                var parent = wrappedE.parentNode;
                while(children.length) {
                  parent.insertBefore(children[0], wrappedE);
                }
                parent.removeChild(wrappedE);
              }
            }
        });
    },

/**
  attr
  ----

  Gets or sets attributes on elements. If getting, returns an array of attributes matching the xui element collection's indices.

  ### syntax ###

    x$( window ).attr( attribute, value );

  ### arguments ###

  - attribute `String` is the name of HTML attribute to get or set.
  - value `Varies` is the value to set the attribute to. Do not use to get the value of attribute _(optional)_.

  ### example ###

  To get an attribute value, simply don't provide the optional second parameter:

    x$('.someClass').attr('class');

  To set an attribute, use both parameters:

    x$('.someClass').attr('disabled', 'disabled');
*/
    attr: function(attribute, val) {
        if (arguments.length == 2) {
            return this.each(function(el) {
                if (el.tagName && el.tagName.toLowerCase() == 'input' && attribute == 'value') el.value = val;
                else if (el.setAttribute) {
                  if (attribute == 'checked' && (val == '' || val == false || typeof val == "undefined")) el.removeAttribute(attribute);
                  else el.setAttribute(attribute, val);
                }
            });
        } else {
            var attrs = [];
            this.each(function(el) {
                if (el.tagName && el.tagName.toLowerCase() == 'input' && attribute == 'value') attrs.push(el.value);
                else if (el.getAttribute && el.getAttribute(attribute)) {
                    attrs.push(el.getAttribute(attribute));
                }
            });
            return attrs;
        }
    }
});
"inner outer top bottom remove before after".split(' ').forEach(function (method) {
  xui.fn[method] = function(where) { return function (html) { return this.html(where, html); }; }(method);
});
// private method for finding a dom element
function getTag(el) {
    return (el.firstChild === null) ? {'UL':'LI','DL':'DT','TR':'TD'}[el.tagName] || el.tagName : el.firstChild.tagName;
}

function wrapHelper(html, el) {
  if (typeof html == string) return wrap(html, getTag(el));
  else { var e = document.createElement('div'); e.appendChild(html); return e; }
}

// private method
// Wraps the HTML in a TAG, Tag is optional
// If the html starts with a Tag, it will wrap the context in that tag.
function wrap(xhtml, tag) {
  var e = document.createElement('div');
  e.innerHTML = xhtml;
  return e;
}

/*
* Removes all erronious nodes from the DOM.
* 
*/
function clean(collection) {
    var ns = /\S/;
    collection.each(function(el) {
        var d = el,
            n = d.firstChild,
            ni = -1,
            nx;
        while (n) {
            nx = n.nextSibling;
            if (n.nodeType == 3 && !ns.test(n.nodeValue)) {
                d.removeChild(n);
            } else {
                n.nodeIndex = ++ni; // FIXME not sure what this is for, and causes IE to bomb (the setter) - @rem
            }
            n = nx;
        }
    });
}
/**
  Event
  =====

  A good old fashioned events with new skool handling. Shortcuts exist for:

  - click
  - load
  - touchstart
  - touchmove
  - touchend
  - touchcancel
  - gesturestart
  - gesturechange
  - gestureend
  - orientationchange
  
*/
xui.events = {}; var cache = {};
xui.extend({

/**
  on
  --

  Registers a callback function to a DOM event on the element collection.

  ### syntax ###

    x$( 'button' ).on( type, fn );

  or

    x$( 'button' ).click( fn );

  ### arguments ###

  - type `String` is the event to subscribe (e.g. _load_, _click_, _touchstart_, etc).
  - fn `Function` is a callback function to execute when the event is fired.

  ### example ###

    x$( 'button' ).on( 'click', function(e) {
        alert('hey that tickles!');
    });

  or

    x$(window).load(function(e) {
      x$('.save').touchstart( function(evt) { alert('tee hee!'); }).css(background:'grey');
    });
*/
    on: function(type, fn, details) {
        return this.each(function (el) {
            if (xui.events[type]) {
                var id = _getEventID(el), 
                    responders = _getRespondersForEvent(id, type);
                
                details = details || {};
                details.handler = function (event, data) {
                    xui.fn.fire.call(xui(this), type, data);
                };
                
                // trigger the initialiser - only happens the first time around
                if (!responders.length) {
                    xui.events[type].call(el, details);
                }
            } 
            el.addEventListener(type, _createResponder(el, type, fn), false);
        });
    },

/**
  un
  --

  Unregisters a specific callback, or if no specific callback is passed in, 
  unregisters all event callbacks of a specific type.

  ### syntax ###

  Unregister the given function, for the given type, on all button elements:

    x$( 'button' ).un( type, fn );

  Unregisters all callbacks of the given type, on all button elements:

    x$( 'button' ).un( type );

  ### arguments ###

  - type `String` is the event to unsubscribe (e.g. _load_, _click_, _touchstart_, etc).
  - fn `Function` is the callback function to unsubscribe _(optional)_.

  ### example ###

    // First, create a click event that display an alert message
    x$('button').on('click', function() {
        alert('hi!');
    });
    
    // Now unsubscribe all functions that response to click on all button elements
    x$('button').un('click');

  or

    var greeting = function() { alert('yo!'); };
    
    x$('button').on('click', greeting);
    x$('button').on('click', function() {
        alert('hi!');
    });
    
    // When any button is clicked, the 'hi!' message will fire, but not the 'yo!' message.
    x$('button').un('click', greeting);
*/
    un: function(type, fn) {
        return this.each(function (el) {
            var id = _getEventID(el), responders = _getRespondersForEvent(id, type), i = responders.length;

            while (i--) {
                if (fn === undefined || fn.guid === responders[i].guid) {
                    el.removeEventListener(type, responders[i], false);
                    removex(cache[id][type], i, 1);
                }
            }

            if (cache[id][type].length === 0) delete cache[id][type];
            for (var t in cache[id]) {
                return;
            }
            delete cache[id];
        });
    },

/**
  fire
  ----

  Triggers a specific event on the xui collection.

  ### syntax ###

    x$( selector ).fire( type, data );

  ### arguments ###

  - type `String` is the event to fire (e.g. _load_, _click_, _touchstart_, etc).
  - data `Object` is a JSON object to use as the event's `data` property.

  ### example ###

    x$('button#reset').fire('click', { died:true });
    
    x$('.target').fire('touchstart');
*/
    fire: function (type, data) {
        return this.each(function (el) {
            if (el == document && !el.dispatchEvent)
                el = document.documentElement;

            var event = document.createEvent('HTMLEvents');
            event.initEvent(type, true, true);
            event.data = data || {};
            event.eventName = type;
          
            el.dispatchEvent(event);
        });
    }
});

"click load submit touchstart touchmove touchend touchcancel gesturestart gesturechange gestureend orientationchange".split(' ').forEach(function (event) {
  xui.fn[event] = function(action) { return function (fn) { return fn ? this.on(action, fn) : this.fire(action); }; }(event);
});

// patched orientation support - Andriod 1 doesn't have native onorientationchange events
xui(window).on('load', function() {
    if (!('onorientationchange' in document.body)) {
      (function (w, h) {
        xui(window).on('resize', function () {
          var portraitSwitch = (window.innerWidth < w && window.innerHeight > h) && (window.innerWidth < window.innerHeight),
              landscapeSwitch = (window.innerWidth > w && window.innerHeight < h) && (window.innerWidth > window.innerHeight);
          if (portraitSwitch || landscapeSwitch) {
            window.orientation = portraitSwitch ? 0 : 90; // what about -90? Some support is better than none
            xui('body').fire('orientationchange'); // will this bubble up?
            w = window.innerWidth;
            h = window.innerHeight;
          }
        });
      })(window.innerWidth, window.innerHeight);
    }
});

// this doesn't belong on the prototype, it belongs as a property on the xui object
xui.touch = (function () {
  try{
    return !!(document.createEvent("TouchEvent").initTouchEvent)
  } catch(e) {
    return false;
  };
})();

/**
  ready
  ----

  Event handler for when the DOM is ready. Thank you [domready](http://www.github.com/ded/domready)!

  ### syntax ###

    x$.ready(handler);

  ### arguments ###

  - handler `Function` event handler to be attached to the "dom is ready" event.

  ### example ###

    x$.ready(function() {
      alert('mah doms are ready');
    });

    xui.ready(function() {
      console.log('ready, set, go!');
    });
*/
xui.ready = function(handler) {
  domReady(handler);
}

// lifted from Prototype's (big P) event model
function _getEventID(element) {
    if (element._xuiEventID) return element._xuiEventID;
    return element._xuiEventID = ++_getEventID.id;
}

_getEventID.id = 1;

function _getRespondersForEvent(id, eventName) {
    var c = cache[id] = cache[id] || {};
    return c[eventName] = c[eventName] || [];
}

function _createResponder(element, eventName, handler) {
    var id = _getEventID(element), r = _getRespondersForEvent(id, eventName);

    var responder = function(event) {
        if (handler.call(element, event) === false) {
            event.preventDefault();
            event.stopPropagation();
        }
    };
    
    responder.guid = handler.guid = handler.guid || ++_getEventID.id;
    responder.handler = handler;
    r.push(responder);
    return responder;
}
/**
  Fx
  ==

  Animations, transforms, and transitions for getting the most out of hardware accelerated CSS.

*/

xui.extend({

/**
  Tween
  -----

  Transforms a CSS property's value.

  ### syntax ###

    x$( selector ).tween( properties, callback );

  ### arguments ###

  - properties `Object` or `Array` of CSS properties to tween.
      - `Object` is a JSON object that defines the CSS properties.
      - `Array` is a `Object` set that is tweened sequentially.
  - callback `Function` to be called when the animation is complete. _(optional)_.

  ### properties ###

  A property can be any CSS style, referenced by the JavaScript notation.

  A property can also be an option from [emile.js](https://github.com/madrobby/emile):

  - duration `Number` of the animation in milliseconds.
  - after `Function` is called after the animation is finished.
  - easing `Function` allows for the overriding of the built-in animation function.

      // Receives one argument `pos` that indicates position
      // in time between animation's start and end.
      function(pos) {
          // return the new position
          return (-Math.cos(pos * Math.PI) / 2) + 0.5;
      }

  ### example ###

    // one JSON object
    x$('#box').tween({ left:'100px', backgroundColor:'blue' });
    x$('#box').tween({ left:'100px', backgroundColor:'blue' }, function() {
        alert('done!');
    });
    
    // array of two JSON objects
    x$('#box').tween([{left:'100px', backgroundColor:'green', duration:.2 }, { right:'100px' }]); 
*/
  tween: function( props, callback ) {

    // creates an options obj for emile
    var emileOpts = function(o) {
      var options = {};
      "duration after easing".split(' ').forEach( function(p) {
        if (props[p]) {
            options[p] = props[p];
            delete props[p];
        }
      });
      return options;
    }

    // serialize the properties into a string for emile
    var serialize = function(props) {
      var serialisedProps = [], key;
      if (typeof props != string) {
        for (key in props) {
          serialisedProps.push(cssstyle(key) + ':' + props[key]);
        }
        serialisedProps = serialisedProps.join(';');
      } else {
        serialisedProps = props;
      }
      return serialisedProps;
    };

    // queued animations
    /* wtf is this?
    if (props instanceof Array) {
        // animate each passing the next to the last callback to enqueue
        props.forEach(function(a){
          
        });
    }
    */
    // this branch means we're dealing with a single tween
    var opts = emileOpts(props);
    var prop = serialize(props);
    
    return this.each(function(e){
      emile(e, prop, opts, callback);
    });
  }
});
/**
  Style
  =====

  Everything related to appearance. Usually, this is CSS.

*/
function hasClass(el, className) {
    return getClassRegEx(className).test(el.className);
}

// Via jQuery - used to avoid el.className = ' foo';
// Used for trimming whitespace
var rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;

function trim(text) {
  return (text || "").replace( rtrim, "" );
}

xui.extend({
/**
  setStyle
  --------

  Sets the value of a single CSS property.

  ### syntax ###

    x$( selector ).setStyle( property, value );

  ### arguments ###

  - property `String` is the name of the property to modify.
  - value `String` is the new value of the property.

  ### example ###

    x$('.flash').setStyle('color', '#000');
    x$('.button').setStyle('backgroundColor', '#EFEFEF');
*/
    setStyle: function(prop, val) {
        prop = domstyle(prop);
        return this.each(function(el) {
            el.style[prop] = val;
        });
    },

/**
  getStyle
  --------

  Returns the value of a single CSS property. Can also invoke a callback to perform more specific processing tasks related to the property value.
  Please note that the return type is always an Array of strings. Each string corresponds to the CSS property value for the element with the same index in the xui collection.

  ### syntax ###

    x$( selector ).getStyle( property, callback );

  ### arguments ###

  - property `String` is the name of the CSS property to get.
  - callback `Function` is called on each element in the collection and passed the property _(optional)_.

  ### example ###
        <ul id="nav">
            <li class="trunk" style="font-size:12px;background-color:blue;">hi</li>
            <li style="font-size:14px;">there</li>
        </ul>
        
    x$('ul#nav li.trunk').getStyle('font-size'); // returns ['12px']
    x$('ul#nav li.trunk').getStyle('fontSize'); // returns ['12px']
    x$('ul#nav li').getStyle('font-size'); // returns ['12px', '14px']
    
    x$('ul#nav li.trunk').getStyle('backgroundColor', function(prop) {
        alert(prop); // alerts 'blue' 
    });
*/
    getStyle: function(prop, callback) {
        // shortcut getComputedStyle function
        var s = function(el, p) {
            // this *can* be written to be smaller - see below, but in fact it doesn't compress in gzip as well, the commented
            // out version actually *adds* 2 bytes.
            // return document.defaultView.getComputedStyle(el, "").getPropertyValue(p.replace(/([A-Z])/g, "-$1").toLowerCase());
            return document.defaultView.getComputedStyle(el, "").getPropertyValue(cssstyle(p));
        }
        if (callback === undefined) {
          var styles = [];
          this.each(function(el) {styles.push(s(el, prop))});
          return styles;
        } else return this.each(function(el) { callback(s(el, prop)); });
    },

/**
  addClass
  --------

  Adds a class to all of the elements in the collection.

  ### syntax ###

    x$( selector ).addClass( className );

  ### arguments ###

  - className `String` is the name of the CSS class to add.

  ### example ###

    x$('.foo').addClass('awesome');
*/
    addClass: function(className) {
        var cs = className.split(' ');
        return this.each(function(el) {
            cs.forEach(function(clazz) {
              if (hasClass(el, clazz) === false) {
                el.className = trim(el.className + ' ' + clazz);
              }
            });
        });
    },

/**
  hasClass
  --------

  Checks if the class is on _all_ elements in the xui collection.

  ### syntax ###

    x$( selector ).hasClass( className, fn );

  ### arguments ###

  - className `String` is the name of the CSS class to find.
  - fn `Function` is a called for each element found and passed the element _(optional)_.

      // `element` is the HTMLElement that has the class
      function(element) {
          console.log(element);
      }

  ### example ###
        <div id="foo" class="foo awesome"></div>
        <div class="foo awesome"></div>
        <div class="foo"></div>
        
    // returns true
    x$('#foo').hasClass('awesome');
    
    // returns false (not all elements with class 'foo' have class 'awesome'),
    // but the callback gets invoked with the elements that did match the 'awesome' class
    x$('.foo').hasClass('awesome', function(element) {
        console.log('Hey, I found: ' + element + ' with class "awesome"');
    });
    
    // returns true (all DIV elements have the 'foo' class)
    x$('div').hasClass('foo');
*/
    hasClass: function(className, callback) {
        var self = this,
            cs = className.split(' ');
        return this.length && (function() {
                var hasIt = true;
                self.each(function(el) {
                  cs.forEach(function(clazz) {
                    if (hasClass(el, clazz)) {
                        if (callback) callback(el);
                    } else hasIt = false;
                  });
                });
                return hasIt;
            })();
    },

/**
  removeClass
  -----------

  Removes the specified class from all elements in the collection. If no class is specified, removes all classes from the collection.

  ### syntax ###

    x$( selector ).removeClass( className );

  ### arguments ###

  - className `String` is the name of the CSS class to remove. If not specified, then removes all classes from the matched elements. _(optional)_

  ### example ###

    x$('.foo').removeClass('awesome');
*/
    removeClass: function(className) {
        if (className === undefined) this.each(function(el) { el.className = ''; });
        else {
          var cs = className.split(' ');
          this.each(function(el) {
            cs.forEach(function(clazz) {
              el.className = trim(el.className.replace(getClassRegEx(clazz), '$1'));
            });
          });
        }
        return this;
    },

/**
  toggleClass
  -----------

  Removes the specified class if it exists on the elements in the xui collection, otherwise adds it. 

  ### syntax ###

    x$( selector ).toggleClass( className );

  ### arguments ###

  - className `String` is the name of the CSS class to toggle.

  ### example ###
        <div class="foo awesome"></div>
        
    x$('.foo').toggleClass('awesome'); // div above loses its awesome class.
*/
    toggleClass: function(className) {
        var cs = className.split(' ');
        return this.each(function(el) {
            cs.forEach(function(clazz) {
              if (hasClass(el, clazz)) el.className = trim(el.className.replace(getClassRegEx(clazz), '$1'));
              else el.className = trim(el.className + ' ' + clazz);
            });
        });
    },
    
/**
  css
  ---

  Set multiple CSS properties at once.

  ### syntax ###

    x$( selector ).css( properties );

  ### arguments ###

  - properties `Object` is a JSON object that defines the property name/value pairs to set.

  ### example ###

    x$('.foo').css({ backgroundColor:'blue', color:'white', border:'2px solid red' });
*/
    css: function(o) {
        for (var prop in o) {
            this.setStyle(prop, o[prop]);
        }
        return this;
    }
});

// RS: now that I've moved these out, they'll compress better, however, do these variables
// need to be instance based - if it's regarding the DOM, I'm guessing it's better they're
// global within the scope of xui

// -- private methods -- //
var reClassNameCache = {},
    getClassRegEx = function(className) {
        var re = reClassNameCache[className];
        if (!re) {
            // Preserve any leading whitespace in the match, to be used when removing a class
            re = new RegExp('(^|\\s+)' + className + '(?:\\s+|$)');
            reClassNameCache[className] = re;
        }
        return re;
    };
/**
  XHR
  ===

  Everything related to remote network connections.

 */
xui.extend({  
/**
  xhr
  ---

  The classic `XMLHttpRequest` sometimes also known as the Greek hero: _Ajax_. Not to be confused with _AJAX_ the cleaning agent.

  ### detail ###

  This method has a few new tricks.

  It is always invoked on an element collection and uses the behaviour of `html`.

  If there is no callback, then the `responseText` will be inserted into the elements in the collection.

  ### syntax ###

    x$( selector ).xhr( location, url, options )

  or accept a url with a default behavior of inner:

    x$( selector ).xhr( url, options );

  or accept a url with a callback:
  
    x$( selector ).xhr( url, fn );

  ### arguments ###

  - location `String` is the location to insert the `responseText`. See `html` for values.
  - url `String` is where to send the request.
  - fn `Function` is called on status 200 (i.e. success callback).
  - options `Object` is a JSON object with one or more of the following:
    - method `String` can be _get_, _put_, _delete_, _post_. Default is _get_.
    - async `Boolean` enables an asynchronous request. Defaults to _false_.
    - data `String` is a url encoded string of parameters to send.
                - error `Function` is called on error or status that is not 200. (i.e. failure callback).
    - callback `Function` is called on status 200 (i.e. success callback).
    - headers `Object` is a JSON object with key:value pairs that get set in the request's header set.

  ### response ###

  - The response is available to the callback function as `this`.
  - The response is not passed into the callback.
  - `this.reponseText` will have the resulting data from the file.

  ### example ###

    x$('#status').xhr('inner', '/status.html');
    x$('#status').xhr('outer', '/status.html');
    x$('#status').xhr('top',   '/status.html');
    x$('#status').xhr('bottom','/status.html');
    x$('#status').xhr('before','/status.html');
    x$('#status').xhr('after', '/status.html');

  or

    // same as using 'inner'
    x$('#status').xhr('/status.html');

    // define a callback, enable async execution and add a request header
    x$('#left-panel').xhr('/panel', {
        async: true,
        callback: function() {
            alert("The response is " + this.responseText);
        },
        headers:{
            'Mobile':'true'
        }
    });

    // define a callback with the shorthand syntax
    x$('#left-panel').xhr('/panel', function() {
        alert("The response is " + this.responseText);
    });
*/
    xhr:function(location, url, options) {

      // this is to keep support for the old syntax (easy as that)
    if (!/^(inner|outer|top|bottom|before|after)$/.test(location)) {
            options = url;
            url = location;
            location = 'inner';
        }

        var o = options ? options : {};
        
        if (typeof options == "function") {
            // FIXME kill the console logging
            // console.log('we been passed a func ' + options);
            // console.log(this);
            o = {};
            o.callback = options;
        };
        
        var that   = this,
            req    = new XMLHttpRequest(),
            method = o.method || 'get',
            async  = (typeof o.async != 'undefined'?o.async:true),
            params = o.data || null,
            key;

        req.queryString = params;
        req.open(method, url, async);

        // Set "X-Requested-With" header
        req.setRequestHeader('X-Requested-With','XMLHttpRequest');

        if (method.toLowerCase() == 'post') req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

        for (key in o.headers) {
            if (o.headers.hasOwnProperty(key)) {
              req.setRequestHeader(key, o.headers[key]);
            }
        }

        req.handleResp = (o.callback != null) ? o.callback : function() { that.html(location, req.responseText); };
        req.handleError = (o.error && typeof o.error == 'function') ? o.error : function () {};
        function hdl(){
            if(req.readyState==4) {
                delete(that.xmlHttpRequest);
                if(req.status===0 || req.status==200) req.handleResp(); 
                if((/^[45]/).test(req.status)) req.handleError();
            }
        }
        if(async) {
            req.onreadystatechange = hdl;
            this.xmlHttpRequest = req;
        }
        req.send(params);
        if(!async) hdl();

        return this;
    }
});
// emile.js (c) 2009 Thomas Fuchs
// Licensed under the terms of the MIT license.

(function(emile, container){
  var parseEl = document.createElement('div'),
    props = ('backgroundColor borderBottomColor borderBottomWidth borderLeftColor borderLeftWidth '+
    'borderRightColor borderRightWidth borderSpacing borderTopColor borderTopWidth bottom color fontSize '+
    'fontWeight height left letterSpacing lineHeight marginBottom marginLeft marginRight marginTop maxHeight '+
    'maxWidth minHeight minWidth opacity outlineColor outlineOffset outlineWidth paddingBottom paddingLeft '+
    'paddingRight paddingTop right textIndent top width wordSpacing zIndex').split(' ');

  function interpolate(source,target,pos){ return (source+(target-source)*pos).toFixed(3); }
  function s(str, p, c){ return str.substr(p,c||1); }
  function color(source,target,pos){
    var i = 2, j, c, tmp, v = [], r = [];
    while(j=3,c=arguments[i-1],i--)
      if(s(c,0)=='r') { c = c.match(/\d+/g); while(j--) v.push(~~c[j]); } else {
        if(c.length==4) c='#'+s(c,1)+s(c,1)+s(c,2)+s(c,2)+s(c,3)+s(c,3);
        while(j--) v.push(parseInt(s(c,1+j*2,2), 16)); }
    while(j--) { tmp = ~~(v[j+3]+(v[j]-v[j+3])*pos); r.push(tmp<0?0:tmp>255?255:tmp); }
    return 'rgb('+r.join(',')+')';
  }
  
  function parse(prop){
    var p = parseFloat(prop), q = prop.replace(/^[\-\d\.]+/,'');
    return isNaN(p) ? { v: q, f: color, u: ''} : { v: p, f: interpolate, u: q };
  }
  
  function normalize(style){
    var css, rules = {}, i = props.length, v;
    parseEl.innerHTML = '<div style="'+style+'"></div>';
    css = parseEl.childNodes[0].style;
    while(i--) if(v = css[props[i]]) rules[props[i]] = parse(v);
    return rules;
  }  
  
  container[emile] = function(el, style, opts, after){
    el = typeof el == 'string' ? document.getElementById(el) : el;
    opts = opts || {};
    var target = normalize(style), comp = el.currentStyle ? el.currentStyle : getComputedStyle(el, null),
      prop, current = {}, start = +new Date, dur = opts.duration||200, finish = start+dur, interval,
      easing = opts.easing || function(pos){ return (-Math.cos(pos*Math.PI)/2) + 0.5; };
    for(prop in target) current[prop] = parse(comp[prop]);
    interval = setInterval(function(){
      var time = +new Date, pos = time>finish ? 1 : (time-start)/dur;
      for(prop in target)
        el.style[prop] = target[prop].f(current[prop].v,target[prop].v,easing(pos)) + target[prop].u;
      if(time>finish) { clearInterval(interval); opts.after && opts.after(); after && setTimeout(after,1); }
    },10);
  }
})('emile', this);
!function (context, doc) {
  var fns = [], ol, fn, f = false,
      testEl = doc.documentElement,
      hack = testEl.doScroll,
      domContentLoaded = 'DOMContentLoaded',
      addEventListener = 'addEventListener',
      onreadystatechange = 'onreadystatechange',
      loaded = /^loade|c/.test(doc.readyState);

  function flush(i) {
    loaded = 1;
    while (i = fns.shift()) { i() }
  }
  doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
    doc.removeEventListener(domContentLoaded, fn, f);
    flush();
  }, f);


  hack && doc.attachEvent(onreadystatechange, (ol = function () {
    if (/^c/.test(doc.readyState)) {
      doc.detachEvent(onreadystatechange, ol);
      flush();
    }
  }));

  context['domReady'] = hack ?
    function (fn) {
      self != top ?
        loaded ? fn() : fns.push(fn) :
        function () {
          try {
            testEl.doScroll('left');
          } catch (e) {
            return setTimeout(function() { context['domReady'](fn) }, 50);
          }
          fn();
        }()
    } :
    function (fn) {
      loaded ? fn() : fns.push(fn);
    };

}(this, document);
})();

xui.extend({
	/**
	 * Adds more DOM nodes to the existing element list.
	 */
	add: function(q) {
	  [].push.apply(this, slice(xui(q)));
	  return this.set(this.reduce());
	},

	/**
	 * Pops the last selector from XUI
	 */
	end: function () {	
		return this.set(this.cache || []);	 	
	},
  /**
   * Sets the `display` CSS property to `block`.
   */
  show:function() {
    return this.setStyle('display','block');
  },
  /**
   * Sets the `display` CSS property to `none`.
   */
  hide:function() {
    return this.setStyle('display','none');
  }
});

xui.extend({
   fade:function(to, callback) {
       var target = 0;
       if (typeof to == 'string' && to == 'in') target = 1;
       else if (typeof to == 'number') target = to;
       return this.tween({opacity:target,duration:.2}, callback);
   } 
});

if(typeof(Ur) == "undefined") {
  Ur = {
    QuickLoaders: {},
    WindowLoaders: {},
    Widgets: {},
    onLoadCallbacks: [],
    // Make an easy function that initializes all widgets for a given fragment:
    setup: function(fragment) {
      // Hacky:
      Ur.initialize({type: "DOMContentLoaded"}, fragment);

      if(Ur.loaded) {
        // These widgets _cant_ be initialized till page load
        Ur.initialize({type: "load"}, fragment);
      } else {
        window.addEventListener("load", function(e) { Ur.initialize(e, fragment)}, false);
      }
    },
    initialize: function(event, fragment) {
      var Loaders = (event.type == "DOMContentLoaded") ? Ur.QuickLoaders : Ur.WindowLoaders;
      if(fragment === undefined) {
        fragment = document.body;
      }
      
      for(var name in Loaders) {
        var widget = new Loaders[name];
        widget.initialize(fragment);
      }

      if(event.type == "load") {
        Ur.loaded = true;
        Ur._onLoad();
      }
    },
    error: function(msg) {
      console.error("Uranium: " + msg);
    },
    warn: function(msg) {
      console.warn("Uranium: " + msg);
    },
    // TODO: Make private
    _onLoad: function() {
      //iterate through the callbacks
      x$().iterate(
        Ur.onLoadCallbacks,
        function(callback) {
          callback();
        }
      );
    },
    loaded: false
  };
}

// This event is compatible with FF/Webkit

window.addEventListener("load", Ur.initialize, false);
window.addEventListener("DOMContentLoaded", Ur.initialize, false);

// Do this? OR just initialize as widgets are defined (and have uranium included at the bottom --- but that has limitations in inline JS using all of our x$() mixins) --> I think thats reason enough to try this for now


// Here's an example of initializing a fragment manually:
// Ur.setup("div.test");
// You have to be careful what you select since it searches within for components -- if your selector just matches the components individually, this will fail

// Now, you can re-initialize html fragments like so (After I refactor the widget initializers to search within fragments)
// x$(elem).on('click', Ur.Loaders['zoom-preview'].intialize(fragment));
// or 
// x$(elem).on('click', Ur.initialize(fragment));

var mixins = {
  // Grabbed this from xui's forEach defn
  iterate: function(stuff, fn) {
    if (stuff === undefined) {
      return;
    }
    var len = stuff.length || 0,
    i = 0,
    that = arguments[1];

    if (typeof fn == "function") {
      for (; i < len; i++) {
        fn.call(that, stuff[i], i, stuff);
      }
    }
  },
  offset: function(elm) {
    if (elm == undefined)
      elm = this[0];
    
    var cumulative_top = 0, cumulative_left = 0;
    while (elm.offsetParent) {
      cumulative_top += elm.offsetTop;
      cumulative_left += elm.offsetLeft;
      elm = elm.offsetParent;
    }
    return {left: cumulative_left, top: cumulative_top};
  },
  
  // TODO: Make private:
  findNextAncestor: function(elem, type) {
    //check to make sure there's still a parent:
    if (elem.parentNode != window.document) {
      return x$().findSetAncestor(elem.parentNode, type);
    } else {
      return null;
    }
  },

  findSetAncestor: function(elem, type) {
    var set_name = x$(elem).attr("data-ur-set")[0];
    if (set_name !== undefined && (type == undefined || set_name == type))
      return elem;
    return x$().findNextAncestor(elem, type);
  },

  get_unique_uranium_id: (function() {
    var count = 0;
    return function get_id() {
      count += 1;
      return count;
    }
  })(),

  findElements: function(type, component_constructors) {
    var groups = {};

    this.each(
      (function(type, constructors, groups) {
        return function() {x$().helper_find(this, type, constructors, groups)};
      })(type, component_constructors, groups));

    return groups;
  },
  // TODO: Make helper_find() private since its just a helper function
  helper_find: function(fragment, type, component_constructors, groups) {
    var all_elements = x$(fragment).find("*[data-ur-" + type + "-component]");

    all_elements.each(function() {

      var valid_component = true;

      ///////// Resolve this component to its set ///////////

      // Check if this has the data-ur-id attribute
      var my_set_id = x$(this).attr("data-ur-id")[0];

      if (my_set_id !== undefined) {
        if ( groups[my_set_id] === undefined) {
          groups[my_set_id] = {};
        }
      }
      else {
        //Find any set ancestors
        var my_ancestor = x$().findSetAncestor(this, type);

        var widget_disabled = x$(my_ancestor).attr("data-ur-state")[0];
        if (widget_disabled === "disabled" && Ur.loaded == false) {
          return;
        }

        if (my_ancestor !== null) {
          // Check if the set has an id ... if not, 'set' it up -- HA

          my_set_id = x$(my_ancestor).attr("data-ur-id")[0];

          if (my_set_id === undefined) {
            //generate ID
            my_set_id = x$().get_unique_uranium_id();
            x$(my_ancestor).attr("data-ur-id", my_set_id);
          }

          if (groups[my_set_id] === undefined) {
            //setup group
            groups[my_set_id] = {};
          }
          
          groups[my_set_id]["set"] = my_ancestor;

        }
        else {
          // we're screwed ... report an error
          Ur.error("couldn't find associated ur-set for component:");
          console.log(this);
          valid_component = false;
        }
      }

      //////////// Add this component to its set /////////////

      var component_type = x$(this).attr("data-ur-" + type + "-component");

      if (component_type === undefined) {
        valid_component = false;
      }

      if (valid_component) {
        // This is widget specific behavior
        // -- For toggler, it makes sense for content to be multiple things
        // -- For select-lists, it doesn't
        if (component_constructors !== undefined && component_constructors[component_type] !== undefined)
          component_constructors[component_type](groups[my_set_id], this, component_type);
        else
          groups[my_set_id][component_type] = this;
      }
    });

    return groups;
  }
}

xui.extend(mixins);

/* Carousel  *
 * * * * * * *
 * The carousel is a widget to allow for horizontally scrolling
 * (with touch or buttons) between a set of items.
 *
 * The only assumption is about the items' style -- they must be
 * float: left; so that the real width can be accurately totalled.
 */

Ur.WindowLoaders["carousel"] = (function() {

  function Carousel(components) {
    var self = this;
    
    this.container = components["view_container"];
    this.items = components["scroll_container"];
    if (this.items.length == 0) {
      Ur.error("carousel missing item components");
      return false;
    }

    // Optionally:
    this.button = components["button"] === undefined ? {} : components["button"];
    this.count = components["count"];
    this.dots = components["dots"];

    this.flag = {
      click: false,
      increment: false,
      loop: false,
      lock: null,
      timeoutId: null,
      touched: false
    };

    this.options = {
      autoscroll: true,
      autoscrollDelay: 5000,
      autoscrollForward: true,
      center: true,
      cloneLength: 1,
      fill: 0,
      infinite: true,
      speed: 1.1,
      transform3d: true,
      touch: true,
      verticalScroll: true
    };
    
    this.itemIndex = 0;
    this.translate = 0;
    
    var $container = x$(this.container);
    var preCoords = {x: 0, y: 0};
    var startPos = {x: 0, y: 0}, endPos = {x: 0, y: 0};
    
    var snapWidth = 0;
    
    var startingOffset = null;
    
    var translatePrefix = "translate3d(", translateSuffix = ", 0px)";
    
    function initialize() {
      // TODO:
      // add an internal event handler to handle all events on the container:
      // x$(self.container).on("event", self.handleEvent);

      readAttributes();

      if (!self.options.transform3d) {
        translatePrefix = "translate(";
        translateSuffix = ")";
      }

      x$(self.items).find("[data-ur-carousel-component='item']").each(function(obj, i) {
        if (x$(obj).attr("data-ur-state")[0] == "active")
          self.itemIndex = i;
      });

      if (self.options.infinite) {
        var items = x$(self.items).find("[data-ur-carousel-component='item']");
        self.realItemCount = items.length;
        for (var i = 0; i < self.options.cloneLength; i++) {
          var clone = items[i].cloneNode(true);
          x$(clone).attr("data-ur-clone", i).attr("data-ur-state", "inactive");
          items[items.length - 1].parentNode.appendChild(clone);
        }

        for (var i = items.length - self.options.cloneLength; i < items.length; i++) {
          var clone = items[i].cloneNode(true);
          x$(clone).attr("data-ur-clone", i).attr("data-ur-state", "inactive");
          items[0].parentNode.insertBefore(clone, items[0]);
        }
      }

      updateIndex(self.itemIndex + self.options.cloneLength);

      self.update();

      if (self.options.touch) {
        var hasTouch = "ontouchstart" in window;
        var start = hasTouch ? "touchstart" : "mousedown";
        var move = hasTouch ? "touchmove" : "mousemove";
        var end = hasTouch ? "touchend" : "mouseup";

        x$(self.items).on(start, startSwipe);
        x$(self.items).on(move, continueSwipe);
        x$(self.items).on(end, finishSwipe);
        x$(self.items).click(function(e) {if (!self.flag.click) stifle(e);});
      }

      x$(self.button["prev"]).click(function(){self.moveTo(1);});
      x$(self.button["next"]).click(function(){self.moveTo(-1);});

      x$(window).orientationchange(resize);
      // orientationchange isn't supported on some androids
      x$(window).on("resize", function() {
        resize();
        setTimeout(resize, 100);
      });

      self.autoscrollStart();
    }

    function readAttributes() {
      
      // translate3d is disabled on Android by default because it often causes problems
      // however, on some pages translate3d will work fine so the data-ur-android3d
      // attribute can be set to "enabled" to use translate3d since it can be smoother
      // on some Android devices

      var oldAndroid = /Android [12]/.test(navigator.userAgent);
      if (oldAndroid && $container.attr("data-ur-android3d")[0] != "enabled") {
        self.options.transform3d = false;
        var speed = parseFloat($container.attr("data-ur-speed"));
        self.options.speed = speed > 1 ? speed : 1.3;
      }

      $container.attr("data-ur-speed", self.options.speed);

      self.options.verticalScroll = $container.attr("data-ur-vertical-scroll")[0] != "disabled";
      $container.attr("data-ur-vertical-scroll", self.options.verticalScroll ? "enabled" : "disabled");

      self.options.touch = $container.attr("data-ur-touch")[0] != "disabled";
      $container.attr("data-ur-touch", self.options.touch ? "enabled" : "disabled");

      self.options.infinite = $container.attr("data-ur-infinite")[0] != "disabled";
      if ($container.find("[data-ur-carousel-component='item']").length == 1)
        self.options.infinite = false;
      $container.attr("data-ur-infinite", self.options.infinite ? "enabled" : "disabled");

      self.options.center = $container.attr("data-ur-center")[0] == "enabled";
      $container.attr("data-ur-center", self.options.center ? "enabled" : "disabled");

      var fill = parseInt($container.attr("data-ur-fill"));
      if (fill > 0)
        self.options.fill = fill;
      $container.attr("data-ur-fill", self.options.fill);

      var cloneLength = parseInt($container.attr("data-ur-clones"));
      if (!self.options.infinite)
        cloneLength = 0;
      else if (isNaN(cloneLength) || cloneLength < self.options.fill)
        cloneLength = Math.max(1, self.options.fill);
      self.options.cloneLength = cloneLength;
      $container.attr("data-ur-clones", self.options.cloneLength);

      self.options.autoscroll = $container.attr("data-ur-autoscroll")[0] == "enabled";
      $container.attr("data-ur-autoscroll", self.options.autoscroll ? "enabled" : "disabled");

      var autoscrollDelay = parseInt($container.attr("data-ur-autoscroll-delay"));
      if (autoscrollDelay >= 0)
        self.options.autoscrollDelay = autoscrollDelay;
      $container.attr("data-ur-autoscroll-delay", self.options.autoscrollDelay);

      self.options.autoscrollForward = $container.attr("data-ur-autoscroll-dir")[0] != "prev";
      $container.attr("data-ur-autoscroll-dir", self.options.autoscrollForward ? "next" : "prev");
    }

    function updateDots() {
      if (self.dots) {
        var existing = x$(self.dots).find("[data-ur-carousel-component='dot']");
        if (existing.length != self.realItemCount) {
          existing.remove();
          var dot = x$("<div data-ur-carousel-component='dot'></div>")[0];
          for (var i = 0; i < self.realItemCount; i++) {
            var new_dot = dot.cloneNode();
            if (i == self.itemIndex)
              x$(new_dot).attr("data-ur-state", "active");
            self.dots.appendChild(new_dot);
          }
        }
      }
    }

    function resize() {
      var offsetWidth = self.container.offsetWidth;
      if (snapWidth != offsetWidth && offsetWidth != 0)
        self.update();
    }

    this.update = function() {
      var oldWidth = snapWidth;
      snapWidth = self.container.offsetWidth;

      var oldCount = self.itemCount;
      var items = x$(self.items).find("[data-ur-carousel-component='item']");
      self.itemCount = items.length;

      if (oldCount != self.itemCount) {
        self.realItemCount = items.has(":not([data-ur-clone])").length;
        self.lastIndex = self.itemCount - 1;
        if (self.itemIndex > self.lastIndex)
          self.itemIndex = self.lastIndex;
        updateDots();
      }

      // Adjust the container to be the necessary width.
      var totalWidth = 0;

      var divisions = [];
      if (self.options.fill > 0) {
        var remainder = snapWidth;
        for (var i = self.options.fill; i > 0; i--) {
          var length = Math.round(remainder/i);
          divisions.push(length);
          remainder -= length;
        }
      }

      for (var i = 0; i < items.length; i++) {
        if (self.options.fill > 0) {
          var length = divisions[i % self.options.fill];
          items[i].style.width = length + "px";
          totalWidth += length;
        }
        else
          totalWidth += items[i].offsetWidth;
      }

      self.items.style.width = totalWidth + "px";

      var cumulativeOffset = -items[self.itemIndex].offsetLeft; // initial offset
      if (self.options.center) {
        var centerOffset = parseInt((snapWidth - items[self.itemIndex].offsetWidth)/2);
        cumulativeOffset += centerOffset; // CHECK
      }
      if (oldWidth)
        self.destinationOffset = cumulativeOffset;

      translateX(cumulativeOffset);
    };

    this.autoscrollStart = function() {
      if (!self.options.autoscroll)
        return;

      self.flag.timeoutId = setTimeout(function() {
        if (self.container.offsetWidth != 0) {
          if (!self.options.infinite && self.itemIndex == self.lastIndex && self.options.autoscrollForward)
            self.jumpToIndex(0);
          else if (!self.options.infinite && self.itemIndex == 0 && !self.options.autoscrollForward)
            self.jumpToIndex(self.lastIndex);
          else
            self.moveTo(self.options.autoscrollForward ? -1 : 1);
        }
        else
          self.autoscrollStart();
      }, self.options.autoscrollDelay);
    };

    this.autoscrollStop = function() {
      clearTimeout(self.flag.timeoutId);
    };

    function getEventCoords(event) {
      if (event.touches && event.touches.length > 0)
        return {x: event.touches[0].clientX, y: event.touches[0].clientY};
      else if (event.clientX != undefined)
        return {x: event.clientX, y: event.clientY};
      return null;
    }

    function updateButtons() {
      x$(self.button["prev"]).attr("data-ur-state", self.itemIndex == 0 ? "disabled" : "enabled");
      x$(self.button["next"]).attr("data-ur-state", self.itemIndex == self.itemCount - Math.max(self.options.fill, 1) ? "disabled" : "enabled");
    }

    function getNewIndex(direction) {
      var newIndex = self.itemIndex - direction;
      if (!self.options.infinite) {
        if (self.options.fill > 1 && newIndex > self.lastIndex - self.options.fill + 1)
          newIndex = self.lastIndex - self.options.fill + 1;
        else if (newIndex > self.lastIndex)
          newIndex = self.lastIndex;
        else if (newIndex < 0)
          newIndex = 0;
      }
      
      return newIndex;
    }

    function updateIndex(newIndex) {
      if (newIndex === undefined)
        return;

      self.itemIndex = newIndex;
      if (self.itemIndex < 0)
        self.itemIndex = 0;
      else if (self.itemIndex > self.lastIndex)
        self.itemIndex = self.lastIndex - 1;

      var realIndex = self.itemIndex;
      if (self.options.infinite)
        realIndex = (self.realItemCount + self.itemIndex - self.options.cloneLength) % self.realItemCount;
      if (self.count !== undefined)
        self.count.innerHTML = realIndex + 1 + " of " + self.realItemCount;

      x$(self.items).find("[data-ur-carousel-component='item'][data-ur-state='active']").attr("data-ur-state", "inactive");
      x$(x$(self.items).find("[data-ur-carousel-component='item']")[self.itemIndex]).attr("data-ur-state", "active");

      if (self.dots)
        x$(x$(self.dots).find("[data-ur-carousel-component='dot']").attr("data-ur-state", "inactive")[realIndex]).attr("data-ur-state", "active");

      updateButtons();

      $container.fire("slidestart", {index: realIndex});
    }

    function startSwipe(e) {
      if (!self.options.verticalScroll)
        stifle(e);
      self.autoscrollStop();

      self.flag.touched = true; // For non-touch environments
      self.flag.lock = null;
      self.flag.loop = false;
      self.flag.click = true;
      var coords = getEventCoords(e);
      preCoords.x = coords.x;
      preCoords.y = coords.y;

      if (coords !== null) {
        var translate = getTranslateX();

        if (startingOffset == null || self.destinationOffset == undefined)
          startingOffset = translate;
        else
          // Fast swipe
          startingOffset = self.destinationOffset; //Factor incomplete previous swipe
        
        startPos = endPos = coords;
      }
    }

    function continueSwipe(e) {
      if (!self.flag.touched) // For non-touch environments
        return;

      self.flag.click = false;

      var coords = getEventCoords(e);

      if (document.ontouchstart !== undefined && self.options.verticalScroll) {
        var slope = Math.abs((preCoords.y - coords.y)/(preCoords.x - coords.x));
        if (self.flag.lock) {
          if (self.flag.lock == "y")
            return;
        }
        else if (slope > 1.2) {
          self.flag.lock = "y";
          return;
        }
        else if (slope <= 1.2)
          self.flag.lock = "x";
        else
          return;
      }
      stifle(e);

      if (coords !== null) {
        endPos = coords;
        var dist = swipeDist() + startingOffset;

        if (self.options.infinite) {
          var items = x$(self.items).find("[data-ur-carousel-component='item']");
          var endLimit = items[self.lastIndex].offsetLeft + items[self.lastIndex].offsetWidth - self.container.offsetWidth;

          if (dist > 0) { // at the beginning of carousel
            var srcNode = items[self.realItemCount];
            var offset = srcNode.offsetLeft - items[0].offsetLeft;
            startingOffset -= offset;
            dist -= offset;
            self.flag.loop = !self.flag.loop;
          }
          else if (dist < -endLimit) {  // at the end of carousel
            var srcNode = items[self.lastIndex - self.realItemCount];
            var offset = srcNode.offsetLeft - items[self.lastIndex].offsetLeft;
            startingOffset -= offset;
            dist -= offset;
            self.flag.loop = !self.flag.loop;
          }
        }

        translateX(dist);
      }
    }

    function finishSwipe(e) {
      if (!self.flag.click || self.flag.lock)
        stifle(e);
      else if (e.target.tagName == "AREA")
        location.href = e.target.href;
      
      self.flag.touched = false; // For non-touch environments
      
      moveHelper(getDisplacementIndex());
    }
    
    function getDisplacementIndex() {
      var swipeDistance = swipeDist();
      var displacementIndex = zeroCeil(swipeDistance/x$(self.items).find("[data-ur-carousel-component='item']")[0].offsetWidth);
      return displacementIndex;
    }
    
    function snapTo(displacement) {
      self.destinationOffset = displacement + startingOffset;
      var maxOffset = -1*self.lastIndex*snapWidth;
      var minOffset = parseInt((snapWidth - x$(self.items).find("[data-ur-carousel-component='item']")[0].offsetWidth)/2);

      if (self.options.infinite)
        maxOffset = -self.items.offsetWidth;
      if (self.destinationOffset < maxOffset || self.destinationOffset > minOffset) {
        if (Math.abs(self.destinationOffset - maxOffset) < 1) {
          // Hacky -- but there are rounding errors
          // I see this when I'm in multi-mode and using the buttons
          // This only seems to happen on the desktop browser -- ideally its removed at compile time
          self.destinationOffset = maxOffset;
        } else
          self.destinationOffset = minOffset;
      }

      momentum();
    }

    this.moveTo = function(direction) {
      // The animation isnt done yet
      if (self.flag.increment)
        return;

      startingOffset = getTranslateX();
      moveHelper(direction);
    };

    function moveHelper(direction) {
      self.autoscrollStop();

      var newIndex = getNewIndex(direction);
      
      var items = x$(self.items).find("[data-ur-carousel-component='item']");

      if (self.options.infinite) {
        var oldTransform = getTranslateX();
        var altTransform = oldTransform;

        if (newIndex < self.options.cloneLength) { // at the beginning of carousel
          var offset = items[self.options.cloneLength].offsetLeft - items[self.itemCount - self.options.cloneLength].offsetLeft;
          if (!self.flag.loop) {
            altTransform += offset;
            translateX(altTransform);
            startingOffset += offset;
          }
          newIndex += self.realItemCount;
          self.itemIndex = newIndex + direction;
        }
        else if (newIndex > self.lastIndex - self.options.cloneLength) { // at the end of carousel
          var offset = items[self.itemCount - self.options.cloneLength].offsetLeft - items[self.options.cloneLength].offsetLeft;
          if (!self.flag.loop) {
            altTransform += offset;
            translateX(altTransform);
            startingOffset += offset;
          }
          newIndex -= self.realItemCount;
          self.itemIndex = newIndex + direction;
        }
      }
      var newItem = items[newIndex];
      var currentItem = items[self.itemIndex];
      var displacement = currentItem.offsetLeft - newItem.offsetLeft; // CHECK
      if (self.options.center)
        displacement += (currentItem.offsetWidth - newItem.offsetWidth) / 2;
      setTimeout(function() {
        snapTo(displacement);
        updateIndex(newIndex);
      }, 0);
    }

    this.jumpToIndex = function(index) {
      self.moveTo(self.itemIndex - index);
    };

    function momentum() {
      if (self.flag.touched)
        return;

      self.flag.increment = false;

      var translate = getTranslateX();
      var distance = self.destinationOffset - translate;
      var increment = distance - zeroFloor(distance / self.options.speed);

      // Hacky -- this is for the desktop browser only -- to fix rounding errors
      // Ideally, this is removed at compile time
      if(Math.abs(increment) < 0.01)
        increment = 0;

      var newTransform = increment + translate;

      translateX(newTransform);

      if (increment != 0)
        self.flag.increment = true;

      if (self.flag.increment)
        setTimeout(momentum, 16);
      else {
        startingOffset = null;
        self.autoscrollStart();

        var itemIndex = self.itemIndex;
        x$(self.container).fire("slideend", {index: itemIndex});
      }
    }

    function swipeDist() {
      return endPos === undefined ? 0 : endPos.x - startPos.x;
    }
    
    function translateX(x) {
      self.translate = x;
      var items = self.items;
      items.style.webkitTransform = items.style.msTransform = items.style.OTransform = items.style.MozTransform = items.style.transform = translatePrefix + x + "px, 0px" + translateSuffix;
    }
    
    function getTranslateX() {
      return self.translate;
    }
    
    initialize();
  }

  // Private/Helper methods

  function zeroCeil(num) {
    return num <= 0 ? Math.floor(num) : Math.ceil(num);
  }

  function zeroFloor(num) {
    return num >= 0 ? Math.floor(num) : Math.ceil(num);
  }

  function stifle(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Private constructors
  var ComponentConstructors = {
    button: function(group, component, type) {
      if (group["button"] === undefined)
        group["button"] = {};

      var type = component.getAttribute("data-ur-carousel-button-type");

      // Declaration error
      if (type === undefined)
        Ur.error("malformed carousel button type on:" + component.outerHTML);

      group["button"][type] = component;

      // Maybe in the future I'll make it so any of the items can be the starting item
      x$(component).attr("data-ur-state", type == "prev" ? "disabled" : "enabled");
    }
  };
  function CarouselLoader(){}

  CarouselLoader.prototype.initialize = function(fragment) {
    var carousels = x$(fragment).findElements("carousel", ComponentConstructors);
    Ur.Widgets["carousel"] = {};
    for (var name in carousels) {
      var carousel = carousels[name];
      Ur.Widgets["carousel"][name] = new Carousel(carousel);
      x$(carousel["set"]).attr("data-ur-state", "enabled");
    }
  }

  return CarouselLoader;
})();

/* Flex Table *
 * * * * * *
 * The flex table widget will take a full-sized table and make it fit 
 * on a variety of different viewport sizes.  
 * 
 */

Ur.QuickLoaders['flex-table'] = (function(){
  
  // Add an enhanced class to the tables the we'll be modifying
  function addEnhancedClass(tbl) {
    x$(tbl).addClass("enhanced");
  }
  
  function flexTable(aTable, table_index) {
    // TODO :: Add the ability to pass in options
    this.options = {
      idprefix: 'col-',   // specify a prefix for the id/headers values
      persist: "persist", // specify a class assigned to column headers (th) that should always be present; the script not create a checkbox for these columns
      checkContainer: null // container element where the hide/show checkboxes will be inserted; if none specified, the script creates a menu
    };
    
    var self = this, 
        o = self.options,
        table = aTable.table,
        thead = aTable.head,
        tbody = aTable.body,
        hdrCols = x$(thead).find('th'),
        bodyRows = x$(tbody).find('tr'), 
        container = o.checkContainer ? x$(o.checkContainer) : x$('<div class="table-menu table-menu-hidden" ><ul /></div>');
        
    addEnhancedClass(table);
    
    hdrCols.each(function(elm, i){
      var th = x$(this),
          id = th.attr('id'),
          classes = th.attr('class');
      
      // assign an id to each header, if none is in the markup
      if (id.length === 0) {
        id = ( o.idprefix ? o.idprefix : "col-" ) + i;
        th.attr('id', id); 
      }
      
      // assign matching "headers" attributes to the associated cells
      // TEMP - needs to be edited to accommodate colspans
      bodyRows.each(function(e, j){
        var cells = x$(e).find("th, td");
        cells.each(function(cell, k) {
          if (cell.cellIndex == i) {
            x$(cell).attr('headers', id);
            if (classes.length !== 0) { x$(cell).addClass(classes[0]); };
          }
        });
      });
      
      // create the show/hide toggles
      if ( !th.hasClass(o.persist) ) {
        var toggle = x$('<li><input type="checkbox" name="toggle-cols" id="toggle-col-' +
                          i +  '-' + table_index +  '" value="' + id + '" /> <label for="toggle-col-' + i + '-' + table_index +  '">'
                          + th.html() +'</label></li>');
        container.find('ul').bottom(toggle);
        var tgl = toggle.find("input");
        
        tgl.on("change", function() {
          var input = x$(this),
              val = input.attr('value'),
              cols = x$("div[data-ur-id='" + table_index + "'] " + "#" + val[0] + ", " +
                        "div[data-ur-id='" + table_index + "'] " + "[headers=" + val[0] + "]");
          if (!this.checked) { 
            cols.addClass('ur_ft_hide'); 
            cols.removeClass("ur_ft_show"); }
          else { 
            cols.removeClass("ur_ft_hide"); 
            cols.addClass('ur_ft_show'); }
        });
        tgl.on("updateCheck", function(){
          if ( th.getStyle("display") == "table-cell" || th.getStyle("display") == "inline" ) {
            x$(this).attr("checked", true);
          }
          else {
            x$(this).attr("checked", false);
          }
        });
        tgl.fire("updateCheck");
      }
      
    }); // end hdrCols loop
    
    // Update the inputs' checked status
    x$(window).on('orientationchange', function() {
      container.find('input').fire('updateCheck');
    });
    x$(window).on('resize', function() {
      container.find('input').fire('updateCheck');
    });
    
    // Create a "Display" menu      
    if (!o.checkContainer) {
      var menuWrapper = x$('<div class="table-menu-wrapper"></div>'),
          popupBG = x$('<div class = "table-background-element"></div>'),
          menuBtn = x$('<a href="#" class="table-menu-btn" ><span class="table-menu-btn-icon"></span>Display</a>');
      menuBtn.click(function(){
        container.toggleClass("table-menu-hidden");
        x$(this).toggleClass("menu-btn-show");
        return false;
      });
      popupBG.click(function(){
        container.toggleClass("table-menu-hidden");
        menuBtn.toggleClass("menu-btn-show");
        return false;
      });
      container.bottom(popupBG);
      menuWrapper.bottom(menuBtn).bottom(container);
      x$(table).before(menuWrapper);
    };
  }
  
  function TableLoader () {}
  
  TableLoader.prototype.initialize = function(fragment) {
    var tables = x$(fragment).findElements('flex-table');
    Ur.Widgets["flex-table"] = {};

    for(var table in tables){
      Ur.Widgets["flex-table"][name] = new flexTable(tables[table], table);
    }
  }
  
  return TableLoader;
})();

/* Font Resizer
   ------------
   Font Resizer displays four components:
   (1) a button which, when pressed, increases the font size of some
       specified page elements
   (2) a button which, when pressed, decreases the font size of some
       specified page elements
   (3) a label which reports the current font size of the aforementioned
       page elements
   (4) a button which, when pressed, resets the contents to the original
       font size (optional component)
*/

Ur.QuickLoaders["font-resizer"] = (function() {

  var labelText = "Text Size: ";
  var up = 1, down = -1, reset = 0;
  var is_reset_enabled = "false";

  function FontResizer(components) {
    this.increase = components["increase"];
    this.decrease = components["decrease"];
    this.label = components["label"];
    this.content = components["content"];
    if (components["reset"]) {
      this.reset_size = components["reset"];
      is_reset_enabled = true;
    }
    this.initialize();
  }

  FontResizer.prototype.initialize = function() {
    var content = x$(this.content);
    this.min = parseInt(content.attr("data-ur-font-resizer-min")) || 100;
    this.max = parseInt(content.attr("data-ur-font-resizer-max")) || 200;
    this.delta = parseInt(content.attr("data-ur-font-resizer-delta")) || 20;
    this.size = parseInt(content.attr("data-ur-font-resizer-size")) || this.min;
    this.original_size = this.size;
    this.invert = content.attr("data-ur-font-resizer-invert") == "Bam!" ? true : false;

    x$(this.increase).click(function (obj) { return function() { obj.change(up); }; }(this));
    x$(this.decrease).click(function (obj) { return function() { obj.change(down); }; }(this));
    if (is_reset_enabled) {
      x$(this.reset_size).click(function (obj) { return function() { obj.change(reset); }; }(this));
    }

    if (this.invert) {
      this.size = this.min;
      this.controlSize = this.max;
      this.increase.style["font-size"] = this.controlSize + "%";
      this.decrease.style["font-size"] = this.controlSize + "%";
      this.label.style["font-size"] = this.controlSize + "%";
    }

    content[0].style["font-size"] = this.size + "%";
    x$(this.label).inner(labelText + this.size + "%");

  }

  FontResizer.prototype.change = function(direction) {
    if ((direction == down && this.size > this.min) ||
        (direction == up && this.size < this.max)) {
      this.size += direction * this.delta;
      this.content.style["font-size"] = this.size + "%";
      this.label.innerText = labelText + this.size + "%";

      if (this.invert) {
        this.controlSize += -direction * this.delta;
        this.increase.style["font-size"] = this.controlSize + "%";
        this.decrease.style["font-size"] = this.controlSize + "%";
        this.label.style["font-size"] = this.controlSize + "%";
      }
    } else if (direction == reset) {
      this.size = this.original_size;
      this.content.style["font-size"] = this.size + "%";
      this.label.innerText = labelText + this.size + "%";
    }
  }

  function FontResizerLoader() {}

  FontResizerLoader.prototype.initialize = function(fragment) {
    var font_resizers = x$(fragment).findElements('font-resizer');
    for (var name in font_resizers) new FontResizer(font_resizers[name]);
  }

  return FontResizerLoader;
})();

/* Geolocation  *
 * * * * * * * * *
 *
 *  The Geolocation widget is meant to
 *  reverse geocode a position to give back an address and then
 *  populate form fields
 *
 */
 
Ur.QuickLoaders["geocode"] = (function() {
  
  function Geocode(data) {
    this.elements = data;
    this.callback = x$(this.elements.set).attr("data-ur-callback")[0];
    this.errorCallback = x$(this.elements.set).attr("data-ur-error-callback")[0];

    UrGeocode = function(obj){return function(){obj.setup_callbacks();};}(this);
    var s = document.createElement('script');
    s.type = "text/javascript";
    s.src = "http://maps.googleapis.com/maps/api/js?sensor=true&callback=UrGeocode";
    x$('head')[0].appendChild(s);
  }

  
  var geocoder;
  var geocodeObj;
  var currentObj;
  
  function selectHelper(elm, value) {
    for (var i=0,j=elm.length; i<j; i++) {
      if (elm[i].value === value.long_name || elm[i].value.toUpperCase() === value.short_name) {
        elm.selectedIndex = i;
      }
    }
  }
  
  function fieldHelper(elm, geoInfo, htmlElmType) {
    var index1 = 0;
    var index2 = null; // used for street address
    var need = null;
    var temp = null;
    switch(elm) {
      case 'rg-city':
        need = 'locality';
        break;
      case 'rg-street':
        need = 'street_number';
        break;
      case 'rg-zip': 
        need = 'postal_code';
        break;
      case 'rg-state':
        need = 'administrative_area_level_1';
        break;
      case 'rg-country':
        need = 'country';
        break;
    }
    temp=geoInfo[0];
    var myTemp = null;
    for (var i = temp.address_components.length, j=0; j<i; j++) {
      for (var k = temp.address_components[j].types.length, m=0; m<k; m++) {
        myTemp = temp.address_components[j].types[m];
        if (need == myTemp) {
          switch(myTemp) {
            case 'street_number':
              index1 = j;
              index2 = j+1; 
              break;
            case 'locality':
              index1 = j; 
              break;
            case 'postal_code':
              index1 = j;
              break;
            case 'administrative_area_level_1':
              index1 = j;
              break;
            case 'country':
              index1 = j;
          }
          break;
        }
      }
    }
    if (htmlElmType === "input") {
      if (index2 === null) {
        currentObj.elements[elm].value = geoInfo[0].address_components[index1].long_name;
      } else {
        currentObj.elements[elm].value = geoInfo[0].address_components[index1].long_name + " " + geoInfo[0].address_components[index2].long_name;
      }
    } else if (htmlElmType === "select") {
      selectHelper(currentObj.elements[elm], geoInfo[0].address_components[index1]);
    }
  }
  
  function populateFields (geoInfo) {
    var elements = currentObj.elements;
    for (elm in elements) {
      (elements[elm].localName === "input") ? fieldHelper(elm, geoInfo, "input") : fieldHelper(elm, geoInfo, "select");
    }
  }
  
  Geocode.prototype = {
    setup_callbacks: function() {
      currentObj = this;
      // Set up call back for button to trigger geocoding
      if (this.elements['rg-button']) {
        x$(this.elements['rg-button']).on(
          'click', 
          function(obj){
            return function() {
              obj.geocode();
            }
          }(this)
        );
      } else {
        console.warn("Ur warning -- no button for triggering reverse geocoding present");
        currentObj.geocode();
      }
    },
    geoSuccess: function(position){   
      var coords = {
        lat: position.coords.latitude, 
        lng: position.coords.longitude
      }

      this.codeLatLng(coords.lat, coords.lng);
    },
    
    geoError: function(error){
      console.error("Ur geolocation error -- Error Getting Your Coordinates!");
      switch(error.code) 
      {
        case error.TIMEOUT:
          console.error ('Ur geolocation error -- Timeout');
          break;
        case error.POSITION_UNAVAILABLE:
          console.error ('Ur geolocation error -- Position unavailable');
          break;
        case error.PERMISSION_DENIED:
          console.error ('Ur geolocation error -- Permission denied');
          break;
        case error.UNKNOWN_ERROR:
          console.error ('Ur geolocation error -- Unknown error');
          break;
      }
      if(this.errorCallback !== undefined) {
        eval(this.errorCallback);
      }
    },

    geoDenied: function(){
      console.error("Ur geolocation error -- User Denied Geolocation");
    },

    codeLatLng: function(lat, lng) {
      var latlng = new google.maps.LatLng(lat, lng);
      var self = this;

      geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            geocodeObj = results;
            populateFields(geocodeObj);

            if(self.callback !== undefined) {
              eval(self.callback);
            }

            return results;
          } else {
            console.error("Geocoder failed due to: " + status);
          }
        }
      });
    },

    geocode: function(){
      if(navigator.geolocation){ //feature detect
        geocoder = new google.maps.Geocoder();
        navigator.geolocation.getCurrentPosition(
          function(obj){
            return function(position){
              obj.geoSuccess(position);
            };
          }(this), 
          function(obj) {
            return function(errors){
              obj.geoError(errors);
            };
          }(this),
          this.geoDenied
        );  
      }
    }
  }

  function GeocodeLoader() {
  }

  GeocodeLoader.prototype.initialize = function(fragment) {
    var my_geo = x$(fragment).findElements('reverse-geocode');
    
    Ur.Widgets["geocode"] = {}
    
    for (var name in my_geo){
      Ur.Widgets["geocode"][name] = new Geocode(my_geo[name]);
      break;
    }
    
  }

  return GeocodeLoader;
})();
/* Input Clear *
 * * * * * *
 * The input clear widget will provide a small X when a user focuses on a text input
 * that can be clicked to clear the field.
 * 
 * Customize the appearance of the X with CSS
 * 
 */
 
Ur.QuickLoaders['input-clear'] = (function(){
  
  function inputClear (input) {
    // XUIify the input we're working with
    var that = x$(input.input);
        
    // Create the X div
    var ex = x$('<div class="data-ur-input-clear-ex"></div>')
    // Hide it (even though this should be in CSS)
    ex.hide();
    // Inject it
    that.html('after', ex);

    // Use these when testing on desktop
    // ex.on('mousedown', function() {
    //   // remove text in the box
    //   that[0].value='';
    // });
    // ex.on('mouseup', function() {
    //   that[0].focus();
    // });
    
    // Touch Events
    ex.on('touchstart', function() {
      // remove text in the box
      that[0].value='';
    });
    ex.on('touchend', function() {
      // make sure the keyboard doesn't disappear
      that[0].focus();
    });
    
    that.on('focus', function() {
      if (that[0].value != '') {
        ex.show();
      }
    })
    that.on('keydown', function() {
      ex.show();
    });
    that.on('blur', function() {
      // Delay the hide so that the button can be clicked
      setTimeout(function() { ex.hide();}, 150);
    });
  }
  
  function InputClearLoader () {}
  
  InputClearLoader.prototype.initialize = function(fragment) {
    var inputs = x$(fragment).findElements('input-clear');
    
    Ur.Widgets["input-clear"] = {};
    
    for(var input in inputs){
      Ur.Widgets["input-clear"][input] = new inputClear(inputs[input]);
    }
  }
  
  return InputClearLoader;
})();



/*
 * lateload takes any element that has the data-ur-ll-src or
 * data-ur-ll-href attribute and then once requested, loads that
 * object
 */

(function () {

  function late_load (obj) {

    var self = this;
    var components = this.components = obj;
  }

  late_load.prototype.preferences = {threshold: 300};

  late_load.prototype.release_element = function (obj) {

    if (x$(obj).attr("data-ur-ll-src").length > 0){
      var type = "src";
      var att = "data-ur-ll-src";
      var loc = x$(obj).attr(att)[0];
    }else if (x$(obj).attr("data-ur-ll-href").length > 0){
      var type = "href";
      var att = "data-ur-ll-href";
      var loc = obj.getAttribute();
    }else{
      //console.warn("Uranium Late Load: non-late-load element provided.");
      return
    }

    obj.removeAttribute(att);
    obj.setAttribute(type, loc);
  }

   late_load.prototype.components = {};

  late_load.prototype.release_group = function (hash) {
    for (var name in hash){
      if (hash[name][1] != "scroll"){
        late_load.prototype.release_element(hash[name][0]);
      }else if (scrollHelper(hash[name][0]) == true){
        late_load.prototype.release_element(hash[name][0]);
      }
    }
  }

  var scrollHelper = function (obj) {
    var fold = window.innerHeight + window.pageYOffset;

    var findPos = function(obj) {
      var curleft = curtop = 0;curtop;
      if (obj.offsetParent) {
        do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
      }
      return [curleft,curtop];
    }
    var pos = findPos(obj);
    return fold >= pos[1] - obj.offsetHeight - late_load.prototype.preferences.threshold;
  }

  var setEvents = function (obj) {
    var components = obj;

    for (var temp in components){

      switch(temp){
        case "scroll":
          x$(window).on(temp, function (e) {
            late_load.prototype.release_group(components["scroll"], "scroll");
          });
        break;
        case "load":
          x$(window).on(temp, function (e) {
            late_load.prototype.release_group(components["load"]);
          });
          break;
        case "DOMContentLoaded":
          late_load.prototype.release_group(components["DOMContentLoaded"]);
          break;
        case "click": case "touch":
          x$("html").on(temp, function (e) {
            var type = e.target.getAttribute("data-ur-ll-event")
            if (type == "click" || type == "touch") {
              late_load.prototype.release_element(e.target);
            }
          });
          break;
        default:
        break;
      }
    }
  }


  var find = function () {
    var obj = {};
    var temp = [];
    var group;

    x$(document).find('[data-ur-ll-href],[data-ur-ll-src]').each( function () {
      group = this.getAttribute("data-ur-ll-event")
      if (group === null){
        group = "DOMContentLoaded";
      }
      obj[group] = []
      temp.push([this, group]);
    });

    for (var element in temp){
      if (temp[element][1] === undefined) {}else{
        obj[temp[element][1]].push(temp[element]);
      }
    }

    return obj;
  }

  late_load.prototype.initialize = function() {
    var lateObj = find();
    var ll = new late_load(lateObj);
    setEvents(ll.components)
    Ur.Widgets["late_load"] = ll;
  }

  return Ur.QuickLoaders['late_load'] = late_load;
})();

/* Map *
 * * * *
 * The map creates a fully functional google map (API version 3) from addresses.
 * 
 * It (will) also support current location / custom icons and callbacks / getting directions.
 *
 */

Ur.QuickLoaders['map'] = (function(){

  // -- Private functions --

  function ThresholdCallback(threshold, callback) {
    this.threshold = threshold;
    this.count = 0;
    this.callbacks = [];
    if (callback !== undefined) {
      this.callbacks.push(callback);
    }
  }
  
  ThresholdCallback.prototype.finish = function() {
    this.count += 1;
    if (this.count == this.threshold) {
      var callback = this.callbacks.pop();
      while(callback) {
        callback();
        callback = this.callbacks.pop();
      }
    }
  }

  // -- End of Private functions -- 



  function Map(data){
    this.elements = data;
    this.fetch_map(); //This is async -- it calls initialize when done
  }

  // NOTE : All this map stuff is async. The execution path goes:
  // 
  // fetch_map() -> 
  // fetch_coordinates() -> 
  // setup_map() -> 
  //     add_coordinates()
  //     setup_user_location()

  Map.prototype = {
    marker_clicked: function(map_event, marker_index) {

      x$().iterate(
        this.elements["descriptions"],
        function(description, index) {
          if(index == marker_index) {
            x$(description).attr("data-ur-state","enabled");
          } else {
            x$(description).attr("data-ur-state","disabled");            
          }
        }
      );      
      
      // TODO: I probably want to add the ability to specify your own callback, which would get called here
    },

    fetch_coordinates: function(){
      this.coordinates = [];
      this.center = [0,0];
      this.lat_range = {};
      this.lng_range = {};

      var geocoder = new google.maps.Geocoder();
      var obj = this;
      var final_callback = new ThresholdCallback(
        this.elements["addresses"].length,
        function(obj){return function(){obj.setup_map();}}(this)
      );

      x$(this.elements["addresses"]).each(
        function(address, index) {
          address = address.innerText;
          var cleaned_address = address.match(/(\S.*\S)[$\s]/m)[1];
          
          if(cleaned_address == undefined){
            cleaned_address = address;
          }

          geocoder.geocode(
            {"address": cleaned_address},
            function(results, status) {
              var position = null; 

              if(status === google.maps.GeocoderStatus.OK) {
                position = results[0].geometry.location;
                obj.coordinates[index] = position;
                obj.center[0] += position.lat();
                obj.center[1] += position.lng();

                var ne = results[0].geometry.viewport.getNorthEast();
                var sw = results[0].geometry.viewport.getSouthWest();

                if ( (obj.lat_range["min"] && obj.lat_range["min"] > sw.lat()) || obj.lat_range["min"] === undefined) {
                  obj.lat_range["min"] = sw.lat();
                }

                if ( (obj.lat_range["max"] && obj.lat_range["max"] < sw.lat()) || obj.lat_range["max"] === undefined) {
                  obj.lat_range["max"] = ne.lat();
                }

                if ( (obj.lng_range["min"] && obj.lng_range["min"] > sw.lng()) || obj.lng_range["min"] === undefined) {
                  obj.lng_range["min"] = sw.lng();
                }

                if ( (obj.lng_range["max"] && obj.lng_range["max"] < sw.lng()) || obj.lng_range["max"] === undefined) {
                  obj.lng_range["max"] = ne.lng();
                }

                final_callback.finish();
              } else {
                console.error("Error geocoding address: " + address);
              }

            }
          );
        }
      );

    },

    add_coordinates: function() {
      var obj = this;
      var icon_url = x$(this.elements["icon"]).attr("data-ur-url")[0];

      var width = x$(this.elements["icon"]).attr("data-ur-width")[0];
      var height = x$(this.elements["icon"]).attr("data-ur-height")[0];

      var size = null;

      if(width !== undefined && height !== undefined){
        size = new google.maps.Size(parseInt(width), parseInt(height));
      }

      x$().iterate(
        obj.coordinates,
        function (point, index) {
          var icon_image = null;

          if (icon_url !== undefined) {
            icon_image = new google.maps.MarkerImage(icon_url, null, null, null, size);
          }

          var marker = new google.maps.Marker({
            position: point, 
            map: obj.map,
            icon: icon_image
          }); 

          google.maps.event.addListener(
            marker,
            'click',
            function(marker_index){
              return function(map_event){
                obj.marker_clicked(map_event, marker_index);
              };
            }(index)
          );

        }
      );
      
    },

    setup_user_location: function() {
      var user_location = this.elements["user_location"];
      this.user_location_marker = null;

      if(user_location === undefined) {
        return
      }

      // Add a listener on the button 

      var self = this;

      x$(user_location).on(
        'click',
        function(){self.toggle_user_location()}
      );

      // Now just determine if I should use it automatically or not

      if(x$(user_location).attr("data-ur-state")[0] === "enabled") {
        this.fetch_user_location();
      } 
      
    },

    fetch_user_location: function() {

      var success = function(obj){
        return function(position){
          obj.add_user_location(position);
        }
      }(this);

      var failure = function(){
          console.error("Ur : Error getting user location");
      };

      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, failure);
      } else {
        console.error("Ur : Geolocation services not available");
      } 

    },

    add_user_location: function(point) {      
      var google_point = new google.maps.LatLng(point.coords.latitude, point.coords.longitude);

      this.user_location_marker = new google.maps.Marker({
        position: google_point, 
        map: this.map,
        icon: "//s3.amazonaws.com/moovweb-live-resources/map/dot-blue.png"
      }); 
      // TODO : Make this a real icon URL

      x$(this.elements["user_location"]).attr("data-ur-state","enabled");
    },

    toggle_user_location: function() {

      if(this.user_location_marker === null || this.user_location_marker === undefined) {
        this.fetch_user_location();
      } else {
        this.user_location_marker.setMap(null);
        delete this.user_location_marker;
        x$(this.elements["user_location"]).attr("data-ur-state","disabled");
      }

    },

    fetch_map: function() {
      var script = document.createElement("script");

      // Note:
      // - There can only be one map per page since I have to pass a global function name as
      //   the callback for the map code loading.
      // - The alternative is to generate unique global function names per instance ... but
      //   that requires eval() ... and "evals() are bad .... mkay?"

      // TODO: Can I at least hide it behind the Ur object?
      setup_uranium_map = function(obj){
        return function() {
          obj.fetch_coordinates();
        }
      }(this);

      script.src = "http://maps.googleapis.com/maps/api/js?sensor=true&callback=setup_uranium_map";

      this.elements["set"].appendChild(script);
    },

    setup_map: function() {
      
      this.center[0] /= this.elements["addresses"].length
      this.center[1] /= this.elements["addresses"].length

      var center = new google.maps.LatLng(this.center[0], this.center[1]);

      var options = {
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.elements["canvas"], options);

      var cumulative_sw = new google.maps.LatLng(this.lat_range["min"], this.lng_range["min"]);
      var cumulative_ne = new google.maps.LatLng(this.lat_range["max"], this.lng_range["max"]);

      var cumulative_bounds = new google.maps.LatLngBounds(cumulative_sw, cumulative_ne);

      this.map.fitBounds(cumulative_bounds);

      this.add_coordinates();
      this.setup_user_location();
    }

  }


  var ComponentConstructors = {
    "address" : function(group, component, type) {
      if (group["addresses"] === undefined) {
        group["addresses"] = [];
      }

      group["addresses"].push(component);
    },

    "description" : function(group, component, type) {
      if (group["descriptions"] === undefined) {
        group["descriptions"] = [];
      }

      group["descriptions"].push(component);      
    }
  }

  function MapLoader(){
  }

  MapLoader.prototype.initialize = function(fragment) {
    var maps = x$(fragment).findElements('map', ComponentConstructors);
    Ur.Widgets["map"] = {};

    for(var name in maps) {
      var map = maps[name];
      Ur.Widgets["map"][name] = new Map(map);
      break;
      // There can only be one for now ... 
      // TODO: As long as I make the script adding a singleton process, I can have multiple maps
    }

  }

  return MapLoader;
})();

/* Select Buttons  *
 * * * * * * * * * *
 * The select-button widget binds two buttons to a <select> to increment/decrement
 * the select's chosen value.
 * 
 */

Ur.QuickLoaders['select-buttons'] = (function(){

  function SelectButtons(components) {
    this.select = components["select"];
    this.increment = components["increment"];
    this.decrement = components["decrement"];
    this.initialize();
  }

  SelectButtons.prototype.initialize = function() {
    x$(this.increment).click(function(obj){return function(evt){obj.trigger_option(evt, 1)};}(this));
    x$(this.decrement).click(function(obj){return function(evt){obj.trigger_option(evt, -1)};}(this));
  }

  SelectButtons.prototype.trigger_option = function(event, direction) {
    var button = event.currentTarget;
    if (x$(button).attr("data-ur-state")[0] === "disabled") {
      return false;
    }
    var current_option = {};
    var value = this.select.value;
    var newValue = {"prev":null, "next":null};

    x$().iterate(
      this.select.children,
      function(option, index) {
        if(x$(option).attr("value")[0] == value) {
          current_option = {"element": option, "index": index};
        }

        if(typeof(current_option["index"]) == "undefined") {
          newValue["prev"] = x$(option).attr("value")[0];
        }

        if(index == current_option["index"] + 1) {
          newValue["next"] = x$(option).attr("value")[0];
        }
      }
    );

    var child_count = this.select.children.length;
    var new_index = current_option["index"] + direction;
    
    if (new_index == 0) {
      x$(this.decrement).attr("data-ur-state","disabled");
    } else {
      x$(this.decrement).attr("data-ur-state","enabled");
    }

    if (new_index == child_count - 1) {
      x$(this.increment).attr("data-ur-state","disabled");
    } else {
      x$(this.increment).attr("data-ur-state","enabled");
    }

    if (new_index < 0 || new_index == child_count) {
      return false;
    }

    direction = direction == 1 ? "next" : "prev";
    this.select.value = newValue[direction];

    return true;
  }



  // Potential bug: (not going to worry about it now)
  // This is a bit tricky since I need to update the classes on the buttons if they're on an extreme/edge
  // If the page can be loaded w any of the options selected, I can't apply these classes till onload
  // -- so the solution i guess is to add the disable classes to the html, and they'll be removed when initialized

  function SelectButtonsLoader(){
  }

  SelectButtonsLoader.prototype.initialize = function(fragment) {
    var select_buttons = x$(fragment).findElements('select-buttons');
    for (var name in select_buttons) {
      new SelectButtons(select_buttons[name]);
      x$(select_buttons[name]["set"]).attr("data-ur-state","enabled");
    }
  }

  return SelectButtonsLoader;
})();
/* Select List *
 * * * * * * * *
 * The select-list binds a set of uranium-elements to corresponding <option> 
 * elements of a <select>. Clicking the uranium-element sets the <select>'s 
 * value to match the corresponding <option> element.
 * 
 */

// A concern here is the initial state -- I think the default should be just
// that there is no initial state -- the user must click to update the state
// -- the reason is, if there is an initial state, the underlying selector's
// state may be different on render, and there will be a gap until onload 
// while the states mismatch -- if the user is fast enough to click a form 
// in that time, they will get unexpected results.

Ur.QuickLoaders['select-list'] = (function(){

  function SelectList(select_element, list_element){
    this.select = select_element;
    this.list = list_element;
    this.initialize();
  }

  SelectList.prototype.initialize = function() {
    x$(this.list).click(function(obj){return function(evt){obj.trigger_option(evt)}}(this));  
  }

  SelectList.prototype.trigger_option = function(event) {
    var selected_list_option = event.target;
    var self = this;
    var value = iterate(this, selected_list_option);
    //  x$(this.select).attr("value",value); //Odd - this doesn't work, but the following line does
    // -- I think 'value' is a special attribute ... its not in the attributes[] property of a node
    this.select.value = value;

    return true;
  }

  function iterate (obj, selected_obj) {
    var value = "";
    x$().iterate(
      obj.list.children,
      function(element, index){
        var val1 = element.getAttribute("value");
        var val2 = selected_obj.getAttribute("value");
        if(val1 == val2) {
          x$(element).attr("data-ur-state","enabled");
          value = x$(element).attr("value");
        } else {
          x$(element).attr("data-ur-state","disabled");
        }
      }
    );
    return value;
  }

  function matchSelected (obj) {
    var active = obj.select.children[obj.select.options.selectedIndex];
    iterate(obj, active);
  }

  function SelectListLoader(){
    this.SelectLists = {};
    // Keep instances here because we may need them in the future
    // - In v1 we had to listen for changes on the <select>'s and update appropriately
    // - Sometimes we had to listen for different events
  }


  SelectListLoader.prototype.initialize = function(fragment) {
    var select_lists = x$(fragment).findElements('select-list');
    var self = this;
    for (var name in select_lists) {
      var select_list = select_lists[name];
      self.SelectLists[name] = new SelectList(select_lists[name]["select"],select_lists[name]["content"]);
      x$(select_list["set"]).attr("data-ur-state","enabled");
      matchSelected(self.SelectLists[name])
    }
  }

  return SelectListLoader;
})();


/* 

basic structure of swipe toggler
you must define the swipe toggle name and one active element
from there this will create the swipe toggle ability.

show this off with a fade in and card deck carousel.

<div data-ur-swipe-toggle="my_name">
<span data-ur-state="active">item1</span><span>itme2</span><span>itme3</span>
</div>

*/

// this is a swipe toggler
Ur.QuickLoaders['SwipeToggle'] = (function () {

  function swipeToggleComponents (group, content_component) {
    // This is a 'collection' of components
    // -- if I see it again, I'll make this abstract
    if(group["slider"] === undefined) {
      group["slider"] = [];
    }
    group["slider"].push(content_component);
  }

  function SwipeToggle (swipe_element, name){
    var myName = name;
    var components = swipe_element;
    var self = this;
    var touch = {};

    var preferences = this.preferences = { dots: false, axis: "x", swipeUpdate: true, sensitivity: 10, loop: true,
                         touchbuffer: 20, tapActive: false,  touch: true, jump: 1, loop: true,
                         autoSpeed: 500 };
    

    this.flags = {touched: false, autoID: null}
    var flags = this.flags;

                                    
    var startPos = endPos = markerPos = {x: 0, y: 0, time: 0};

    var loadEvent = function (obj) {
      var event = document.createEvent("Event");
      event.initEvent("loaded", false, true);
      obj.dispatchEvent(event);
    }

    var autoScroll = function(mili_sec){
      name = setInterval(function (){
        console.log(name);
        var imageArray = slider.children.length;
        
        if(SwipeToggle.prototype.flags  == true){
          window.clearInterval(name);
          wipeToggle.prototype.flags  == false;
        }else{
          myCarousel.next(1);
        }
        
      },mili_sec);
    }

    var setTouch = function () {

      var pef_touch = self.preferences.touch;

      slider.addEventListener('touchstart', function (e){
        if (pef_touch == true){
          touch.start(e, this);
        }
      }, false);

      slider.addEventListener('touchmove', function (e){
        if (pef_touch == true){
          touch.move(e, this);
        }
      }, false);

      slider.addEventListener('touchend', function (e){
        if (pef_touch == true){
          touch.end(e, this);
        }
      }, false);
    }

    var swipeDirection = function (){

      if (preferences) {
        var buff = preferences.touchbuffer;
      }else{
        var buff = 0;
      }

      if(startPos[axis] < endPos[axis] - buff){
        return 1;//right or top >>
      }else if(startPos[axis] > endPos[axis] + buff){
        return 2;//left or bottom <<
      }else{
        return 3;//tap
      }
    }

    SwipeToggle.prototype.getActive = function (e) {
      var test = this.components.name;
      var active = x$('[data-ur-id="' + test + '"][data-ur-swipe-toggle-component="slider"] > [data-ur-state="active"]')[0];
      return active;
    }

    SwipeToggle.prototype.next = function () {

      var activeObj = this.getActive();
      var jump = this.preferences.jump;
      var children = activeObj.parentNode.children;

      for(var i = 0; i < jump; i++){
        if(lookAhead(activeObj) == true){
          var update = activeObj.nextElementSibling;
          activeObj = this.setActive(update);
        }else if(lookAhead(activeObj) == false && this.preferences.loop == true){
          this.setActive(children[0])
        } 
      }

      return activeObj;
    }

    SwipeToggle.prototype.prev = function () {
      var activeObj = this.getActive();
      var jump = this.preferences.jump;
      var children = activeObj.parentNode.children;
      var last = children.length -1;

      for(var i = 0; i < jump; i++){
        if(lookBehind(activeObj) == true){
          var update = activeObj.previousElementSibling;
          activeObj = this.setActive(update);
        }else if(lookBehind(activeObj) == false && this.preferences.loop == true){
          this.setActive(children[last])
        }
      }

      return activeObj;
    }

    var touch = {};

    touch.start = function (e) {
      flags.touched = true;

      markerPos = startPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: e.timeStamp
      };

    }

    touch.move = function (e) {

      endPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      if(self.preferences.swipeUpdate == true){
        swipeUpdate(e);
      }

      var swipeDist =  endPos[axis] - startPos[axis];
    }

    touch.end = function (e) {
      endPos.time = e.timeStamp;

      touchMove(e)

      touch.clear();
    }

    touch.clear = function () {
      startPos = {};
      endPos = {};
      markerPos = {};
    }

    var swipeUpdate = function (e) {
      if(endPos[axis] + self.preferences.sensitivity < markerPos[axis]){
        self.next();
        markerPos = endPos;
        e.stopPropagation();
        e.preventDefault();
      }
      if(endPos[axis] - self.preferences.sensitivity > markerPos[axis]){
        self.prev();
        markerPos = endPos;
        e.stopPropagation();
        e.preventDefault();
      }
    }

    var touchMove = function (e) {
      var direction = swipeDirection();
      var target = e.target
      if (direction == 1) {
        self.prev()
      }else if (direction == 2){
        self.next()
      }else{
        if (target.parentNode == slider){
          self.setActive(target);
        }
      }
    }

    var activeIndex = function (Element){
      if (Element === undefined) {
        var obj = self.components.slider;
      } else {
        var obj = Element;
      }

      var length = obj.children.length;
      var i = 0;

      if (length > i) {
        for(i ; i < length; i++){
          if(obj.children[i].getAttribute('data-ur-state') == 'active'){
            break;
          }
        }
      }

      return i;
    }

    SwipeToggle.prototype.autoScroll = function (direction) {
      var imageArray = this.components.slider.children.length;
      var self = this;

      var autoID = name;

      window.clearInterval(this.flags.autoID);
       if (direction == "next" || direction == "prev"){}else{
        console.log("swipe_toggle: impropper autoScroll direction setting");
        direction = "next";
      }

     this.flags.autoID = autoID = window.setInterval(function (){
        var position = activeIndex();

        if((self.preferences.loop == false && position + 1 == imageArray) || flags.touched == true){
          window.clearInterval(self.flags.autoID);
        }else{
          self[direction]()
        }

      }, this.preferences.autoSpeed);
    }

    SwipeToggle.prototype.dots = function () {
      // create dots for the carousel
      
      var index = activeIndex(this.components.slider);
      var slider_name = this.components.name;
      var slider = this.components.slider;
      var imageLength = x$(slider)[0].children.length -1;
      var dotsDiv = document.createElement('div');
      var attributeName = "mw_swipe_toggle_dot"

      dotsDiv.setAttribute("class", "mw_" + slider_name + "_dots mw_swipe_dots")

      for(var i = 0; i < imageLength + 1; i++){
        tempDivHolder = document.createElement("div");
        tempDivHolder.id = 'mw_image_dot' + (i+1);
        dotsDiv.appendChild(tempDivHolder);
      }
      if (dotsDiv.children[0] === undefined){} else {
        dotsDiv.children[index].setAttribute(attributeName, "active");
      }
      x$(slider).after(dotsDiv);

      slider.addEventListener('update', function (e){
        // make new dot active
        var eventSlider = e.slider;
        var name = slider_name;
        var dots_name = "mw_" + slider_name + "_dots";

        var index = activeIndex(e.slider);

        for (var i = 0; i < imageLength + 1; i++) {
          dotsDiv.children[i].setAttribute(attributeName, "");
        }
        dotsDiv.children[index].setAttribute(attributeName, "active");
      });
    }

    SwipeToggle.prototype.autoPopulate = function (autoPopulateList, append) {
      var location = this.components.slider;
      if (autoPopulateList === undefined) {
        console.warn("Swipe Toggle: no items listed")
      }else if (append == "top" || append == "bottom"){
        for (var items in autoPopulateList) {
          x$(location)[append](autoPopulateList[items]);
        }
        this.setActive(this.components.slider.children[0]);
      }
    }

    if(components === undefined){}else{
      this.components = swipe_element;
      var slider = this.components.slider;

      x$(swipe_element['next']).on("click", function(e){
        Ur.Widgets.SwipeToggle[self.components.name].next(e);
      });
      x$(swipe_element['prev']).on("click", function(e){ 
        Ur.Widgets.SwipeToggle[self.components.name].prev(e);
      });

      if (this.components.slider.children[0] === undefined) {}else{
        this.setActive(this.getActive());
      }


      var axis = this.preferences.axis;
      if (axis == "x" || axis == "Y") {
      }else{
        Ur.error("incorrect axis set")
      }

      setTouch();

      if (this.preferences.dots == true) {
        this.dots()
      }
      loadEvent(this.components.slider);
    }
  }

  SwipeToggle.prototype.components = {}

  SwipeToggle.prototype.setActive = function (obj) {

    var activeChangeEvent = function (obj, parent) {
      var event = document.createEvent("Event");
      event.initEvent("update", false, true);
      event.active = obj;
      event.slider = obj.parentNode;
      event.activeElement = obj;
      parent.dispatchEvent(event);
    }

    var i;
    var slider = obj.parentNode;
    var siblings = slider.children.length;
    var previousSibling = obj.previousElementSibling;
    var nextSibling = obj.nextElementSibling;
    var nodeType = obj.nodeType;

    if (nodeType == 1 && slider == slider){
      obj.setAttribute("data-ur-state", "active");

      for(i=0; i<=siblings; i++){
        if(previousSibling === null || previousSibling === undefined){
          break;
        }else{
          previousSibling.setAttribute("data-ur-state", "prev" + (i+1));
          previousSibling = previousSibling.previousElementSibling;
        }
      }

      for(i=0; i<=siblings; i++){
        if(nextSibling === null || nextSibling === undefined){
          break;
        }else{
          nextSibling.setAttribute("data-ur-state", "next" + (i+1));
          nextSibling = nextSibling.nextElementSibling;
        }
      }
    }

    activeChangeEvent(obj, slider)

    return obj;
  }

  var lookAhead = function (obj) {
    if(obj.nextElementSibling === null){
      return false;
    }else{
      return true;
    }
  }

  var lookBehind = function (obj) {
    if(obj.previousElementSibling === null){
      return false;
    }else{
      return true;
    }
  }

  var find = function(fragment){
    var swipe_group = x$(fragment).findElements('swipe-toggle');

    for(var component_id in swipe_group) {
      var carousel_group = swipe_group[component_id];
      carousel_group.name = component_id;
      if (carousel_group["slider"] === undefined) {
        Ur.error("no slider found for toggler with id = " + component_id);
        continue;
      }else if (carousel_group["slider"].children[0] === undefined){
        Ur.warn("no children in slider: " + carousel_group )
      }else{
        carousel_group["slider"]["active"] = x$(carousel_group["slider"]).find("[data-ur-state='active']")[0];
        Ur.warn("no active element found for toggler with id = " + component_id);
        if (carousel_group["slider"]["active"] === undefined) {
          console.log("no active element in slider: " + component_id)
          carousel_group["slider"]["active"] = carousel_group["slider"].children[0];
          carousel_group["slider"]["active"].setAttribute("data-ur-state", "active")
          console.log("set active element")
          continue;
        }
      }
    }
    return swipe_group;
  }

  SwipeToggle.prototype.initialize = function (fragment) {
    var swipe_group = find(fragment);
    Ur.Widgets["SwipeToggle"] = {};

    var prefEvent = function (obj) {
      var event = document.createEvent("Event");
      event.initEvent("preferences", false, true);
      obj.components.slider.dispatchEvent(event);
    }


    for(var name in swipe_group){
      Ur.Widgets["SwipeToggle"][name] = new SwipeToggle(swipe_group[name]);
      prefEvent(Ur.Widgets["SwipeToggle"][name]);
    }

    return swipe_group;
  }

  return new SwipeToggle;
})



/* Tabs *
 * * * * * *
 * The tabs are like togglers with state. If one is opened, the others are closed
 * 
 * Question: Can I assume order is preserved? Ill use IDs for now
 */

Ur.QuickLoaders['tabs'] = (function(){
  function Tabs(data){
    this.elements = data;
    this.setup_callbacks();
  }

  Tabs.prototype.setup_callbacks = function() {
    var default_tab = null;

    for(var tab_id in this.elements["buttons"]) {

      var button = this.elements["buttons"][tab_id];
      var content = this.elements["contents"][tab_id];

      if (default_tab === null) {
        default_tab = tab_id;
      }

      if(content === undefined) {
        Ur.error("no matching tab content for tab button");
        return;
      }
      
      var state = x$(button).attr("data-ur-state")[0];
      if(state !== undefined && state == "enabled") {
        default_tab = -1;
      }
      
      var closeable = x$(this.elements["set"]).attr("data-ur-closeable")[0];
      closeable = (closeable !== undefined && closeable == "true") ? true : false;
      var self = this;
      x$(button).on(
        "click",
        function(evt) {
          var firstScrollTop = x$(evt.target).offset().top - window.pageYOffset;
          var this_tab_id = x$(evt.currentTarget).attr("data-ur-tab-id")[0];
          
          for(var tab_id in self.elements["buttons"]) {
            var button = self.elements["buttons"][tab_id];
            var content = self.elements["contents"][tab_id];

            if (tab_id !== this_tab_id) {
              x$(button).attr("data-ur-state","disabled");
              x$(content).attr("data-ur-state","disabled");
            }
            else {
              var new_state = "enabled";
              if (closeable) {
                var old_state = x$(button).attr("data-ur-state")[0];
                old_state = (old_state === undefined) ? "disabled" : old_state;
                new_state = (old_state == "enabled") ? "disabled" : "enabled";
              }
              x$(button).attr("data-ur-state", new_state);
              x$(content).attr("data-ur-state", new_state);
            }
          }
          var secondScrollTop = x$(evt.target).offset().top - window.pageYOffset;
          if ( secondScrollTop <= 0 ) {
            window.scrollBy(0, secondScrollTop - firstScrollTop);
          }
        }
      ); 
    }
  }
  
  var ComponentConstructors = {
    "button" : function(group, component, type) {
      if (group["buttons"] === undefined) {
        group["buttons"] = {}
      }
      
      var tab_id = x$(component).attr("data-ur-tab-id")[0];
      if (tab_id === undefined) {
        Ur.error("tab defined without a tab-id");
        return;
      }
      
      group["buttons"][tab_id] = component;
    },
    "content" : function(group, component, type) {
      if (group["contents"] === undefined) {
        group["contents"] = {}
      }
      
      var tab_id = x$(component).attr("data-ur-tab-id")[0];
      if (tab_id === undefined) {
        Ur.error("tab defined without a tab-id");
        return;
      }
      
      group["contents"][tab_id] = component;
    }
  }

  function TabsLoader(){
  }

  TabsLoader.prototype.initialize = function(fragment) {
    var tabs = x$(fragment).findElements('tabs', ComponentConstructors);
    Ur.Widgets["tabs"] = {};

    for(var name in tabs){
      var tab = tabs[name];
      Ur.Widgets["tabs"][name] = new Tabs(tabs[name]);
    }
  }

  return TabsLoader;
})();

/* Toggler *
* * * * * *
* The toggler alternates the state of all the content elements bound to the
* toggler button. 
* 
* If no initial state is provided, the default value 'disabled'
* is set upon initialization.
*/

Ur.QuickLoaders['toggler'] = (function(){
  function ToggleContentComponent (group, content_component) {
    // This is a 'collection' of components
    // -- if I see it again, I'll make this abstract
    if(group["content"] === undefined) {
      group["content"] = [];
    }
    group["content"].push(content_component);
  }

  function ToggleLoader(){
    this.component_constructors = {
      "content" : ToggleContentComponent
    };
  }

  ToggleLoader.prototype.find = function(fragment){
    var togglers = x$(fragment).findElements('toggler', this.component_constructors);
    var self=this;

    for(var toggler_id in togglers) {
      var toggler = togglers[toggler_id];

      if (toggler["button"] === undefined) {
        Ur.error("no button found for toggler with id=" + toggler_id);
        continue;
      }

      var toggler_state = x$(toggler["button"]).attr("data-ur-state")[0];
      if(toggler_state === undefined) {
        x$(toggler["button"]).attr("data-ur-state", 'disabled');
        toggler_state = "disabled";
      } 

      if (toggler["content"] === undefined) {
        Ur.error("no content found for toggler with id=" + toggler_id);
        continue;
      }

      // Make the content state match the button state
      x$().iterate(
        toggler["content"],
        function(content) {
          if (x$(content).attr("data-ur-state")[0] === undefined ) {
            x$(content).attr("data-ur-state", toggler_state)
          }
        }
      );

    }

    return togglers;
  }

  ToggleLoader.prototype.construct_button_callback = function(contents, set) {
    var self = this;
    return function(evt) { 
      var button = evt.currentTarget;
      var current_state = x$(button).attr("data-ur-state")[0];
      var new_state = current_state === "enabled" ? "disabled" : "enabled";

      x$(button).attr("data-ur-state", new_state);
      x$(set).attr("data-ur-state", new_state);

      x$().iterate(
        contents,
        function(content){
          var current_state = x$(content).attr("data-ur-state")[0];
          var new_state = current_state === "enabled" ? "disabled" : "enabled";
          x$(content).attr("data-ur-state", new_state);
        }
      );
    }
  }

  ToggleLoader.prototype.initialize = function(fragment) {
    var togglers = this.find(fragment);
    for(var name in togglers){
      var toggler = togglers[name];
      // if (togglers)
      x$(toggler["button"]).click(this.construct_button_callback(toggler["content"], toggler["set"]));
      x$(toggler["set"]).attr("data-ur-state","enabled");
    }
  }

  return ToggleLoader;
  })();

/* Zoom  *
 * * * * * * *
 * This is a zoom widget that zooms images to larger images
 * within the same container and allows for basic panning
 *
 */

Ur.WindowLoaders["zoom"] = (function() {

  function Zoom(components) {
    var self = this;
    
    this.container = components["view_container"];
    this.img = components["img"];
    this.prescale = false;
    this.width = this.height = 0;
    this.bigWidth = this.bigHeight = 0;
    this.canvasWidth = this.canvasHeight = 0;
    this.ratio = 1;
    this.state = "disabled";

    // Optionally:
    this.button = components["button"];
    this.idler = components["loading"];

    var $img = x$(this.img);
    var $idler = x$(this.idler);
    var $btn = x$(this.button);

    var boundX, boundY;
    var relX, relY;
    var offsetX = 0, offsetY = 0;
    var touchX = 0, touchY = 0;
    var mouseDown = false; // only used on non-touch browsers
    var mouseDrag = true;

    loaded_imgs.push($img.attr("src")[0]);

    function initialize() {
      self.canvasWidth = self.canvasWidth || self.container.offsetWidth;
      self.canvasHeight = self.canvasHeight || self.container.offsetHeight;
      self.width = self.width || parseInt($img.attr("width")) || parseInt($img.getStyle("width")) || self.img.width;
      self.height = self.height || parseInt($img.attr("height")) || parseInt($img.getStyle("height")) || self.img.height;

      self.bigWidth = parseInt($img.attr("data-ur-width")) || self.img.naturalWidth;
      self.bigHeight = parseInt($img.attr("data-ur-height")) || self.img.naturalHeight;
      if (($img.attr("data-ur-width")[0] && $img.attr("data-ur-height")[0]) || $img.attr("src")[0] == $img.attr("data-ur-src")[0])
        self.prescale = true;

      self.ratio = self.bigWidth/self.width;

      boundX = (self.canvasWidth - self.bigWidth)/2;    // horizontal translation to view middle of image
      boundY = (self.canvasHeight - self.bigHeight)/2;  // vertical translation to view middle of image
    }

    function panStart(event) {
      if (event.target != self.img)
        return;
      mouseDrag = false;
      touchX = event.pageX;
      touchY = event.pageY;
      mouseDown = true;
      if (event.touches) {
        touchX = event.touches[0].pageX;
        touchY = event.touches[0].pageY;
      }

      var style = self.img.style;
      if (window.WebKitCSSMatrix) {
        var matrix = new WebKitCSSMatrix(style.webkitTransform);
        offsetX = matrix.m41;
        offsetY = matrix.m42;
      }
      else {
        var transform = style.MozTransform || style.OTransform || style.transform || "translate(0, 0)";
        transform = transform.replace(/.*?\(|\)/, "").split(",");

        offsetX = parseInt(transform[0]);
        offsetY = parseInt(transform[1]);
      }

      stifle(event);
    }

    function panMove(event) {
      if (!mouseDown || event.target != self.img) // NOTE: mouseDown should always be true on touch-enabled devices
        return;

      stifle(event);
      var x = event.pageX;
      var y = event.pageY;
      if (event.touches) {
        x = event.touches[0].pageX;
        y = event.touches[0].pageY;
      }
      var dx = x - touchX;
      var dy = y - touchY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5)
        mouseDrag = true;
      var new_offsetX = bound(offsetX + dx, [-boundX, boundX]);
      var new_offsetY = bound(offsetY + dy, [-boundY, boundY]);
      transform(new_offsetX, new_offsetY, self.ratio);
    }

    function panEnd(event) {
      if (!mouseDrag)
        self.zoomOut();
      stifle(event);
      mouseDown = false;
      mouseDrag = true;
    }

    function transitionEnd() {
      if (self.state == "enabled-in") {
        $img.css({ webkitTransitionDelay: "", MozTransitionDelay: "", OTransitionDelay: "", transitionDelay: "" });
        
        self.img.src = $img.attr("data-ur-src")[0];
        if (loaded_imgs.indexOf(self.img.getAttribute("data-ur-src")) == -1) {
          setTimeout(function() {
            if (loaded_imgs.indexOf(self.img.getAttribute("data-ur-src")) == -1)
              $idler.attr("data-ur-state", "enabled");
          }, 16);
        }
        self.state = "enabled";
        self.container.setAttribute("data-ur-state", self.state);

        var touch = "ontouchstart" in window;
        var $container = x$(self.container);
        $container.on(touch ? "touchstart" : "mousedown", panStart);
        $container.on(touch ? "touchmove" : "mousemove", panMove);
        $container.on(touch ? "touchend" : "mouseup", panEnd);
      }
      else if (self.state == "enabled-out") {
        self.state = "disabled";
        self.container.setAttribute("data-ur-state", self.state);
        
        var touch = "ontouchstart" in window;
        var $container = x$(self.container);
        $container.un(touch ? "touchstart" : "mousedown", panStart);
        $container.un(touch ? "touchmove" : "mousemove", panMove);
        $container.un(touch ? "touchend" : "mouseup", panEnd);
      }
    }

    function zoomHelper(x, y) {
      $btn.attr("data-ur-state", "enabled");
      self.state = "enabled-in";
      self.container.setAttribute("data-ur-state", self.state);
      
      x = x ? x : 0;
      y = y ? y : 0;
      transform(x, y, self.ratio);
    }

    function transform(x, y, scale) {
      var t = "";
      if (x != undefined)
        t = translatePrefix + x + "px, " + y + "px" + translateSuffix;
      if (scale != undefined) {
        if (noScale3d)
          t += " scale(" + scale + ")";
        else
          t += " scale3d(" + scale + ", " + scale + ", 1)";
      }
      return $img.css({ webkitTransform: t, MozTransform: t, OTransform: t, transform: t });
    }

    // attempts to zoom in centering in on the area that was touched
    this.zoomIn = function(event) {
      if (self.state != "disabled")
        return;

      if (!self.width) {
        initialize();
        self.img.style.width = self.width + "px";
        self.img.style.height = self.height + "px";
      }

      var x = event.pageX, y = event.pageY;
      if (event.touches) {
        x = event.touches[0].pageX;
        y = event.touches[0].pageY;
      }

      // find touch location relative to image
      relX = event.offsetX;
      relY = event.offsetY;
      if (relX == undefined || relY == undefined) {
        var offset = self.img.getBoundingClientRect();
        relX = x - offset.left;
        relY = y - offset.top;
      }

      if (!self.prescale) {
        self.state = "enabled-in";
        self.img.src = $img.attr("data-ur-src")[0];
        setTimeout(function() {
          if (!self.prescale)
            $idler.attr("data-ur-state", "enabled");
        }, 0);
      }
      else {
        var translateX = bound(self.bigWidth/2 - self.ratio * relX, [-boundX, boundX]);
        var translateY = bound(self.bigHeight/2 - self.ratio * relY, [-boundY, boundY]);
        zoomHelper(translateX, translateY);
      }
    };

    this.zoomOut = function() {
      if (self.state != "enabled")
        return;
      $btn.attr("data-ur-state", "disabled");
      self.state = "enabled-out";
      self.container.setAttribute("data-ur-state", self.state);
      transform(0, 0, 1);
    };

    if (self.container.getAttribute("data-ur-touch") != "disabled")
      x$(self.container).click(self.zoomIn);

    $img.load(function() {
      if ($img.attr("src")[0] == $img.attr("data-ur-src")[0])
        loaded_imgs.push($img.attr("src")[0]);
      $idler.attr("data-ur-state", "disabled");
      if (!self.prescale && self.state == "enabled-in") {
        self.prescale = true;
        initialize();
        var translateX = bound(self.bigWidth/2 - self.ratio * relX, [-boundX, boundX]);
        var translateY = bound(self.bigHeight/2 - self.ratio * relY, [-boundY, boundY]);

        var delay = "0.3s";
        $img.css({ webkitTransitionDelay: delay, MozTransitionDelay: delay, OTransitionDelay: delay, transitionDelay: delay });

        zoomHelper(translateX, translateY);
      }
    });

    // zooms in to the center of the image
    this.zoom = function() {
      if (self.state == "disabled") {
        if (!self.width) {
          initialize();
          self.img.style.width = self.width + "px";
          self.img.style.height = self.height + "px";
        }

        if (self.prescale)
          zoomHelper(0, 0);
        else {
          self.state = "enabled-in";
          self.img.src = $img.attr("data-ur-src")[0];
          setTimeout(function() {
            // if prescale ?
            if (loaded_imgs.indexOf(self.img.getAttribute("data-ur-src")) == -1)
              $idler.attr("data-ur-state", "enabled");
          }, 0);
        }
      }
      else
        self.zoomOut();
    };

    // zoom in/out button, zooms in to the center of the image
    x$(self.button).click(self.zoom);

    x$.fn.iterate(["webkitTransitionEnd", "transitionend", "oTransitionEnd"], function(eventName) {
      $img.on(eventName, transitionEnd);
    });

    this.reset = function() {
      self.prescale = false;
      self.width = self.height = 0;
      $img.css({width: "", height: ""});
      transform();
      self.state = "enabled-out";
      transitionEnd();
      $idler.attr("data-ur-state", "disabled");
      $btn.attr("data-ur-state", "disabled");
    };
  }
  
  // Private shared variables
  
  var loaded_imgs = []; // sometimes the load event doesn't fire when the image src has been previously loaded
  
  var no3d = /Android [12]|Opera/.test(navigator.userAgent);

  var noTranslate3d = no3d;
  var noScale3d = no3d;

  var translatePrefix = noTranslate3d ? "translate(" : "translate3d(";
  var translateSuffix = noTranslate3d ? ")" : ", 0)";

  var scalePrefix = noScale3d ? " scale(" : " scale3d(";
  var scaleSuffix = noScale3d ? ")" : ", 1)";


  // Private shared methods

  function bound(num, range) {
    return Math.max(Math.min(range[0], num), range[1]);
  }

  function stifle(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Private constructors
  var ComponentConstructors = {
    
  };

  function ZoomLoader(){}

  ZoomLoader.prototype.initialize = function(fragment) {
    var zooms = x$(fragment).findElements("zoom", ComponentConstructors);
    Ur.Widgets["zoom"] = {};
    for (var name in zooms) {
      var zoom = zooms[name];
      Ur.Widgets["zoom"][name] = new Zoom(zoom);
    }
  }

  return ZoomLoader;
})();

/* Zoom Preview  *
 * * * * * * * * *
 * The zoom-preview widget provides a thumbnail button that when touched 
 * displays and translates the zoom-image.
 * 
 */

Ur.QuickLoaders['zoom-preview'] = (function(){

  function ZoomPreview(data){
    this.elements = data["elements"];
    this.modifier = {};
    
    if (data["modifier"] !== null) {
      this.modifier = data["modifier"];
    }
    this.dimensions = {};
    this.zoom = false;

    this.update();
    this.events = {"start": "touchstart", "move" : "touchmove", "end" : "touchend"};

    this.touch = xui.touch;

    // Would be cool to compile this out
    if (!this.touch)
      this.events = {"move" : "mousemove", "end" : "mouseout"};

    this.initialize();
    console.log("Zoom Preview Loaded");
  }

  ZoomPreview.prototype.rewrite_images = function(src, match, replace) {
    if(typeof(src) == "undefined")
      return false;

    if(match === undefined && replace === undefined) {
      match = this.modifier["zoom_image"]["match"];
      replace = this.modifier["zoom_image"]["replace"];
    }

    this.elements["zoom_image"].src = src.replace(match, replace);

    match = replace = null;

    if(this.modifier["button"]) {
      match = this.modifier["button"]["match"];
      replace = this.modifier["button"]["replace"];
    }

    if(match && replace) {
      this.elements["button"].src = this.elements["zoom_image"].src.replace(match, replace);
    } else {
      this.elements["button"].src = this.elements["zoom_image"].src;
    }

    var self = this;
    this.elements["zoom_image"].style.visibility = "hidden";
    x$(this.elements["zoom_image"]).on("load", function(){self.update()});  
    x$(this.elements["button"]).on("load", function(){x$(self.elements["button"]).addClass("loaded");});  
    // TODO: Make this callback add the 'loaded' state
  }

  ZoomPreview.prototype.update = function() {
    var self = this;
    x$().iterate(
      ["button","zoom_image","container"],
      function(elem) {
        self.dimensions[elem] = [self.elements[elem].offsetWidth, self.elements[elem].offsetHeight];
      }
    );  

    var offset = x$(this.elements["button"]).offset();
    var button_offset = [offset["left"], offset["top"]];

    this.button_center = [this.dimensions["button"][0]/2.0 + button_offset[0],
                          this.dimensions["button"][1]/2.0 + button_offset[1]];

    this.image_origin = [-1.0/2.0*this.dimensions["zoom_image"][0], -1.0/2.0*this.dimensions["zoom_image"][1]];
  }

  ZoomPreview.prototype.get_event_coordinates = function(event) {
    if (!this.touch){
      return [event.pageX, event.pageY];
    } else {
      if(event.touches.length == 1)
      {
        return [event.touches[0].pageX, event.touches[0].pageY];
      }
    }
  }

  ZoomPreview.prototype.initialize = function() {
    x$(this.elements["button"]).on(this.events["move"],function(obj){return function(evt){obj.scroll_zoom(evt)};}(this));
    x$(this.elements["button"]).on(this.events["end"],function(obj){return function(evt){obj.scroll_end(evt)};}(this));

    // To prevent scrolling:
    if(this.events["start"]) {
      x$(this.elements["button"]).on("touchstart",function(obj){return function(evt){evt.preventDefault()};}(this));
    }

    var self = this;
    x$(this.elements["thumbnails"]).click(
      function(obj) {
        return function(evt){
          if (evt.target.tagName != "IMG")
            return false;
          obj.rewrite_images(evt.target.src); //, obj.modifier["match"], obj.modifier["replace"]);
        };
      }(self)
    );

    // Setup the initial button/zoom image:
    this.normal_image_changed();

  }

  ZoomPreview.prototype.normal_image_changed = function(new_normal_image) {
    if (new_normal_image !== undefined) {
      this.elements["normal_image"] = new_normal_image;
    }

    img = x$(this.elements["normal_image"]);
    this.rewrite_images(img.attr("src")[0], this.modifier["normal_image"]["match"], this.modifier["normal_image"]["replace"]);
  }

  ZoomPreview.prototype.scroll_end = function(event) {
    this.elements["zoom_image"].style.visibility = "hidden";
  }

  ZoomPreview.prototype.scroll_zoom = function(event) {
    this.elements["zoom_image"].style.visibility = "visible";

    var position = this.get_event_coordinates(event);
    if (position === null) {return false};

    var percents = [(position[0] - this.button_center[0])/this.dimensions["button"][0],
                    (position[1] - this.button_center[1])/this.dimensions["button"][1]];

    var delta = [this.dimensions["zoom_image"][0] * percents[0],
                 this.dimensions["zoom_image"][1] * percents[1]];

    var translate = [this.image_origin[0] - delta[0],
                     this.image_origin[1] - delta[1]];
    
    translate = this.check_bounds(translate);
    this.elements["zoom_image"].style.webkitTransform = "translate3d(" + translate[0] + "px," + translate[1] + "px,0px)";
  }

  ZoomPreview.prototype.check_bounds = function(translate){
    var min = [this.dimensions["container"][0]-this.dimensions["zoom_image"][0], this.dimensions["container"][1]-this.dimensions["zoom_image"][1]];

    x$().iterate(
      [0,1],
      function(index){
        if (translate[index] >= 0)
          translate[index] = 0;
        if (translate[index] <= min[index])
          translate[index] = min[index];
      }
    );

    return translate;
  }

  var ComponentConstructors = {
    "_modifiers" : function(group, component, type, modifier_prefix) {
      if (group["modifier"] === undefined) {
        group["modifier"] = {};
      }
      
      var prefix = (modifier_prefix === undefined) ? "src" : "zoom";
      console.log("searching for modifier:", prefix, component);
      var match = x$(component).attr("data-ur-" + prefix + "-modifier-match")[0];
      var replace = x$(component).attr("data-ur-" + prefix + "-modifier-replace")[0];
      
      if(typeof(match) != "undefined" && typeof(replace) != "undefined") {
        console.log("found modifiers:",match,replace);
        group["modifier"][type] = {"match":new RegExp(match),"replace":replace};
      }
    },
    "_construct" : function(group, component, type, modifier_prefix) {
      if (group["elements"] === undefined) {
        group["elements"] = {};
      }
      group["elements"][type] = component;
      this._modifiers(group, component, type, modifier_prefix);
    },
    "normal_image" : function(group, component, type) {
      this._construct(group, component, type, "zoom");
    },
    "zoom_image" : function(group, component, type) {
      this._construct(group, component, type);
    },
    "button" : function(group, component, type) {
      this._construct(group, component, type);
    },  
    "container" : function(group, component, type) {
      this._construct(group, component, type);
    },  
    "thumbnails" : function(group, component, type) {
      this._construct(group, component, type);
    }  
  }

  function ZoomPreviewLoader(){
  }

  ZoomPreviewLoader.prototype.initialize = function(fragment) {
    this.zoom_previews = x$(fragment).findElements('zoom-preview', ComponentConstructors);
    Ur.Widgets["zoom-preview"] = {};
    for (var name in this.zoom_previews) {
      Ur.Widgets["zoom-preview"][name] = new ZoomPreview(this.zoom_previews[name]);
      x$(this.zoom_previews[name]["set"]).attr("data-ur-state","enabled");
    }
  }

  return ZoomPreviewLoader;
})();


/*
 * File: http://d1topzp4nao5hp.cloudfront.net/plutonium-upload/0.1.55/auto_scroll.js
 */
x$(window).on(
  'load',
  function(){setTimeout(function(){ if (window.pageYOffset < 50) {window.scrollTo(0,1);}},0);}
);
                  
x$(window).on(
  'load',
  function(){setTimeout(function(){ if (parent.window.pageYOffset < 50) {parent.window.scrollTo(0,1);}},0);}
);


/*
 * File: http://d1topzp4nao5hp.cloudfront.net/plutonium-upload/0.1.66/desktop_link.js
 */
/* 
 * Desktop Site Link
 *
 * The Desktop Site Link is a little Javascript snippet that redirects you
 * to the desktop version of whatever page you are on.
 * 
 * Basically if you are on m.example.com it will take you to www.example.com. However
 * sometimes the rewriter rules are more complicated than that. This will take
 * the rewriter rules for your project into account.
 *
 * It also sets the mw_mobile_site cookie. This is the cookie that indicates to the
 * customer's redirection code whether or not a mobile user should be redirected.
 * 
 * USAGE:
 *
 * 3 steps to use with Tritium:
 *
 * 1. Add this script file
 *
 * 2. Insert a link with the 'mw_desktop_link' ID, i.e.:
     inject("<a id='mw_desktop_link'>Desktop Site</a>")
 *
 * 3. Configure by placing the 'mw_desktop_link_config' element anywhere on your page, i.e.:
     insert("div") {
       attribute("id", "mw_desktop_link_config")
       attribute("matcher", $rewrite_incoming_matcher)
       attribute("replacement", $rewrite_incoming_replacement)
       attribute("cookie_hours", "0")
       attribute("cookie_domain", ".belk.com")
       attribute("rewriter_json", $rewrite_incoming_json)
     }
 *
 * The 'mw_desktop_link_config' element can be used to configure how the desktop link works
 * with these parameters:
 *
 *   matcher= Regex for matching your mobile URL.
 *
 *   replacement= Replacement string to create a desktop URL out of mobile URL.
 *
 *   cookie_hours= (optional) The number of hours for which the mw_mobile_site cookie will be valid.
 *   Defaults to '0', in which case 'expires' is not specified so the cookie is transient.
 *
 *   cookie_domain= (optional) Set this to the domain which is shared by the mobile site
 *   and the desktop site (i.e. .example.com). If you don't select anything it will be set
 *   for you, but it cannot be automatically set if the top-level domain has more than one
 *   label (as in .co.uk).
 *
 *   immediate= (optional) If you set immediate to 'true' then as soon as this javascript executes
 *   the user will be redirected to the equivalent desktop page.
 *
 *   this_page_only= (optional) If you set this_page_only to 'true' then the desktop site cookie
 *   will only apply to this particular page. Works will with 'immediate' for specifying that this
 *   particular page has not been reformatted for mobile.
 */
x$(document).on("DOMContentLoaded", function() {
  var me = document.getElementById("mw_desktop_link_config");
  
  if (me === null) {
    console.log("No mw_desktop_link_config element found. This window url : (" + window.document.location.href +")");
    return;
  }

  var cookie_domain = me.getAttribute("cookie_domain");
  if (!cookie_domain) {
    cookie_domain = "." + /([a-z\-]+\.[a-z\-]+)($|\/|\?)/.exec(window.location.toString())[1];
  }
  var cookie_hours = 1;
  var cookie_hours_attribute = me.getAttribute("cookie_hours");
  if (cookie_hours_attribute) {
    cookie_hours = parseInt(cookie_hours_attribute);
  }
  var cookie_seconds = cookie_hours * 1000 * 60 * 60;

  var rewriters;
  var rewriter_json = me.getAttribute("rewriter_json");

  if (rewriter_json !== null) {
    var rewriters = JSON.parse(rewriter_json);
    // replace ruby-style capture groups (\1) with js-style ($1)
    for (var i=0;i<rewriters.length;i++) {
      rewriters[i]["replacement"] = rewriters[i]["replacement"].replace(/\\/g, "$");
    }
  }
  
  var set_desktop_cookie = function() {
    var expires = new Date(new Date().getTime() + cookie_seconds);
    var cookie = "mw_mobile_site=false; ";
    // zero cookie seconds means a session/transient cookie - no 'expires' portion
    if (cookie_seconds != 0) {
      cookie += "expires=" + expires.toGMTString() + "; ";
    }
    if (me.getAttribute("this_page_only") == "true") {
      cookie += "path=" + window.location.pathname + "; ";
    } else {
      cookie += "path=/; ";
    }
    cookie += "domain=" + cookie_domain;
    document.cookie = cookie;
    return true;
  };

  // Get the desktop equivalent to the current location (i.e. get www.example.com for m.example.com)
  var secure = (window.location.protocol=="http:")?"false":"true";
  
  var get_desktop_location = function() {
    var location = window.location.hostname;
    if (rewriters != null) {
      for (var j=0;j<rewriters.length;j++) {
        var matcher = new RegExp(rewriters[j]['matcher']);
        var replacement = rewriters[j]['replacement'];
        replacement = replacement.replace(/\$secure/, secure);
        location = location.replace(matcher, replacement);
      }
    } else {
			return mw.proxyURLToOrigin(window.location.href);	
    }
    return window.location.protocol + "//" + location + window.location.pathname + window.location.search;
  };
  var desktop_location = get_desktop_location();

  var desktop_link = document.getElementById("mw_desktop_link");
  if (desktop_link) {
    desktop_link.onclick = set_desktop_cookie;
    desktop_link.setAttribute("href", desktop_location);
  }

  if (me.getAttribute("immediate") == "true") {
    set_desktop_cookie();
    window.location = desktop_location;
  }
});


/*
 * File: http://d1topzp4nao5hp.cloudfront.net/plutonium-upload/0.1.55/gsub.js
 */
/* Ruby style gsub / Sean Jezewski
 * * * * * * * * * 
 */

function single_split(big_string, delimiter) {
  var lower_boundary = big_string.indexOf(delimiter);
  var upper_boundary = lower_boundary + delimiter.length;
  return [big_string.substr(0, lower_boundary), big_string.substr(upper_boundary, big_string.length-1)];
}

function gsub(input, matcher, replace) {
  if(input === undefined) {
    // For example, applying passthrough to an attribute that doesn't exist
    // TODO: check to make sure downstream effects are ok
    console.error("gsub -- empty input:", arguments);
    return null;
  }
  if (matcher == "") {
    return input;
  }

  var captures = {};
  var match_data = null; 
  var head = "";
  var tail = input;
  var match = "";
  var is_string = (typeof(matcher) == 'string');

  var apply_matcher = function(tail) { return matcher.exec(tail); }

  if (is_string) {
    apply_matcher = function(tail) { return (tail.indexOf(matcher) == -1) ? null : [matcher];}
  }

  var counter = 0;

  //  while(match_data = matcher.exec(tail)) {
  while(match_data = apply_matcher(tail) ) {
    counter += 1;

    if(counter == 100) {
      return;
    }

    match = match_data[0];
    var parts = single_split(tail, match);

    head += parts[0];
    tail = parts[1];

    if(is_string) {
      head += replace;
    } else {

      x$().iterate(
        match_data,
        function(capture, index) {
          if (index == 0) {
            return;
          }
          captures[String(index)] = capture;
        }
      );

      // This is silly -- JS supports captures, but not yielding, so to support global replace w captures, I need implement it myself

      // Start replace string setup
      var head_replace_string = "";
      var tail_replace_string = replace;

      while(replace_data = /[\$\\]([\d])/.exec(tail_replace_string)) {
        var replacement_parts = single_split(tail_replace_string, replace_data[0]);

        head_replace_string += replacement_parts[0];
        tail_replace_string = replacement_parts[1];
        
        head_replace_string += captures[replace_data[1]];      
      }

      if(tail_replace_string.length > 0) {
        head_replace_string += tail_replace_string;
      }

      // End replace string setup

      head += head_replace_string;

    }

  }

  if(tail.length > 0) {
    head += tail;
  }

  return head;
}



/*
 * File: http://d1topzp4nao5hp.cloudfront.net/plutonium-upload/0.1.66/passthrough_ajax.js
 */
/* * * * * * * * * * * 
 * Tritium usage:
 * 1 - Add this script, and gsub script
 * 2 - Add an element on the page to configure the replacement:
 * 
     insert("div") {
       attribute("id", "mw_link_passthrough_config")
       attribute("rewrite_link_matcher", $rewrite_link_matcher)
       attribute("rewrite_link_replacement", $rewrite_link_replacement)
     }
 * 
 * 
 */

(function(){

    var matcher = null;
    var replace = null;

    function get_config(config_element) {
        var raw_matcher = config_element.getAttribute("rewrite_link_matcher");
				if (raw_matcher !== null) {
        	matcher = new RegExp(raw_matcher, "g");
				}

        replace = config_element.getAttribute("rewrite_link_replacement");
    }

		function normalize_host(host) {
			if (host[host.length-1] == "/") {
				host = host.slice(0,host.length-1);
			}
			return host;
		}	

		function split_schema_and_host(schema_and_host) {
			parts = schema_and_host.split("//");
			schema = parts[0];
			host = parts[1];
			return {
				"schema" : schema + "//",
				"host" : normalize_host(host)
			}
		}
			
		// Splits into schema / host / path			
		function url_components(url) {
			length = url.length;
			var previous = "";
			var found_slash = false;
			
			for(var i=0; i < length; i++) {
				if (url[i] == "/") {
					if (previous != "/" && found_slash) {
						path = url.slice(i+1, length);
						parts = split_schema_and_host(url.slice(0, i+1));

						return {
							"schema" : parts.schema,
							"host" : parts.host,							
							"path" : path							
						}
					} else {
						found_slash = false;
					}
					
					found_slash = true;					
				}
				previous = url[i];
			}
			
			// Never found the start of path ... the whole thing is the 'host' part
			parts = split_schema_and_host(url);
			
			return {
				"schema" : parts.schema,
				"host" : parts.host,							
				"path" : ""							
			}			
			
		}


    function passthrough_url(url) {
      var temp_url = url;
      var config_element = document.getElementById('mw_link_passthrough_config');  
			var use_host_map = false;


      if (config_element !== null) {
        if (!matcher && !replace) {
          get_config(config_element);
        }

				if (!matcher && !replace) {
					use_host_map = true;
				} else {
        	temp_url = gsub(url, matcher, replace);
				}
      } else {
				return mw.originURLToProxy(url);
			}
			
      return temp_url;
    }


    function hijack_open(method, url, some_boolean) {
        var new_url = passthrough_url(url);
        this._open(method, new_url, some_boolean);
    }

    if (XMLHttpRequest)
    {
        XMLHttpRequest.prototype._open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = hijack_open;
    } else if (ActiveXObject)
    {
        ActiveXObject.prototype._open = ActiveXObject.prototype.open;
        ActiveXObject.prototype.open = hijack_open;
    }

})();



/*
 * File: http://d1topzp4nao5hp.cloudfront.net/plutonium-upload/0.1.55/ajax_callbacks.js
 */
function setAjaxCallbacks(match, success, error) {
  if(XMLHttpRequest)
  {
    __XMLHttpRequest = XMLHttpRequest;
    XMLHttpRequest = function(){
      this.match_regex = new RegExp(match);
      this.success_callback = success;
      this.error_callback = error;
      this.xhr = new __XMLHttpRequest();
    };

    XMLHttpRequest.prototype = {
      abort: function(){
        return this.xhr.abort();
      },
      get onreadystatechange(){
        return this.callback;
      },
      get readyState(){
        return this.xhr.readyState;
      },
      get responseText(){
        return this.xhr.responseText;
      },
      get responseXML(){
        return this.xhr.responseXML;
      },
      get status(){
        return this.xhr.status;
      },
      get statusText(){
        return this.xhr.statusText;
      },
      getAllResponseHeaders: function(){
        return this.xhr.getAllResponseHeaders();
      },
      getResponseHeader: function(header_label){
        return this.xhr.getResponseHeader(header_label);
      },
      open: function(method,url,async,username,password){
        this.request_url = url;
        if (this.callback == null || typeof(this.callback) == 'undefined')
          this.onreadystatechange = function(){};
        return this.xhr.open(method,url,async,username,password);
      },
      send: function(data) { this.xhr.send(data);},
      set onreadystatechange(callback){
        this.callback = callback;
        this.xhr.onreadystatechange = function(obj){return function(x){
          if (this.readyState==4 && obj.match_regex.exec(obj.request_url)){
  	    if(x.target.status == 200){
	      if (obj.success_callback)
  	        obj.success_callback(this.responseText,this.responseXML);
	    }else{
	      if (obj.error_callback)
	        obj.error_callback(x.target.status, x.target.statusText);
	    }
          } 
          obj.callback(x);
        }}(this);
      },
      setRequestHeader: function(label, value){
        return this.xhr.setRequestHeader(label, value);
      }
    }
  }
}


/*
 * File: http://d1topzp4nao5hp.cloudfront.net/plutonium-upload/0.1.79/convert_image_maps.js
 */
/* resizes image map area coordinates when window resizes
   
   example usage:
   x$(window).load(function() {
     x$("img").each(function(img) { convertImageMap(img); });
   });
*/

function convertImageMap(img) {
  if (img.useMap) {
    var width = img.getAttribute("width") || img.naturalWidth, height = img.getAttribute("height") || img.naturalHeight;
    var areas = x$("map[name='" + img.useMap.substring(1) + "']")[0].areas;
    x$(areas).each(function(area) {
      var coords = area.coords.split(",");
      function adjust() {
        var newcoords = new Array(coords.length);
        var wratio = img.offsetWidth/width, hratio = img.offsetHeight/height;
        for (var i = 0; i < newcoords.length; i++) {
          if (i % 2 == 0)
            newcoords[i] = Math.round(coords[i]*wratio);
          else
            newcoords[i] = Math.round(coords[i]*hratio);
        }
        area.coords = newcoords.join(",");
      }
  
      x$(window).orientationchange(adjust).on("resize", adjust);
      adjust();
    });
  }
}



/*
 * File: http://d1topzp4nao5hp.cloudfront.net/plutonium-upload/0.1.80/mw_analytics.js
 */
/*
 * Moovweb Google Analytics Rewrite
 *
 * This is a simple rewrite of ga.js
 * It will track page requests to Moovweb's GA account, regardless
 * of whether or not said page already has GA on it tracking to
 * a separate account.
 *
 * USAGE:
 *
 * 2 steps to use with Tritium:
 *
 * 1. Add this script file
 *
 * 2. (Optional) Configure by placing the 'mw_ga_config' element
 *               anywhere on the page

     insert("div") {
       attribute("id", "mw_ga_config")
       attribute("page_name", "home")
     }

 *  *
 * The 'mw_ga_config' element can be used with these parameters:
 *
 *   page_name: The word that Moovweb uses to describe this page.
 *              Setting this variable allows Moovweb to view data
 *              for multiple customers at the same time, i.e.
 *              seeing how many 'order complete' pages where viewed
 *              across all customers.
 */
x$(window).on("load", function() {
  function ra() {
    return Math.round(Math.random() * 2147483647);
  };

  // Generate a time value in seconds to use when building the utma cookie.
  function getUtmaTime() {
    return Math.round( ( Number( new Date() ) / 1000 ) ).toString();
  };

  // Generate an integer hash value for a provided domain name to use when building the utma cookie.
  // (replica of domain hash function from ga.js)
  function getUtmaDomainHash( aFQDN ) {
    var a=1,c=0,h,o;
    if(aFQDN){
      a=0;
        for(h=aFQDN["length"]-1;h>=0;h--){
          o=aFQDN.charCodeAt(h);
          a=(a<<6&268435455)+o+(o<<14);
          c=a&266338304;
          a=c!=0?a^c>>21:a
        }
      }
    return a.toString()
  };

  // Generate a random integer between 1147483647 and 2147483647 to use when building the utma cookie.
  function getUtmaRandval() {
    return (Math.round(Math.random() * 1147483647) + 1000000000).toString();
  };

  // UTMA: visit distinction cookie
  // Generate the __utma cookie value on-the-fly to avoid the "single daily visitor" problem with GA.
  //
  // This should be expressed in the form: 
  //
  //     domainhash.randval.time.time.time.visits
  //
  // ... where randval is a random integer between 1147483647 and 2147483647.
  function getUtma( aFQDN ) {
    var domainhash = getUtmaDomainHash( aFQDN );
    var randval    = getUtmaRandval();
    var time       = getUtmaTime();
    var visits     = "1";

    return domainhash + "." + randval + "." + time + "." + time + "." + time + "." + visits;
  };

  // UTME: Custom variables
  // Take a page name, determine its subordinate values, return an encoded utme value.
  //
  // Our page name convention is: 
  //    customername_targetpagename
  //
  // The utme variable encoding convention is: 
  //    8(key1*key2*...*keyn)9(val1*val2*...*valn)11(level1*level2*...*leveln)
  //
  function getUtme( page_name ) {
    var customer    = page_name.slice( 0, page_name.indexOf('_') );
    var target_page = page_name.slice( page_name.indexOf('_')+1 ); 
  
    // custom variable names
    var eightblock  = "8(page_name*customer*target_page)";
    // respective customer variable values
    var nineblock  = "9(" + page_name + "*" + customer + "*" + target_page + ")";
    // all registered as session-level (visit) variables (=2)
    var elevenblock = "11(2*2*2)";

    return eightblock + nineblock + elevenblock;
  };

  // UTME: Custom variables
  // Take a node's attributes/values and return an encoded utme value.
  //
  // Our page name convention is:
  //    customername_targetpagename
  //
  // The utme variable encoding convention is:
  //    8(key1*key2*...*keyn)9(val1*val2*...*valn)11(level1*level2*...*leveln)
  //
  function getUtmeAllAttrs(attrs) {
    var keys = [];
    var vals = [];
    for (var key in attrs) {
      keys.push(key);
      vals.push(attrs[key]);
    }

    // if we have performance info (note: this is called after load), add it as a single var
    if (window.performance.timing) {
      var t = window.performance.timing;
      var fetchStart = t.fetchStart;
      var responseEnd = t.responseEnd;
      var domContentLoaded = t.domContentLoadedEventEnd;
      var loadEvent = t.loadEventEnd;
      var latency = responseEnd - fetchStart;
      var dcl = domContentLoaded - fetchStart;
      var load = loadEvent - domContentLoaded;
      keys.push("latency;dcl;load;navType");
      vals.push(latency+";"+dcl+";"+load+";"+window.performance.navigation.type);
    }

    var keysString  = keys.join("*");
    var valsString  = vals.join("*");

    // custom variable names
    var eightblock  = "8("+keysString+")";
    // respective customer variable values
    var nineblock   = "9("+valsString+")";
    // all registered as session-level (visit) variables (=2)
    var elevenblock = "11(2*2*2)";

    return eightblock + nineblock + elevenblock;
  };

  // getNodeAttrs(DOM node)
  // returns the node's attributes and values as a JSON object
  function getNodeAttrs(node) {
    var ret = {};
    var attrs = node.attributes;
    for(var i=0; i<attrs.length; i++) {
      ret[attrs[i].nodeName] = attrs[i].nodeValue;
    }
    return ret;
  }

  var account_string = "UA-26975743-1";
  var protocol_host = (("https:" == document.location.protocol) ?  "https://ssl." : "http://www.");
  var pixel_host = protocol_host + "google-analytics.com/__utm.gif?";

  var p = {};
  var wn = window.navigator;
  var ws = window.screen;
  p['utm_id'] = ra();
  p['utmac'] = account_string;
  p['utmcs'] = document.characterSet || document.charset || "-";
  p['utmdt'] = escape(document.title);
  p['utmhid'] = ra();
  p['utmhn'] = escape(document.location.hostname);
  p['utmje'] = (wn && wn.javaEnabled()) ? "1" : "0";
  p['utmn'] = ra();
  p['utmp'] = encodeURIComponent(window.location.pathname + window.location.search);
  p['utmr'] = (document.referrer && document.referrer != "") ? document.referrer : "-";
  p['utmsc'] = ws ? ws.colorDepth + "-bit" : "-";
  p['utmsr'] = ws ? ws.width + "x" + ws.height : "-";
  p['utmul'] = (wn && (wn.language || wn.browserLanguage) || "-").toLowerCase();
  p['utmwv'] = "4.4sj";

  // this utma cookie will ensure that each pageview is considered to be a unique user session
  var utma = getUtma ( p['utmhn'] );
  p['utmcc'] = "__utma%3D" + utma + "%3B";

  // gets the page info and compiles a path from it
  function getPageInfo() {
	  // inject the page name information into custom variables (utme) bucket -- returns path
	  var config = document.getElementById("mw_ga_config");
	  if (config) {
	    p['utme'] = getUtmeAllAttrs(getNodeAttrs(config));
	    var pn = config.getAttribute("page_name");
	    if (pn && pn != "") {
	      var page_name = encodeURIComponent( pn );
	      //p['utme'] = getUtme( page_name );

	      // also put the page_name information in the document title bucket
	      p['utmdt'] = "MW_ANALYTICS_" + page_name;
	    }
	  } else {
      p['utme'] = getUtmeAllAttrs(null);
    }

	  var path = "";
	  for (var i in p) {
	    path += i + "=" + p[i] + "&";
	  }
	  if (path.length > 0) {
	    path = path.slice(0, path.length - 1);
	  }
	  return path
  }

  function sendAnalytics(path) {
    var img = new Image(1, 1);
    img.src = pixel_host + path;
  }
  function getDesktopLinkClick() {
	  // inject the desktop link click information into custom variables, event (utme) bucket -- returns path
	  var desktop_link = document.getElementById("mw_desktop_link");
	  if (desktop_link) {
	    var config = document.getElementById("mw_ga_config");
  	  if (config) {
  	    var pn = config.getAttribute("page_name");
  	    if (pn && pn != "") {
  	      var page_name = encodeURIComponent( pn );
  	      p['utme'] = ("8(desktop_link*leave_page_name)9(click*"+pn+")11(2*2*2)");
        }
  	    else {
  	      p['utme'] = ("8(desktop_link*leave_page_path)9(click*"+location.pathname+")11(2*2*2)");
  	    }
      }
      else {
	      p['utme'] = ("8(desktop_link*leave_page_path)9(click*"+location.pathname+")11(2*2*2)");
	    }
	  }
	  var path = "";
	  for (var i in p) {
	    path += i + "=" + p[i] + "&";
	  }
	  if (path.length > 0) {
	    path = path.slice(0, path.length - 1);
	  }
	  return path
  }

  var desktop_link = document.getElementById("mw_desktop_link");
  if (desktop_link) {
    desktop_link.addEventListener("click", sendDesktopSite, false);
    console.log("Desktop_link analytics added");
  }

  function sendDesktopSite() {
    var path = getDesktopLinkClick();
    sendAnalytics(path);
  }
  // wrap getPageInfo and sendInfo in a setTimeout so we have all window.performance.timing fields
  setTimeout(function() {
    var path = getPageInfo();
    sendAnalytics(path);
  }, 0);
});



/*
 * File: host_map.js
 */

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  WARNING: Moovweb auto-generated file. Any changes you make here will *
 *  be overwritten.                                                      *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

(function(){

var mapProxyToOrigin = {"http://m.asda.tags.sitetagger.co.uk":"http://asda.tags.sitetagger.co.uk","http://m.asdapim.direct.asda.com":"http://asdapim.direct.asda.com","http://m.dev5.direct.asda.com":"http://dev5.direct.asda.com","http://m.development.direct.asda.com":"http://development.direct.asda.com","http://m.direct.asda.com":"http://direct.asda.com","http://m.email.asda.com":"http://email.asda.com","http://m.george.com":"http://www.george.com","http://m.staging.asda.ecommera.demandware.net":"http://staging.asda.ecommera.demandware.net","http://m.staging.direct.asda.com":"http://staging.direct.asda.com","http://m.stc-dev.direct.asda.com":"http://stc-dev.direct.asda.com","http://m.your.asda.com":"http://your.asda.com","https://m.asda.tags.sitetagger.co.uk":"https://asda.tags.sitetagger.co.uk","https://m.asdapim.direct.asda.com":"https://asdapim.direct.asda.com","https://m.dev5.direct.asda.com":"https://dev5.direct.asda.com","https://m.development.direct.asda.com":"https://development.direct.asda.com","https://m.direct.asda.com":"https://direct.asda.com","https://m.email.asda.com":"https://email.asda.com","https://m.george.com":"https://www.george.com","https://m.staging.asda.ecommera.demandware.net":"https://staging.asda.ecommera.demandware.net","https://m.staging.direct.asda.com":"https://staging.direct.asda.com","https://m.stc-dev.direct.asda.com":"https://stc-dev.direct.asda.com","https://m.your.asda.com":"https://your.asda.com"};
var mapOriginToProxy = {"http://asda.tags.sitetagger.co.uk":"http://m.asda.tags.sitetagger.co.uk","http://asdapim.direct.asda.com":"http://m.asdapim.direct.asda.com","http://dev5.direct.asda.com":"http://m.dev5.direct.asda.com","http://development.direct.asda.com":"http://m.development.direct.asda.com","http://direct.asda.com":"http://m.direct.asda.com","http://email.asda.com":"http://m.email.asda.com","http://staging.asda.ecommera.demandware.net":"http://m.staging.asda.ecommera.demandware.net","http://staging.direct.asda.com":"http://m.staging.direct.asda.com","http://stc-dev.direct.asda.com":"http://m.stc-dev.direct.asda.com","http://www.george.com":"http://m.george.com","http://your.asda.com":"http://m.your.asda.com","https://asda.tags.sitetagger.co.uk":"https://m.asda.tags.sitetagger.co.uk","https://asdapim.direct.asda.com":"https://m.asdapim.direct.asda.com","https://dev5.direct.asda.com":"https://m.dev5.direct.asda.com","https://development.direct.asda.com":"https://m.development.direct.asda.com","https://direct.asda.com":"https://m.direct.asda.com","https://email.asda.com":"https://m.email.asda.com","https://staging.asda.ecommera.demandware.net":"https://m.staging.asda.ecommera.demandware.net","https://staging.direct.asda.com":"https://m.staging.direct.asda.com","https://stc-dev.direct.asda.com":"https://m.stc-dev.direct.asda.com","https://www.george.com":"https://m.george.com","https://your.asda.com":"https://m.your.asda.com"};

if (typeof(mw) == "undefined") {
	window.mw = {};
}

if(typeof(mw.catch_all_domain) == "undefined") {
	mw.catch_all_domain = ".moovapp.com";
} else {
  if (mw.catch_all_domain[0] != ".") {
  	console.log("Bad catch all domain");
  }
}


function detect_catch_all(url) {
	var found_index = url.host.indexOf(mw.catch_all_domain);
	var length = url.host.length;

	if (found_index != -1 && (found_index + mw.catch_all_domain.length) == length) {
		return true;
	}
	return false;
}

function strip_catch_all(url) {
	var found_index = url.host.indexOf(mw.catch_all_domain);
	var length = url.host.length;

	url.host = url.host.slice(0, found_index);
	return url;
}

function add_catch_all(url) {
	url.host = url.host + mw.catch_all_domain;
	return url;	
}

function getParsedURL(url) {
	var elem = document.createElement("a")
	elem.href = url;
	return elem;
}

function getSchemeAndHostname(url) {
	var result = {};
	result.scheme = url.protocol;
	result.host = url.host;
	return result;
}

function getKey(url) {
	var components = getSchemeAndHostname(url);
	return components.scheme + "//" + components.host;
}

function fetch(url, map) {
	var key = getKey(url);
	var result = map[key];
	
	if (result === undefined) {
		if (typeof(mw) != 'undefined' && mw.debug == true) {
			console.log("Warning. No rule to modify host (" + key + ").")
		}
		return url.href;
	}
	
	return result + url.pathname + url.search + url.hash;
}

function detect(rawURL) {
  var properties = {
    "secure": false,
    "schema_relative": false,
    "relative": false
  };  
  properties.raw = rawURL;
  
  if (rawURL.indexOf("https://") != -1) {
    properties.secure = true;
  } else if(rawURL.indexOf("http://") == -1) {
    if (rawURL.indexOf("//") == 0) {
      properties.schema_relative = true;
    } else {
      properties.relative = true;
    }
  }
  
  return properties;
}

function denormalize(url, properties) {
  url = getParsedURL(url);
  if (properties.relative) {    
    return url.pathname + url.search + url.hash;
  } else {
    if (properties.secure) {
      return url.href.replace("http://","https://");
    } 
    if (properties.schema_relative) {
      return url.href.replace(/^https*:/, "");
    }
    
  }
  return url.href;
}

mw.proxyURLToOrigin = function(rawURL){	

	var properties = detect(rawURL);

	// Make sure it includes the host, or it will still be proxied!
	properties.relative = false;

	var url = getParsedURL(rawURL);
	var catch_all = detect_catch_all(url);

  if (catch_all) {    
	  url = strip_catch_all(url);
  }
	
	url = fetch(url, mapProxyToOrigin);
	url = denormalize(url, properties);

	return url;
}

mw.originURLToProxy = function(rawURL){

	var properties = detect(rawURL);
	var url = getParsedURL(rawURL);
	var catch_all = detect_catch_all(url);

  if (catch_all) {    
	  url = strip_catch_all(url);
  }

  url = getParsedURL(fetch(url, mapOriginToProxy));
  var globalLocation = getParsedURL(window.location.href);
  if (detect_catch_all(globalLocation)) {
      url = add_catch_all(url);
  }

	url = denormalize(url.href, properties);
	
	return url;
}

}());



/*
 * File: george/_custom_mw_ga_analytics_data_layer.js
 */
if (typeof mw==='undefined') {
  var mw = {};
}

mw.AnalyticsDataLayer = {
  // make high level objects in the analytics namespace
  // mw.AnalyticsDataLayer.track(this.keys.thescope)

  track: function (scope, name, data){
    this.keys.hasOwnProperty(scope) ? console.log("already tracking in george" + scope.toString()) : this.keys[scope] = {"event":[]};
    typeof name !== "undefined" ? this.keys[scope].name = name : this.keys[scope].name = scope;
    typeof data === "object" ? this.keys[scope].data = data: this.keys[scope].data = [];
    this.currScope = this.keys[scope];
    return this.keys[scope];
  },
  // add events to high-level objects
  addEvents: function (cat,sel,lbl,val,act) {
    var o = {};
    o.category = cat;
    o.selector = sel;
    // forseeable problem when label is undefined and action is not click
    if(typeof lbl !== "undefined") {
      o.label = lbl;
    }
    if(typeof val !== "undefined") {
      o.value = val;
    }
    typeof act == "undefined" ? o.action = "click" : o.action = act;
    Array.prototype.push.call(this.currScope.event, o);
  },
  // add data elements to high-level objects
  addData: function(val,name,ind) {
    var o = {};
    o.value = val;
    o.opt_scope = 3;
    typeof name == "string" ? o.name = name : o.name = "page_type";
    typeof ind == "number" ? o.index = ind : o.index = 1;
    Array.prototype.push.call(this.currScope.data, o);
  },
  // All the pages that we are configuring
  pageKeys: function() {
    //save a ref to the current analytics scope

    this.keys = this.keys || {};
    // start tracking
    this.track("header");
    // wire up events
    this.addEvents("Menu Tab - Header",".mw_menu_button");
    this.addEvents("Cart - Header", "#mainNavWrapper", "icon");
    this.addEvents("Search - Header", "#q", "bar");
    this.addEvents("Category Accordion L1 - DD", ".main_tab.shop li.tabLevel", jQuery(".main_tab.shop li.tabLevel"));
    // change scope - events and data will now be attached to this object
    this.track("footer");

    this.addEvents("Store Locator - Footer", ".mw_footer_links a[rel='external']");  
    this.addEvents("Email Sign-up - Footer", "#sign_up");
    this.addEvents("Social Media", ".addthis_button_facebook_follow", "Facebook");
    this.addEvents("Social Media", ".addthis_button_twitter_follow ", "Twitter");
    this.addEvents("Social Media", ".addthis_button_youtube_follow ", "Youtube");

    this.track("Home")
    this.addData("Home");

    this.addEvents( "Promo Image", ".MainHero")
    this.addEvents( "Category Image Tiles L1 - Body", ".MiddleRow a");
    this.addEvents( "Category Accordion 2C L1 - Body", ".mw_home_links_wrapper a", jQuery(".mw_home_links_wrapper a") );

    // Category page -> http://mlocal.direct.asda.com/george/womens-clothing/D1,default,sc.html
    this.track("Category General");
    this.addData("Category General");

    this.addEvents( "Category Accordion L1 - DD", ".leftNavCat .mw_bar1", jQuery(".leftNavCat .mw_bar1") ); 
    this.addEvents( "Category Accordion L2 - DD", ".leftNavCat a.mw_bar2", jQuery(".leftNavCat a.mw_bar2") );

    // subcategory page -> http://mlocal.direct.asda.com/george/womens/knitwear/D1M1G20C5,default,sc.html
    this.track("Category Results");
    this.addData("Category Results");

    this.addEvents( "Breadcrumbs", ".mw_breadcrumb_show a", jQuery(".mw_breadcrumb_show a"));
    this.addEvents( "View Type", ".mw_icon_grid", "Grid View");
    this.addEvents( "View Type", ".mw_icon_list", "List View");
    this.addEvents( "Sort", "#sortByDD", undefined, undefined, "change");
    this.addEvents( "Filter", "#searchrefinements .refineLink", jQuery("#searchrefinements .refineLink"));
    this.addEvents( "Pagination",".previous","Bottom - Left");
    this.addEvents( "Pagination","li.next","Bottom - Right");
    this.addEvents( "Pagination","li.displayblock a[class*='page-']","Numeric");

    this.track("Search Results");
    this.addData("Search Results");

    this.addEvents( "Breadcrumbs", ".mw_breadcrumb_show a", jQuery(".mw_breadcrumb_show a"));
    this.addEvents( "View Type", ".mw_icon_grid", "Grid View");
    this.addEvents( "View Type", ".mw_icon_list", "List View");
    this.addEvents( "Sort", "#sortByDD", undefined, undefined, "change");
    this.addEvents( "Filter", "#searchrefinements .refineLink", jQuery("#searchrefinements .refineLink"));
    this.addEvents( "Pagination",".previous","Bottom - Left");
    this.addEvents( "Pagination","li.next","Bottom - Right");
    this.addEvents( "Pagination","li.displayblock a[class*='page-']","Numeric");

    // product page -> http://mlocal.direct.asda.com/george/mens/socks/4-pack-the-muppets-christmas-socks/G004399452,default,pd.html
    this.track("Product");
    this.addData("Product");
    this.addData(jQuery("#productName").text(),"product_name", 3);


    this.addEvents( "Product Image Zoom", ".mw_image_zoom_button", jQuery("#productName").text(),jQuery("#productPrice .pounds").text());
    this.addEvents( "Product Support",".sizeGuideURL", "Size Guide", jQuery("#productPrice .pounds").text() );
    this.addEvents( "Add to Cart", ".mw_addToBasket", jQuery("#productName").text() , jQuery("#productPrice .pounds").text());
    this.addEvents( "Social Media",".addthis_toolbox a", jQuery(".addthis_toolbox a").attr('title') , jQuery("#productPrice .pounds").text());
    this.addEvents( "Product Info Accordion", ".tabsContainer .tabHead a", jQuery(".tabsContainer .tabHead a"), jQuery("#productPrice .pounds").text());
    this.addEvents( "Product Info Accordion", "#recentlyViewedSection", "Recently Viewed", jQuery("#productPrice .pounds").text());
    this.addEvents( "Product Image Change", ".mw_productLinkImage",jQuery("#productName").text(),jQuery("#productPrice .pounds").text(), "touchstart")
    this.addEvents( "Save for Later", "#saveForLaterBtn",jQuery("#productName").text(),jQuery("#productPrice .pounds").text())
    

    // mini-cart -> http://mlocal.direct.asda.com/on/demandware.store/Sites-ASDA-Site/default/Cart-MiniAddProducts
    this.track("/post-add-to-cart");
    this.addData("post-add-to-cart");

    this.addEvents("Continue Shopping - Top", "#basketTop .mw_btn2", jQuery("#productName").text() , jQuery("#productPrice .pounds").text());
    this.addEvents("Continue Shopping - Bottom", "#basketBottom .mw_btn2", jQuery("#productName").text() , jQuery("#productPrice .pounds").text());
    this.addEvents("View Saved Items", ".sflMinicart a");
    this.addEvents("Checkout - Top", "#basketTop .mw_btn1");
    this.addEvents("Checkout - Bottom", "#basketBottom .mw_btn1");

    // Cart -> http://mlocal.direct.asda.com/on/demandware.store/Sites-ASDA-Site/default/Cart-Show
    this.track("Cart");
    this.addData("Cart");

    // hey, you can use variables too for insane selectors!
    var cartItemPrice = jQuery(jQuery("div[id*='itemDisplay_']").attr("id") + " .unitPrice").text();
    var cartItemName = jQuery(jQuery("div[id*='itemDisplay_']").attr("id") + " .mw_product_fields ul h3 a").text();
    var cartTotalValue = jQuery("dd.granTotal").text();

    this.addEvents("Continue Shopping - Top", ".basketSectionCont > a.backBtn", undefined, cartTotalValue);
    this.addEvents("Checkout - Top", ".upRight .secureCheckoutButton" ,"UK", cartTotalValue);
    this.addEvents("Quantity Update", "#qty_select_2_0", cartItemName, cartItemPrice, "change");
    this.addEvents("Save for Later", ".saveForLaterLink", cartItemName, cartItemPrice);
    this.addEvents("Remove from Cart", " .mw_remove_item", cartItemName, cartItemPrice);
    this.addEvents("Empty Cart", ".emptyBasket", undefined, cartTotalValue);
    this.addEvents("Apply Savings Code",".validateCouponsButton", "Promo", cartTotalValue);
    this.addEvents("Continue Shopping - Bottom", ".downRight a.backBtn", undefined, cartTotalValue);
    this.addEvents("Checkout - Bottom", ".downRight .secureCheckoutButton" ,"UK", cartTotalValue);
    this.addEvents("Checkout - Bottom","#mw_mw_dwfrm_cart_checkoutINTLCart","International", cartTotalValue);
    
    // this.keys = {
    //   "header": {
    //     "event": [
    //       {
    //         "category": "Menu Tab - Header",
    //         "action": "click",
    //         "selector": ".mw_header_btn"
    //       },
    //       {
    //         "category": "Search - Header",
    //         "label": "Bar",
    //         "action": "click",
    //         "selector": "body > .mw_search_bar > .box"
    //       },
    //       {
    //         "category": "Search - SO Menu",
    //         "label": "Bar",
    //         "action": "click",
    //         "selector": ".mw_menu_nav > .mw_search_bar > .box"
    //       },
    //       {
    //         "category": "Category Accordion L1 - SO Menu",
    //         "action": "click",
    //         "label": jQuery('.mw_menu_nav > #mainnav li.mega a, .mw_menu_nav > #headernav li.unit a.tab, .mw_menu_nav > #options > ul div:not(\'.last\') > a'),
    //         "selector": ".mw_menu_nav > #mainnav li.mega a, .mw_menu_nav > #headernav li.unit a.tab, .mw_menu_nav > #options > ul div:not('.last') > a"
    //       },
    //       {
    //         "category": "Category Accordion L2 - SO Menu",
    //         "action": "click",
    //         "label": jQuery('.mw_menu_nav > #mainnav li.mega .innersub a, .mw_menu_nav > #headernav li.unit .sub a'),
    //         "selector": ".mw_menu_nav > #mainnav li.mega .innersub a, .mw_menu_nav > #headernav li.unit .sub a"
    //       },
    //       {
    //         "category": "Store Locator - SO Menu",
    //         "action": "click",
    //         "selector": ".mw_menu_nav > #options .last"
    //       }
    //     ]
    //   },
    //   "footer": {
    //     "event": [
    //       {
    //         "category": "Email Sign-up",
    //         "action": "click",
    //         "selector": "#email"
    //       },
    //       {
    //         "category": "Customer Service - Footer",
    //         "action": "click",
    //         "selector": ".mw_cs_accordion"
    //       },
    //       {
    //         "category": "Tap to Call - Footer",
    //         "label": "Number",
    //         "action": "click",
    //         "selector": ".mw_tel_num"
    //       },
    //       {
    //         "category": "Social Media",
    //         "action": "click",
    //         "label": "Facebook",
    //         "selector": "#social a.icons-facebook"
    //       },
    //       {
    //         "category": "Social Media",
    //         "action": "click",
    //         "label": "YouTube",
    //         "selector": "#social a.icons-youtube"
    //       },
    //       {
    //         "category": "Social Media",
    //         "action": "click",
    //         "label": "Twitter",
    //         "selector": "#social a.icons-twitter"
    //       }
    //     ]
    //   },
    //   "home": {
    //     "name": "home",
    //     "data": [
    //       {
    //         "index": 1,
    //         "name": "page_type",
    //         "value": "Home",
    //         "opt_scope": 3
    //       }
    //     ],
    //     "event": [
    //       {
    //         "category": "Promo Hero Image",
    //         "action": "click",
    //         "selector": '#mw_banner_img_mobile'
    //       },
    //       {
    //         "category": "Category Accordion L1 - Body",
    //         "action": "click",
    //         "label": jQuery('#wrapper #mw_topnav li.mega a, #wrapper #mw_menutabs li.unit a.tab, #wrapper #options > ul div:not(\'.last\') > a'),
    //         "selector": "#wrapper #mw_topnav li.mega a, #wrapper #mw_menutabs li.unit a.tab, #wrapper #options > ul div:not('.last') > a"
    //       },
    //       {
    //         "category": "Category Accordion L2 - Body",
    //         "action": "click",
    //         "label": jQuery('#wrapper #mw_topnav li.mega .innersub a, #wrapper #headernav li.unit .sub a'),
    //         "selector": "#wrapper #mw_topnav li.mega .innersub a, #wrapper #headernav li.unit .sub a"
    //       },
    //       {
    //         "category": "Store Locator - Body",
    //         "action": "click",
    //         "selector": ".mw_home_nav > #options div.last"
    //       }
    //     ]
    //   },
    //   "category": {
    //     "name": "category",
    //     "data": [
    //       {
    //         "index": 1,
    //         "name": "page_type",
    //         "value": "Category General",
    //         "opt_scope": 3
    //       },
    //       {
    //         "index": 2,
    //         "name": "product_category",
    //         "value": jQuery('#main > h1').text(),
    //         "opt_scope": 3
    //       }
    //     ],
    //     "event": [
    //       {
    //         "category": "Search Bar - Body",
    //         "action": "focus",
    //         "label": "category",
    //         "selector": "#searchQuestionDisplayed"
    //       },
    //       {
    //         "category": "Category Accordion L1 - Body",
    //         "action": "click",
    //         "label": jQuery("#main .mw_bar4[data-ur-toggler-component='button']"),
    //         "selector": "#main .mw_bar4[data-ur-toggler-component='button']",
    //       }
    //     ]
    //   },
    //   "subcategory": {
    //     "name": "subcategory",
    //     "data": [
    //       {
    //         "index": 1,
    //         "name": "page_type",
    //         "value": "Category Results",
    //         "opt_scope": 3
    //       },
    //       {
    //         "index": 2,
    //         "name": "product_category",
    //         "value": jQuery('#main > #sidebar > h1').text(),
    //         "opt_scope": 3
    //       }
    //     ],
    //     "event": [
    //       {
    //         "category": "View Type",
    //         "action": "click",
    //         "label": "List",
    //         "selector": ".viewby .mw_list_view_icn"
    //       },
    //       {
    //         "category": "View Type",
    //         "action": "click",
    //         "label": "Grid",
    //         "selector": ".viewby .mw_grid_view_icn"
    //       },
    //       {
    //         "category": "Sort",
    //         "action": "change",
    //         "label": jQuery('.mw_sortbar #sortSelect option:selected'),
    //         "selector": ".mw_sortbar #sortSelect"
    //       },
    //       {
    //         "category": "Filter",
    //         "action": "click",
    //         "label": jQuery('.mw_filter #filters dd'),
    //         "selector": ".mw_filter #filters dd"
    //       }
    //     ]
    //   },
    //   "product": {
    //     "name": "Product",
    //     "data": [
    //       {
    //         "index": 1,
    //         "name": "page_type",
    //         "value": "Product",
    //         "opt_scope": 3
    //       },
    //       {
    //         "index": 3,
    //         "name": "product_name",
    //         "value": jQuery('.mw_product_title > h1.name').text(),
    //         "opt_scope": 3
    //       }
    //     ],
    //     "event": [
    //       {
    //         "category": "Product Image Change",
    //         "action": "touchstart",
    //         "label": jQuery('#product .mw_product_title .name'),
    //         "value": jQuery("meta[property='eb:pricerange']").attr("content"),
    //         "selector": ".mw_product_carousel .mw_scroll_container"
    //       },
    //       {
    //         "category": "Product Image Zoom",
    //         "action": "click",
    //         "label": jQuery('#product .mw_product_title .name'),
    //         "value": jQuery("meta[property='eb:pricerange']").attr("content"),
    //         "selector": "#mw_zoom_btn"
    //       },
    //       {
    //         "category": "Add to Cart",
    //         "action": "click",
    //         "label": jQuery('#product .mw_product_title .name'),
    //         "value": jQuery("meta[property='eb:pricerange']").attr("content"),
    //         "selector": ".mw_atc"
    //       },
    //       {
    //         "category": "Save for Later",
    //         "action": "click",
    //         "label": "Add to Registry",
    //         "value": jQuery("meta[property='eb:pricerange']").attr("content"),
    //         "selector": ".mw_bottom_buttons > .registry"
    //       },
    //       {
    //         "category": "Save for Later",
    //         "action": "click",
    //         "label": "Add to Wish List",
    //         "value": jQuery("meta[property='eb:pricerange']").attr("content"),
    //         "selector": ".mw_bottom_buttons > .wishlist"
    //       },
    //       {
    //         "category": "Play Video",
    //         "action": "click",
    //         "label": "product",
    //         "selector": ".videotrigger"
    //       },
    //       {
    //         "category": "Product Info Accordion",
    //         "action": "click",
    //         "label": jQuery(".tabs.specialTab1 > div *[data-ur-toggler-component='button'], #productaccessories *[data-ur-toggler-component='button'], #youmayalsolike *[data-ur-toggler-component='button'], .mw_review_accordion *[data-ur-toggler-component='button'], .mw_qa_accordion *[data-ur-toggler-component='button']"),
    //         "value": jQuery("meta[property='eb:pricerange']").attr("content"),
    //         "selector": ".tabs.specialTab1 > div, #productaccessories, #youmayalsolike, .mw_review_accordion, .mw_qa_accordion"
    //       },
    //       {
    //         "category": "Product Info Accordion",
    //         "action": "click",
    //         "label": "Also viewed",
    //         "value": jQuery("meta[property='eb:pricerange']").attr("content"),
    //         "selector": "#youmayalsolike"
    //       }
    //     ]
    //   },
    //   "/post-add-to-cart/" : {
    //     "name": "revieworder",
    //     "data": [
    //       {
    //         "index": 1,
    //         "name": "page_type",
    //         "value": "Post Add to Cart",
    //         "opt_scope": 3
    //       }
    //     ],
    //     "event": [
    //       {
    //         "category": "View Cart",
    //         "action": "click",
    //         "label": jQuery('#product .mw_product_title .name'),
    //         "value": jQuery("meta[property='eb:pricerange']").attr("content"),
    //         "selector": ".checkout > li:first-of-type"
    //       },
    //       {
    //         "category": "Checkout - Bottom",
    //         "action": "click",
    //         "label": "Internal",
    //         "value": jQuery("meta[property='eb:pricerange']").attr("content"),
    //         "selector": ".checkout .button"
    //       },
    //       {
    //         "category": "Checkout - Bottom",
    //         "action": "click",
    //         "label": "Paypal",
    //         "value": jQuery("meta[property='eb:pricerange']").attr("content"),
    //         "selector": ".checkout .paypal"
    //       },
    //       {
    //         "category": "Close Window",
    //         "action": "click",
    //         "label": jQuery('#product .mw_product_title .name'),
    //         "value": jQuery("meta[property='eb:pricerange']").attr("content"),
    //         "selector": ".popupclose"
    //       }
    //     ]
    //   },
    //   "cart" : {
    //     "name": "cart",
    //     "data": [
    //       {
    //         "index": 1,
    //         "name": "page_type",
    //         "value": "Cart",
    //         "opt_scope": 3
    //       }
    //     ],
    //     "event": [
    //       {
    //         "category": "Continue Shopping - Top",
    //         "action": "click",
    //         "value": jQuery(".mw_estimated_total dd.estimatedTotal"),
    //         "selector": "div.checkout:first .continueShopping a"
    //       },
    //       {
    //         "category": "Checkout - Top",
    //         "action": "click",
    //         "label": "Paypal",
    //         "value": jQuery(".mw_estimated_total dd.estimatedTotal"),
    //         "selector": "div.checkout:first a.paypal"
    //       },
    //       {
    //         "category": "Checkout - Top",
    //         "action": "click",
    //         "label": "Internal",
    //         "value": jQuery(".mw_estimated_total dd.estimatedTotal"),
    //         "selector": "div.checkout:first .a.button"
    //       },
    //       {
    //         "category": "Continue Shopping - Bottom",
    //         "action": "click",
    //         "value": jQuery(".mw_estimated_total dd.estimatedTotal"),
    //         "selector": "div.checkout:last .continueShopping a"
    //       },
    //       {
    //         "category": "Checkout - Bottom",
    //         "action": "click",
    //         "label": "Paypal",
    //         "value": jQuery(".mw_estimated_total dd.estimatedTotal"),
    //         "selector": "div.checkout:last a.paypal"
    //       },
    //       {
    //         "category": "Checkout - Bottom",
    //         "action": "click",
    //         "label": "Internal",
    //         "value": jQuery(".mw_estimated_total dd.estimatedTotal"),
    //         "selector": "div.checkout:last .a.button"
    //       },
    //       {
    //         "category": "Quantity Update",
    //         "action": "click",
    //         "label": jQuery(".mw_cart_top .mw_cart_item_info .name"),
    //         "value": jQuery(".mw_cart_top .mw_cart_item_price .mw_price"),
    //         "selector": ".mw_qty a"
    //       },
    //       {
    //         "category": "Remove from Cart",
    //         "action": "click",
    //         "label": jQuery(".mw_cart_top .mw_cart_item_info .name"),
    //         "value": jQuery(".mw_cart_top .mw_cart_item_price .mw_price"),
    //         "selector": ".mw_cart_item_image > a"
    //       },
    //       {
    //         "category": "Save for Later",
    //         "action": "click",
    //         "label": "Add to Registry",
    //         "value": jQuery(".mw_cart_top .mw_cart_item_price .mw_price"),
    //         "selector": ".mw_cart_bottom > div:first-of-type"
    //       },
    //       {
    //         "category": "Save for Later",
    //         "action": "click",
    //         "label": "Add to Wish List",
    //         "value": jQuery(".mw_cart_top .mw_cart_item_price .mw_price"),
    //         "selector": ".mw_cart_bottom > div:last-of-type"
    //       },
    //       {
    //         "category": "Shipping & Taxes",
    //         "action": "click",
    //         "label": "Estimate",
    //         "selector": "#shipping_DIV"
    //       },
    //       {
    //         "category": "Apply Savings Code",
    //         "action": "click",
    //         "label": "Promo",
    //         "selector": "#promotion_DIV"
    //       }
    //     ]
    //   },
    //   "login" : {
    //     "name": "login",
    //     "data": [
    //       {
    //         "index": 1,
    //         "name": "page_type",
    //         "value": "Checkout Start",
    //         "opt_scope": 3
    //       }
    //     ],
    //     "event": [
    //       {
    //         "category": "Checkout Type",
    //         "action": "click",
    //         "label": "Login",
    //         "selector": "#loginBtnId"
    //       },
    //       {
    //         "category": "Checkout Type",
    //         "action": "click",
    //         "label": "Guest",
    //         "selector": ".registerbutton"
    //       }
    //     ]
    //   },
    //   "checkout" : {
    //     "name": "checkout",
    //     "data": [
    //       {
    //         "index": 1,
    //         "name": "page_type",
    //         "value": "Checkout Shipping General",
    //         "opt_scope": 3
    //       }
    //     ],
    //     "event": [
    //       {
    //         "category": "Restart Checkout",
    //         "action": "click",
    //         "selector": "#restartCheckout"
    //       },
    //       {
    //         "category": "Create Account",
    //         "action": "click",
    //         "label": "cart",
    //         "selector": "input[name=createaccount]"
    //       },
    //       {
    //         "category": "Preview Order",
    //         "action": "click",
    //         "label": "cart",
    //         "selector": "#paymentSubmit"
    //       },
    //       {
    //         "category": "View Payment Details",
    //         "action": "click",
    //         "label": "cart",
    //         "selector": "#step2info .inlbut.showDetails"
    //       }
    //     ]
    //   },
    //   "confirmation" : {
    //     "name": "confirmation",
    //     "data": [
    //       {
    //         "index": 1,
    //         "name": "page_type",
    //         "value": "Checkout Confirmation Page",
    //         "opt_scope": 3
    //       }
    //     ]
    //   },
    //   "/checkout/shipping-general": {
    //     "name": "shipping",
    //     "data": [
    //       {
    //         "index": 1,
    //         "name": "page_type",
    //         "value": "Checkout Shipping General",
    //         "opt_scope": 3
    //       }
    //     ]
    //   },
    //   "/checkout/payment": {
    //     "name": "payment",
    //     "data": [
    //       {
    //         "index": 1,
    //         "name": "page_type",
    //         "value": "Checkout Payment",
    //         "opt_scope": 3
    //       }
    //     ],
    //     "event": [
    //       {
    //         "category": "Apply Savings Code",
    //         "action": "click",
    //         "label": "Gift",
    //         "selector": "#step2form #giftCardsModule .paymentFormGiftCards a"
    //       },
    //       {
    //         "category": "Apply Savings Code",
    //         "action": "click",
    //         "label": "Promo",
    //         "selector": "#step2form #promoCodesModule .paymentFormPromoCodes a"
    //       }
    //     ]
    //   },
    //   "paymentInfo": {
    //     "name": "paymentInfo",
    //     "event": [
    //     {
    //         "category": "Edit Checkout Details",
    //         "action": "click",
    //         "label": "Payment",
    //         "selector": ".stepInfo a#editStep2"
    //       },
    //       {
    //         "category": "View Details",
    //         "action": "click",
    //         "label": "Payment",
    //         "selector": "#step2info .initShowOff a"
    //       }
    //     ]
    //   }
    // };
    return this.keys;
  }
}



/*
 * File: george/_custom_mw_ga_analytics_page_tagging.js
 */
if (typeof mw==='undefined') {
  var mw = {};
}

// Test for jQuery < 1.7
if (typeof jQuery != 'undefined' && /[1-9]\.[0-6].[0-9]/.test($.fn.jquery)) {
  mw.jQueryLegacy = true;
}

mw.Analytics = {
  // Configure the page on ready
  setup: function() {
    this.configurePage();
  },
  // Function to help clean out custom variables as needed
  sanitizeCustomVar: function( customVar ) {
    // Remove whitespaces from the beginning and end of the custom variable
    var thisVar = customVar.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    return thisVar;
  },
  // Function to help clean out labels as needed
  sanitizeLabel: function( label ) {
    // Remove quotes to avoid causing a break in the JS and remove whitespaces from front and back
    return label.replace(/\'|\"/,"").replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  },
  // Function to help clean out values as needed
  sanitizeValue: function( value ) {
    // Remove text preceding the price
    var thisValue = value.replace(/(\s+)?\w+\:?\s+\£/, '');
    // Remove dollar signs
    var nodollar = thisValue.replace(/\£/,'');
    // Get an rounded value of the price to make an integer
    var parsedValue = Math.round(parseInt(nodollar, 10));
    var cleanValue = isNaN(parsedValue) ? 0 : parsedValue;
    return cleanValue;
  },
  currentPage: function() {
    var page = jQuery("[data-mw-ga-name]").attr("data-mw-ga-name");
    return page;
  },
  ajaxPage: function() {
    var page = jQuery("[data-mw-ga-ajax-name]").attr("data-mw-ga-ajax-name");
    return page;
  },
  virtualPage: function(arg) {
    var virtualPage = "";
    if(typeof(arg)!=="undefined"){
      virtualPage = jQuery("[data-mw-ga-virtual-pv='"+arg+"']").attr("data-mw-ga-virtual-pv");
    } else {
      virtualPage = jQuery("[data-mw-ga-virtual-pv]").attr("data-mw-ga-virtual-pv");
    }
    return virtualPage;
  },
  virtualAjaxPage: function(arg) {
    var virtualAjaxPage = "";
    if(typeof(arg)!=="undefined"){
      virtualAjaxPage = jQuery("[data-mw-ga-virtual-ajax-pv='"+arg+"']").attr("data-mw-ga-virtual-ajax-pv");
    } else {
      virtualAjaxPage = jQuery("[data-mw-ga-virtual-ajax-pv]").attr("data-mw-ga-virtual-ajax-pv");
    }
    return virtualAjaxPage;
  },
  configurePage: function(arg) {

    // Configure individual page
    var keys = mw.AnalyticsDataLayer.pageKeys();
    var page = this.currentPage();
    var virtualPage = this.virtualPage(arg);

    // Header
    var header = keys.header;
    mw.Analytics.attachEvents(header);

    // Footer
    var footer = keys.footer;
    mw.Analytics.attachEvents(footer);

    // Page view
    if (virtualPage !== undefined) {
      mw.Analytics.attach(virtualPage, keys);
      splitCmd(['_trackPageview', virtualPage]);
    } else {
      mw.Analytics.attach(page, keys);
      splitCmd(['_trackPageview']);
    }
  },
  configureAjaxPage: function(arg) {
    // Configure individual page
    var keys = mw.AnalyticsDataLayer.pageKeys();
    var page = this.ajaxPage();

    if(page === undefined) {
      var page = this.virtualAjaxPage(arg);
    }

    mw.Analytics.attach(page, keys);

    // Page view
    if (page !== undefined) {
      splitCmd(['_trackPageview', page]);
    }
  },
  attachEvents: function(thisPage) {
    // Attaches events
    if (thisPage.event !== undefined) {
      jQuery.each(thisPage.event, function(index, item) {
        jQuery(item.selector).each(function(index, selectedItem) {
          if(mw.jQueryLegacy) {
            jQuery(selectedItem).bind(item.action, function() {
              mw.Analytics.trackEvent(item, index, selectedItem);
            });
          } else {
            jQuery(selectedItem).on(item.action, function() {
              mw.Analytics.trackEvent(item, index, selectedItem);
            });
          }
        });
      });
    }
  },
  trackEvent: function(item, index, selectedItem) {
    var thisLabel = item.label;
    var thisValue = item.value;
    var option = "";
    //Check to see if label/value are set in the data layer for the event
    if (typeof(item.value)!== "undefined" && typeof(item.label)!=="undefined" )
      option="both";
    if (typeof(item.value)==="undefined" && typeof(item.label)!=="undefined")
      option = "label";
    if (typeof(item.value)!=="undefined" && typeof(item.label)==="undefined")
      option = "value";
    //Track the appropriate event based on if label/value were set in the data layer
    switch (option) {
      case "both":
        thisLabel = mw.Analytics.sanitizeLabel(mw.Analytics.retrieveFromDOM(item.label, index, selectedItem));
        thisValue = mw.Analytics.sanitizeValue(mw.Analytics.retrieveFromDOM(item.value, index, selectedItem));
        splitCmd (['_trackEvent', item.category, item.action, thisLabel, thisValue]);
        break;
      case "label":
        thisLabel = mw.Analytics.sanitizeLabel(mw.Analytics.retrieveFromDOM(item.label, index, selectedItem));
        splitCmd (['_trackEvent', item.category, item.action, thisLabel]);
        break;
      case "value":
        thisValue = mw.Analytics.sanitizeValue(mw.Analytics.retrieveFromDOM(item.value, index, selectedItem));
        splitCmd (['_trackEvent', item.category, item.action, , thisValue]);
        break;
      default:
        splitCmd (['_trackEvent', item.category, item.action]);
        break;
    }
  },
  //Used to retrieve the appropriate value for the event label/value
  retrieveFromDOM: function(selector, index, selectedItem) {
    var value = "";
    //Check if label/value is jQuery object, if yes execute on whole DOM (backwards compatibility)
    if(typeof(selector)!=="undefined" && selector  instanceof jQuery) {
      value = jQuery(selector[index]).text();
    } else {
      //Check if label/value is a string object, if yes execute on selected item DOM (targeting nested element)
      if(typeof(selector)!=="undefined" && typeof(value)==="string") {
        value = jQuery(selector, selectedItem).text();
        //Check if the result of the above is a empty string object, if yes set the item value as a label
        if(typeof(value)==="string" && value=== "") {
          value = selector;
        }
      }
    }
    return value;
  },
  attach: function(page,keys) {
    // Attaches pageview customizaitons and events

    // Make sure custom variables are on the page
    if (page!==undefined) {

      // Unique Pageview Customizations
      var thisPage = keys[page];
      // Variables
      if (thisPage.data !== undefined) {
        jQuery.each(thisPage.data, function(index, item) {
          var thisSanitizedValue = mw.Analytics.sanitizeCustomVar(item.value);
          var customVar = ['_setCustomVar', item.index, item.name, thisSanitizedValue, item.opt_scope];
          splitCmd(customVar)
        });
      }
      // Events
      mw.Analytics.attachEvents(thisPage);
    }
  }
};

// Initialize
//jQuery(document).ready(function() {
//  mw.Analytics.setup();
//});

x$(window).load(function(){
  mw.Analytics.setup();
  console.log("WINDOW LOADED OKAY")
});



/*
 * File: george/add_to_cartG.js
 */
//Start of ADG-647
var is_additem = false;
x$(document).on("DOMContentLoaded", function() {
  // Fix for ADG-746:Item count
  x$(".mw_george .mw_headerG").each(function() {
    x$(".mw_george").on('DOMNodeInserted', function() {
       if(x$(".amount").html()[0] !== "0") {
        x$(".mw_cart_size").html(x$(".amount").html()[0]);
        x$(".mw_basket_buttonG.mw_empty_cart").removeClass("mw_empty_cart");
       }
      });
    x$(".mw_basket_buttonG").on("click", function() {
      // Change text of header basket button
      x$(".mw_cart_size").html(x$(".amount").html()[0]);
      if(x$(".mw_basket_buttonG.mw_empty_cart") && x$(".mw_cart_size").html()[0] !== "0") {
        x$(".mw_basket_buttonG.mw_empty_cart").toggleClass("mw_empty_cart")
      }
    });
  });
  x$(".mw_george .mw_headerG.mw_test_a").each(function() {
    x$(".mw_basket_buttonG").on("click", function() {
      // Change text of header basket button
      x$(".mw_header_basketG").html(x$(".minicartTotal").html()[0]);
    });
  });

});

jQuery(window).on("load", function() {
  // delay the opening of mini cart to allow item added to show longer
  jQuery(".addToBasket").on("click", function() {
    is_additem = true;
  });
});

setAjaxCallbacks(/Cart-MiniCartSummary.*/, function() {
  // delay the opening of mini cart to allow item added to show longer
  if(is_additem == true) {
    setTimeout(function() { window.scrollTo(0,1);x$(".mw_basket_buttonG").click(); }, 500);
    is_additem = false;
  }
  else
  {
    is_additem = false;
  }
});
// End of ADG-647 



/*
 * File: george/cart.js
 */
// This is to get rid of js error that causes the promotion code error not to appear
x$(document).on("DOMContentLoaded", function() {
  x$(".mw_cart").each(function(){
    jspMiniCartScroll = function() { }

    x$("#couponCodes > .mw_bar1").on("click", function() {
      if(x$('#couponCodes').has(".mw_selected").length > 0) {
        x$('#couponCodes').removeClass("mw_selected");
      } else {
        x$('#couponCodes').addClass("mw_selected");
      }
    });
     if(!(x$('#couponCodes').has(".mw_selected").length > 0) && (x$('.couponCodesInfoError').length > 0 || x$('.couponCodesList').length > 0)) {
       x$('#couponCodes').addClass("mw_selected");
    }
    // Fix for ADG-702
      x$('#minicart')[0].removeAttribute("style");
    // Fix for ADG-702
  });
  //Fix for ADG-1060
  $( "body.mw_cart" ).delegate( ".secureCheckoutButton", "click", function() {
    setTimeout($(".modalBoxHeader").text("Your order needs extra confirmation"),100);
  });
  //Fix for ADG-1060 ends
});


/*
 * File: george/category_banners.js
 */
//convert image maps for banners on category pages
x$(window).on("load", function() {
	x$(".mw_categoryG").each(function() {
		x$("img").each(function(img) { convertImageMap(img); });
	});
});


/*
 * File: george/category_rating.js
 */
// ticket ADG-223 not show the stars when no rating is present
x$(document).on("DOMContentLoaded", function() {
  x$(".mw_searchG").each(function() {
    var rating = x$("ul.rating");
    for(var i=0;i<rating.length;i++) {
      if(rating[i].childNodes[1].getAttribute("style") == "background-position:0.0px 0px;") {
        rating[i].setAttribute("style", "display: none;");
      }
    }
  });
});


/*
 * File: george/check_bodyheightG.js
 */
// START OF ADG-733
// commented for ADG-1077
// jQuery(window).on("load", function() {
//   setInterval(function() {
//   	bodyHeight = jQuery("body").height();
//     jQuery("#mw-side-slider-menu").css("height", bodyHeight + "px");
//   }, 100);
// });
// End of ADG-1077
// END OF ADG-733


/*
 * File: george/dress_code.js
 */
x$(document).on("DOMContentLoaded", function() {
  x$("body.mw_grg_dress_codeG").each(function() {
    x$(window).load(function() {
      x$("img").each(function(img) { convertImageMap(img); });
    });
  });
});


/*
 * File: george/headerG.js
 */
// START OF ADG-693
x$.ready(function() {
   var mask_height = jQuery("body")[0].scrollHeight;
  // Direct header
  //For ADG-742: Copyright Change - Footer - Mobile George & Direct
  var currentDate = new Date();
  jQuery(".mw_desktop_link span:last-child").html("&copy; George "+currentDate.getFullYear())
  //End of ADG-742
  
  //ADG-702:Header Changes
  jQuery(".mw_search_button").on("click", function() {
    jQuery(".mw_basket_mask").removeClass("mw_active");
    jQuery("#minicart").attr("data-ur-state", "disabled").removeClass("mw_active");
    jQuery(".mw_basket_buttonG").removeClass('mw_menu_item_active');
    jQuery(".headerCenter").toggleClass("mw_hide");
     if (jQuery(".mw_search_bar").hasClass('mw_hide')) {
      jQuery(this).removeClass('mw_menu_item_active');
    }
    else{
      jQuery(this).addClass('mw_menu_item_active');
    }
  });
  jQuery(".mw_basket_buttonG").on("click", function() {
    var bodyId = document.body.id;
    if(bodyId != "ptProductDetails" && bodyId != 'ptProductSearchResult') { // Fix for ADG-964
      var hostname = window.location.hostname;
      window.location = "http://" + hostname + "/on/demandware.store/Sites-ASDA-Site/default/Cart-Show";
    }
    else {
      jQuery(".headerCenter").addClass("mw_hide");
      jQuery(".mw_search_mask").removeClass("mw_active");
      jQuery(".mw_search_button").removeClass('mw_menu_item_active');
      // Fix for ADG-832: create mask on click of 'ADD' button
      jQuery(".mw_basket_mask").toggleClass("mw_active");
      jQuery('.mw_basket_mask').css("height", mask_height+"px");
      // End of ADG-832
      jQuery("#minicart").toggleClass("mw_active");
      if (jQuery("#minicart").hasClass('mw_active')) {
        jQuery(this).addClass('mw_menu_item_active');
      }
      else{
        jQuery(this).removeClass('mw_menu_item_active');
      }
    }
  });
  //ADG-702:End
  // Fix for ADG-1039
  $("body").on('touchmove', function() {
    $(".mw_headerG").css({"width":"100%","position":"fixed"});
    if($(window).scrollTop() <= 30) {
      $(".mw_headerG").removeAttr("style");
    }
  });
  // End Fix for ADG-1039

  setTimeout(function() {
    var bodyClass = jQuery("body").attr("class");
    if(bodyClass.indexOf("mw_cart") != -1) {
      jQuery(".mw_search_button").removeClass("mw_menu_item_active");
      jQuery(".mw_search_bar").addClass("mw_hide");
    }
    jQuery("#basketBottom").after(jQuery(".sflMinicart"));
  }, 2000);
});
// END OF ADG-693


/*
 * File: george/list_searchG.js
 */
// This function styles the products list to be consistent
x$(document).on("DOMContentLoaded", function() {
	x$("body.mw_george #productListing").each(function() {
    //ADG-533 - start
    if(x$("#productListing .listItem").length > 0) {
      x$("#productListing .mw_colorswach_item .productImg img").on("load", function() {
        x$("#productListing .closed li a").each(function() {
          this.removeAttribute("href");
        });
        compute_item_height();
      });
      x$("#productListing .mw_last_item .productImg img").on("load", function() {
        compute_item_height();
      });
      x$(window).on("resize", function() {
        compute_item_height();
      });
    }
    //ADG-533 - end


    //ADG-1031
    var pag_search = 1;
    var rpp = 20;
    $(".mw_load_more").on("click", function(e){
      e.preventDefault();
      var that = this;
      $(that).addClass("loading");
      $(that).text("Loading...")
      
      if($("#ptProductSearchResult").length > 0){
        // Fix for ADG-1054: Get the total of loaded items
        var startCounter = $(".productPaneLeft").length;
        var ajaxURL = "";
        // Fix for ADG-1054: Removed static url
        //var baseURL = document.URL.replace(/\.com.*/,".com")+"/george/clothing/10,default,sc.html";
        var baseURL = document.URL;
        //var baseSearchQuery = document.URL.replace(/^[^\?]*/,"").replace(/\&.*/,""); // commented for ADG-1086 as loadmore functionality was not working
        ajaxURL = baseURL + "&start=" + startCounter + "&sz=20";//  for ADG-1086
        $.get(ajaxURL, function(res){
          $(that).removeClass("loading");
          var html = jQuery(res);
          $(that).text("Load 20 more")
          var prods = (html.find(".productListing > li"));
          $("#productListing").append(prods);
          startCounter = startCounter + 20;
          // For ADG-1085: Loading product images after load more...
          $(".viewProductLink img").each(function(){
            $(this).attr("src", $(this).attr("data-original"));
          });
          // End of ADG-1085
          compute_item_height(); // for ADG-1086
          $("#productListing > li.mw_last_item").eq(-2);
          var off = $("#productListing > li.mw_last_item").eq(-2).offset();
          if(off)
            $("html,body").animate({scrollTop:off.top}, '1500');
        });
      }
      else {
        $.get("?start="+(pag_search*rpp)+"&sz=20", function(res){
          // $(".mw_load_more").before(res);
          $(that).removeClass("loading");
          var html = jQuery(res);
          $(that).text("Load 20 more")
          var prods = (html.find("#productListing > li"));
          $("#productListing").append(prods);
          pag_search = pag_search + 1;
          
            $("#productListing > li.mw_last_item").eq(-2)
          var off = $("#productListing > li.mw_last_item").eq(-2).offset();

          if(off)
            $("html,body").animate({scrollTop:off.top}, '1500');

        });
      }
      //Fix for ADG-1085: removed alert
      //alert("sdf")
      //End of ADG-1085
    });

    $(".mw_back_to_top").on("click", function(){
      $("html,body").animate({scrollTop:0}, '1500');
    });
    //ADG-1031 END

    //Fix for ADG-1067
    $("#sortByDD").on("change", function(e){
      e.preventDefault();
      if($("#ptProductSearchResult").length > 0){
        var startCounter = $(".productPaneLeft").length;
        var ajaxURL = $('#sortByDD option:selected').val();
        if(ajaxURL.indexOf("Sort By")==-1){
          if($(".popOverlay").children().length==0){
            $(".popOverlay").append('<div style="top:232px; left:231px;" class="loading productloader mw_product_loader"></div>')
          }
          $(".popOverlay").addClass("displayBlock").removeClass("displayNone");
          $.get(ajaxURL, function(res){
            var html = jQuery(res);
            var prods = (html.find(".productListing > li"));
            $("#productListing > li").remove();
            $("#productListing").append(prods);
            startCounter = startCounter + 20;
            $("#productListing > li.mw_last_item").eq(-2);
            var off = $("#productListing > li.mw_last_item").eq(-2).offset();
            if(off)
              $("html,body").animate({scrollTop:off.top}, '1500');
            $(".popOverlay").addClass("displayNone").removeClass("displayBlock");
              
          });
        }
      }
    });
    //Fix for ADG-1067 ends
    //  Fix for ADG-1071
    $("ul#productListing").on("DOMNodeInserted", function(e) {
      if(e.target.tagName == "LI") {
        var iTotalItemCount = parseInt($(".mw_item_count").text(), 10),
            iItemsLoaded = $("#productListing .productPaneLeft").length;
        $(".mw_items_viewed").text("Showing " + iItemsLoaded + " of " + iTotalItemCount + " Styles Found")
        if ( iItemsLoaded >= iTotalItemCount ){
          $(".mw_load_more").hide();
        }
      }
    })
    var iTotalItemCount = parseInt($(".mw_item_count").text(), 10),
        iItemsLoaded = $("#productListing .productPaneLeft").length;
    $(".mw_items_viewed").text("Showing " + iItemsLoaded + " of " + iTotalItemCount + " Styles Found");
    //  Fix for ADG-1071 ends
  });
  function compute_item_height() {
    x$("body.mw_george #productListing").each(function() {
      var items = x$(this).find(".productPaneLeft");
      items_length = items.length;
      // Fix for ADG-777
      // Fix for ADG-996
      compare_height("productImg", items, items_length, 2);
      compare_height("colourSwatchesContainer", items, items_length, 2);
      compare_height("productPrice", items, items_length, 2);
      compare_height("productName", items, items_length, 2);
      compare_height("rating", items, items_length, 2);
      // End of ADG-996
      // End of ADG-777
    });
  }
});
// ADG-978: Moved to global
function compare_height(item_class, items_list, items_length, list_lenght) {
  if(x$(items_list).find("."+item_class).length>0) {
    var name_height = 0;
    items_list.find("."+item_class+"").attr("style", "");
    if(list_lenght > 0) {
      for(var i=0; i<items_length; i+=list_lenght) {
        name_height = x$(items_list[i]).find("."+item_class+"")[0].offsetHeight;
        for(var j=1; j<list_lenght && i+j<items_length; j++) {
          var temp_name_height = x$(items_list[i+j]).find("."+item_class+"")[0].offsetHeight;
          // Getting max name height
          name_height = temp_name_height>name_height ? temp_name_height : name_height;
        }
        for(var j=0; j<list_lenght && i+j<items_length; j++) {
          // Setting the max value for both items
          x$(items_list[i+j]).find("."+item_class+"").setStyle("height", name_height+"px");
        }
      }
    }
    else {
      for(var i=0; i<items_length; i++) {
        var temp_name_height = x$(items_list[i]).find("."+item_class+"")[0].offsetHeight;        
        // Getting max name height
        name_height = temp_name_height>name_height ? temp_name_height : name_height;
      }
      // Setting the max value for both items
      items_list.find("."+item_class+"").setStyle("height", name_height+"px");
    }
  }
}


/*
 * File: george/minicart.js
 */
jQuery(document).ready(function(){
	var host = window.location.host;
	function saveForLaterItemView(selectedOptions){
		if(selectedOptions == null) {
      selectedOptions = '';
      selectedOptions.selectedPids = '';
    }
    
    jQuery.ajax({
		url: 'http://'+host+'/on/demandware.store/Sites-ASDA-Site/default/SaveForLater-Save?pid=' + selectedOptions.selectedPids,
		type: 'get'
		}).done(function(){
		jQuery('#saveForLaterBtn').addClass('itemSaved').html('');
		jQuery.ajax({
		url: 'http://'+host+'/on/demandware.store/Sites-ASDA-Site/default/Cart-MiniCartGeorge',
		type: 'get'
		}).done(function(response){
		var result = response.split("<!-- Start: george/cart/minicartlineitem_george -->");
		result = result[1].split("<!-- End: george/cart/minicartlineitem_george -->");
		//Trigger custom event for updating top nav button.
		jQuery('#userControls .sfl-counter').trigger('sflTopUpdateEvent');
		jQuery('.viewSavedItems').removeClass('hidden');
		if(jQuery("#ModalContent").length > 0) {
		dialog.dialog("close");
		}
		// replace the content
		var insertionElement = jQuery("#basketContents");
		if (insertionElement == null) return;
		//console.log(result1);
		//var empty = result1.contains("empty");
		var empty = result[0].split("empty");
		if(empty.length > 1) {
			//result_arr = result1.split("empty");
			result_arr = result[0].split("empty");
			var bodyClass = jQuery("body").attr("class");
			//console.log("bodyClass = " + bodyClass);
			if(bodyClass == 'mw_direct') {
				result_arr[0] = '<div id="basketContents" class="mw_empty"></div><span>Your basket is empty . Would you like to take a look at some of our bestsellers?</span><div class="mw_emptyBasketBtn"><a id="yes_btn" href="http://'+ host +'/on/demandware.store/Sites-ASDA-Site/default/Search-Show?q=bestsellers&amp;cm_sp=mobileteam-_-basketbestseller" class="mw_btn1">Yes, Please</a><a id="no_btn" class="mw_btn2">No, Thanks</a></div>';
			}
			else {
				result_arr[0] = '<div id="basketContents" class="mw_empty"></div><span>Your basket is empty . Would you like to take a look at some of our bestsellers?</span><div class="mw_emptyBasketBtn"><a id="yes_btn" href="http://'+ host +'/on/demandware.store/Sites-ASDA-Site/default/Search-Show?q=sale&cgid=10&ccgid=10&cm_sp=mobileteam-_-basketsale" class="mw_btn1">Yes, Please</a><a id="no_btn" class="mw_btn2">No, Thanks</a></div>';
			}
		}
		else {
			result_arr = result[0].split("</ul>");
		}
		
		//console.log(result_arr[0]);
		insertionElement.html(result_arr[0]);
		jQuery(".sflMinicart").remove();
		var basketBottom = jQuery(".basketContent");
		basketBottom.append(result_arr[1]);
		jQuery("#no_btn").attr("onclick", "x$('.mw_header_basket').click()");

		jQuery.ajax({
		type : "POST",
		url : app.minicart.summaryUrl,
		cache : true,
		success : function(e) {
		jQuery('.basketSummary').html(e);
		}
		});
		//jScrollPane minicart re-initialization
		jspMiniCartScroll();
		if(jQuery('.addToBasket .loading') != undefined){
			jQuery('.addToBasket .loading').addClass('itemAdded');
			jQuery('.addToBasket .loading').removeClass('loading');
			setTimeout(function() { 
				jQuery('.addToBasket .itemAdded').removeClass('itemAdded');
			},1500);
		}
		setTimeout(function() { 
			jQuery('#saveForLaterBtn').removeClass('itemSaved').html('Save For Later');
		}, 2000);
		});
		});
	}
  jQuery(document).ready(function() {
    jQuery("body:not(.mw_checkout_base)").each(function() {
      saveForLaterItemView(null);
    });
  });
});




/*
 * File: george/mw_also_like.js
 */
// add the You may also like toggler after the content is loaded

x$(document).on("DOMContentLoaded", function() {
  x$(".mw_productG").each(function() {
    x$("#recsBottom").on('DOMNodeInserted', function(e) {
      x$(".mw_ajaxloader").setStyle("visibility", "hidden");
    });
  });
});



/*
 * File: george/mw_move_popup.js
 */
// ADG-270 changing to the Asda Direct style of the auto dropping down mini basket.
// move the back screen to the top of the popup
// function mw_move_popup() {
//   var popup_top = x$(".ui-dialog")[0].offsetTop;
//   window.scrollTo(0, popup_top);
//   x$("#MB_Container").on("DOMNodeInserted", function() {
//     x$(".mw_header_basketG").html("Basket: " + x$(".minicartTotal").html()[0]); 
//   });
// };



/*
 * File: george/mw_pdp_utilityG.js
 */
//This is for jumping to another image via thumbnails on pdp
x$(document).on("DOMContentLoaded", function() {
  x$(".mw_productG").each(function(){
    x$("#imageSlide .thumbnail").each(function(e,i,x) {
      x$(this).on("click",function(){
        var zoomed = x$("[data-ur-set='zoom'][data-ur-state='enabled']")[0];
        if (zoomed) {
          x$("[data-ur-carousel-component='item'][data-ur-state='active'] [data-ur-set='zoom']")[0].zoom();
          x$(".leftcontent").removeClass("mw_hide_zoom");
        }
        Ur.Widgets.carousel.product_carousel.jumpToIndex(i);
      });
    });
    x$("#BVCustomerRatings").on("click", function() {
      var offset = document.getElementById("mw_reviews").offsetTop;
      x$("a[title='Reviews'][data-ur-state='disabled']").fire("click");
      scrollTo(0, offset);
    });
    
    // Ticket 353 - ensure that the background objects are clicked on android
    if(navigator.userAgent.match(/android/i) != null) {
      x$(".ui-icon-closethick").on("click", function() {
        x$(".mw_productG").setStyle("visibility","visible");
      });
      x$("#tellafriend").on("click", function() {
        x$(".mw_productG").setStyle("visibility","hidden");
      });
    }

    x$(".hideByJs").setStyle('display', 'none');
  });
  // ADG-526 : Allow exit of customer reviews by clicking out of box - start
  x$("body.mw_george").on("DOMNodeInserted", function(e) {
    if(x$(e.target).attr('class') == 'ui-widget-overlay') { 
      $(".ui-widget-overlay").unbind("click").bind("click", function() {
        dialog.dialog("close");
      });
    }
    // Fix for ADG-893 : 'Email Sent' overlay is not properly formatted after sending mail to friend.
    if(x$(e.target).attr('id') == 'ModalContent') { 
      var $btnContainer=$(this).find(".rightSection > a");
      if(!$btnContainer.hasClass("mw-click-binded")){
        // bind a function on button to scroll to top on it click
        $btnContainer.click(function(){
          $(this).addClass("mw-click-binded");
          $(".mw_george").scrollTop(0);
        })
      }
    }
    // End of  ADG-893
  });
  // ADG-526 - end
  // End Fix ADG-860
  x$(".mw_productG").each(function(){
    $('.ui-widget-header').addClass("mw_popup_header");
    $('.ui-dialog-titlebar-close').addClass("mw_btn2");  
  });
  // End Fix ADG-860
});



/*
 * File: george/mw_side_slider.js
 */
//ADG-589: begin
;(function ($, global) {
 $(global).on('load', function () {
  var mw_menu    = jQuery('#mw-side-slider-menu'), 
      menuButton = $('.mw_menu_button'), // Fix for ADG-1024 -Changed class name from 'mw_menu_icon' to 'mw_menu_button'
      // fix for ADG-733
      extrasHeightMenu = mw_menu.innerHeight(true) - mw_menu.height();
      mw_menu.css('height', jQuery(document).height());
   
    jQuery('#homepageBottomPaSlide').one('DOMSubtreeModified', function () {
      mw_menu.css('height', (jQuery(document).height() - extrasHeightMenu) + jQuery(this).height());
      mw_menu.data('homePageSlide', true);
    });
 
  mw_menu.attr({
    'show-menu': 'disabled'
  });

  jQuery(window).on('resize', function () {
    mw_menu.css('height', jQuery(document).height() - extrasHeightMenu);
  });

  menuButton.click(function () {

    mw_menu.attr('show-menu', mw_menu.attr('show-menu') === 'enabled' ? 'disabled' : 'enabled');
    jQuery('body').attr('show-menu', mw_menu.attr('show-menu'));

    if(mw_menu.attr("show-menu") == "enabled") {
      mw_menu.removeClass("mw_hide");
    }

  });

  jQuery("body").on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', 
  function() {
    if(mw_menu.attr("show-menu") == "disabled") {
      mw_menu.addClass("mw_hide");
    }
  });
 // End of ADG-733

  //ADG-631: begin
  jQuery('#mw-side-slider-menu .mw-side-slider-contents #mainNav').delegate('.main_tab:not(".shop")', 'click', function(e) {
    window.location.href = jQuery(this).find('a').attr("href");
  });

  jQuery('#mw-side-slider-menu .mw-side-slider-contents #mainNav li.shop .main_tab_border ul').delegate('.tabLevel', 'click', function(e) {
    window.location.href = jQuery(this).find('a').attr("href");
  });
  //ADG-631: end

 });

}(x$, window));
//ADG-589: end


/*
 * File: george/mw_view_toggler.js
 */
// This handles the icon/grid view toggle

x$(document).on("DOMContentLoaded", function(){
  x$(".mw_searchG").each(function(){
    // Cookie Function
    var set_search_cookie = function(new_view) {
      var cookie_hours = 1;
      var cookie_seconds = cookie_hours * 1000 * 60 * 60;
      var expires = new Date(new Date().getTime() + cookie_seconds);
      var cookie = "mw_search_view=" + new_view + "; ";
      if (cookie_seconds != 0) {
        cookie += "expires=" + expires.toGMTString() + "; ";
      }
      cookie += "path=/; ";
      cookie += "domain=.direct.asda.com; ";
      document.cookie = cookie;
      return true;
    };

    // Toggle View Function
    function mw_toggle_view() {
      x$(".mw_icon_list").on("click", function() {
        if (x$(".mw_icon_list").hasClass("mw_icon_active") == false) {
          x$(".mw_icon_list").toggleClass("mw_icon_active");
          x$(".mw_icon_grid").toggleClass("mw_icon_active");
          x$("#productListing").toggleClass("mw_view_list");
          x$("#productListing").toggleClass("mw_view_grid");
          x$(".mw_results_for_some_terms .productListing").toggleClass("mw_view_list");
          x$(".mw_results_for_some_terms .productListing").toggleClass("mw_view_grid");
          // FOR ADG-1029
          jQuery('.productPaneLeft').each(function() {
              var parent = jQuery(this).find(".listItem");
              jQuery(this).find(".addToBasketMoreInfoContainer").addClass("mw_addToBasket_list_view");
              parent.find("ul.rating").addClass("mw_rating_list_view");
              jQuery(this).find(".addToBasketMoreInfoContainer").insertAfter(parent.find('div.productPrice').addClass("mw_price_list_view"));
          });
          // FOR ADG-1029 end
          set_search_cookie("list");
        }
      });

      x$(".mw_icon_grid").on("click", function() {
        if (x$(".mw_icon_grid").hasClass("mw_icon_active") == false) {
          x$(".mw_icon_list").toggleClass("mw_icon_active");
          x$(".mw_icon_grid").toggleClass("mw_icon_active");
          x$("#productListing").toggleClass("mw_view_list");
          x$("#productListing").toggleClass("mw_view_grid");
          x$(".mw_results_for_some_terms .productListing").toggleClass("mw_view_list");
          x$(".mw_results_for_some_terms .productListing").toggleClass("mw_view_grid");
          // FOR ADG-1029
          jQuery('.productPaneLeft').each(function() {
              var parent = jQuery(this).find(".listItem");
              jQuery(this).find(".addToBasketMoreInfoContainer").removeClass("mw_addToBasket_list_view");
              parent.find("ul.rating").removeClass("mw_rating_list_view");
              parent.find('div.productPrice').removeClass("mw_price_list_view");
              jQuery(this).find(".addToBasketMoreInfoContainer").insertAfter(parent.find('div.productImg'));
          });
          // FOR ADG-1029 end
          set_search_cookie("grid");
        }
      });
    }
    // FOR ADG-1029
    if (x$(".mw_icon_list").hasClass("mw_icon_active") == true)
    {
      jQuery('.productPaneLeft').each(function() {
          var parent = jQuery(this).find(".listItem");
          jQuery(this).find(".addToBasketMoreInfoContainer").addClass("mw_addToBasket_list_view");
          parent.find("ul.rating").addClass("mw_rating_list_view");
          jQuery(this).find(".addToBasketMoreInfoContainer").insertAfter(parent.find('div.productPrice').addClass("mw_price_list_view"));
      });
    }
    // FOR ADG-1029 end
    mw_toggle_view();
    
    // After content is ajaxed, need to refresh Uranium and view toggler
    x$("#productSearchRefinementsAjaxContainer").on("DOMNodeInserted", function(event) {
      mw_toggle_view();
      // need both lines for it to function
      Ur.setup("#primaryShadowContent");
      window.setTimeout(function() {Ur.setup("#primaryShadowContent");}, 15);
    });
  });
});




/*
 * File: george/mw_zoom_button.js
 */
x$(document).on("DOMContentLoaded", function() {
  x$(".mw_productG").each(function() {
    function switchBtn() {
      var zoomed = x$("[data-ur-set='zoom'][data-ur-state='enabled-in']")[0];
      if (zoomed) {
        x$(".leftcontent").addClass("mw_hide_zoom");
      } else {
        x$(".leftcontent").removeClass("mw_hide_zoom");
      }
    }
    x$("[data-ur-set='zoom'] img").on("webkitTransitionEnd", switchBtn).on("transitionend", switchBtn);

    x$(".mw_image_zoom_button").on("click", function() {
      var multiples = x$(".mw_productLinkImage")[1] != null;

      if(multiples){
        //this triggers the actual zooming on the currently active carousel pictures zoom
        x$("[data-ur-carousel-component='item'][data-ur-state='active'] [data-ur-set='zoom']")[0].zoom();
      }else {
        x$("[data-ur-set='zoom']")[0].zoom();
      }
    });
  });
});



/*
 * File: george/nav_myAccountG.js
 */
jQuery(window).on("load", function() {
	jQuery("body.mw_george .myAccount").on("click", function() {
		jQuery(".topNavDropdown").toggleClass("hidden");
	});
});


/*
 * File: george/pdp_dropdown.js
 */
// remove disabled <select> dropdown options on iOS since they can still be selected
x$(document).on("DOMContentLoaded", function() {
  if (window.app)
    $(app.ProductCache).bind("VariationsLoaded", {}, function() {
      if (/iP(hone|od|ad)/.test(navigator.userAgent)){
      	// Fix for ADG-997: Donot remove the disabled option for color select box
      	if($("option[disabled]").text().toLowerCase().trim() != "select colour")
      		x$("option[disabled]").remove();
      	// End of ADG-997
      }
    });
});



/*
 * File: george/pdp_popup.js
 */
// ADG-270 changing to the Asda Direct style of the auto dropping down mini basket.
// get height of popup content from jspPane and adjust the container heights dynamically
// for Delivery Info and Returns popups
// setAjaxCallbacks(/(RETURNS_INFO|DELIVERY_CHARGES)/, function() {
//   x$(".mw_productG").each(function() {
//     setTimeout(function() {
//       $popup_height = $(".jspPane").height();
//       $("#MB_Background").css("max-height", $popup_height);
//       $("#MB_Background").css("height", $popup_height);
//       $(".jspContainer").css("height", $popup_height);
//     }, 100);
//   });
// });


/*
 * File: george/pdp_select.js
 */
x$(window).load(function() {
  // x$(x$(".ui-form-dropdown-options li")[3]).click();
  if (x$("div[class*='variantdropdown size clearfix'] .ui-form-dropdown-options li").length == 2) {
    // x$("select#size")[0].selectedIndex = 1;
    x$(x$("div[class*='variantdropdown size clearfix'] .ui-form-dropdown-options li")[1]).click();
  }
  // Fix for ADG-997
  $(".mw-select #colour").on("change", function(){
  	$(".mw_productLinkImage").each(function(index, event){
  		var img_src = $($("#imageSlideInner").children("a").get(index)).attr("href").replace(/op_usm=.*?&/, "&"),
  				small_img_src = img_src + "&wid=246&hei=308",
  				large_img_src = img_src + "&wid=800&hei=1000";
  		$($(".mw_productLinkImage")[index]).find("img[data-ur-zoom-component='small']").attr("src", small_img_src);
  		$($(".mw_productLinkImage")[index]).find("img[data-ur-zoom-component='large']").attr("data-ur-src", large_img_src);
  	})
  })
  // End of ADG-997
});


/*
 * File: george/productG_carousel.js
 */
// ADG-978: [R19] George Home PDP Tabs - (George Home)
x$(document).on("DOMContentLoaded", function() {
	jQuery("#ptProductDetails.mw_george").each(function(){
    // ADG-989: "You May Also Like" Not Styled Correctly - (George Home) - start
    // "You May Also like" section - outside the tab
    jQuery("#georgeHomePABottomPageSetList").on("DOMSubtreeModified", function() {
      jQuery(".mw_umayalsolike_carousel_container").attr({"data-ur-set": "carousel", 
                        "data-ur-carousel-component": "view_container", 
                        "data-ur-infinite": "disabled", "data-ur-fill": "2"});
      jQuery(this).attr({"data-ur-carousel-component": "scroll_container"});
      jQuery("#georgeHomePABottomPageSetList > li").attr({ "data-ur-carousel-component": "item" }); 
      Ur.initialize('.mw_umayalsolike_carousel_content');
    });
    // "You May Also like" section - inside the tab
    // Arrange the position
    jQuery("#youMayAlsoLike_content .productListing").on("DOMNodeInserted", function(e) {
      if($(e.target).hasClass("mw_last_item")) {
        $("#youMayAlsoLike_content .productListing > li").attr({ "data-ur-carousel-component": "item", class: "productPaneLeft" }); 
        $("#youMayAlsoLike_content .productListing .listItem").each(function() {
          var obj_listitem = $(this);
          obj_listitem.find(".prodMiniTop").append(obj_listitem.find("ul.rating"));
          obj_listitem.find(".listItemInnerMost").append(obj_listitem.find(".prodMiniTop"));
          obj_listitem.find(".prodMiniTop h4").addClass("productName");
        });
      }
    });
    // Initialize the carousel
    jQuery("#youMayAlsoLike_content").on("DOMSubtreeModified", function() {
      jQuery(this).find(".carouselContainer").attr({"data-ur-set": "carousel"});
      Ur.initialize('#youMayAlsoLike_content');
    });
    // "Also in this range" and "Recently viewed" sections
    jQuery("div.tabHead[data-ur-set='toggler']").each(function() {
  	  jQuery(this).find(".viewProductLink img").each(function(){
                                        jQuery(this).attr("src", jQuery(this).attr("data-original"))
                                      });
      jQuery(this).show();
      if($(this).find(".productListing li").length > 0) {
        var content_id = $(this).find(".tabContent").attr("id");
        Ur.initialize('#'+content_id);
      }
    });
    // ADG-989 - end
    Ur.onLoadCallbacks.push(function(){
      // Check if carousel is enabled
      jQuery("#georgeHomeCarouselTabTitles [data-ur-set='carousel'][data-ur-state='enabled']").each(function() {
        var carousel_obj = $(this);
        // Adjust the height of contents
        carousel_obj.parents("[data-ur-set='toggler']").find("[data-ur-toggler-component='button']").on("click", function() {
          if($(this).attr("data-ur-state") == "enabled") {
            // ADG-989: "You May Also Like" Not Styled Correctly - (George Home) - start
            var content_id = $(this).attr("id");
            $(this).parents("[data-ur-set='toggler']").find(".productListing").each(function() {
              compute_list_height(x$(this).find("li.productPaneLeft"), content_id);
            });
            // ADG-989 - end
          }
        });
        setTimeout(function() {
          // To keep "You may also like" open
          if(carousel_obj.parents("[data-ur-set='toggler']").find("#youMayAlsoLike").length <= 0 && carousel_obj.parents("[data-ur-set='toggler']").find(".mw_umayalsolike_carousel_content").length <= 0) {
            // Close the toggler if it is open
            if(carousel_obj.parents("[data-ur-set='toggler']").find("[data-ur-toggler-component='button'][data-ur-state='enabled']").length > 0) {
              carousel_obj.parents("[data-ur-set='toggler']").find("[data-ur-toggler-component='button']").trigger("click");
            }
          }
          else {
            // Click twice to keep "You may also like" section open
            if(carousel_obj.parents("[data-ur-set='toggler']").find("[data-ur-toggler-component='button'][data-ur-state='enabled']").length > 0) {
              carousel_obj.parents("[data-ur-set='toggler']").find("[data-ur-toggler-component='button']").trigger("click");
              carousel_obj.parents("[data-ur-set='toggler']").find("[data-ur-toggler-component='button']").trigger("click");
            }
          }
          // Make the toggler visible
          carousel_obj.parents("[data-ur-set='toggler']").removeClass("mw_hidden");  
        }, 500); 
      })
    });
    // ADG-989: "You May Also Like" Not Styled Correctly - (George Home) - start
    x$(window).on("orientationchange", function() {
      jQuery("#georgeHomeCarouselTabTitles [data-ur-set='toggler'][data-ur-state='enabled']").each(function() {
        var content_id = $(this).find("[data-ur-toggler-component='button']").attr("id");
        compute_list_height(x$(this).find("li.productPaneLeft"), content_id);
      });
    });
    function compute_list_height(items, content_id) {
      if(content_id == "recentlyViewed" || content_id == "alsoInThisRange" || content_id == "youMayAlsoLike") {
        items_length = items.length;
        compare_height("productImg", items, items_length, 0);
        compare_height("productPrice", items, items_length, 0);
        compare_height("productName", items, items_length, 0);
        compare_height("rating", items, items_length, 0);
      }
    }
    // ADG-989 - end
  });
});


/*
 * File: george/productG_changecolor.js
 */
jQuery(window).on("load", function() {
  if(typeof modalBoxCreate == "function") {
    _modalBoxCreate = modalBoxCreate;
    modalBoxCreate = function() {
      _modalBoxCreate.apply(this, arguments);
      setTimeout(function() {
        window.scrollTo(0,0);
      }, 2000);
    }
  }
});


/*
 * File: george/quickbuyG.js
 */
x$(document).on("DOMContentLoaded", function() {
  x$("body.mw_quickbuyG").on("DOMNodeInserted", function(e) {
    if(e.target.id == "ModalContent") {
      x$(".viewDetailsVariant span")[0].innerHTML = "VIEW DETAILS";
      
      var add_cart = document.createElement("div");
      add_cart.className = "mw_btn1";
      add_cart.innerHTML = "ADD TO BASKET";
      add_cart.setAttribute("onclick", "x$('.addToBasket input').click();");
      x$(".addToBasket")[0].appendChild(add_cart);
    }
    
    if(x$(".ui-dialog #ModalContent")[0]) {
      var quickbuy_popup = x$(".ui-dialog")[0];
      var body_height = x$("body")[0].offsetHeight;
      var popup_all_height = quickbuy_popup.offsetTop + quickbuy_popup.offsetHeight + 10;
      if(body_height < popup_all_height) {
        document.body.style.height = popup_all_height + "px";
      }
    }
    
    x$("#MB_closeBtn").on("click", function() {
      document.body.style.height = "";
    });
  });
});


/*
 * File: george/rewrite_link.js
 */
// Rewrite "write reviews" link
// ADG-519 : Display 'Write a review' link
x$(document).on("DOMContentLoaded", function() {
  x$(".mw_productG #BVRRSummaryContainer").on("DOMNodeInserted", function(ev) {
    if(ev.target.className ==  "BVRRRootElement") {
      if (x$("#BVRRRatingSummaryLinkWriteFirstID a")[0] != null) {
        var rewrited_write_url = x$("#BVRRRatingSummaryLinkWriteFirstID a")[0].getAttribute('data-bvjsref').replace(/(\S+https?%3A%2F%2F)+(staging\.)?direct\.asda\.com(\S*)/im, "$1" + location.hostname + "$3");
        x$("#BVRRRatingSummaryLinkWriteFirstID a")[0].setAttribute('data-bvjsref', rewrited_write_url);
      }
    }
  });
});


/*
 * File: george/save_for_later.js
 */
// // Start of ADG-609
// DON'T UNCOMMENT THIS

// x$(document).on("DOMContentLoaded", function() {
//   x$(".mw_george").each(function() {
//     x$("#header").each(function() {
//      x$("#basketBottom").after(x$(".sflMinicart"));
//     });
//     x$("#minicart").on("DOMNodeInserted", function() {
//       var host = window.location.host;

//        x$(".sflMinicart")[1].remove();
//        x$("#basketBottom").after(x$(".sflMinicart"));

//        var innerHTML = x$("#basketContents").html();
//        var empty = innerHTML[0].contains("empty");
//        if(empty == true) {
//          x$("#mw_basketMiddle").html('<div id="basketContents" class="mw_empty"></div>');
//          x$("#basketContents").html('<span>Your basket is empty . Would you like to take a look at some of our bestsellers?</span><div class="mw_emptyBasketBtn"></div>');
//          x$(".mw_emptyBasketBtn").html('<a id="yes_btn" href="http://'+ host +'/on/demandware.store/Sites-ASDA-Site/default/Search-Show?q=sale&cgid=10&ccgid=10&cm_sp=mobileteam-_-basketsale" class="mw_btn1">Yes, Please</a><a id="no_btn" class="mw_btn2">No, Thanks</a>');
//          x$("#no_btn").attr("onclick", "x$('.mw_header_basketG').click()");
//        }
//      });
//   });
// });
// // End of ADG-609


/*
 * File: george/select_dropdowns.js
 */
jQuery(window).on("load", function() {
  setTimeout(function() {
    jQuery("select").parent().addClass("ui-select-element-holder");
  }, 2500);
});


/*
 * File: george/select_sprite.js
 */
// select_arrow sprite for selects
jQuery(window).on("load", function() {
  jQuery("select").wrap("<div class='mw-select'></div>");

  if(jQuery("select").hasClass("hide")) {
    jQuery("select.hide").parent("mw-select").addClass("mw_hide");
  }

  // For ADG-1061
  jQuery(".options > div").each (function(){ 	//for ADG-1059
    if($(this).find("label.attributeValue").length) {
      $(this).find("label.attributeValue").parent().find(".mw-select").removeClass("mw-select").hide();
    }
  });
  jQuery("#buyOptions .variations").each(function(){
     $(this).find(".errorMessage").appendTo($(this));
  });
  // For ADG-1061 end
});


/*
 * File: george/simple_carousel.js
 */
// this is simple_carousel.js

// PAGE_REF: .mw_searchbrowse, .mw_product, .mw_cart

/* A simple carousel widget. No swiping or animations. May Uraniumize if
   it turns out to be useful. */

x$(document).on("DOMContentLoaded", function () {
  x$(".mw_productG").each(function() {
    var carousel_items = x$(".mw_simple_carousel_item");
    var carousel_prev = x$(".mw_simple_carousel_prev");
    var carousel_next = x$(".mw_simple_carousel_next");
    var carousel_length = carousel_items.length;
    
    var first_visible = 0, last_visible = 2;
    var max_visible = last_visible - first_visible + 1;
    
    function prev() {
      if (first_visible > 0) {
        carousel_items[last_visible--].setAttribute("data-ur-state", "hide");
        carousel_items[--first_visible].setAttribute("data-ur-state", "show");
      }
      check_buttons();
    }
    
    function next() {
      if (last_visible < carousel_length - 1) {
        carousel_items[first_visible++].setAttribute("data-ur-state", "hide");
        carousel_items[++last_visible].setAttribute("data-ur-state", "show");
      }
      check_buttons();
    }
    
    function check_buttons() {
      if (first_visible == 0) {
        carousel_prev.attr("data-ur-state", "hide")
      }
      else {
        carousel_prev.attr("data-ur-state", "show")
      }
      if (last_visible + 1 == carousel_length) {
        carousel_next.attr("data-ur-state", "hide")
      }
      else {
        carousel_next.attr("data-ur-state", "show")
      }
    }

    function init() {
      for(var i = max_visible;i < carousel_length; i++) {
        carousel_items[i].setAttribute("data-ur-state","hide");
      }
    }

    init();
    check_buttons();
    carousel_prev.click(prev);
    carousel_next.click(next);      
  });
});



/*
 * File: george/sourced_by_george_test.js
 */
// For ADG-1035
x$(document).on("DOMContentLoaded", function () {
	jQuery(".contentasset>div>#sb-body").hide();
	jQuery("#mobile-wrapper>.row>.col").hide();
	jQuery("#mobile-wrapper").on("DOMNodeInserted",function(e){
		console.log(e.target)
		jQuery(e.target).find(".intro_sq p").text(jQuery("#sb-wrapper .intro_sq p").text());
		jQuery("#sb-wrap-nav #menu-tab").appendTo("#sb-wrap-nav  #sb-navigation-sticky-wrapper");
		jQuery("#sb-wrap-nav #menu-tab").find(".arrow").addClass("mw_arrow").removeClass("arrow");
	})
});
// For ADG-1035 end


/*
 * File: george/stub.js
 */
// Delete me


/*
 * File: george/zoom.js
 */
function bound(num, range) {
  return Math.max(Math.min(range[0], num), range[1]);
}

var oldAndroid = /Android [12]/.test(navigator.userAgent);

var noTranslate3d = oldAndroid;
var noScale3d = oldAndroid;

var translatePrefix = noTranslate3d ? "translate(" : "translate3d(";
var translateSuffix = noTranslate3d ? ")" : ", 0)";

var scalePrefix = noScale3d ? " scale(" : " scale3d(";
var scaleSuffix = noScale3d ? ")" : ", 1)";

x$.extend({
  transform: function(translateX, translateY, scale) {
    var t = "";
    if (translateX != undefined)
      t = translatePrefix + translateX + "px, " + translateY + "px" + translateSuffix;
    if (scale != undefined)
      t += scalePrefix + scale + ", " + scale + scaleSuffix;
    return this.css({ webkitTransform: t, MozTransform: t, oTransform: t, transform: t });
  }
});

x$(window).load(function() {
  var loaded_imgs = []; // sometimes the load event doesn't fire when the image src has been previously loaded
  x$("[data-ur-set='zoom']").each(function(container) {
    var state = "disabled";
    var img = x$(container).find("[data-ur-zoom-component='small']")[0];
    var bigImg = x$(container).find("[data-ur-zoom-component='large']")[0];
    var btns = x$(container).find("[data-ur-zoom-component='button']");
    var idlers = x$(container).find("[data-ur-zoom-component='loading']");
    var prescale = container.getAttribute("data-ur-prescale") != "disabled";
    var width, height;
    var bigWidth, bigHeight;
    var canvasWidth, canvasHeight;
    var ratio, scaleIn, scaleOut;
    
    var boundX, boundX_2, boundY, boundY_2;
    
    var initLeft = 0; // initial horizontal translation upon zooming
    var initTop = 0;  // initial vertical translation upon zooming
    var offsetX = 0;
    var offsetY = 0;
    var touchX = 0;
    var touchY = 0;
    var mouseDown = false; // only used on non-touch-enabled browsers
    var mouseDrag = true;
    
    function init() {
      canvasWidth = parseInt(x$(container).getStyle("width"));
      canvasHeight = parseInt(x$(container).getStyle("height"));
      width = width || parseInt(x$(img).getStyle("width")) || img.width;
      height = height || parseInt(x$(img).getStyle("height")) || img.height;
      
      bigWidth = parseInt(x$(bigImg).getStyle("width")) || bigImg.width;
      bigHeight = parseInt(x$(bigImg).getStyle("height")) || bigImg.height;
      
      ratio = bigWidth/width;
      
      scaleIn = ratio;
      scaleOut = 1/ratio;
      boundX = canvasWidth - bigWidth;   // horizontal translation to view very right side of image
      boundX_2 = boundX/2;         // horizontal translation to view middle of image
      boundY = canvasHeight - bigHeight; // vertical translation to view very bottom of image
      boundY_2 = boundY/2;         // vertical translation to view middle of image
    }
    
    function pan_start(event) {
      var target = event.target;
      if (target != bigImg)
        return;
      mouseDrag = false;
      touchX = event.pageX;
      touchY = event.pageY;
      mouseDown = true;
      if (event.touches) {
        touchX = event.touches[0].pageX;
        touchY = event.touches[0].pageY;
      }
      var style = bigImg.style;
      var transform = style.webkitTransform || style.MozTransform || style.oTransform || style.transform || "translate(0, 0)";
      transform = transform.replace(/.*\(|\)/, "").split(",");
      
      offsetX = parseInt(transform[0]);
      offsetY = parseInt(transform[1]);
      event.preventDefault();
      event.stopPropagation();
    }
    
    function pan_move(event) {
      if (!mouseDown) // NOTE: mouseDown should always be true on touch-enabled devices
        return;
      var target = event.target;
      if (target != bigImg)
        return;
      var x = event.pageX;
      var y = event.pageY;
      if (event.touches) {
        x = event.touches[0].pageX;
        y = event.touches[0].pageY;
      }
      var dx = x - touchX;
      var dy = y - touchY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5)
        mouseDrag = true;
      var new_offsetX = bound(offsetX + dx, [0,  boundX]);
      var new_offsetY = bound(offsetY + dy, [0,  boundY]);
      x$(bigImg).transform(new_offsetX, new_offsetY);
      event.preventDefault();
      event.stopPropagation();
    }
    
    function pan_end(event) {
      if (!mouseDrag)
        zoomOut();
      event.preventDefault();
      event.stopPropagation();
      mouseDown = false;
      mouseDrag = true;
    }
    
    function transitionEnd() {
      if (state == "enabled-in") {
        if (!bigImg.getAttribute("data-ur-state") && loaded_imgs.indexOf(bigImg.src) == -1)
          idlers.attr("data-ur-state", "enabled");
        else
          img.style.display = "none";
        state = "enabled";
        container.setAttribute("data-ur-state", state);
        x$(bigImg).attr("data-ur-state", "enabled").css({"display": "inline", "width": "", "height": ""}).transform(initLeft, initTop);
        if (document.ontouchstart !== undefined) {
          // not using xui here since using multiple touch listeners doesn't really work
          container.addEventListener("touchstart", pan_start);
          container.addEventListener("touchmove", pan_move);
          container.addEventListener("touchend", pan_end);
        }
        else {
          // not using xui here since using multiple touch listeners doesn't really work
          container.addEventListener("mousedown", pan_start);
          container.addEventListener("mousemove", pan_move);
          container.addEventListener("mouseup", pan_end);
        }
      }
      else if (state == "enabled-out") {
        state = "disabled";
        x$(bigImg).css({"display": "", "width": width + "px", "height": height + "px"}).transform();
        container.setAttribute("data-ur-state", state);
        if (document.ontouchstart !== undefined) {
          container.removeEventListener("touchstart", pan_start);
          container.removeEventListener("touchmove", pan_move);
          container.removeEventListener("touchend", pan_end);
        }
        else {
          container.removeEventListener("mousedown", pan_start);
          container.removeEventListener("mousemove", pan_move);
          container.removeEventListener("mouseup", pan_end);
        }
      }
    }
    
    // attempts to zoom in centering in on the area that was touched
    function zoomIn(event) {
      if (state != "disabled")
        return;
      if (!width)
        init();
      btns.attr("data-ur-state", "enabled");
      state = "enabled-in";
      container.setAttribute("data-ur-state", state);
      var x = event.pageX;
      var y = event.pageY;
      if (event.touches) {
        x = event.touches[0].pageX;
        y = event.touches[0].pageY;
      }
      var target = bigImg.src ? bigImg : img;
      if (!bigImg.src)
        bigImg.src = bigImg.getAttribute("data-ur-src");
      
      // find touch location relative to image
      var offset = x$(target).offset();
      var relX = x - offset.left;
      var relY = y - offset.top;
      var translateX = bound(bigWidth/2 - ratio * relX, [-boundX_2, boundX_2]);
      var translateY = bound(bigHeight/2 - ratio * relY, [-boundY_2, boundY_2]);
      
      initLeft = translateX + boundX_2;
      initTop = translateY + boundY_2;
      x$(target).transform(translateX, translateY, scaleIn);
    }
    function zoomOut() {
      if (state != "enabled")
        return;
      btns.attr("data-ur-state", "disabled");
      state = "enabled-out";
      container.setAttribute("data-ur-state", state);
      x$(bigImg).transform(boundX_2, boundY_2, scaleOut);
    }
    
    if (container.getAttribute("data-ur-touch") != "disabled") {
      x$(img).click(zoomIn);
      x$(bigImg).click(zoomIn);
    }
    
    x$(bigImg).load(function() {
      loaded_imgs.push(bigImg.src);
      x$(bigImg).attr("data-ur-state", "loaded");
      idlers.attr("data-ur-state", "disabled");
      img.src = bigImg.src;
      if (state == "enabled")
        img.style.display = "none";
      if (!prescale) {
        prescale = true;
        state = "disabled";
        init();
        img.style.display = "none";
        x$(bigImg).attr("data-ur-state", "enabled");
        bigImg.style.width = width + "px";
        bigImg.style.height = height + "px";
        setTimeout(zoomCenter, 15);
      }
    });
    
    function zoomCenter() {
      if (state == "disabled") {
        if (!width)
          init();
        btns.attr("data-ur-state", "enabled");
        state = "enabled-in";
        container.setAttribute("data-ur-state", state);
        initLeft = boundX_2; // zoom to center by default
        initTop = boundY_2;  // zoom to center by default
        if (prescale || bigImg.src)
          x$(bigImg.src ? bigImg : img).transform(0, 0, scaleIn);
        else
          idlers.attr("data-ur-state", "enabled");
        if (!bigImg.src)
          bigImg.src = bigImg.getAttribute("data-ur-src");
      } else
        zoomOut();
    }
    
    container.zoom = zoomCenter;
    
    // zoom in/out button, zooms in to the center of the image
    btns.click(zoomCenter);
    
    x$.fn.iterate(["webkitTransitionEnd", "transitionend", "oTransitionEnd"], function(eventName) {
      x$(img).on(eventName, transitionEnd);
      x$(bigImg).on(eventName, transitionEnd);
    });
    
    reset_zoom = function() {
      state = "disabled";
      img.style.display = "";
      x$(img).transform();
      x$(bigImg).transform().attr("data-ur-state", "")[0].removeAttribute("src");
      x$(idlers).attr("data-ur-state", "disabled");
      btns.attr("data-ur-state", "disabled");
    };
  });
});

