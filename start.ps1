taskkill /f /im node.exe 2>nul
Write-Output "Killed all node processes"
Set-Location "D:\WORKS\SPS\2026AprillWeb\AprilBuild"
$proc = Start-Process npm -ArgumentList "run","dev" -PassThru -WindowStyle Minimized
Start-Sleep -Seconds 6
Start-Process "http://localhost:3000"
Write-Output "Started. PID: $($proc.Id)"
