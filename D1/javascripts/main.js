/*
	Top Menu
*/


/*
	Side Menu
*/
menu = {
  sidebar: document.getElementById('sidebar-toggle'),
  element: document.getElementById('sidebar-toggle').parentElement,
  open: function(){
    this.element.className = this.element.className.replace('menu-closed','menu-open');
    this.sidebar.getElementsByTagName('i')[0].className = 'icon-left-open';
  },
  close: function(){
    this.element.className = this.element.className.replace('menu-open','menu-closed');
    this.sidebar.getElementsByTagName('i')[0].className = 'icon-right-open';
  },
  toggle: function(){
    (this.element.offsetWidth === this.sidebar.offsetWidth) ? this.open() : this.close();
  }
};
menu.sidebar.addEventListener('click', function(){menu.toggle();},false);

/*
	Hammer Touch
*/
var hammertime = new Hammer(menu.sidebar, {});
hammertime.on('swipe', function(ev) {
	if(ev.direction===4){
		menu.open();
	} else if (ev.direction===2) {
		menu.close();
	}
});