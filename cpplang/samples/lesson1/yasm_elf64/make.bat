@echo off
echo %PATH% | find /c /i "bin\yasm" > nul
if not errorlevel 1 goto jump
set PATH=C:\Users\alien\Projects\cpplang\bin\yasm\;%PATH%
:jump
echo on
yasm-1.3.0-win64.exe -f elf64 index.asm
ld -o index.out index.o
