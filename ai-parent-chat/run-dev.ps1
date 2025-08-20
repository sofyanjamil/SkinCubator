param(
    [string]$Port = "3000"
)
$ErrorActionPreference = "Stop"

# Move to project root (folder of this script)
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Error "pnpm is not installed. Install from https://pnpm.io/installation"
    exit 1
}

# Start dev server in background job
$jobName = "skincubator-dev"
if (Get-Job -Name $jobName -ErrorAction SilentlyContinue) {
    Remove-Job -Name $jobName -Force | Out-Null
}
Start-Job -Name $jobName -ScriptBlock {
    param($projPath, $p)
    Set-Location $projPath
    pnpm dev -- -p $p | cat
} -ArgumentList $root, $Port | Out-Null

Start-Sleep -Seconds 2
Start-Process "http://localhost:$Port"
Write-Host "Dev server starting on http://localhost:$Port (job: $jobName)"
