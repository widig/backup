package main

import "golang.org/x/tour/reader"

type MyReader struct{}


// Implement a Reader type that emits an infinite stream of the ASCII character 'A'.

// TODO: Add a Read([]byte) (int, error) method to MyReader.
func (mr MyReader) Read(data []byte) (int,error) {
	data[0] = byte('A')
	return 1, nil
}

func main() {
	reader.Validate(MyReader{})
}
