# DNS Monitoring Script for labelzoom.app
$domain = "labelzoom.app"
$wwwDomain = "www.$domain"
$vercelIPs = @("76.76.21.21", "76.76.21.98", "76.76.21.99")
$checkInterval = 300  # 5 minutes in seconds
$logFile = "dns-monitor.log"

function Write-Log {
    param(
        [string]$Message,
        [string]$Type = "INFO"
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logLine = "$timestamp [$Type] - $Message"
    Write-Host $logLine
    Add-Content -Path $logFile -Value $logLine
}

function Check-DNS {
    param([string]$domain)
    
    try {
        $ips = [System.Net.Dns]::GetHostAddresses($domain) | ForEach-Object { $_.IPAddressToString }
        $hasCloudflareIP = $false
        
        foreach ($ip in $ips) {
            if ($ip -match "^(172\.67\.|104\.21\.)") {
                $hasCloudflareIP = $true
                break
            }
        }
        
        $status = if ($hasCloudflareIP) { "PASS" } else { "FAIL" }
        Write-Log "DNS Check [$status]: $domain resolves to: $($ips -join ', ')" -Type $status
        return $ips
    }
    catch {
        Write-Log "DNS Check Failed: $domain : $($_.Exception.Message)" -Type "ERROR"
        return $null
    }
}

function Check-SSL {
    param([string]$domain)
    
    try {
        $url = "https://$domain"
        $request = [System.Net.WebRequest]::Create($url)
        $request.Timeout = 10000
        $response = $request.GetResponse()
        $response.Close()
        Write-Log "SSL Check [PASS]: Certificate is valid for $domain" -Type "PASS"
    }
    catch {
        Write-Log "SSL Check Failed: $($_.Exception.Message)" -Type "ERROR"
        Write-Log "SSL certificate provisioning can take up to 1 hour" -Type "INFO"
    }
}

Write-Log -Message "Starting DNS monitoring for $domain"
Write-Log -Message "Checking every $($checkInterval/60) minutes"
Write-Log -Message "Expected Vercel IPs: $($vercelIPs -join ', ')"
Write-Log -Message "Log file: $logFile"

while ($true) {
    Write-Log -Message "Running checks..." -Type "INFO"
    
    $dnsOk = Check-DNS -domain $domain
    $wwwDnsOk = Check-DNS -domain $wwwDomain
    $sslOk = Check-SSL -domain $domain
    
    if (-not ($dnsOk -and $wwwDnsOk -and $sslOk)) {
        Write-Log -Message "STATUS SUMMARY:" -Type "WARNING"
        Write-Log -Message "Main Domain DNS: $(if ($dnsOk) { 'PASS' } else { 'FAIL' })" -Type $(if ($dnsOk) { "INFO" } else { "ERROR" })
        Write-Log -Message "WWW Domain DNS: $(if ($wwwDnsOk) { 'PASS' } else { 'FAIL' })" -Type $(if ($wwwDnsOk) { "INFO" } else { "ERROR" })
        Write-Log -Message "SSL Certificate: $(if ($sslOk) { 'PASS' } else { 'FAIL' })" -Type $(if ($sslOk) { "INFO" } else { "ERROR" })
    }
    
    Write-Log -Message "Waiting $($checkInterval/60) minutes before next check..." -Type "INFO"
    Start-Sleep -Seconds $checkInterval
} 