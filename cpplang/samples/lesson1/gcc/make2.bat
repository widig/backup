@echo off
echo %PATH% | find /c /i "MinGW\bin" > nul
if not errorlevel 1 goto jump
set PATH=C:\MinGW\bin\;%PATH%
:jump
echo on
g++ index2.cpp -o index.exe -std=c++14 -pedantic -Wall
