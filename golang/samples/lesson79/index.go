package main

import "fmt"


func (s Type) substring(start, end int) string {
	return s
}

func main() {

	s := "hello"
	s = s + " world"
	s = s.substring(0,5)
	fmt.Printf(s)

}