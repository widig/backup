@echo off
echo %PATH% | find /c /i "bin\yasm" > nul
if not errorlevel 1 goto jump
set PATH=C:\Users\alien\Projects\cpplang\bin\yasm\;%PATH%
:jump
echo on
yasm-1.3.0-win64.exe -f win64 index.asm
link.exe index.obj /subsystem:console /defaultlib:kernel32.lib /entry:main /largeaddressaware:no