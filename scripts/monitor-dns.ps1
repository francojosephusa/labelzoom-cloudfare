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
        $hasVercelIP = $false
        
        foreach ($ip in $ips) {
            if ($vercelIPs -contains $ip) {
                $hasVercelIP = $true
                break
            }
        }
        
        $status = if ($hasVercelIP) { "PASS" } else { "FAIL" }
        Write-Log -Message "DNS Check [$status] : $domain resolves to: $($ips -join ', ')" -Type $(if ($hasVercelIP) { "INFO" } else { "ERROR" })
        return $hasVercelIP
    }
    catch {
        Write-Log -Message "DNS Check Failed: $_" -Type "ERROR"
        return $false
    }
}

function Check-SSL {
    param([string]$domain)
    
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        $request = [System.Net.HttpWebRequest]::Create("https://$domain")
        $request.Timeout = 10000
        $response = $request.GetResponse()
        $response.Close()
        Write-Log -Message "SSL Check [PASS]: Certificate is valid for $domain" -Type "INFO"
        return $true
    }
    catch {
        Write-Log -Message "SSL Check [FAIL]: $_" -Type "ERROR"
        Write-Log -Message "Note: SSL certificate provisioning can take up to 1 hour" -Type "INFO"
        return $false
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