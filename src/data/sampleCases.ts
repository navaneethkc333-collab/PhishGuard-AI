import { InvestigationCase } from '../types';

export const SAMPLE_CASES: InvestigationCase[] = [
  {
    id: 'CASE-2026-8941',
    title: 'Microsoft 365 Password Reset & Malicious PDF Macro',
    timestamp: new Date().toISOString(),
    subject: 'URGENT: Microsoft 365 Password Expiration Notice - Action Required',
    sender: 'Microsoft Security <support@micr0soft-security-verify.net>',
    recipient: 'john.doe@enterprise-corp.com',
    rawEmailInput: `From: "Microsoft Security" <support@micr0soft-security-verify.net>
To: john.doe@enterprise-corp.com
Subject: URGENT: Microsoft 365 Password Expiration Notice - Action Required
Date: Mon, 03 Aug 2026 08:12:00 -0400
Return-Path: <bounce@bad-spammer-host.xyz>
Reply-To: <phish-collector@micr0soft-security-verify.net>
Received: from mail.micr0soft-security-verify.net (185.220.101.45) by mx.enterprise-corp.com
Received-SPF: fail (enterprise-corp.com: domain of micr0soft-security-verify.net does not designate 185.220.101.45 as permitted sender)
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=bad-spammer-host.xyz;
Authentication-Results: mx.enterprise-corp.com; dkim=fail header.i=@micr0soft-security-verify.net; spf=fail; dmarc=fail

Dear Valued Employee,

Your Microsoft 365 password will expire in 2 hours. Failure to update your credentials immediately will result in complete account lock out and loss of company data access.

Please download the attached security verification document "Invoice_M365_Upgrade.pdf" or click the link below to verify your account:
https://micr0soft-security-verify.net/auth/login?redirect=https://login.microsoftonline.com

Security Operations Team
Microsoft Online Security`,
    headerResult: {
      spfStatus: 'FAIL',
      spfDetails: 'Domain micr0soft-security-verify.net SPF record does not authorize IP 185.220.101.45',
      dkimStatus: 'FAIL',
      dkimDetails: 'DKIM signature domain mismatch (signed by bad-spammer-host.xyz)',
      dmarcStatus: 'REJECT',
      dmarcDetails: 'DMARC alignment failed for header domain vs return-path domain',
      returnPath: 'bounce@bad-spammer-host.xyz',
      replyTo: 'phish-collector@micr0soft-security-verify.net',
      senderAddress: 'support@micr0soft-security-verify.net',
      senderDomain: 'micr0soft-security-verify.net',
      returnPathMatch: false,
      replyToMismatch: true,
      senderIp: '185.220.101.45',
      senderGeo: {
        country: 'Romania',
        city: 'Bucharest',
        isp: 'Bulletproof Hosting Network SRL',
        flag: '🇷🇴',
      },
      routeHops: [
        {
          hopNumber: 1,
          fromHost: 'mail.micr0soft-security-verify.net',
          fromIp: '185.220.101.45',
          byHost: 'relay-01.threat-mta.net',
          timestamp: '08:11:52 UTC',
          delaySeconds: 0,
          ipReputation: 'Malicious',
          country: 'Romania',
          flag: '🇷🇴',
        },
        {
          hopNumber: 2,
          fromHost: 'relay-01.threat-mta.net',
          fromIp: '194.165.16.11',
          byHost: 'mx.enterprise-corp.com',
          timestamp: '08:12:00 UTC',
          delaySeconds: 8,
          ipReputation: 'Suspicious',
          country: 'Russia',
          flag: '🇷🇺',
        },
      ],
      anomalies: [
        'SPF, DKIM, and DMARC authentication all failed',
        'Return-Path (bad-spammer-host.xyz) differs from From header (micr0soft-security-verify.net)',
        'Originating IP 185.220.101.45 is flagged on AbuseIPDB with 87% confidence of malicious relaying',
      ],
    },
    urlResults: [
      {
        id: 'url-1',
        originalUrl: 'https://micr0soft-security-verify.net/auth/login?redirect=https://login.microsoftonline.com',
        cleanUrl: 'https://micr0soft-security-verify.net/auth/login',
        finalRedirectUrl: 'http://credential-grabber-node.ru/steal.php',
        redirectCount: 2,
        redirectChain: [
          'https://micr0soft-security-verify.net/auth/login',
          'https://short-redirect.link/x8912a',
          'http://credential-grabber-node.ru/steal.php',
        ],
        domain: 'micr0soft-security-verify.net',
        domainAgeDays: 2,
        ipAddress: '185.220.101.45',
        virusTotalHits: 48,
        virusTotalTotal: 92,
        urlScanScore: 94,
        whoisRegistrar: 'NameSilo, LLC',
        whoisCreatedDate: '2026-08-01 (2 days ago)',
        sslValid: false,
        sslIssuer: "Let's Encrypt Free Authority (Untrusted)",
        isHomograph: true,
        targetBrand: 'Microsoft',
        qrCodeDetected: false,
        reputationScore: 96,
        status: 'MALICIOUS',
        categories: ['Phishing', 'Credential Harvesting', 'Brand Impersonation'],
      },
    ],
    attachmentResults: [
      {
        id: 'att-1',
        fileName: 'Invoice_M365_Upgrade.pdf',
        fileSize: '482 KB',
        fileSizeBytes: 493568,
        mimeType: 'application/pdf',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        md5: '5d41402abc4b2a76b9719d911017c592',
        threatStatus: 'MALICIOUS',
        isMacroDetected: true,
        macroDetails: 'Embedded JavaScript launching PowerShell sub-process downloading payload via WinHttpRequest',
        yaraMatches: [
          { ruleName: 'SUSP_PDF_Embedded_JS_Launch', description: 'PDF contains OpenAction object spawning JS prompt', severity: 'HIGH' },
          { ruleName: 'MAL_Phish_Credential_Harvesting_Form', description: 'Form submit action targets non-standard HTTP endpoint', severity: 'CRITICAL' },
        ],
        embeddedUrls: ['https://micr0soft-security-verify.net/auth/login'],
        jsRisk: true,
        fileEntropy: 7.82,
        peMetadata: {
          compiler: 'Unknown / Packed Binary',
          compileTime: '2026-08-02 23:14:10',
          suspiciousImports: ['ShellExecuteA', 'WinHttpOpen', 'CreateProcessW'],
        },
        description: 'Malicious PDF weaponized with obfuscated OpenAction JavaScript and credential phishing form payload.',
      },
    ],
    impersonationResult: {
      detected: true,
      brandName: 'Microsoft 365',
      fakeDomain: 'micr0soft-security-verify.net',
      legitimateDomain: 'microsoft.com',
      similarityScore: 94,
      homographType: 'Character Replacement',
      riskLevel: 'CRITICAL',
      details: 'Substituted character "0" for "o" in "microsoft" and appended "-security-verify.net". Domain age is 2 days.',
    },
    aiReasoning: {
      verdict: 'HIGH_RISK_PHISHING',
      riskScore: 98,
      confidence: 97,
      attackType: 'Multistage Credential Harvesting & Weaponized PDF Macro',
      aiSummary: 'This email is a highly dangerous, targeted phishing attempt impersonating Microsoft 365 Security. The sender domain was registered 2 days ago, failed all email authentication checks (SPF, DKIM, DMARC), utilizes homograph domain spoofing (micr0soft), contains a URL leading to a credential grabber, and includes a weaponized PDF with active malicious scripts.',
      evidenceList: [
        { id: 'ev-1', category: 'header', severity: 'CRITICAL', title: 'SPF, DKIM & DMARC Failure', detail: 'All 3 major authentication checks failed. Sender domain does not align with origin server.', source: 'Header Analyzer' },
        { id: 'ev-2', category: 'impersonation', severity: 'CRITICAL', title: 'Brand Impersonation (micr0soft)', detail: 'Homograph typosquatting substituting "0" for "o". Registered 2 days prior to attempt.', source: 'Domain Threat Intelligence' },
        { id: 'ev-3', category: 'url', severity: 'CRITICAL', title: 'Malicious URL & Redirect Chain', detail: 'URL redirects twice to http://credential-grabber-node.ru/steal.php. Flagged by 48 security engines.', source: 'VirusTotal / URLScan' },
        { id: 'ev-4', category: 'attachment', severity: 'HIGH', title: 'Weaponized PDF JavaScript', detail: 'PDF contains OpenAction auto-executing script spawning external request.', source: 'YARA Scanner' },
        { id: 'ev-5', category: 'header', severity: 'MEDIUM', title: 'Reply-To Mismatch', detail: 'Reply-To is directed to a collector inbox differing from official organization channels.', source: 'Header Analyzer' },
      ],
      reasoningChain: [
        {
          step: 1,
          agent: 'Header Agent',
          action: 'Parsed email headers and evaluated SPF, DKIM, and DMARC parameters.',
          observation: 'Received-SPF is FAIL. DKIM signature is invalid and signed by bad-spammer-host.xyz.',
          conclusion: 'Header authentication fails completely. High probability of spoofed sender.',
          timestamp: '08:12:01.102',
        },
        {
          step: 2,
          agent: 'URL Agent',
          action: 'Extracted embedded URL and queried WHOIS, VirusTotal, and URLScan APIs.',
          observation: 'Domain micr0soft-security-verify.net is 2 days old. URL redirects 2 times ending at http://credential-grabber-node.ru.',
          conclusion: 'URL is an active credential harvester targeting Microsoft login credentials.',
          timestamp: '08:12:01.350',
        },
        {
          step: 3,
          agent: 'Attachment Agent',
          action: 'Inspected Invoice_M365_Upgrade.pdf with YARA rules and entropy parser.',
          observation: 'High entropy (7.82), contains embedded JavaScript launch trigger and remote HTTP payload loader.',
          conclusion: 'Attachment is a weaponized PDF payload designed to compromise local system.',
          timestamp: '08:12:01.590',
        },
        {
          step: 4,
          agent: 'Reasoning Agent',
          action: 'Correlated header failures, domain age, redirect chain, and macro attachment.',
          observation: 'Five critical indicators align directly with Tier-1 SOC phishing signatures.',
          conclusion: 'FINAL VERDICT: HIGH RISK PHISHING (Risk Score 98/100). Immediate quarantine recommended.',
          timestamp: '08:12:01.810',
        },
      ],
      recommendedActions: [
        { id: 'act-1', action: 'Quarantine Email & Purge from Inboxes', priority: 'CRITICAL', category: 'SOC', details: 'Purge message ID from Microsoft 365 Exchange across all tenant mailboxes immediately.' },
        { id: 'act-2', action: 'Block Domain & IP on Firewall / Secure Email Gateway', priority: 'CRITICAL', category: 'NETWORK', details: 'Add micr0soft-security-verify.net and 185.220.101.45 to perimeter blocklists.' },
        { id: 'act-3', action: 'Reset User Credentials & Revoke Active Sessions', priority: 'HIGH', category: 'CREDENTIAL', details: 'Force password reset and revoke OAuth refresh tokens for john.doe@enterprise-corp.com.' },
        { id: 'act-4', action: 'Broadcast Security Awareness Alert', priority: 'MEDIUM', category: 'USER', details: 'Warn organization regarding ongoing Microsoft 365 expiration homograph campaign.' },
      ],
      generatedYaraRule: `rule PhishGuard_M365_Homograph_PDF {
  meta:
    description = "Detects weaponized PDF with embedded micr0soft phishing URL"
    author = "PhishGuard AI Autonomous Agent"
    date = "2026-08-03"
    severity = "CRITICAL"
  strings:
    $pdf_magic = "%PDF-"
    $js_launch = "/JavaScript"
    $open_action = "/OpenAction"
    $phish_domain = "micr0soft-security-verify"
  condition:
    $pdf_magic at 0 and ($js_launch and $open_action) and $phish_domain
}`,
    },
    agentLogs: [
      '[08:12:00.005] [Orchestrator] Email components received. Parsing 1 header, 1 URL, 1 attachment.',
      '[08:12:00.120] [Header Agent] Analyzing SPF/DKIM/DMARC... SPF=FAIL, DKIM=FAIL, DMARC=REJECT.',
      '[08:12:00.310] [Header Agent] GeoIP lookup on 185.220.101.45 -> Romania (Bulletproof ISP).',
      '[08:12:00.450] [URL Agent] Extracted https://micr0soft-security-verify.net/auth/login.',
      '[08:12:00.620] [URL Agent] Homograph detection trigger: micr0soft-security-verify.net -> Spoofing Microsoft (Similarity: 94%).',
      '[08:12:00.810] [URL Agent] Following redirect chain: 2 hops -> credential-grabber-node.ru.',
      '[08:12:01.010] [Attachment Agent] Scanning Invoice_M365_Upgrade.pdf... Macro JS detected!',
      '[08:12:01.300] [Reasoning Agent] Synthesizing evidence matrix... Risk score calculated: 98/100.',
      '[08:12:01.500] [Orchestrator] Investigation complete. High Risk Phishing verdict emitted.',
    ],
  },
  {
    id: 'CASE-2026-9022',
    title: 'Executive BEC CEO Wire Transfer Request (No Attachment)',
    timestamp: new Date().toISOString(),
    subject: 'URGENT & CONFIDENTIAL: Acquisition Wire Transfer Instructions',
    sender: 'Robert Sterling <ceo-executive-desk@company-exec.co>',
    recipient: 'finance-lead@enterprise-corp.com',
    rawEmailInput: `From: "Robert Sterling" <ceo-executive-desk@company-exec.co>
To: finance-lead@enterprise-corp.com
Subject: URGENT & CONFIDENTIAL: Acquisition Wire Transfer Instructions
Date: Mon, 03 Aug 2026 09:30:12 -0400
Reply-To: <r.sterling.ceo.office@gmail.com>
Return-Path: <outbound@sendgrid-temp-node.net>
Received: from sendgrid-temp-node.net (192.241.200.12) by mx.enterprise-corp.com

Hey Sarah,

I am in an urgent closed-door M&A meeting right now and cannot take phone calls. 
We need to process an initial earnest deposit of $145,000 for the acquisition deal before 12:00 PM EST today.

Please find the bank account details below and process via wire immediately:
Bank Name: First International Global Bank
Account Name: Horizon Ventures LLC
Account Number: 9812-4012-9911
Routing: 121000358

Confirm once sent so I can brief the board. Keep this strictly between us.

Best,
Robert Sterling
Chief Executive Officer`,
    headerResult: {
      spfStatus: 'SOFTFAIL',
      spfDetails: 'Sender IP 192.241.200.12 softfailed SPF check for domain company-exec.co',
      dkimStatus: 'NEUTRAL',
      dkimDetails: 'No DKIM signature present on header',
      dmarcStatus: 'FAIL',
      dmarcDetails: 'DMARC policy failed due to lack of domain alignment',
      returnPath: 'outbound@sendgrid-temp-node.net',
      replyTo: 'r.sterling.ceo.office@gmail.com',
      senderAddress: 'ceo-executive-desk@company-exec.co',
      senderDomain: 'company-exec.co',
      returnPathMatch: false,
      replyToMismatch: true,
      senderIp: '192.241.200.12',
      senderGeo: {
        country: 'United States',
        city: 'Chicago',
        isp: 'DigitalOcean Cloud Hosting',
        flag: '🇺🇸',
      },
      routeHops: [
        {
          hopNumber: 1,
          fromHost: 'sendgrid-temp-node.net',
          fromIp: '192.241.200.12',
          byHost: 'mx.enterprise-corp.com',
          timestamp: '09:30:12 UTC',
          delaySeconds: 1,
          ipReputation: 'Suspicious',
          country: 'United States',
          flag: '🇺🇸',
        },
      ],
      anomalies: [
        'Executive Impersonation: Display name "Robert Sterling" matches internal CEO',
        'Reply-To address (r.sterling.ceo.office@gmail.com) redirects replies to external Gmail',
        'Urgent financial pressuring without prior purchase order or ticket authorization',
      ],
    },
    urlResults: [],
    attachmentResults: [],
    impersonationResult: {
      detected: true,
      brandName: 'Executive CEO (Robert Sterling)',
      fakeDomain: 'company-exec.co',
      legitimateDomain: 'enterprise-corp.com',
      similarityScore: 88,
      homographType: 'Subdomain Trick',
      riskLevel: 'CRITICAL',
      details: 'Registered lookalike domain "company-exec.co" mimicking internal corporate domain enterprise-corp.com.',
    },
    aiReasoning: {
      verdict: 'HIGH_RISK_PHISHING',
      riskScore: 92,
      confidence: 95,
      attackType: 'Business Email Compromise (BEC) / CEO Fraud Wire Scam',
      aiSummary: 'Classic Business Email Compromise (BEC) attack impersonating the company CEO (Robert Sterling). Uses high-pressure language demanding an urgent $145,000 wire transfer, uses a lookalike domain (company-exec.co), and routes replies to a free Gmail account.',
      evidenceList: [
        { id: 'ev-1', category: 'impersonation', severity: 'CRITICAL', title: 'CEO Executive Impersonation', detail: 'Matches internal CEO name "Robert Sterling" but sent from external domain company-exec.co.', source: 'Impersonation Engine' },
        { id: 'ev-2', category: 'header', severity: 'HIGH', title: 'Reply-To Mismatch (External Gmail)', detail: 'Directs responses to r.sterling.ceo.office@gmail.com bypassing corporate filters.', source: 'Header Analyzer' },
        { id: 'ev-3', category: 'header', severity: 'HIGH', title: 'Financial Wire Request', detail: 'Contains direct request for wire transfer ($145,000) to external bank account.', source: 'NLP Threat Classifier' },
        { id: 'ev-4', category: 'header', severity: 'MEDIUM', title: 'SPF SoftFail & Missing DKIM', detail: 'Email failed SPF verification and lacks cryptographic DKIM sign-off.', source: 'Header Analyzer' },
      ],
      reasoningChain: [
        {
          step: 1,
          agent: 'Header Agent',
          action: 'Extracted sender and reply-to headers.',
          observation: 'From domain is company-exec.co. Reply-To is r.sterling.ceo.office@gmail.com.',
          conclusion: 'Significant Reply-To anomaly designed to hijack conversation thread.',
          timestamp: '09:30:13.010',
        },
        {
          step: 2,
          agent: 'URL Agent',
          action: 'Scanned body text for external hyperlinks.',
          observation: 'No hyperlinks present in message body.',
          conclusion: 'Pure social engineering BEC text attack.',
          timestamp: '09:30:13.120',
        },
        {
          step: 3,
          agent: 'Attachment Agent',
          action: 'Checked for attached files.',
          observation: 'No attachments found.',
          conclusion: 'N/A',
          timestamp: '09:30:13.200',
        },
        {
          step: 4,
          agent: 'Reasoning Agent',
          action: 'Correlated CEO display name with $145,000 wire transfer keywords and Reply-To Gmail.',
          observation: 'High urgency language + financial wire instruction + spoofed domain = 92/100 BEC risk.',
          conclusion: 'HIGH RISK BEC PHISHING. Do NOT process wire transfer.',
          timestamp: '09:30:13.410',
        },
      ],
      recommendedActions: [
        { id: 'act-1', action: 'Notify Finance Department & Halt Wire', priority: 'CRITICAL', category: 'SOC', details: 'Alert finance team immediately to block any pending wire transfers to Horizon Ventures LLC.' },
        { id: 'act-2', action: 'Block Sender Domain & Reply-To Gmail', priority: 'HIGH', category: 'NETWORK', details: 'Add company-exec.co and r.sterling.ceo.office@gmail.com to mail gateway blocklist.' },
        { id: 'act-3', action: 'Perform Out-of-Band Phone Verification', priority: 'HIGH', category: 'USER', details: 'Contact CEO via internal phone extension or messaging app to confirm legitimacy.' },
      ],
      generatedYaraRule: `rule PhishGuard_BEC_CEO_Wire_Scam {
  meta:
    description = "Detects CEO wire transfer BEC phishing keywords and lookalike domain patterns"
    author = "PhishGuard AI Autonomous Agent"
    date = "2026-08-03"
    severity = "HIGH"
  strings:
    $req1 = "wire transfer" nocase
    $req2 = "urgent" nocase
    $req3 = "closed-door" nocase
    $req4 = "deposit" nocase
    $bank = "Routing:" nocase
  condition:
    3 of ($req*) and $bank
}`,
    },
    agentLogs: [
      '[09:30:12.800] [Orchestrator] Processing BEC Case CASE-2026-9022.',
      '[09:30:12.910] [Header Agent] Display Name: Robert Sterling (CEO). Domain: company-exec.co.',
      '[09:30:13.010] [Header Agent] Reply-To anomaly detected: r.sterling.ceo.office@gmail.com.',
      '[09:30:13.150] [Reasoning Agent] NLP pattern match: Urgent Wire Transfer ($145,000).',
      '[09:30:13.410] [Reasoning Agent] Risk score calculated: 92/100 (HIGH RISK BEC).',
    ],
  },
  {
    id: 'CASE-2026-9104',
    title: 'PayPal Account Suspended with QR Code & XLSM Macro',
    timestamp: new Date().toISOString(),
    subject: 'Action Required: Your PayPal Account has been temporarily restricted',
    sender: 'PayPal Service <service@paypaI-resolution-center.app>',
    recipient: 'user@enterprise-corp.com',
    rawEmailInput: `From: "PayPal Service" <service@paypaI-resolution-center.app>
To: user@enterprise-corp.com
Subject: Action Required: Your PayPal Account has been temporarily restricted
Date: Mon, 03 Aug 2026 10:15:00 -0400
Return-Path: <bounce@paypaI-resolution-center.app>

Dear PayPal Customer,

We noticed unauthorized login attempts on your PayPal account from an unrecognized IP address in Moscow, Russia.

For your protection, we have temporarily restricted account access. To restore full features:
1. Scan the QR code below using your mobile phone camera
2. Open the attached resolution file "Account_Verification_Form.xlsm"

[Embedded QR Code Image pointing to: https://paypaI-resolution-center.app/login?id=8912]

PayPal Risk Department`,
    headerResult: {
      spfStatus: 'FAIL',
      spfDetails: 'Domain paypaI-resolution-center.app SPF check failed',
      dkimStatus: 'MISSING',
      dkimDetails: 'No cryptographic signature found',
      dmarcStatus: 'REJECT',
      dmarcDetails: 'DMARC rejection policy enforced',
      returnPath: 'bounce@paypaI-resolution-center.app',
      replyTo: 'service@paypaI-resolution-center.app',
      senderAddress: 'service@paypaI-resolution-center.app',
      senderDomain: 'paypaI-resolution-center.app',
      returnPathMatch: true,
      replyToMismatch: false,
      senderIp: '45.142.214.99',
      senderGeo: {
        country: 'Netherlands',
        city: 'Amsterdam',
        isp: 'Virtual Offshore Cloud',
        flag: '🇳🇱',
      },
      routeHops: [
        {
          hopNumber: 1,
          fromHost: 'mail.paypaI-resolution-center.app',
          fromIp: '45.142.214.99',
          byHost: 'mx.enterprise-corp.com',
          timestamp: '10:15:00 UTC',
          delaySeconds: 0,
          ipReputation: 'Malicious',
          country: 'Netherlands',
          flag: '🇳🇱',
        },
      ],
      anomalies: [
        'Homograph Homoglyph: Domain paypaI-resolution-center.app uses uppercase capital "I" instead of lowercase "l" in PayPal',
        'Quishing (QR Code Phishing) detected in embedded email body graphics',
      ],
    },
    urlResults: [
      {
        id: 'url-qr-1',
        originalUrl: 'https://paypaI-resolution-center.app/login?id=8912',
        cleanUrl: 'https://paypaI-resolution-center.app/login',
        finalRedirectUrl: 'https://paypaI-resolution-center.app/login',
        redirectCount: 0,
        redirectChain: ['https://paypaI-resolution-center.app/login?id=8912'],
        domain: 'paypaI-resolution-center.app',
        domainAgeDays: 1,
        ipAddress: '45.142.214.99',
        virusTotalHits: 38,
        virusTotalTotal: 92,
        urlScanScore: 91,
        whoisRegistrar: 'Regster.com LLC',
        whoisCreatedDate: '2026-08-02 (1 day ago)',
        sslValid: true,
        sslIssuer: "ZeroSSL Domain Validated",
        isHomograph: true,
        targetBrand: 'PayPal',
        qrCodeDetected: true,
        reputationScore: 95,
        status: 'MALICIOUS',
        categories: ['Quishing', 'Credential Harvesting', 'PayPal Spoof'],
      },
    ],
    attachmentResults: [
      {
        id: 'att-xlsm-1',
        fileName: 'Account_Verification_Form.xlsm',
        fileSize: '1.2 MB',
        fileSizeBytes: 1258291,
        mimeType: 'application/vnd.ms-excel.sheet.macroEnabled.12',
        sha256: '8f34b1229a43a12889218bc19283120198218390218938120381023812038122',
        md5: '71a2893bc01928bc9182390123901283',
        threatStatus: 'MALICIOUS',
        isMacroDetected: true,
        macroDetails: 'VBA Module Auto_Open containing Obfuscated PowerShell download cradle executing cmd.exe /c start',
        yaraMatches: [
          { ruleName: 'SUSP_VBA_Macro_AutoOpen_PowerShell', description: 'Excel macro auto-executes base64 encoded PowerShell on sheet load', severity: 'CRITICAL' },
          { ruleName: 'MAL_Downloader_Trojan_XLSM', description: 'XLM macro uses CallWindowProcA to load shellcode', severity: 'CRITICAL' },
        ],
        embeddedUrls: ['https://paypaI-resolution-center.app/payload.bin'],
        jsRisk: false,
        fileEntropy: 7.91,
        peMetadata: {
          compiler: 'VBA / Office Open XML',
          compileTime: '2026-08-02 21:00:00',
        },
        description: 'Weaponized Excel Macro file delivering secondary stage malware dropper.',
      },
    ],
    impersonationResult: {
      detected: true,
      brandName: 'PayPal',
      fakeDomain: 'paypaI-resolution-center.app',
      legitimateDomain: 'paypal.com',
      similarityScore: 96,
      homographType: 'Character Replacement',
      riskLevel: 'CRITICAL',
      details: 'Homoglyph substitution: replacing lowercase "l" with capital letter "I" (paypaI).',
    },
    aiReasoning: {
      verdict: 'CREDENTIAL_HARVESTING',
      riskScore: 97,
      confidence: 98,
      attackType: 'Quishing (QR Code) & Macro Malware Payload',
      aiSummary: 'Dangerous multi-vector attack combining Quishing (QR code phishing bypassing email URL filters) with an auto-executing weaponized Excel Macro file (.xlsm). Spoofs PayPal via homoglyph domain substitution (paypaI).',
      evidenceList: [
        { id: 'ev-1', category: 'url', severity: 'CRITICAL', title: 'Quishing (QR Code Phishing)', detail: 'Embedded QR image directs users to mobile credential phishing site.', source: 'QR Code Vision Scanner' },
        { id: 'ev-2', category: 'attachment', severity: 'CRITICAL', title: 'PowerShell Trojan Macro (.xlsm)', detail: 'Auto_Open macro executes base64 obfuscated payload via cmd.exe.', source: 'YARA Engine' },
        { id: 'ev-3', category: 'impersonation', severity: 'CRITICAL', title: 'PayPal Homoglyph Domain (paypaI)', detail: 'Uses capital "I" to look identical to "paypal.com". Domain created 24 hrs ago.', source: 'Homograph Detector' },
      ],
      reasoningChain: [
        {
          step: 1,
          agent: 'Header Agent',
          action: 'Extracted From header and verified domain auth.',
          observation: 'paypaI-resolution-center.app failed SPF and has no DKIM.',
          conclusion: 'Header fails basic authentication checks.',
          timestamp: '10:15:01.002',
        },
        {
          step: 2,
          agent: 'URL Agent',
          action: 'Processed embedded QR code image using computer vision URL extractor.',
          observation: 'Decoded QR URL: https://paypaI-resolution-center.app/login?id=8912.',
          conclusion: 'QR code contains credential phishing link targeting PayPal users.',
          timestamp: '10:15:01.210',
        },
        {
          step: 3,
          agent: 'Attachment Agent',
          action: 'Analyzed Account_Verification_Form.xlsm for macros.',
          observation: 'Detected VBA Auto_Open macro executing powershell downloader.',
          conclusion: 'Attachment is a malicious dropper payload.',
          timestamp: '10:15:01.400',
        },
        {
          step: 4,
          agent: 'Reasoning Agent',
          action: 'Compiled evidence.',
          observation: 'Combination of QR phishing, homoglyph domain, and Macro executable.',
          conclusion: 'CREDENTIAL_HARVESTING & MALWARE DROPPER (Risk Score 97/100).',
          timestamp: '10:15:01.600',
        },
      ],
      recommendedActions: [
        { id: 'act-1', action: 'Block Domain on Mobile Web Filter / DNS', priority: 'CRITICAL', category: 'NETWORK', details: 'Ensure mobile secure gateway blocks paypaI-resolution-center.app since QR codes target smartphones.' },
        { id: 'act-2', action: 'Quarantine Attachment Hash across Endpoint Detection (EDR)', priority: 'CRITICAL', category: 'SOC', details: 'Push SHA256 8f34b1229a43a12889218bc1928312019821839... to CrowdStrike / Sentinel.' },
      ],
      generatedYaraRule: `rule PhishGuard_Quishing_PayPal_XLSM {
  meta:
    description = "Detects PayPal Quishing scam with XLSM Trojan Macro"
    author = "PhishGuard AI Autonomous Agent"
    date = "2026-08-03"
    severity = "CRITICAL"
  strings:
    $vba = "Auto_Open"
    $ps = "powershell" nocase
    $homoglyph = "paypaI"
  condition:
    all of them
}`,
    },
    agentLogs: [
      '[10:15:00.100] [Orchestrator] Starting multi-agent investigation on QR Code PayPal Phish.',
      '[10:15:00.300] [URL Agent] Decoded QR Code matrix from email body.',
      '[10:15:00.510] [Attachment Agent] Disassembled XLSM VBA stream -> Auto_Open PowerShell launcher detected.',
      '[10:15:00.800] [Reasoning Agent] Verdict emit: CREDENTIAL_HARVESTING / 97/100.',
    ],
  },
  {
    id: 'CASE-2026-9210',
    title: 'Legitimate Corporate Quarterly Security Awareness Newsletter (Benign)',
    timestamp: new Date().toISOString(),
    subject: 'Enterprise Security Update: Q3 Awareness & Training Guidelines',
    sender: 'Global Cyber Security Team <security-team@enterprise-corp.com>',
    recipient: 'all-staff@enterprise-corp.com',
    rawEmailInput: `From: "Global Cyber Security Team" <security-team@enterprise-corp.com>
To: all-staff@enterprise-corp.com
Subject: Enterprise Security Update: Q3 Awareness & Training Guidelines
Date: Mon, 03 Aug 2026 11:00:00 -0400
Return-Path: <security-team@enterprise-corp.com>
Reply-To: <security-team@enterprise-corp.com>
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=enterprise-corp.com; s=s202601;
Received-SPF: pass (enterprise-corp.com: domain of security-team@enterprise-corp.com designates 198.51.100.25 as permitted sender)
Authentication-Results: mx.enterprise-corp.com; dkim=pass header.i=@enterprise-corp.com; spf=pass; dmarc=pass

Team,

Welcome to the Q3 Enterprise Security Awareness Update!

Please review our latest security policies on our intranet portal:
https://intranet.enterprise-corp.com/security/q3-training

Key Highlights:
- Mandatory MFA enrollment for all remote workers
- How to report suspicious emails using the PhishGuard Outlook Button
- Upgraded Endpoint Protection guidelines

Attached is the official PDF digest "Q3_Security_Digest.pdf".

Stay Safe,
Global Cyber Security Office`,
    headerResult: {
      spfStatus: 'PASS',
      spfDetails: 'Sender IP 198.51.100.25 is explicitly authorized in SPF record for enterprise-corp.com',
      dkimStatus: 'PASS',
      dkimDetails: 'Valid RSA 2048-bit DKIM signature verified against enterprise-corp.com public key selector s202601',
      dmarcStatus: 'PASS',
      dmarcDetails: '100% DMARC alignment verified',
      returnPath: 'security-team@enterprise-corp.com',
      replyTo: 'security-team@enterprise-corp.com',
      senderAddress: 'security-team@enterprise-corp.com',
      senderDomain: 'enterprise-corp.com',
      returnPathMatch: true,
      replyToMismatch: false,
      senderIp: '198.51.100.25',
      senderGeo: {
        country: 'United States',
        city: 'New York',
        isp: 'Enterprise Internal Gateway Services',
        flag: '🇺🇸',
      },
      routeHops: [
        {
          hopNumber: 1,
          fromHost: 'outbound-mta.enterprise-corp.com',
          fromIp: '198.51.100.25',
          byHost: 'mx.enterprise-corp.com',
          timestamp: '11:00:00 UTC',
          delaySeconds: 0,
          ipReputation: 'Clean',
          country: 'United States',
          flag: '🇺🇸',
        },
      ],
      anomalies: [],
    },
    urlResults: [
      {
        id: 'url-benign-1',
        originalUrl: 'https://intranet.enterprise-corp.com/security/q3-training',
        cleanUrl: 'https://intranet.enterprise-corp.com/security/q3-training',
        finalRedirectUrl: 'https://intranet.enterprise-corp.com/security/q3-training',
        redirectCount: 0,
        redirectChain: ['https://intranet.enterprise-corp.com/security/q3-training'],
        domain: 'enterprise-corp.com',
        domainAgeDays: 4120,
        ipAddress: '198.51.100.25',
        virusTotalHits: 0,
        virusTotalTotal: 92,
        urlScanScore: 0,
        whoisRegistrar: 'MarkMonitor Inc.',
        whoisCreatedDate: '2015-04-12 (11 years ago)',
        sslValid: true,
        sslIssuer: "DigiCert Global Root G2",
        isHomograph: false,
        qrCodeDetected: false,
        reputationScore: 0,
        status: 'CLEAN',
        categories: ['Corporate Intranet', 'Legitimate'],
      },
    ],
    attachmentResults: [
      {
        id: 'att-benign-pdf',
        fileName: 'Q3_Security_Digest.pdf',
        fileSize: '312 KB',
        fileSizeBytes: 319488,
        mimeType: 'application/pdf',
        sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        md5: '0123456789abcdef0123456789abcdef',
        threatStatus: 'CLEAN',
        isMacroDetected: false,
        yaraMatches: [],
        embeddedUrls: ['https://intranet.enterprise-corp.com/security'],
        jsRisk: false,
        fileEntropy: 5.4,
        description: 'Clean PDF document with standard static text and corporate graphics.',
      },
    ],
    impersonationResult: {
      detected: false,
      riskLevel: 'BENIGN',
      details: 'Authentic domain matches internal corporate organization.',
    },
    aiReasoning: {
      verdict: 'BENIGN',
      riskScore: 2,
      confidence: 99,
      attackType: 'None - Legitimate Internal Communication',
      aiSummary: 'This email is authentic and benign. SPF, DKIM, and DMARC checks all passed with 100% alignment. The link leads to the trusted internal intranet domain (registered 11 years ago), and the attached PDF is clean of macros or scripts.',
      evidenceList: [
        { id: 'ev-b1', category: 'header', severity: 'INFO', title: 'Authentication PASS', detail: 'SPF, DKIM, and DMARC all passed successfully.', source: 'Header Analyzer' },
        { id: 'ev-b2', category: 'url', severity: 'INFO', title: 'Internal Intranet URL', detail: 'Target domain is enterprise-corp.com (Internal, 11 yrs old).', source: 'URL Scanner' },
        { id: 'ev-b3', category: 'attachment', severity: 'INFO', title: 'Clean PDF', detail: 'No macros, no suspicious scripts, low normal entropy.', source: 'YARA Scanner' },
      ],
      reasoningChain: [
        {
          step: 1,
          agent: 'Header Agent',
          action: 'Checked email signature and domain authentication.',
          observation: 'SPF=PASS, DKIM=PASS, DMARC=PASS.',
          conclusion: 'Verified authentic internal sender.',
          timestamp: '11:00:01.000',
        },
        {
          step: 2,
          agent: 'URL Agent',
          action: 'Analyzed link target.',
          observation: 'URL points to internal domain enterprise-corp.com.',
          conclusion: 'Link is safe.',
          timestamp: '11:00:01.100',
        },
        {
          step: 3,
          agent: 'Reasoning Agent',
          action: 'Synthesized results.',
          observation: 'All checks passed with 0 threat indicators.',
          conclusion: 'BENIGN (Risk Score 2/100). Safe for delivery.',
          timestamp: '11:00:01.200',
        },
      ],
      recommendedActions: [
        { id: 'act-b1', action: 'Allow Delivery to Inboxes', priority: 'LOW', category: 'SOC', details: 'No restrictive action required. Email is benign.' },
      ],
    },
    agentLogs: [
      '[11:00:00.010] [Orchestrator] Analyzing internal newsletter CASE-2026-9210.',
      '[11:00:00.100] [Header Agent] SPF/DKIM/DMARC: All PASS.',
      '[11:00:00.200] [Reasoning Agent] Case classified as BENIGN (Score 2/100).',
    ],
  },
];
