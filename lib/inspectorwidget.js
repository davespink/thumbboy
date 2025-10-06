   // Inspector widget logic: show widget id on hover
  function setupInspectorHover() {

    let mouseX = 0, mouseY = 0;
    // Listen for mousemove and update inspector with coordinates
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const inspector = document.getElementById('inspector_widgetcontent');
      if (inspector && inspector.innerHTML.includes('Mouse Position')) {
        // Only update mouse position if inspector is showing widget info
        const html = inspector.innerHTML.replace(/<div><b>Mouse Position:<\/b>.*?<\/div>/, `<div><b>Mouse Position:</b> (${mouseX}, ${mouseY})</div>`);
        inspector.innerHTML = html;
      }
    });

    function showInspectorHover(widget) {
      /*
            function validateInlineCSS(cssText) {
              const temp = document.createElement('div');
              temp.setAttribute('style', cssText);
              // The browser will ignore invalid properties
              return temp.style.cssText; // Returns only valid/parsed CSS
            }
      
      */

      const inspector = document.getElementById('inspector_widgetcontent');
      console.log('showInspectorHover ' + new Date().toLocaleTimeString());

      if (theWidgetID == widget.id || viz(gid('inspector_widget')) == false) {
        // If the inspector is already showing this widget, do nothing
        // or if the inspector is not visible
        console.log('showInspectorHover: same widget or inspector not visible');
        return;

      }
      theWidgetID = widget.id;

      const id = widget.id;
      const className = widget.className;
      const left = widget.style.left || widget.offsetLeft + 'px';
      const top = widget.style.top || widget.offsetTop + 'px';
      const width = widget.style.width || widget.offsetWidth + 'px';
      const height = widget.style.height || widget.offsetHeight + 'px';
      const zIndex = widget.style.zIndex || getComputedStyle(widget).zIndex;
      const position = widget.style.position || getComputedStyle(widget).position;
      const display = widget.style.display || getComputedStyle(widget).display;
      const border = getComputedStyle(widget).border;
      const background = getComputedStyle(widget).background;

      let attrs = [];
      for (let i = 0; i < widget.attributes.length; i++) {
        const attr = widget.attributes[i];
        attrs.push(`${attr.name}="${attr.value}"`);
      }
      // List inline styles
      const styleText = widget.getAttribute('style') || '';
      // Build info string
      // Build info string as HTML
      let html = '';
      html += `<div><b>Mouse Position:</b> (${mouseX}, ${mouseY})</div>`;
      html += `<div><b>id:</b> ${id}</div>`;
      html += `<div><b>class:</b> ${className}</div>`;
      html += `<div><b>position:</b> ${position}</div>`;
      html += `<div><b>left:</b> ${left}</div>`;
      html += `<div><b>top:</b> ${top}</div>`;
      html += `<div><b>width:</b> ${width}</div>`;
      html += `<div><b>height:</b> ${height}</div>`;
      html += `<div><b>z-index:</b> ${zIndex}</div>`;
      html += `<div><b>display:</b> ${display}</div>`;
      html += `<div><b>border:</b> ${border}</div>`;
      html += `<div><b>background:</b> ${background}</div>`;
      html += `<div><b>attributes:</b> ${attrs.join(', ')}</div>`;
      html += `<div><b>inline style:</b> ${styleText}</div>`;
      inspector.innerHTML = html;
      //  console.log(validateInlineCSS(styleText));


    }

    const inspector = document.getElementById('inspector_widgetcontent');
    const widgets = document.querySelectorAll('.widget');
    let clearInspectorTimer = null;
    widgets.forEach(widget => {
      widget.addEventListener('mouseenter', function () {


        setTimeout(() => showInspectorHover(widget), 1000);


      });




    });




  }

  setupInspectorHover();