package main

import (
	"fmt"
)
type ErrNegativeSqrt float64

func (e ErrNegativeSqrt) Error() string {
		return fmt.Sprintf("cannot Sqrt negative number %v",float64(e))
}
func Sqrt(x float64) (float64, error) {
	if x < 0 {
		e := ErrNegativeSqrt(x)	
		return 0, e
	}
	var z1 float64 = 1
	var z0 float64 = 1
	
	for i:=0; i < 10;i++ {
		z1 = z0 - ( z0*z0 - x ) / ( 2*z0)
		z0 = z1
	}
	return z1, nil
}

func main() {
	fmt.Println(Sqrt(2))
	fmt.Println(Sqrt(-2))
}
