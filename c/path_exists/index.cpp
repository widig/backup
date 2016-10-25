//cl /EHcs /I"C:\Program Files (x86)\Microsoft Visual Studio 10.0\VC\include" index.cpp /link /DYNAMICBASE "shlwapi.lib"
#include <windows.h>
#include <iostream>
#include "Shlwapi.h"
using namespace std;
void main(void)
{
    // Valid file path name (file is there).
    char buffer_1[ ] = "C:\\TEST\\test.txt"; 
    char *lpStr1;
    lpStr1 = buffer_1;
    
    // Invalid file path name (file is not there).
    char buffer_2[ ] = "C:\\TEST\\file.doc"; 
    char *lpStr2;
    lpStr2 = buffer_2;
    
    // Return value from "PathFileExists".
    int retval;
    
    // Search for the presence of a file with a true result.
    retval = PathFileExists(lpStr1);
    if(retval == 1)
    {
        cout << "Search for the file path of : " << lpStr1 << endl;
        cout << "The file requested \"" << lpStr1 << "\" is a valid file" << endl;
        cout << "The return from function is : " << retval << endl;
    }
    
    else
    {
        cout << "\nThe file requested " << lpStr1 << " is not a valid file" << endl;
        cout << "The return from function is : " << retval << endl;
    }
    
    // Search for the presence of a file with a false result.
    retval = PathFileExists(lpStr2);
    
    if(retval == 1)
    {
        cout << "\nThe file requested " << lpStr2 << "is a valid file" << endl;
        cout << "Search for the file path of : " << lpStr2 << endl;
        cout << "The return from function is : " << retval << endl;
    }
    else
    {
        cout << "\nThe file requested \"" << lpStr2 << "\" is not a valid file" << endl;
        cout << "The return from function is : " << retval << endl;
    }
}