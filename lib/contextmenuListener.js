 document.addEventListener('contextmenu', function (e) {
    if (surferMode == true) {

      return;
    }

    const globalContextMenu = document.getElementById('globalContextMenu');
    const contextMenu = document.getElementById('customContextMenu');

    if (e.target.id == "paste_help") {
      return; // Allow native context menu on paste button
    }
    if (e.target.id == "toolbar") {
      e.preventDefault(); // Prevent context menu on toolbar

      return;
    }
    let target = e.target.closest('.widget.user');
    if (target) {

      if (target.classList.contains('paste-enabled')) {
        return;
      }
      e.preventDefault();
      contextTarget = target;
      contextMenu.style.display = 'block';
      contextMenu.style.left = e.pageX + 'px';
      contextMenu.style.top = e.pageY + 'px';
      globalContextMenu.style.display = 'none';
    } else {
      e.preventDefault();
      contextMenu.style.display = 'none';
      contextTarget = null;
      globalContextMenu.style.display = 'block';
      globalContextMenu.style.left = e.pageX + 'px'
      globalContextMenu.style.top = e.pageY + 'px';

      //  myFrame.style.left = e.pageX  +   'px';
      // myFrame.style.top = e.pageY +   'px';

    }
  });
  // Hide global context menu on click elsewhere
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#globalContextMenu')) {
      globalContextMenu.style.display = 'none';
    }
  });