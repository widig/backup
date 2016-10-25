
#include <windows.h>
#include <tchar.h>
#include <stdlib.h>
#include <stdio.h>


void readdir(LPCTSTR str) {
	LPCTSTR pointer = "*";
	WIN32_FIND_DATA FindFileData;
	HANDLE hFind;
	DWORD error = 0;
	_tprintf (TEXT("Target file is %s\n"), str);
	hFind = FindFirstFile(str, &FindFileData);
	if (hFind == INVALID_HANDLE_VALUE) {
		printf ("FindFirstFile failed (%d)\n", GetLastError());
		return;
	} else {
		_tprintf (TEXT("The first file found is %s\n"), FindFileData.cFileName);
		
		while(FindNextFile(hFind,&FindFileData)) {
			_tprintf (TEXT("The first file found is %s\n"), FindFileData.cFileName);
		}
		error = GetLastError();
		if( ERROR_NO_MORE_FILES == error) {
		
		} else {
			_tprintf (TEXT("%d\n"),GetLastError());
		}
		FindClose(hFind);
	}
}

void _tmain(int argc, TCHAR *argv[]) {
	char c;
	
	if( argc != 2 ){ _tprintf(TEXT("Usage: %s [target_file]\n"), argv[0]); return; }
	readdir(argv[1]);
	
	// this piece of code read stdin to be parsed
	do {
		c=getchar();
		putchar (c);
	} while (c != EOF);

	return 0;
    
	

}