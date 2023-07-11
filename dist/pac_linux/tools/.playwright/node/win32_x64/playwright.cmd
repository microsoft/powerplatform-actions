@echo off
setlocal
@REM Check if node is installed and use it, if not, exit with error.
node -v > NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO node.exe wasn't found in the PATH. Please make sure node is installed and available in the PATH. Exiting...
    exit /b 1
) ELSE (
    "node.exe" "%~dp0..\..\package\lib\cli\cli.js" %*
)
