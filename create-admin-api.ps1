# PowerShell script to create a properly encoded admin user
# This uses the application's API to register an admin user with properly encoded password

$Host.UI.RawUI.WindowTitle = "Create Admin User"
$workingDir = "c:\Users\IDEAPAD\Downloads\g"
Set-Location $workingDir

Write-Host "This script will create a new admin user with a properly encoded password" -ForegroundColor Cyan
Write-Host "Make sure both the backend and frontend servers are running!" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

# Check if the backend is running
$backendRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/test-auth" -Method GET -ErrorAction SilentlyContinue
    $backendRunning = $true
    Write-Host "✓ Backend server is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend server is not running or not accessible" -ForegroundColor Red
    
    # Ask if user wants to start the backend
    $startBackend = Read-Host "Do you want to start the backend server? (Y/N)"
    if ($startBackend -eq "Y" -or $startBackend -eq "y") {
        Write-Host "Starting Spring Boot backend..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$workingDir\back'; .\mvnw spring-boot:run"
        Write-Host "Backend server starting in new window..." -ForegroundColor Green
        Write-Host "Please wait about 30 seconds for the server to start before continuing" -ForegroundColor Yellow
        $waitResponse = Read-Host "Press Enter when the backend server is ready"
    } else {
        Write-Host "Cannot continue without the backend server running. Exiting..." -ForegroundColor Red
        exit
    }
}

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js and try again" -ForegroundColor Yellow
    exit
}

# Run the admin creation script
Write-Host "`nCreating admin user through the application API..." -ForegroundColor Green
node create-admin-user.js

Write-Host "`nNow you can log in with the new admin user!" -ForegroundColor Cyan
