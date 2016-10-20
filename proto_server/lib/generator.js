
var fs = require("fs");

function generator(file) {
	function doc_start() {
		var doc = [];
		doc.push("<!doctype html>");
		doc.push("<html>");
		doc.push("<head>");
		return doc;
	}
	function doc_end(doc) {
		doc.push("</head>");
		doc.push("<body>");
		doc.push("</body>");
		doc.push("</html>");
		return doc;
	}
	if(Object.prototype.toString.apply(file) == "[object Array]") {
		return function(req,res) {
			var doc = doc_start();
			doc.push("<script>");
			for(var x = 0; x < file.length;x++) doc.push( fs.readFileSync(file[x],"utf8") );
			doc.push("</script>");
			doc_end(doc);
			res.send(doc.join(""));
		}
	} else if(Object.prototype.toString.apply(file) == "[object String]" ) {
		return function(req,res) {
			var doc = doc_start();
			doc.push("<script>");
			doc.push( fs.readFileSync(file,"utf8") );
			doc.push("</script>");
			doc_end(doc);
			res.send(doc.join(""));
		}
	} else if(Object.prototype.toString.apply(file) == "[object Object]" ) {
		return function(req,res) {	
			var scripts = [];
			var styles = [];
			if("scripts" in file) {
				var json = JSON.parse( fs.readFileSync(file.scripts,"utf8") );
				scripts.push("<script>");
				for(var x = 0; x < json.length;x++) scripts.push( fs.readFileSync(json[x],"utf8") );
				scripts.push("</script>");
			}
			if("styles" in file) {
				var json = JSON.parse( fs.readFileSync(file.styles,"utf8") );
				styles = [];
				for(var x = 0; x < json.length;x++) 
					styles.push( "<link rel=\"stylesheet\" href=\""+json[x]+"\"/>" );
			}
			//lib/codemirror.css
			var doc = doc_start();
			doc.push(styles.join("\r\n"));
			doc.push(scripts.join("\r\n"));
			doc_end(doc);
			res.send(doc.join(""));
		}
		
	}
}

module.exports = generator;