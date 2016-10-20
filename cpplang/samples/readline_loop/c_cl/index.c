#include <stdio.h>
int main() {
	char str[65537];
	while(1) {
		gets_s( str, 65536 );
		printf("%s\n\n", str);
	}
	return 0;
}