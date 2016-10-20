@echo off
echo %PATH% | find /c /i "bin\yasm" > nul
if not errorlevel 1 goto jump
set PATH=C:\Users\alien\Projects\cpplang\bin\yasm\;%PATH%
:jump
echo on
yasm-1.3.0-win64.exe -f win64 index.asm
link.exe index.obj /subsystem:windows /entry:WinMain  /libpath:path_to_libs /nodefaultlib kernel32.lib user32.lib /largeaddressaware:no

