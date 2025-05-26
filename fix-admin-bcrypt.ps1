# PowerShell script to encode a password with BCrypt
# This script generates a BCrypt encoded password compatible with Spring Security

$Host.UI.RawUI.WindowTitle = "BCrypt Password Encoder"
$workingDir = "c:\Users\IDEAPAD\Downloads\g"
Set-Location $workingDir

Write-Host "This script will encode a password with BCrypt for Spring Security" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Yellow

# Check if bcryptjs is installed
Write-Host "Checking if bcryptjs is installed..." -ForegroundColor Yellow
$bcryptInstalled = $false
try {
    $npmList = npm list bcryptjs --depth=0
    if ($npmList -match "bcryptjs") {
        $bcryptInstalled = $true
        Write-Host "✓ bcryptjs is already installed" -ForegroundColor Green
    }
} catch {
    $bcryptInstalled = $false
}

if (-not $bcryptInstalled) {
    Write-Host "Installing bcryptjs package..." -ForegroundColor Yellow
    npm install bcryptjs
}

# Run the password encoder script
Write-Host "`nEncoding password with BCrypt..." -ForegroundColor Green
node encode-password.js

# Ask if user wants to apply the encoded password
Write-Host "`nDo you want to apply this encoded password to the admin user in the database? (Y/N)" -ForegroundColor Cyan
$applyPassword = Read-Host
if ($applyPassword -eq "Y" -or $applyPassword -eq "y") {
    # Get encoded password from script
    $encodedOutput = node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10))"
    $encodedPassword = $encodedOutput
    
    # Get PostgreSQL credentials
    $dbUser = Read-Host "Enter PostgreSQL username (default: postgres)"
    if ([string]::IsNullOrEmpty($dbUser)) {
        $dbUser = "postgres"
    }
    $dbName = "resumebuilder"
    
    # Create SQL file
    $sqlContent = @"
-- Update admin password with BCrypt encoded version
UPDATE users SET password = '$encodedPassword' WHERE username = 'admin';
-- Verify the update
SELECT id, username, email, substring(password from 1 for 30) as password_preview FROM users WHERE username = 'admin';
"@
    
    $sqlFile = "$workingDir\update_admin_password.sql"
    $sqlContent | Out-File -FilePath $sqlFile -Encoding utf8
    
    # Execute SQL
    Write-Host "Updating admin password in database..." -ForegroundColor Yellow
    psql -U $dbUser -d $dbName -f update_admin_password.sql
    
    Write-Host "`nAdmin password has been updated in the database." -ForegroundColor Green
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
}

Write-Host "`nOnce the backend is restarted, you can log in with:" -ForegroundColor White
Write-Host "Username: admin" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
