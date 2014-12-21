$(function(){
    var $write = $('#write'),
        $writeTo = null,
        shift = false,
        capslock = false;
     
    $('#keyboard li').click(function(){
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
    
    $('input[type=text]').focus(function(e){
        $('#keyboard').slideDown("fast", function() {});
        $writeTo = $(this);
        $write.val($writeTo.val());
        e.preventDefault();
    });
    $('#keyboard li').on('mousedown', function (e) {
        e.preventDefault();
    });
    $('input[type=text]').focusout(function(e){
        $write.val('');
        $('#keyboard').slideUp("fast", function() {}); 
    });
});