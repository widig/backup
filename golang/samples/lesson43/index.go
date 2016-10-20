package main

import "fmt"
//https://blog.golang.org/go-slices-usage-and-internals

func main() {
	var s []int
	printSlice(s)

	// append works on nil slices.
	s = append(s, 0)
	printSlice(s)

	// The slice grows as needed.
	s = append(s, 1)
	printSlice(s)

	// We can add more than one element at a time.
	s = append(s, 2, 3, 4)
	printSlice(s)

	b := [...]int{1,2,3}
	c := b[:]
	printSlice(c)
}

func printSlice(s []int) {
	fmt.Printf("len=%d cap=%d %v\n", len(s), cap(s), s)
}
func printSlice2(s []string) {
	fmt.Printf("len=%d cap=%d %v\n", len(s), cap(s), s)
}
