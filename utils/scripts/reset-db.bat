@echo off
echo Resetting database...

REM Stop any running processes
taskkill /F /IM node.exe 2>nul

REM Wait a moment for processes to close
timeout /t 2 /nobreak >nul

REM Delete database files
del /F dev.db 2>nul
del /F dev.db-journal 2>nul

REM Run Prisma migrations to recreate database
npx prisma migrate dev --name reset

echo.
echo Database reset complete!
echo You can now start the dev server with: npm run dev
pause
