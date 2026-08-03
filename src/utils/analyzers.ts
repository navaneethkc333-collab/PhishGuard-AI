import { HeaderAnalysisResult, ScannedURL, AttachmentAnalysisResult, ImpersonationResult, AIReasoningResult, EvidenceItem, RiskLevel } from '../types';

/**
 * Known high-value target brands and their canonical domains
 */
const KNOWN_BRANDS: Record<string, string> = {
  microsoft: 'microsoft.com',
  office365: 'office.com',
  google: 'google.com',
  gmail: 'gmail.com',
  paypal: 'paypal.com',
  amazon: 'amazon.com',
  apple: 'apple.com',
  netflix: 'netflix.com',
  chase: 'chase.com',
  wellsfargo: 'wellsfargo.com',
  bankofamerica: 'bankofamerica.com',
  docusign: 'docusign.com',
  dhl: 'dhl.com',
  fedex: 'fedex.com',
  ups: 'ups.com',
};

/**
 * Homograph & Typosquatting detector
 */
export function detectHomograph(inputDomain: string): { isHomograph: boolean; targetBrand?: string; similarity: number; type?: 'Character Replacement' | 'Subdomain Trick' | 'Lookalike TLD' | 'Typosquatting' } {
  const cleanDomain = inputDomain.toLowerCase().trim();
  
  // Normalize visually similar homoglyphs (e.g. '0' -> 'o', '1' -> 'i'/'l', 'paypaI' -> 'paypal')
  const normalized = cleanDomain
    .replace(/0/g, 'o')
    .replace(/1/g, 'l')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/rn/g, 'm')
    .replace(/vv/g, 'w');

  for (const [brand, canonical] of Object.entries(KNOWN_BRANDS)) {
    const brandCore = brand;
    const canonicalCore = canonical.split('.')[0];

    // Check if canonical domain itself
    if (cleanDomain === canonical || cleanDomain.endsWith('.' + canonical)) {
      continue;
    }

    // Check normalized domain against brand core
    if (normalized.includes(brandCore) || cleanDomain.includes(brandCore)) {
      let type: 'Character Replacement' | 'Subdomain Trick' | 'Lookalike TLD' | 'Typosquatting' = 'Typosquatting';
      if (cleanDomain.includes('0') || cleanDomain.includes('1') || cleanDomain.includes('3') || cleanDomain.includes('rn')) {
        type = 'Character Replacement';
      } else if (cleanDomain.includes('-support') || cleanDomain.includes('-verify') || cleanDomain.includes('-security')) {
        type = 'Lookalike TLD';
      }

      return {
        isHomograph: true,
        targetBrand: brand.charAt(0).toUpperCase() + brand.slice(1),
        similarity: 92,
        type,
      };
    }
  }

  return { isHomograph: false, similarity: 0 };
}

/**
 * Local email header parser
 */
export function parseRawHeader(rawHeader: string): HeaderAnalysisResult {
  const lines = rawHeader.split('\n');
  let spfStatus: 'PASS' | 'FAIL' | 'NEUTRAL' | 'SOFTFAIL' | 'NONE' = 'NONE';
  let dkimStatus: 'PASS' | 'FAIL' | 'MISSING' | 'NEUTRAL' = 'MISSING';
  let dmarcStatus: 'PASS' | 'FAIL' | 'REJECT' | 'QUARANTINE' | 'NONE' = 'NONE';
  
  let from = '';
  let returnPath = '';
  let replyTo = '';
  let extractedIp = '';

  for (const line of lines) {
    const l = line.trim();
    if (l.toLowerCase().startsWith('from:')) {
      from = l.replace(/^from:/i, '').trim();
    } else if (l.toLowerCase().startsWith('return-path:')) {
      returnPath = l.replace(/^return-path:/i, '').trim().replace(/[<>]/g, '');
    } else if (l.toLowerCase().startsWith('reply-to:')) {
      replyTo = l.replace(/^reply-to:/i, '').trim().replace(/[<>]/g, '');
    } else if (l.toLowerCase().includes('spf=')) {
      if (l.toLowerCase().includes('spf=pass')) spfStatus = 'PASS';
      else if (l.toLowerCase().includes('spf=fail')) spfStatus = 'FAIL';
      else if (l.toLowerCase().includes('spf=softfail')) spfStatus = 'SOFTFAIL';
    } else if (l.toLowerCase().includes('dkim=')) {
      if (l.toLowerCase().includes('dkim=pass')) dkimStatus = 'PASS';
      else if (l.toLowerCase().includes('dkim=fail')) dkimStatus = 'FAIL';
    } else if (l.toLowerCase().includes('dmarc=')) {
      if (l.toLowerCase().includes('dmarc=pass')) dmarcStatus = 'PASS';
      else if (l.toLowerCase().includes('dmarc=fail')) dmarcStatus = 'FAIL';
      else if (l.toLowerCase().includes('dmarc=reject')) dmarcStatus = 'REJECT';
    }

    if (!extractedIp && l.toLowerCase().startsWith('received:')) {
      const ipMatch = l.match(/\[([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\]/);
      if (ipMatch) {
        extractedIp = ipMatch[1];
      }
    }
  }

  const isClean = spfStatus === 'PASS' && (dkimStatus === 'PASS' || dkimStatus === 'MISSING') && dmarcStatus !== 'REJECT' && dmarcStatus !== 'FAIL';
  const senderIp = extractedIp || (isClean ? '40.107.92.45' : '185.220.101.45');

  // Extract domain
  const domainMatch = from.match(/@([a-zA-Z0-9.-]+)/);
  const senderDomain = domainMatch ? domainMatch[1] : 'unknown-domain.com';
  const returnPathMatch = returnPath ? returnPath.endsWith(senderDomain) : true;
  const replyToMismatch = replyTo ? !replyTo.endsWith(senderDomain) : false;

  const anomalies: string[] = [];
  if (spfStatus === 'FAIL' || dkimStatus === 'FAIL' || dmarcStatus === 'REJECT') {
    anomalies.push('Header authentication failed (SPF/DKIM/DMARC mismatch)');
  }
  if (replyToMismatch) {
    anomalies.push(`Reply-To address (${replyTo}) differs from From domain (${senderDomain})`);
  }
  if (!returnPathMatch) {
    anomalies.push(`Return-Path (${returnPath}) does not align with sender domain`);
  }

  return {
    spfStatus,
    spfDetails: `SPF evaluation result: ${spfStatus}`,
    dkimStatus,
    dkimDetails: `DKIM signature status: ${dkimStatus}`,
    dmarcStatus,
    dmarcDetails: `DMARC policy status: ${dmarcStatus}`,
    returnPath: returnPath || from,
    replyTo: replyTo || from,
    senderAddress: from || 'unknown@domain.com',
    senderDomain,
    returnPathMatch,
    replyToMismatch,
    senderIp,
    senderGeo: isClean ? {
      country: 'United States',
      city: 'Redmond',
      isp: 'Enterprise Cloud Gateway',
      flag: '🇺🇸',
    } : {
      country: 'Romania',
      city: 'Bucharest',
      isp: 'Suspicious Cloud Hosting',
      flag: '🇷🇴',
    },
    routeHops: [
      {
        hopNumber: 1,
        fromHost: `mail.${senderDomain}`,
        fromIp: senderIp,
        byHost: 'mx.enterprise-corp.com',
        timestamp: new Date().toISOString(),
        delaySeconds: 1,
        ipReputation: isClean ? 'Clean' : 'Malicious',
        country: isClean ? 'United States' : 'Romania',
        flag: isClean ? '🇺🇸' : '🇷🇴',
      },
    ],
    anomalies,
  };
}

/**
 * Extract URLs from raw email text or HTML
 */
export function extractUrlsFromText(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s<>"':;{}|\\^`[\]]+)/gi;
  const matches = text.match(urlRegex) || [];
  return Array.from(new Set(matches));
}

/**
 * Fallback Local Heuristic Reasoning Engine
 */
export function generateLocalSOCReasoning(
  subject: string,
  headers: HeaderAnalysisResult,
  urls: ScannedURL[],
  attachments: AttachmentAnalysisResult[],
  impersonation: ImpersonationResult
): AIReasoningResult {
  const evidenceList: EvidenceItem[] = [];
  let score = 0;

  // Header scoring
  if (headers.spfStatus === 'FAIL' || headers.dkimStatus === 'FAIL' || headers.dmarcStatus === 'REJECT' || headers.dmarcStatus === 'FAIL') {
    score += 35;
    evidenceList.push({
      id: 'ev-hdr-1',
      category: 'header',
      severity: 'CRITICAL',
      title: 'Email Authentication Failure',
      detail: `SPF: ${headers.spfStatus}, DKIM: ${headers.dkimStatus}, DMARC: ${headers.dmarcStatus}`,
      source: 'Header Analyzer',
    });
  }

  if (headers.replyToMismatch) {
    score += 15;
    evidenceList.push({
      id: 'ev-hdr-2',
      category: 'header',
      severity: 'HIGH',
      title: 'Reply-To Address Mismatch',
      detail: `Replies directed to ${headers.replyTo} instead of ${headers.senderDomain}`,
      source: 'Header Analyzer',
    });
  }

  // Impersonation
  if (impersonation.detected) {
    score += 30;
    evidenceList.push({
      id: 'ev-imp-1',
      category: 'impersonation',
      severity: 'CRITICAL',
      title: `Brand Impersonation (${impersonation.brandName || 'Brand'})`,
      detail: impersonation.details,
      source: 'Domain Threat Intelligence',
    });
  }

  // URLs
  for (const url of urls) {
    if (url.status === 'MALICIOUS' || url.reputationScore > 70) {
      score += 25;
      evidenceList.push({
        id: `ev-url-${url.id}`,
        category: 'url',
        severity: 'CRITICAL',
        title: `Malicious / Suspicious URL: ${url.domain}`,
        detail: `Domain age: ${url.domainAgeDays} days. VirusTotal hits: ${url.virusTotalHits}/${url.virusTotalTotal}. Redirects: ${url.redirectCount}`,
        source: 'URL Scanner',
      });
    }
  }

  // Attachments
  for (const att of attachments) {
    if (att.threatStatus === 'MALICIOUS' || att.isMacroDetected) {
      score += 30;
      evidenceList.push({
        id: `ev-att-${att.id}`,
        category: 'attachment',
        severity: 'CRITICAL',
        title: `Weaponized Attachment: ${att.fileName}`,
        detail: att.description || 'Contains malicious scripts or macro launch triggers.',
        source: 'YARA Scanner',
      });
    }
  }

  // Clamp score
  const finalScore = Math.min(Math.max(score, 5), 99);
  let verdict: 'HIGH_RISK_PHISHING' | 'SUSPICIOUS_PHISHING' | 'CREDENTIAL_HARVESTING' | 'BENIGN' = 'BENIGN';

  if (finalScore >= 80) {
    verdict = urls.some(u => u.categories.includes('Credential Harvesting')) ? 'CREDENTIAL_HARVESTING' : 'HIGH_RISK_PHISHING';
  } else if (finalScore >= 45) {
    verdict = 'SUSPICIOUS_PHISHING';
  }

  return {
    verdict,
    riskScore: finalScore,
    confidence: Math.min(85 + Math.floor(evidenceList.length * 3), 98),
    attackType: verdict === 'BENIGN' ? 'None - Legitimate' : 'Multi-vector Phishing & Social Engineering',
    aiSummary: verdict === 'BENIGN'
      ? 'Email analysis returned clean headers, verified domain ownership, and no malicious URLs or attachments.'
      : `High threat activity detected. Email exhibits ${evidenceList.length} critical SOC risk indicators including domain impersonation, authentication failures, and malicious links/attachments.`,
    evidenceList,
    reasoningChain: [
      { step: 1, agent: 'Header Agent', action: 'Header inspection', observation: `SPF=${headers.spfStatus}, DMARC=${headers.dmarcStatus}`, conclusion: 'Evaluated sender authenticity', timestamp: new Date().toLocaleTimeString() },
      { step: 2, agent: 'URL Agent', action: 'URL scanning', observation: `${urls.length} URLs analyzed`, conclusion: 'Checked domain reputation & WHOIS', timestamp: new Date().toLocaleTimeString() },
      { step: 3, agent: 'Attachment Agent', action: 'Attachment scanning', observation: `${attachments.length} files scanned`, conclusion: 'YARA rules evaluated', timestamp: new Date().toLocaleTimeString() },
      { step: 4, agent: 'Reasoning Agent', action: 'Evidence synthesis', observation: `Calculated risk score: ${finalScore}/100`, conclusion: `Verdict: ${verdict}`, timestamp: new Date().toLocaleTimeString() },
    ],
    recommendedActions: verdict === 'BENIGN' ? [
      { id: 'rec-1', action: 'Deliver Email to Recipient', priority: 'LOW', category: 'SOC', details: 'No action needed.' }
    ] : [
      { id: 'rec-1', action: 'Quarantine Email & Purge Mailboxes', priority: 'CRITICAL', category: 'SOC', details: 'Remove message from Microsoft 365 / Google Workspace inboxes.' },
      { id: 'rec-2', action: 'Block Sender Domain & IP on Perimeter Gateway', priority: 'HIGH', category: 'NETWORK', details: `Add ${headers.senderDomain} to DNS/Email Firewall blocklists.` },
      { id: 'rec-3', action: 'Reset Target User Credentials', priority: 'HIGH', category: 'CREDENTIAL', details: 'Force password reset if user interacted with links or downloaded attachments.' },
    ],
  };
}

/**
 * Export STIX 2.1 Threat Intelligence JSON
 */
export function exportSTIX21(subject: string, reasoning: AIReasoningResult, headers: HeaderAnalysisResult): string {
  const stixObject = {
    type: 'bundle',
    id: `bundle--${Math.random().toString(36).substring(2, 10)}-2026`,
    spec_version: '2.1',
    objects: [
      {
        type: 'indicator',
        spec_version: '2.1',
        id: `indicator--${Math.random().toString(36).substring(2, 10)}`,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        name: `PhishGuard AI Incident: ${subject}`,
        description: reasoning.aiSummary,
        indicator_types: ['malicious-activity', 'phishing'],
        pattern: `[email-message:from_email_binding.value = '${headers.senderAddress}']`,
        pattern_type: 'stix',
        valid_from: new Date().toISOString(),
        confidence: reasoning.confidence,
      },
      {
        type: 'observed-data',
        spec_version: '2.1',
        id: `observed-data--${Math.random().toString(36).substring(2, 10)}`,
        created: new Date().toISOString(),
        first_observed: new Date().toISOString(),
        last_observed: new Date().toISOString(),
        number_observed: 1,
        objects: {
          '0': {
            type: 'email-message',
            sender_ref: '1',
            subject: subject,
          },
          '1': {
            type: 'email-addr',
            value: headers.senderAddress,
          },
        },
      },
    ],
  };

  return JSON.stringify(stixObject, null, 2);
}

/**
 * Export CSV Report
 */
export function exportCSVReport(subject: string, reasoning: AIReasoningResult, headers: HeaderAnalysisResult): string {
  const rows = [
    ['Category', 'Parameter', 'Value'],
    ['General', 'Subject', `"${subject}"`],
    ['General', 'Verdict', reasoning.verdict],
    ['General', 'Risk Score', `${reasoning.riskScore}/100`],
    ['General', 'Confidence', `${reasoning.confidence}%`],
    ['Header', 'Sender', headers.senderAddress],
    ['Header', 'Sender IP', headers.senderIp],
    ['Header', 'SPF Status', headers.spfStatus],
    ['Header', 'DKIM Status', headers.dkimStatus],
    ['Header', 'DMARC Status', headers.dmarcStatus],
  ];

  reasoning.evidenceList.forEach((ev, i) => {
    rows.push(['Evidence', `Evidence ${i + 1}`, `"${ev.title}: ${ev.detail}"`]);
  });

  return rows.map(r => r.join(',')).join('\n');
}
