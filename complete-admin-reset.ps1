# PowerShell script to create a completely new admin user
# This script will delete and recreate the admin user with a plain password
# which will be encoded by Spring Security on the first login attempt

$Host.UI.RawUI.WindowTitle = "Complete Admin Reset"
$workingDir = "c:\Users\IDEAPAD\Downloads\g"
Set-Location $workingDir

Write-Host "This script will completely recreate the admin user" -ForegroundColor Cyan
Write-Host "WARNING: This will delete the current admin user and create a new one" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

# Get PostgreSQL credentials
$dbUser = Read-Host "Enter PostgreSQL username (default: postgres)"
if ([string]::IsNullOrEmpty($dbUser)) {
    $dbUser = "postgres"
}
$dbName = "resumebuilder"

Write-Host "`nExecuting admin recreation script..." -ForegroundColor Green
psql -U $dbUser -d $dbName -f recreate_admin.sql

Write-Host "`nAdmin user has been completely recreated." -ForegroundColor Green
Write-Host "You MUST restart the backend server for this change to take effect!" -ForegroundColor Magenta

# Ask if user wants to restart the backend server
$restartBackend = Read-Host "`nDo you want to restart the backend server now? (Y/N)"
if ($restartBackend -eq "Y" -or $restartBackend -eq "y") {
    Write-Host "Stopping any running backend processes..." -ForegroundColor Yellow
    Stop-Process -Name "java" -ErrorAction SilentlyContinue
    
    Write-Host "Starting Spring Boot backend..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$workingDir\back'; .\mvnw spring-boot:run"
    
    Write-Host "Backend server restarting in new window..." -ForegroundColor Green
    Write-Host "Please wait about 30 seconds for it to fully start" -ForegroundColor Yellow
}

Write-Host "`nOnce the backend is restarted, you can log in with:" -ForegroundColor White
Write-Host "Username: admin" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
