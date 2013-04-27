/*
 todo: search for dates. currentDate
 interface scroller: findPrev(function(para)), convert(para), unconvert(para), clear(), reset()
*/

$(function() {
    var TEXT = 3
    ,HTML = 1
    var posMax = 0
    $('p').each(function() { $(this).attr('id', 'id'+posMax++) });

    var teStatus = $('<span>').css({id: 'teStatus', position: 'fixed', top: '0px', right: '5px', color: 'red', 'background-color': 'white'})
    $('body').append(teStatus)

    reset()
    var pos, found, word

    function convert(tt) {
        t = $(tt)
        if (t.attr('data-converted'))
            return t;
        else {
            t.attr('data-converted', 'y')
        }

        var htmls = []
        for (var i = 0;i < tt.childNodes.length;i++) {
            if (tt.childNodes[i].nodeType == TEXT) {
                htmls.push(tt.childNodes[i].nodeValue.replace(/\b(\w+?)\b/g, '<span class="word">$1</span>'))
            }
            else {
                htmls.push(tt.childNodes[i].outerHTML)
            }
        }

        return t.html(htmls.join(''))
    }

    function unconvert(elt) {
        t = $(elt)
        if (!t.attr('data-converted'))
            return t;
        else {
            t.removeAttr('data-converted')
        }

        var htmls = []
        for (var i = 0;i < elt.childNodes.length;i++) {
            if (elt.childNodes[i].nodeType == TEXT) {
                htmls.push(elt.childNodes[i].nodeValue)
            }
            else if($(elt.childNodes[i]).hasClass('word') && !$(elt.childNodes[i]).hasClass('bold')) {
                htmls.push(elt.childNodes[i].innerText)
            }
            else {
                htmls.push(elt.childNodes[i].outerHTML)
            }
        }

        return $(elt).html(htmls.join(''))
    }

    function clear() {
        if (found) {
            $(found).removeClass('selected')
            $(found).find('.bold').removeClass('boldRed')
        }
        found = null
    }

    function reset() {
        setPos(-1)
        word = ''
        clear()
    }

    function select() {
        if (!found) {
            setPos(-1)
            clear()
            return
        }
        convert(found)
        $(found).addClass('selected')
        $(found).find(":contains('"+word+"')").addClass('bold').addClass('boldRed')
        found.scrollIntoView()
    }

    function getP(i) { return $('#id'+i)[0] }


    function findPrev() {
        clear()

        for (var i = pos - 1;i >= 0;i--) {
            var thisp = getP(i)
            if ($(thisp).text().indexOf(word) != -1 && found === null) {
                setPos(i)
                found = thisp
                break
            }
        }
        select()
    }

    function setPos(i) {
        pos = i
        teStatus.text(pos)
    }

    function findNext() {
        clear()

        for (var i = 0;i < posMax;i++) {
            var thisp = getP(i)
            if (pos < i && $(thisp).text().indexOf(word) != -1 && found === null) {
                setPos(i)
                found = thisp
                break
            }
        }
        select()
    }

    function findCurrent(target) {
        var idN = Number($(target).parent().attr('id').match(/id(\d+)/)[1])
        setPos(idN)
        found = getP(idN)
        select()
    }

    function findClicked(event) {
        if (!$(event.target).hasClass('word'))
            return true

        reset()
        word = $(event.target).text()
        if (event.ctrlKey) {
            findCurrent(event.target)
        }
        else {
            findNext()
        }
    }

    $('p').mouseenter(function() {
        convert(this).click(findClicked);
    }).mouseleave(function() { 
        if (this !== found)
            unconvert(this)
        $(this).off('click')
    })
    
    $("body").keydown(function(e){
        // left arrow
        if ((e.keyCode || e.which) == 37)
        {   
            findPrev()
        }
        // right arrow
        if ((e.keyCode || e.which) == 39)
        {
            findNext()
        }   
    });

    $(document).keyup(function(e) {

        if (e.keyCode == 27) {    // esc
            clear()
        }
    });

})
