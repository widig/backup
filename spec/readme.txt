var a : #2
var b : #3
var c : #3

alias 2#1000 and

alias 2#1000(?,1) ? and1

2#1000(0,a) {
	0 {
	
	}
	1 {
	
	}
}
and(0,a) {
	0 {
		print("always true")
	}
	1 {
	
	}
}

a and1 {
	0 {
	
	}
	1 {
	
	}
}
alias ?a?_and1_{_0_{?b?}_1_{?c}_} if(_?a?_){?b?}else{?c?}
if(a){

} else {

}

/*
	00|0
	01|2
	02|0
	10|1
	11|0
	12|1
	20|2
	21|1
	22|2
*/
alias 3#222000000(?a?,?b?) ?a?_3and_?b?
3#212101020(c,b) {
	0 {
	
	}
	1 {
	
	}
	2 {
	
	}
}
c 3and b {
	0 {
	}
	1 {
	}
	2 {
	}
}

// ?a?
// replace by request
// request can be
// 	full identifier
//	call
