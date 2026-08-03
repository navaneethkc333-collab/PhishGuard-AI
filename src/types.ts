/**
 * PhishGuard AI - Autonomous Phishing Investigation Agent Types
 */

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO' | 'BENIGN';

export type VerdictType = 'HIGH_RISK_PHISHING' | 'SUSPICIOUS_PHISHING' | 'CREDENTIAL_HARVESTING' | 'BENIGN';

export interface RouteHop {
  hopNumber: number;
  fromHost: string;
  fromIp: string;
  byHost: string;
  timestamp: string;
  delaySeconds: number;
  ipReputation: 'Clean' | 'Suspicious' | 'Malicious' | 'Unknown';
  country?: string;
  flag?: string;
}

export interface HeaderAnalysisResult {
  spfStatus: 'PASS' | 'FAIL' | 'NEUTRAL' | 'SOFTFAIL' | 'NONE';
  spfDetails: string;
  dkimStatus: 'PASS' | 'FAIL' | 'MISSING' | 'NEUTRAL';
  dkimDetails: string;
  dmarcStatus: 'PASS' | 'FAIL' | 'REJECT' | 'QUARANTINE' | 'NONE';
  dmarcDetails: string;
  returnPath: string;
  replyTo: string;
  senderAddress: string;
  senderDomain: string;
  returnPathMatch: boolean;
  replyToMismatch: boolean;
  senderIp: string;
  senderGeo: {
    country: string;
    city: string;
    isp: string;
    flag: string;
  };
  routeHops: RouteHop[];
  anomalies: string[];
}

export interface ScannedURL {
  id: string;
  originalUrl: string;
  cleanUrl: string;
  finalRedirectUrl: string;
  redirectCount: number;
  redirectChain: string[];
  domain: string;
  domainAgeDays: number;
  ipAddress: string;
  virusTotalHits: number;
  virusTotalTotal: number;
  urlScanScore: number; // 0-100
  whoisRegistrar: string;
  whoisCreatedDate: string;
  sslValid: boolean;
  sslIssuer: string;
  isHomograph: boolean;
  targetBrand?: string;
  qrCodeDetected: boolean;
  reputationScore: number; // 0-100 risk score
  status: 'MALICIOUS' | 'SUSPICIOUS' | 'CLEAN' | 'UNKNOWN';
  categories: string[];
}

export interface AttachmentAnalysisResult {
  id: string;
  fileName: string;
  fileSize: string;
  fileSizeBytes: number;
  mimeType: string;
  sha256: string;
  md5: string;
  threatStatus: 'MALICIOUS' | 'SUSPICIOUS' | 'CLEAN';
  isMacroDetected: boolean;
  macroDetails?: string;
  yaraMatches: Array<{ ruleName: string; description: string; severity: RiskLevel }>;
  embeddedUrls: string[];
  jsRisk: boolean;
  fileEntropy: number; // 0.0 - 8.0
  peMetadata?: {
    compiler?: string;
    compileTime?: string;
    suspiciousImports?: string[];
  };
  description: string;
}

export interface ImpersonationResult {
  detected: boolean;
  brandName?: string;
  fakeDomain?: string;
  legitimateDomain?: string;
  similarityScore?: number; // 0-100%
  homographType?: 'Character Replacement' | 'Subdomain Trick' | 'Lookalike TLD' | 'Typosquatting';
  riskLevel: RiskLevel;
  details: string;
}

export interface EvidenceItem {
  id: string;
  category: 'header' | 'url' | 'attachment' | 'impersonation';
  severity: RiskLevel;
  title: string;
  detail: string;
  source: string;
}

export interface ReasoningStep {
  step: number;
  agent: 'Header Agent' | 'URL Agent' | 'Attachment Agent' | 'Reasoning Agent';
  action: string;
  observation: string;
  conclusion: string;
  timestamp: string;
}

export interface RecommendedAction {
  id: string;
  action: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'SOC' | 'USER' | 'NETWORK' | 'CREDENTIAL';
  details: string;
}

export interface AIReasoningResult {
  verdict: VerdictType;
  riskScore: number; // 0 - 100
  confidence: number; // 0 - 100%
  attackType: string;
  aiSummary: string;
  evidenceList: EvidenceItem[];
  reasoningChain: ReasoningStep[];
  recommendedActions: RecommendedAction[];
  generatedYaraRule?: string;
}

export interface InvestigationCase {
  id: string;
  title: string;
  timestamp: string;
  rawEmailInput: string;
  subject: string;
  sender: string;
  recipient: string;
  headerResult: HeaderAnalysisResult;
  urlResults: ScannedURL[];
  attachmentResults: AttachmentAnalysisResult[];
  impersonationResult: ImpersonationResult;
  aiReasoning: AIReasoningResult;
  agentLogs: string[];
}
