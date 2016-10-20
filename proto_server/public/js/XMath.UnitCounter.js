
Class.define("XMath.UnitCounter",{
	ctor : function() {
		this.value = 0;
	},
	proto : {

		inc : function() {
			this.value += 1;
		},
		dec : function() {
			this.value -= 1;
		},
		get : function() {
			return this.value;
		},
		getInc : function() {
			var r = this.value;
			this.value += 1;
			return r;
		},
		getDec : function() {
			var r = this.value;
			this.value -= 1;
			return r;
		},
		incGet : function() {
			this.value += 1;
			return this.value;
		},
		reset : function(start) {
			if(start==undefined || start==null)
				this.value = 0;
			else
				this.value = start;
		},
		decGet : function() {
			this.value -= 1;
			return this.value;
		},
		str : function() {
			
		}
	}
});