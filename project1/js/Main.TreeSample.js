
UI.init(function() {
	// app mode
	console.log("[UI.init]");
	
	
	
	//console.log("-- STYLES");
	UI.Document.style.printList();
	console.log();
	
	var start_page = "index";
	
	var hash = UI.History.getHash();
	var hash_arr = hash.split(":");
	if(hash_arr.length>0) {
		if(hash_arr[0]=="") hash_arr[0] = start_page;
		hash = hash_arr.join(":");
	} else {
		hash = start_page;
	}
	UI.History.go("#"+hash);
	
	UI.Window.on("resize",function() {
		//select_resolution_mode();
	});
	
});
