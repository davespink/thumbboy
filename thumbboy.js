javascript: (function () {
    let t = Array.from(document.querySelectorAll('article [data-testid="tweetText"]')).map(e => e.innerText),
        i = Array.from(document.querySelectorAll('img')).map(m => m.src),
        g = document.querySelector('.grok-response')?.innerText || '',
        d = { tweets: t.slice(0, 5), images: i.slice(0, 5), grok: g, url: window.location.href },
        v = document.createElement('div'); v.style.cssText = 'position:fixed;top:10px;right:10px;background:#fff;
    border: 1px solid #000; padding: 10px; z - index: 9999; box - shadow: 0 0 10px rgba(0, 0, 0, 0.5); font - family:Arial'; 
    v.innerHTML = `<p style="margin:0 0 5px">Snagged ${t.length} tweets, ${i.length} images</p><textarea id="c" 
        placeholder="Add a comment" style="width:200px;height:50px;margin-bottom:5px"></textarea><br><button id="u"
         style="margin-right:5px">Upload Here</button><button id="p">New Tab</button><button id="x" 
         style="margin-left:5px">Cancel</button>`; document.body.appendChild(v); document.getElementById('u').onclick = () => {

        d.comment = document.getElementById('c').value; fetch('https://not-reddit.com/api/submit',
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) }).then(() => { alert('Uploaded!'); document.body.removeChild(v); });
    }; document.getElementById('p').onclick = () => {
        d.comment = document.getElementById('c').value; let w = window.open('https://not-reddit.com/?data='
            + encodeURIComponent(JSON.stringify(d)), '_blank'); if (w) { document.body.removeChild(v); } else {

                if (confirm('Popup blocked! Allow popups for AIIndexer?')) {
                    w = window.open('http://localhost/incitio.com/not-reddit.com/index.html?data=' +
                        encodeURIComponent(JSON.stringify(d)), '_blank'); if (w) { document.body.removeChild(v); } else {
                            fetch('https://not-reddit.com',
                                {
                                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(d)
                                }).then(() => {
                                    alert('Uploaded silently!');
                                    document.body.removeChild(v);
                                });
                        }
                }

            }
    }; document.getElementById('x').onclick = () => { document.body.removeChild(v); };
})();