@echo off
echo %PATH% | find /c /i "Python" > nul
if not errorlevel 1 goto jump
set PATH=c:\Users\alien\AppData\Local\Programs\Python\Python35-32\;%PATH%
:jump
echo on
python index.py
