package main

import "fmt"

type I interface {
	M()
}

type T struct {
	S string
}
type T1 struct {
	S string
}

// This method means type T implements the interface I,
// but we don't need to explicitly declare that it does so.
func (t T) M() {
	fmt.Println(t.S)
}
func (t T1) M() {
	fmt.Println("a"+t.S)
}
func main() {
	var i I = T1{"hello"}
	var j I = T{"hello"}
	i.M()
	j.M()
}
