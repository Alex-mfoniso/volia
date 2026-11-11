import React, { useState, useEffect } from 'react';
import { Lock, FileCheck, Database, Check, Users, History } from 'lucide-react';
import { AuditLogItem, UserRole } from '@/types';
import { interviewService } from '@/services/interviewService';
import { DataTable } from '@/components/ui/admin/DataTable';
import { TableColumn } from '@/types/ui';
import { Badge } from '@/components/ui/Badge';

export const AdminSettingsPage: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    const fetchLogs = async () => {
      setIsLoadingLogs(true);
      try {
        const logs = await interviewService.getAuditLogs();
        if (mounted) setAuditLogs(logs);
      } catch (err) {
        console.error('Failed to load audit logs', err);
      } finally {
        if (mounted) setIsLoadingLogs(false);
      }
    };
    fetchLogs();
    return () => {
      mounted = false;
    };
  }, []);

  const rolesMatrix: { role: UserRole; title: string; desc: string; permissions: string[] }[] = [
    {
      role: 'admin',
      title: 'Managing Director / System Administrator',
      desc: 'Superuser clearance over all recruitment operations, user roles, audit trails, and job publications.',
      permissions: [
        'Publish & Archive Positions',
        'Review Candidate Dossiers',
        'Stage Progression & Offers',
        'System & Security Settings',
        'Full Audit Log Clearance',
      ],
    },
    {
      role: 'hr_manager',
      title: 'People & Talent Lead',
      desc: 'Primary recruiter coordinating candidate workflows, interview scheduling, and preliminary screenings.',
      permissions: [
        'Publish & Edit Positions',
        'Review Candidate Dossiers',
        'Stage Progression',
        'Interview Scheduling',
        'Standard Audit Viewing',
      ],
    },
    {
      role: 'hiring_manager',
      title: 'Chief Engineer / Discipline Lead',
      desc: 'Technical evaluator assessing engineering portfolios, structural calculations, and design competence.',
      permissions: [
        'Inspect Candidate Resumes',
        'Technical Peer Evaluations',
        'Interview Attendance & Notes',
      ],
    },
    {
      role: 'recruiter',
      title: 'Talent Acquisition Associate',
      desc: 'Assists with screening intake, contact correspondence, and interview schedule coordination.',
      permissions: [
        'Screening Ingestion',
        'Interview Coordination',
      ],
    },
  ];

  const auditColumns: TableColumn<AuditLogItem>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp (UTC)',
      render: (log) => (
        <span className="font-mono text-xs text-ink block">
          {new Date(log.timestamp).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'actor',
      header: 'Actor',
      render: (log) => (
        <div>
          <span className="font-medium text-ink block text-xs">{log.actorName}</span>
          <span className="font-mono text-[10px] text-ink-muted">{log.actorId}</span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Operation',
      render: (log) => (
        <span className="font-mono text-[11px] font-semibold text-accent uppercase">
          {log.action.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'details',
      header: 'Target & Log Narrative',
      render: (log) => (
        <p className="text-xs text-ink-muted leading-relaxed font-sans max-w-md">
          {log.details}
        </p>
      ),
    },
    {
      key: 'ipAddress',
      header: 'Client IP',
      align: 'right',
      render: (log) => (
        <span className="font-mono text-[10px] text-ink-muted">{log.ipAddress}</span>
      ),
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-admin-border pb-6">
        <span className="text-[10px] uppercase font-sans font-semibold tracking-architectural text-accent block">
          Governance & Compliance
        </span>
        <h1 className="text-2xl font-serif font-light text-ink">
          Security Settings & Access Control
        </h1>
        <p className="text-xs text-ink-muted font-sans mt-0.5">
          Role-based permissions, Laravel Sanctum API integration settings, and immutable audit trails.
        </p>
      </div>

      {/* Security Architecture Architecture Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-border p-5 space-y-2">
          <div className="flex items-center gap-2 text-ink">
            <Lock className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider font-sans">
              Sanctum Session Auth
            </span>
          </div>
          <p className="text-xs text-ink-muted font-sans leading-relaxed">
            Prepared for Laravel Sanctum SPA cookie session authentication with CSRF protection and Bearer token API fallback.
          </p>
          <Badge variant="success" size="sm">
            Architecture Ready
          </Badge>
        </div>

        <div className="bg-white border border-border p-5 space-y-2">
          <div className="flex items-center gap-2 text-ink">
            <FileCheck className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider font-sans">
              Encrypted Document Vault
            </span>
          </div>
          <p className="text-xs text-ink-muted font-sans leading-relaxed">
            Candidate resumes and portfolios stored in private storage. URLs are signed with short expiration windows.
          </p>
          <Badge variant="success" size="sm">
            Zero Public Exposure
          </Badge>
        </div>

        <div className="bg-white border border-border p-5 space-y-2">
          <div className="flex items-center gap-2 text-ink">
            <Database className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider font-sans">
              Backend Integration
            </span>
          </div>
          <p className="text-xs text-ink-muted font-sans leading-relaxed">
            Toggle <code>VITE_USE_MOCK_API=false</code> to connect directly to the Laravel recruitment endpoints.
          </p>
          <Badge variant="accent" size="sm">
            RESTful Service Mapped
          </Badge>
        </div>
      </div>

      {/* Role-Based Permissions Matrix */}
      <div className="bg-white border border-border p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-border/80 pb-3">
          <Users className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-serif font-medium text-ink uppercase tracking-wider">
            Role-Based Access Control (RBAC) Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rolesMatrix.map((rm) => (
            <div key={rm.role} className="border border-border/80 p-5 space-y-3 bg-canvas/20">
              <div className="flex items-center justify-between">
                <span className="font-serif font-medium text-ink text-sm">
                  {rm.title}
                </span>
                <Badge variant={rm.role === 'admin' ? 'danger' : 'accent'} size="sm">
                  {rm.role}
                </Badge>
              </div>

              <p className="text-xs text-ink-muted font-sans leading-relaxed">
                {rm.desc}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-border/40">
                <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-ink-muted block">
                  Authorized Permissions:
                </span>
                <ul className="grid grid-cols-1 gap-1 text-xs font-sans">
                  {rm.permissions.map((p, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-ink">
                      <Check className="w-3.5 h-3.5 text-status-success shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-border p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-serif font-medium text-ink uppercase tracking-wider">
              Cryptographic Audit Log Trail
            </h2>
          </div>
          <span className="text-[11px] text-ink-muted font-mono">
            {auditLogs.length} events logged
          </span>
        </div>

        <DataTable
          columns={auditColumns}
          data={auditLogs}
          keyExtractor={(l) => l.id}
          isLoading={isLoadingLogs}
        />
      </div>
    </div>
  );
};

export default AdminSettingsPage;
