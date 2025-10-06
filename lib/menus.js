
function linkElement(el) {

  el.style.resize = 'none'; // Disable resize handle
  undragElement(el);
  el.onclick = function (event) {
    event.preventDefault();
    let link = event.currentTarget.getAttribute("data-link");
    if (!link) return; // Don't follow link if in edit mode

    if (link.startsWith('http') || link.startsWith('https')) { }
    else {

      link = 'http://' + link;

    }

    // if (el.classList.contains('inedit')) return; // Don't follow link if in edit mode

    if (el.classList.contains('link-active') && link)
      window.open(link, '_blank');

  }

  //let el = event.currentTarget;
  //let link = el.getAttribute("data-link");

  // if (el.classList.contains('inedit')) return; // Don't follow link if in edit mode
  //if (!link) return; // Don't follow link if in edit mode

  //window.open(link, '_blank');

}


function onContextMenuAction(e) {
  if (!contextTarget) {
    return;
  }

  let stylerIFrame = gid('stylerIFrame');
  let styler = gid('styler');

  let action = e.target.getAttribute('data-action');

  let targetId = contextTarget.id; // Capture before nulling
  widget.select(contextTarget); // Select the target widget <---------!

  console.log(contextTarget.id);


  if (action === 'clone') {

    widget.cloneAll();

  }

  // contextTarget is the selected widget

  else if (action === 'select') {
    widget.select(contextTarget);
  }






  else if (action === 'remove-link') {
        contextTarget.setAttribute("data-link", "");
    alert('removed');
  }
  else if (action === 'activate-link') {

    contextTarget.classList.add('link-active');
    undragElement(contextTarget);

    contextTarget.style.resize = 'none'; // Disable resize handle
    alert('activated');
  }
  else if (action === 'deactivate-link') {
    contextTarget.classList.remove('link-active');
    dragElement(contextTarget);
    contextTarget.style.resize = 'both'; 
    alert('deactivated');
  }


  else if (action === 'set-link') {

    // use a prompt to set the link
    let link = prompt("Enter the URL for this link:", contextTarget.getAttribute("data-link") || "http://");
    if (link !== null) {
      contextTarget.setAttribute("data-link", link);

    }
    contextTarget.setAttribute("data-link", link);



    // undragElement(contextTarget);
    linkElement(contextTarget);






  }

  else if (action === 'unlink') {
    contextTarget.setAttribute("data-link", "");
    alert("link removed");
    dragElement(contextTarget);;
  }

  else if (action === 'html') {

    alert(contextTarget.innerHTML);

  }



  else if (action === 'start-edit') {
    widget.startEdit(contextTarget);
    contextTarget.setAttribute("contenteditable", "true");
    contextTarget.setAttribute("data-text", contextTarget.innerText);
    contextTarget.classList.add('inedit');
    showEditBar(contextTarget);
  } else if (action === 'end-edit') {
    widget.endEdit(contextTarget);
    contextTarget.innerText = contextTarget.getAttribute("data-text");
  }


  else if (action === 'pasteImage') {

    let pasteBox = gid('pasteBox');
    pasteBox.style.display = 'block';
    pasteBox.style.left = contextTarget.offsetLeft + contextTarget.offsetWidth / 2 - pasteBox.offsetWidth / 2 + 'px';
    pasteBox.style.top = contextTarget.offsetTop + contextTarget.offsetHeight / 2 - pasteBox.offsetHeight / 2 + 'px';
    contextTarget.classList.add('primed');
  }
  else if (action === 'snap') {

    snapToGrid();


 
  }

  else if (action === 'copy') {
    widget.copy(contextTarget);
    gid("clipboard").click();
  }
  else if (action === 'paste') {
    widget.paste(contextTarget);
  }
  else if (action === 'delete') {
    widget.deleteAll();
    //    document.body.click(); // Deselect
  } else if (action === 'style-color') {

    vid(styler)
    stylerIFrame.setAttribute('src', "controls/stylerpopupColor.html?context=backgroundColor");
    positionStyler(styler);

  } else if (action === 'style-border') {

    stylerIFrame.setAttribute('src', "controls/stylerpopupBorder.html");
    positionStyler(styler);
    vid(styler)
  }
  else if (action === 'style-transform') {
    stylerIFrame.setAttribute('src', "controls/stylerpopupTransform.html");
    positionStyler(styler);
    vid(styler)
  }
  else if (action === 'style-border-color') {
    stylerIFrame.setAttribute('src', "controls/stylerpopupColor.html?context=borderColor");
    positionStyler(styler);
    vid(styler)
  }
  else if (action === 'style-font') {
    stylerIFrame.setAttribute('src', "controls/stylerpopupFonts.html");
    // positionStyler(styler);
    vid(styler)
  }


  // Select



  else if (action === 'select-this') {
    widget.unselectAll();
    widget.select(contextTarget);
  }
  else if (action === 'select-add') {
    widget.select(contextTarget);
  }
  else if (action === 'select-all') {
    widget.selectAll();
  }


  else if (action === 'unselect-this') {
    widget.unselect(contextTarget);
  }
  else if (action === 'unselect-all') {
    widget.unselectAll();
  }

  // Align
  else if (action === 'align-top') {
    alignTopmost();
  }
  else if (action === 'align-bottom') {
    alignBottommost();
  }
  else if (action === 'align-left') {
    alignLeftmost();
  }
  else if (action === 'align-right') {
    alignRightmost();
  }
  else if (action === 'make-narrow') {
    setAllToSmallestWidth();
  }
  else if (action === 'make-wide') {
    setAllToLargestWidth();
  }
  else if (action === 'make-short') {
    setAllToSmallestHeight();
  }
  else if (action === 'make-tall') {
    setAllToLargestHeight();
  }
  let contextMenu = document.getElementById('customContextMenu');
  contextMenu.style.display = 'none';
  contextTarget = null;
  hideStyleSubmenu();
}













////////////////////////////////////////////////////////////////////////////////////////////////
//
//      Align, or resize widgets
//
////////////////////////////////////////////////////////////////////////////////////////////////
//

function alignTopmost() {
  let q = document.querySelectorAll('.widget.user.selected');
  let minTop = Math.min(...Array.from(q).map(el => parseInt(el.style.top) || el.offsetTop));
  q.forEach(el => { el.style.top = minTop + 'px'; });
}

function alignLeftmost() {
  let q = document.querySelectorAll('.widget.user.selected');
  let minLeft = Math.min(...Array.from(q).map(el => parseInt(el.style.left) || el.offsetLeft));
  q.forEach(el => { el.style.left = minLeft + 'px'; });
}

function alignBottommost() {
  let q = document.querySelectorAll('.widget.user.selected');
  let parent = q[0]?.parentElement;
  let parentHeight = parent ? parent.offsetHeight : window.innerHeight;
  let maxBottom = Math.max(...Array.from(q).map(el => {
    let top = parseInt(el.style.top) || el.offsetTop;
    let height = el.offsetHeight;
    return top + height;
  }));
  let offset = parentHeight - maxBottom;
  q.forEach(el => {
    let height = el.offsetHeight;
    el.style.top = (parentHeight - height - offset) + 'px';
  });
}

function alignRightmost() {
  let q = document.querySelectorAll('.widget.user.selected');
  let parent = q[0]?.parentElement;
  let parentWidth = parent ? parent.offsetWidth : window.innerWidth;
  let maxRight = Math.max(...Array.from(q).map(el => {
    let left = parseInt(el.style.left) || el.offsetLeft;
    let width = el.offsetWidth;
    return left + width;
  }));
  let offset = parentWidth - maxRight;
  q.forEach(el => {
    let width = el.offsetWidth;
    el.style.left = (parentWidth - width - offset) + 'px';
  });
}

function setAllToSmallestWidth() {
  let q = document.querySelectorAll('.widget.user.selected');
  let minWidth = Math.min(...Array.from(q).map(el => el.offsetWidth));
  q.forEach(el => { el.style.width = minWidth + 'px'; });
}

function setAllToLargestWidth() {
  let q = document.querySelectorAll('.widget.user.selected');
  let maxWidth = Math.max(...Array.from(q).map(el => el.offsetWidth));
  q.forEach(el => { el.style.width = maxWidth + 'px'; });
}

function setAllToSmallestHeight() {
  let q = document.querySelectorAll('.widget.user.selected');
  let minHeight = Math.min(...Array.from(q).map(el => el.offsetHeight));
  q.forEach(el => { el.style.height = minHeight + 'px'; });
}

function setAllToLargestHeight() {
  let q = document.querySelectorAll('.widget.user.selected');
  let maxHeight = Math.max(...Array.from(q).map(el => el.offsetHeight));
  q.forEach(el => { el.style.height = maxHeight + 'px'; });
}







/// Another set of funcs ////


// widget context submenus

function showStyleSubmenu() {
  let submenu = document.getElementById('styleSubmenu');
  if (submenu) submenu.style.display = 'block';
}

function hideStyleSubmenu() {
  let submenu = document.getElementById('styleSubmenu');
  if (submenu) submenu.style.display = 'none';
}


function showSelectSubmenu() {
  let submenu = document.getElementById('selectSubmenu');
  if (submenu) submenu.style.display = 'block';
}

function hideSelectSubmenu() {
  let submenu = document.getElementById('selectSubmenu');
  if (submenu) submenu.style.display = 'none';
}


function showLinkSubmenu() {
  let submenu = document.getElementById('linkSubmenu');
  if (submenu) submenu.style.display = 'block';
}

function hideLinkSubmenu() {
  let submenu = document.getElementById('linkSubmenu');
  if (submenu) submenu.style.display = 'none';
}

function showUnselectSubmenu() {
  let submenu = document.getElementById('unselectSubmenu');
  if (submenu) submenu.style.display = 'block';
}

function hideUnselectSubmenu() {
  let submenu = document.getElementById('unselectSubmenu');
  if (submenu) submenu.style.display = 'none';
}

function showAlignSubmenu(e) {
  let submenu = document.getElementById('alignSubmenu');
  submenu.style.display = 'block';
}
function hideAlignSubmenu() {
  let submenu = document.getElementById('alignSubmenu');
  if (submenu) submenu.style.display = 'none';
}

function showSizeSubmenu(e) {
  let submenu = document.getElementById('sizeSubmenu');
  submenu.style.display = 'block';
}
function hideSizeSubmenu() {
  let submenu = document.getElementById('sizeSubmenu');
  if (submenu) submenu.style.display = 'none';
}



