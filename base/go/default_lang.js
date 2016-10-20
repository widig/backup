//<[format:"javascript",version:[5,1]]{rawtext[
var Go = Admin({cmd:"load"},"Go","./Go.js");

function tag(name,set,args) {
	var obj = [
		[name],
		[{$:[]}],
		[]
	];
	set = set || {};
	for(var key in set) {
		obj[1][0].$.push(key);
		obj[1][0][ key ] = set[key];
	}
	args = args || [];
	for(var x = 0; x < args.length;x++) {
		obj[2].push(args[x]);
	}
	return obj;
}
module.exports = function(target,env) {
	// setup to hold common uses of this lang -> call boot
	// option 3:
	target[1][0].memory[1][0].$.push("boot");
	target[1][0].memory[1][0].boot = [["text"],[{$:["value"],value:"{{user}}/boot.bs"}],[]];
	
	target[1][0].memory[1][0].$.push("$logic");
	target[1][0].memory[1][0].$logic = 1;
	
	target[1][0].memory[1][0].$.push("$customSentencesId");
	target[1][0].memory[1][0].$customSentencesId = 0;
	
	target[1][0].runtime[1][0].$.push("$tag");
	target[1][0].runtime[1][0].$tag = [["$tag"],[{$:[]}],[]];
	
	target[1][0].runtime[1][0].$.push("$attrib");
	target[1][0].runtime[1][0].$attrib = [["$attrib"],[{$:[]}],[]];
	
	target[1][0].runtime[1][0].$.push("$document");
	target[1][0].runtime[1][0].$attrib = [["$document"],[{$:[]}],[]];
	
	target[1][0].runtime[1][0].$.push("$timer");
	target[1][0].runtime[1][0].$attrib = [["$timer"],[{$:[]}],[
		[["spareTime"],[{$:["value"],value:0}],[]] // time trying to match previous found syntaxes on spare time that may lead to same results with low arguments modification (self improve), calculate timings to decide what is better. the start search is tiped by creator, and can jump mutate based on results and loaded spare programs.
	]]; // used to split data streams from real world plus parsed at runtime in inside scope. the digital era is delaying live frequency of unkown locations that are not being live living, cause world is mapped, that brings matrix as an unavoidable objective.
	
	var obj = {};
	obj.contexts = {
		data : {},
		create : function(name) {
			this.data[name] = {
				
			};
		},
		destroy : function(name) {
			delete this.data[name];
		}
	};
	obj.lang = tag("lang",{},[
		tag("LexicalTokenBaseCharSpaceNl",{},[
			tag("option",{},[ tag("charset",{value:" \t\r\n"}) ])									// 0
		]),
		tag("LexicalTokenBaseCharSpaceNlOpt",{},[
			tag("option",{},[ tag("ruleItem",{value:"LexicalTokenBaseCharSpaceNl"}) ]),				// 0
			tag("option",{},[ tag("tautology") ])													// 1
		]),
		tag("LexicalTokenBaseArraySpaceNl",{},[
			tag("option",{},[ tag("oneOrMoreRules",{value:"LexicalTokenBaseCharSpaceNl"}) ])		// 0
		]),
		tag("LexicalTokenBaseArraySpaceNlOpt",{},[
			tag("option",{},[ tag("oneOrMoreRules",{value:"LexicalTokenBaseCharSpaceNl"}) ]),		// 0
			tag("option",{},[ tag("tautology") ])													// 1
		]),
		tag("LexicalTokenBaseCharSpace",{},[
			tag("option",{},[tag("charset",{value:" "})])											// 0
		]),
		tag("LexicalTokenBaseCharSpaceOpt",{},[
			tag("option",{},[tag("ruleItem",{value:"LexicalTokenBaseCharSpace"})]),					// 0
			tag("option",{},[tag("tautology")])														// 1
		]),
		tag("LexicalTokenBaseArraySpace",{},[
			tag("option",{},[ tag("oneOrMoreRules",{value:"LexicalTokenBaseCharSpace"}) ])			// 0
		]),
		tag("LexicalTokenBaseArraySpaceOpt",{},[
			tag("option",{},[tag("oneOrMoreRules",{value:"LexicalTokenBaseCharSpace"})]),			// 0
			tag("option",{},[tag("tautology")])														// 1
		]),
		tag("LexicalTokenBaseDotOpt",{},[
			tag("option",{},[tag("string",{value:"."})]), 											// 0
			tag("option",{},[tag("tautology")])														// 1
		]),
		tag("LexicalTokenBaseCharPunc",{},[
			tag("option",{},[tag("charset",{value:"`~!@#$%^&*()_+-[]{}|;:,.?<>/="})])				// 0
		]),
		tag("LexicalTokenBaseCharAlpha",{},[
																									// 0
			tag("option",{},[tag("charset",{value:"abcdefghijklmnopqrstuvwxyz\
ABCDEFGHIJKLMNOPQRSTUVWXYZ"})])
		]),
		tag("LexicalTokenBaseCharDecimalDigit",{},[
			tag("option",{},[tag("charset",{value:"0123456789"})])
		]),
		tag("LexicalTokenBaseDQSCchar",{},[
			tag("option",{},[tag("string",{value:"\\\n"})]),										// 0
			tag("option",{},[tag("string",{value:"\\\r\n"})]),										// 1
			tag("option",{},[tag("string",{value:"\\\\"})]),										// 2
			tag("option",{},[tag("string",{value:"\\\""})]),										// 3
			tag("option",{},[tag("string",{value:" "})]),											// 4
			tag("option",{},[tag("ruleItem",{value:"LexicalTokenBaseCharAlpha"})]),					// 5
			tag("option",{},[tag("ruleItem",{value:"LexicalTokenBaseCharDecimalDigit"})]),			// 6
			tag("option",{},[tag("ruleItem",{value:"LexicalTokenBaseCharPunc"})])					// 7
		]),
		tag("LexicalTokenBaseDQSC",{},[
			tag("option",{},[tag("zeroOrMoreRules",{value:"LexicalTokenBaseDQSCchar"})])			// 0
		]),
		tag("TypeString",{},[
			tag("option",{},[																		// 0
				tag("string",{value:"\""}),
				tag("ruleItem",{value:"LexicalTokenBaseDQSC"}),
				tag("string",{value:"\""})
			])
		]),
		
		tag("TypeNumberInteger",{},[
			tag("option",{},[
				tag("oneOrMoreRules",{value:"LexicalTokenBaseCharDecimalDigit"})
			])
		]),
		tag("TypeNumber",{},[
			tag("option",{},[
				tag("ruleItem",{value:"TypeNumberInteger"})
			])
		]),
		tag("mainBegin",{},[
			tag("option",{},[tag("tautology")])
		]),
		tag("mainEnd",{},[
			tag("option",{},[tag("tautology")])
		]),
		tag("main",{},[
			tag("option",{},[tag("ruleItem",{value:"mainBegin"}),tag("ruleItem",{value:"Syntax"}),tag("ruleItem",{value:"mainEnd"})])
		]),
		tag("Syntax",{},[
			tag("option",{},[tag("ruleItem",{value:"SyntaxBase"})]),								// 0
			tag("option",{},[tag("ruleItem",{value:"SyntaxCustom"})])								// 1
		]),
		tag("SyntaxBase",{},[
			//tag("option",{},[tag("ruleItem",{value:"SyntaxStaticComment"})]),
			tag("option",{},[tag("ruleItem",{value:"SyntaxStaticSentence"})])						// 0
		]),
		tag("SyntaxStaticComment",{},[ // not complete(must parse all but new line)
			tag("option",{},[
				tag("itemRule",{value:"Word 10"})
			])
		]),
		tag("SyntaxStaticSentence",{},[
			// memory "a" string "abc"
			// memory "a" word abc
			// memory "a" string from file ""
			// memory "a" extract word from memory "b" // if memory b is a sentence then check if is primitive, every primitive sentence is a hardcopy of sentence model
			// memory "a" extract string from memory "b" if word
			// memory "a" extract line from memory "b" if string
			
			// add language "lang_name"
			// language "lang_name" -> will select that languague, and next command parsed will be that language
			// which language is in use?
			// drop language "lang_name"
			// language "lang_name" memory "a" -> will select that language, 
			// memory "a" 
			// set memory "b" charcode 3
			// charcode 3
			// char from memory "b" -> print
			// char from 123 -> print charcode
			// set memory "a" char from charcode "b"
			// set memory "a" string from memory "a" memory "b" memory "c" -> if charcode then convert to char (implicitly), if char then add, if string then add, if number then add, if language throw error, if word convert to string then add, if sentence check if is primitive then add, if sentence is abstract then fail
			// set memory "a" string from char "a" char "b" char "c"
			// convert memory "a" to word
			// set memory "a" word ok
			// set memory "a" number 1
			// set memory "a" sentence ok ok
			// set text "b" sentence ok ok sentence ok fail
			// language "lang_name" memory "a" -> now lang_name will parse ok ok
			// set memory "a" language "lang_name"
			// set memory "a" string "ok123 ok123" -> may be a sentence or not
			// expression "b" 1 + memory "a"
			// expression "c" 1 + language "lang_name" memory "a"
			
			// // argumento de funcao aceita qualquer memory, valores sao convertidos em memory
			
			tag("option",{},[tag("ruleItem",{value:"SyntaxStaticSentenceAdd"})]),
			tag("option",{},[tag("ruleItem",{value:"SyntaxStaticSentenceRemove"})]),
			tag("option",{},[tag("ruleItem",{value:"SyntaxStaticSentenceFind"})]),
			tag("option",{},[tag("ruleItem",{value:"SyntaxStaticSentenceDebug"})]),
			//tag("option",{},[tag("ruleItem",{value:"SyntaxStaticSentenceAddSentence"})]),
			//tag("option",{},[tag("ruleItem",{value:"SyntaxStaticSentenceAddWord"})]),				// 0
			//tag("option",{},[tag("ruleItem",{value:"SyntaxStaticSentenceFindWords"})]),
			tag("option",{},[tag("ruleItem",{value:"SyntaxStaticSentenceTime"})]),
			tag("option",{},[tag("ruleItem",{value:"SyntaxStaticCharcodeGet"})])
		]),
		tag("SyntaxStaticCharcodeGet",{},[
			tag("option",{},[
				tag("string",{value:"charcode",ignoreCase:true}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNl"}),
				tag("ruleItem",{value:"TypeNumber"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"})
			])
		]),
		tag("SystemNewSentence",{},[
			tag("option",{},[tag("tautology")])
		]),
		tag("SyntaxStaticSentenceAddSentenceEvent",{},[
			tag("option",{},[tag("tautology")])
		]),
		tag("SyntaxStaticSentenceAddSentence",{},[
			tag("option",{},[																		// 0
				tag("ruleItem",{value:"SystemNewSentence"}),
				//tag("string",{value:"sentence",ignoreCase:true}),
				tag("ruleItem",{value:"Word 4"}),				
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"SyntaxCustomSentenceInput"}),
				tag("ruleItem",{value:"SyntaxStaticSentenceAddSentenceEvent"})
			])
		]),
		tag("SyntaxStaticSentenceAddCharset",{},[
			tag("option",{},[																		// 0
				tag("ruleItem",{value:"Word 13"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"TypeString"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("string",{value:","}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("string",{value:"as",ignoreCase:true}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"Word 14 OPT"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"TypeString"})
			])
		]),
		tag("SyntaxStaticSentenceAddWord",{},[
			tag("option",{},[																		// 0
				tag("ruleItem",{value:"Word 2"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"TypeString"})
			])
		]),
		tag("SyntaxStaticSentenceAddWordAlias",{},[ // + @ = "T" "V" -> creepy o.O
			tag("option",{},[																		// 0
				tag("ruleItem",{value:"Word 2"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"Word 9"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"TypeString"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"TypeString"})
			])
		]),
		tag("SyntaxStaticSentenceAddVerb",{},[
			tag("option",{},[																		// 0
				tag("string",{value:"verb",ignoreCase:true}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"TypeString"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"SyntaxCustomSentences"})
			])
		]),
		tag("SyntaxStaticSentenceAdd_Type",{},[
			// add() -> map to corrent context(language)
			tag("option",{},[ tag("ruleItem",{value:"SyntaxStaticSentenceAddCharset"}) ]),
			tag("option",{},[ tag("ruleItem",{value:"SyntaxStaticSentenceAddVerb"}) ]),
			tag("option",{},[ tag("ruleItem",{value:"SyntaxStaticSentenceAddWord"}) ]),
			tag("option",{},[ tag("ruleItem",{value:"SyntaxStaticSentenceAddWordAlias"}) ]),
			tag("option",{},[ tag("ruleItem",{value:"SyntaxStaticSentenceAddSentence"}) ]),
		]),
		tag("Word 1",{},[
			tag("option",{},[tag("string",{value:"add",ignoreCase:true})]),
			tag("option",{},[tag("string",{value:"adicione",ignoreCase:true})]),
			tag("option",{},[tag("string",{value:"+"})])
		]),
		tag("Word 2",{},[
			tag("option",{},[tag("string",{value:"word",ignoreCase:true})]),
			tag("option",{},[tag("string",{value:"palavra",ignoreCase:true})]),
			tag("option",{},[tag("string",{value:"@"})]),
		]),
		tag("Word 3",{},[
			tag("option",{},[tag("string",{value:"remove",ignoreCase:true})]),
			tag("option",{},[tag("string",{value:"remova",ignoreCase:true})]),
			tag("option",{},[tag("string",{value:"-"})])
		]),
		tag("Word 4",{},[
			tag("option",{},[tag("string",{value:"sentence",ignoreCase:true})]),
			tag("option",{},[tag("string",{value:"frase",ignoreCase:true})]),
			tag("option",{},[tag("string",{value:"$",ignoreCase:true})])
		]),
		tag("Word 5",{},[
			tag("option",{},[tag("string",{value:"find",ignoreCase:true})]),
			tag("option",{},[tag("string",{value:"?",ignoreCase:true})])
		]),
		tag("Word 6",{},[
			tag("option",{},[tag("string",{value:"sum",ignoreCase:true})]),
			tag("option",{},[tag("string",{value:"[+]",ignoreCase:true})])
		]),
		tag("Word 7",{},[
			tag("option",{},[tag("string",{value:"product",ignoreCase:true})]),
			tag("option",{},[tag("string",{value:"[*]",ignoreCase:true})])
		]),
		tag("Word 8",{},[
			tag("option",{},[tag("string",{value:"base",ignoreCase:true})]),
			tag("option",{},[tag("string",{value:6,ignoreCase:true})])
		]),
		tag("Word 9",{},[
			tag("option",{},[tag("string",{value:"alias",ignoreCase:true})]),
			tag("option",{},[tag("string",{value:"=",ignoreCase:true})])
		]),
		tag("Word 10",{},[ // too many comments operators will consume all operators from language
			tag("option",{},[tag("string",{value:"->",ignoreCase:true})]),
			tag("option",{},[tag("string",{value:"//",ignoreCase:true})])
		]),
		tag("Word 11",{},[ // too many comments operators will consume all operators from language
			tag("option",{},[tag("string",{value:"time",ignoreCase:true})])
		]),
		tag("Word 12",{},[ // too many comments operators will consume all operators from language
			tag("option",{},[tag("string",{value:"now",ignoreCase:true})])
		]),
		tag("Word 13",{},[ // too many comments operators will consume all operators from language
			tag("option",{},[tag("string",{value:"charset",ignoreCase:true})])
		]),
		tag("Word 14",{},[ // too many comments operators will consume all operators from language
			tag("option",{},[tag("string",{value:"syntax",ignoreCase:true})])
		]),
		tag("Word 14 OPT",{},[ // too many comments operators will consume all operators from language
			tag("option",{},[tag("ruleItem",{value:"Word 14"})]),
			tag("option",{},[tag("tautology")])
		]),
		tag("SyntaxStaticSentenceTime",{},[
			tag("option",{},[
				tag("ruleItem",{value:"Word 11"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"Word 12"})
			])
		]),
		tag("SyntaxStaticSentenceAdd",{},[
			tag("option",{},[
				tag("ruleItem",{value:"Word 1"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"SyntaxStaticSentenceAdd_Type"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"LexicalTokenBaseDotOpt"})
			])
		]),
		tag("SyntaxStaticSentenceRemoveWord",{},[
			tag("option",{},[
				tag("ruleItem",{value:"Word 2"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"TypeString"})
			])
		]),
		tag("SyntaxStaticSentenceRemoveSentence",{},[
			tag("option",{},[
				tag("ruleItem",{value:"SystemNewSentence"}),
				tag("ruleItem",{value:"Word 4"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"SyntaxCustomSentenceInput"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"LexicalTokenBaseDotOpt"}),
				tag("ruleItem",{value:"SyntaxStaticSentenceRemoveSentenceEvent"})
			])
		]),
		tag("SyntaxStaticSentenceRemoveSentenceEvent",{},[
			tag("option",[ tag("tautology")])
		]),
		tag("SyntaxStaticSentenceRemove_Type",{},[
			tag("option",{},[ tag("ruleItem",{value:"SyntaxStaticSentenceRemoveWord"}) ])//,
			//tag("option",{},[ tag("ruleItem",{value:"SyntaxStaticSentenceRemoveSentence"}) ])
		]),
		tag("SyntaxStaticSentenceRemove",{},[
			tag("option",{},[
				tag("ruleItem",{value:"Word 3"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"SyntaxStaticSentenceRemove_Type"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"LexicalTokenBaseDotOpt"})
			])
		]),
		tag("SyntaxStaticSentenceFindSentenceEvent",{},[
			tag("option",[ tag("tautology")])
		]),
		tag("SyntaxStaticSentenceFindSentence",{},[ // this will "lock" the machine if find for too much.
			tag("option",{},[
				tag("ruleItem",{value:"SystemNewSentence"}),
				tag("ruleItem",{value:"Word 4"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"SyntaxCustomSentenceInput"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"LexicalTokenBaseDotOpt"}),
				tag("ruleItem",{value:"SyntaxStaticSentenceFindSentenceEvent"})
			])
		]),
		tag("SyntaxStaticSentenceFindWord",{},[
			tag("option",{},[
				tag("string",{value:"word",ignoreCase:true}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"TypeString"})
			])
		]),
		tag("SyntaxStaticSentenceFind_Type",{},[
			tag("option",{},[ tag("ruleItem",{value:"SyntaxStaticSentenceFindWord"}) ]),//,
			tag("option",{},[ tag("ruleItem",{value:"SyntaxStaticSentenceFindSentence"}) ])
		]),
		tag("SyntaxStaticSentenceFind",{},[
			tag("option",{},[
				tag("ruleItem",{value:"Word 5"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"SyntaxStaticSentenceFind_Type"}),
				tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}),
				tag("ruleItem",{value:"LexicalTokenBaseDotOpt"})
			])
		]),
		tag("SyntaxStaticSentenceDebug",{},[
			tag("option",{},[ tag("string",{value:"debug",ignoreCase:true}) ])
		]),
		tag("SyntaxCustomCharsets",{},[
			tag("option",{},[ tag("string",{value:"None"}) ])
		]),
		tag("SyntaxCustom",{},[
			tag("option",{},[tag("ruleItem",{value:"SyntaxCustomSentences"})]),						// 0
			tag("option",{},[tag("ruleItem",{value:"SyntaxCustomWords"})]),							// 1
			tag("option",{},[tag("ruleItem",{value:"SyntaxCustomCharsets"})])
		]),
		tag("SyntaxCustomWords",{},[
			tag("option",{},[ tag("string",{value:"None"}) ]),
			tag("option",{},[ tag("string",{value:"add",ignoreCase:true}) ]),
			tag("option",{},[ tag("string",{value:"remove",ignoreCase:true}) ]),
			tag("option",{},[ tag("string",{value:"find",ignoreCase:true}) ]),
			tag("option",{},[ tag("string",{value:"on",ignoreCase:true}) ]),
			tag("option",{},[ tag("string",{value:"off",ignoreCase:true}) ]),
			tag("option",{},[ tag("string",{value:"time",ignoreCase:true}) ]),
			tag("option",{},[ tag("string",{value:"now",ignoreCase:true}) ])
		]),
		tag("SyntaxCustomSentences",{},[
			tag("option",{},[ tag("string",{value:"None"}) ])										// 0
			// time now -> event
		]),
		tag("SyntaxCustomSentenceInputTypeWord",{},[
			tag("option",{},[ tag("ruleItem",{value:"SyntaxCustomWords"}) ]),
			tag("option",{},[ 
				tag("string",{value:":"}), 
				tag("ruleItem",{value:"SyntaxCustomSyntax"}) 
			])
		]),
		tag("SyntaxCustomSyntax",{},[
			tag("option",{},[ 
				tag("string",{value:"LexicalTokenBaseArraySpaceNlOpt"})
			])
		]),
		tag("SyntaxCustomSentenceInputType",{},[
			tag("option",{},[ tag("ruleItem",{value:"LexicalTokenBaseArraySpaceNlOpt"}), tag("ruleItem",{value:"SyntaxCustomSentenceInputTypeWord"}) ])
		]),
		tag("SyntaxCustomSentenceInput",{},[
			tag("option",{},[ tag("oneOrMoreRules",{value:"SyntaxCustomSentenceInputType"}) ])
		])
	]);
	obj.events = {
		"mainBegin" : function(ctx,optionIndex,data) {
			
		},
		"SyntaxStaticSentenceTime" : function(ctx,optionIndex,data) {
			console.log((new Date).toISOString());
		},
		"SyntaxStaticSentenceDebug" : function(ctx,optionIndex,data) {
			var keys = [];
			for(var key in ctx.language.lang) {
				if(key.indexOf("$customSentence")!=-1) {
					keys.push(key);
				}
			}
			console.log("--------------------------------------------------------------------------------");
			for(var x = 0; x < keys.length;x++) {
				console.log(keys[x],">>",JSON.stringify(ctx.language.lang[keys[x]]));
			}
			console.log("--------------------------------------------------------------------------------");
		},
		"SyntaxStaticSentenceAddCharset" : function(ctx,optionIndex,data) {
			//console.log("[system ->]",,);
			var name = data[10].substring(1,data[10].length-1);
			var charset = data[2].substring(1,data[2].length-1);
			
			if(!( ("SyntaxCharset" + name) in ctx.language.lang) ) {
				ctx.language.lang[ "SyntaxCustomCharsets" ].push([
					[ 0, "SyntaxCustomCharset_" + name ]
				]);
				ctx.language.lang[ "SyntaxCustomCharset_" + name ] = [
					[ [4,charset] ]
				];
				ctx.language.lang[ "SyntaxCustomSyntax" ].push([
					[1,"SyntaxCustomCharset_" + name]
				]);
			} else {
				console.log("[system] there is already a charset registered with name '" + name + "', choose other name or ...");
			}
			// string charset : data[2];
			// name : 
		},
		"SyntaxStaticSentenceAddWord" : function(ctx,optionIndex,data) {
			
			// register word on also on context?
			//console.log("[go]: add word");
			var exists = false;
			// find words that starts with this word
			var customWords = ctx.language.lang["SyntaxCustomWords"];
			var before = -1;
			var word = data[2].substring(1,data[2].length-1);
			for(var x = 0; x < customWords.length;x++) {
				//console.log(data[2].substring(1,data[2].length-1),customWords[x][0][1]);
				if(
					customWords[x][0][0] == 1 && 
					word.indexOf(customWords[x][0][1]) == 0
				) {
					if( customWords[x][0][1] == word) {
						exists = true;
						break;
					} else {
						before = x;
					}
				} else {
					// look for alias
					if(customWords[x][0][0] == 0) {
						for(var y = 0; y < ctx.language.lang[ customWords[x][0][1] ].length;y++) {
							if(
								ctx.language.lang[ customWords[x][0][1] ][y][0][0] == 1 &&
								word.indexOf( ctx.language.lang[ customWords[x][0][1] ][y][0][1] ) == 0 
							) {
								if( word == ctx.language.lang[ customWords[x][0][1] ][y][0][1] ) {
									exists = true;
									break;
								} else {
									before = x;
								}
							}
						}
					}
					if(exists) break;
				}
			}
			//console.log("[go]: before ",before);
			if(!exists) {
				if(before!=-1) {
					customWords.splice(before,0,[[1,word]]);
				} else {
					if("SyntaxCustomWords" in ctx.language.lang)  {
						customWords.push([[1,word]]);
						//console.log("FOUND!",ctx.language.lang["SyntaxCustomWords"]);
					}
				}
			} else {
				console.log("[system] word " + data[2] + " already exists.");
			}
			// obj.lang.SyntaxCustomWords.push
			
		},
		"SyntaxStaticSentenceAddWordAlias" : function(ctx,optionIndex,data) {
			// find for data[4] : source   (must find)
			// find for data[6] : destiny  (must fail)
			
			
			var source = data[4].substring(1,data[4].length-1);
			var destiny = data[6].substring(1,data[6].length-1);
			var state = 0;
			var slotW = -1;
			var slotA = -1;
			var customWords = ctx.language.lang["SyntaxCustomWords"];
			for(var x = 0; x < customWords.length;x++) {
				if(
					customWords[x][0][0] == 1 && 
					source == customWords[x][0][1]
				) { // without alias
					if((state&1)==0) {
						state |= 1;
						slotW = x;
					} else
						throw "unexpected, two identical words.";
				}
				if(
					customWords[x][0][0] == 1 &&
					destiny == customWords[x][0][1]
				) {
					//console.log( destiny , customWords[x][0][1]);
					if((state&2)==0)
						state |= 2;
					else
						throw "unexpected, two identical words.";
				}
				
				if(
					customWords[x][0][0] == 0
				) {
					
					for(var y = 0; y < ctx.language.lang[ customWords[x][0][1] ].length;y++) {
						if(
							ctx.language.lang[ customWords[x][0][1] ][y][0][0] == 1 &&
							ctx.language.lang[ customWords[x][0][1] ][y][0][1] == source
						) {
								if((state&1)==0) {
									state |= 1;
									slotA = y;
									slotW = x;
								} else throw "unexpected, two indentical words.";
						}
						if(
							ctx.language.lang[ customWords[x][0][1] ][y][0][0] == 1 &&
							ctx.language.lang[ customWords[x][0][1] ][y][0][1] == destiny
						) {
							//console.log( destiny , customWords[x][0][1]);
							if((state&2)==0) state |= 2;
							else throw "unexpected, two indentical words.";
						}
					}
					
				}
			}
			
			
			if( (state&1) > 0 ) {
				if ( (state&2) == 0 ) {
					if(slotA==-1) { // no aliases yet.
						customWords[slotW][0][0] = 0;
						customWords[slotW][0][1] = "$customWord " + source;
						if(source.length > destiny) {
							ctx.language.lang[ "$customWord " + source ] = [
								[ [1,source] ],
								[ [1,destiny] ]
							];
						} else {
							ctx.language.lang[ "$customWord " + source ] = [
								[ [1,destiny] ],
								[ [1,source] ]
							];
						}
					} else {
						
						var sel = -1;
						for(var x = 0; x < ctx.language.lang[ customWords[slotW][0][1] ].length;x++) {
							console.log(">>",JSON.stringify(ctx.language.lang[ customWords[slotW][0][1] ][x]));
							if( 
								destiny.indexOf( ctx.language.lang[ customWords[slotW][0][1] ][x][0][1] )==0 
							) {
								sel = x;
								break;
							}
						}
						if(sel==-1) {
							ctx.language.lang[ customWords[slotW][0][1] ].push([ [1,destiny] ]);
						} else {
							ctx.language.lang[ customWords[slotW][0][1] ].splice(sel,0,[ [1,destiny] ]);
						}
						console.log( sel,customWords[slotW][0][1], JSON.stringify( ctx.language.lang[ customWords[slotW][0][1] ] ) );
					}
				} else {
					console.log("[system] word " + data[6] + "  already has own meaning that differs from word "+data[4]+", deal with that first.");
				}
			} else {
				console.log("[system] word " + data[4] + " not found.");
			}
			
			//console.log(data[4],data[6]);
		},
		"SyntaxStaticSentenceRemoveWord" : function(ctx,optionIndex,data) {
			//console.log("[go] : remove word");
			var exists = false;
			var customWords = ctx.language.lang["SyntaxCustomWords"];
			var sel = -1;
			var word = data[2].substring(1,data[2].length-1);
			for(var x = 0; x < customWords.length;x++) {
				if(customWords[x][0][0] == 1 && customWords[x][0][1] == word) {
					sel = x;
					exists = true;
					break;
				} else if(customWords[x][0][0] == 0) {
					if(customWords[x][0][1] in ctx.language.lang) {
						for(var y = 0; y < ctx.language.lang[ customWords[x][0][1] ].length;y++) {
							if( 
								ctx.language.lang[ customWords[x][0][1] ][y][0][0] == 1 &&
								ctx.language.lang[ customWords[x][0][1] ][y][0][1] == word
							) {
								sel = x;
								exists = true;
								break;
							}
						}
						if(exists) break;
					}
				}
			}
			if(exists) {
				customWords.splice(sel,1);
				console.log("[system] word "+data[2]+"removed.");
			}
		}, 
		// two meanings same word. how to describe ambiguity? being or not being? two numbers connected to same word. user-space?
		// sentence is a context name
		// add meaning to word in word word word word, memory "a"
		// must register words in memory on boot(wake up)
		
		// a variação da frequencia em determinado tempo dispara quimicos cerebrais. (independente da fonte, audio, video, tato, paladar, movimento). 
		// sobriamente isso se chama experiencia, o que resulta em interpretações em espectro retro-alimentadas em caso de padrão absorvido e coincidente.
		
		// #close to matrix
		
		// number sample
		
		// must implement number
		// car sample
		
		// add word car
		// add word velocity
		// add word dim
		// add word x
		// -> add word list from "car velocity dim x dimension dimensão" (a text)
		// add sentence dim x
		// add sentence dim y
		// add sentence dim z
		// add word dimension
		// add word dimensão
		// concept car -> ****** {car}
		// add meaning to velocity in dim x, number 1
		// add meaning to velocity in dim y, number 0
		// add meaning to velocity in dim z, number 0
		// add word alias "velocity" "velocidade"
		// -> question is how to link a function call after "add word velocity in car" to handle time passing by -> using add meaning again will change all models connected to the word? 
		// -> something like fork word "velocity" into "velocityA" and "velocityB" and deletes velocity with all backtrack would be nice. then computer ask in a list to choose which concepts goes for which side.(better to get a server with a interface to avoid terminal borings) -> make a sample with auto choose by filter if faster tha server
		// velocity in dim x -> 1
		// add sentence alias dim x, dimension x, dimensão x
		// -> connect to speech recognition
		// -> connect to camera
		// add word alias "car" "carro" -> which tag to use???????????????? base tag for other languages (js,bs)
 		// add word velocity in car -> will import meanings {car[velocity:[ {"dim x"[value:1]},{"dim y"[value:0]},{"dim z"[value:0]} ]]} -> array attrib not done in bs (do at same time to link)
		// -> add meaning to velocity in car at dim x, number 1 -> {car[velocity:{"dim x"[value:1]}]}

		// -> [hello] word calls word
		
		// add instance car
		// -> bs: {car[velocity:{"dim x"[value:1]}]:{instance:{velocity["dim x":1]}}}
		// add instance car
		// -> bs: {car[velocity:{"dim x"[value:1]}]:{instance:{velocity["dim x":1]}}{instance:{velocity["dim x":1]}}}
		// -> js: getObject("car")[0][word("velocity")][sentence("dim x")] == getObject("carro")[1][word("velocidade")][sentence("dimensão x")];
		// -> #internet
		// -> ******* add instance carro, memory "a" -> a must be 
		// -> how many instances of car do exists? -> 2
		// -> ******* if car[0]'s velocity is equal to car[1]'s velocity : // mid design .. full comparation inside velocity
		// -> if (memory car1 using velocity) is equal to (memory car2 using velocity) : // bad design
		
		
		"SyntaxStaticSentenceFindWord" : function(ctx,optionIndex,data) {
			//console.log("[go] : find word");
			var customWords = ctx.language.lang["SyntaxCustomWords"];
			var arr = [];
			for(var x = 0; x < customWords.length;x++) {
				if(customWords[x][0][0] == 1 && customWords[x][0][1].indexOf(data[2].substring(1,data[2].length-1))!=-1) {
					arr.push(customWords[x][0][1]);
				}
			}
			if(arr.length>0) {
				console.log("[system] words:",JSON.stringify(arr));
			}
		},
		"SyntaxStaticSentenceRemoveSentenceEvent" : function(ctx,optionIndex,data) {
			//console.log("A 1");
			var customSentences = ctx.language.lang["SyntaxCustomSentences"];
			
			var stack = [customSentences];
			//console.log("::","SyntaxCustomSentences");
			// enum all sentences
			var words = {};
			for(var x = 0; x < target[1][0].memory[1][0].$sentence.length;x++) {
				words[ target[1][0].memory[1][0].$sentence[x] ] = true;
			}
			//console.log("A 2");
			var selected = [];
			while(stack.length>0) {
				var rule = stack.shift();
				for(var x = 0; x < rule.length;x++) {
					if(rule[x].length == 1) { // root of mapping
						var ruleItem = rule[x][0];
						if( ruleItem[0] == 0 ) {
							var rulename = ruleItem[1];
							if(rulename in ctx.language.lang) {
								//ctx.language.lang
								stack.unshift( ctx.language.lang[ rulename ] );
								if(rulename.indexOf("$customSentenceType")==-1) {
									//console.log("A 3");
									var sentence = rulename.substring("$customSentence ".length);
									var check = true;
									for(var key in words) {
										if(sentence.indexOf(key)==-1) {
											check = false;
											break;
										}
									}
									if(check) {
										selected.push(sentence);
										//console.log("::",sentence);	
									}
								}
							}
						}
					} else if(rule[x].length==3) {
						if(rule[x][2][0] == 0) {
							if(rule[x][2][1] in ctx.language.lang) {
								stack.unshift( ctx.language.lang[ rule[x][2][1] ] );
								if(rule[x][2][1].indexOf("$customSentenceType")==-1) {
									//console.log("A 4");
									selected.push(rule[x][2][1].substring("$customSentence ".length));
									//console.log("::",rule[x][2][1].substring("$customSentence ".length));
								}
							}
						}
					}
				}
			}
			
			for(var x = 0; x < selected.length;x++) {
				// start from leaf, check unique branch to remove
				console.log(selected[x]);
				
				
				
			}
			//console.log("SyntaxCustomSentences",">>",JSON.stringify(customSentences));
		},
		"SyntaxStaticSentenceFindSentenceEvent" : function(ctx,optionIndex,data) {
			/*
				
				REMOVE NON TERMINALS
				-> START HERE
				+@"ok"
				+$ok ok ok
				[system] parsed word: ok
				[system] parsed word: ok
				[system] parsed word: ok
				?$ok
				[system] parsed word: ok
				:: ok
				:: ok ok
				:: ok ok ok
				
				> nova <
			*/
			var customSentences = ctx.language.lang["SyntaxCustomSentences"];
			
			var stack = [customSentences];
			
			var words = {};
			for(var x = 0; x < target[1][0].memory[1][0].$sentence.length;x++) {
				words[ target[1][0].memory[1][0].$sentence[x] ] = true;
			}
			//console.log("A 2");
			while(stack.length>0) {
				var rule = stack.shift();
				for(var x = 0; x < rule.length;x++) {
					if(rule[x].length == 1) { // root of mapping
						var ruleItem = rule[x][0];
						if( ruleItem[0] == 0 ) {
							var rulename = ruleItem[1];
							if(rulename in ctx.language.lang) {
								//ctx.language.lang
								stack.unshift( ctx.language.lang[ rulename ] );
								if(rulename.indexOf("$customSentenceType")==-1) {
									//console.log("A 3");
									var sentence = rulename.substring("$customSentence ".length);
									var check = true;
									for(var key in words) {
										if(sentence.indexOf(key)==-1) {
											check = false;
											break;
										}
									}
									if(check) console.log("::",sentence);	
								}
							}
						}
					} else if(rule[x].length==3) {
						if(rule[x][2][0] == 0) {
							if(rule[x][2][1] in ctx.language.lang) {
								stack.unshift( ctx.language.lang[ rule[x][2][1] ] );
								if(rule[x][2][1].indexOf("$customSentenceType")==-1) {
									//console.log("A 4");
									console.log("::",rule[x][2][1].substring("$customSentence ".length));
								}
							}
						}
					}
				}
			}
			
			
			//console.log("SyntaxCustomSentences",">>",JSON.stringify(customSentences));
			
		},
		"SyntaxStaticSentenceAddSentenceEvent" : function(ctx,optionIndex,data) {
			// how to detec if ok fail will not cover ok fail ok?
			// find sentences ok, then ok fail, then ok fail ok -> reorder sentence array with nice indexes, longest first
			// to avoid too long sentences a sub language must be created. that is a context re arrange by word map
			if( target[1][0].memory[1][0].$sentence.length > 1) {

				var customSentences = ctx.language.lang["SyntaxCustomSentences"];
				
				// reorder sentences
				/*
				var id = target[1][0].memory[1][0].$customSentencesId;
				for(var x = 0; x < customSentences.length;x++) {
					if( customSentences[x][0] == 0) { // its a rule, so ok
						var ruleName = customSentences[x][1];
						// find all partials
						var rule = ctx.language.lang[ruleName];
						for(var y = 0; y < rule.length;y++) {
							var option = rule[y];
							var count = 0;
							var check = true;
							while(check) {
								var sel = -1;
								for(var z = 0; z < options.length;z++) {
									if(options[z][0] == 0 && options[z][1] == "LexicalTokenBaseArraySpaceNlOpt") {
										
									} else if(options[z][0] == 1) {
										if(target[1][0].memory[1][0].$sentence[x] == options[z][1]) {
											count += 1;
										} else {
											sel = y;
											check = false;
											break;
										}
									}
								}
								// partial find leads to a map if any word is found.
								
							}
						}
					}
				}
				*/
				// find where to insert
				
				
				// create sentence
				//target[1][0].memory[1][0].$customSentencesId += 1;
				//ctx.language.lang["$customSentence " + id] = [];
				//var nobj = [];
				
				var debug = true;
				
				// hash link words
				for(var x = 0; x < target[1][0].memory[1][0].$sentence.length;x++) {
					var name = ["$customSentence"];
					
					for(var y = 0; y <= x;y++) {
						if(target[1][0].memory[1][0].$sentenceType[y] == 0) { // may replace by a constant, still thinking about it
							name.push( target[1][0].memory[1][0].$sentence[y] );
						} else if(target[1][0].memory[1][0].$sentenceType[y] == 1) {
							name.push( ":" + target[1][0].memory[1][0].$sentence[y] );
						}
					}
					name = name.join(" ");
					
					if(! ( name in ctx.language.lang )  ) {
						if(x == target[1][0].memory[1][0].$sentence.length-1) {
							if(debug) console.log("A 0");
							if(target[1][0].memory[1][0].$sentenceType[x] == 0) { // may replace by a constant, still thinking about it
								ctx.language.lang[ name ] = [ 
									[ 
										[ 0, "LexicalTokenBaseArraySpaceNlOpt" ], // if is not optional then punctuation languages will suffer with too many spaces
										[ 1, target[1][0].memory[1][0].$sentence[x] ]
									]
								];
							} else if(target[1][0].memory[1][0].$sentenceType[x] == 1) {
								ctx.language.lang[ name ] = [ 
									[ 
										[ 0, "LexicalTokenBaseArraySpaceNlOpt" ], // if is not optional then punctuation languages will suffer with too many spaces
										[ 0, target[1][0].memory[1][0].$sentence[x] ]
									]
								];
							}
							if(debug) console.log(name,">>",JSON.stringify(ctx.language.lang[ name ]));
						} else {
							if(debug) console.log("A 1");
							if(target[1][0].memory[1][0].$sentenceType[x] == 0) { // may replace by a constant, still thinking about it
								ctx.language.lang[ name ] = [ 
									[ 
										[ 0, "LexicalTokenBaseArraySpaceNlOpt" ], 
										[ 1, target[1][0].memory[1][0].$sentence[x] ],
										[ 0, "$customSentenceType " + name ]
									]
								];
							} else if(target[1][0].memory[1][0].$sentenceType[x] == 1) {
								ctx.language.lang[ name ] = [ 
									[ 
										[ 0, "LexicalTokenBaseArraySpaceNlOpt" ], 
										[ 0, target[1][0].memory[1][0].$sentence[x] ],
										[ 0, "$customSentenceType " + name ]
									]
								];
							}
							if(debug) console.log(name,">>",JSON.stringify(ctx.language.lang[ name ]));
							// register next word
							if(target[1][0].memory[1][0].$sentenceType[x+1] == 0) {
								ctx.language.lang[ "$customSentenceType " + name ] = [
									[
										[ 0, name + " " + target[1][0].memory[1][0].$sentence[x+1] ]
									]
								];
							} else {
								ctx.language.lang[ "$customSentenceType " + name ] = [
									[
										[ 0, name + " :" + target[1][0].memory[1][0].$sentence[x+1] ]
									]
								];
							}
							if(debug) console.log("$customSentenceType " + name,">>",JSON.stringify(ctx.language.lang[ "$customSentenceType " + name ]));
						}
					} else {
						if(debug) console.log("A 2");
						var state = 0;
						
						// find for part of sentence is already registered in mapping
						for(var y = 0; y < ctx.language.lang[name].length;y++) {
							if(x == target[1][0].memory[1][0].$sentence.length-1) {
								if(target[1][0].memory[1][0].$sentenceType[x] == 0) { // may replace by a constant, still thinking about it
									if( 
										ctx.language.lang[name][y].length == 2 &&
										ctx.language.lang[name][y][0][0] == 0 &&
										ctx.language.lang[name][y][0][1] == "LexicalTokenBaseArraySpaceNlOpt" &&
										ctx.language.lang[name][y][1][0] == 1 &&
										ctx.language.lang[name][y][1][1] == target[1][0].memory[1][0].$sentence[x]
									) {
										if(debug) console.log("A 4");
										state = 1;
										break;
									}
								} else if(target[1][0].memory[1][0].$sentenceType[x] == 1) {
									if( 
										ctx.language.lang[name][y].length == 2 &&
										ctx.language.lang[name][y][0][0] == 0 &&
										ctx.language.lang[name][y][0][1] == "LexicalTokenBaseArraySpaceNlOpt" &&
										ctx.language.lang[name][y][1][0] == 0 &&
										ctx.language.lang[name][y][1][1] == target[1][0].memory[1][0].$sentence[x]
									) {
										if(debug) console.log("A 4");
										state = 1;
										break;
									}
								}
							} else {
								if(debug) console.log("A 5");
								if(target[1][0].memory[1][0].$sentenceType[x] == 0) { // may replace by a constant, still thinking about it
									if(
										ctx.language.lang[name][y].length == 3 &&
										ctx.language.lang[name][y][0][0] == 0 &&
										ctx.language.lang[name][y][0][1] == "LexicalTokenBaseArraySpaceNlOpt" &&
										ctx.language.lang[name][y][1][0] == 1 &&
										ctx.language.lang[name][y][1][1] == target[1][0].memory[1][0].$sentence[x] &&
										ctx.language.lang[name][y][2][0] == 0 &&
										ctx.language.lang[name][y][2][1] == ("$customSentenceType " + name)
									) {
										if(debug) console.log("A 6");
										state = 2;
										break;
									}
								} else if(target[1][0].memory[1][0].$sentenceType[x] == 1) {
									if(
										ctx.language.lang[name][y].length == 3 &&
										ctx.language.lang[name][y][0][0] == 0 &&
										ctx.language.lang[name][y][0][1] == "LexicalTokenBaseArraySpaceNlOpt" &&
										ctx.language.lang[name][y][1][0] == 0 &&
										ctx.language.lang[name][y][1][1] == target[1][0].memory[1][0].$sentence[x] &&
										ctx.language.lang[name][y][2][0] == 0 &&
										ctx.language.lang[name][y][2][1] == ("$customSentenceType " + name)
									) {
										if(debug) console.log("A 6");
										state = 2;
										break;
									}
								}
							}
						}
						//console.log(state);
						if(x == target[1][0].memory[1][0].$sentence.length-1) { // leaf 
							if(debug) console.log("A 7");
							if(state==0) { // not found
								if(debug) console.log("A 8");
								
								if(target[1][0].memory[1][0].$sentenceType[x] == 0) { // may replace by a constant, still thinking about it
									ctx.language.lang[name].push([
										[ 0, "LexicalTokenBaseArraySpaceNlOpt" ], 
										[ 1, target[1][0].memory[1][0].$sentence[x] ]
									]);
								} else if(target[1][0].memory[1][0].$sentenceType[x] == 1) {
									ctx.language.lang[name].push([
										[ 0, "LexicalTokenBaseArraySpaceNlOpt" ], 
										[ 0, target[1][0].memory[1][0].$sentence[x] ]
									]);
								}
								
							} // else : known leaf emit warning?
						} else {
							if(debug) console.log("A 9");
							if(state==0) {
								if(debug) console.log("A 10");
								if(target[1][0].memory[1][0].$sentenceType[x] == 0) {
									ctx.language.lang[name].unshift([
										[ 0, "LexicalTokenBaseArraySpaceNlOpt" ], 
										[ 1, target[1][0].memory[1][0].$sentence[x] ],
										[ 0, "$customSentenceType " + name ]
									]);
								} else if(target[1][0].memory[1][0].$sentenceType[x] == 1) {
									ctx.language.lang[name].unshift([
										[ 0, "LexicalTokenBaseArraySpaceNlOpt" ], 
										[ 0, target[1][0].memory[1][0].$sentence[x] ],
										[ 0, "$customSentenceType " + name ]
									]);
								}
								// register next word
								ctx.language.lang[ "$customSentenceType " + name ] = [
									[
										[ 0, name + " " + target[1][0].memory[1][0].$sentence[x+1] ]
									]
								];
							} else {
								if(debug) console.log("A 11");
								if( ("$customSentenceType " + name) in ctx.language.lang ) { // this check must be deeper on rule (tomorrow maybe, look for slow cases)
									if(debug) console.log("A 12");
									var check = true;
									var sel = -1;
									for(var y = 0; y < ctx.language.lang[ "$customSentenceType " + name ].length;y++) {
									
										var words = ctx.language.lang[ "$customSentenceType " + name ][y][0][1].split(" ");
										
										if(debug) console.log("A 13",target[1][0].memory[1][0].$sentence[x+1],words[words.length-1]);
										if( 
											ctx.language.lang[ "$customSentenceType " + name ][y][0][0] == 0 &&
											ctx.language.lang[ "$customSentenceType " + name ][y][0][1] == (name + " " + target[1][0].memory[1][0].$sentence[x+1])
										) {
											if(debug) console.log("A 14");
											check = false;
											//console.log("!!!!");
										} else if(
											sel== -1 && target[1][0].memory[1][0].$sentence[x+1].indexOf( words[words.length-1] ) == 0
										) { 
											// find substring (used for "ok ok2" comes before than "ok ok", but not for "ok oa" comes first than "ok ob", 
											// which makes no difference on strings (the small delays will lead to diversity of construction - machine dna)
											sel = y;
										}
									}
									if(check) {
										if(debug) console.log("A 15");
										// put in a way that will always match longest first
										if(sel==-1) {
											if(debug) console.log("A 15 1");
											ctx.language.lang[ "$customSentenceType " + name ].push([
												[0, name + " " + target[1][0].memory[1][0].$sentence[x+1] ]
											]);
										} else {
											if(debug) console.log("A 15 2");
											ctx.language.lang[ "$customSentenceType " + name ].splice(sel,0,[
												[0, name + " " + target[1][0].memory[1][0].$sentence[x+1] ]
											]);
										}
									}
									if(debug) console.log("A 16");
								} else {
									if(debug) console.log("A 17");
									ctx.language.lang[ "$customSentenceType " + name ] = [
										[
											[ 0, name + " " + target[1][0].memory[1][0].$sentence[x+1] ]
										]
									];
								}
							}
						}
					}
				}
				if(debug) console.log("A 18");
				// check if first word is registered.
				var check_first = true;
				var sel = -1;
				for(var x = 0; x < customSentences.length;x++) {
					if(debug) console.log("A 19");
					var words = customSentences[x][0][1].split(" ");
					if(words[words.length-1] == target[1][0].memory[1][0].$sentence[0]) {
						if(debug) console.log("A 20");
						check_first = false;
						break;
					} else if( sel == -1 && target[1][0].memory[1][0].$sentence[0].indexOf( words[words.length-1] ) == 0 ) {
						if(debug) console.log("A 21");
						sel = x;
						
					}
				}
				if(check_first) {
					if(debug) console.log("A 22");
					if(sel == -1) {
						if(debug) console.log("A 23");
						customSentences.push([
							[0,"$customSentence " + target[1][0].memory[1][0].$sentence[0]]
						]);
					} else {
						if(debug) console.log("A 24");
						customSentences.splice(sel,0,[
							[0,"$customSentence " + target[1][0].memory[1][0].$sentence[0]]
						]);
					}
					if(debug) console.log("SyntaxCustomSentences",">>",JSON.stringify(customSentences));
				}
				// delete temporary
				var sel = -1;
				var sel1 = -1;
				for(var x = 0; x < target[1][0].memory[1][0].$.length;x++) {
					if( target[1][0].memory[1][0].$[x] == "$sentence") {
						sel = x;
					}
					if( target[1][0].memory[1][0].$[x] == "$sentenceType") {
						sel1 = x;
					}
				}
				if(sel!=-1) target[1][0].memory[1][0].$.splice(sel,1);
				if(sel1!=-1) target[1][0].memory[1][0].$.splice(sel1,1);
				
				delete target[1][0].memory[1][0].$sentence;
				delete target[1][0].memory[1][0].$sentenceType;
				if(debug) console.log("A 25");
			} else {
				// ask if want to add word instead.
				console.log("one word is not a sentence, its a word.");
			}
			
		},
		"SyntaxCustom" : function(ctx,optionIndex,data) {
			//console.log("parsed:",data.join(","));
		},
		"SyntaxCustomSentences" : function(ctx,optionsIndex,data) {
			console.log("[system] parsed sentence:",data.join(","));
		},
		"SyntaxCustomWords" : function(ctx,optionsIndex,data) {
			console.log("[system debug] parsed word:",data.join(","));
		},
		"SyntaxCustomCharsets" : function(ctx,optionsIndex,data) {
			var name = ctx.language.lang["SyntaxCustomCharsets"][optionsIndex][0][1];
			name = name.substring("SyntaxCustomCharset_".length);
			console.log("[system debug] parsed charset:",name);
		},
		"SystemNewSentence" : function(ctx,optionIndex,data) { // this interface is useless
			// data will loose meta tag info cause its is pure string
			//console.log("FOUND",data[4]);
			
			// start sentence construction
			//console.log("MACHINE BEGIN",ctx);
			target[1][0].memory[1][0].$.push("$sentence");
			target[1][0].memory[1][0].$sentence = [];
			
			target[1][0].memory[1][0].$.push("$sentenceType");
			target[1][0].memory[1][0].$sentenceType = [];
			
		},
		"SyntaxCustomSentenceInputTypeWord" : function(ctx,optionIndex,data) {
			//console.log("PUSHING WORD TO SENTENCE",data[0]);
			if(optionIndex==0) {
				target[1][0].memory[1][0].$sentence.push(data[0]);
				target[1][0].memory[1][0].$sentenceType.push(0);
			} else if(optionIndex==1) {
				target[1][0].memory[1][0].$sentence.push(data[1]);
				target[1][0].memory[1][0].$sentenceType.push(1);
			}
		},
		"mainEnd" : function(ctx,optionIndex,data) {
			
		},
		"SyntaxStaticCharcodeGet":function(ctx,optionIndex,data) {
			console.log("charcode:",String.fromCharCode(parseInt(data[2])));
		}
	};
	/*
		TODO:
			"SyntaxCustomSentences._SENTENCE_NAME_"
			-> when it happens (the sentence) BOOKSCRIPTCODE (that will run based on arguments of sentence, being a rule or a string, whatever, use THIS js keyword on ctx.language.events to register the BS)
			to modify sentence after ready we need:
			-> remember _SENTENCE_ , (that rule that match will be selected) 
				do also BOOKSCRIPTCODE
				clear events
				what really is? ( list the full rule )
			
	*/
	return obj;
}
//]}>