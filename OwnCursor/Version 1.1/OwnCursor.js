// ----------------------------------------------------------------------------------------------------
// CommandBar with Own Cursor
// by SoonGames, 2017
// Version 1.1
// ----------------------------------------------------------------------------------------------------
// Quest-Version: 5.7
// ----------------------------------------------------------------------------------------------------
// Just download the OwnCursor.js and integrate it as javascript in Quest.
// ----------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------
// Version 1.1
// bugfix for accidental invocation of commands that were previously executed by buttons.
// ----------------------------------------------------------------------------------------------------

(function ($) {

	// --------------------------------------------------------------------------------------------------------------
	var OwnCurCursor = "█"; // cursor
	//var OwnCurCursor = " "; // without cursor
	//var OwnCurCursor = "_"; // alternate cursors
	//var OwnCurCursor = "▌";
	//var OwnCurCursor = "▄";
	//var OwnCurCursor = "●";
	//var OwnCurCursor = "►";
	var OwnCurCursorLen = OwnCurCursor.length;
	// --------------------------------------------------------------------------------------------------------------
	var OwnCurBlinking = false; // determines whether the cursor flashes.
	var OwnCurBlinkinterval = 500; // how often the cursor of the indicated milliseconds should blink.
	// --------------------------------------------------------------------------------------------------------------
	var OwnCurBlinkcursor = " "; // without blinkcursor
	//var OwnCurBlinkcursor = "▄"; // cursor, the one is replaced with the blinking. can be customized with any cursor.
	var OwnCurBlinkcursorLen = OwnCurBlinkcursor.length;
	// --------------------------------------------------------------------------------------------------------------
	if (OwnCurBlinking) window.setInterval(OwnCurItsBlinking, OwnCurBlinkinterval);
	// --------------------------------------------------------------------------------------------------------------

    $("#txtCommand").ready(function () { OwnCurInit(); } );
	$(document).bind("keydown", function (event) { OwnCurInput (event, "keydown"); } );
    $(document).bind("keypress", function (event) { OwnCurInput (event, "keypress"); } );
    
    function OwnCurInit () {
    
    	var cmdbar = $("#txtCommand"); // commandbar-reference
    	cmdbar.css("height", "26px") // with some buttons it may be necessary to adjust the height of the CommandBar.
		cmdbar.prop("disabled", true);
	   	cmdbar.val(OwnCurCursor);
	   	
    }
    
    function OwnCurInput (event, typ) {
    
    	var cmdbar = $("#txtCommand"); // commandbar-reference
    	if (typeof event !== 'undefined') {
	    	var key = event.which; // keycode
	    	var strkey = String.fromCharCode(key); // key
	    	
	    	if ( typ === "keydown" && key === 8) { // backspace
	    		event.preventDefault();
				var text = cmdbar.val().slice(0, -(OwnCurCursorLen + 1)) + OwnCurCursor;
				cmdbar.val(text);
	    	}
	    	else if ((typ === "keydown") && (key === 32)) { // space
	    		event.preventDefault();
		     	var text = cmdbar.val().slice(0, -OwnCurCursorLen) + " " + OwnCurCursor;
		    	cmdbar.val(text);	    		
	    	}	    	
	    	else if ((typ === "keydown") && (key === 13 || key === 38 || key === 40 || key === 27)) { // return, etc.
	    		event.preventDefault();
	    	    var text = cmdbar.val().slice(0, -OwnCurCursorLen);
	    		cmdbar.val(text);
	    		commandKey(event);
	    		var text = cmdbar.val() + OwnCurCursor;
	    		cmdbar.val(text);
	    	}
	    	else if (typ === "keypress") { // another key
	    		event.preventDefault();
		     	var text = cmdbar.val().slice(0, -OwnCurCursorLen) + strkey + OwnCurCursor;
		    	cmdbar.val(text);
	    	}
	    }
    }
    
    function OwnCurItsBlinking () {
    
    	if ( $("#txtCommand").length > 0 ) {
	    	var cmdbar = $("#txtCommand");
	    	var lastchar = cmdbar.val().slice(-OwnCurCursorLen);
	    	if (lastchar === OwnCurCursor) var text = cmdbar.val().slice(0, -OwnCurCursorLen) + OwnCurBlinkcursor;
	    	else var text = cmdbar.val().slice(0, -OwnCurBlinkcursorLen) + OwnCurCursor;
    		cmdbar.val(text);
    	}
    	
    }

})(jQuery);

// ----------------------------------------------------------------------------------------------------