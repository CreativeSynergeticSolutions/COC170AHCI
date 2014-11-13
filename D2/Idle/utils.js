utils = function (options) {
    this.opacityInterval = null;
    this.start = options.start || null;
    this.end = options.end || null;
    this.time = options.time || null;
    this.element = options.element || null;
    this.selfInterval = options.selfInterval || 100;
    this.fadeIn = function () {
        this.start = 0;
        this.end = 1;
        this.element.style.opacity = this.start;
        this.opacityInterval = setInterval(this.fade,this.selfInterval);
        return this;
    };
    this.fadeOut = function () {
        this.start = 1;
        this.end = 0;
        this.element.style.opacity = this.start;
        this.opacityInterval = setInterval(this.fade,this.selfInterval);
        return this;
    };
    this.fade = function () {
        //console.log(this.element.style.opacity);
        if(this.element.style.opacity==this.end){
            clearInterval(this.opacityInterval);
        } else {
            var increment = (this.start-this.end)/(this.time/this.selfInterval);
            this.element.style.opacity -= increment;   
        }
    };
    return this;
};