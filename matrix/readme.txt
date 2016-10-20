

STRING is anything inside quotes eg. "word"
------------------------------------------------------
1) add word statement
	WORD is any word registered with:

		add word STRING

	without quotes.
	
	examples:
	
		a)
			>add word "ok" 
			>ok
			>add word "fail"
			>fail
		b)
			>add word "1"
			>add word "2"
			>add word "3"
			>add word "4"
			>add word "5"
			>add word "6"
			>add word "7"
			>add word "8"
			>add word "9"
			>add word "0"
		
------------------------------------------------------
2) add word alias statement

		add word alias STRING STRING
		
	examples:
	
		a)
			>add word "ok"
			>add word alias "ok" "1"
			>add word "fail"
			>add word alias "fail" "0"
			
		b)
			>add word "book"
			>add word alias "livro"
			
			
------------------------------------------------------
3) add sentence statement

	
		add sentence LIST_OF_WORDS
	
	where LIST_OF_WORDS is a list of WORD separated by spaces
	
	
	examples :
		a)
			>add word "the"
			>add word "book"
			>add word "is"
			>add word "on"
			>add word "the"
			>add word "table"
			>add sentence the book is on the table
			>the book is on the table
			>thebookisonthetable
			

------------------------------------------------------

4) find word statement

		find word STRING
	
	examples :
		a)
			>add word "ok1"
			>add word "ok2"
			>add word "ok3"
			>find word "ok"
		
		b)
			>add word "x1y1"
			>add word "x1y2"
			>add word "x2y1"
			>add word "x2y2"
			>find word "y1"
			>find word "x2"

------------------------------------------------------
5) remove word statement

		remove word STRING

	examples:
		a)
			>add word "ok"
			>ok
			>remove word "ok"
			>ok
			

			
	
			
	// to think. invalidate sentences?
	
	// to number analize. week time tables, cicardian time tables. (calendar)
	
	// 
	
	
	// todo first 
	//		OK -> add charset "123456789", as [syntax] "PositiveDigit" 
	//		add charset "123456789", in [syntax] "PositiveDigit"
	//		push charset "123456789", in [syntax] ""[0]
	//		remove 1st|first|0 charset "", in [syntax] ""[0]
	//		remove charset "", in [syntax] ""
	
	//		find charset "1" [in syntax name]
	//		remove charset [named as syntax] PositiveDigit
	//		add charset from charcode 48 to charcode 57, as [syntax] "Digit"
	
	//		-> remove quotes from add word
	//		-> remove quotes from add charset syntax, count by chars (hidden spaces allowed, newlines must be explitit)
	//		-> make choices constant (help for <> attribute)
	//		-> simplify "SyntaxCustomCharset_" to name
	//		-> find [deeper] on syntax, sort first word [and match greedy]	
	
	//		add sentence :PositiveDigit :$LexicalTokenBaseArraySpaceNlOpt :PositiveDigit, as [syntax] "DoublePositiveDigit"

	//		add syntax, as [syntax] "" -> sentence holder
	//		push syntax "", as [syntax] ""
	//		push syntax "", in [syntax] ""[0]
	//		pop syntax [syntax] ""
	//		find syntax ""
	//		remove syntax ""
	
	
	
	//		add context "ContextName"
	//		use context "ContextName"
	//		add word Hello
	//		add word World
	//		add word !
	//		print Hello World!
	//		remove word Hello
	//		remove word World
	//		remove word !
	//		drop context "ContextName"
	//		add word make
	//		add word greetings
	//		add sentence make greetings
	//		on make greetings, ContextName
	//		make greetings
	//		>Hello World!
	
	//		on SENTENCE, SENTENCE
	//		on SENTENCE, WORD
	
	
	//		-> [N] SENTENCE
	//		-> N meanings for same sentence, how? ****
	//		-> must link a word to a list of meanings
	//		-> ambiguity SENTENCE
	//		-> list all possible meanings
	
	
	//		add sentence on <+>:$_sentence_name word1 <?>word2 <*>:$charset_name <0,3>:$_sentence_name2 <?>:$sentence_name, alias "$1"
	//		add sentence on <:$sentence_meaning_that_fits_by_on>:$_sentence_name word1 <?>word2 <*>:$charset_name <0,3>:$_sentence_name2 <?>:$sentence_name, alias "$1"
	//		-> all syntax is available incluing $LexicalTokenBaseArraySpaceNlOpt and others, in order to not freeze names.
	//		change sentence on <+>:$_sentence_name word1 <?>word2 <*>:$charset_name <(0,3)>:$_sentence_name2 <?>:$sentence_name, ...
	//		:$1[0]
	//		remove word alias "word"
	//		find setence
	//		add memory <- word, charset, sentence
	
	// debug-->
	
	//		remove charset alias "$2"
	//		remove sentence alias "$1
	// 		choice invalidate sentence on remove word
	// 		choice keep sentence on remove word
	// 		choice ask sentence on remove word (maybe HUGE -> skeleton locked on choicing)