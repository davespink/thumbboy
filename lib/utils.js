
// the useful functions that were in the main drag

var globals = {

    currentFile: 'untitled.draft',
    maxZ: 1000,
    minZ: 1000,
    zStep: 4,
    widgetTarget: null,
    activeElement: null,
    coverPC: 0.3,
    resizeHoverTime: 2000,
    gridSize: 10
};

function $wt() {
    return window.top;
}

function currentPage() {
    return document.body;
}

function doSave() {
    const page = currentPage();
    if (page) {
        undoStack.push(page.innerHTML);
    }
    console.log("save " + undoStack.length);
}

function doUndo() {
    if (undoStack.length > 0) {
        const prevState = undoStack.pop();
        const page = currentPage();
        if (page && prevState) {
            page.innerHTML = prevState;
        }
    }
    console.log("undo " + undoStack.length);
}

function displace(el, options) {
    return window.displacejs(el, options);
}
function gid(id) {
    return document.getElementById(id);
}
function hid(el) {
    el.style.display = 'none';
}
function vid(el) {
    el.style.display = 'initial';
}
function tvid(el) {
    if (el.style.display == 'initial')
        hid(el)
    else vid(el);
}
function viz(el) {
    if (el.style.display == 'initial')
        return true; else return false;
}
function isa(el, c) {
    if (el == undefined || el == null || el == document)
        return false;
    if (el.classList.contains(c))
        return true; else return false;
}
function qsa(selector) {
    return document.querySelectorAll(selector);
}



//
//    the user messages
//

function tellUser(msg) {
    var opt = {
        leftStart: 'center', text: 'black', leftEnd: 'center', color: 'peachpuff', size: 'big', delay: '3s', canClose: true
    }
    opt.message = msg;

    showMessage(opt);
}
function warnUser(msg) {
    var opt = {
        leftStart: 'center', text: 'white', leftEnd: 'center', color: 'red', size: 'big', delay: '5s', canClose: true
    }
    opt.message = msg;

    showMessage(opt);
}
function askUser(msg, js) {
    // let a = "alert('this is it')";

    var opt = {
        action: js, type: 'yesno', leftStart: 'center', text: 'white', leftEnd: 'center', color: 'red', size: 'big', delay: '10s', canClose: true
    }
    opt.message = msg;

    showMessage(opt);
}
function hintUser(msg) {
    // let a = "alert('this is it')";

    var opt = {
        leftStart: 'center', text: 'white', leftEnd: 'center', color: 'green', size: 'big', delay: '5s', canClose: true
    }
    opt.message = msg;

    showMessage(opt);
}

// Used after a drag on a widget
function resetZOrder() {

    userWidgetList = [];

    // sort the list
    function compare(a, b) {
        if (a.style.zIndex < b.style.zIndex) {
            return -1;
        }
        if (a.style.zIndex > b.style.zIndex) {
            return 1;
        }
        return 0;
    }

    let q = currentPage().querySelectorAll(".widget.user");

    userWidgetList = Array.from(q);
    userWidgetList.sort(compare);


    let w = null;
    for (let i = 0; i < userWidgetList.length; i++) {
        w = userWidgetList[i];
        w.style.zIndex = 1000 + (i * globals.zStep);
    }

    if (w)
        globals.maxZ = parseInt(w.style.zIndex);

    console.log("maxZ " + w.style.zIndex);
}






function controlVideo(ev) {

    // do nothing unless in page_1

    if (ev.target.id == "youtubeglass") {
        ytw = ev.target.parentElement;
        if (isa(ytw, 'playingyoutube'))
            vidcontrol = 'stopVideo';
        else
            vidcontrol = 'playVideo';
    }
    else {
        ytw = ev.currentTarget.parentElement;

        let e = ev.target;
        if (ev.target.tagName == "I")
            e = ev.target.parentElement;

        vidcontrol = e.id;
    }

    if (ytw.parentElement.id != currentPage())
        return;

    let ifrm = ytw.getElementsByTagName("iframe")[0];
    let v = ifrm.contentWindow;

    v.postMessage('{"event":"command","func":"' + vidcontrol + '","args":""}', '*');
    ev.preventDefault();

    if (vidcontrol == 'playVideo')
        ytw.classList.add('playingyoutube');
    if (vidcontrol == 'stopVideo')
        ytw.classList.remove('playingyoutube');
}
//
// Show a grid to snap to
//
function showGrid(gridSize) {
    if (g = gid('grid')) {
        g.remove();
    }
    if (gridSize == 0) {
        const mobileFrame = gid('mobileFrame');
        if (mobileFrame)
            mobileFrame.style.display = 'none';
        return;
    }
    var w = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

    // var h = window.innerHeight
    //    || document.documentElement.clientHeight
    //   || document.body.clientHeight;
    var h = currentPage().clientHeight;
    globals.gridSize = gridSize;

    let s = `<div id='grid' style="position:absolute; left:0; top:0; z-index:0;"><svg  height="` + h + `" width="` + w + `">`;
    let x; let y;

    for (i = 0; i < w / gridSize; i++) {
        x = i * gridSize;
        s += `<line x1="${x}" y1="0" x2="${x}" y2="` + h + `" style="stroke:black;stroke-width:2" />`;

    }
    for (j = 0; j < h / gridSize; j++) {
        y = j * gridSize;
        s += `<line x1="0" y1="${y}" x2="` + w + `" y2="${y}" style="stroke:black;stroke-width:2" />`;
    }

    s += `</svg></div>`
    currentPage().insertAdjacentHTML('beforeend', s);
}
// Remove the grid
function hideGrid() {
    if (g = gid('grid'))
        g.remove();
}
// Snap!
function snapToGrid(bAll) {

    gridSize = globals.gridSize;

    let q = null;
    if (bAll)
        q = document.querySelectorAll(".user.widget");
    else
        q = document.querySelectorAll(".user.widget.selected");
    for (el of q) {

        let left = parseInt(el.style.left);
        let top = parseInt(el.style.top);

        left /= gridSize;
        left = Math.round(left);
        left *= gridSize;


        top /= gridSize;
        top = Math.round(top);
        top *= gridSize;


        el.style.top = top + "px";
        el.style.left = left + "px";



    }
}

function getScroll() {
    if (window.pageYOffset != undefined) {
        return [pageXOffset, pageYOffset];
    } else {
        var sx, sy, d = document,
            r = d.documentElement,
            b = d.body;
        sx = r.scrollLeft || b.scrollLeft || 0;
        sy = r.scrollTop || b.scrollTop || 0;
        return [sx, sy];
    }
}



// namespaced utils

const utils = {
    getContrastColor: function (el) {

        // convert to hex
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        function rgbToHex(r, g, b) {

            // we dont need no stinkin hash
            // return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
            return componentToHex(r) + componentToHex(g) + componentToHex(b);
        }

        function getContrastYIQ(hexcolor) {
            var r = parseInt(hexcolor.substr(0, 2), 16);
            var g = parseInt(hexcolor.substr(2, 2), 16);
            var b = parseInt(hexcolor.substr(4, 2), 16);
            var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            return (yiq >= 128) ? 'black' : 'white';
        }


        // arse with getting best color for button

        let csRGB = window.getComputedStyle(el).backgroundColor;

        csRGB = csRGB.replace('rgb(', '');

        let a = csRGB.split(',');

        let r = parseInt(a[0]);
        let g = parseInt(a[1]);
        let b = parseInt(a[2]);
        let hexVal = rgbToHex(r, g, b);

        return getContrastYIQ(hexVal); // N.B. This will NOT inluclde the hash # symbol

    },

    // Dragging stuff
    getOverlapArea: function (rect1, rect2) {
        x_overlap = Math.max(0, Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left));
        y_overlap = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top));

        return overlapArea = x_overlap * y_overlap;
    },
    escalate: function (el) {
        console.log("was " + el.style.zIndex);
        el.style.zIndex = parseInt(el.style.zIndex) + 1000;
        console.log("escalate: " + el.style.zIndex);
    },
    deEscalate: function (el) {
        el.style.zIndex = parseInt(el.style.zIndex) - 1000;
        console.log("deEscalate: " + el.style.zIndex);
    },
    // makeTop maybe defunkt
    makeTop: function (el) {
        if (el.style.zIndex == "")
            el.style.zIndex = 1;
        let z = parseInt(el.style.zIndex);

        if (z < globals.maxZ) {
            globals.maxZ++;
            el.style.zIndex = globals.maxZ;
        }
        globals.maxZ = el.style.zIndex;
        return globals.maxZ;
    }
    ,

    makeBottom: function (el) {
        if (el.style.zIndex == "")
            el.style.zIndex = 1;
        let z = parseInt(el.style.zIndex);

        if (z > globals.minZ) {
            globals.minZ--;
            el.style.zIndex = globals.minZ;
        }
        globals.minZ = el.style.zIndex;
        return globals.minZ;
    }
    ,

    // write to debug window
    dodebug: function (s) {

        let db = document.getElementById("debug")
        if (db) {
            db.innerHTML =
                db.innerHTML + "<br>" + Date.now() + "*" + s + "<br>";
            db.scrollTop = db.scrollHeight;
        }
    }
    ,
    getGuid: function () {
        // wait a few milisecs to return
        clock = Date.now();

        while (Date.now() - clock < 1) { }

        return Date.now().toString();

    }
    ,
    getDivTarget: function (el) {

        // document is null

        if (el == null) return null;
        // Walk up the tree until we get to a div
        // which fingers crossed is the widget
        let iJustInCase = 10;
        while (true) {
            if (el == null)
                return null;
            if (el.tagName == "DIV" && isa(el, "widget"))
                return el;
            if (el.tagName == "DIV" && isa(el, "page"))
                return el;
            else {
                iJustInCase--;
                if (iJustInCase < 0) {

                    return false;
                }
            }
            el = el.parentElement;
        }
    },
    formatDate: function (ms) {
        date = new Date(ms);
        var year = date.getFullYear(),
            month = date.getMonth() + 1, // months are zero indexed
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds(),
            hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
            minuteFormatted = minute < 10 ? "0" + minute : minute,
            morning = hour < 12 ? "am" : "pm";

        return month + "/" + day + "/" + year + " " + hourFormatted + ":" +
            minuteFormatted + morning;
    },

    // Convert image URL to base64 data URL
    urlToBase64: async function(url) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error converting URL to base64:', error);
            throw error;
        }
    }

}

// Make urlToBase64 available globally for backwards compatibility
async function urlToBase64(url) {
    return utils.urlToBase64(url);
}
