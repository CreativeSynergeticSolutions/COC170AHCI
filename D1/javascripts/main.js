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
    console.log(this.element.className);
    (this.element.offsetWidth === 0) ? this.open() : this.close();
  }
};
menu.sidebar.addEventListener('click', function(){menu.toggle();},false);