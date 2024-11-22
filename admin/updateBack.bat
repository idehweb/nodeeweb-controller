@echo off

REM Remove all files from the target directory
rmdir /S /Q ..\server\admin\*

REM Copy the build folder to the server theme folder
xcopy /E /I /H build ..\server\admin

REM Remove all files from the packages\server\theme directory
rmdir /S /Q ..\server\packages\server\admin\*

REM Copy the build folder to the packages\server\theme folder
xcopy /E /I /H build ..\server\packages\server\admin
