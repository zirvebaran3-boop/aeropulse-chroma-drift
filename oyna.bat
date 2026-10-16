@echo off
rem dist absolute /assets yollari kullaniyor; file:// ile acilmaz, kucuk bir sunucu gerekir.
cd /d "%~dp0dist"
start "" http://localhost:4173
python -m http.server 4173
