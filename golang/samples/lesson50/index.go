package main

import "fmt"

func main() {
	m := make(map[string][]int)

	m["Answer"] = []int{42}
	fmt.Println("The value:", m["Answer"])

	m["Answer"] = []int{48}
	fmt.Println("The value:", m["Answer"])

	delete(m, "Answer")
	fmt.Println("The value:", m["Answer"])

	_, ok := m["Answer"]
	fmt.Println("The value:", m["Answer"], "Present?", ok)
}
