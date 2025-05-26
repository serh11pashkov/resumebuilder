Write-Host "Comprehensive cleanup script starting..."

# Define patterns of files to be removed
$patterns = @(
    "*.new",          # All .new files
    "*.schema.sql",   # Schema files that are no longer needed
    "cleanup_test_files.ps1" # Unnecessary cleanup scripts
)

# Initialize counter
$deletedCount = 0

# Process each pattern
foreach ($pattern in $patterns) {
    Write-Host "Finding files matching pattern: $pattern"
    $files = Get-ChildItem -Path . -Filter $pattern -Recurse
    
    foreach ($file in $files) {
        Write-Host "Deleting $($file.FullName)"
        Remove-Item -Path $file.FullName -Force
        $deletedCount++
    }
}

Write-Host "Cleanup completed! Deleted $deletedCount files."
