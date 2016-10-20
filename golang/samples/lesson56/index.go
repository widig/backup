package main

import (
	"fmt"
	"math"
)

type Vertex struct {
	X, Y float64
}

func (v Vertex) Abs() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

func (v *Vertex) Scale(f float64) {
	v.X = v.X * f
	v.Y = v.Y * f
}
func (v Vertex) Scale2(f float64) {
	v.X = v.X * f
	v.Y = v.Y * f
}
func Abs(v Vertex) float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

func Scale(v *Vertex, f float64) {
	v.X = v.X * f
	v.Y = v.Y * f
}
func Scale2(v Vertex, f float64) {
	v.X = v.X * f
	v.Y = v.Y * f
}
func main() {
	v := Vertex{3, 4}
	v.Scale2(20)
	fmt.Println(v.Abs())
	v.Scale(10)
	fmt.Println(v.Abs())
	Scale(&v,0.1)
	fmt.Println(v.Abs())
	Scale2(v,0.1)
	fmt.Println(Abs(v))

	p := &Vertex{3,4}
	p.Scale(10)
	fmt.Println(p.Abs())
	fmt.Println((*p).Abs())

}
