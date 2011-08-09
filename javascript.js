// javascript.js

var CANVAS_WIDTH = 300;
var CANVAS_HEIGHT = 200;
var BLOCK_SIZE = 4;

var colorBackground = 'rgb(0,0,0)';
var colorPixelOff = 'rgb(80,80,80)';
var colorPixelOn = 'rgb(220, 220, 220)';

function getContext()
{
    var canvas = $('#canvas')[0];
    var context = canvas.getContext('2d');
    return context;
}

function getPixelWidth()
{
    // Each block looks like this:
    // Xb
    // bb  
    // Where X is the pixel and b is just a blank spot
    
    // leaving one block around the outside as a board
    
    return Math.floor((CANVAS_WIDTH - (BLOCK_SIZE * 2)) / BLOCK_SIZE);
}

function getPixelHeight()
{
    // leaving one block around the outside as a board
    return Math.floor((CANVAS_HEIGHT - (BLOCK_SIZE * 2)) / BLOCK_SIZE);
}

function clearBoard()
{
    var ctx = getContext();
    ctx.fillStyle = colorBackground;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // draw all the pixels off
    for (var y = 0; y < getPixelHeight(); y++)
        for (var x = 0; x < getPixelWidth(); x++)
            drawPixel(x, y, colorPixelOff);
}

function drawPixel(x, y, color)
{
    var ctx = getContext();
    ctx.fillStyle = color;
    ctx.fillRect(BLOCK_SIZE + (x * BLOCK_SIZE), BLOCK_SIZE + (y * BLOCK_SIZE), BLOCK_SIZE / 2, BLOCK_SIZE / 2);
}

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
    drawBox(currOffset);
    var end = new Date();
    console.log("draw took "+(end.getMilliseconds() - start.getMilliseconds())+"ms");
}

// draw a box in the middle
function drawBox(boxWidth)
{
    var width = getPixelWidth();
    var height = getPixelHeight();
    
    var x1 = (width - boxWidth) / 2;
    var y1 = (height - boxWidth) / 2;
    var x2 = x1 + boxWidth;
    var y2 = y1 + boxWidth;
    
    clearBoard();
    for (var x = x1; x < x2; x++) {
        drawPixel(x, y1, colorPixelOn);
        drawPixel(x, y2, colorPixelOn);
    }
    for (var y = y1; y < y2; y++) {
        drawPixel(x1, y, colorPixelOn);
        drawPixel(x2, y, colorPixelOn);
    }
}

var currOffset = 0;

$(function() {
    clearBoard();
    console.log("Width: " + getPixelWidth());
    console.log("Height: " + getPixelHeight());
    
    //setInterval(cbSineWaveDrawer, 60);
    //drawBox(16);
    setInterval(cbBoxResizeDrawer, 140);
});

