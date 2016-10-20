// set stable 1.0
// already parses partial
// 1.5 have events and timeout
// 2.0 reduce loops: x X | x by using first x that was parsed ok -> maybe hard to debug, specially if add a function that changes context
//console.log("BEGIN");
var cl = console.log;
var lines = 0;
console.log = function() {
	//cl("@");
	var args = [];
	for(var x = 0; x < arguments.length;x++) args.push(arguments[x]);
	lines += 1;
	return cl.apply(console,args);
}

var lang = {};
lang.charset = function(str) {
	var r = [];
	r.push( [ [4,str] ]);
	return r;
}
lang.uri = {
	"digit-char" : lang.charset("0123456789"),
	"hex-lower-digit-char" : lang.charset("0123456789abcdef"),
	"hex-upper-digit-char" : lang.charset("0123456789ABCDEF"),
	"alpha-char"  : lang.charset("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"),
	
	main : [
		[ [0,"scheme"], [1,":"], [0,"hier-part"], [0,"queryOpt"], [0,"fragmentOpt"] ]
	],
	unreserved : [
		[ [0,"alpha-char"] ],
		[ [0,"digit-char"] ],
		[ [1,"-"] ],
		[ [1,"."] ],
		[ [1,"_"] ],
		[ [1,"~"] ]
	],
	"sub-delims" : [
		[ [1,"!"] ],
		[ [1,"$"] ],
		[ [1,"&"] ],
		[ [1,"'"] ],
		[ [1,"("] ],
		[ [1,")"] ],
		[ [1,"*"] ],
		[ [1,"+"] ],
		[ [1,","] ],
		[ [1,";"] ],
		[ [1,"="] ]
	],
	"pct-encoded" : [
		[ [1,"%"], [0,"hex-lower-digit-char"], [0,"hex-lower-digit-char"] ],
		[ [1,"%"], [0,"hex-upper-digit-char"], [0,"hex-upper-digit-char"] ]
	],
	pchar : [
		[ [0,"unreserved"] ],
		[ [0,"pct-encoded"] ],
		[ [0,"sub-delims"] ],
		[ [1,":"] ],
		[ [1,"@"] ]
	],
	fragmentInstanceItem : [
		[ [0,"pchar"] ],
		[ [1,"/"] ],
		[ [1,"?"] ]
	],
	fragmentInstance : [
		[ [0,"fragmentInstanceItem"], [0,"fragmentInstance"] ],
		[ [0,"fragmentInstanceItem"] ]
	],
	fragmentInstanceOpt : [
		[ [0,"fragmentInstance"] ],
		[ [2] ]
	],
	fragment : [
		[ [1,"#"], [0,"fragmentInstanceOpt"] ]
	],
	fragmentOpt : [
		[ [0,"fragment"] ],
		[ [2] ]
	],
	queryInstanceItem : [
		[ [0,"pchar"] ],
		[ [1,"/"] ],
		[ [1,"?"] ]
	],
	queryInstance : [
		[ [0,"queryInstanceItem"], [0,"queryInstance"] ],
		[ [0,"queryInstanceItem"] ]
	],
	queryInstanceOpt : [
		[ [0,"queryInstance"] ],
		[ [2] ]
	],
	query : [
		[ [1,"?"], [0,"queryInstanceOpt"] ]
	],
	queryOpt : [
		[ [0,"query"] ],
		[ [2] ]
	],
	"hier-part" : [
		[ [1,"/"], [1,"/"] ]
	],
	"scheme-char" : [
		[ [0,"alpha-char"] ],
		[ [0,"digit-char"] ],
		[ [1,"+"] ],
		[ [1,"-"] ],
		[ [1,"."] ]
	],
	"scheme-part1" : [
		[ [0,"scheme-char"], [0,"scheme-part1"] ],
		[ [0,"scheme-char"] ]
	],
	"scheme-part1-opt" : [
		[ [0,"scheme-part1"] ],
		[ [2] ]
	],
	scheme : [
		[ [0,"alpha-char"], [0,"scheme-part1"] ]
	]
}
lang.bookScript = {
	main : [ 
		[ [0,"docList"] ],
		[ [2] ]
		//[ [0,"space-nl-opt"], [0,"tags"] ]
	],
	"bin-char" : lang.charset("01"),
	"octal-char" : lang.charset("01234567"),
	"hex-lower-digit-char" : lang.charset("0123456789abcdef"),
	"hex-upper-digit-char" : lang.charset("0123456789ABCDEF"),
	"nonzero-digit-char" : lang.charset("123456789"),
	"digit-char" : lang.charset("0123456789"),
	"integer2" : [
		[ [0,"digit-char"], [0,"integer"] ],
		[ [0,"digit-char"] ]
	],
	"integer" : [
		[ [0,"nonzero-digit-char"], [0,"integer2"] ],
		[ [0,"nonzero-digit-char"] ]
	],
	integerOpt : [
		[ [0,"integer"] ],
		[ [2] ]
	],
	"mantissa" : [
		[ [0,"integer2"] ]
	],
	"mantissaOpt" : [
		[ [0,"mantissa"] ],
		[ [2] ]
	],
	"sign" : [
		[ [1,"+"] ],
		[ [1,"-"] ]
	],
	"signOpt" : [
		[ [0,"sign"] ],
		[ [2] ]
	],
	"exp" : [
		[ [1,"e"], [0,"signOpt"], [0,"integer"] ],
		[ [1,"b"], [0,"signOpt"], [0,"integer"] ]
	],
	"expOpt" : [
		[ [0,"exp"] ],
		[ [2] ]
	],
	"float" : [
		[ [0,"signOpt"], [0,"integer"], [1,"."], [0,"mantissaOpt"], [0,"expOpt"] ],
		[ [0,"signOpt"], [0,"integerOpt"], [1,"."], [0,"mantissa"], [0,"expOpt"] ],
		[ [0,"signOpt"], [0,"integerOpt"], [0,"exp"] ]
	],
	"hex-lower-item" : [
		[ [0,"hex-lower-digit-char"], [0,"hex-lower-item"] ],
		[ [0,"hex-lower-digit-char"] ]
	],
	"hex-upper-item" : [
		[ [0,"hex-upper-digit-char"], [0,"hex-upper-item"] ],
		[ [0,"hex-upper-digit-char"] ]
	],
	"hex-type" : [
		[ [0,"hex-lower-item"] ],
		[ [0,"hex-upper-item"] ]
	],
	"hex" : [
		[ [1,"0"], [1,"x"], [0,"hex-type"] ]
	],
	"octal-item" : [
		[ [0,"octal-char"], [0,"octal-item"] ],
		[ [0,"octal"] ]
	],
	"octal" : [
		[ [1,"0"], [0,"octal-item"] ]
	],
	"bin-item" : [
		[ [0,"bin-char"], [0,"bin-item"] ],
		[ [0,"bin-char"] ]
	],
	"bin" : [
		[ [1,"0"], [1,"b"], [0,"bin-item"] ]
	],
	"readable-float-second" : [
		[ [1,"."], [0,"integer2"] ],
		[ [2] ]
	],
	"readable-float-first-part1" : [
		[ [0,"nonzero-digit-char"], [0,"digit-char"], [0,"digit-char"] ],
		[ [0,"nonzero-digit-char"], [0,"digit-char"] ],
		[ [0,"nonzero-digit-char"] ]
	],
	"readable-float-first-part2" : [
		[ [0,"digit-char"], [0,"digit-char"], [0,"digit-char"] ]
	],
	"readable-float-first2" : [
		[ [0,"readable-float-first-part2"], [1,","], [0,"readable-float-first2"] ],
		[ [0,"readable-float-first-part2"] ]
	],
	"readable-float-first" : [
		[ [0,"readable-float-first-part1"], [1,","], [0,"readable-float-first2"] ],
		[ [0,"readable-float-first-part1"] ]
	],
	"readable-float" : [
		[ [0,"readable-float-first"], [0,"readable-float-second"] ]
	],
	number : [
		[ [0,"readable-float"] ],
		[ [0,"bin"] ],
		[ [0,"octal"] ],
		[ [0,"hex"] ],
		[ [0,"float"] ],
		[ [0,"integer"] ]
	],
	"punc-char" : lang.charset("`~!@#$%^&*()_+-[]{}|;:,.?<>/="),
	"alpha-char"  : lang.charset("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"),
	"space-char" : lang.charset(" "),
	"space-nl-char" : lang.charset(" \t\r\n"),
	"space-nl" : [
		[ [ 0,"space-nl-char"], [0,"space-nl"] ],
		[ [ 0,"space-nl-char"] ]
	],
	"space-nl-opt" : [
		[ [0,"space-nl"] ],
		[ [2] ]
	],
	"space-char-opt" : [
		[ [0,"space-char"] ],
		[ [2] ]
	],
	"space" : [
		[ [1," "], [0,"space"] ],
		[ [1," "] ]
	],
	"space-opt" : [
		[ [0,"space"] ],
		[ [2] ]
	],
	"letters" : [
		[ [0,"alpha-char"], [0,"letters"] ],
		[ [0,"alpha-char"] ]
	],
	"dqsc-char" : [
		[ [1,"\\\n"] ],
		[ [1,"\\\r\n"] ],
		[ [1,"\\\\"] ],
		[ [1,"\\\""] ],
		[ [1," "] ],
		[ [0,"alpha-char"] ],
		[ [0,"digit-char"] ],
		[ [0,"punc-char"] ]
	],
	"dqsc" : [
		[ [0,"dqsc-char"], [0,"dqsc"] ],
		[ [0,"dqsc-char"] ]
	],
	"sqsc-char" : [
		[ [1,"\\\n"] ],
		[ [1,"\\\r\n"] ],
		[ [1,"\\\\"] ],
		[ [1,"\\'"] ],
		
		[ [0,"alpha-char"] ],
		[ [0,"digit-char"] ],
		[ [0,"punc-char"] ]
	],
	"sqsc" : [
		[ [0,"sqsc-char"], [0,"sqsc"] ],
		[ [0,"sqsc-char"] ]
	],
	"string" : [
		[ [1,"\""], [0,"dqsc"], [1,"\""] ]
	],
	tagChar : [
		[ [0,"alpha-char"] ]
		, [ [0,"digit-char"] ]
		, [ [4,"$_-+#@!&*^~?/\\."] ]
		//, [ [1,"$_-+#@!&*%^~:?/\\"] ]
	],
	tagName : [
		[ [0,"tagChar"], [0,"tagName"] ],
		[ [0,"tagChar"] ]
	],
	tagNameOpt : [
		[ [0,"tagName"] ],
		[ [2] ]
	],
	tagAttribKeyOperators : [
		[ [1,"=="] ],
		[ [1,"="] ],
		[ [1,"!="] ],
		[ [1,"<>"] ],
		[ [1,">="] ],
		[ [1,"<="] ],
		[ [1,">"] ],
		[ [1,"<"] ],
		[ [1,"&&"] ],
		[ [1,"||"] ],
		[ [1,"^^"] ],
		[ [1,"+="] ],
		[ [1,"-="] ],
		[ [1,"*="] ],
		[ [1,"/="] ],
		[ [1,"%="] ],
		[ [1,"&="] ],
		[ [1,"|="] ],
		[ [1,"^="] ],
		[ [1,">>="] ],
		[ [1,"<<="] ],
		[ [1,"+"] ],
		[ [1,"-"] ],
		[ [1,"*"] ],
		[ [1,"/"] ],
		[ [1,"%"] ],
		[ [1,"&"] ],
		[ [1,"|"] ],
		[ [1,"^"] ],
		[ [1,">>"] ],
		[ [1,"<<"] ]
	],
	tagAttribKey : [
		[ [0,"tag"] ],
		[ [0,"string"] ],
		[ [0,"letters"] ],
		[ [0,"tagAttribKeyOperators"] ],
		[ [0,"number"] ]
	],
	tagAttribValue : [
		[ [0,"doc"] ],
		[ [0,"tag"] ],
		[ [0,"string"] ],
		[ [0,"letters"] ], // mayonly accept letterNumber$_, letterFirst$_ like js -> to be treated on StringString2String
		[ [0,"tagAttribKeyOperators"] ],
		[ [0,"number"] ],
	],
	tagAttribItemOptionEnd : [
		[[2]]
	],
	tagAttribItemOption : [
		[ [0,"tag"], [0,"tagAttribItemOptionEnd"] ],
		[ [0,"string"], [0,"tagAttribItemOptionEnd"] ],
		[ [0,"letters"], [0,"tagAttribItemOptionEnd"] ],
		[ [0,"tagAttribKeyOperators"], [0,"tagAttribItemOptionEnd"] ],
		[ [0,"number"], [0,"tagAttribItemOptionEnd"] ]
	],
	tagAttribItemKeyValueEnd : [
		[[2]]
	],
	tagAttribItemKeyValue : [
		[ [0,"tagAttribKey"],[1,":"],[0,"tagAttribValue"], [0,"tagAttribItemKeyValueEnd"] ]
	],
	tagAttribItemExprOpen : [
		[ [1,"("] ]
	],
	tagAttribItemExprClose : [
		[ [1,")"] ]
	],
	tagAttribItemType : [
		[ [0,"tagAttribItemExprOpen"] ],
		[ [0,"tagAttribItemExprClose"] ],
		[ [0,"tagAttribItemKeyValue"] ],
		[ [0,"tagAttribItemOption"] ]
	],
	tagAttribItem : [
		[ [0,"tagAttribItemType"] ]
	],
	tagAttribList : [
		[ [0,"tagAttribItem"], [0,"space-opt"],[0,"tagAttribList"] ],
		[ [0,"tagAttribItem"] ]
	],
	tagAttribListOpt : [
		[ [0,"tagAttribList"] ],
		[ [2] ]
	],
	tagAttribs : [
		[ [1,"["], [0,"tagAttribsBegin"], [0,"space-opt"], [0,"tagAttribListOpt"], [0,"space-opt"], [0,"tagAttribsEnd"], [1,"]"] ],
		[ [2] ]
	],
	tagBody : [
		[ [0,"docList"] ],
		[ [0,"tagList"] ],
		[ [2] ]
	],
	tagEnd : [
		[ [1,"}"] ]
	],
	tagContent : [
		[ [1,":"], [0,"space-nl-opt"], [0,"tagBody"], [0,"tagEnd"] ],
		[ [0,"tagEnd"] ]
	],
	tagAttribsBegin : [
		[ [2] ]
	],
	tagAttribsEnd : [
		[ [2] ]
	],
	tag : [
		[ [1,"{"],[0,"tagNameOpt"], [0,"tagAttribs"], [0,"tagContent"] ]
	],
	tagListType : [
		[ [0,"doc"], [0,"space-nl-opt"] ],
		[ [0,"tag"], [0,"space-nl-opt"] ]
	],
	tagList : [
		[ [0,"tagListType"], [0,"tagList"] ],
		[ [0,"tagListType"] ]
	],
	tagListOpt : [
		[ [0,"tagList"] ],
		[ [2] ]
	],
	docAttribKey : [
		[ [0,"tag"] ],
		[ [0,"string"] ],
		[ [0,"letters"] ],
		//[ [0,"tagAttribKeyOperators"] ],
		[ [0,"number"] ]
	],
	docAttribValue : [
		[ [0,"doc"] ],
		[ [0,"tag"] ],
		[ [0,"string"] ],
		[ [0,"letters"] ], // mayonly accept letterNumber$_, letterFirst$_ like js -> to be treated on StringString2String
		//[ [0,"tagAttribKeyOperators"] ],
		[ [0,"number"] ],
	],
	docAttribItemKeyValueEnd : [
		[[2]]
	],
	docAttribItemKeyValue : [
		[ [0,"docAttribKey"],[1,":"],[0,"docAttribValue"], [0,"docAttribItemKeyValueEnd"] ]
	],
	docAttribItemOptionEnd : [
		[[2]]
	],
	docAttribItemOption : [
		[ [0,"tag"], [0,"docAttribItemOptionEnd"] ],
		[ [0,"string"], [0,"docAttribItemOptionEnd"] ],
		[ [0,"letters"], [0,"docAttribItemOptionEnd"] ],
		[ [0,"tagAttribKeyOperators"], [0,"docAttribItemOptionEnd"] ],
		[ [0,"number"], [0,"docAttribItemOptionEnd"] ]
	],
	docAttribItemType : [
		[ [0,"docAttribItemKeyValue"] ],
		[ [0,"docAttribItemOption"] ]
	],
	docAttribItem : [
		[ [0,"docAttribItemType"] ]
	],
	docAttribList : [
		[ [0,"docAttribItem"], [0,"space-opt"],[0,"docAttribList"] ],
		[ [0,"docAttribItem"] ]
	],
	docAttribListOpt : [
		[ [0,"docAttribList"] ],
		[ [2] ]
	],
	docAttribsBegin : [
		[ [2] ]
	],
	docAttribsEnd : [
		[ [2] ]
	],
	docAttribs : [
		[ [1,"["], [0,"docAttribsBegin"], [0,"space-opt"], [0,"docAttribListOpt"], [0,"space-opt"], [0,"docAttribsEnd"], [1,"]"] ],
		[ [2] ]
	],
	docEnd : [
		[ [1,">"] ]
	],
	docStart : [ 
		/* 
			request:
				<[domain:"free" tip:{tipModel} id:doc args:{set[(#a) (#b) (#c) d]} log:"file://./" ] > // tip may be a ready resource in exchange to use domain. like distribution. the resource obviously can be tested anytime before, during, after. domain free is default.
				<
					{template
						[
							(#arg_a)
							(#arg_b)
							tag:tagName 
							id:template_a
							patterns:{
								[(arg_b#):{call[owner verb target arg1 arg2]} b c (arg_a#)]
							}
						]:
						{tagToBeCopied[(arg_a#)]}
						{(arg_b#)}
					}
					{on[create tag:tagName id:e1]:
						{tag1}
						{tag2}
					}
					{on[forget tag:tagName]:
						{tag1}
						{tag2}
					}
					{on[match tag:tagName]:
						{tag1}
						{comment[knock knock]}
						{tag2}
					}
					{on[create id:doc]:
						{comment[prepare resources to use]}
						{comment[check user]}
						{comment[check tip if is a password, a resource or something]}
					}
					
					{find[type:tag rename:{[any:*]} {amount[{amount[1]} {amount[*]}:{[id:{[value:a {amount[2]}]}]} {amount[*]}]} timeout:tomorrow]:
						{*}
						{print}
						{*}
					}
					{comment[used on tag find, find[type:attribute_value attribute_key attribute tag_w_attribute tag_w_attribute_value tag_w_attribute_key]}
					{tagName[
						(#arg_a):{[key:value value:10]} 
						(#arg_b):{[key:a]}
						(#arg_b):a
					]}
					{forget[id:template_a]}
					{forget[id:e1]:
						{print[data:ok]}
					} // forget about test is better than elseout but elseout maybe an alias to forget
					{alias[id:elseout type:tag source:forget destiny:elseout]}
					{alias[id:off type:tag source:forget destiny:off]}
					{forget[id:elseout]}
					{alias[id:forget_backup source:forget destiny:forget_backup]}
					{forget[id:forget]} // test to recover context that was deleted by user when system get out of document
					{comment[ human being cant forget easily as a computer cause events that would possible wanted to forget is used to predict events, so pattern matching is an event ]}
					{comment[ any shit ]}
					{next}
					{previous}
				>
			effect:
				{tagName[
						(#arg_a):{[key:value value:10]} 
						(#arg_b):{[key:a]}
						(#arg_b):a
				]}
				
				becomes
				
				{tagName[
						a:{filter}
						b
						c
						value:10
				]:
					{tagToBeCopied[value:10]}
					{a}
				}
				
				at run time which is when find {tagName}, template never runs
				tagName may be partial template, 
				how to operate template arguments? can be anything.
				set $owner -> that
				set $verb -> on, off
				set $target -> this
				
				alias may modify everything in the BookScript, thats why a domain is created.
		*/
		[ [1,"<"], [0,"space-nl-opt"],[0,"docAttribs"],[0,"space-nl-opt"], [0,"tagListOpt"] ]
	],
	doc : [
		[ [0,"docStart"] , [0,"docEnd"] ]
	],
	docList : [
		[ [0,"doc"], [0,"docList"] ],
		[ [0,"doc"] ]
	]

};
function tabs(n) {
	var str = [];
	for(var x = 0; x < n;x++) str.push("    ");
	return str.join("");
}
function lang_2_ml(lang,name) {
	var r = [];
	r.push("<lang name=\""+name+"\">");
	for(var key in lang) {
		r.push(tabs(1)+"<statement name=\"" + key + "\">");
		for(var x = 0; x < lang[key].length;x++) {
			r.push(tabs(2)+"<rule>");
			var rule = lang[key][x];
			for(var y = 0; y < rule.length;y++) {
				var token = rule[y];
				if(token[0] == 0) {
					r.push(tabs(3)+"<token type=\"ref\" value=\""+token[1]+"\"/>");
				} else if(token[0]==1) {
					var val = token[1].replace(/\\/g,"\\\\");
					val = val.replace(/\"/g,"\\\"");
					val = val.replace(/\r/g,"\\r");
					val = val.replace(/\n/g,"\\n");
					val = val.replace(/\t/g,"\\t");
					
					r.push(tabs(3)+"<token type=\"string\" value=\""+val+"\"/>");
				} else if(token[0]==4) {
					var val = token[1].replace(/\\/g,"\\\\");
					val = val.replace(/\"/g,"\\\"");
					r.push(tabs(3)+"<token type=\"charset\" value=\""+val+"\"/>");
				}
			}
			r.push(tabs(2)+"</rule>");
		}
		r.push(tabs(1)+"</statement>");	
	}
	r.push("</lang>");
	return r.join("\r\n");
}
//console.log( lang_2_ml(lang.bookScript,"BookScript") );

function Parser(json,doc,opts) {
	opts = opts || {};
	var ctx = {};
	if("context" in opts) {
		ctx = opts.context;
	}
	doc = doc.split("\r").join("");
	var r = ["main",{rule:0},[]];
	var cur = json.main;
	var stack = [["main",cur,0 /*2 rule*/,0 /*3 token*/,0 /*4 state*/, 0 /* backtrack */, r]];
	var pos = 0;
	var last = 0;
	// set start time
	var debug = 0;
	var startTime = process.hrtime();
	var endTime = startTime[0] * 1000000 + startTime[1] / 1000 + opts.timeout*1000;
	while(stack.length>0) {
		// check timeout
		if("timeout" in opts) {
			var currentTime = process.hrtime();
			if( (endTime) <  ( currentTime[0] * 1000000 + currentTime[1] / 1000 ) ) {
				//console.log("startTime",startTime[0] * 1000000 + startTime[1] / 1000 + opts.timeout*1000,"currentTime",( currentTime[0] * 1000000 + currentTime[1] / 1000 ));
				return {
					document : doc,
					tree : null,
					result : 0,
					resultCode : 2, // timeout
					lastChar : 0
				}
			}
		}
		var check = true;
		var stack_item = stack.pop();
		var statement_name = stack_item[0];
		var statement = stack_item[1];
		var rule = stack_item[2];
		var token = stack_item[3];
		var $token = statement[ rule ][ token ];
		if(debug==1) console.log(tabs(stack.length)+"cur:"+statement_name);
		
		stack_item[6][1].rule = rule;
		//console.log(tabs(stack.length)+JSON.stringify(r)+"::",JSON.stringify(stack_item[6]));
		//console.log();
		//console.log(doc,"[",statement_name,rule,token,"] pos:",pos,"type:",$token[0],"state:",stack_item[4],JSON.stringify(stack));
		if(pos >= doc.length) {
			//console.log("break", JSON.stringify(stack_item),JSON.stringify(stack));
			//break;
		}
		if( stack_item[4] == -1) { // fail
			if(debug==1) console.log(1);
			//console.log(":: fail rule");	
			last = 0;
			pos = stack_item[5];
			if( rule + 1 >= statement.length) { // fail statement -> will fail at trying a loop
				if(debug==1) console.log(2);
				if(stack.length>0) {
					if(debug==1) console.log(3);
					stack[ stack.length -1 ][4] = -1;
				}
			} else {
				if(debug==1) console.log(4);
				stack_item[2] += 1;
				stack_item[3] = 0;
				stack_item[4] = 0;
				
				// trying next rule, clear all items
				var len = stack_item[6][2].length;
				while(len>0) {
					stack_item[6][2].pop();
					len -= 1;
				}
				stack.push( stack_item );
				
			}
		} else if(stack_item[4] == 0) {
			
			if( $token[0] == 0 ) {
				
				if($token[1] in json) {
					if(debug==1) console.log(6);
					stack_item[4] = 0;
					var t = [];
					t[0] = $token[1];
					if(debug==1) console.log(tabs(stack.length+1)+$token[1]);
					t[1] = {rule:0};
					t[2] = [];
					stack_item[6][2].push( t );
					stack.push(stack_item);
					stack.push([$token[1],json[$token[1]],0,0,0,pos, t]);
				} else {
					throw "not found: " + $token[1];
				}
			} else if( $token[0] == 1) {
				if(debug==1) console.log(7);
				var check = true;
				if(pos >= doc.length) {
					check = false;
				} else {
					for(var x = 0; (x < $token[1].length) && (pos +x < doc.length);x++) {
						if($token[1][x] != doc.charAt(pos+x)) {
							check = false;
							break;
						}
					}
				}
				if( check ) {
					if(debug==1) console.log(8);
					if(debug==1) console.log("ok",$token[1],pos,$token[1].length);
					var tag = $token[1];
					
					tag = tag.replace(/\\/g,"\\\\");
					tag = tag.replace(/\"/g,"\\\"");
					tag = tag.replace(/\r\n/g,"\\\r\n");
					tag = tag.replace(/\n/g,"\\\r\n");
					
					stack_item[6][2].push( ["\"" + tag + "\"",{ at : pos, type : "string" },[] ]);
					last = 1;
					pos += $token[1].length;
					if( token + 1 >= statement[rule].length ) { // found rule
						if(debug==1) console.log(9);
						if(stack.length>0) {
							if(debug==1) console.log(10);
							stack[ stack.length-1][4] = 1;
						}
					} else {
						if(debug==1) console.log(11);
						// next token
						stack_item[3] += 1;
						stack_item[4] = 0;
						stack.push(stack_item);
					}
				} else {
					if(debug==1) console.log(12);
					//console.log("fail",$token[1]);
					last = 0;
					pos = stack_item[5]; // backtrack
					if( rule + 1 >= statement.length) {
						if(debug==1) console.log(13);
						if(stack.length>0) {
							if(debug==1) console.log(14);
							
							stack[ stack.length - 1 ][4] = -1;
						}
					} else {
						if(debug==1) console.log(15);
						stack_item[2] += 1;
						stack_item[3] = 0;
						stack_item[4] = 0;
						var len = stack_item[6][2].length;
						while(len>0) {
							stack_item[6][2].pop();
							len -= 1;
						}
						stack.push(stack_item);
					}
				}
			} else if($token[0] == 2) { // empty
				if(debug==1) console.log(17);
				last = 1;
				if( token + 1 >= statement[rule].length ) { // found rule
					if(debug==1) console.log(18);
					if(stack.length>0) {
						if(debug==1) console.log(19);
						stack[ stack.length-1][4] = 1;
					}
				} else {
					if(debug==1) console.log(20);
					stack_item[3] += 1;
					stack_item[4] = 0;
					stack.push(stack_item);
				}
			} else if($token[0] == 3) { // any char
				if(debug==1) console.log(21);
				if( pos + 1 < doc.length) {
					if(debug==1) console.log(22);
				}
			} else if($token[0] == 4) { // 1char in charset
				var ch = doc.charAt(pos);
				if( $token[1].indexOf(ch) != -1 ) {
					if(debug==1) console.log(23);
					if(debug==1) console.log("ok",$token[1],pos,$token[1].length);
					var tag = ch;
					tag = tag.replace(/\\/g,"\\\\");
					tag = tag.replace(/\"/g,"\\\"");
					stack_item[6][2].push( ["\"" + tag + "\"",{ at : pos, type : "char" },[] ]);
					last = 1;
					pos += 1;
					if( token + 1 >= statement[rule].length ) { // found rule
						if(debug==1) console.log(24);
						if(stack.length>0) {
							if(debug==1) console.log(25);
							stack[ stack.length-1][4] = 1;
						}
					} else {
						if(debug==1) console.log(26);
						// next token
						stack_item[3] += 1;
						stack_item[4] = 0;
						stack.push(stack_item);
					}
				} else {
					if(debug==1) console.log(27);
					//console.log("fail",$token[1]);
					last = 0;
					pos = stack_item[5]; // backtrack
					if( rule + 1 >= statement.length) {
						if(debug==1) console.log(28);
						if(stack.length>0) {
							if(debug==1) console.log(29);
							
							stack[ stack.length - 1 ][4] = -1;
						}
					} else {
						if(debug==1) console.log(30);
						stack_item[2] += 1;
						stack_item[3] = 0;
						stack_item[4] = 0;
						var len = stack_item[6][2].length;
						while(len>0) {
							stack_item[6][2].pop();
							len -= 1;
						}
						stack.push(stack_item);
					}
				}
			} else {
				throw "rule " + rule[0]
			}
		} else if(stack_item[4] == 1) {
			if(debug==1) console.log(31);
			if( token + 1 >= statement[rule].length ) {
				if(debug==1) console.log(32);
				if(stack.length>0) {
					// this is will dequeue, parent state is unkown
					
					// check if has more tokens
					var parent = stack[stack.length-1];
					if( parent[3] + 1 >= parent[1][ parent[2] ].length ) { // found rule
						if(debug==1) console.log(33);
						if(stack.length>0) {
							if(debug==1) console.log(34);
							parent[4] = 1;
						}
					} else {
						if(debug==1) console.log(35);
						// next token
						parent[3] += 1;
						parent[4] = 0;
					}
					//if(debug==1) console.log(25);
					//stack[ stack.length-1 ][4] = 1;
				}
			} else {
				if(debug==1) console.log(36);
				// rule has next token
				//console.log("!",JSON.stringify(stack));
				stack_item[3] += 1;
				stack_item[4] = 0;
				stack.push(stack_item);
			}
		}
	}
	if(debug==1) console.log(37);
	
	if("events" in opts && last==1) {
		if(debug==1) console.log(38);
		function getstring(id,tag) {
			var stack2 = [[tag,0]];
			var buffer = [];
			var used = [];
			while(stack2.length>0) {
				var item = stack2.shift();
				var tag = item[0];
				
				var check = false;
				for(var x = 0; x < used.length;x++) {
					if(tag == used[x]) {
						check = true;
					}
				}
				
				if(!check && "type" in tag[1]) {
					//console.log(id,tag[0]);
					if( tag[1].type == "char") {
						buffer.push(tag[0].charAt(1));
					} else if(tag[1].type =="string") {
						buffer.push(tag[0].substring(1,tag[0].length-1));
					} else {
						if(item[1] < tag[2].length) {
							stack2.unshift([item[0],item[1]+1]);
							stack2.unshift([tag[2][item[1]],0]);
							//stack2.push(tag[2][x]);
						}	
					}
					used.push(tag);
				} else {
					if(item[1] < tag[2].length) {
						stack2.unshift([item[0],item[1]+1]);
						stack2.unshift([ tag[2][item[1]], 0]);
					}
				}
			}
			return buffer.join("");
		}
		var stack = [[r,-1]];
		var id = 0;
		if("begin" in opts) {
			opts.begin(ctx);
		}
		var used = [];
		while(stack.length>0) {
			var item = stack.shift();
			var tag = item[0];
			//console.log("@",tag[0],item[1]+1,tag[2].length);
			if(tag[0] in opts.events && "rule" in tag[1]) {
				//console.log("EVT EVERY",tag[0]);
				//console.log("   ",tag[0],item[1]+1,tag[2].length);
				var check = false;
				for(var x = 0; x < used.length;x++) {
					if( tag == used[x]) {
						check = true;
						break;
					}
				}
				if(!check) {
					//console.log("EVT ONCE",tag[0]);
					var rule = parseInt(tag[1].rule);
					var arr = [];
					for(var x = 0; x < tag[2].length;x++) { 
						var str = getstring(id++,tag[2][x]);
						arr.push( str ); 
					}
					opts.events[ tag[0] ]( ctx, arr );
					used.push(tag);
					
					if(item[1]+1 < tag[2].length) {
						if(item[1]+2 < tag[2].length) {
							stack.unshift([item[0],item[1]+1]);
						}
						stack.unshift([tag[2][item[1]+1],-1]);
					}
					
				} else if(item[1]+1 < tag[2].length) {
					if(item[1]+2 < tag[2].length) {
						stack.unshift([item[0],item[1]+1]);	
					}
					stack.unshift([tag[2][item[1]+1],-1]);
				}
			} else {
				if(item[1]+1 < tag[2].length) {
					if(item[1]+2 < tag[2].length) {
						stack.unshift([item[0],item[1]+1]);
					}
					stack.unshift([tag[2][item[1]+1],-1]);
				}
			}
		}
		if("end" in opts) {
			opts.end(ctx);
		}
	}
	return {
		document : doc,
		tree : last == 1 ? r : null,
		context : ctx,
		result : last == 1,
		resultCode : last,
		lastChar : pos
	}
}

function json_array_2_ml(arr,level,hideOrder) {
	level = level || 0;
	hideOrder = hideOrder || false;
	var str = [];
	str.push(tabs(level)+"<" + arr[0]);
	var head = [];
	for(var key in arr[1]) {
		var t = Object.prototype.toString.apply(arr[1][key]);
		if(arr[1][key]==null || arr[1][key]==true) str.push(" \"" + key + "\"");
		else if(key=="$") {
			if(arr[1][key].length>0 && !hideOrder) {
				str.push(" " + key + "=\"" + arr[1][key].join(",") +"\"" );
			}
		} else if(t=="[object Array]") {
			str.push(" \"" + key + "\"=\""+arr[1][key][0]+"\"");
			head.push(arr[1][key]);
			console.log("head");
		} else {
			str.push(" \"" + key + "\"=" + arr[1][key])
		}
	}
	//console.log(">>",JSON.stringify(arr));
	if(arr[2].length>0 || head.length>0) {
		str.push(">\r\n");
		if(head.length>0) {
			str.push(tabs(level+1)+"<head>\r\n");
			for(var x = 0; x < head.length;x++) {
				str.push(json_array_2_ml( head[x], level+2,hideOrder));
			}
			str.push(tabs(level+1)+"</head>\r\n");
			if(arr[2].length>0) {
				str.push(tabs(level+1)+"<body>\r\n");
				for(var x = 0; x < arr[2].length;x++) str.push( json_array_2_ml(arr[2][x], level+2,hideOrder) );
				str.push(tabs(level+1)+"<body>\r\n");
			}
		} else {
			for(var x = 0; x < arr[2].length;x++) str.push( json_array_2_ml(arr[2][x], level+1,hideOrder) );
		}
		str.push(tabs(level)+"</" + arr[0]+">\r\n")
	} else {
		str.push("/>\r\n");
	}
	return str.join("");
}


/*
var test_docs = ["<\"abc\" \"g\"=100>\r\n</\"abc\">"];
for(var x = 0; x < test_docs.length;x++) {
	var doc = test_docs[x];
	var r = Parser(lang.html,doc);
	if(r.result) {
		
		console.log( json_array_2_ml(r.tree) );
		console.log( "parsed:","\r\n"+r.document.substring(0,r.lastChar) );
	} else {
		console.log("fail on parse :" + doc);
	}
}
*/
// us-layout


var csi = '\033[';
var attributes = undefined;
var output_owner = process.stdout;
var output = process.stdout.write;
var xy = {};
var stdin = process.stdin;
stdin.setRawMode( true );
stdin.setEncoding( 'utf8' );
stdin.pause();
input = {};
input.log = [];
input.count = 0;
input.buffer = [];
input.callback = null;
input.pos = [0,0];
var dataKey = -1;
stdin.on( 'data', function( key ){
	
	dataKey = key;
	var s = [];
	var t = [];
	var enter = false;
	var skip = false;
	for(var x = 0; x < dataKey.length;x++) {
		s.push("" + dataKey.charCodeAt(x));
		t.push(dataKey.charCodeAt(x));
	}
	if(dataKey.length==1 && t[0]==8) {
		if(input.buffer.length>0) {
			input.buffer.pop();
			input.count += 1;
			left(1);
			write(" ");
			left(1);
		}
		skip = true;
		
	} else if(dataKey.length==1 && t[0]==9) {
		console.log("TAB");
	} else if(dataKey.length==1 && t[0]==13) {
		enter = true;
		skip = true;
	} else if(dataKey.length==1 && t[0]==32) {
		input.buffer.push(" ");
	} else if(dataKey.length==1 && t[0]==27) {
		console.log("ESCAPE");
	} else if(dataKey.length==1 && t[0]==33) {
		input.buffer.push("!");
	} else if(dataKey.length==1 && t[0]==64) {
		input.buffer.push("@");
	} else if(dataKey.length==1 && t[0]==35) {
		input.buffer.push("#");
	} else if(dataKey.length==1 && t[0]==36) {
		input.buffer.push("$");
	} else if(dataKey.length==1 && t[0]==37) {
		input.buffer.push("%");
	} else if(dataKey.length==1 && t[0]==94) {
		input.buffer.push("^");
	} else if(dataKey.length==1 && t[0]==38) {
		input.buffer.push("&");
	} else if(dataKey.length==1 && t[0]==42) {
		input.buffer.push("*");
	} else if(dataKey.length==1 && t[0]==40) {
		input.buffer.push("(");
	} else if(dataKey.length==1 && t[0]==41) {
		input.buffer.push(")");
	} else if(dataKey.length==1 && t[0]==45) {
		input.buffer.push("-");
	} else if(dataKey.length==1 && t[0]==95) {
		input.buffer.push("_");
	} else if(dataKey.length==1 && t[0]==61) {
		input.buffer.push("=");
	} else if(dataKey.length==1 && t[0]==43) {
		input.buffer.push("+");
	} else if(dataKey.length==1 && t[0]==59) {
		input.buffer.push(";");
	} else if(dataKey.length==1 && t[0]==39) {
		input.buffer.push("'");
	} else if(dataKey.length==1 && t[0]==44) {
		input.buffer.push(",");
	} else if(dataKey.length==1 && t[0]==46) {
		input.buffer.push(".");
	} else if(dataKey.length==1 && t[0]==47) {
		input.buffer.push("/");
	} else if(dataKey.length==1 && t[0]==58) {
		input.buffer.push(":");
	} else if(dataKey.length==1 && t[0]==60) {
		input.buffer.push("<");
	} else if(dataKey.length==1 && t[0]==62) {
		input.buffer.push(">");
	} else if(dataKey.length==1 && t[0]==63) {
		input.buffer.push("?");
	} else if(dataKey.length==1 && t[0]==34) {
		input.buffer.push("\"");
	} else if(dataKey.length==1 && t[0]==91) {
		input.buffer.push("[");
	} else if(dataKey.length==1 && t[0]==93) {
		input.buffer.push("]");
	} else if(dataKey.length==1 && t[0]==92) {
		input.buffer.push("\\");
	} else if(dataKey.length==1 && t[0]==96) {
		input.buffer.push("`");
	} else if(dataKey.length==1 && t[0]==123) {
		input.buffer.push("{");
	} else if(dataKey.length==1 && t[0]==124) {
		input.buffer.push("|");
	} else if(dataKey.length==1 && t[0]==125) {
		input.buffer.push("}");
	} else if(dataKey.length==1 && (t[0]>= 48 && t[0] <=57)) {
		input.buffer.push("" + (t[0]-48));
	} else if(dataKey.length==1 && (t[0]>= 97 && t[0] <=122)) {
		var t0 = "abcdefghijklmnopqrstuvwxyz";
		input.buffer.push("" + t0.charAt(t[0]-97));
	} else if(dataKey.length==1 && (t[0]>= 65 && t[0] <=90)) {
		var t0 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		input.buffer.push("" + t0.charAt(t[0]-65));
	} else if(dataKey.length==3 && t[0] == 27 && t[1]==91) {
		if(t[2] == 68) {
			console.log("LEFT");
		} else if(t[2] == 67) {
			console.log("RIGHT");
		} else if(t[2] == 65) {
			//console.log("UP");
			// find last command on history
			if(input.log.length>0) {
				var data = input.log.pop();
				
				// clear current data
				while(input.buffer.length>0) {
					input.buffer.pop();
					left(1);
					write(" ");
					left(1);
				}
				input.count += 1;
				skip = true;
				// set previous data
				for(var x = 0; x < data.length;x++) {
					input.buffer.push(data.charAt(x));
				}
				write(data);
			}
			
		} else if(t[2] == 66) {
			console.log("DOWN");
			
		}
		
	} else if(dataKey.length==4 && t[0] == 27 && t[1]==91) {
		if(t[2] == 50 && t[3] == 126) {
			console.log("INSERT");
		} else if(t[2] == 51 && t[3] == 126) {
			console.log("DELETE");
		} else if(t[2] == 49 && t[3] == 126) {
			console.log("HOME");
		} else if(t[2] == 52 && t[3] == 126) {
			console.log("END");
		} else if(t[2] == 53 && t[3] == 126) {
			console.log("PAGEUP");
		} else if(t[2] == 54 && t[3] == 126) {
			console.log("PAGEDOWN");
		} else if(t[2] == 91 && t[3] == 65) {
			console.log("F1");
		} else if(t[2] == 91 && t[3] == 66) {
			console.log("F2");
		} else if(t[2] == 91 && t[3] == 67) {
			console.log("F3");
		} else if(t[2] == 91 && t[3] == 68) {
			console.log("F4");
		} else if(t[2] == 91 && t[3] == 69) {
			console.log("F5");
		}
	} else if(dataKey.length==5 && t[0]==27 && t[1]==91) {
		if(t[2] == 49 && t[3] == 55&& t[4] == 126) {
			console.log("F6");
		} else if(t[2] == 49 && t[3] == 56 && t[4] == 126) {
			console.log("F7");
		} else if(t[2] == 49 && t[3] == 57 && t[4] == 126) {
			console.log("F8");
		} else if(t[2] == 50 && t[3] == 48 && t[4] == 126) {
			console.log("F9");
		} else if(t[2] == 50 && t[3] == 49 && t[4] == 126) {
			console.log("F10");
		} else if(t[2] == 50 && t[3] == 51 && t[4] == 126) {
			console.log("F11");
		} else if(t[2] == 50 && t[3] == 52 && t[4] == 126) {
			console.log("F12");
		}
	}
	//write();
	if(!skip) {
		write(input.buffer[input.buffer.length-1]);
	}
	//console.log(dataKey.length + ",keycode:"+s.join(","));
	
	if((!skip && input.count == 0) || enter) {
		//console.log();
		//console.log("[",skip,input.count,enter,"]");
		var data = input.buffer.join("");
		var len = input.buffer.length;
		while(len>0) {
			input.buffer.pop();
			len-= 1;
		}
		input.callback&&input.callback(data);
		stdin.pause();
		return;
	} else if(!skip && input.count>0) {
		input.count -= 1;
	} 
});

function getkey(callback) {
	input.count = 1;
	input.callback = callback || null;
	stdin.resume();	
}
function getnkeys(n,callback) {
	input.count = n-1;
	input.callback = callback || null;
	stdin.resume();
}

var fg = {
	black:csi+'30m',
	red:csi+'31m',
	green:csi+'32m',
	yellow:csi+'33m',
	blue:csi+'34m',
	magenta:csi+'35m',
	cyan:csi+'36m',
	lightgray:csi+'37m',
	darkgray:csi+'30;1m',
	lightred:csi+'31;1m',
	lightgreen:csi+'32;1m',
	lightyellow:csi+'33;1m',
	lightblue:csi+'34;1m',
	lightmagenta:csi+'35;1m',
	lightcyan:csi+'36;1m',
	white:csi+'37;1m',
};
var bg = {
	black:csi+'40m',
	red:csi+'41m',
	green:csi+'42m',
	yellow:csi+'43m',
	blue:csi+'44m',
	magenta:csi+'45m',
	cyan:csi+'46m',
	white:csi+'47m',
};
var normal = csi+'0m';

/* functions */
function gotoxy(x,y) {
	write(csi+y+';'+x+'H');
}
function getxy() {
	write(csi+'6n');
}
function pushxy(name,x,y) {
	if(!name) {
		write(csi+'s');
	}
	else if(x && y) {
		xy[name.toLowerCase()] = {x:x,y:y};
	}
}
function popxy(name) {
	if(!name) {
		write(csi+'u');
	}
	else if(xy[name.toLowerCase()]){
		gotoxy(xy[name.toLowerCase()].x,xy[name.toLowerCase()].y);
	}
}
function ins(n) {
	write(csi+n+'@');
}
function del(n) {
	write(csi+n+'P');
}
function right(n) {
	
	write(csi+n+'C');
}
function left(n) {
	write(csi+n+'D');
}
function up(n) {
	write(csi+n+'A');
}
function down(n) {
	write(csi+n+'B');
}
function clear() {
	write(csi+'0J');
}
function cleartoeol() {
	write(csi+'0K');
}
function home() {
	gotoxy(1,1);
}
function write(str) {
	output.apply(output_owner,[str]);
}
function strlen(str) {
	return str.replace(/\033(s|u|\d+[ABCDJKLMPSTXZn]|\d+(;\d\d?)?[Hfm])/g,'').length;
}

// gotoxy(1,63); // unkown size of terminal or even if is at that point(currently is the last line)
//console.log("BEGIN2");

function convertStringString2String(str) {
	var check = false;
	for(var x = 0; x < str.length;x++) {
		var ch = str.charAt(x);
		if(
			ch==":" || ch=="[" || ch=="]" || ch=="<" ||
			ch==">" || ch=="{" || ch=="}" || ch==" " ||
			ch=="+" || ch=="-" || ch=="*" || ch=="/" ||
			ch=="%" || ch=="^" || ch=="=" || ch=="^" ||
			ch=="(" || ch==")"
			// ch == operator
			// ch == number
		) {
			check = true;
			break;
		}
		if( ch == "\\" 
			&& x + 1 < str.length && str.charAt(x+1) == "\\"
			&& x + 2 < str.length && str.charAt(x+1) == "\\"
			&& x + 3 < str.length && str.charAt(x+1) == "\""
		) {
			check = true;
			break;
		}
	}
	if(!check) { // these can be reduced
		if(str.length>3 && str.charAt(0) == "\\" && str.charAt(1) == "\""  && str.charAt(str.length-2) == "\\" && str.charAt(str.length-1) == "\"") {
			// check by token
			return str.substring(2,str.length-2);
		}
	} else {
		if(str.length>3 && str.charAt(0) == "\\" && str.charAt(1) == "\""  && str.charAt(str.length-2) == "\\" && str.charAt(str.length-1) == "\"") {
			// "ok:\"" -> \"ok:\\\"\"
			
			// return direct
			//<{a["ok:\""]}>
			//["document",{"$":[]},[["a",{"$":["\\\"ok:\\\\\\\"\\\""],"\\\"ok:\\\\\\\"\\\"":true},[]]]]
			
			//<{a["ok:"]}>
			//["document",{"$":[]},[["a",{"$":["\\\"ok:\\\""],"\\\"ok:\\\"":true},[]]]]
			
			// return "\"" + str.substring(2,str.length-2) + "\"";
			
			
			//str = str.replace(/\\\\\\"/g,"\\\"");
			
			var str2 = "\"" + str.substring(2,str.length-2) + "\"";
			var r = [];
			for(var x = 0; x < str2.length;x++) {
				if(
					str2.charAt(x) == "\\" &&
					x + 1 < str2.length && str2.charAt(x+1) == "\\" &&
					x + 2 < str2.length && str2.charAt(x+2) == "\\" &&
					x + 3 < str2.length && str2.charAt(x+3) == "\""
				) {
					r.push("\\\"");
					x += 3;
				} else {
					r.push(str2.charAt(x));
				}
			}
			return r.join("");
			
		}
	}
	return str;
}

var context = {
	$ : {}
};

function Machine(name,opt) {
	var obj = [
		"machine",{ $:["name","stack","memory","warnings","errors","interrupt","timer"]
			, name : name 
			, stack : ["stack",{$:[]},[]]
			, memory: ["memory",{$:[]},[]]
			, warnings : ["warnings",{$:[]},[]]
			, errors : ["errors",{$:[]},[]]
			, interrupt : ["interrupt",{$:[]},[]]
			, timer : ["timer",{$:[]},[]]
			, log : ["log",{$:[]},[]]
			, lang : ["lang",{ // user-space
				$:[]
			},[
				// components of generic language(which is bs.)
				["config",{$:["selected"],selected:"BookScript"},[]]
				// may store date and time changes if want to log and fit something.
			]]
		},[
			// components of machine tp.
		]
	];
	opt = opt || {};
	if("creator" in opt) {
		obj[1].creator = opt.creator;
	}
	// update memory model
	return obj;
}
context.machines = {
	"main" : Machine("main")
};

// hard code?
context.machines.main[1].memory[1].$.push("boot");
context.machines.main[1].memory[1].boot = ["text",{$:["value"],value:"boot.bs"},[]];
context.machines.main[1].memory[1].$.push("$logic");
context.machines.main[1].memory[1].$logic = 1;


context.programs = {};
context.$tag = ["$tag",{},[]];
context.$attrib = ["$attrib",{},[]];
context.$document = ["$document",{},[]];
context.$timer = ["$timer",{},[]]; // used to split data streams from real world plus parsed at runtime in inside scope. the digital era is delaying live frequency of unkown locations that are not being live living, cause world is mapped, that brings matrix as an unavoidable objective.
context.$clipboard = ["$clipboard",{},[]]; // concious storage
context.spareTime = 0; // time trying to match previous found syntaxes on spare time that may lead to same results with low arguments modification (self improve), calculate timings to decide what is better. the start search is tiped by creator, and can jump mutate based on results and loaded spare programs.


function flushMachineMemory() {
	require("fs").writeFileSync("bs.json",JSON.stringify(context.machines),"utf8");
	var r = {};
	for(var key in context.machines) {
		r[key] = context.machines[key][1].memory[1];
	}
	require("fs").writeFileSync("memories.json",JSON.stringify(r),"utf8");
}

// hard coded to load or not initial config, cause startMachine must be really const at universe instance. otherwise inner code will corrupt.
context.config = ["$system",{mode:"persistent",startMachine:"main"},[]];
if(context.config[1].mode == "persistent") {
	if( require("fs").existsSync("memories.json") ) {
		var str = require("fs").readFileSync("memories.json","utf8");
		// load memories from all last machines
		var obj = JSON.parse(str);
		for(var key in obj) {
			context.machines[key] = Machine(key);
			context.machines[key][1].memory[1] = obj[key];
		}
		// JSON.stringify(r.context.memory),"utf8");
	}
}

function parseBookScript(doc,context,machineName) {
	var debug_log = [""];
	var r = Parser(lang.bookScript,doc,{timeout:10000,
		context : context,
		begin : function(ctx) {
			ctx.containerStack = [];	
			ctx.list = [];
			ctx.attribStack = [];
			ctx.currentAttribTag = null;
			ctx.enumeratingAttribs = [false];
			ctx.error = {
				code : 1,
				message : ""
			}
		},
		events: {
			"docStart" : function(ctx,arr) {
				debug_log.push("docStart =");
				for(var x = 0; x < arr.length;x++) { debug_log.push(x+":"+arr[x]); }
				var obj = ["document",{$:[]},[]];
				if( ctx.enumeratingAttribs[ ctx.enumeratingAttribs.length-1] ) {
					var attrib = ctx.attribStack[ ctx.attribStack.length-1 ]
					attrib[0][ attrib[1] ] = obj;
				} else {
					if(ctx.containerStack.length==0) {
						ctx.list.push(obj);
					} else {
						ctx.containerStack[ctx.containerStack.length-1][2].push(obj);
					}
				}
				ctx.containerStack.push(obj);
				ctx.enumeratingAttribs.push(false);
			},
			"docEnd" : function(ctx,arr) {
				debug_log.push("docEnd");
				for(var x = 0; x < arr.length;x++) { debug_log.push(x+":"+arr[x]); }
				if( ctx.containerStack.length>0) {
					ctx.containerStack.pop();	
				}
				ctx.enumeratingAttribs.pop();
			},
			"tagAttribsBegin" : function(ctx,arr) {
				debug_log.push("tagAttribsBegin");
				ctx.enumeratingAttribs.push(true);
			},
			"tagAttribsEnd" : function(ctx) {
				debug_log.push("tagAttribsEnd");
				ctx.enumeratingAttribs.pop();
			},
			"tag" : function(ctx,arr) {
				debug_log.push("tag =");
				for(var x = 0; x < arr.length;x++) { debug_log.push(x+":"+arr[x]); }
					var obj = [arr[1],{$:[]},[]];
				if( ctx.enumeratingAttribs[ ctx.enumeratingAttribs.length-1] ) {
					var attrib = ctx.attribStack[ ctx.attribStack.length-1 ]
					attrib[0][ attrib[1] ] = obj;
				} else {
					if(ctx.containerStack.length==0) {
						ctx.list.push(obj);
					} else {
						ctx.containerStack[ctx.containerStack.length-1][2].push(obj);
					}
				}
				ctx.containerStack.push(obj);
				ctx.enumeratingAttribs.push(false);
			},
			"tagEnd" : function(ctx,arr) {
				debug_log.push("tagEnd");
				for(var x = 0; x < arr.length;x++) { debug_log.push(x+":"+arr[x]); }
				if( ctx.containerStack.length>0) {
					ctx.containerStack.pop();
				}
				ctx.enumeratingAttribs.pop();
			},
			"tagAttribItemExprOpen" : function(ctx,arr) {
				debug_log.push("tagAttribItemExprOpen =");
				for(var x = 0; x < arr.length;x++) {
					debug_log.push(x+":"+arr[x]);
				}
				var target = null;
				if(ctx.containerStack.length>0) {
					target = ctx.containerStack[ctx.containerStack.length-1];
				}
				if(target==null) {
					throw "parser error at tag-attrib-key-value";
				}
				arr[0] = convertStringString2String(arr[0]);
				target[1].$.push(arr[0]);
				target[1][ arr[0] ] = true;
				ctx.attribStack.push( [target[1],arr[0]] );
			},
			"tagAttribItemExprClose" : function(ctx,arr) {
				debug_log.push("tagAttribItemExprClose =");
				for(var x = 0; x < arr.length;x++) {
					debug_log.push(x+":"+arr[x]);
				}
				var target = null;
				if(ctx.containerStack.length>0) {
					target = ctx.containerStack[ctx.containerStack.length-1];
				}
				if(target==null) {
					throw "parser error at tag-attrib-key-value";
				}
				arr[0] = convertStringString2String(arr[0]);
				target[1].$.push(arr[0]);
				target[1][ arr[0] ] = true;
				ctx.attribStack.push( [target[1],arr[0]] );
			},
			"tagAttribItemKeyValue" : function(ctx,arr) {
				debug_log.push("tagAttribItemKeyValue =");
				for(var x = 0; x < arr.length;x++) {
					debug_log.push(x+":"+arr[x]);
				}
				var target = null;
				if(ctx.containerStack.length>0) {
					target = ctx.containerStack[ctx.containerStack.length-1];
				}
				if(target==null) {
					throw "parser error at tag-attrib-key-value";
				}
				// console.log(" @@@@@@@@" ,JSON.stringify(ctx.attribStack));
				target[1].$.push(arr[0]);
				if(!(arr[0] in target[1])) {
					arr[2] = convertStringString2String(arr[2]);
					target[1][ arr[0] ] = arr[2];
				} else {
					var t = Object.prototype.toString.apply( target[1][ arr[0] ] );
					if(t == "[object Array]") {
						arr[2] = convertStringString2String(arr[2]);
						target[1][ arr[0] ].push(arr[2]);
					} else {
						var first = target[1][ arr[0] ];
						arr[2] = convertStringString2String(arr[2]);
						target[1][ arr[0] ] = [ first,arr[2] ];
					}
				}
				ctx.attribStack.push( [target[1],arr[0]] );
			},
			"tagAttribItemKeyValueEnd"  : function(ctx,arr) {
				debug_log.push("tagAttribItemKeyValueEnd");
				ctx.attribStack.pop();
			},
			"tagAttribItemOption" : function(ctx,arr) {
				debug_log.push("tagAttribItemOption =");
				for(var x = 0; x < arr.length;x++) {
					debug_log.push(x+":"+arr[x]);
				}
				var target = null;
				if(ctx.containerStack.length>0) {
					target = ctx.containerStack[ctx.containerStack.length-1];
				}
				if(target==null) {
					throw "parser error at tag-attrib-option";
				}
				arr[0] = convertStringString2String(arr[0]);
				target[1].$.push(arr[0]);
				target[1][ arr[0] ] = true;
				ctx.attribStack.push( [target[1],arr[0]] );
			},
			"tagAttribItemOptionEnd" : function(ctx,arr) {
				debug_log.push("tagAttribItemOptionEnd");
				ctx.attribStack.pop();
			},
			"docAttribItemKeyValue" : function(ctx,arr) {
				debug_log.push("docAttribItemKeyValue =");
				for(var x = 0; x < arr.length;x++) {
					debug_log.push(x+":"+arr[x]);
				}
				var target = null;
				if(ctx.containerStack.length>0) {
					target = ctx.containerStack[ctx.containerStack.length-1];
				}
				if(target==null) {
					throw "parser error at doc-attrib-key-value";
				}
				// console.log(" @@@@@@@@" ,JSON.stringify(ctx.attribStack));
				target[1].$.push(arr[0]);
				if(!(arr[0] in target[1])) {
					arr[2] = convertStringString2String(arr[2]);
					target[1][ arr[0] ] = arr[2];
				} else {
					var t = Object.prototype.toString.apply( target[1][ arr[0] ] );
					if(t == "[object Array]") {
						arr[2] = convertStringString2String(arr[2]);
						target[1][ arr[0] ].push(arr[2]);
					} else {
						var first = target[1][ arr[0] ];
						arr[2] = convertStringString2String(arr[2]);
						target[1][ arr[0] ] = [ first,arr[2] ];
					}
				}
				ctx.attribStack.push( [target[1],arr[0]] );
			},
			"docAttribItemKeyValueEnd"  : function(ctx,arr) {
				debug_log.push("docAttribItemKeyValueEnd");
				ctx.attribStack.pop();
			},
			"docAttribsBegin" : function(ctx,arr) {
				debug_log.push("docAttribsBegin");
				ctx.enumeratingAttribs.push(true);
			},
			"docAttribsEnd" : function(ctx) {
				debug_log.push("docAttribsEnd");
				ctx.enumeratingAttribs.pop();
			},
			"docAttribItemOption" : function(ctx,arr) {
				debug_log.push("tagAttribItemOption =");
				for(var x = 0; x < arr.length;x++) {
					debug_log.push(x+":"+arr[x]);
				}
				var target = null;
				if(ctx.containerStack.length>0) {
					target = ctx.containerStack[ctx.containerStack.length-1];
				}
				if(target==null) {
					throw "parser error at doc-attrib-option";
				}
				arr[0] = convertStringString2String(arr[0]);
				target[1].$.push(arr[0]);
				target[1][ arr[0] ] = true;
				ctx.attribStack.push( [target[1],arr[0]] );
			},
			"docAttribItemOptionEnd" : function(ctx,arr) {
				debug_log.push("docAttribItemOptionEnd");
				ctx.attribStack.pop();
			},
			
		},
		end : function(ctx) {
			
		}
	});
	r.selectedMachine = machineName;
	r.debugLog = debug_log.join("\r\n");
	console.log(r.debugLog);
	return r;
}

function get_ml(opt) { // closure hold?
	opt = opt || {};
	var data = "boot" in opt ? opt.boot : "";
	//console.log("@@@",data);
	var fcallback = "callback" in opt ? opt.callback : null;
	var level = "level" in opt ? opt.level : 0;
	opt.level = level;
	var machineName = "machine" in opt ? opt.machine : context.config[1].startMachine;
	
	function go(data) {
		input.log.push(data);
		var doc = data;
		// attribute-keyvalue
		// attribute-option
		// tag-begin
		// tag-single
		// tag-end
		var r = parseBookScript(doc,context,machineName);
		
		if(r.result && r.context.error.code==1) { // this is a console "browser" of document, in web pages could be parsed to display a dialog to go to next document or maybe a display to index all documents that came in stream, it is implementation dependent 
			//console.log( json_array_2_ml(r.tree) );
			console.log();
			console.log( "parsed:","\r\n"+r.document.substring(0,r.lastChar) );
			// r.context.list is a list of documents.
			var docIndex = 0;
			var autorun = false;
			var output = [];
			function nextDoc(opt,callback) {
				callback&&callback();
				setTimeout(function() {
					docIndex += 1;
					var tmp_docIndex = docIndex;
					var rcallback = function() {
						console.log("DOC " + tmp_docIndex + " FINISHED.");
					}
					if(docIndex < r.context.list.length) {
						if(autorun) {
							var doc = r.context.list[docIndex];
							runDoc(doc,opt,rcallback);
						} else {
							write("next[y/n]?");
							getnkeys(1,function(data) {
								if( data == "y" ) {
									var doc = r.context.list[docIndex];
									runDoc(doc,opt,rcallback);
								} else {
									setTimeout(function() {
										//write(":a");
										get_ml({
											level : level + 1,
											machine : r.selectedMachine
										});
									},0);
								}
							});
						}
					} else {
						// end
						setTimeout(function() {
							//write(":b");
							get_ml({
								level : level + 1,
								machine : r.selectedMachine
							});
						},0);
					}
				},0);
			}
			function runDoc(doc,opt,callback) {
				// log any document contents sent, on log selected issues
				
				// r.context.machines[ r.selectedMachine ][1].log[1]
				if(opt.level == 0) {
					for(var x = 0; x < r.context.machines[ r.selectedMachine ][1].log[1].$.length;x++) { // if is log even enabled
						r.context.machines[ r.selectedMachine ][1].log[1][ 
							r.context.machines[ r.selectedMachine ][1].log[1].$[x] 
						][2].push( doc );
					}
				}
				
				//console.log( JSON.stringify(doc) );	
				//console.log( json_array_2_ml(doc) );	
				// run doc
				var ids = {};
				var jumps = {};
				function mapItem(item,level) { // linear locked
					level = level || 0;
					var ret = false;
					if("id" in item[1]) {
						ids[item[1].id] = item;
						ret = true;
					}
					// ignore document ids, its sandboxed, let document handle itself
					for(var x = 0; x < item[2].length;x++) {
						if(item[2][0]=="document") {
						} else {
							mapItem(item[2][x],level+1);
						}
					}
					return {
						result : ret,
						id : item[1].id
					}
				}
				function runItem(item) {
					
					for(var x = 0; x < r.context.machines[ r.selectedMachine ][1].log[1].$.length;x++) { // if is log even enabled
						/*
						console.log("logging ",
							r.context.machines[ r.selectedMachine ][1].log[1].$,
							r.context.machines[ r.selectedMachine ][1].log[1].$[x],
							r.context.machines[ r.selectedMachine ][1].log[1][ 
								r.context.machines[ r.selectedMachine ][1].log[1].$[x] 
							]
						);
						*/
						
						r.context.machines[ r.selectedMachine ][1].log[1][ 
							r.context.machines[ r.selectedMachine ][1].log[1].$[x] 
						][2].push( item );
					}
					
					if(item[0] == "go") { // use in linear contexts, avoid in non linear, where defs may not exist, not forbidden, just a warning about mind boggling.
						if("to" in item[1]) {
							if(item[1].to in ids) {
								return {
									jump : true,
									id : item[1].to
								}
							}
						}
					} else if(item[0] == "$debug") {
						
					} else if(item[0] == "$system") {
						if("mode" in item[1]) {
							if(item[1].mode == "persistent") {
								r.context.config[1].mode = item[1].mode;
							} else if(item[1].mode == "temporary") {
								r.context.config[1].mode = item[1].mode;
							}
						}
						// create an purposed machine, which differs from code call from main or any other machine
						
					} else if(item[0] == "$attrib") {
						// just dont change id, it makes no sense and will loose map
						if("action" in item[1]) {
							if(item[1].action == "splice") { // on attribs of target
							} else if(item[1].action == "push" && "to" in item[1] && "value" in item[1] && item[1].to in ids) { // on attribs of target
							
							} else if(item[1].action == "pop") { // on attribs of target
							} else if(item[1].action == "unshift") { // on attribs of target
							} else if(item[1].action == "shift") { // on attribs of target
							} else if(item[1].action == "setkey") { // on attribs of target
							} else if(item[1].action == "setvalue") { // on attribs of target
							}
						}
					} else if(item[0] == "$temporary") {
						
					} else if(item[0] == "$type") {
						
						// public
						// private
						// protected
						// static
						// constructor
						// destructor
						// const
						
						// add to var
						// new
						// delete
						// list
						// access
						// lock
						// freeze
					} else if(item[0] == "$this") {
					
					} else if(item[0] == "$lang") {
						
						if("action" in item[1]) {
							if(item[1].action = "start") {
								// start talking about
								if(!(item[1].name in r.context[ r.selectedMachine ][1].lang[1] )) {
									if(item[1].name != "$") {
										r.context[r.selectedMachine][1].lang[1][ item[1].name ] = ["lang-def",{ // sample model
											$ : ["name","lex","syntax"],
											name:item[1].name,
											lex : ["lex",{$:[]},[]],
											syntax : ["syntax",{$:[]},[]]
										},[]];
										r.context[r.selectedMachine][1].lang[1].$.push(item[1].name);
									}
								}
								if(item[1].name!="$") {
									var check = false;
									for(var x = 0; x < r.context[r.selectedMachine][1].lang[2].length;x++) {
										if( r.context[r.selectedMachine][1].lang[2][x][0] == "config" ) {
											r.context[r.selectedMachine][1].lang[2][x][1].selected = item[1].name;
											check = true;
										}
									}
									if(!check) { // config do not exists
										// something bad with config
										throw "[\"error\",{$:[\"message\"],message:\"lang.config\"},[]]";
									}
								}
							} else if(item[1].action=="stop") {
								// end talking about		
								
							}
						}
						
					} else if(item[0] == "$lex") {
						var name = "default";
						if("name" in item[1]) {
							name = item[1].name;
						}
						// get lex rule
						// set lex rule
						
						// remove rule
						// add rule
						if("action" in item[1] && "name" in item[1] && "value" in item[1] && item[1].action == "add") {
							r.context.machines[ r.selectedMachine ][1].lex[ item[1].name ] = item[1].value;
							flushMachineMemory();
						}
						// exists rule
						// list rules
						// find lang
						// parse lang
					} else if(item[0] == "$syntax") {
						// get syntax rule
						// set syntax rule
						// remove rule
						// add rule
						// exists rule
						// list rules
						
						// run lang
					} else if(item[0] == "$macro") {
						
					} else if(item[0] == "$tag") {
						// same, just keep go linear as possible
						if("action" in item[1]) {
							if(item[1].action == "splice") { // on contents of target
							
							} else if(item[1].action == "push" && "to" in item[1] && "value" in item[1] && item[1].to in ids) { // on contents of target
								var obj = [item[1].value,{},[]];
								// check if is ref tag, to get value from a defined reference
								if("setId" in item[1]) {
									obj[1].id = item[1]["setId"];
									ids[ item[1]["setId"] ] = obj;
								}
								ids[ item[1].to ][2].push(obj);
							} else if(item[1].action == "pop") { // on contents of target
							} else if(item[1].action == "unshift") { // on contents of target
							} else if(item[1].action == "shift") { // on contents of target
							} else if(item[1].action == "settype") { // on tagname
							}
						}
					} else if(item[0] == "$document") {
						if("action" in item[1]) {
							if(item[1].action == "splice") { // on contents of target
							} else if(item[1].action == "push") { // on contents of target
							} else if(item[1].action == "pop") { // on contents of target
							} else if(item[1].action == "unshift") { // on contents of target
							} else if(item[1].action == "shift") { // on contents of target
							}
						}
					} else if(item[0] == "$fs") {
						
						
						
					} else if(item[0]=="$clipboard") {
						//console.log(JSON.stringify(r.context.machines[ r.selectedMachine ]));
						console.log(JSON.stringify(
							r.context.machines[ r.selectedMachine ][1].memory[1]
						));
					} else if(item[0] == "log" ) {
						if(item[1].$.length == 1 && item[1][ item[1].$[0] ]==true) {
							//
							
								
							if( !( item[1].$[0] in r.context.machines[ r.selectedMachine ][1].log[1]) ) {
								r.context.machines[ r.selectedMachine ][1].log[1].$.push( item[1].$[0] );
								r.context.machines[ r.selectedMachine ][1].log[1][ item[1].$[0] ] = ["issue",{$:["name"],name:item[1].$[0]},[]];
								//throw "B";
							} else {
								throw "already logging a";
								//r.context.machines[ r.selectedMachine ][1].log[1][ item[1].$[0] ].push( ["issue",{$:["name"],name:item[1].$[0]},[]] );
							}
							
							//console.log(item[1].$,item[1][ item[1].$[0] ]);
							//throw "A";
						}
						if(("save"  in item[1] || "flush" in item[1] ) && "storage" in item[1]) {
							
							var log_name = item[1].save;
							var file = item[1].storage;
							var data = 
								"flush" in item[1] ?
								r.context.machines[ r.selectedMachine][1].log[1][ item[1].flush] :
								( "save" in item[1] ?
								r.context.machines[ r.selectedMachine][1].log[1][ item[1].save] :
								null );
							//console.log(JSON.stringify(item),r.context.machines[ r.selectedMachine ][1].log);
							if(data == null) throw "invalid log syntax."; // find correct syntax or giveup (auto)
							//console.log("writing to ?????????",item[1].storage,item[1].storage.indexOf("\"file://./")==0);
							if( item[1].storage.indexOf("\"file://./")==0 && item[1].storage.indexOf("/./","\"file://./".length)==-1 && item[1].storage.indexOf("/../")==-1 ) {
								var filename = item[1].storage.substring("\"file://./".length,item[1].storage.length-1);
								//console.log("writing to ",filename)
								// do shell stuff, better with language parsings
								if(!require("fs").existsSync(filename)) {
									var arr = filename.split("/");
									//console.log(":",arr);
									for(var x = 0; x < arr.length-1;x++) {
										var dir = arr.slice(0,x+1).join("/");
										//console.log(":",dir);
										if(!require("fs").existsSync(dir)) {
											//console.log(dir);
											require("fs").mkdirSync(dir, parseInt('0777', 8));
										}
									}
								} else {
									//console.log("OK");
								}
								require("fs").writeFileSync(filename,JSON.stringify(data),"utf8");
							}
							
							// stop logging recording
							if("save" in item[1]) {
								
								//delete r.context.machines[ r.selectedMachine ][1].log[1][ item[1].save ];
								//r.context.machines[ r.selectedMachine ][1].log[1][ item[1].save ] = null;
								for(var x = 0; x < r.context.machines[ r.selectedMachine ][1].log[1].$.length;x++) {
									//r.context.machines[ r.selectedMachine ][1].log[1].$[x] == item[1].save
								}
							}
						}
					} else if(item[0] == "dump") {
						for(var x = 0; x < item[1].$.length;x++) {
							if( item[1].$[x] in ids) {
								console.log("[dump] " + item[1].$[x] + ":" + json_array_2_ml(ids[ item[1].$[x] ]));
							}
						}
					} else if(item[0] == "mov") {
						// set all content to any attributes that doesnt have value in $
						var name = null;
						for(var key in item[1]) {
							if(key=="$") {
								
							} else if(key == "type") {
								
							} else if(key == "name") {
								name = item[1].name;
							} else if(key == "id") {
								
							} else {
							}
						}
						
						if(name == null) name = item[1].$[0];
						for(var key in item[1]) {
							if(key=="$") {
								
							} else if(key == "type") {
								
							} else if(key == "name") {
								name = item[1].name;
							} else if(key == "id") {
								
							} else {
								console.log("setting:",key,item[1][key]);
								// can't set $, its forbidden
								if(key!="$") {
									console.log(r.selectedMachine);
									r.context.machines[ r.selectedMachine ][1].memory[1][key] = item[1][key];
									r.context.machines[ r.selectedMachine ][1].memory[1].$.push(key);
								}
							}	
						}
						if(item[2].length>0) {
							r.context.machines[ r.selectedMachine ][1].memory[1][name] = [];
							for(var x = 0; x < item[2].length;x++) {
								r.context.machines[ r.selectedMachine ][1].memory[1][ name ].push( item[2][x] );
							}
						}
						// 
						flushMachineMemory();
					} else if(item[0] == "call") {
						if(item[1].$.length==1) {
							var t = item[1][ item[1].$[0] ];
							if(t == true) {
								runDoc(r.context.machines[ r.selectedMachine ][1].memory[1][ item[1].$[0] ],opt,callback);
							} else if( item[1].$[0] == "fileNamed") {
								var text = r.context.machines[ r.selectedMachine ][1].memory[1][ t ];
								var file = require("fs").readFileSync( text[1].value, "utf8" );
								console.log(file);
								var r1 = parseBookScript(file,r.context,r.selectedMachine);
								console.log("?",r1.context.list[0]);
								runDoc(r1.context.list[0],opt,callback);
							}
							//if(item[1][ item[1].$[0] ])
							//console.log(">>>>",JSON.stringify(r.context.machines[ r.selectedMachine ][1].memory[1]));
							//
						}
					} else if(item[0] == "true" || item[0] == "1") {
						//console.log("TRUE",r.context.machines[ r.selectedMachine ][1].memory[1].$logic);
						if(item[1].$.length==0) {
							// check if $boolean is true
							if( (r.context.machines[ r.selectedMachine ][1].memory[1].$logic & 1) > 0 ) {
								runDoc( ["document",{},item[2]],opt,callback );
							}
						}
					} else if(item[0] == "false" || item[0] == "0") {
						//console.log("FALSE",r.context.machines[ r.selectedMachine ][1].memory[1].$logic);
						if(item[1].$.length==0) {
							// check if $boolean is true
							if( r.context.machines[ r.selectedMachine ][1].memory[1].$logic == 0 ) {
								runDoc( ["document",{},item[2]],opt,callback );
							}
						}
					} else if(item[0] == "test") { // set and array of boolean values, static branch
						if(item[1].$.length==1) {
							
							var t = item[1][ item[1].$[0] ];
							if(t == true) {
								if(!isNaN(parseInt(item[1].$[0]))) {
									var result = parseInt(item[1].$[0]);
									r.context.machines[ r.selectedMachine ][1].memory[1].$logic = result;
									console.log("SET $LOGIC ",result);	
								} else if(item[1].$[0] == "true") {
									r.context.machines[ r.selectedMachine ][1].memory[1].$logic = 1;
									console.log("SET $LOGIC 1");
								} else if(item[1].$[0] == "false") {
									r.context.machines[ r.selectedMachine ][1].memory[1].$logic = 0;
									console.log("SET $LOGIC 0");
								}
							} else {
								
							}
						} else { // expression parser
							var stack = [{data:[],op:[]}];
							function eval_stack_once() {
								var oplen = stack[stack.length-1].op.length;
								//console.log(JSON.stringify(stack));
								while(oplen>0) {
									var op = stack[stack.length-1].op.pop();
									//console.log("op:",op);
									var a = null, b = null;
									if(
										op[0] == "+" || op[0] == "-" || op[0] == "*" || op[0] == "/" ||
										op[0] == "%" || op[0] == "&" || op[0] == "|" || op[0] == "^" ||
										op[0] == ">>" || op[0] == "<<"
									) {
										b = stack[stack.length-1].data.pop(), a = stack[stack.length-1].data.pop();
										//console.log("a:",a);
										//console.log("b:",b);
									}
									if(op[0] == "+") stack[stack.length-1].data.push( a + b );
									else if(op[0] == "-") stack[stack.length-1].data.push( a - b );
									else if(op[0] == "*") stack[stack.length-1].data.push( a * b );
									else if(op[0] == "/") stack[stack.length-1].data.push( a / b );
									else if(op[0] == "%") stack[stack.length-1].data.push( a % b );
									else if(op[0] == "&") stack[stack.length-1].data.push( a & b );
									else if(op[0] == "|") stack[stack.length-1].data.push( a | b );
									else if(op[0] == "^") stack[stack.length-1].data.push( a ^ b );
									else if(op[0] == ">>") stack[stack.length-1].data.push( a >> b );
									else if(op[0] == "<<") stack[stack.length-1].data.push( a << b );
									oplen -= 1;
								}
								var result = stack[stack.length-1].data.pop();
								stack.pop();
								return result;
							}
							for(var x = 0; x < item[1].$.length;x++) {
								if(item[1].$[x] == "id") {
									
								} else if(item[1].$[x] == "(") {
									stack.push({
										data : [],
										op : []
									});
								} else if(item[1].$[x] == ")") {
									// eval stack
									var result = eval_stack_once();
									if(stack.length>0) {
										stack[stack.length-1].data.push(result);
									} else {
										//console.log(">>>>>>>>>",result);
										r.context.machines[ r.selectedMachine ][1].memory[1].$logic = result;
										console.log("SET $LOGIC ",result);
									}
								} else {
									try {
										var data = parseInt( item[1].$[x] );
										if(isNaN(data)) throw "not number";
										stack[stack.length-1].data.push(data);
										//console.log(":: data:",data);
									} catch(e) {
										var data = item[1].$[x];
										stack[stack.length-1].op.push([data,{},[]]);
										//console.log(":: op:",data);
									}
									if(x == item[1].$.length-1) {
										var result = eval_stack_once();
										//console.log(">>>>>>>>>",result);
										r.context.machines[ r.selectedMachine ][1].memory[1].$logic = result;
										console.log("SET $LOGIC ",result);
									}
								}
							}
							if(stack.length>0) {
								var result = eval_stack_once();
								//console.log(">>>>>>>>>",result);
								r.context.machines[ r.selectedMachine ][1].memory[1].$logic = result;
								console.log("SET $LOGIC ",result);
							}
							
						}
					} else if(item[0] == "elsein") { // run always when there is no hit on numbered cases of "with id elsein" to know which test we are talking about
					} else if(item[0] == "elseout") { // set $logic to 0 and do not accept any id tested anymore
					} else if(item[0] == "return") {
					} else if(item[0] == "print") {
						for(var key in item[1]) {
							var type = key;
							var t = Object.prototype.toString.apply(type);
							if(key!="$") {
								if(t=="[object String]") {
									if(type == "xml") {
										var tag = r.context.machines[ r.selectedMachine ][1].memory[1][ item[1][ key ] ];
										// check if is in tag format
										var stack = [[tag,0]];
										while(stack.length>0) {
											var item = stack.shift();
											if(item[1]==0) {
												if(item[0][2].length==0) {
													console.log("<"+item[0][0]+"/>");
												} else {
													console.log("<"+item[0][0]+">");
												}
											}
											if(item[1] < item[0][2].length) {
												stack.unshift([item[0],item[1]+1]);
												stack.unshift([ item[0][2][ item[1] ], 0]);
											} else {
												if(item[0][2].length>0) {
													console.log("</"+item[0][0]+">")
												}
											}
										}
									} else if(type == "data") {
										console.log(item[1][key]);
									} else if(type == "file"){
										// writing wrong file? json is stable parsed, bs is not. if write bs, it will become "rigid", 
										// or at least must track links which makes delete hard cause may become pattern to derivatives.
										// if it is json based then system will run in a different language, which is not good for human access
										// that needs to switch languages.
										var file = item[1][key].substring(1,item[1][key].length-1);
										var data = require("fs").readFileSync(file,"utf8");
										console.log(data);
									} else {
										console.log("unkown format");
									}
								} else if(t=="[object Object]") { // tag
								
								}
							}
						}
					} else if(item[0] == "document") {
						// create a clean scope with no external data(except read of storage), just output the writings to be done if asserted.
						// works just like call, without outside closures
						// a way to store static data that user controls path(just path, no numbers, no strings)
						// yeah, it may create a parser but its user domain. the result still must be asserted. which will be easy to discard with a timeout.
					} else {
						// find in temporary
						// find in context
						// find in lang
						if( parseInt(item[0])==parseFloat(item[0]) && !isNaN(parseInt(item[0])) ) {
							var n = parseInt(item[0])
							//console.log("tag:",n,"logic:",r.context.machines[ r.selectedMachine ][1].memory[1].$logic);
							if(item[1].$.length==0) {
								// check if $boolean is true
								if( (r.context.machines[ r.selectedMachine ][1].memory[1].$logic & n) > 0 ) {
									runDoc( ["document",{},item[2]] ,opt,callback);
								}
							}
						} else {
							console.log("not implemented " + item[0]);
						}
						
					}
					
					return {
						jump : false
					}
				}
				for(var x = 0; x < doc[2].length;x++) {
					var item = doc[2][x];
					var r1 = mapItem(item)
					if( r1.result ) {
						jumps[r1.id] = [doc,x];
					}
				}
				var base = doc;
				for(var x = 0; x < base[2].length;x++) {
					var item = base[2][x];
					var r2 = runItem(item);
					if(r2.jump) {
						var jump = jumps[r2.id];
						if(jump[0] == base) {
							x = jump[1] -1;
						} else {
							x = jump[1]-1;
							base = jump[0];
						}
					}
				}
				// end of run
				nextDoc(opt,callback);
			}
			// run document, after finish ask if want to go next
			if(docIndex< r.context.list.length) {
				var doc = r.context.list[docIndex];
				runDoc(doc,{},function() {
					console.log("DOC " + docIndex + " FINISHED.");
				});
			} else {
				setTimeout(function() {
					//write(":");
					get_ml({
						machine : r.selectedMachine
					});
				},0);
			}
		} else {
			if( r.resultCode == 2 ) {
				console.log("timeout.");
			} else {
				if("error" in r.context && r.context.error.code == 2) {
					console.log("[error]",r.context.error.message);
				} else {
					console.log("fail on parse :" + doc);
				}
			}
			setTimeout(function() {
				//write(":");
				get_ml({
					machine : r.selectedMachine
				});
			},0);
		}
		
		// done! once at (least or last))run available tags
		// done! once at (least or last))print current language
		// todo here, just above! print current program
		
		
		// communication between peers.
		// todo here, just bellow! print results
		// todo here, just bellow! results links
		
	}
	if(data) {
		//write(":2");
		go(data);
	} else {
		if(level == 0) write(":");
		//fcallback&&fcallback();
		getnkeys(256,go);
	}
}


//var boot = 
get_ml({
	machine : context.config[1].startMachine,
	level : 0,
	boot : "<{call[fileNamed:boot]}>",
	callback : function() {
		write("!!!!!!!!!!!!");
	}
});
write(":")

//console.log( JSON.stringify( Parser(lang.html,"<a>") ) );
//console.log( JSON.stringify( Parser(lang.html,"<a><a><a><a>") ) );
//console.log( JSON.stringify( Parser(lang.html,"<aa><a>") ) );

