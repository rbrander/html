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

// Function will return -1, 0 or +1 which matches the sign of the value passed in
// for example, -24 will return -1; 39 will return +1 and 0 will return 0.
function sign(a) {
	return (a < 0 ? -1 : (a > 0 ? +1 : 0));
}

function drawLine(x1, y1, x2, y2)
{
	/*
	// flip if greater
	var tmp;
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
	*/
//console.log(x1, y1, x2, y2);
	var dx = sign(x1 - x2);
	var dy = sign(y1 - y2);
console.log("dx = " + dx + "; dy = " + dy);
	
	// if we have a straight horizontal line
	if (dy == 0) {
		if (dx < 0)
			for (var x = x1; x <= x2; x++)
				drawPixel(x, y1, colorPixelOn);
		else if (dx > 0)
			for (var x = x2; x <= x1; x++)
				drawPixel(x, y1, colorPixelOn);
	} else if (dx == 0) {	// if we have a straight vertical line
		if (dy < 0)
			for (var y = y1; y <= y2; y++)
				drawPixel(x1, y, colorPixelOn);
		else if (dy > 0)
			for (var y = y2; y <= y1; y++)
				drawPixel(x1, y, colorPixelOn);
	} else {
		// we have a diagonal line
		var xlength = Math.abs(x1 - x2);
		var ylength = Math.abs(y1 - y2);
console.log('xlength = ' + xlength + '; ylength = ' + ylength);
		
		var xslope = xlength / ylength;
		var yslope = ylength / xlength;
console.log('xslope = ' + xslope + '; yslope = ' + yslope);
console.log('(yslope/xslope) = ' + (yslope/xslope));
		if ((yslope / xslope < 1) && (yslope / xslope > -1)) {
			if (dx < 0) {
				console.log('here');
				for (var x = x1; x <= x2; x++)
					drawPixel(x, Math.round(yslope*x), colorPixelOn);
			}else if (dx > 0)
				for (var x = x2; x <= x1; x++)
					drawPixel(x, Math.round(yslope*x), colorPixelOn);
		} else {
			if (dy < 0)
				for (var y = y1; y <= y2; y++)
					drawPixel(Math.round(xslope*y), y, colorPixelOn);
			else if (dy > 0)
				for (var y = y2; y <= y1; y++)
					drawPixel(Math.round(xslope*y), y, colorPixelOn);
		}
	}
	
	/*
	old code
	// calculate the delta
	var dx = x2 - x1
	var dy = y2 - y1
	
	if (dx > dy) {
		//var step = Math.floor(dx/dy);
		var step = (dx/dy);
		for (var x = x1; x <= x2; x++)
			drawPixel(x, y1 + Math.floor((x-x1) / step), colorPixelOn);
	} else {
		// var step = Math.floor(dy/dx);
		var step = (dy/dx);
		for (var y = y1; y <= y2; y++)
			drawPixel(x1 + Math.floor((y-y1) / step), y, colorPixelOn);
	}
	*/
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
	drawLineBox(x1, y1, x2, y2);
}


function DegsToRads(degrees) {
	return (Math.PI / 180) * degrees;
}

function drawRotatedBox(boxDiameter, rads)
{
	// http://www.gpwiki.org/index.php/VB:Tutorials:Rotating_A_Point_In_2D
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
    var ax = Math.floor((width - boxDiameter) / 2);
    var ay = Math.floor((height - boxDiameter) / 2);
	var dx = ax + boxDiameter;
    var dy = ay + boxDiameter;
	//drawLineBox(ax,ay, dx,dy);
	/*
    var ax = Math.floor((width - boxDiameter) / 2) - halfw;
    var ay = Math.floor((height - boxDiameter) / 2) - halfh;
	var dx = ax + boxDiameter - halfw;
    var dy = ay + boxDiameter - halfh;
	*/
    var bx = dx
	var by = ay;
	var cx = ax;
	var cy = dy
	
	/*
    var ax2 = Math.floor(halfw + rotateX(ax, ay, rads));
    var ay2 = Math.floor(halfh + rotateY(ax, ay, rads));
	var bx2 = Math.floor(halfw + rotateX(bx, by, rads));
    var by2 = Math.floor(halfh + rotateY(bx, by, rads));
	var cx2 = Math.floor(halfw + rotateX(cx, cy, rads));
    var cy2 = Math.floor(halfh + rotateY(cx, cy, rads));
    var dx2 = Math.floor(halfw + rotateX(dx, dy, rads));
    var dy2 = Math.floor(halfh + rotateY(dx, dy, rads));
	*/
	
	/*
    var ax2 = Math.floor(rotateX(ax, ay, rads));
    var ay2 = Math.floor(rotateY(ax, ay, rads));
	var bx2 = Math.floor(rotateX(bx, by, rads));
    var by2 = Math.floor(rotateY(bx, by, rads));
	var cx2 = Math.floor(rotateX(cx, cy, rads));
    var cy2 = Math.floor(rotateY(cx, cy, rads));
    var dx2 = Math.floor(rotateX(dx, dy, rads));
    var dy2 = Math.floor(rotateY(dx, dy, rads));
	*/
    var ax2 = Math.floor(rotateXPoint(ax, ay, rads, halfw, halfh));
    var ay2 = Math.floor(rotateYPoint(ax, ay, rads, halfw, halfh));
	var bx2 = Math.floor(rotateXPoint(bx, by, rads, halfw, halfh));
    var by2 = Math.floor(rotateYPoint(bx, by, rads, halfw, halfh));
	var cx2 = Math.floor(rotateXPoint(cx, cy, rads, halfw, halfh));
    var cy2 = Math.floor(rotateYPoint(cx, cy, rads, halfw, halfh));
    var dx2 = Math.floor(rotateXPoint(dx, dy, rads, halfw, halfh));
    var dy2 = Math.floor(rotateYPoint(dx, dy, rads, halfw, halfh));
	
	console.log("before (" + ax + ", " + ay + "), (" + bx + ", " + by + "), (" + cx + ", " + cy + "), (" + dx + ", " + dy + ")");
	console.log("after  (" + ax2 + ", " + ay2 + "), (" + bx2 + ", " + by2 + "), (" + cx2 + ", " + cy2 + "), (" + dx2 + ", " + dy2 + ")");
	
	drawLine(ax2, ay2, bx2, by2);
	drawLine(bx2, by2, dx2, dy2);
	drawLine(cx2, cy2, dx2, dy2);
	drawLine(ax2, ay2, cx2, cy2);
	
	// draw red dots for the corners
	var colorRed = "rgb(230, 0, 0)";
	drawPixel(ax2, ay2, colorRed);
	drawPixel(bx2, by2, colorRed);
	drawPixel(cx2, cy2, colorRed);
	drawPixel(dx2, dy2, colorRed);
}

function rotateX(x, y, rads) {
	//return Math.floor((x * Math.cos(rads)) - (y * Math.sin(rads)));
	return rotateXPoint(x, y, rads, 0, 0);
}

// rotates x, y around the point px,py by rads radians
function rotateXPoint(x, y, rads, px, py)
{
	// RotatePoint.X = pOrigin.X + ( Cos(D2R(Degrees)) * (pPoint.X - pOrigin.X) - Sin(D2R(Degrees)) * (pPoint.Y - pOrigin.Y) )
	return Math.floor(px + ((x-px) * Math.cos(rads)) - ((y-py) * Math.sin(rads)));
}

function rotateY(x, y, rads) {
	//return Math.floor((x * Math.sin(rads)) + (y * Math.cos(rads)));
	return rotateYPoint(x, y, rads, 0, 0);
}
// rotates x, y around the point px,py by rads radians
function rotateYPoint(x, y, rads, px, py)
{
	// RotatePoint.Y = pOrigin.Y + ( Sin(D2R(Degrees)) * (pPoint.X - pOrigin.X) + Cos(D2R(Degrees)) * (pPoint.Y - pOrigin.Y) )
	return Math.floor(py + ((x - px) * Math.sin(rads)) + ((y-py) * Math.cos(rads)));
}

// mostly for testing
function draw_pixel_arc()
{
	var x = 30;
	var y = 0;
	for (var angle = 0; angle <= 90; angle++) {
		var _x = rotateX(x, y, DegsToRads(angle));
		var _y = rotateY(x, y, DegsToRads(angle));
		drawPixel(_x, _y, colorPixelOn);
	}
}

