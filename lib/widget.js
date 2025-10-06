
const widget = {
    callback: null,
    setCallback: function (f) {
        this.callback = f;
    },
    html: function (el) {

        alert(el.innerHTML);
    },
    clear: function (el) {

        el.innerHTML = "";
    },
    is: function (el, type) {
        return el.classList.contains(type);
    },
    select: function (el) {
        //   if (!isa(el, 'user')) return;
        el.classList.add('selected');

    },
    unselect: function (el) {
        if (!el || el == undefined || el == null) return;

        el.classList.remove('selected');
        this.thaw(el);

        if (globals.widgetTarget == el)
            globals.widgetTarget = null;
    },
    selectAll: function () {
        let q = page_1.querySelectorAll(".widget.user");
        for (i = 0; i < q.length; i++) {
            this.select(q[i]);
        }
    },
    unselectAll: function () {
        let q = page_1.querySelectorAll(".widget.user");
        for (i = 0; i < q.length; i++) {
            this.unselect(q[i]);
        }
    },
    endAnimateAll: function () {
        let q = allPages.querySelectorAll(".user");
        for (let i = 0; i < q.length; i++)
            q[i].classList.remove('animate-go');
    },

    // nardly used now always copy
    create: function (type) {
        let template = gid(type);
        let n = widget.copy(template);
        return n;
    },



    copy: function (el, noinsert) {

        if (!isa(el, 'widget')) return null;
        // clone and decorate

        let n = widget.clone(el, true);

        n.classList.remove('selected');

        n.style.left = "0px";

        let nWidth = (el.getBoundingClientRect().right) - (el.getBoundingClientRect().left);
        let nHeight = (el.getBoundingClientRect().bottom) - (el.getBoundingClientRect().top);


        undragElement(n); // dont drag the copy

        // this.clipboardFix(n);

        n.setAttribute("onclick", "doClone(this)");
        n.setAttribute("onContextMenu", "doClipContextMenu(this,event)");

        n.style.display = "inline-block";
        n.style.position = "static";
        //   n.removeEventListener('mousedown', null);

        n.style.resize = 'none';
        n.style.margin = "20px";



        let doc = document.getElementById('clipboard');

        const myframe = doc.querySelector('iframe');

        const iframeClips = myframe.contentWindow.document.querySelector('.container');

        iframeClips.insertAdjacentElement("beforeend", n);

//widget.clipboardFix(n);

    },

    clipboardFix: function (el) {
        //    alert("fix" + el);
        el.oncontextmenu = function (e) {

            // create a function in widget that sets up the context menu
            // widget.setupContextMenu(n); then on page load call it for all widgets
            // that are in the clipboard
            // and also call it when a new widget is added to the clipboard ( which I already do )
            // this will allow context menu on clipped items

            e.preventDefault();

            c = document.getElementById('clipContextMenu');
            contextTarget = e.target;



            gid('clipContextMenu').style.display = 'block';
            gid('clipContextMenu').style.left = e.pageX + 'px';
            gid('clipContextMenu').style.top = e.pageY + 'px';


        };

    },

    paste: function (el, noinsert) {

        //if (!isa(el, 'widget')) return null;
        // clone and decorate

        let n = widget.clone(el, true);

        n.classList.remove('selected');

        n.style.left = "110px";
        n.style.top = "100px";
        n.style.position = "absolute";
        n.style.zIndex = 10000;


        /*
        width = parseInt(n.style.width);
        height = parseInt(n.style.height);

        width *= 2;
        height *= 2;

        n.style.width = Math.round(width) + "px";
        n.style.height = Math.round(height) + "px"; 
        */

        // n.style.transform = "scale(1.0)";


        currentPage().insertAdjacentElement("beforeend", n);

        detectResize(n);

        resetZOrder();


    },
    // clone will drag all elements
    clone: function (el, noinsert, nodrag) {
        // doSave();

        //  el.classList.remove('selected');
        let n = el.cloneNode(true);
        n.id = utils.getGuid();

        n.style.display = "initial";
        n.classList.remove('template');
        n.classList.add('user');
        n.classList.add('widget');

        // Ensure resizeable-div class and styles for browser resize handle
        n.classList.add('resizeable-div');
        n.style.resize = 'both';
        n.style.overflow = 'hidden';

        let top = parseInt(n.style.top);
        let left = parseInt(n.style.left);

        n.style.top = top + 20 + "px";
        n.style.left = left + 20 + "px";

        n.style.zIndex = 100;
        n.style.margin = 0;

        if (!noinsert) {
            currentPage().insertAdjacentElement("beforeend", n);
            utils.makeTop(n);

        }

   //     if (!nodrag) {
    //        dragElement(n);
     //       detectResize(n);
    //    }

       // utils.escalate(n);

        return n;
    },

    cloneAll: function () {
        let q = currentPage().querySelectorAll(".selected");
        q.forEach((item) => {
            widget.clone(item, false, false);
        });

    },


    copyAll: function (el) {
        let a = widget.allWidgets();
        if (a.length == 0) tellUser('Select at least one widget');
        else {
            saveUndo();
            tellUser('Copied ' + a.length + ' items');
            a.forEach((el) => { widget.copy(el); });
        }
    },



    startEdit: function (el) {


        el.classList.add('inedit');
        undragElement(el);
        console.log('start edit' + el.id);

        // allow C for clone
        //    el.addEventListener('keydown', function (e) {
        //      e.stopPropagation();
        //   });

    },

    endEdit: function (el) {
        el.classList.remove('inedit');
        gid('toolbar').style.display = 'none';
        dragElement(el);
        console.log('end edit' + el.id);
    },

    myVar: null,
    leftMouseButtonOnlyDown: false,

    initialize: function (n) {

        n.addEventListener('dblclick',
            function (e) {
                t = e.target;
                t = n;

                widget.unselectAll();
                widget.edit(t);
                widget.freeze(t);
            });


        initOnHover(n, globals.resizeHoverTime);
        // listener in dispatch

        const options = {
            highlightInputs: true,
            constrain: false,

            ignoreFn: function (e) {
                let el = utils.getDivTarget(e.target);

                let flag = false;
                if (el.classList.contains("frozen"))
                    flag = true;

                if (el.classList.contains("locked"))
                    flag = true;

                return flag;
            },
            customMove: function (el, newX, newY) {
                widget.move(el, newY, newX);
            }
            ,
            onMouseDown: function (el, ev) {
                ev.screenX = ev.screenX;
                ev.screenY = ev.screenY;

            }
            ,
            onMouseUp: function (el, ev) {
                widget.moveEnd(el);
            }

        };
        displace(n, options); // make draggable   

    },

    moveStart: function (el) {
        if (this.callback) this.callback(el, 'moveStart');

        // doSave();

        let z = parseInt(el.style.zIndex);
        el.setAttribute("title", z);

        elleft = el.offsetLeft;
        eltop = el.offsetTop;

        let elbottom = eltop + el.clientHeight;
        let elright = elleft + el.clientWidth;

        function addFleas(dog) {

            function isFlea(insect) {

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
                    // Lets drag this one along for the ride
                    let x = insect.offsetLeft - elleft;
                    let y = insect.offsetTop - eltop;
                    insect.setAttribute("data_drag_x", x);
                    insect.setAttribute("data_drag_y", y);

                    return true;

                } else return false;

            }


            let q = currentPage().querySelectorAll(".user");
            q.forEach((item) => {
                if (isFlea(item)) {
                    item.classList.add('mover');
                }

            });

        }
        addFleas(el);

        utils.makeTop(el);

        let q = currentPage().querySelectorAll(".mover");
        q.forEach((item) => {
            utils.escalate(item);
        });


    },




    moveDo: function (el, left, top) {

        let eltop = el.offsetTop;
        let elleft = el.offsetLeft;

        // if not a mover then dont do anything

        w = currentPage().querySelectorAll(".mover");
        w.forEach((item) => {

            let itemTop = parseInt(item.getAttribute("data_drag_y")) + eltop;
            let itemLeft = parseInt(item.getAttribute("data_drag_x")) + elleft;


            item.style.top = itemTop + "px";
            item.style.left = itemLeft + "px";
        });

        if (this.callback) this.callback(el, 'moveDo');
    },


    moveEnd: function (el) {
        //   console.log('move end');
        let q = currentPage().querySelectorAll(".mover");
        q.forEach((item) => {
            item.classList.remove('mover');
        });

        q = currentPage().querySelectorAll(".mover");
        q.forEach((item) => {
            utils.deEscalate(item);
        });


        resetZOrder(); // ????
        //   doSave();
  //    el.removeAttribute("title");

        if (this.callback) this.callback(el, 'moveEnd');

    }
    ,
    lock: function (el) {
        el.classList.add("locked");
    }
    ,
    unlock: function (el) {
        el.classList.remove("locked");
    }
    ,
    freeze: function (el) {
        el.classList.add("frozen");
    }
    ,
    thaw: function (el) {
        //   if (!el.classList.contains("nodrag"))
        el.classList.remove("frozen");
    },
    thawAll: function () {

        let q = allPages.querySelectorAll(".widget");
        for (i = 0; i < q.length; i++) {
            this.thaw(q[i]);
        }
    },

    endedit: function (el) {

        // dont end it if not in it
        if (!isa(el, 'inedit'))
            return;

        el.classList.remove("inedit");
        el.setAttribute("contenteditable", "false");
        el.classList.remove("inedit");

        hid(gid('toolbar')); // added for thumble
    },

    endEditAll: function () {
        let q = currentPage().querySelectorAll(".widget");
        for (i = 0; i < q.length; i++) {
            this.endedit(q[i]);
        }
    },
    allWidgets: function () {
        return currentPage().querySelectorAll('.selected');
    },

    delete: function (el) {
        // doSave(); // delete all always!
        el.remove();

    },
    deleteAll: function (el) {

        let q = widget.allWidgets();
        if (q.length == 0) {
            tellUser('Select at least one widget');
            return;
        }
        else {
            doSave(); // maybe move the save to where it is actioned ?
            alert('Deleted ' + q.length + ' items');
            q.forEach((item) => { widget.delete(item); });
        }
    }
    ,
    ///  not sure this stuff is ever used
    restore: function (el) {
        //   let n = currentPage().getElementById("page_1");
        //  widget.movePage(el, n);
        //    widgettoolbar.hide();
        // sendData(page_1, "H");
    }

};

