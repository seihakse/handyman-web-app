'use client';

// src/app/admin/reports/page.tsx
import { useState, useEffect, useCallback } from 'react';
import {
  Flag, CheckCircle, Clock, AlertCircle, XCircle,
  ShieldOff, ShieldX, MessageSquare,
  ChevronDown, ChevronUp, TriangleAlert,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Warning {
  id: string;
  note: string | null;
  adminName: string;
  createdAt: string;
}

interface HandymanContext {
  isPaused: boolean;
  pausedUntil: string | null;
  isBanned: boolean;
  warningCount: number;
  totalReports: number;
  recentWarnings: Warning[];
}

interface Report {
  id: string;
  handymanId: string;
  handymanName: string;
  reason: string;
  description: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
  actionNote: string | null;
  reporterName: string | null;
  reporterEmail: string | null;
  proofImages: string[];
  createdAt: string;
  handyman: HandymanContext;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ['ALL', 'PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'] as const;
type StatusFilter = (typeof STATUS_OPTIONS)[number];

const PAUSE_DAYS_OPTIONS = [3, 7, 14, 30];
const ACTIONABLE_STATUSES = ['PENDING', 'REVIEWED'];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getStatusIcon(status: string) {
  switch (status) {
    case 'PENDING':   return <Clock className="w-4 h-4 text-yellow-600" />;
    case 'REVIEWED':  return <AlertCircle className="w-4 h-4 text-blue-600" />;
    case 'RESOLVED':  return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'DISMISSED': return <XCircle className="w-4 h-4 text-gray-500" />;
    default:          return <Flag className="w-4 h-4 text-gray-600" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'PENDING':   return 'bg-yellow-100 text-yellow-800';
    case 'REVIEWED':  return 'bg-blue-100 text-blue-800';
    case 'RESOLVED':  return 'bg-green-100 text-green-800';
    case 'DISMISSED': return 'bg-gray-100 text-gray-600';
    default:          return 'bg-gray-100 text-gray-800';
  }
}

function HandymanStatusBadge({ h }: { h: HandymanContext }) {
  if (h.isBanned) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        <ShieldX className="w-3 h-3" /> Banned
      </span>
    );
  }
  if (h.isPaused) {
    const until = h.pausedUntil
      ? new Date(h.pausedUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : '—';
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
        <ShieldOff className="w-3 h-3" /> Paused until {until}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
      <CheckCircle className="w-3 h-3" /> Active
    </span>
  );
}

// ── Action Panel ──────────────────────────────────────────────────────────────

function ActionPanel({ report, onActionComplete }: { report: Report; onActionComplete: () => void }) {
  const [note, setNote]             = useState('');
  const [pauseDays, setPauseDays]   = useState(7);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [result, setResult]         = useState<{ ok: boolean; message: string } | null>(null);

  const isActionable = ACTIONABLE_STATUSES.includes(report.status);
  const { handyman: h } = report;

  const handleAction = async (action: 'WARN' | 'PAUSE' | 'BAN' | 'DISMISS') => {
    setSubmitting(action);
    setResult(null);
    try {
      const res = await fetch(`/api/admin/reports/${report.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, note: note.trim() || undefined, pauseDays }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, message: data.message });
        setTimeout(() => { setResult(null); onActionComplete(); }, 1200);
      } else {
        setResult({ ok: false, message: data.error ?? 'Action failed' });
      }
    } catch {
      setResult({ ok: false, message: 'Network error. Please try again.' });
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">

      {/* Handyman context bar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex flex-wrap items-center gap-3 text-sm">
        <HandymanStatusBadge h={h} />
        <span className="text-gray-500 flex items-center gap-1">
          <TriangleAlert className="w-3.5 h-3.5 text-yellow-500" />
          {h.warningCount} warning{h.warningCount !== 1 ? 's' : ''}
        </span>
        <span className="text-gray-500 flex items-center gap-1">
          <Flag className="w-3.5 h-3.5 text-red-400" />
          {h.totalReports} total report{h.totalReports !== 1 ? 's' : ''}
        </span>
        {h.recentWarnings.length > 0 && (
          <span className="text-gray-400 text-xs">
            Last warning: {new Date(h.recentWarnings[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            {h.recentWarnings[0].note ? ` — "${h.recentWarnings[0].note}"` : ''}
          </span>
        )}
      </div>

      <div className="p-4 space-y-4">

        {/* Already closed */}
        {!isActionable && (
          <div className="flex items-start gap-2 text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <span>
              This report has already been <strong>{report.status.toLowerCase()}</strong>.
              {report.actionNote && <span className="ml-1 text-gray-600">Note: "{report.actionNote}"</span>}
            </span>
          </div>
        )}

        {isActionable && (
          <>
            {/* Optional note */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Admin note <span className="text-gray-400 font-normal">(optional — saved with the report)</span>
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. Confirmed fraud via customer complaint #123..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Pause duration selector */}
            {!h.isBanned && (
              <div className="flex items-center gap-2 flex-wrap">
                <label className="text-xs font-medium text-gray-600 whitespace-nowrap">Pause duration:</label>
                <div className="flex gap-1">
                  {PAUSE_DAYS_OPTIONS.map(d => (
                    <button
                      key={d}
                      onClick={() => setPauseDays(d)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                        pauseDays === d
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
                <span className="text-xs text-gray-400">(applies to Pause action only)</span>
              </div>
            )}

            {/* Result feedback */}
            {result && (
              <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                result.ok
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {result.message}
              </div>
            )}

            {/* Action buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleAction('WARN')}
                disabled={!!submitting}
                className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border-2 border-yellow-300 bg-yellow-50 hover:bg-yellow-100 text-yellow-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TriangleAlert className="w-5 h-5" />
                <span className="text-xs font-semibold">{submitting === 'WARN' ? 'Sending…' : 'Warn'}</span>
              </button>

              <button
                onClick={() => handleAction('PAUSE')}
                disabled={!!submitting || h.isBanned || h.isPaused}
                title={h.isBanned ? 'Already banned' : h.isPaused ? 'Already paused' : `Pause for ${pauseDays} days`}
                className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border-2 border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShieldOff className="w-5 h-5" />
                <span className="text-xs font-semibold">
                  {submitting === 'PAUSE' ? 'Pausing…' : h.isPaused ? 'Paused' : `Pause ${pauseDays}d`}
                </span>
              </button>

              <button
                onClick={() => handleAction('BAN')}
                disabled={!!submitting || h.isBanned}
                title={h.isBanned ? 'Already banned' : 'Permanently ban this handyman'}
                className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border-2 border-red-300 bg-red-50 hover:bg-red-100 text-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShieldX className="w-5 h-5" />
                <span className="text-xs font-semibold">
                  {submitting === 'BAN' ? 'Banning…' : h.isBanned ? 'Banned' : 'Ban'}
                </span>
              </button>

              <button
                onClick={() => handleAction('DISMISS')}
                disabled={!!submitting}
                className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle className="w-5 h-5" />
                <span className="text-xs font-semibold">{submitting === 'DISMISS' ? 'Dismissing…' : 'Dismiss'}</span>
              </button>
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-gray-400 text-center leading-tight">
              <span>Records a warning, no public impact</span>
              <span>Hides from listing for {pauseDays} days</span>
              <span>Permanently removes from all listings</span>
              <span>Closes report, no action taken</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Report Card ───────────────────────────────────────────────────────────────

function ReportCard({ report, onRefresh }: { report: Report; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-6 hover:bg-gray-50 transition">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-gray-900">{report.handymanName}</h3>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
              {getStatusIcon(report.status)} {report.status}
            </span>
            <HandymanStatusBadge h={report.handyman} />
          </div>
          <p className="text-sm text-gray-500">
            Reason: <span className="font-medium text-gray-700">{report.reason.replace(/_/g, ' ')}</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Reported by: {report.reporterName ?? report.reporterEmail ?? 'Anonymous'}
          </p>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
          {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      <p className="text-sm text-gray-700 mb-3 leading-relaxed">{report.description}</p>

      {/* Proof images */}
      {report.proofImages?.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Proof photos ({report.proofImages.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {report.proofImages.map((src, i) => (
              <a key={i} href={src} target="_blank" rel="noopener noreferrer">
                <img
                  src={src}
                  alt={`Proof ${i + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity cursor-pointer"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {report.actionNote && (
        <div className="mb-3 flex items-start gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
          <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
          <span><strong>Admin note:</strong> {report.actionNote}</span>
        </div>
      )}

      <button
        onClick={() => setExpanded(v => !v)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
      >
        {expanded
          ? <><ChevronUp className="w-4 h-4" /> Hide actions</>
          : <><ChevronDown className="w-4 h-4" /> Take action</>
        }
      </button>

      {expanded && (
        <ActionPanel
          report={report}
          onActionComplete={() => { setExpanded(false); onRefresh(); }}
        />
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter]   = useState<StatusFilter>('ALL');
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/admin/reports?status=${filter}`);
      const data = await res.json();
      setReports(data.reports ?? []);
    } catch (err) {
      console.error('Failed to fetch reports', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const pendingCount = reports.filter(r => r.status === 'PENDING').length;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          {pendingCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
              {pendingCount} pending
            </span>
          )}
        </div>
        <p className="text-gray-500 mt-1">Review reports and take action on handyman accounts</p>
      </div>

      {/* Filter tabs */}
      <div className="bg-white rounded-xl shadow mb-6 p-4">
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16">
            <Flag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No reports found</p>
            <p className="text-gray-400 text-sm mt-1">
              {filter !== 'ALL' ? 'Try a different filter' : 'Everything looks clean!'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reports.map(report => (
              <ReportCard key={report.id} report={report} onRefresh={fetchReports} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}