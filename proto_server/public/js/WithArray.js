

Class.define("WithArray",{ 
	ctor : function() {
		this.internal.WithArray.data = [];
	}
	, from :["WithEvents"]
	, proto: {
		itemPush : function(item) {
			var last = this.internal.WithArray.data.length;
			if(!this.emit("itemInputFilter",[last,null,item])) return false;
			this.internal.WithArray.data.push(item);
			this.emit("itemInsert",[last]);
			return true;
		}
		, itemPop : function() {
			if(this.internal.WithArray.data.length>0) {
				var last = this.internal.WithArray.data.length-1;
				if(!this.emit("itemOutputFilter",[last,this.internal.WithArray.data[last]])) return null;
				var ret = this.internal.WithArray.data.pop();
				this.emit("itemRemove",[last]);
				return ret;
			}
			return null;
		}
		, itemUnshift : function(item) {
			if(!this.emit("itemInputFilter",[0,null,item])) return false;
			this.internal.WithArray.data.unshift(item);
			this.emit("itemInsert",[0]);
			return true;
		}
		, itemShift : function() {
			if(this.internal.WithArray.data.length>0) {
				if(!this.emit("itemOutputFilter",[0,this.internal.WithArray.data[0]])) return null;
				var ret = this.internal.WithArray.data.shift();
				this.emit("itemRemove",[0]);
				return ret;
			}
			return null;
		}
		, itemPeekTop : function() {
			if(this.internal.WithArray.data.length>0) return this.internal.WithArray.data[this.internal.WithArray.data.length-1];
			return null;
		}
		, itemPeekFirst : function() {
			if(this.internal.WithArray.data.length>0) return this.internal.WithArray.data[0];
			return null;
		}
		, itemRemove : function(item) {
			for(var x = 0; x < this.internal.WithArray.data.length;x++) {
				if(this.internal.WithArray.data[x]==item) {
					if(!this.emit("itemOutputFilter",[x,this.internal.WithArray.data[x]])) return null;
					var ret = this.internal.WithArray.data.splice(x,1);
					this.emit("itemRemove",[x]);
					return ret;
				}
			}
			return null;
		}
		, itemRemoveComplex : function(callback) {
			for(var x = 0; x < this.internal.WithArray.data.length;x++) {
				if(callback(x,this.internal.WithArray.data[x])) {
					if(!this.emit("itemOutputFilter",[x,this.internal.WithArray.data[x]])) return null;
					var ret = this.internal.WithArray.data.splice(x,1);
					this.emit("itemRemove",[x]);
					return ret;
				}
			}
			return null;
		}
		, itemRemoveAll : function(item) {
			var check1 = false;
			var check2 = false;
			var mark = [];
			while(true) {
				for(var x = 0; x < this.internal.WithArray.data.length;x++) {
					if(this.internal.WithArray.data[x]==item) {
						if(!this.emit("itemOutputFilter",[x,this.internal.WithArray.data[x]])) return null;
						mark.push(x);
						check1 = true;
						check2 = true;
						break;
					}
				}
				if(!check1) break;
				check1 = false;
			}
			if(check2) {
				var ret = [];
				for(var x = mark.length-1; x >= 0;x--) {
					ret = ret.concat(this.internal.WithArray.data.splice(mark[x],1));
					this.emit("itemRemove",[mark[x]]);
				}
				return ret;
			}
			return false;
		}
		, itemRemoveAllComplex : function(callback) {
			
			var check1 = false;
			var check2 = false;
			
			var mark = [];
			while(true) {
				for(var x = 0; x < this.internal.WithArray.data.length;x++) {
					if(callback(x,this.internal.WithArray.data[x])) {
						if(!this.emit("itemOutputFilter",[x,this.internal.WithArray.data[x]])) return null;
						mark.push(x);
						check1 = true;
						check2 = true;
						break;
					}
				}
				if(!check1) break;
				check1 = false;
			}
			if(check2) {
				var ret = [];
				for(var x = mark.length-1;x>=0;x--) {
					ret.concat(this.internal.WithArray.data.splice(mark[x],1));
					this.emit("itemRemove",[mark[x]]);
				}
				return ret;
			}
			return false;
			
		}
		, itemFindFirstIndex : function(start,item) {
			for(var x = start; x < this.internal.WithArray.data.length;x++) {
				if(this.internal.WithArray.data[x]==item)
					return x;
			}
			return -1;
		}
		// callback(index,value)
		, itemFindFirstIndexComplex : function(start,callback) {
			for(var x = start; x < this.internal.WithArray.data.length;x++) {
				if(callback(x,this.internal.WithArray.data[x])) {
					return x;
				}
			}
			return -1;
		}
		// for replaceAllComplex, use itemMap
		, itemReplaceAll : function(item,replacement) { // commit style
			var check1 = false;
			var check2 = false;
			var mark = [];
			while(true) {
				for(var x = 0; x < this.internal.WithArray.data.length;x++) {
					if(this.internal.WithArray.data[x]==item) {
						if(!this.emit("itemInputFilter",[x,this.internal.WithArray.data[x],replacement])) return false;
						mark.push(x);
						check1 = true;
						check2 = true;
						break;
					}
				}
				if(!check1) break;
				check1 = false;
			}
			if(check2) {
				for(var x = 0; x < mark.length;x++) {
					var oldvalue = this.internal.WithArray.data[mark[x]];
					var newvalue = this.internal.WithArray.data[mark[x]] = replacement;
					this.emit("itemChange",[mark[x],oldvalue,newvalue]);
				}
				return true;
			}
			return false;
		}
		, itemReplaceAllComplex : function(callback) { // commit style
			var check1 = false;
			var check2 = false;
			var mark = [];
			while(true) {
				for(var x = 0; x < this.internal.WithArray.data.length;x++) {
					var oldvalue = this.internal.WithArray.data[x];
					throw "do not return new value?";
					var r = callback(this.internal.WithArray.data[x]);
					if(r==null) {
						if(!this.emit("itemInputFilter",[x,oldvalue,r])) return false;
						mark.push([x,r]); // here using null
						check1 = true;
						check2 = true;
						break;
					}
				}
				if(!check1) break;
				check1 = false;
			}
			if(check2) {
				for(var x = mark.length-1;x>=0;x--) {
					var oldvalue = this.internal.WithArray.data[ mark[x][0] ];
					var newvalue = this.internal.WithArray.data[ mark[x][0] ] = mark[x][1];
					this.emit("itemChange",[mark[x],oldvalue,newvalue]);
				}
				return true;
			}
			return false;
		}
		, itemReplaceAt : function(index,value) {
			if(index >=0 && index < this.internal.WithArray.data.length) {
				if(!this.emit("itemInputFilter",[index,this.internal.WithArray.data[index],value])) return false;
				var oldvalue = this.internal.WithArray.data[index]
				this.internal.WithArray.data[index] = value;
				this.emit("itemChange",[index,oldvalue,value]);
			} else {
				throw "WithArray.itemAt index out of bounds.";
			}
		}
		, itemGetAt : function(index) {
			if(index >=0 && index < this.internal.WithArray.data.length) {
				return this.internal.WithArray.data[index];
			} else {
				throw "WithArray.itemAt index out of bounds.";
			}
		}
		, itemRemoveAt : function(index) {
			if(index >=0 && index < this.internal.WithArray.data.length) {
				if(!this.emit("itemOutputFilter",[index,this.internal.WithArray.data[index]])) return null;
				var r = this.internal.WithArray.data.splice(index);
				this.emit("itemRemove",[index]);
				return r;
			} else {
				throw "WithArray.itemRemoveAt index out of bounds.";
			}
		}
		, itemFindValue : function(callback) {
			for(var x = 0; x < this.internal.WithArray.data.length;x++) {
				if( callback(x,this.internal.WithArray.data[x]) ) {
					return this.internal.WithArray.data[x];
				}
			}
			return null;
		}
		, itemMap : function(callback) { // commit style
			var mark = [];
			for(var x = 0; x < this.internal.WithArray.data.length;x++) {
				var nvalue = callback(x,this.internal.WithArray.data[x]);
				if(!this.emit("itemInputFilter",[x,this.internal.WithArray.data[x],nvalue])) return false;
				mark.push([x,nvalue]);
			}
			for(var x = 0; x < mark.length;x++) {
				var oldvalue = this.internal.WithArray.data[ mark[x][0] ];
				var newvalue = this.internal.WithArray.data[ mark[x][0] ] = mark[x][1];
				this.emit("itemChange",[mark[x][0],oldvalue,newvalue]);
			}
			return false;
		}
		, itemClear : function() { // remove all no check except for output_filter, commit style
			
			for(var y = 0; y < this.internal.WithArray.data.length;y++) {
				//console.log("remove",this.internal.WithArray.data[y]);
				if(!this.emit("itemOutputFilter",[y,this.internal.WithArray.data[y]])) return false;
			}
			var ret = [];
			while(this.internal.WithArray.data.length>0) {
				ret.push( this.internal.WithArray.data.shift() );
				var i = this.internal.WithArray.data.length;
				this.emit("itemRemove",[i]);
			}
			return ret;
		}
		, itemAmount : function() {
			return this.internal.WithArray.data.length;
		}
		, itemSplice : function() {
			return this.internal.WithArray.data.splice.apply( this.internal.WithArray.data, Array.prototype.slice(arguments,0) );
		}
	}
});
