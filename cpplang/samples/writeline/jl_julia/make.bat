@echo off
echo %PATH% | find /c /i "julia" > nul
if not errorlevel 1 goto jump
set PATH=D:\julia\Julia-0.5.0\bin\;%PATH%
:jump
echo on
julia index.jl
