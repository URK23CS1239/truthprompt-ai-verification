import { jsPDF } from 'jspdf';
import { VerificationSession } from '../types';

export function downloadJsonReport(session: VerificationSession): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(session, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `truthprompt-audit-${session.id}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function downloadMarkdownReport(session: VerificationSession): void {
  let md = `# TruthPrompt AI Verification Report\n\n`;
  md += `**Date:** ${new Date(session.timestamp).toLocaleDateString()} ${new Date(session.timestamp).toLocaleTimeString()}  \n`;
  md += `**Audit ID:** \`${session.id}\`  \n`;
  md += `**Processing Latency:** ${session.processingTimeMs} ms  \n\n`;

  md += `## Overall Reliability\n\n`;
  md += `- **OVERALL RELIABILITY:** **${session.metrics.reliabilityScore} / 100**\n`;
  md += `- **SUPPORTED:** ${session.metrics.supportedCount}\n`;
  md += `- **CONTRADICTED:** ${session.metrics.contradictedCount}\n`;
  md += `- **UNVERIFIED:** ${session.metrics.unverifiedCount}\n\n`;

  md += `## Prompt & AI Response\n\n`;
  md += `**Prompt:** "${session.prompt}"\n\n`;
  md += `**AI Response:**\n${session.originalResponse}\n\n`;

  md += `## Claim Verification Results\n\n`;
  session.claims.forEach((c, idx) => {
    md += `### Claim ${idx + 1}:\n`;
    md += `${c.text}\n\n`;
    md += `**Status:** ${c.status.toUpperCase()}${c.claimOrigin === 'user_premise' ? ' (Original User Premise)' : ''}\n\n`;
    if (c.status === 'contradicted' && c.correctFact) {
      md += `**Correct fact:** ${c.correctFact}\n\n`;
    }
    md += `**Explanation:**\n${c.reasoning}\n\n`;
    const evidenceList = c.status === 'contradicted' ? c.contradictingEvidence : c.supportingEvidence;
    if (evidenceList && evidenceList.length > 0) {
      md += `**Evidence:**\n`;
      evidenceList.forEach((ev) => {
        md += `- [${ev.title}](${ev.url}) (${ev.domain}): "${ev.snippet}"\n`;
      });
    } else {
      md += `**Evidence:** None available\n`;
    }
    md += `\n---\n\n`;
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `truthprompt-audit-${session.id}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadPdfReport(session: VerificationSession): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header - Clean white style
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('TruthPrompt: AI Response Verification Report', 14, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Audit ID: ${session.id} | Date: ${new Date(session.timestamp).toLocaleDateString()} | Latency: ${session.processingTimeMs} ms`, 14, y + 6);

  y += 14;

  // Thin dividing line
  doc.setDrawColor(226, 232, 240);
  doc.line(14, y, pageWidth - 14, y);
  y += 8;

  // Summary Box - Clean minimal white container
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(`OVERALL RELIABILITY: ${session.metrics.reliabilityScore}/100`, 20, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(16, 185, 129); // green
  doc.text(`SUPPORTED: ${session.metrics.supportedCount}`, 20, y + 16);

  doc.setTextColor(239, 68, 68); // red
  doc.text(`CONTRADICTED: ${session.metrics.contradictedCount}`, 75, y + 16);

  doc.setTextColor(245, 158, 11); // orange
  doc.text(`UNVERIFIED: ${session.metrics.unverifiedCount}`, 135, y + 16);

  y += 30;

  // Prompt Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Prompt:', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const promptLines = doc.splitTextToSize(`"${session.prompt}"`, pageWidth - 28);
  doc.text(promptLines, 14, y);
  y += promptLines.length * 4.5 + 6;

  // Claims Section Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('CLAIM VERIFICATION RESULTS:', 14, y);
  y += 6;

  // Claims List
  session.claims.forEach((claim, idx) => {
    if (y > 255) {
      doc.addPage();
      y = 18;
    }

    const isSupp = claim.status === 'supported';
    const isContr = claim.status === 'contradicted';
    const statusColor = isSupp ? [16, 185, 129] : isContr ? [239, 68, 68] : [217, 119, 6];

    // Card border
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, pageWidth - 28, 28, 'FD');

    // Claim number & status
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Claim ${idx + 1}:`, 18, y + 6);

    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(`[${claim.status.toUpperCase()}]`, 34, y + 6);

    if (claim.claimOrigin === 'user_premise') {
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('(User Premise)', 68, y + 6);
    }

    // Claim Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const claimLines = doc.splitTextToSize(claim.text, pageWidth - 36);
    doc.text(claimLines.slice(0, 2), 18, y + 11);

    // Explanation
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    const reasonText = doc.splitTextToSize(`Explanation: ${claim.reasoning}`, pageWidth - 36);
    doc.text(reasonText.slice(0, 1), 18, y + 19);

    // Evidence
    const evidenceList = isContr ? claim.contradictingEvidence : claim.supportingEvidence;
    const firstEv = evidenceList && evidenceList[0];
    if (firstEv) {
      doc.setTextColor(16, 185, 129);
      doc.text(`Evidence: ${firstEv.title} (${firstEv.url})`, 18, y + 24);
    } else {
      doc.setTextColor(148, 163, 184);
      doc.text('Evidence: No authoritative citation retrieved', 18, y + 24);
    }

    y += 32;
  });

  doc.save(`truthprompt-audit-${session.id}.pdf`);
}
