
// Page Size
function pageSize() {
  const page = currentPage();
  if (!page) {
    alert('No page found!');
    return;
  }

  const wallpaper = page.querySelector('.wallpaper');
  const height = prompt('Enter page height (vh):', '100');
  if (height) {
    page.style.height = height + 'vh';
    wallpaper.style.height = height + 'vh';
    page.style.width = '100vw';
    wallpaper.style.width = '100vw';
  }
}


// Store current page under a user-supplied name
async function storeNamedPage() {

  // make sure the controlpanel is hidden
  //hid(gid('controlPanel'));
  hid(gid('styler'));

  function pageSize() {
    const page = currentPage();
    if (!page) {
      alert('No page found!');
      return;
    }
    const height = prompt('Enter page height (vh):', '600');
    if (height) {
      page.style.height = height + 'vh';
    }
  }



  const name = document.getElementById('pageNameInput').value.trim();
  if (!name) {
    alert('Please enter a page name.');
    return;
  }
  const page = currentPage();
  if (page) {
    const data = {
      html: page.innerHTML
      //      style: page.getAttribute('style') || ''
    };
    await crud.create('thumble_page_' + name, JSON.stringify(data));
    alert('Page "' + name + '" stored!');
    renderPreviews();
  }
}




// Load a page by name
async function loadPageByName(name) {


  document.body.style.cursor = "wait"; // Show hourglass/busy cursor
  // ...do work...


  hid(globalContextMenu);


  const raw = await crud.retrieve('thumble_page_' + name);
  document.body.style.cursor = "default"; // Restore normal cursor

 
  window.scrollTo(0, 0); // Scroll to top after loading a page

  if (raw !== null) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      // fallback for old format
      data = { html: raw, style: '' };
    }

    currentPage().innerHTML = data.html;

    dragEmAll();
    document.body.style.cursor = "default"; // Restore normal cursor
    currentPageName = name;
    
   // alert('Page "' + currentPageName + '" loaded!');


    gid("pageNameInput").value = currentPageName;


  } else {
    alert('No stored page found for "' + name + '".');
  }


}

// Delete a page by name
async function deletePageByName(name) {
  if (confirm('Delete page "' + name + '"?')) {
    await crud.delete('thumble_page_' + name);
    renderPreviews();
  }
}



function publishPage() {
  const page = currentPage();
  if (!page) {
    alert('No page found!');
    return;
  }
  // Create a minimal HTML document with the contents of page_1
  const htmlContent = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset='UTF-8'>\n<title>Published Page</title>\n</head>\n
  <body>\n${page.innerHTML}\n</body>\n</html>`;
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'thumble_page.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


function publishPage() {
  const page = currentPage();
  if (!page) {
    alert('No page found!');
    return;
  }
  // Create a minimal HTML document with the contents of page_1
  const htmlContent = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset='UTF-8'>\n<title>Published Page</title>\n</head>\n<body>\n${page.innerHTML}\n</body>\n</html>`;
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'thumble_page.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}



function publishMobile() {
  const mf = gid('mobileFrame');
  if (!mf) {
    alert('No mobile frame found. Please add one first.');
    return;
  }

  // Clone the mobile frame
  const mfClone = mf.cloneNode(false); // shallow clone, no children

  // Find all widgets to publish (those with class 'flea')
  const fleas = Array.from(document.querySelectorAll('.flea'));

  // Clone and append each flea to the mobile frame clone
  fleas.forEach(flea => {
    const fleaClone = flea.cloneNode(true);
    // Remove any IDs to avoid duplicates
    fleaClone.removeAttribute('id');
    mfClone.appendChild(fleaClone);
  });

  // Optional: Remove the id from the frame for the published version
  mfClone.removeAttribute('id');

  // Build minimal HTML
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset='UTF-8'>
  <title>Published Mobile Page</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin:0; padding:0; background:#eee; }
    .mobile-frame { position:relative; margin:0 auto; background:#fff; }
    .flea { position:absolute; }
  </style>
</head>
<body>
  ${mfClone.outerHTML}
</body>
</html>
  `.trim();

  // Download as HTML file
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'thumble_mobile_page.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}



function prepareMobileFrame() {
  const mf = gid('mobileFrame');

  if (!mf) {
    alert('No mobile frame found. Please add one first.');
    return;
  }

  function shiftWidget(w, left, top) {
    let newLeft = parseInt(w.style.left);
    newLeft -= left;
    let newTop = parseInt(w.style.top);
    newTop -= top;
    w.style.left = newLeft + 'px';
    w.style.top = newTop + 'px';
  }

  function isFlea(insect) {

    let dog = mf;
    let dtop = dog.offsetTop;
    let dleft = dog.offsetLeft;
    let dbottom = dtop + dog.clientHeight;
    let dright = dleft + dog.clientWidth;

    // tis a flea if it overlaps me
    // i cannot be my own flea

    let itop = parseInt(insect.style.top);
    let ibottom = itop + insect.clientHeight;
    let ileft = parseInt(insect.style.left);
    let iright = ileft + insect.clientWidth;

    // Find out if this widget overlaps with the one being moved
    let rect1 = { top: dtop, left: dleft, bottom: dbottom, right: dright };
    let rect2 = { top: itop, left: ileft, bottom: ibottom, right: iright };

    let area = utils.getOverlapArea(rect1, rect2)
    let arearect2 = Math.abs(rect2.bottom - rect2.top)
      * Math.abs(rect2.right - rect2.left);
    //   utils.dodebug(e.id + " " + area / arearect2);

    if (area / arearect2 > globals.coverPC && insect.style.zIndex > dog.style.zIndex) {

      return true;

    } else return false;

  }

  mfLeft = mf.offsetLeft;
  mfTop = mf.offsetTop;

  let q = currentPage().querySelectorAll('.widget');

  q.forEach(w => {
    if (isFlea(w)) {
      w.classList.add('flea');
      shiftWidget(w, mfLeft, mfTop);
    }
  });

  shiftWidget(mf, mfLeft, mfTop);


  publishMobile();
}