$(function(){
    var $write = null,
        $writeTo = null,
        shift = false,
        capslock = false;
        var keyboard = '<ul id="keyboard" class="hide">';
        keyboard += '<div><input id="write" type="text"><i class="icon-cancel"></i></div>';
            keyboard += '<li class="symbol"><span class="off">`</span><span class="on">~</span></li>';
            keyboard += '<li class="symbol"><span class="off">1</span><span class="on">!</span></li>';
            keyboard += '<li class="symbol"><span class="off">2</span><span class="on">@</span></li>';
            keyboard += '<li class="symbol"><span class="off">3</span><span class="on">#</span></li>';
            keyboard += '<li class="symbol"><span class="off">4</span><span class="on">$</span></li>';
            keyboard += '<li class="symbol"><span class="off">5</span><span class="on">%</span></li>';
            keyboard += '<li class="symbol"><span class="off">6</span><span class="on">^</span></li>';
            keyboard += '<li class="symbol"><span class="off">7</span><span class="on">&amp;</span></li>';
            keyboard += '<li class="symbol"><span class="off">8</span><span class="on">*</span></li>';
            keyboard += '<li class="symbol"><span class="off">9</span><span class="on">(</span></li>';
            keyboard += '<li class="symbol"><span class="off">0</span><span class="on">)</span></li>';
            keyboard += '<li class="symbol"><span class="off">-</span><span class="on">_</span></li>';
            keyboard += '<li class="symbol"><span class="off">=</span><span class="on">+</span></li>';
            keyboard += '<li class="delete lastitem">delete</li>';
            keyboard += '<li class="tab">tab</li>';
            keyboard += '<li class="letter">q</li>';
            keyboard += '<li class="letter">w</li>';
            keyboard += '<li class="letter">e</li>';
            keyboard += '<li class="letter">r</li>';
            keyboard += '<li class="letter">t</li>';
            keyboard += '<li class="letter">y</li>';
            keyboard += '<li class="letter">u</li>';
            keyboard += '<li class="letter">i</li>';
            keyboard += '<li class="letter">o</li>';
            keyboard += '<li class="letter">p</li>';
            keyboard += '<li class="symbol"><span class="off">[</span><span class="on">{</span></li>';
            keyboard += '<li class="symbol"><span class="off">]</span><span class="on">}</span></li>';
            keyboard += '<li class="symbol lastitem"><span class="off">\\</span><span class="on">|</span></li>';
            keyboard += '<li class="capslock">caps lock</li>';
            keyboard += '<li class="letter">a</li>';
            keyboard += '<li class="letter">s</li>';
            keyboard += '<li class="letter">d</li>';
            keyboard += '<li class="letter">f</li>';
            keyboard += '<li class="letter">g</li>';
            keyboard += '<li class="letter">h</li>';
            keyboard += '<li class="letter">j</li>';
            keyboard += '<li class="letter">k</li>';
            keyboard += '<li class="letter">l</li>';
            keyboard += '<li class="symbol"><span class="off">;</span><span class="on">:</span></li>';
            keyboard += '<li class="symbol"><span class="off">'+"'"+'</span><span class="on">&quot;</span></li>';
            keyboard += '<li class="return lastitem">return</li>';
            keyboard += '<li class="left-shift">shift</li>';
            keyboard += '<li class="letter">z</li>';
            keyboard += '<li class="letter">x</li>';
            keyboard += '<li class="letter">c</li>';
            keyboard += '<li class="letter">v</li>';
            keyboard += '<li class="letter">b</li>';
            keyboard += '<li class="letter">n</li>';
            keyboard += '<li class="letter">m</li>';
            keyboard += '<li class="symbol"><span class="off">,</span><span class="on">&lt;</span></li>';
            keyboard += '<li class="symbol"><span class="off">.</span><span class="on">&gt;</span></li>';
            keyboard += '<li class="symbol"><span class="off">/</span><span class="on">?</span></li>';
            keyboard += '<li class="right-shift lastitem">shift</li>';
            keyboard += '<li class="space lastitem">&nbsp;</li>';
            keyboard += '</ul>';
        $('.main-area').append(keyboard);
        $write = $('#write');
    $('#keyboard li').on("click", function(){
        var $this = $(this),
            character = $this.html(); // If it's a lowercase letter, nothing happens to this variable
         
        // Shift keys
        if ($this.hasClass('left-shift') || $this.hasClass('right-shift')) {
            $('.letter').toggleClass('uppercase');
            $('.symbol span').toggle();
             
            shift = (shift === true) ? false : true;
            capslock = false;
            return false;
        }
         
        // Caps lock
        if ($this.hasClass('capslock')) {
            $('.letter').toggleClass('uppercase');
            capslock = true;
            return false;
        }
         
        // Delete
        if ($this.hasClass('delete')) {
            var html = $write.val();
             
            $write.val(html.substr(0, html.length - 1));
            $writeTo.val($write.val());
            return false;
        }
         
        // Special characters
        if ($this.hasClass('symbol')) character = $('span:visible', $this).html();
        if ($this.hasClass('space')) character = ' ';
        if ($this.hasClass('tab')) character = "\t";
        if ($this.hasClass('return')) character = "\n";
         
        // Uppercase letter
        if ($this.hasClass('uppercase')) character = character.toUpperCase();
         
        // Remove shift once a key is clicked.
        if (shift === true) {
            $('.symbol span').toggle();
            if (capslock === false) $('.letter').toggleClass('uppercase');
             
            shift = false;
        }
         
        // Add the character
        $write.val($write.val() + character);
        $writeTo.val($write.val());
    });
    
    $('input[type=text]:not(#write)').focus(function(e){
        $('#keyboard').slideDown("fast", function() {});
        $writeTo = $(this);
        $write.val($writeTo.val());
        e.preventDefault();
    });
    $('#keyboard *').on('mousedown', function (e) {
        e.preventDefault();
    });
    $('#keyboard .icon-cancel').on('click', function (e) {
        $write.val('');
        $writeTo.val('');
    });
    $('input[type=text]').focusout(function(e){
        $write.val('');
        $('#keyboard').slideUp("fast", function() {}); 
    });
});