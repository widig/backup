

Router.addPage({name:"tools.number_table",template:"base"},function(args, template, router) { // this is coupled, requires temporary.musicplayer defined
	/*
	var kernel = Class.create("Kernel");
	if( !kernel.instance.loggedLocal() ) {
		History.go("#home");
		return;
	}
	*/
	
	// [   10 ][   14 ][   11 ][   15 ]
	// [ 1010 ][ 1110 ][ 1011 ][ 1111 ]
	// [    2 ][    6 ][    3 ][    7 ]
	// [ 0010 ][ 0110 ][ 0011 ][ 0111 ]
	// [    8 ][   12 ][    9 ][   13 ]
	// [ 1000 ][ 1100 ][ 1001 ][ 1101 ]
	// [    0 ][    4 ][    1 ][    5 ]
	// [ 0000 ][ 0100 ][ 0001 ][ 0101 ]
	/*
	
	
	LEFT0_TOP0 = 6;
	LEFT0_TOP1 = 14;
	
	LEFT1_TOP0 = 2;
	LEFT1_TOP1 = 10;
	
	RIGHT0_TOP0 = 3;
	RIGHT0_TOP1 = 11;
	RIGHT1_TOP0 = 7;
	RIGHT1_TOP1 = 15;
	
	LEFT0_BOTTOM0 = 12;
	LEFT0_BOTTOM1 = 4;
	LEFT1_BOTTOM0 = 8;
	LEFT1_BOTTOM1 = 0;
	
	RIGHT0_BOTTOM0 = 9;
	RIGHT0_BOTTOM1 = 1;
	RIGHT1_BOTTOM0 = 13;
	RIGHT1_BOTTOM1 = 5;
	
	
	6*6 = 36 is the next digital square nameable
	
	
	
	// [   10 ][   14 ][   11 ][   15 ][   15 ][   15 ]
	// [ 1010 ][ 1110 ][ 1011 ][ 1111 ][   15 ][   15 ]
	// [   10 ][   14 ][   11 ][   15 ][   15 ][   15 ]
	// [ 1010 ][ 1110 ][ 1011 ][ 1111 ][   15 ][   15 ]
	// [   10 ][   14 ][   11 ][   15 ][   15 ][   15 ]
	// [ 1010 ][ 1110 ][ 1011 ][ 1111 ][   15 ][   15 ]
	// [    2 ][    6 ][    3 ][    7 ][   15 ][   15 ]
	// [ 0010 ][ 0110 ][ 0011 ][ 0111 ][   15 ][   15 ]
	// [    8 ][   12 ][    9 ][   13 ][   15 ][   15 ]
	// [ 1000 ][ 1100 ][ 1001 ][ 1101 ][   15 ][   15 ]
	// [    0 ][    4 ][    1 ][    5 ][   15 ][   15 ]
	// [ 0000 ][ 0100 ][ 0001 ][ 0101 ][   15 ][   15 ]
	
	8*8 = 64 is the next digital square nameable
	
	
	10*10 = 100 is a square that can be pointed out by percent (left|right) (top|bottom) (0|.2|.4|.6|.8|1)
	
	*/

	document.onselectstart = function() { return false; };
	
	function setStyle(target,style) { for(var key in style) { target.style[key] = style[key]; } }
	
	
	var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();
	
	
	var window_width = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
	window_height = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
	
	origin_lt.style.position = "absolute";
	origin_lt.style.top = "0px";
	origin_lt.style.left = "0px";
	origin_lt.style.width = window_width+"px";
	origin_lt.style.height = window_height+"px";
	

	function clear() {
		origin_lt_container.elementsClear();
	}
	
	function number_table_page(start) {
		var str = [];
		str.push("<br/><br/><center><div id=\"table_container\"><table id=\"number_table\" cellpadding=\"0\" cellspacing=\"0\">");
		for(var x = 0; x < 4;x++) {
			str.push("<tr height=\"50\">");
			for(var y = 0; y < 4;y++) {
				var pos = x*4+y;
				str.push("<td id=\"decimal_label_"+pos+"\"></td><td id=\"hexadecimal_label_" +pos+ "\"></td><td id=\"binary_label_"+pos+"\"></td>");
			}
			str.push("</tr>");
		}
		str.push("</table>\
			<table id=\"number_table_page_controller\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\
				<tr height=\"30\">\
					<td id=\"number_table_page_previous\" width=\"50%\"></td>\
					<td id=\"number_table_page_next\" width=\"50%\"></td>\
				</tr>\
			</table></div></center>");
		var p = origin_lt_container.elementNewPacket(str.join(""));
		p.el.number_table_page_controller.style.borderTop = "solid 1px #000";
		
		
		var controls = [];
		
		
		function padl(str,sz,ch) {
			var s = "", a = str.length, b = sz; while( a < b ) { s += ch; a += 1; } return s + str;
		}
		
		
		function Control1(index) {
			function setStyle(target,style) { for(var key in style) { target.style[key] = style[key]; } }
			
			var _a = p.el["decimal_label_"+index],
				_b = p.el["hexadecimal_label_"+index],
				_c = p.el["binary_label_"+index];
			_a.innerHTML = padl(""+(start+index),2,"0");
			_b.innerHTML = padl((start+index).toString(16),1,"0");
			_c.innerHTML = padl(""+(start+index).toString(2),4,"0");
			
			setStyle(_a,{ cursor : "default", paddingLeft : "5px" });
			setStyle(_b,{ cursor : "default", paddingLeft : "5px", paddingRight : "5px" });
			setStyle(_c,{ cursor : "default", paddingRight : "5px" });
			
			Object.defineProperty(this,"a",function() { return _a; });
			Object.defineProperty(this,"b",function() { return _b; });
			Object.defineProperty(this,"c",function() { return _c; });
			this.state = 0;
			this.enable = true;
			this.index = index;
			var self = this;
			function over() {
				console.log("over",self.state,self.index);
				if(self.state==0) {
					var common_style = { backgroundColor : "#00F", color : "#FFF" };
					setStyle(_a,common_style); setStyle(_b,common_style); setStyle(_c,common_style);
				} else if(self.state==1) {
					setStyle(this,{ backgroundColor : "#F00", color : "#FFF" });
					if(this == _a) setStyle(_a,common_style);
					if(this == _b) setStyle(_b,common_style);
					if(this == _c) setStyle(_c,common_style);
				} else if(self.state == -1) {
					var common_style = { backgroundColor : "#FFF", color : "#000" };
					setStyle(_a,common_style); setStyle(_b,common_style);	setStyle(_c,common_style);
				}
			}
			function out() {
				if(self.state==0) {
					var common_style = { backgroundColor : "#FFF", color : "#000" };
					setStyle(_a,common_style); setStyle(_b,common_style);	setStyle(_c,common_style);
				} else if(self.state==1) {
					setStyle(this,{ backgroundColor : "#EEE", color : "#000" });
					if(this == _a) setStyle(_a,common_style);
					if(this == _b) setStyle(_b,common_style);
					if(this == _c) setStyle(_c,common_style);
				} else if(self.state == -1) {
					var common_style = { backgroundColor : "#FFF", color : "#000" };
					setStyle(_a,common_style); setStyle(_b,common_style);	setStyle(_c,common_style);
				}
			}
			function click() {
				if(self.state==0) {
					for(var x = 0; x < controls.length;x++) {
						controls.state = -1;
					}
					var common_style = { backgroundColor : "#EEE", color : "#000" };
					setStyle(_a,common_style); setStyle(_b,common_style);	setStyle(_c,common_style);
					setStyle(this,{ backgroundColor : "#F00", color : "#FFF" });
					self.state = 1;
				} else if(self.state == 1) {
					for(var x = 0; x < controls.length;x++) {
						controls.state = 0;
					}
					var common_style = { backgroundColor : "#00F", color : "#FFF" };
					if(this == _a) {
						localStorage.setItem( "number", JSON.stringify({ value : _a.innerHTML, number : (start+index), format : "decimal" }) );
					}
					if(this == _b) {
						localStorage.setItem( "number",JSON.stringify({ value : _b.innerHTML, number : (start+index), format : "hexadecimal" }) );
					}
					if(this == _c) {
						localStorage.setItem( "number",JSON.stringify({ value : _c.innerHTML, number : (start+index), format : "binary" }) );
					}
					setStyle(_a,common_style);
					setStyle(_b,common_style);
					setStyle(_c,common_style);
					self.state = 0;
				} else if(self.state==-1 ) {
					// cancel the current
					
				}
			}
			_a.addEventListener("mouseover",over,false);
			_b.addEventListener("mouseover",over,false);
			_c.addEventListener("mouseover",over,false);
			_a.addEventListener("mouseout",out,false);
			_b.addEventListener("mouseout",out,false);
			_c.addEventListener("mouseout",out,false);
			_a.addEventListener("click",click,false);
			_b.addEventListener("click",click,false);
			_c.addEventListener("click",click,false);
			
		}
		
		for(var x = 0; x < 16;x++) {
			var control = new Control1(x);
			controls.push(control);
		}
		
		p.el.table_container.style.border = "solid 1px #000";
		p.el.table_container.style.width = p.el.number_table.clientWidth + "px";
		
		p.el.number_table_page_previous.innerHTML = "previous";
		p.el.number_table_page_next.innerHTML = "next";
		
		setStyle( p.el.number_table_page_previous, { cursor : "default", textAlign : "center"} );
		setStyle( p.el.number_table_page_next, { cursor : "default", textAlign : "center" } );
		
		p.el.number_table_page_previous.addEventListener("mouseout",function() {
			setStyle(p.el.number_table_page_previous,{ backgroundColor : "#fff", color : "#000" });
		});	
		p.el.number_table_page_next.addEventListener("mouseout",function() {
			setStyle(p.el.number_table_page_next,{ backgroundColor : "#fff", color : "#000" });
		});	
		p.el.number_table_page_previous.addEventListener("mouseover",function() {
			setStyle(p.el.number_table_page_previous,{ backgroundColor : "#000", color : "#fff" });
		});	
		p.el.number_table_page_next.addEventListener("mouseover",function() {
			setStyle(p.el.number_table_page_next,{ backgroundColor : "#000", color : "#fff" });
		});	
		
		
		p.el.number_table_page_previous.addEventListener("click",function() {
			if( start >= 16) {
				clear();
				number_table_page(start-16);
			}
		});
		p.el.number_table_page_next.addEventListener("click",function() {
			clear();
			number_table_page(start+16)
		});
	}
	number_table_page(0);
	
	
	
	
	
	
	
},function() {
	document.onselectstart = selection_start_backup;
});