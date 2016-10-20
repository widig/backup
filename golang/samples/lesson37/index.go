package main

import "fmt"

type A struct {
	a int
	b int
}
func main() {
	q := []int{2, 3, 5, 7, 11, 13}
	fmt.Println(q)

	r := []bool{true, false, true, true, false, true}
	fmt.Println(r)


	s := []struct {
		i int
		b bool
		a A
	}{
		{2, true, A{1,1}},
		{3, false, A{1,3}},
		{5, true, A{1,2}},
		{7, true, A{1,3}},
		{11, false, A{1,2}},
		{13, true, A{1,1}},
	}
	fmt.Println(s)
}
