

/*

	seal names just like keywords. like window and document.
	the only action that is allowed is to nullify in current context
	so static remains static
	
	words will be sold. all. nobody will have more ideas. just like dns.
	what law will control that?
	
	
	
	
	
*/

Languages.LOGICUNIT = (function() {
	
	function LOGICUNIT() {
		this.lang = {};
	}
	LOGICUNIT.prototype.reset = function() {
		// language
		// convert html to framework page
		var lang = this.lang;
		lang.syntax = {
			"binary-digit" : [
				[ [1,"0",0] ], [ [1,"1",0] ]
			],
			"octal-digit" : [
				[ [1,"0",0] ], [ [1,"1",0] ], [ [1,"2",0] ], [ [1,"3",0] ],
				[ [1,"4",0] ], [ [1,"5",0] ], [ [1,"6",0] ], [ [1,"7",0] ]
			],
			"decimal-digit" : [
				[ [1,"0",0] ], [ [1,"1",0] ], [ [1,"2",0] ], [ [1,"3",0] ], [ [1,"4",0] ],
				[ [1,"5",0] ], [ [1,"6",0] ], [ [1,"7",0] ], [ [1,"8",0] ], [ [1,"9",0] ]
			],
			"hex-digit" : [
				[ [1,"0",0] ], [ [1,"1",0] ], [ [1,"2",0] ], [ [1,"3",0] ],
				[ [1,"4",0] ], [ [1,"5",0] ], [ [1,"6",0] ], [ [1,"7",0] ],
				[ [1,"8",0] ], [ [1,"9",0] ], [ [1,"A",0] ], [ [1,"B",0] ],
				[ [1,"C",0] ], [ [1,"D",0] ], [ [1,"E",0] ], [ [1,"F",0] ]
			],
			"alpha-upper-char" : [
				[ [1,"A",0] ],[ [1,"B",0] ],[ [1,"C",0] ],[ [1,"D",0] ],[ [1,"E",0] ],
				[ [1,"F",0] ],[ [1,"G",0] ],[ [1,"H",0] ],[ [1,"I",0] ],[ [1,"J",0] ],
				[ [1,"K",0] ],[ [1,"L",0] ],[ [1,"M",0] ],[ [1,"N",0] ],[ [1,"O",0] ],
				[ [1,"P",0] ],[ [1,"Q",0] ],[ [1,"R",0] ],[ [1,"S",0] ],[ [1,"T",0] ],
				[ [1,"U",0] ],[ [1,"V",0] ],[ [1,"W",0] ],[ [1,"X",0] ],[ [1,"Y",0] ],
				[ [1,"Z",0] ]
			],
			"alpha-lower-char" : [
				[ [1,"a",0] ],[ [1,"b",0] ],[ [1,"c",0] ],[ [1,"d",0] ],[ [1,"e",0] ],
				[ [1,"f",0] ],[ [1,"g",0] ],[ [1,"h",0] ],[ [1,"i",0] ],[ [1,"j",0] ],
				[ [1,"k",0] ],[ [1,"l",0] ],[ [1,"m",0] ],[ [1,"n",0] ],[ [1,"o",0] ],
				[ [1,"p",0] ],[ [1,"q",0] ],[ [1,"r",0] ],[ [1,"s",0] ],[ [1,"t",0] ],
				[ [1,"u",0] ],[ [1,"v",0] ],[ [1,"w",0] ],[ [1,"x",0] ],[ [1,"y",0] ],
				[ [1,"z",0] ]
			],
			"full-range-char" : [
				[ [0,"alpha-lower-char",0] ],
				[ [0,"alpha-upper-char",0] ],
				[ [0,"decimal-digit",0] ],
				[ [1,"\n",0] ],
				[ [1,"\r",0] ],
				[ [1,"\t",0] ],
				[ [1," ",0] ], [ [1,"~",0] ], [ [1,"`",0] ], [ [1,"!",0] ], [ [1,"@",0] ],
				[ [1,"#",0] ], [ [1,"$",0] ], [ [1,"%",0] ], [ [1,"^",0] ], [ [1,"&",0] ],
				[ [1,"*",0] ], [ [1,"(",0] ], [ [1,")",0] ], [ [1,"-",0] ], [ [1,"_",0] ],
				[ [1,"+",0] ], [ [1,"=",0] ], [ [1,"[",0] ], [ [1,"]",0] ], [ [1,"{",0] ],
				[ [1,"}",0] ], [ [1,"|",0] ], [ [1,"\\",0] ], [ [1,":",0] ], [ [1,";",0] ],
				[ [1,"\"",0] ], [ [1,"'",0] ], [ [1,"<",0] ], [ [1,",",0] ], [ [1,">",0] ],
				[ [1,".",0] ], [ [1,"/",0] ], [ [1,"?",0] ]
			],
			"string-double-quote-char" : [
				[ [0,"alpha-lower-char",0] ],
				[ [0,"alpha-upper-char",0] ],
				[ [0,"decimal-digit",0] ],
				[ [1," ",0] ], [ [1,"~",0] ], [ [1,"`",0] ], [ [1,"!",0] ], [ [1,"@",0] ],
				[ [1,"#",0] ], [ [1,"$",0] ], [ [1,"%",0] ], [ [1,"^",0] ], [ [1,"&",0] ],
				[ [1,"*",0] ], [ [1,"(",0] ], [ [1,")",0] ], [ [1,"-",0] ], [ [1,"_",0] ],
				[ [1,"+",0] ], [ [1,"=",0] ], [ [1,"[",0] ], [ [1,"]",0] ], [ [1,"{",0] ],
				[ [1,"}",0] ], [ [1,"|",0] ], [ [1,":",0] ], [ [1,";",0] ],
				[ [1,"'",0] ], [ [1,"<",0] ], [ [1,",",0] ], [ [1,">",0] ], [ [1,".",0] ], 
				[ [1,"/",0] ], [ [1,"?",0] ]
			],
			"string-single-quote-char" : [
				[ [0,"alpha-lower-char",0] ],
				[ [0,"alpha-upper-char",0] ],
				[ [0,"decimal-digit",0] ],
				[ [1," ",0] ], [ [1,"~",0] ], [ [1,"`",0] ], [ [1,"!",0] ], [ [1,"@",0] ],
				[ [1,"#",0] ], [ [1,"$",0] ], [ [1,"%",0] ], [ [1,"^",0] ], [ [1,"&",0] ],
				[ [1,"*",0] ], [ [1,"(",0] ], [ [1,")",0] ], [ [1,"-",0] ], [ [1,"_",0] ],
				[ [1,"+",0] ], [ [1,"=",0] ], [ [1,"[",0] ], [ [1,"]",0] ], [ [1,"{",0] ],
				[ [1,"}",0] ], [ [1,"|",0] ], [ [1,":",0] ], [ [1,";",0] ], 
				[ [1,"\"",0] ], [ [1,"<",0] ], [ [1,",",0] ], [ [1,">",0] ], [ [1,".",0] ], 
				[ [1,"/",0] ], [ [1,"?",0] ]
			],
			"string-multiline-single-quote-char" : [
				[ [0,"alpha-lower-char",0] ],
				[ [0,"alpha-upper-char",0] ],
				[ [0,"decimal-digit",0] ],
				[ [1,"\r",0] ],[ [1,"\n",0] ],[ [1,"\t",0] ],
				[ [1," ",0] ], [ [1,"~",0] ], [ [1,"`",0] ], [ [1,"!",0] ], [ [1,"@",0] ],
				[ [1,"#",0] ], [ [1,"$",0] ], [ [1,"%",0] ], [ [1,"^",0] ], [ [1,"&",0] ],
				[ [1,"*",0] ], [ [1,"(",0] ], [ [1,")",0] ], [ [1,"-",0] ], [ [1,"_",0] ],
				[ [1,"+",0] ], [ [1,"=",0] ], [ [1,"[",0] ], [ [1,"]",0] ], [ [1,"{",0] ],
				[ [1,"}",0] ], [ [1,"|",0] ], [ [1,":",0] ], [ [1,";",0] ], 
				[ [1,"\"",0] ], [ [1,"<",0] ], [ [1,",",0] ], [ [1,">",0] ], [ [1,".",0] ], 
				[ [1,"/",0] ], [ [1,"?",0] ]
			],
			"unicode-escape" : [
				[ [1,"&#",0], [0,"decimal-integer",0], [1,";",0] ],
				[ [1,"&x",0], [0,"hex-integer",0], [1,";",0] ]
			],
			"binary-digit-array" : [
				[ [0,"binary-digit",0], [0, "binary-digit-array",0] ],
				[ [0,"binary-digit",0] ]
			],
			"octal-digit-array" : [
				[ [0,"octal-digit",0], [0, "octal-digit-array",0] ],
				[ [0,"octal-digit",0] ]
			],
			"decimal-digit-array" : [
				[ [0,"decimal-digit",0], [0, "decimal-digit-array",0] ],
				[ [0,"decimal-digit",0] ]
			],
			"hex-digit-array" : [
				[ [0,"hex-digit",0], [0, "hex-digit-array",0] ],
				[ [0,"hex-digit",0] ]
			],
			"binary-integer" : [
				[ [1,"0b",0], [0,"binary-digit-array",0] ]
			],
			"octal-integer" : [
				[ [1,"0o",0], [0,"octal-digit-array",0] ]
			],
			"decimal-integer" : [
				[ [0,"decimal-digit-array",0] ]
			],
			"hex-integer" : [
				[ [1,"0x",0], [0,"hex-digit-array",0] ]
			],
			"number-integer" : [
				[ [0,"binary-integer",0] ],
				[ [0,"octal-integer",0] ],
				[ [0,"hex-integer",0] ],
				[ [0,"decimal-integer",0] ]
			],
			"number-integer-opt" : [
				[ [0,"number-integer",0] ],
				[ [5,"",0] ]
			],
			"boolean-value" : [
				[ [1,"true",0] ],
				[ [1,"false",0] ]
			],
			"boolean-value-opt" : [
				[ [0,"boolean-value",0] ],
				[ [5,"",0] ]
			],
			
			"string-double-quote-replace" : [
				[ [1,"@(",0], [0,"value-expression-operation",0], [1,")",0] ]
			],
			"string-double-quote-item" : [
				[ [0,"string-double-quote-replace",0] ],
				[ [0,"string-double-quote-char",0] ],
				[ [1,"\\",0], [1,"\"",0] ],
				[ [1,"\\",0], [0,"string-double-quote-char",0] ]
			],
			"string-double-quote-char-array" : [
				[ [0,"string-double-quote-item",0], [0,"string-double-quote-char-array",0] ],
				[ [0,"string-double-quote-item",0] ]
			],
			"string-double-quote-char-array-opt" : [
				[ [0,"string-double-quote-char-array",0] ],
				[ [5,"",0] ]
			],
			"string-double-quote" : [
				[ [1,"\"",0], [0,"string-double-quote-char-array-opt",0], [1,"\"",0] ],
			],
			"string-single-quote-item" : [
				[ [0,"string-single-quote-char",0] ],
				[ [1,"\\",0], [1,"'",0] ],
				[ [1,"\\",0], [0,"string-single-quote-char",0] ]
			],
			"string-single-quote-char-array" : [
				[ [0,"string-single-quote-item",0], [0,"string-single-quote-char-array",0] ],
				[ [0,"string-single-quote-item",0] ]
			],
			"string-single-quote-char-array-opt" : [
				[ [0,"string-single-quote-char-array",0] ],
				[ [5,"",0] ]
			],
			"string-single-quote" : [
				[ [1,"'",0], [0,"string-single-quote-char-array-opt",0], [1,"'",0] ],
			],
			"string-multiline-double-quote" : [
				[ [1,"@\"",0], [1,"\"@",0] ]
			],
			"string-multiline-single-quote-item" : [
				[ [1,"'@",1] ],
				[ [0,"string-multiline-single-quote-char",0] ],
				[ [1,"\\",0], [1,"'",0] ],
				[ [1,"\\",0], [0,"string-multiline-single-quote-char",0] ]
			],
			"string-multiline-single-quote-char-array" : [
				[ [0,"string-multiline-single-quote-item",0], [0,"string-multiline-single-quote-char-array",0] ],
				[ [0,"string-multiline-single-quote-item",0] ]
			],
			"string-multiline-single-quote-char-array-opt" : [
				[ [0,"string-multiline-single-quote-char-array",0] ],
				[ [5,"",0] ]
			],
			"string-multiline-single-quote" : [
				[ [1,"@'",0], [0,"string-multiline-single-quote-char-array-opt",0], [1,"'@",0] ]
			],
			"string-value" : [ // double quote evals vars, single quote are static
				[ [0,"string-double-quote",0] ],
				[ [0,"string-single-quote",0] ],
				[ [0,"string-multiline-double-quote",0] ],
				[ [0,"string-multiline-single-quote",0] ]
			],
			"space-chars" : [
				[ [1," ",0] ],
				[ [1,"\t",0] ],
				[ [1,"\r",0] ],
				[ [1,"\n",0] ]
			],
			"space-opt" : [
				[ [0,"space-chars",0], [0,"space-opt",0] ],
				[ [0,"space-chars",0] ],
				[ [5,"",0] ]
			],
			"space" : [
				[ [0,"space-chars",0], [0,"space",0] ],
				[ [0,"space-chars",0] ]
			],
			"name-char" : [
				[ [1,"a",0] ],[ [1,"b",0] ],[ [1,"c",0] ],[ [1,"d",0] ],[ [1,"e",0] ],
				[ [1,"f",0] ],[ [1,"g",0] ],[ [1,"h",0] ],[ [1,"i",0] ],[ [1,"j",0] ],
				[ [1,"k",0] ],[ [1,"l",0] ],[ [1,"m",0] ],[ [1,"n",0] ],[ [1,"o",0] ],
				[ [1,"p",0] ],[ [1,"q",0] ],[ [1,"r",0] ],[ [1,"s",0] ],[ [1,"t",0] ],
				[ [1,"u",0] ],[ [1,"v",0] ],[ [1,"w",0] ],[ [1,"x",0] ],[ [1,"y",0] ],
				[ [1,"z",0] ],
				[ [1,"A",0] ],[ [1,"B",0] ],[ [1,"C",0] ],[ [1,"D",0] ],[ [1,"E",0] ],
				[ [1,"F",0] ],[ [1,"G",0] ],[ [1,"H",0] ],[ [1,"I",0] ],[ [1,"J",0] ],
				[ [1,"K",0] ],[ [1,"L",0] ],[ [1,"M",0] ],[ [1,"N",0] ],[ [1,"O",0] ],
				[ [1,"P",0] ],[ [1,"Q",0] ],[ [1,"R",0] ],[ [1,"S",0] ],[ [1,"T",0] ],
				[ [1,"U",0] ],[ [1,"V",0] ],[ [1,"W",0] ],[ [1,"X",0] ],[ [1,"Y",0] ],
				[ [1,"Z",0] ],
				[ [1,"0",0] ],[ [1,"1",0] ],[ [1,"2",0] ],[ [1,"3",0] ],[ [1,"4",0] ],
				[ [1,"5",0] ],[ [1,"6",0] ],[ [1,"7",0] ],[ [1,"8",0] ],[ [1,"9",0] ],
				[ [1,"_",0] ],[ [1,"$",0] ]
			],
			"name-first-char" : [
				[ [1,"a",0] ],[ [1,"b",0] ],[ [1,"c",0] ],[ [1,"d",0] ],[ [1,"e",0] ],
				[ [1,"f",0] ],[ [1,"g",0] ],[ [1,"h",0] ],[ [1,"i",0] ],[ [1,"j",0] ],
				[ [1,"k",0] ],[ [1,"l",0] ],[ [1,"m",0] ],[ [1,"n",0] ],[ [1,"o",0] ],
				[ [1,"p",0] ],[ [1,"q",0] ],[ [1,"r",0] ],[ [1,"s",0] ],[ [1,"t",0] ],
				[ [1,"u",0] ],[ [1,"v",0] ],[ [1,"w",0] ],[ [1,"x",0] ],[ [1,"y",0] ],
				[ [1,"z",0] ],
				[ [1,"A",0] ],[ [1,"B",0] ],[ [1,"C",0] ],[ [1,"D",0] ],[ [1,"E",0] ],
				[ [1,"F",0] ],[ [1,"G",0] ],[ [1,"H",0] ],[ [1,"I",0] ],[ [1,"J",0] ],
				[ [1,"K",0] ],[ [1,"L",0] ],[ [1,"M",0] ],[ [1,"N",0] ],[ [1,"O",0] ],
				[ [1,"P",0] ],[ [1,"Q",0] ],[ [1,"R",0] ],[ [1,"S",0] ],[ [1,"T",0] ],
				[ [1,"U",0] ],[ [1,"V",0] ],[ [1,"W",0] ],[ [1,"X",0] ],[ [1,"Y",0] ],
				[ [1,"Z",0] ],
				[ [1,"_",0] ],[ [1,"$",0] ]
			],
			"name-char-array" : [
				[ [0,"name-char",0], [0,"name-char-array",0] ],
				[ [0,"name-char",0] ]
			],
			"name" : [
				[ [0,"name-first-char",0], [0,"name-char-array",0] ],
				[ [0,"name-first-char",0] ]
			],
			"name-opt" : [
				[ [0,"name",0] ],
				[ [5,"",0] ]
			],
			"function-definition-attribute2" : [ // not opt
				[ 
					  [1,"@[",0]
					, [0,"function-definition-attribute2-part1",0]
					, [1,"]",0] 
				]
			],
			"function-definition-attribute2-part1" : [
				[ 
					  [0,"space-opt",0]
					, [0,"value-expression",0]
					, [0,"space-opt",0]
					, [0,"function-definition-attribute2-part2",0] 
				]
			],
			"function-definition-attribute2-part2" : [
				[ 
					  [1,",",0]
					, [0,"space-opt",0]
					, [0,"number-integer",0]
					, [0,"space-opt",0]
					, [0,"function-definition-attribute-part3",0] 
				]
			],
			"function-definition-attribute-part3" : [
				[ 
					  [1,",",0]
					, [0,"space-opt",0]
					, [0,"boolean-value",0]
					, [0,"space-opt",0] 
				]
			],
			"function-definition-attribute" : [ // always opt
				[ 
					  [1,"@[",0]
					, [0,"function-definition-attribute-part1",0]
					, [1,"]",0] 
				]
			],
			"function-definition-attribute-part1" : [
				[ 
					  [0,"space-opt",0]
					, [0,"value-expression-opt",0]
					, [0,"space-opt",0]
					, [0,"function-definition-attribute-part2",0] 
				],
				[ 
					  [0,"space-opt",0]
					, [0,"value-expression-opt",0]
					, [0,"space-opt",0] 
				],
				[ 
					  [0,"space-opt",0]
					, [0,"function-definition-attribute-part2",0] 
				],
				[ [5,"",0] ]
			],
			"function-definition-attribute-part2" : [
				[ 
					  [1,",",0]
					, [0,"space-opt",0]
					, [0,"number-integer-opt",0]
					, [0,"space-opt",0]
					, [0,"function-definition-attribute-part3",0] 
				],
				[ 
					  [1,",",0]
					, [0,"space-opt",0]
					, [0,"number-integer-opt",0]
					, [0,"space-opt",0] 
				],
				[ 
					  [1,",",0]
					, [0,"space-opt",0]
					, [0,"function-definition-attribute-part3",0] 
				],
				[ [5,"",0] ]
			],
			"function-definition-attribute-part3" : [
				[ 
					  [1,",",0]
					, [0,"space-opt",0]
					, [0,"boolean-value-opt",0]
					, [0,"space-opt",0] 
				],
				[ 
					  [1,",",0]
					, [0,"space-opt",0] 
				],
				[ [5,"",0] ]
			],
			"function-arguments" : [
				[ 
					 [1,"(",0]
					,[0,"function-arguments-list-opt",0]
					,[1,")",0] 
				],
				[ 
					[0,"name",0]
				]
			],
			"function-arguments-list-opt" : [
				[ [0,"function-arguments-list",0] ],
				[ [0,"space-opt",0] ],
				[ [5,"",0] ]
			],
			"function-arguments-list" : [ // not final
				[ 
					  [0,"space-opt",0]
					, [0,"name",0]
					, [0,"space-opt",0]
					, [1,",",0]
					, [0,"function-arguments-list",0] 
				],
				[ 
					[0,"space-opt",0]
					, [0,"name",0]
					, [0,"space-opt",0] 
				]
			],
			"function-body" : [
				  [ [0,"statement",0] ]
				, [ [0,"block",0] ]
			],
			"block" : [
				[ 
					  [1,"{",0]
					, [0,"space-opt",0]
					, [0,"statement-list-opt",0]
					, [0,"space-opt",0]
					, [1,"}",0] 
				]
			],
			"function-expression" : [
				[
					  [0,"space-opt",0]
					, [0,"function-definition-attribute",0]
					, [0,"space-opt",0]
				],
				[
					  [0,"space-opt",0]
					, [0,"function-arguments",0]
					, [0,"space-opt",0]
					, [1,"=>",0]
					, [0,"space-opt",0]
					, [0,"function-body",0]
					, [0,"space-opt",0]
				]
			],
			"named-operator" : [
				[ [ 0, "function-definition-attribute2",0 ] ],
			],
			"binary-operator" : [
				
				[ [1,"++",0] ], // scalar rotate to right cw
				[ [1,"+",0] ], // scalar
				[ [1,"--",0] ], // scalar rotate to left ccw
				[ [1,"-",0] ], // scalar
				[ [1,"**",0] ], // scalar exp
				[ [1,"*",0] ], // scalar and vector
				[ [1,"/",0] ], // scalar
				[ [1,"%",0] ], // scalar
				[ [1,">>",0] ], // bitwise
				[ [1,"<<",0] ], // bitwise
				[ [1,"||",0] ], // macrologic
				[ [1,"&&",0] ], // macrologic
				[ [1,"^^",0] ], // macro logic version
				[ [1,"^",0] ], // bitwise version (not)
				[ [1,"|",0] ], // bitwise
				[ [1,"&",0] ], // bitwise
				[ [1,"<->",0] ], // macro logic version
				[ [1,"<>",0] ], // <-> bitwise version
				[ [1,"->",0] ], // transfer (depends on context)
				[ [1,"<-",0] ], // transfer (depends on context)
				[ [1,">=",0] ], // macro logic
				[ [1,"<=",0] ], // macro logic
				[ [1,">",0] ], // macro logic
				[ [1,"<",0] ], // macro logic
				[ [1,"==",0] ], // macro logic
				[ [1,"!=",0] ], // macro logic
				[ [1,"..",0] ], // static from type
				[ [1,"b0",0] ], // bitwise
				[ [1,"b1",0] ], // bitwise
				[ [1,"b2",0] ], // bitwise
				[ [1,"b3",0] ], // bitwise
				[ [1,"b4",0] ], // bitwise
				[ [1,"b5",0] ], // bitwise
				[ [1,"b6",0] ], // bitwise
				[ [1,"b7",0] ], // bitwise
				[ [1,"b8",0] ], // bitwise
				[ [1,"b9",0] ], // bitwise
				[ [1,"bA",0] ], // bitwise
				[ [1,"bB",0] ], // bitwise
				[ [1,"bC",0] ], // bitwise
				[ [1,"bD",0] ], // bitwise
				[ [1,"bE",0] ], // bitwise
				[ [1,"bF",0] ], // bitwise
				[ [1,"and",0] ], // bitwise
				[ [1,"or",0] ], // bitwise
				[ [1,"xor",0] ], // bitwise
				[ [1,"xnor",0] ], // bitwise
				[ [1,"first",0] ], // bitwise 2
				[ [1,"second",0] ], // bitwise 4   
				[ [0,"named-operator",0] ]
			],
			"full-identifier" : [
				[ [0,"name",0] ]
			],
			"call-arguments-list" : [
				[ [0,"value-expression-operation",0] , [0,"space-opt",0],[1,",",0],[0,"space-opt",0],[0,"call-arguments-list",0] ],
				[ [0,"value-expression-operation",0] ]
			],
			"call-arguments-opt" : [
				[ [0,"call-arguments-list",0] ],
				[ [5,"",0] ]
			],
			"call-expression" : [
				[ [0,"space-opt",0], [1,"(",0], [0,"space-opt",0], [0,"call-arguments-opt",0], [0,"space-opt",0], [1,")",0] ]
			],
			"indexed-expression" : [
				[ [0,"space-opt",0], [1,"[",0], [0,"space-opt",0], [0,"value-expression",0], [0,"space-opt",0], [1,"]",0] ]
			],
			"member-expression" : [
				[ [0,"space-opt",0], [1,".",0], [0,"space-opt",0], [0,"full-identifier",0], [0,"space-opt",0] ]
			],
			"ref-connection" : [
				[ [0,"call-expression",0], [0,"ref-connection",0] ],
				[ [0,"call-expression",0] ],
				[ [0,"indexed-expression",0], [0,"ref-connection",0] ],
				[ [0,"indexed-expression",0] ],
				[ [0,"member-expression",0], [0,"ref-connection",0] ],
				[ [0,"member-expression",0] ]
			],
			"ref-expression" : [ // call, indexed, member
				[ [0,"function-expression",0], [0,"call-expression",0], [0,"ref-connection",0] ],
				[ [0,"function-expression",0], [0,"call-expression",0] ],
				[ [0,"full-identifier",0], [0,"ref-connection",0] ],
				[ [0,"full-identifier",0] ]
			],
			"value" : [
				[ [0,"number-integer",0] ],
				[ [0,"boolean-value",0] ],
				[ [0,"string-value",0] ],
				[ [1,"null",0] ],
				[ [1,"undefined",0] ],
				[ [1,"NaN",0] ],
				[ [0,"ref-expression",0] ]
			],
			"value-expression" : [
				[ [0,"space-opt",0], [1,"(",0], [0,"space-opt",0], [0,"value-expression-operation",0], [0,"space-opt",0], [1,")", 0], [0,"space-opt",0] ],
				[ [0,"value",0] ]
			],
			"value-expression-opt" : [
				[ [0,"value",0] ],
				[ [5,"",0] ]
			],
			"value-expression-unit" : [
				[ [0,"value-expression",0], [0,"space-opt",0], [0,"binary-operator",0], [0,"space-opt",0], [0,"value-expression-unit",0] ],
				[ [0,"space-opt",0], [1,"(",0], [0,"space-opt",0], [0,"value-expression-operation",0], [0,"space-opt",0], [1,")", 0], [0,"space-opt",0] ],
				[ [0,"value-expression",0] ]
			],
			"value-expression-conditional" : [
				[ 
					  [0,"value-expression-unit",0]
					, [0,"space-opt",0]
					, [1,"?",0]
					, [0,"space-opt",0]
					, [0,"value-expression-unit",0]
					, [0,"space-opt",0]
					, [1,":",0]
					, [0,"space-opt",0]
					, [0,"value-expression-unit", 0]
					, [0,"space-opt",0] 
				]
			],
			"value-expression-operation" : [
			
			
				[ [0,"space-opt",0], [1,"(",0], [0,"space-opt",0], [0,"name-definition-item",0], [0,"space-opt",0], [1,")", 0], [0,"space-opt",0] ],
				[ [0,"space-opt",0], [1,"(",0], [0,"space-opt",0], [0,"value-expression-operation",0], [0,"space-opt",0], [1,")", 0], [0,"space-opt",0] ],
				[ [0,"space-opt",0], [1,"(",0], [0,"space-opt",0], [0,"value-expression-conditional",0], [0,"space-opt",0], [1,")", 0], [0,"space-opt",0] ],
				[ [0,"space-opt",0], [1,"(",0], [0,"space-opt",0], [0,"value-expression-unit",0], [0,"space-opt",0], [1,")", 0], [0,"space-opt",0] ],
				[ [0,"value-expression-conditional",0] ],
				[ [0,"value-expression-unit",0] ]
			],
			"value-attributes-opt" : [
				[ [0,"space-opt",0], [1,"const",0], [0,"space",0] ],
				[ [5,"",0] ]
			],
			"value-attributes-space-opt" : [
				[ [0,"space",0], [1,"const",0], [0,"space",0] ],
				[ [5,"",0] ]
			],
			"expression" : [
				[ [0,"function-expression",0] ],
				[ [1,"=",0], [0,"space-opt",0], [0,"function-expression",0], [0,"space-opt",0] ],
				[ [1,"=",0], [0,"value-attributes-opt",0], [0,"space-opt",0], [0,"value-expression-operation",0], [0,"space-opt",0] ]
			],
			"statement-list-opt" : [
				[ [0,"statement-list",0] ],
				[ [5,"",0] ]
			],
			"statement-list" : [
				[ [0,"statement",0], [0,"statement-list",0] ],
				[ [0,"statement",0] ]
			],
			"empty-statement" : [
				[ [1,";",0] ]
			],
			"name-definition-item" : [ // name may be a returned string value
				[
					  [0,"space-opt",0]
					, [0,"name",0]
					, [0,"space-opt",0]
					, [0,"value-attributes-space-opt",0]
					, [0,"function-definition-attribute",0]
					, [0,"space-opt",0]
				],
				[
					  [0,"space-opt",0]
					, [0,"name",0]
					, [0,"space-opt",0]
					, [0,"value-attributes-space-opt",0]
					, [0,"function-arguments",0]
					, [0,"space-opt",0]
					, [0,"block",0]
					, [0,"space-opt",0]
				],
				[
					  [0,"space-opt",0]
					, [0,"name",0]
					, [0,"space-opt",0]
					, [0,"expression",0]
					, [0,"space-opt",0]
				]
			],
			"name-definition-list" : [
				[ [0, "name-definition-item",0], [0,"space-opt",0], [1,",",0], [0,"space-opt",0], [0,"name-definition-list",0] ],
				[ [0, "name-definition-item",0] ]
			],
			"name-definition" : [
				[
					  [1,"def",0],[0,"space",0],[0,"name-definition-list",0]
				]
			],
			"set-statement" : [
				[
					[0,"name-definition-list",0]
				]
			],
			"discard-value-statement" : [
				[ [0,"space-opt",0],[0,"value-expression-operation",0],[0,"space-opt",0] ]
			],
			"if-statement" : [
				[ [0,"space-opt",0], [1,"if",0], [0,"space",0], [0,"value-expression-operation",0], [0,"function-body",0], [0,"space-opt",0], [0,"else-statement-opt",0], [0,"space-opt",0] ],
				[ [0,"space-opt",0], [1,"if",0], [0,"space-opt",0], [1,"(",0], [0,"space-opt",0], [0,"value-expression-operation",0], [0,"space-opt",0], [1,")",0], [0,"function-body",0], [0,"space-opt",0], [0,"else-statement-opt",0], [0,"space-opt",0] ],
			],
			"else-statement-opt" : [
				[ [1,"else",0], [0,"space",0], [0,"statement"] ],
				[ [1,"else",0], [0,"space-opt",0], [0,"block"] ],
				[ [5,"",0] ]
			],
			"return-statement" : [
				[ [0,"space-opt",0], [1,"return",0], [0,"space",0], [0,"value-expression-operation",0] ]
			],
			"label-statement" : [
				[ [0,"space-opt",0], [0,"name",0], [0,"space-opt",0], [1,":",0] ]
			],
			"statement" : [
				  [ [0,"label-statement",0] ]
				, [ [0,"return-statement",0] ]
				, [ [0,"if-statement",0] ]  
				, [ [0,"set-statement",0] ]
				, [ [0,"name-definition",0] ]
				//, [ [0,"function-definition",0] ]
				, [ [0,"empty-statement",0] ]
				, [ [0,"discard-value-statement",0] ]
			],
			"main" : [
				[ 
					  [0,"space-opt",0]
					, [0,"statement-list",0]
					, [0,"space-opt",0] 
				],
				[ [5,"",0] ]
			]
		};
		function logicn_arr(op,arr) {
			var i = 0;
			var max = ( 1 << ( 1 << arr.length) ) - 1;
			var c = false;
			for( var x = arr.length-1 ; x>=0 ; x-- ) {
				if( arr[x] == max ) {
					i |= ( 1 << ((arr.length-1)-x) );
				} else if( arr[x] == 0 ) {
					// do nothing
				} else {
					// next
					c = true;
				}
			}
			if(!c) return ( op % ( ( 1 << (i+1) ) >>> 0 ) ) > ( ( ( 1 << i ) >>> 0 ) - 1 ) ? max : 0;
			return null;
		}
		
		
		var bn = new BigInteger("0000010",10);
		console.log(bn.toString(10));
		
		lang.boot = function(ctx) {
			ctx.stack = [];
			
		};
		lang.update = {
			"statement" : function(syntax) {
				
			}
		};
		lang.events = {
			"statement-list" : {
				before : {
					select :[0,2,4],
					handler : function(ctx,i,str) {
						/*
						if(str[1]!="") {
							console.log("@3",str);	
							var a = parseInt(""+str[0],10),
								b = parseInt(""+str[1],10),
								c = parseInt(""+str[2],10);
							
							console.log(a,b,c,logicn_arr(b,[a,c]));
							
						} else {
							console.log("@1",str);
							var a = parseInt(str[0]);
							console.log(a);
							
						}
						*/
					}
				}
			},
			"expression" : {
				before : {
					handler : function(ctx,i,str) {
						console.log("expression",i,str);
					}
				}
			},
			"statement" : {
				before : {
					handler : function(ctx,i,str) {
						console.log("statement",i,str);
					}
				}
			},
			"function-definition" : {
				before : {
					handler : function(ctx,i,str) {
						console.log("function-definition",i,str);
					}
				}
			},
			"if-statement" : {
				before : {
					handler : function(ctx,i,str) {
						console.log("if",i,str);
					}
				}
			},
			"set-statement" : {
				before : {
					handler : function(ctx,i,str) {
						console.log("set",i,str);
					}
				}
			},
			"name-definition" : {
				before : {
					handler : function(ctx,i,str) {
						console.log("name",i,str);
					}
				}
			},
			"function-body" : {
				before : {
					handler : function(ctx,i,str) {
						console.log("function-body",i,str);
					}
				}
			},
			"else-statement-opt" : {
				before : {
					handler : function(ctx,i,str) {
						console.log("else",i,str);
					}
				}
			},
			"name-definition-item" : {
				before : {
					handler : function(ctx,i,str) {
						console.log("name definition item",i,str);
					}
				}
			}
			
		};
		lang.shutdown = function(ctx) {
			
		};
	}
	LOGICUNIT.prototype.run = function(doc,context) {
		var local_context = context || {};
		local_context.core = {};
		local_context.core.boot = this.lang.boot;
		local_context.core.shutdown = this.lang.shutdown;
		local_context.core.filter = this.lang.events;
		var r = Interpreter.parser(doc,Interpreter.pre( this.lang.syntax ),local_context);
		if(r[1]) {
			console.log("@ PARSER COMPLETED >>"+doc.substring(0,r[0])+"<<");
			//console.log(JSON.stringify( r[2].list ) );
		} else {
			console.log("@ PARSER FAIL");
		}
	}
	LOGICUNIT.prototype.tests = function() {
		var tests = [
			"def a(){}",
			"def a@[8,2,true]",
			"def a{}",
			"def a=const 10",
			"def a=10",
			"def a=0x10",
			"def a=true",
			"def a=null",
			"def a=undefined",
			"def a=NaN",
			"def a=10++20,b:32<->c",
			"def a=true?false:true",
			"def a=@[8,2,true]",
			"def a=(x)=>{}",
			"def a=fun1(a+1,b+2,c+3)+4",
			"def a=\"ok\"+\"?\"",
			"def a='ok'", // def a='ok\r\n' // fail, it must, but how to capture?
			"def a=@'ok\r\nfail\r\n'@",
			"def a=\"@((teste1+teste2(a,b,c)+10)>10?true:false) is the result\"",
			"def a=10,b=20",
			"a=10",
			"a=(x,y)=>{y=x+1}",
			"a.b(100)",
			"if a>10+(b>5?10:5) ok()else{fail()fail()return 10;}"
		];
		
		
		for(var x = 0; x < tests.length;x++) {
			var doc = tests[x];
			var r = Interpreter.parser(doc,Interpreter.pre( lang.syntax ),context);
			if(r[1]) {
				console.log("@ PARSER COMPLETED >>"+doc.substring(0,r[0])+"<<");
				//console.log(JSON.stringify( r[2].list ) );
			} else {
				console.log("@ PARSER FAIL");
			}
		}
	}
	
	
	
	return LOGICUNIT;
	
})(this);
