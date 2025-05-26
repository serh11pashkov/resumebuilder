# PowerShell script to fix admin login and verification script
# This script helps you fix the login issue with admin

# Set the title for the PowerShell window
$Host.UI.RawUI.WindowTitle = "Fix Admin Login"
$workingDir = "c:\Users\IDEAPAD\Downloads\g"
Set-Location $workingDir

Write-Host "This script will fix the admin login issue and verification script" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Yellow

# Reset admin password
Write-Host "Step 1: Resetting admin password..." -ForegroundColor Green
$dbUser = Read-Host "Enter PostgreSQL username (default: postgres)"
if ([string]::IsNullOrEmpty($dbUser)) {
    $dbUser = "postgres"
}
$dbName = "resumebuilder"

psql -U $dbUser -d $dbName -f reset_admin_password.sql

Write-Host "`nThe admin password has been reset to: admin123" -ForegroundColor Magenta
Write-Host "----------------------------------------" -ForegroundColor Yellow

# Run the verification script
Write-Host "Step 2: Do you want to run the verification script to test API endpoints? (Y/N)" -ForegroundColor Green
$runVerify = Read-Host
if ($runVerify -eq "Y" -or $runVerify -eq "y") {
    Write-Host "Running verification script..." -ForegroundColor Yellow
    node verify-fixes.js
}

Write-Host "`nFix process complete!" -ForegroundColor Green
Write-Host "You can now login as admin with:" -ForegroundColor White
Write-Host "Username: admin" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host "`nIf you're still having issues, try restarting both backend and frontend servers." -ForegroundColor Yellow
