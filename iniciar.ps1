Write-Host "Iniciando MasterCar Oficina & Diagnóstico (Porta 3335)..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\backend"
node server.js
