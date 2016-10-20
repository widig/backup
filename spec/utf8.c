#include <stdio.h>
#include <stdlib.h>
// 0xEFBBBF
#define INVALID (-2)
// 世界

typedef struct _Utf8Char {
	int raw;
	int converted;
} Utf8Char, *PUtf8Char;

Utf8Char fgetutf8c(FILE* f) {
	int result = 0;
	int input[6];
	Utf8Char ret;
	ret.raw = 0;
	ret.converted = 0;
	input[0] = fgetc(f);
	printf("(i[0] = %d) ", input[0]);
	//printf("EOF %d INVALID %d",EOF,INVALID);
	ret.raw = input[0] & 0xFF;
	if (input[0] == EOF) {
		// The EOF was hit by the first character.
		result = EOF;
	} else if (input[0] < 0x80) {
		// the first character is the only 7 bit sequence...
		result = input[0];
	} else if ( (input[0] & 0xC0) == 0x80 ) {
		// This is not the beginning of the multibyte sequence.
		ret.raw = INVALID;
		ret.converted = INVALID;
		return ret;
	} else if ( (input[0] & 0xfe) == 0xfe ) {
		// This is not a valid UTF-8 stream.
		ret.converted = INVALID;
		ret.raw = INVALID;
		return ret;
	} else {
		int sequence_length;
		int index;
		for(sequence_length = 1; input[0] & (0x80 >> sequence_length); ++sequence_length);
		result = input[0] & ((1 << sequence_length) - 1);
		printf("sequence length = %d ", sequence_length);
		for(index = 1; index < sequence_length; ++index) {
			input[index] = fgetc(f);
			ret.raw <<= 8;
			ret.raw |= input[index] & 0xFF;
			printf("(i[%d] = %d) ", index, input[index]);
			if (input[index] == EOF) {
				ret.converted = EOF;
				return ret;
			}
			result = (result << 6) | (input[index] & 0x30);
		}
	}
	ret.converted = result;
	return ret;
}

typedef struct _Utf8Buffer {
	int capacity;
	int lenght;
	int* data;
	Utf8Buffer* next;
} Utf8Buffer;

int* freadall_utf8(FILE* f) {
	Utf8Char c;
	c.raw = 0;
	c.converted = 0;
	
	int count = 0;
	int bom_chars = 0;
	
	fseek(f,0,SEEK_SET);
	
	Utf8Buffer b;
	b.capacity = 4096;
	b.length = 0;
	b.data = malloc(sizeof(int)*4096);
	b.next = 0;
	
	Utf8Buffer* head = &b;
	Utf8Buffer* base;
	
	while (c.converted != EOF && c.raw != INVALID) {
		c = fgetutf8c(f);
		printf("* %d\n", c.converted);
		if(c.raw == 0xEFBBBF) {
			bom_chars += 1;
		} else if(c.converted!=EOF) {
			count += 1;
		}
	}
	
	int* p = malloc(sizeof(int)*(count+2));
	int* ret = p;
	fseek(f,0,SEEK_SET);
	*p = count;
	p++;
	while (c.converted != EOF && c.raw != INVALID) {
		c = fgetutf8c(f);
		if(c.raw == 0xEFBBBF) { // ignore BOM
		
		} else {
			*p = c.converted;
			p++;
		}
	}
	*p = 0;
	
	do {
		
		free( head->data );
	} while(head->next != 0);
	
	return ret;
}
int main(int argc, char **argv) {
	if(argc < 2) {
		printf("open(%s) ", argv[1]);
	} else {
		FILE *f = fopen(argv[1], "r");
		int* p = freadall_utf8(f);
		printf("size of file: %d chars",*p);
		free(p);
		fclose(f);	
	}
}