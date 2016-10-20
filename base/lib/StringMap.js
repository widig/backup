
function StringMap(str) {
	var map = [{},{}];
	for(var x = 0; x < str.length;x++) {
		var index = -1;
		var ch = str.charAt(x);
		for(var y = 1; y < map.length;y++) {
			if(ch in map[y]) {
				index = y;
			} else {
				break;
			}
		}
		if(index == -1) {
			map[1][ch] = x;
			map[0][x] = 1;
		} else if(index+1 < map.length) {
			map[index+1][ch] = x;
			map[0][x] = index + 1;
			//console.log(index+1);
		} else {
			var obj = {};
			obj[ch] = x;
			map.push(obj);
			map[0][x] = index+1;
			//console.log("a",index+1);
		}
	}
	map[0].length = str.length;
	map.count = function(c) {
		var counter = 0;
		for(var x= 1; x < map.length;x++) {
			if(c in map[x]) {
				counter = x;
			} else {
				break;
			}
		}
		return counter;
	}
	map.before = function(c) {
		var arr = [];
		for(var x= 1; x < map.length;x++) {
			if(c in map[x]) {
				var p = map[x][c];
				if(p>0) {
					var char_before = str.charAt( p-1 );
					// which?
					for(var y = 1;y < map.length;y++) {
						if(char_before in map[y] && map[y][char_before] == p-1) {
							arr.push( [ y, char_before ]);
							break;
						}
					}
				} else {
					arr.push([x,0]);
				}
			} else {
				break;
			}
		}
		return arr;	
	}
	map.after = function(c) {
		var arr = [];
		for(var x= 1; x < map.length;x++) {
			if(c in map[x]) {
				var p = map[x][c];
				if(p+1 < map[0].length) {
					var char_after = str.charAt(p+1);
					for(var y = 1; y < map.length;y++) {
						if(char_after in map[y] && map[y][char_after] == p+1) {
							arr.push([ y, char_after]);
							break;
						}
					}
				} else {
					arr.push([x,-1]);
				}
			}
		}
		return arr;
	}
	map.where = function(c) {
		var arr = [];
		for(var x = 1; x < map.length;x++) {
			if(c in map[x]) {
				arr.push( map[x][c] );
			}
		}
		return arr;
	}
	map.whereString = function(pat) {
		var regions = map.where(pat.charAt(0));
		var testLen = regions.length;
		while(testLen>0) {
			var r = regions.shift();
			var c = true;
			for(var x = 1; x < pat.length;x++) {
				if( pat.charAt(x) != str.charAt(r+x) ) {
					c = false;
					break;
				}
			}
			if(c) {
				regions.push(r);	
			}
			testLen -= 1;
		}
		return regions;
	}
	map.whereSequence = function(options) {
		
		var imap = {};
		for(var x = 1; x < arguments.length;x++) {
			var t = Object.prototype.toString.apply(arguments[x]);
			if(t == "[object String]") {
				imap[arguments[x]] = map.whereString(arguments[x]);
			} else if(t == "[object Array]") {
				var arr = [];
				for(var y = 0; y < arguments[x].length;y++) {
					var arr1 = map.whereString(arguments[x][y]);
					arr = arr.concat(arr1);
				}
				var arr2 = [];
				for(var y = 0; y < arr.length;y++) {
					var c = false;
					for(var z = 0; z < arr2.length;z++) {
						if(arr[y] == arr2[z]) {
							c = true;
							break;
						}
					}
					if(!c) arr2.push(arr[y]);
				}
				imap[arguments[x]] = arr2;

			}
		}
		var stack = [[0,0,-1]];
		var prod = [];
		console.log(JSON.stringify(imap));
		while(stack.length>0) {
			var item = stack.shift();
			console.log( "item:",item[0],"index:",item[1], arguments[item[0]+1] );
			if(
				item[0]+1 < arguments.length &&
				imap[ arguments[ item[0]+1 ] ].length > 0 && 
				item[1] < imap[ arguments[ item[0]+1 ] ].length &&
				item[2] < imap[ arguments[ item[0]+1 ] ][ item[1] ]
			) {
				
				if(prod.length==0) prod.push([]);
				prod[ prod.length-1 ].push( imap[ arguments[ item[0]+1 ] ][ item[1] ] );
				stack.unshift([item[0],item[1]+1, item[2] ]);
				stack.unshift([item[0]+1,0, imap[ arguments[ item[0]+1 ] ][ item[1] ] + arguments[ item[0]+1].length ]);
				console.log("found:",arguments[item[0]+1],JSON.stringify(prod));
			} else {
				if(item[0] + 1 >= arguments.length) {
					console.log("dead end");
					var np = [];
					for(var x = 0; x < prod[ prod.length-1 ].length-1;x++)
						np.push( prod[ prod.length-1][x] );
					prod.push(np);
					console.log(JSON.stringify(prod));
				} else if(item[1] >= imap[ arguments[ item[0]+1 ] ].length) {
					if(prod.length >0 && prod[ prod.length-1].length >0) prod[ prod.length-1].pop();
					
					
				} else if( item[2] >= imap[ arguments[ item[0]+1 ] ][ item[1] ]) {
					console.log("try next combination");
					stack.unshift( [ item[0], item[1] + 1, item[2] ]);
				} else {
					console.log("fail");
					if(prod.length>0) prod.pop();	
					while(stack.length>0 && stack[ 0 ][0] > 0) stack.shift();
				}
			}
		}
		if(prod.length>0 && prod[prod.length-1].length < arguments.length-1) prod.pop();
		//sample
		//   var m1 = Pattern2("123 abc 456 789 123 123 789 567 789");
		//   console.log("seq:",m1.whereSequence({},"123","abc","789"));
		// >>[[0,4,12],[0,4,24],[0,4,32]
		// options to implement
		// largest
		// smallest
		// in range
		// after
		// before
		
		return prod;
	}
	map.whereSpace = function() {

	}
	return map;
}
module.exports = StringMap;
