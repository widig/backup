

Class.define("Packer",{
	ctor : function() {
	
	
	},
	proto : {
		generateBytes : function(str) {
			var buffer = new Uint8Array(worker_code.length);
			for(var x = 0; x < worker_code.length;x++) {
				var ch = worker_code.charCodeAt(x);
				buffer[x] = ch;
			}
			return buffer;
		},
		generateBlob : function(str,type) {
			return new Blob([ this.generateBytes(str) ], { type : type });
		},
		generateUrl : function(str,type) {
			return URL.createObjectURL(new Blob([ this.generateBytes(str) ], { type : type }));
		},
		generateWorker : function(str) {
			var url = this.generateUrl(str,"application/js");
			return new Worker(url);
		}
		/*
			var worker_code = "self.addEventListener('message', function(e) { console.log(e.data); self.postMessage(\"sent from worker.\"); });";
			var buffer = new Uint8Array(worker_code.length);
			for(var x = 0; x < worker_code.length;x++) {
				var ch = worker_code.charCodeAt(x);
				buffer[x] = ch;
			}
			var blob = new Blob([buffer],{type:"application/js"});
			var url = URL.createObjectURL(blob);
			
			var file = url;
			var w2 = new Worker(file);
			w2.addEventListener("message",function(e){
				console.log(e.data);
			});
			w2.postMessage("sent from client.")
		},
		*/
		
	}
})