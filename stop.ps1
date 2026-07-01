Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Output "Killed all node processes"
