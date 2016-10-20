package main

import (
	
	"io"
	"os"
	"strings"
)

type rot13Reader struct {
	r io.Reader
}

func (v rot13Reader) Read(data []byte) (int,error) {
	alpha1 := "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
	alpha2 := "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm"
	n, err := v.r.Read(data)
	if err == nil {
		for j:=0; j < n;j++ {
			for i:=0; i < len(alpha1);i++ {
				if data[j] == alpha2[i]  {
					data[j] = alpha1[i]
					break
				}
			}
		}
		return n, err
	} else {
		return 0, err
	}
}
func main() {
	s := strings.NewReader("Lbh penpxrq gur pbqr!")
	r := rot13Reader{s}
	io.Copy(os.Stdout, &r)
}
