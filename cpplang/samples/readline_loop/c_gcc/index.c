#include <stdio.h>
int main() {
	char str[65537];
	while(1) {
		gets( str );
		printf("%s\n\n", str);
	}
	return 0;
}