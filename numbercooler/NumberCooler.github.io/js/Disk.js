Disk = (function() {
	var r = {};
	
	
	
	r.OP_EQ = 9; // two comparations in find.
	r.OP_LT = 2; // 
	r.OP_LTE = 3;
	r.OP_GT = 4;
	r.OP_GTE = 5;
	
	
	if(window.localStorage) {
		r.set = function(name,data) {
			window.localStorage.setItem(name,JSON.stringify(data));
		}
		r.get = function(name) {
			var data = window.localStorage.getItem(name);
			if(data) return JSON.parse(data);
			return null;
		}
	}
	
	r.upload = function(name) {
		var data = r.get(name);
		console.log(">>",data);
		return data;
	}
	
	// { mime : "text/plain", fileName : "data.txt", captionName : "Title of Document", data : "string_value", lastSaveDate : "" }
	
	
	r.download = function(name) {
		
	}
	r.find_by = function(op_code,attribute,compararator,value,rest) {
		
		var args = [].prototype.slice(arguments,0);
		var opcode = args.shift();
		// rest is attribute of second expression of find function, so you got it!
		
		var results = [];
		var full_check = false;
		for(var x = 0; 
		( 	
			(args.length>0 && args.length == 1 ) || 
			(args.length>0 && args.length == 3) ||
			(args.length > 3 && ( args.length %3 == 0) ) && 
			( x < args.length )
		);x+=3) {
			
			var check = false;
			if( comparator == r.LT ) {
				
			} else if( comparator == r.LTE ) {
				
			} else if( comparator == r.EQ ) {
				
			} else if( comparator == r.GTE ){
				
			} else if( comparator == r.GT ) {
				
			} else {
			
			}
			
		}
		return results;
	}
	return r;
	
})();