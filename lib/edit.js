
   function endEdit(button) {
      let id = button.parentElement.getAttribute('data-widget-id');
      let thisWidget = gid(id);
      widget.endEdit(thisWidget);

      hid(gid('toolbar'));
    }

    function cancelEdit(button) {
      let id = button.parentElement.getAttribute('data-widget-id');
      let thisWidget = gid(id);
      widget.endEdit(thisWidget);
      thisWidget.innerText = thisWidget.getAttribute('data-text');
      hid(gid('toolbar'));
    }

    function showEditBar(thisWidget) {

      let bar = gid("toolbar");
      bar.style.display = 'flex';

      bar.setAttribute('data-widget-id', thisWidget.id);

      bar.style.left = thisWidget.style.left;

      bar.style.zIndex = 10000;

      bar.style.top = parseInt(thisWidget.style.top) - 40 + "px";
      dragElement(bar);


      widget.select(thisWidget);
    

    }




 