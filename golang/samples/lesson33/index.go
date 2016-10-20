package main

import "fmt"

type Vertex struct {
	X int
	Y int
}

func main() {
	v := Vertex{1, 2}
	v.X = 3
	p := &v
	p.X = 4
	v2 := Vertex{X: 1}  // Y:0 is implicit

	fmt.Printf("%T %v",v,v)
	fmt.Printf("%T %v",v2,v2)
	fmt.Printf("%T %v",p,p)
}
