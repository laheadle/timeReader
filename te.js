/*
 todo: search for dates. currentDate
 interface scroller: findPrev(function(para)), clear(), reset()
*/

(function(){
    var loaded = function() { 
	var TEXT = 3
	,HTML = 1

	var months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
	]

	// regexes of months
	var monthsRegs = []
	for (var i = 0;i < months.length;i++) {
	    monthsRegs[i] = new RegExp('\\b'+months[i]+'\\b')
	}

	var posMax = 0
	$('p').each(function() { $(this).attr('id', 'id'+posMax++) });

	var teStatus = $('<span>').css({id: 'teStatus', position: 'fixed', top: '0px', right: '5px', color: 'red', 'background-color': 'white'})
	$('body').append(teStatus)

	// Frame functions
	function getP(i) { return $('#id'+i)[0] }

	// transform the children of elt, passing in transform functions
	// for text nodes and other nodes
	function transformChildren(elt, funcs) {
            var htmls = []
            for (var i = 0;i < elt.childNodes.length;i++) {
		var child = elt.childNodes[i]
		if (child.nodeType == TEXT) {
                    htmls.push(funcs.text(child))
		}
		else {
                    htmls.push(funcs.other(child))
		}
            }

            return $(elt).html(htmls.join(''))
	}

	function convert(elt) {
            t = $(elt)
            if (t.attr('data-converted'))
		return t;
            else {
		t.attr('data-converted', 'y')
            }

            return transformChildren(elt, {
		text: function(node) {
                    return node.nodeValue.replace(/\b(\w+?)\b/g, '<span class="word">$1</span>')
		}, 
		other: function(child) {
                    return child.outerHTML
		}
            });
	}

	function unconvert(elt) {
            t = $(elt)
            if (!t.attr('data-converted'))
		return t;
            else {
		t.removeAttr('data-converted')
            }

            return transformChildren(elt, {
		text: function(node) { return node.nodeValue }, 
		other: function(child) {
                    // fixme depends on Lens
                    if($(child).hasClass('word') && !$(child).hasClass('bold')) {
			return child.innerText
                    }
                    else {
			return child.outerHTML
                    }
		}});
	}


	function Lens() {
            this.reset()
	}

	// set position
	Lens.prototype.setPos = function(i) {
            this.pos = i
            teStatus.text(this.pos)
	}


	Lens.prototype.clear = function () {
            if (this.found) {
		$(this.found).removeClass('selected')
		$(this.found).find('.bold').removeClass('boldRed')
            }
            this.found = null
	}

	Lens.prototype.reset = function () {
            this.setPos(-1)
            this.word = ''
            this.clear()
	}

	Lens.prototype.select = function () {
            if (!this.found) {
		this.setPos(-1)
		this.clear()
		return
            }
            convert(this.found)
            $(this.found).addClass('selected')
            this.found.scrollIntoView()
	}

	Lens.prototype.findPrev = function () {
            this.clear()

            for (var i = this.pos - 1;i >= 0;i--) {
		var thisp = getP(i)
		if (this.pMatches(thisp) && this.found === null) {
                    this.setPos(i)
                    this.found = thisp
                    break
		}
            }
            this.select()
	}

	Lens.prototype.findCurrent = function (target) {
            var idN = Number($(target).parent().attr('id').match(/id(\d+)/)[1])
            this.setPos(idN)
            this.found = getP(idN)
            this.select()
	}

	Lens.prototype.findNext = function () {
            this.clear()

            for (var i = 0;i < posMax;i++) {
		var thisp = getP(i)
		// fixme just start loop at this.pos
		if (this.pos < i && this.pMatches(thisp) && this.found === null) {
                    this.setPos(i)
                    this.found = thisp
                    break
		}
            }
            this.select()
	}

	function WordLens() {
	    Lens.call(this);
	}

	WordLens.prototype = new Lens()
	WordLens.prototype.constructor = WordLens

	WordLens.prototype.select = function() {
	    Lens.prototype.select.call(this);
            $(this.found).find(":contains('"+this.word+"')").addClass('bold').addClass('boldRed')
	}

	WordLens.prototype.pMatches = function (thisp) {
            return $(thisp).text().indexOf(this.word) != -1
	}


	WordLens.prototype.findClicked = function (event) {
            if (!$(event.target).hasClass('word'))
		return true

            this.reset()
            this.word = $(event.target).text()
            if (event.ctrlKey) {
		this.findCurrent(event.target)
            }
            else {
		this.findNext()
            }
	}

	function DateLens() {
	    Lens.call(this);
	}

	DateLens.prototype = new Lens()
	DateLens.prototype.constructor = DateLens

	DateLens.prototype.select = function() {
	    Lens.prototype.select.call(this);
            $(this.found).find('span.word').each(function() {
		if ($(this).text().match(/\d\d\d\d/)) {
                    $(this).addClass('bold').addClass('boldRed')
		}
		else {
                    for (var i = 0;i < months.length;i++) {
			if (months[i] == $(this).text()) {
                            $(this).addClass('bold').addClass('boldRed')
			}
                    }
		}
            })
		}

	DateLens.prototype.pMatches = function (thisp) {
            if($(thisp).text().match(/\d\d\d\d/)) {
		return true;
	    }
	    for(var i=0;i<months.length;i++) {
		if ($(thisp).text().match(monthsRegs[i])) {
		    return true
		}
	    }
	}


	DateLens.prototype.findClicked = function (event) {
            this.reset()
            if (event.ctrlKey) {
		this.findCurrent(event.target)
            }
            else {
		this.findNext()
            }
	}

	var dlens = new DateLens()
	var wlens = new WordLens()

	function dropLens() {
            $('p').off('mouseenter.te')
            $('p').off('mouseleave.te')
            $('p').off('click.te')
            $("body").off('keydown.te')
            $(document).off('keyup.te')
	}

	function switchLens() {
            useLens(lens === wlens ? dlens : wlens)
	}

	function useLens(l) {
            dropLens()
            lens = l

            $('p').on('mouseenter.te', function() {
		convert(this).click(function(event) { lens.findClicked(event) } );
            }).on('mouseleave.te', function() {
		if (this !== lens.found)
                    unconvert(this)
		$(this).off('click')
            });
            
            $("body").on('keydown.te', function(e){
		// left arrow
		if ((e.keyCode || e.which) == 37)
		{   
                    lens.findPrev()
		}
		// right arrow
		if ((e.keyCode || e.which) == 39)
		{
                    lens.findNext()
		}   
            });

            $(document).on('keyup.te', function(e) {

		if (e.keyCode == 27) {    // esc
                    switchLens() // lens.clear()
		}
            });
	}

	useLens(wlens)
    }

    var script = document.createElement('script');
    var head= document.getElementsByTagName('head')[0];
    script.src="//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"
    script.type= 'text/javascript';
    script.onload=loaded
    head.appendChild(script)
    
    var link = document.createElement('link');
    link.href="//stinkless.org/css/te.css"
    link.rel="stylesheet"
    link.type="text/css"
    head.appendChild(link)
    
})()

