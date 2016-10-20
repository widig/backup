@echo off
echo %PATH% | find /c /i "NASM" > nul
if not errorlevel 1 goto jump
set PATH=C:\Users\alien\AppData\Local\NASM\;%PATH%
:jump
echo on
nasm -f win64 index.asm
link.exe index.obj /subsystem:windows /entry:WinMain  /libpath:path_to_libs /nodefaultlib kernel32.lib user32.lib /largeaddressaware:no



