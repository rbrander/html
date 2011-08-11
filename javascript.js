// javascript.js

var CANVAS_WIDTH = 300;
var CANVAS_HEIGHT = 200;
var BLOCK_SIZE = 4;

var colorBackground = 'rgb(0,0,0)';
var colorPixelOff = 'rgb(80,80,80)';
var colorPixelOn = 'rgb(220, 220, 220)';

var intervalID;

$(function() {
    clearBoard();
    console.log("Width: " + getPixelWidth());
    console.log("Height: " + getPixelHeight());
});

function launch() {
	//intervalID = setInterval(cbSineWaveDrawer, 60);
	//intervalID = setInterval(cbBoxResizeDrawer, 140);
	//intervalID = setInterval(cbBoxSpinDrawer, 60);
	//intervalID = setInterval(cbRandomLinesDrawer, 10);
	
	
	//drawRotatedBox(10, DegsToRads(15));
	
	//drawRotatedBox(10, DegsToRads(45));
	
}
