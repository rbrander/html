// animation.js
//

function getRadiansPerPixel()
{
    return (4*Math.PI) / getPixelWidth();
}

function drawSineWave(offset)
{
    // 0 to 2PI
    // radians per pixel
    var rpp = getRadiansPerPixel();
    var baseline = Math.floor(getPixelHeight() / 2);
    
    for (var x = 0; x < getPixelWidth(); x++)
        drawPixel(x, baseline + (baseline*0.8 * Math.sin(offset + rpp * x)), colorPixelOn);
}

// runs best on 100ms in firefox and 50ms in chrome
// setInterval(cbSineWaveDrawer, 100);
function cbSineWaveDrawer() {
    var start = new Date();
    clearBoard();
    currOffset += getRadiansPerPixel();
    if ((currOffset % (Math.PI*2)) == 0)
        currOffset = 0;
    drawSineWave(currOffset);
    var end = new Date();
    console.log("draw took "+(end.getMilliseconds() - start.getMilliseconds())+"ms");
}

// runs best on 140ms in firefox and 70ms in chrome
// setInterval(cbBoxResizeDrawer, 140);
function cbBoxResizeDrawer()
{
    var start = new Date();
    clearBoard();
    currOffset += 1;
    if ((currOffset % 40) === 0)
        currOffset = 0;
    drawCenteredBox(currOffset);
    var end = new Date();
    console.log("draw took "+(end.getMilliseconds() - start.getMilliseconds())+"ms");
}

var currOffset = 0;

function cbBoxSpinDrawer()
{
    var start = new Date();
    clearBoard();
    currOffset += 1;
    if (currOffset == 90)
        currOffset = 0;
	drawRotatedBox(16, DegsToRads(currOffset));
    var end = new Date();
    console.log("draw took "+(end.getMilliseconds() - start.getMilliseconds())+"ms");
}

function cbRandomLinesDrawer()
{
    var start = new Date();
    //clearBoard();
	drawRandomLine();
    var end = new Date();
    console.log("draw took "+(end.getMilliseconds() - start.getMilliseconds())+"ms");
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