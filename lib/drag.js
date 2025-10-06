// lib/drag.js
// Drag and resize. Based on sample code from W3Schools
// https://www.w3schools.com/howto/howto_js_draggable.asp
 
function undragElement(elmnt) {

  // Remove drag from header if present
  const header = document.getElementById(elmnt.id + "header");
  if (header && header._dragHandler) {
    header.onmousedown = null;
    delete header._dragHandler;
  }
  // Remove drag from element (event listener)
  if (elmnt._dragHandler) {
    elmnt.removeEventListener('mousedown', elmnt._dragHandler);
    delete elmnt._dragHandler;
  }
  // Remove drag from element (direct assignment)
  if (elmnt.onmousedown && elmnt.onmousedown._isDragHandler) {
    elmnt.onmousedown = null;
  }
}

function dragElement(elmnt) {
 
  const isWidget = elmnt.classList.contains("widget");

  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  // Create a handler and store it for later removal
  function dragMouseDown(e) {
    e = e || window.event;
    // Prevent drag if clicking the resize handle (bottom right corner)
    var rect = elmnt.getBoundingClientRect();
    if (e.clientX > rect.right - 22 && e.clientY > rect.bottom - 22) {
      return; // Let browser handle resize
    }
    e.preventDefault(); // Only prevent default if dragging
    if(isWidget) {
      widget.moveStart(elmnt);
    }
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }
  dragMouseDown._isDragHandler = true;

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    if (isWidget)
      widget.moveDo(elmnt, e.clientX, e.clientY)
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    if (isWidget)
      widget.moveEnd(elmnt);
  }

  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    const header = document.getElementById(elmnt.id + "header");
    header.onmousedown = dragMouseDown;
    header._dragHandler = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.addEventListener('mousedown', dragMouseDown);
    elmnt._dragHandler = dragMouseDown;
  }
}






