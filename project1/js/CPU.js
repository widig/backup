
Class.define("CPU",{
	ctor : function(auth) {
	
		this.internal.CPU.installed = [];
		this.internal.CPU.installedByName = {};
		this.internal.CPU.installedById = {};
		
		this.internal.CPU.installed_log = {}; // removed from services, but still running some instance of worker
		
		this.internal.CPU.running = [];
		this.internal.CPU.runningByName = {};
		this.internal.CPU.runningById = {};
		
		this.internal.CPU.running_log = {}; // custom service data, changed at runtime, must track changes
		
		this.internal.CPU.id_count = 0;
		this.internal.CPU.iid_count = 0;
		this.internal.CPU.crc = 0xAAAAAAAA;
		
	},
	proto : {
		installService : function(auth,name,str) {
			var i = this.internal.CPU;
			var buffer = new Uint8Array(str.length);
			for(var x = 0; x < str.length;x++) {
				var ch = str.charCodeAt(x);
				buffer[x] = ch;
			}
			var blob = new Blob([buffer],{type:"application/js"});
			var url = URL.createObjectURL(blob);
			this.internal.CPU.iid_count++;
			this.internal.CPU.crc = this.internal.CPU.crc ^ this.internal.CPU.iid_count;
			var instance = { // service instance
				name : name,
				code : str,
				url : url,
				check : this.internal.CPU.crc
			};
			i.installed[name] = instance;
		},
		uninstallService : function(auth,name) {
		},
		upgradeService : function(auth,name,str) { // upgrade
		},
		downgradeService : function(auth,name,crc) {
		},
		startWorker : function(auth,name) {
			// return worker
			var instance = { // worker instance
				id : this.internal.CPU.id_count,
				worker : new Worker( this.internal.installed[name] )
			};
			this.internal.CPU.id_count++;
			this.internal.CPU.runningByName[name] = [instance];
			this.internal.CPU.runningById[instance.id] = [instance];
			return instance;
		},
		fireWorker : function(auth,id) {
		},
		replaceWorker : function(auth,id,str) {
		},
		getWorkerCode : function(auth) {
			
		},
		listServices : function() {
			var i = this.internal.CPU;
			var r = [];
			for(var name in i.installed) {
				r.push(name);
			}
			return r;
		},
		listWorkers : function(name) {
			var i = this.internal.CPU;
			var r = {};
			for(var name in i.runningByName) {
				// r[name]
			}
		}
	}
});
