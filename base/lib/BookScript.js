



function BookScript(options) {

	var lang = {
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
	
	return function() {
		
	}
	
}

module.exports = BookScript;

