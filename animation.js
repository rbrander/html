// animation.js
//
var currOffset = 0;	// incremental counter used for call back methods

// runs best on 140ms in firefox and 70ms in chrome
// setInterval(cbBoxResizeDrawer, 140);
function cbBoxResizeDrawer()
{
    clearBoard();
    if ((++currOffset % getPixelHeight()) === 0)
        currOffset *= -1;
    drawCenteredBox(currOffset < 0 ? currOffset*-1 : currOffset);
}

function cbBoxSpinDrawer()
{
    clearBoard();
	currOffset += 5;
    if (currOffset >= 90)
        currOffset = 0;
	drawRotatedBox(16, DegsToRads(currOffset));
}

function cbRandomLinesDrawer()
{
	if (++currOffset == 200)
		currOffset = 0;
	if (currOffset < 100)
		clearBoard();
	drawRandomLine();
}

function drawRandomLine()
{
	var width = getPixelWidth();
	var height = getPixelHeight();
	var x1 = Math.round(width * Math.random());
	var y1 = Math.round(height * Math.random());
	var x2 = Math.round(width * Math.random());
	var y2 = Math.round(height * Math.random());
	drawLine(x1, y1, x2, y2);
}


// -------------------------------------------
// -- SINE WAVE
// -------------------------------------------

function drawSineWave(offset)
{
    // 0 to 2PI
    // radians per pixel
    var rpp = getRadiansPerPixel();
    var baseline = Math.floor(getPixelHeight() / 2);
    
    for (var x = 0; x < getPixelWidth(); x++)
        drawPixel(x, baseline + (baseline*0.8 * Math.sin(offset + rpp * x)), colorPixelOn);
}

function getRadiansPerPixel()
{
	// 4 because I wanted two cycles to fit in the screen
    return (4*Math.PI) / getPixelWidth();
}

// runs best on 100ms in firefox and 50ms in chrome
// setInterval(cbSineWaveDrawer, 100);
function cbSineWaveDrawer() 
{
    clearBoard();
    currOffset += getRadiansPerPixel();
    if ((currOffset % (Math.PI*2)) == 0)
        currOffset = 0;
    drawSineWave(currOffset);
}
// --------------------SINE WAVE-----------------------


function cbCircleOfLinesDrawer()
{
    if (++currOffset == 180) {
		setTimeout(function() { clearBoard(); currOffset = Math.floor(Math.random() * 180); }, 1000);
		currOffset = 0;
	}
	
	var radius = 20;
	var hw = getPixelWidth()/2;
	var hh = getPixelHeight()/2;
	
	var x1 = Math.round(hw + radius * Math.cos(DegsToRads(currOffset)));
	var y1 = Math.round(hh + radius * Math.sin(DegsToRads(currOffset)));
	var x2 = Math.round(hw + radius * Math.cos(DegsToRads(currOffset+180)));
	var y2 = Math.round(hh + radius * Math.sin(DegsToRads(currOffset+180)));
	
	drawLine(x1, y1, x2, y2);
	drawPixel(hw,hh, "blue");
	drawPixel(x1,y1, "red");
	drawPixel(x2,y2, "red");
}
