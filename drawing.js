// drawing.js
//

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
	if (x < 0 || y < 0 || x > getPixelWidth() || y > getPixelHeight())
		return;
    var ctx = getContext();
    ctx.fillStyle = color;
    ctx.fillRect(BLOCK_SIZE + (x * BLOCK_SIZE), BLOCK_SIZE + (y * BLOCK_SIZE), BLOCK_SIZE / 2, BLOCK_SIZE / 2);
}

function drawBox(x1, y1, x2, y2)
{
    for (var x = x1; x < x2; x++) {
        drawPixel(x, y1, colorPixelOn);
        drawPixel(x, y2, colorPixelOn);
    }
    for (var y = y1; y < y2; y++) {
        drawPixel(x1, y, colorPixelOn);
        drawPixel(x2, y, colorPixelOn);
    }
}

function drawLineBox(x1, y1, x2, y2)
{
	drawLine(x1, y1, x2, y1);
	drawLine(x1, y2, x2, y2);
	drawLine(x1, y1, x1, y2);
	drawLine(x2, y1, x2, y2);
}

function drawLine(x1, y1, x2, y2)
{
	var tmp;
	
	// flip if greater
	if (x1 > x2) {
		tmp = x1;
		x1 = x2;
		x2 = tmp;
	}
	if (y1 > y2) {
		tmp = y1;
		y1 = y2;
		y2 = tmp;
	}

	// calculate the delta
	var dx = x2 - x1
	var dy = y2 - y1
	
	if (dx > dy) {
		var step = Math.floor(dx/dy);
		for (var x = x1; x <= x2; x++)
			drawPixel(x, y1 + Math.floor((x-x1) / step), colorPixelOn);
	} else {
		var step = Math.floor(dy/dx);
		for (var y = y1; y <= y2; y++)
			drawPixel(x1 + Math.floor((y-y1) / step), y, colorPixelOn);
	}
}


// draw a box in the middle
function drawCenteredBox(boxWidth)
{
    var width = getPixelWidth();
    var height = getPixelHeight();
    
    var x1 = (width - boxWidth) / 2;
    var y1 = (height - boxWidth) / 2;
    var x2 = x1 + boxWidth;
    var y2 = y1 + boxWidth;
    
    clearBoard();
	drawBox(x1, y1, x2, y2);
}


function DegsToRads(degrees) {
	return ((Math.PI*2) / 360) * degrees;
}


function drawRotatedBox(boxWidth, rads)
{	
	/*
		maxtrix multiplication:
		[ x, y ] * [cos, -sin
					sin, cos]
					
		x' = x*cos + y*-sin 
		y' = y*sin, + x*cos
		
		given a box:
		a-----b
		|     |
		|	  |
		c-----d
		
		
	*/
	
    var width = getPixelWidth();
	var halfw = Math.floor(width / 2);
    var height = getPixelHeight();
	var halfh = Math.floor(height / 2);
    
	// relative coordiates to center
    var ax = (width - boxWidth) / 2 - halfw
    var ay = (height - boxWidth) / 2 - halfh;
	var dx = ax + boxWidth - halfw;
    var dy = ay + boxWidth - halfh;
    var bx = dx
	var by = ay;
	var cx = ax;
	var cy = dy
	
    var ax2 = Math.floor(halfw + rotateX(ax, ay, rads));
    var ay2 = Math.floor(halfh + rotateY(ax, ay, rads));
	var bx2 = Math.floor(halfw + rotateX(bx, by, rads));
    var by2 = Math.floor(halfh + rotateY(bx, by, rads));
	var cx2 = Math.floor(halfw + rotateX(cx, cy, rads));
    var cy2 = Math.floor(halfh + rotateY(cx, cy, rads));
    var dx2 = Math.floor(halfw + rotateX(dx, dy, rads));
    var dy2 = Math.floor(halfh + rotateY(dx, dy, rads));
	
	drawLine(ax2, ay2, bx2, by2);
	drawLine(bx2, by2, dx2, dy2);
	drawLine(dx2, dy2, cx2, cy2);
	drawLine(cx2, cy2, ax2, ay2);
}

function rotateX(x, y, rads) {
	return Math.floor((x * Math.cos(rads)) - (y * Math.sin(rads)));
}

function rotateY(x, y, rads) {
	return Math.floor((x * Math.sin(rads)) + (y * Math.cos(rads)));
}

