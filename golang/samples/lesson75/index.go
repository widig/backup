package main

import "fmt"

type Vertex struct {
	id int
	x,y int
}

func addto(x Vertex, c chan Vertex) {
	c <- x
}

func (v Vertex) String() string {
	return fmt.Sprintf("{ %d [%d %d] }",v.id,v.x,v.y)
}
func main() {
	ch := make(chan Vertex,2)
	go addto(Vertex{0,1,1},ch)
	go addto(Vertex{1,1,1},ch)
	go addto(Vertex{2,1,1},ch)

	x,y := <-ch,<-ch
	fmt.Println(x,y)
	
}
