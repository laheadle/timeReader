This bookmarklet adds some abilities to a page for reading
history. Currently works on pages composed of sequences of paragraphs,
including everything at gutenberg.org ([Macaulay's history of
England,](http://www.gutenberg.org/files/2612/2612-h/2612-h.htm) for
example).

You Start in 'Word Mode':

* Click a word and go to the first occurrence of it, highlighting all occurrences in the paragraph.
* left and right arrow to go to the previous/next paragraph containing the word.
* Ctrl-click to select a word and stay on the current paragraph.

Hit Escape to switch between 'Word Mode' and 'Date mode':

* Click a paragraph to go to the first occurrence of a year or month.
* left and right arrow to go to the previous/next occurrence of a date.
* Ctrl-click to select a date and stay on the current paragraph.

###Install this Bookmarklet: 

<p>
Drag This to your bookmarks bar: <a href="javascript:(function(){var script = document.createElement('script'); var head= document.getElementsByTagName('head')[0]; script.src="//stinkless.org/js/te.js"; script.type= 'text/javascript'; head.appendChild(script) })())">timeReader</a>
</p>