// trig.js

var SIN_TABLE = {};
var COS_TABLE = {};
var MAX_DEGS = 360;
var MAX_RADS = DegsToRads(MAX_DEGS);

function DegsToRads(degrees) {
	return (Math.PI / 180) * degrees;
}

function cosd(degs)
{
	var val = COS_TABLE.degs[degs];
	if (typeof(val) == 'undefined')
		val = Math.cos(DegsToRads(rads));
	return val;
}

function sind(degs)
{
	var val = SIN_TABLE.degs[degs];
	if (typeof(val) == 'undefined')
		val = Math.sin(DegsToRads(rads));
	return val;
}

function cos(rads)
{
	var val = COS_TABLE.rads[rads];
	if (typeof(val) == 'undefined')
		val = Math.cos(rads);
	return val;
}

function sin(rads)
{
	var val = SIN_TABLE.rads[rads];
	if (typeof(val) == 'undefined')
		val = Math.sin(rads);
	return val;
}

function trig_init()
{
	SIN_TABLE.rads = new Array();
	SIN_TABLE.degs = new Array();
	COS_TABLE.rads = new Array();
	COS_TABLE.degs = new Array();
	for (var angle = 0; angle <= MAX_DEGS; angle++) {
		var rads = DegsToRads(angle);
		SIN_TABLE.rads[rads] = Math.sin(rads);
		SIN_TABLE.degs[angle] = Math.sin(rads);
		COS_TABLE.rads[rads] = Math.cos(rads);
		COS_TABLE.degs[angle] = Math.cos(rads);
	}
}