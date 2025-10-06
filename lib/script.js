// Download the current page

function downloadData() {


  let q = currentPage().querySelectorAll('.widget');
  q.forEach(w => {
    w.removeAttribute('title');
  });

  const data = {
    html: currentPage().innerHTML,
   // html: document.getElementById('page_1').innerHTML,
    //  style: document.getElementById('page_1').getAttribute('style') || ''
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'thumble_page_data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Upload current page

function uploadData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = function (event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);
        document.getElementById('page_1').innerHTML = data.html;
        document.getElementById('page_1').setAttribute('style', data.style || '');
        dragEmAll();
        alert('Page data loaded successfully!');
      } catch (err) {
        alert('Error loading page data: ' + err.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}



function clearStorage() {
  if (confirm("Are you sure you want to clear all stored data? This action cannot be undone.")) {
    localStorage.clear();
    alert("All stored data has been cleared.");
  }
}

function handleImageDrop(event) {
  event.preventDefault();

  const files = event.dataTransfer.files;
  if (!files || files.length === 0) return;
  const file = files[0];
  if (!file.type.startsWith('image/')) {
    alert('Please drop an image file.');
    return;
  }
  let newWidget = widget.clone(document.getElementById("image_drop_template"));
  const x = event.clientX;
  const y = event.clientY;
  const img = document.createElement('img');
  const reader = new FileReader();
  reader.onload = function (e) {
    img.src = e.target.result; // base64 data URL
  };
  reader.readAsDataURL(file);

  img.onload = function () {
    let w = img.naturalWidth;
    let h = img.naturalHeight;
    const maxSize = 300;
    if (w > maxSize || h > maxSize) {
      const aspectRatio = w / h;
      if (w > h) {
        w = maxSize;
        h = Math.round(maxSize / aspectRatio);
      } else {
        h = maxSize;
        w = Math.round(maxSize * aspectRatio);
      }
      // Draw to canvas and convert to base64
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      img.src = canvas.toDataURL('image/png');
      img.style.width = '200px';
      img.style.height = 'auto';
      img.style.display = 'block';
    } else {
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.display = 'block';
    }
    newWidget.appendChild(img);
    newWidget.style.visibility = 'hidden';
    const widgetWidth = newWidget.offsetWidth;
    const widgetHeight = newWidget.offsetHeight;
    if (x != 0 && y != 0) {
      newWidget.style.left = (x - widgetWidth / 2) + "px";
      newWidget.style.top = (y - widgetHeight / 2) + "px";
    }
    newWidget.style.visibility = '';
    if (typeof dragElement === 'function') dragElement(newWidget);
    // Add resize handle
    //  const handles = addResizeHandles(newWidget);
    //  handleLogic(handles, newWidget, img, x, y);
  };
}



function pastePaper(event) {
  event.preventDefault();
  const clipboardData = event.clipboardData || window.clipboardData;
  const items = clipboardData.items;
  let handled = false;

  // First, check for image
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind === 'file' && item.type.indexOf('image') !== -1) {
      const blob = item.getAsFile();
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = () => {
          // Resize to max 300x300, maintain aspect ratio
          const maxDim = 300;
          let w = img.width;
          let h = img.height;
          const scale = Math.min(maxDim / w, maxDim / h, 1); // Don't upscale
          const newW = Math.round(w * scale);
          const newH = Math.round(h * scale);
          const canvas = document.createElement('canvas');
          canvas.width = newW;
          canvas.height = newH;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, newW, newH);
          const resizedDataUrl = canvas.toDataURL('image/png');

          let theDiv = document.querySelector('.primed');
          theDiv.classList.remove('primed');
          theDiv.innerText = '';
          let theImage = theDiv.querySelector('img');
          if (theImage) {
            theImage.src = resizedDataUrl; // Replace the image in the widget
          } else {
            const newImg = document.createElement('img');
            newImg.src = resizedDataUrl;
            newImg.style.width = '100%';
            newImg.style.height = '100%';
            newImg.style.display = 'block';
            theDiv.appendChild(newImg); // Add new image to widget
          }
          hid(pasteBox);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(blob);
      handled = true;
      break;
    }
  }

  // If not handled as image, check for YouTube iframe or URL
  if (!handled) {
    const text = clipboardData.getData('text');
    let theDiv = document.querySelector('.primed');
    if (!theDiv) return;
    theDiv.classList.remove('primed');
    theDiv.innerText = '';

    // If iframe HTML
    if (text.includes('<iframe') && text.includes('youtube.com/embed')) {
      theDiv.innerHTML = `<div class='iframe-wrapper'>${text}</div>`;
      hid(pasteBox);
      dragElement(theDiv);
      return;
    }
    // If YouTube watch URL
    const ytMatch = text.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]+)/);
    if (ytMatch) {
      const videoId = ytMatch[1];
      theDiv.innerHTML = `<div class='iframe-wrapper'><iframe width="320" height="180" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
      hid(pasteBox);
      dragElement(theDiv);
      return;
    }
    // Otherwise, just paste as text
    theDiv.innerText = text;
    hid(pasteBox);
    dragElement(theDiv);
  }
}


// --- YouTube video control functions ---
// Usage: startYouTubeVideo(iframeElement) or stopYouTubeVideo(iframeElement)
function startYouTubeVideo(iframe) {
  if (!iframe || !iframe.src) return;
  // Ensure iframe has an ID
  if (!iframe.id) iframe.id = 'ytplayer_' + Math.floor(Math.random() * 1000000);
  // Load API if not loaded
  if (!window.YT || !window.YT.Player) {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  }
  // Wait for API
  function createPlayer() {
    if (window.YT && window.YT.Player) {
      var player = new YT.Player(iframe.id, {
        events: {
          'onReady': function (e) { e.target.playVideo(); }
        }
      });
      iframe._ytPlayer = player;
    } else {
      setTimeout(createPlayer, 200);
    }
  }
  createPlayer();
}

function stopYouTubeVideo(iframe) {
  if (iframe && iframe._ytPlayer && typeof iframe._ytPlayer.pauseVideo === 'function') {
    iframe._ytPlayer.pauseVideo();
  }
}




























