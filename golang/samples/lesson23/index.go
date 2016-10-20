package main

import (
	"fmt"
	"math"
)

func sqrt(x float64) string {
	if x < 0 {
		return sqrt(-x) + "i"
	}
	return fmt.Sprint(math.Sqrt(x))
}
//how to convert float64 to complex128
func main() {
	fmt.Println(sqrt(2), sqrt(-4.2))
}
