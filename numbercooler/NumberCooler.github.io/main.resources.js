

Router.addPage({name:"resources",template:"base"},function(args,template,router) { // name
	var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();
	
	// local
	
	// remote
	
	// temporary (copy paste files from explorer)
		// upload
		// clipboard
	
	UI.Document.on("paste",function(e) {
		
		for(var i in e.clipboardData) {
			console.log(">>",i,e.clipboardData[i]);
		}
		window.M = e.clipboardData;
		var b = e.clipboardData.getData('File');
		console.log(b);
		//console.log("A", M.getData("text/uri-list") );
		//console.log("B", M.getData("text/plain") );
		//console.log("C", M.getData("application/octet-stream") );
		console.log("PART1");
		for (var i = 0 ; i < e.clipboardData.items.length ; i++) {
			var clipboardItem = e.clipboardData.items[i];
			var type = clipboardItem.type;
			console.log("D", clipboardItem.kind, clipboardItem.type);	
			//console.log("A", M.getData("text/uri-list") );
			try {
				var blob = clipboardItem.getAsFile();
				console.log("blob worked.");
				var reader = new FileReader();
				reader.onload = function(event){
					console.log("B",event.target.result)
				}; // data url!
				reader.readAsBinaryString(blob);
				
			} catch(e) {
				
			}
		}
		console.log("PART2");
		var items = (e.clipboardData || e.originalEvent.clipboardData).items;
		console.log("A",JSON.stringify(items)); // will give you the mime types
		for (index in items) {
			var item = items[index];
			console.log("J","[",item.kind,"][",item.type,"]",item.name,index,item, typeof(item),typeof(items));
			
			
			if (item.kind === 'file') {
				var blob = item.getAsFile();
				var reader = new FileReader();
				reader.onload = function(event){
					console.log("B",event.target.result)
				}; // data url!
				reader.readAsBinaryString(blob);
			}
		}
		console.log("PART3");
		var items2 = (e.clipboardData || e.originalEvent.clipboardData).files;
		console.log("Q",JSON.stringify(items2)); // will give you the mime types
		for (index in items2) {
			var item2 = items2[index];
			console.log("M","[",item2.kind,"][",item2.type,"]",item2.name,index,item2,typeof(item2),typeof(items2));
			
			if (item.kind === 'file') {
				var blob = item2.getAsFile();
				var reader = new FileReader();
				reader.onload = function(event){
					console.log("Z",event.target.result)
				}; // data url!
				reader.readAsBinaryString(blob);
			}
		}
		
		
		
	});
	
	
});