package main

/*
	PASS
 		f("I am learning Go!") = 
  		map[string]int{"Go!":1, "I":1, "am":1, "learning":1}
	PASS
 		f("The quick brown fox jumped over the lazy dog.") = 
  		map[string]int{"dog.":1, "brown":1, "fox":1, "jumped":1, "over":1, "The":1, "quick":1, "the":1, "lazy":1}
	PASS
 		f("I ate a donut. Then I ate another donut.") = 
  		map[string]int{"donut.":2, "Then":1, "another":1, "I":2, "ate":2, "a":1}
	PASS
 		f("A man a plan a canal panama.") = 
  		map[string]int{"a":2, "plan":1, "canal":1, "panama.":1, "A":1, "man":1}
*/
import (
	"golang.org/x/tour/wc"
)

func WordCount(s string) map[string]int {
	ret := make(map[string]int)
	last := 0
	for i,j := range s {
		if j == ' ' {
			_, ok := ret[ s[last:i] ]
			if ok {
				ret[ s[last:i] ] += 1
			} else {
				ret[ s[last:i] ] = 1
			}
			last = i+1
		}
	}
	if last < len( s ) {
		_, ok := ret[ s[last:len(s)] ]
		if ok {
			ret[ s[last:len(s)] ] += 1
		} else {
			ret[ s[last:len(s)] ] = 1
		}
	}
	return ret
}

func main() {
	wc.Test(WordCount)
}
