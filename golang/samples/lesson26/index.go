package main

import (
	"fmt"
)

func Sqrt(x float64) float64 {
	i := 0
	result := float64(1)
	lresult := float64(0)
	for ( (result - lresult)*(result-lresult) > float64(0.0000000000000000000000001) ) && i < 10 {
		lresult = result
		result = lresult -  ( (lresult * lresult ) - x ) / ( 2 * lresult )
		fmt.Printf("B %g # %g # %v #\r\n",lresult,result-lresult,i)
		i++
	}
	return result
}
//1.4142135623730950488016887242097
//1.4142135623730951
//1.414213562373095
func main() {
	fmt.Println(Sqrt(2))
}
