var fs = require("fs");
var path = require("path");

// file version
// no session / atomic


module.exports = function(req,res) {
	function auth(req,res,ok,fail) {
		if( "username" in req.query && req.query.username.length > 0 && "password" in req.query && req.query.password.length > 0) {
			if(fs.existsSync("config" + path.sep + req.query.username)) {
				var file = fs.readFileSync(
					"config" + path.sep + req.query.username + path.sep + "index.json",
					"utf8"
				);
				var json = JSON.parse(file);
				if(json.password == req.query.password) {
					ok(req,res);
				} else {
					fail(req,res);
				}
			} else {
				fail(req,res);
			}
		} else {
			fail(req,res);
		}
	}
	function hasdoc(res,res,ok,fail) {
		if("doc" in req.query && req.query.doc.length > 0) {
			if( fs.existsSync("config" + path.sep + req.query.username + path.sep + req.query.doc + ".json") ) {
				ok(req,res);
			} else {
				fail(req,res);
			}
		} else {
			fail(req,res);
		}
	}
	if(req.params.first == "action") {
		if("verb" in req.query && req.query.verb.length>0) {
			if(req.query.verb == "adduser") {
				if( "username" in req.query && req.query.username.length > 0 && "password" in req.query && req.query.password.length > 0) {
					if(!fs.exists("config" + path.sep + req.query.username)) {
						fs.mkdirSync("config" + path.sep + req.query.username);
						fs.writeFileSync(
							"config" + path.sep + req.query.username + path.sep + "index.json",
							JSON.stringify( { username : req.query.username, password : req.query.password } ),
							"utf8"
						);
						res.json({result : true});
						return;
					}
				} else {
					res.json({result:false});
					return;
				}
			} else if(req.query.verb == "listusers") {
				var data = fs.readdirSync("config");
				var rdata = [];
				for(var x = 0; x < data.length;x++) {
					if( fs.statSync("config" + path.sep + data[x]).isDirectory() ) {
						rdata.push(data[x]);
					}
				} 
				res.json({result:true,data:rdata});
				return;
			} else if( req.query.verb == "private_adddoc") {
				// http://localhost/action?verb=private_adddoc&username=root&password=pass&doc=data&value={}
				auth(req,res,function(req,res) {
					hasdoc(req,res,function(req,res) {
						if("doc" in req.query && req.query.doc.length>0) {
							res.json({result:false,message:"document do exists."});
						} else {
							res.json({result:false,message:"missing doc argument."});
						}
					},function(req,res) {
						if("doc" in req.query && req.query.doc.length>0) {
							if("value" in req.query && req.query.value.length>0) {
								try {
									fs.writeFileSync(
										"config" + path.sep + req.query.username + path.sep + req.query.doc + ".json",
										JSON.stringify( JSON.parse( req.query.value ) ),
										"utf8"
									);
									res.json({result:true});
								} catch(e) {
									res.json({result:false,message:"value is not in json format."});
								}
							} else {
								res.json({result:false,message : "missing value argument."});
							}
						} else {
							res.json({result:false,message:"missing doc argument."});
						}
					});
				},function(req,res) {
					res.json({result:false,message:"authentication failed."});
				});
				return;
			} else if( req.query.verb == "private_subdoc") {
				auth(req,res,function(req,res) {
					hasdoc(req,res,function(req,res) {
						fs.unlinkSync(
							"config" + path.sep + req.query.username + path.sep + req.query.doc + ".json"
						);
						res.json({result:true});
					},function(req,res) {
						res.json({result:false, message:"document do not exists."});
					});
				},function(req,res) {
					res.json({result:false,message:"authentication failed."});
				});
				return;
			} else if( req.query.verb == "private_getdoc") {
				auth(req,res,function(req,res) {
					hasdoc(req,res,function(req,res) {
						var file = fs.readFileSync(
							"config" + path.sep + req.query.username + path.sep + req.query.doc + ".json",
							"utf8"
						);
						res.json({result:true, data : JSON.stringify( JSON.parse(file) ) });
					},function(req,res) {
						res.json({result:false});
					});
					
				},function(req,res) {
					res.json({result:false,message:"authentication failed."});
				});
				return;
			} else if( req.query.verb == "private_setdoc") {
				auth(req,res,function(req,res) {
					if("doc" in req.query && req.query.doc.length>0) {
						fs.writeFileSync(
							"config" + path.sep + req.query.username + path.sep + req.query.doc + ".json",
							JSON.stringify( JSON.parse( req.query.value ) ),
							"utf8"
						);
						res.json({result:true});
					} else {
						res.json({result:false});
					}
				},function(req,res) {
					res.json({result:false,message:"authentication failed."});
				});
				return;
			} else if( req.query.verb == "private_listdocs") {
				auth(req,res,function(req,res) {
					var data = fs.readdirSync("config" + path.sep + req.query.username);
					var rdata = [];
					for(var x = 0; x < data.length;x++) {
						if( fs.statSync("config" + path.sep + req.query.username + path.sep + data[x]).isFile() ) {
							if(data[x] != "index.json") {
								var name = data[x].split(".");
								name.pop();
								rdata.push(name.join("."));
							}
						}
					}
					res.json({result:true,data:rdata});
				},function(req,res) {
					res.json({result:false,message:"authentication failed."});
				});
				return;
			} else if( req.query.verb == "private_setkv") {
				auth(req,res,function(req,res) {
					hasdoc(req,res,function(req,res) {
						
					},function(req,res) {
						res.json({result:false});
					});
				},function(req,res) {
					res.json({result:false,message:"authentication failed."});
				});
				return;
			} else if( req.query.verb == "private_getkv") {
				auth(req,res,function(req,res) {
					hasdoc(req,res,function(req,res) {
						
					},function(req,res) {
						res.json({});
					});
				},function(req,res) {
					res.json({result:false,message:"authentication failed."});
				});
				return;
			} else if( req.query.verb == "public_adddoc") {
				auth(req,res,function(req,res) {
					hasdoc(req,res,function(req,res) {
						//res.json({});
					},function(req,res) {
						
					});
				},function(req,res) {
					//res.json({});
				});
				res.json({result:false,message:"not implemented."});
				return;
			} else if( req.query.verb == "public_subdoc") {
				auth(req,res,function(req,res) {
					hasdoc(req,res,function(req,res) {
						
					},function(req,res) {
						//res.json({});
					});
					
				},function(req,res) {
					//res.json({});
				});
				res.json({result:false,message:"not implemented."});
				return;
			} else if( req.query.verb == "public_getdoc") {
				hasdoc(req,res,function(req,res) {
						
				},function(req,res) {
					//res.json({});
				});
				res.json({result:false,message:"not implemented."});
				return;
			} else if( req.query.verb == "public_setdoc") {
				auth(req,res,function(req,res) {
					hasdoc(req,res,function(req,res) {
						
					},function(req,res) {
						res.json({});
					});
					
				},function(req,res) {
					//res.json({});
				});
				res.json({result:false,message:"not implemented."});
				return;
			} else if( req.query.verb == "public_listdocs") {
				auth(req,res,function(req,res) {
				
				},function(req,res) {
					//res.json({});
				});
				res.json({result:false,message:"not implemented."});
				return;
			} else if( req.query.verb == "public_setkv") {
				auth(req,res,function(req,res) {
					hasdoc(req,res,function(req,res) {
						
					},function(req,res) {
						//res.json({});
					});
				},function(req,res) {
					//res.json({});
				});
				res.json({result:false,message:"not implemented."});
				return;
			} else if( req.query.verb == "public_getkv") {
				
				hasdoc(req,res,function(req,res) {
					
				},function(req,res) {
					//res.json({});
				});
				res.json({result:false,message:"not implemented."});
				return;
			} else {
				res.json({result:false,message:"unkown verb."});
			}
		} else {
			res.json({result:false,message : "missing verb."});
		}
		return;
	} else {
		res.json({result:false,message:"unkown protocol."});
		return;
	}
	res.end();
}