package main

import "fmt"

func main() {
	// init and post are optional
	sum := 1
	for ; sum < 1000; {
		sum += sum
	}
	fmt.Println(sum)
}
