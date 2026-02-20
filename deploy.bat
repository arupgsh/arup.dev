@echo off
setlocal

bun run build
if errorlevel 1 (
  echo Build failed.
  exit /b 1
)

bunx wrangler pages deploy .\dist\ --project-name=<project-name>
if errorlevel 1 (
  echo Deploy failed.
  exit /b 1
)

echo Deploy completed successfully.
exit /b 0