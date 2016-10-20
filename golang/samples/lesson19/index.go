package main

import "fmt"

func main() {
	var sum int = 0
	var i int = 0
	for ; i < 5; i = i + 1 {
		sum += i
	}
	fmt.Println(sum)
}
