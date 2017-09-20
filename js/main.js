// Thanks to http://thecodeplayer.com/walkthrough/magnifying-glass-for-images-using-jquery-and-css3

/*
Using Microsoft's Pointer Events W3C proposal, rolled into the Hand.js library to unify touch, pen, and mouse event handling
Read more:  http://www.w3.org/TR/pointerevents/
Download:  http://handjs.codeplex.com/
*/

$(document).ready(function(){

	//Makes James Buttersworth pop-out from the left
	$(".magnify .hotspots div").on("pointerover", function() {
		$("#buttersworth").addClass("speaking");
	});
	$(".magnify .hotspots div").on("pointerout", function() {
		$("#buttersworth").removeClass("speaking");
	});

	$(".magnify .hotspots div").on("pointerover", function(event) {
		$(this).children("a").css({"opacity": "0"});
		$(this).children("p").css({"opacity": ".9", "display": "block" });
	});
	$(".magnify .hotspots div").on("pointerout", function() {
		$(this).children("a").css({"opacity": "0.2"});
		$(this).children("p").css("opacity","0");
	});

	var native_width = 0;
	var native_height = 0;

	function magnify(evt){
		//When the user hovers on the image, the script will first calculate
		//the native dimensions if they don't exist. Only after the native dimensions
		//are available, the script will show the zoomed version.
		if(!native_width && !native_height)
		{
			//This will create a new image object with the same image as that in .small
			//We cannot directly get the dimensions from .small because of the 
			//width specified to 200px in the html. To get the actual dimensions we have
			//created this image object.
			var image_object = new Image();
			image_object.src = $(".small").attr("src");
			
			//This code is wrapped in the .load function which is important.
			//width and height of the object would return 0 if accessed before 
			//the image gets loaded.
			native_width = image_object.width;
			native_height = image_object.height;
		}
		else
		{
			//x/y coordinates of the mouse
			//This is the position of .magnify with respect to the document.
			var magnify_offset = $(this).offset();
			//We will deduct the positions of .magnify from the mouse positions with
			//respect to the document to get the mouse positions with respect to the 
			//container(.magnify)
			var mx = evt.pageX - magnify_offset.left;
			var my = evt.pageY - magnify_offset.top;
			
			//Finally the code to fade out the glass if the mouse is outside the container
			if(mx < $(this).width() && my < $(this).height() && mx > 0 && my > 0)
			{
				$(".large").fadeIn(100);
			}
			else
			{
				$(".large").fadeOut(100);
			}
			if($(".large").is(":visible"))
			{
				//The background position of .large will be changed according to the position
				//of the mouse over the .small image. So we will get the ratio of the pixel
				//under the mouse pointer with respect to the image and use that to position the 
				//large image inside the magnifying glass
				var rx = Math.round(mx/$(".small").width()*native_width - $(".large").width()/2)*-1;
				var ry = Math.round(my/$(".small").height()*native_height - $(".large").height()/2)*-1;
				var bgp = rx + "px " + ry + "px";
				
				//Time to move the magnifying glass with the mouse
				var px = mx - $(".large").width()/2;
				var py = my - $(".large").height()/2;
				//Now the glass moves with the mouse
				//The logic is to deduct half of the glass's width and height from the 
				//mouse coordinates to place it with its center at the mouse coordinates
				
				//If you hover on the image now, you should see the magnifying glass in action
				$(".large").css({left: px, top: py, backgroundPosition: bgp});
			}
		}
	}

	//Need one for pointer moves (e.g., mouse/finger dragging glass over hotspots) and pointer clicks --pointerdown (e.g., touching hotspots directly)
	$(".magnify").on("pointermove", magnify);
	$(".magnify").on("pointerdown", magnify);
})