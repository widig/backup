@echo off
echo %PATH% | find /c /i "NASM" > nul
if not errorlevel 1 goto jump
set PATH=C:\Users\alien\AppData\Local\NASM\;%PATH%
:jump
echo on
nasm -f win64 index.asm
link.exe index.obj /subsystem:console /defaultlib:kernel32.lib /entry:main /largeaddressaware:no



