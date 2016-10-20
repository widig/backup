
'use strict';
var inquirer = require("inquirer");
var fs = require("fs");
var http = require("http");
var child_process = require("child_process");
var _ = require("lodash");

console.log('Hi, welcome to Node Form');

var projects = [];
var files = fs.readdirSync("../.");
for(var x = 0; x < files.length;x++) {
	if( fs.statSync("../" + files[x]).isDirectory() ) {
		projects.push(files[x]);
	}
} 
function boot() {

	while(projects.length>0) projects.pop();
	
	var files = fs.readdirSync("../.");
	for(var x = 0; x < files.length;x++) {
		if( fs.statSync("../" + files[x]).isDirectory() ) {
			projects.push(files[x]);
		}
	} 

	
	projects.push("[ADD NEW PROJECT]");
	projects.push("[EXIT]");
	var questions = [
		{
			type: 'list',
			name: 'project',
			message: 'Select project:',
			choices: projects,
			filter: function (val) {
				if(val == "[EXIT]") {
					return 0;
				} else if(val == "[ADD NEW PROJECT]") {
					return 1;
				} else {
					return val;
				}
			}
		}
	];
	inquirer.prompt(questions).then(function (answers) {
		if( answers.project === 0) {
		
		} else if( answers.project === 1) {
			createProject();
		} else {
			manageProject(answers.project);
			//console.log('\nOrder receipt:');
			//console.log(JSON.stringify(answers, null, '  '));
		}
	});
}
boot();

function createProject() {
	var questions = [
		{
			type: 'input',
			name: 'name',
			message: 'What\'s your project name?',
			validate: function (value) {
			
				for(var x = 0; x < projects.length;x++) {
					if(projects[x] == value) return "project with name \"" + value + "\" already exists, choose another that do not match these:" + JSON.stringify(projects);
				}
				return true;
			}
		},
		{
			type: 'list',
			name: 'type',
			message: 'Select project type:',
			choices: ["add html directory","add html form","add node server","add class"],
			filter: function (val) {
				return val;
			}
		}
	];
	inquirer.prompt(questions).then(function (answers) {
		fs.mkdirSync("..\\" + answers.name);
		var info = {};
		if(answers.type =="add html directory") {
			info.type = answers.type;
			info.version = [1,0,0];
			info.files = ["info.json"];
		} else if(answers.type =="add html form") {
			info.type = answers.type;
			info.version = [1,0,0];
			info.files = ["info.json"];
		} else if(answers.type =="add node server") {
			info.type = answers.type;
			info.version = [1,0,0];
			info.files = ["info.json","meta.json","server.js","log.txt"];
			createNodeServer(answers.name);
		} else if(answers.type=="add class") {
			info.type = answers.type;
			info.version = [1,0,0];
			createClass(answers.name);
		}
		fs.writeFileSync("..\\" + answers.name + "\\info.json",JSON.stringify(info));
	});
}
function createNodeServer(projectName) {
	var questions = [
		{
			type: 'input',
			name: 'port',
			message: 'Select port:',
			default : 80,
			validate: function (val) {
				try {
					var v = parseInt(val);
					if( parseInt(val) == parseFloat(val) && v >=0 && v < 65536) {
						return true;
					}
				} catch(e) {
				
				}
				return "must be an short [0-65535]";
			}
		}
	];
	inquirer.prompt(questions).then(function (answers) {
		var meta = {};
		meta.port = answers.port;
		meta.host = "127.0.0.1";
		meta.terminate_token = "0000-0000-0000-0000";
		meta.running = false;
		fs.writeFileSync("..\\" + projectName + "\\meta.json", JSON.stringify(meta));
		fs.writeFileSync("..\\" + projectName + "\\server.js", fs.readFileSync(".\\patterns\\node_server.js","utf8") );
		manageProject(projectName);
	});
}
function manageProject(projectName) {
	// try load project info json
	if( fs.existsSync("..\\" + projectName + "\\info.json") ) {
		var project_info = JSON.parse( fs.readFileSync("..\\" + projectName + "\\info.json") );
		
		var dt = new Date();
		var keep = "[ KEEP ]";
		
		var choices = [keep,"[REMOVE PROJECT]"];
		if(project_info.type == "node server") {
			// check if server if online
			choices.push("[START SERVER]");
			choices.push("[STOP SERVER]");
			choices.push("[CHECK SERVER STATUS]");
			choices.push("[ADD STATIC DIRECTORY]");
			choices.push("[REFRESH]"); /*
				stop server
				remove project
				start project // copy server code to project 
				start server
			*/
		}
		var questions = [
			{
				type: 'list',
				name: 'type',
				message: 'Select action type:',
				choices: choices,
				filter: function (val) {
					if(val == keep) {
						return 0;
					} else if(val == "[REMOVE PROJECT]") {
						return 1;
					} else if(val == "[START SERVER]") {
						return 2;
					} else if(val == "[STOP SERVER]") {
						return 3;
					} else if(val == "[CHECK SERVER STATUS]") {
						return 4;
					} else if(val == "[ADD STATIC DIRECTORY]") {
						return 5;
					} else if(val == "[REFRESH]") {
						return 6;
					}
					return val;
				}
			}
		];
		inquirer.prompt(questions).then(function (answers) {
			if(answers.type == 0) {
				// do nothing (EXIT);
				manageProject(projectName);
			} else if(answers.type == 1) {
				var questions2 = [
					{
						type: 'confirm',
						name: 'confirmRemove',
						message: 'Are you sure you want to remove this project?',
						default: false
					  },
				];
				inquirer.prompt(questions2).then(function (answers2) {
					if(answers2.confirmRemove) {
						for(var x = 0; x < project_info.files.length;x++) {
							fs.unlinkSync("..\\" + projectName + "\\" + project_info.files[x]);
						}
						fs.rmdirSync("..\\" + projectName);
						boot();	
					} else {
						manageProject(projectName);
					}
				});
				
			} else if(answers.type == 2) {
			
				var project_meta = JSON.parse( fs.readFileSync("..\\" + projectName + "\\meta.json") );
				function hexc() {
					return (Math.random()*16 >>>0).toString(16);
				}
				project_meta.terminate_token = 
					hexc() + hexc() + hexc() + hexc() + "-" +
					hexc() + hexc() + hexc() + hexc() + "-" + 
					hexc() + hexc() + hexc() + hexc() + "-" + 
					hexc() + hexc() + hexc() + hexc();
				
				fs.writeFileSync("..\\" + projectName + "\\meta.json", JSON.stringify(project_meta));
				
				child_process.exec("node server.js",{cwd:"..\\" + projectName},function(err,stdout,stderr) {
					console.log(stdout);
				});
				
				manageProject(projectName);
				
			} else if(answers.type == 3) {
				try {
					var project_meta = JSON.parse( fs.readFileSync("..\\" + projectName + "\\meta.json") );
					//console.log( project_meta.terminate_token );
					var postData = require('querystring').stringify({
						'msg' : 'shutdown',
						'token' : project_meta.terminate_token
					});
					var options = {
						hostname: '127.0.0.1',
						port: 80,
						path: '/action',
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Content-Length': Buffer.byteLength(postData)
						}
					};
					var req = http.request(options, (res) => {
						//console.log(`STATUS: ${res.statusCode}`);
						//console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
						res.setEncoding('utf8');
						res.on('data', (chunk) => {
							//console.log(`BODY: ${chunk}`);
						});
						res.on('end', () => {
							//console.log('No more data in response.');
							manageProject(projectName);
						});
						
					});
					req.on('error', (e) => {
						console.log(`problem with request: ${e.message}`);
					});
					// write data to request body
					req.write(postData);
					req.end();
					
					
				} catch(e) {
					console.log(e);
					console.log(e.stack);
				}
				
			} else if(answers.type == 6 ) {
			
				console.log("stop server");
				try {
					var project_meta = JSON.parse( fs.readFileSync("..\\" + projectName + "\\meta.json") );
					//console.log( project_meta.terminate_token );
					var postData = require('querystring').stringify({
						'msg' : 'shutdown',
						'token' : project_meta.terminate_token
					});
					var options = {
						hostname: 'localhost',
						port: 80,
						path: '/action',
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Content-Length': Buffer.byteLength(postData)
						}
					};
					var req = http.request(options, (res) => {
						//console.log(`STATUS: ${res.statusCode}`);
						//console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
						console.log("->> request");
						res.setEncoding('utf8');
						res.on('data', (chunk) => {
							//console.log(`BODY: ${chunk}`);
						});
						res.on('end', () => {
							
							
							// end of stop project -> 
							
							console.log("remove project");
							
							
							
							/*
							var project_meta = JSON.parse( fs.readFileSync("..\\" + projectName + "\\meta.json") );
							function hexc() {
								return (Math.random()*16 >>>0).toString(16);
							}
							project_meta.terminate_token = 
								hexc() + hexc() + hexc() + hexc() + "-" +
								hexc() + hexc() + hexc() + hexc() + "-" + 
								hexc() + hexc() + hexc() + hexc() + "-" + 
								hexc() + hexc() + hexc() + hexc();
							
							fs.writeFileSync("..\\" + projectName + "\\meta.json", JSON.stringify(project_meta));
							
							child_process.exec("node server.js",{cwd:"..\\" + projectName},function(err,stdout,stderr) {
								console.log(stdout);
							});
							// end of remove project ->
							
							console.log("create project");
							
							var meta = {};
							meta.port = answers.port;
							meta.host = "127.0.0.1";
							meta.terminate_token = "0000-0000-0000-0000";
							meta.running = false;
							fs.writeFileSync("..\\" + projectName + "\\meta.json", JSON.stringify(meta));
							fs.writeFileSync("..\\" + projectName + "\\server.js", fs.readFileSync(".\\patterns\\node_server.js","utf8") );
							
							
							
							// end of create project ->
							
							console.log("start server");
							var project_meta = JSON.parse( fs.readFileSync("..\\" + projectName + "\\meta.json") );
							function hexc() {
								return (Math.random()*16 >>>0).toString(16);
							}
							project_meta.terminate_token = 
								hexc() + hexc() + hexc() + hexc() + "-" +
								hexc() + hexc() + hexc() + hexc() + "-" + 
								hexc() + hexc() + hexc() + hexc() + "-" + 
								hexc() + hexc() + hexc() + hexc();
							
							fs.writeFileSync("..\\" + projectName + "\\meta.json", JSON.stringify(project_meta));
							
							child_process.exec("node server.js",{cwd:"..\\" + projectName},function(err,stdout,stderr) {
								console.log(stdout);
							});
							
							manageProject(projectName);
							*/
							
							
						});
						
					});
					req.on('error', (e) => {
						console.log(`problem with request: ${e.message}`);
					});
					// write data to request body
					req.write(postData);
					req.end();
					
					
				} catch(e) {
					console.log(e);
					console.log(e.stack);
				}
			} else {
				boot();
			}
		});
	} else {
		console.log("Project doesn't has an info file.");
		boot();
	}
	
}




