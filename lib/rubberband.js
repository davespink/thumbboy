
function setupRubberBand() {


    let rubberBand = null;
    let startX, startY;

    document.addEventListener('mousedown', function (e) {
         if (e.detail === 2) return;
        //  console.log('mousedown', e.target);
        //  console.log('parent', e.target.parentElement);
        if (!e.target.classList.contains('wallpaper')) return; // Only start on background
        startX = e.pageX;
        startY = e.pageY;

        if (rubberBand) { rubberBand.remove(); return; }

        rubberBand = document.createElement('div');
        rubberBand.style.position = 'absolute';
        rubberBand.style.border = '2px dashed #00f';
        rubberBand.style.background = 'rgba(0,0,255,0.1)';
        rubberBand.style.left = startX + 'px';
        rubberBand.style.top = startY + 'px';
        rubberBand.style.pointerEvents = 'none';
        document.body.appendChild(rubberBand);

        function onMouseMove(ev) {
            let x = Math.min(ev.pageX, startX);
            let y = Math.min(ev.pageY, startY);
            let w = Math.abs(ev.pageX - startX);
            let h = Math.abs(ev.pageY - startY);
            rubberBand.style.left = x + 'px';
            rubberBand.style.top = y + 'px';
            rubberBand.style.width = w + 'px';
            rubberBand.style.height = h + 'px';
        }

        function onMouseUp(ev) {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            if (!rubberBand) return;
            // Select widgets inside rubberBand
            let bandRect = rubberBand.getBoundingClientRect();
            document.querySelectorAll('.widget').forEach(widget => {
                let widgetRect = widget.getBoundingClientRect();
                if (
                    widgetRect.right > bandRect.left &&
                    widgetRect.left < bandRect.right &&
                    widgetRect.bottom > bandRect.top &&
                    widgetRect.top < bandRect.bottom
                ) {
                    widget.classList.add('selected');
                }
            });

            rubberBand.remove();
            rubberBand = null;
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

}


