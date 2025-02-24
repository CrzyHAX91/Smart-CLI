@echo off
echo Installing Smart AI CLI...

:: Create program directory
if not exist "%ProgramFiles%\SmartAICLI" mkdir "%ProgramFiles%\SmartAICLI"

:: Copy executable
copy /Y "dist\smart-ai.exe" "%ProgramFiles%\SmartAICLI"

:: Add to PATH
setx PATH "%PATH%;%ProgramFiles%\SmartAICLI" /M

echo.
echo Installation complete! You can now use 'smart-ai' from any terminal.
echo Try 'smart-ai --help' to get started.
pause
