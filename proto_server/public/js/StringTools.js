


/*
	StringTools
*/


function StringTools() {}
StringTools.prototype.toHex = function(val) {
	var alpha = [
		"0","1","2","3",
		"4","5","6","7",
		"8","9","A","B",
		"C","D","E","F"
	];
	var sb = [];
	for(var x = 0; x < val.length;x++) {
		var c = (val.charCodeAt(x) >>>0)
		sb.push( alpha[ (c & 0xF0)>>4 ] + alpha[ ( c & 0xF ) ] );
	}
	return sb.join("");
}
StringTools.prototype.fromHex = function(val) {
	var alpha = {
		"0":0,"1":1,"2":2,"3":3,
		"4":4,"5":5,"6":6,"7":7,
		"8":8,"9":9,"A":10,"B":11,
		"C":12,"D":13,"E":14,"F":15
	};
	var sb = [];
	for(var x = 0; x < val.length;x+=2) {
		sb.push( String.fromCharCode( (alpha[ val.charAt(x) ] << 4 ) | alpha[ val.charAt(x+1) ] ) );
	}
	return sb.join("");
}
StringTools = new StringTools();
