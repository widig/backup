#include <stdio.h>
#include <windows.h>

int main() {
	HANDLE hOutput = GetStdHandle(STD_OUTPUT_HANDLE);
	char* msg = "Hello World!\0";
	int len = lstrlen(msg);
	int written = 0;
	WriteFile(hOutput,msg,len,&written,NULL);
	
	
	
	
	return 1;
}