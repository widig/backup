UI.boot(function() {
	// clear all previous html components, that might be saved with save file.
	
	var body = document.getElementsByTagName("body")[0];
	body.visited = false;
	var stack = [body];
	// remove leafs before
	var k = 0;
	while(stack.length>0) {
		var item = stack.pop();
		//console.log(k++,item);
		
		var pushed = false;
		
		if( item.childNodes.length > 0 && item.visited == false) {
			item.visited = true;
			stack.push(item);
			
			
			for(var x = 0; x < item.childNodes.length;x++) {
				item.childNodes[x].visited = false;
				stack.push( item.childNodes[x] );
			}
			
			pushed = true;
			
		}
		
		var removed = false;
		
		if(!pushed && stack.length>0 && item!= body) { // leaf
			if(item.parentNode!=null)
				item.parentNode.removeChild( item );
			removed = true;
		}
		
		if(item.visited && !removed && stack.length>0 && item != body) { // maybe not leaf but already used
			item.parentNode.removeChild( item );
			removed = true;
		}
		
	}
	
	
	console.log("[UI.boot]");

})
UI.init(function() {
	// app mode
	console.log("[UI.init]");
	
	History.on("load",function(state) {
		console.log("loading:["+state+"]");
	});
	History.on("unload",function(state) {
		console.log("unloading:["+state+"]");
	});
	History.init();
	
	//console.log("-- STYLES");
	UI.Body.style.printList();
	console.log();
	
	
	/*
	var start_page = "home";
	var range_resolution = [640,800,960,1024,1152,1280,1360,1440,1680,1920,1920];
	var default_resolution = 10;
	var selected_resolution = -1;
	var activated = false;
	
	function set_resolution_mode(res) {
		var hash = History.getHash();
		var hash_arr = hash.split(":");
		if(hash_arr.length>0) {
			if(hash_arr[0]=="") hash_arr[0] = start_page;
			if(hash_arr.length>1) hash_arr.pop();
			hash = hash_arr.join(":");
		} else {
			hash = start_page;
		}
		//console.log("hash:",hash.split(":"),"res:", res);
		if(res) {
			if(hash=="") { History.go("#"+start_page+":"+res); }
			if( hash.split(":").length <= 1 ) { History.go("#" + hash + ":" + res); }
		} else {
			if(hash=="") { History.go("#"+start_page); }
			if( hash.split(":").length <= 1 ) { History.go("#" + hash); }
		}
	}
	function select_resolution_mode() {
		for(var x = 0; x < range_resolution.length;x++) {
			if(x==0 && window.innerWidth < range_resolution[x]) {
				if(selected_resolution==-1 || selected_resolution!=x) {
					set_resolution_mode((range_resolution[x])>>>1);
					selected_resolution = x;
				}
				break;
			} else if(x>0 && window.innerWidth >= range_resolution[x-1] && window.innerWidth < range_resolution[x] && (x-1)!=selected_resolution) {
				if(selected_resolution==-1 || selected_resolution!=x) {
					set_resolution_mode(range_resolution[x-1]);
					selected_resolution = x;
				}
				break;
			} else if(window.innerWidth >= range_resolution[x] && x == range_resolution.length-1) {
				if(selected_resolution==-1 || selected_resolution!=x) {
					set_resolution_mode(range_resolution[x]);
					selected_resolution = x;
				}
				break;
			} else if(x==range_resolution.length-1) {
				if(selected_resolution==-1 || selected_resolution!=x) {
					set_resolution_mode(range_resolution[default_resolution]);
					selected_resolution = default_resolution;
				}
			}
		}
	}
	select_resolution_mode();
	*/
	
	var start_page = "home";
	var csrf_cookie = localStorage.getItem("csrf-cookie");
	if(csrf_cookie == null || csrf_cookie == undefined || csrf_cookie == "undefined") {
		start_page = "login";
	} else {
		Import({url:"/json.login",method:"get",json:true,data:{csrf_cookie:csrf_cookie}})
			.done(function(data) {
				// if fail to authenticate then load login screen
				if(data.result) {
					start_page = "home";
				} else {
					start_page = "login";
				}
			})
			.fail(function(error) {
			})
			.send();
			
	}
	
	var hash = History.getHash();
	var hash_arr = hash.split(":");
	if(hash_arr.length>0) {
		if(hash_arr[0]=="") hash_arr[0] = start_page;
		hash = hash_arr.join(":");
	} else {
		hash = start_page;
	}
	History.go("#"+hash);
	
	UI.Window.on("resize",function() {
		//select_resolution_mode();
	});
	
});
