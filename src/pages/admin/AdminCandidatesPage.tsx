import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  UserCheck,
  Award,
  Briefcase,
  FileText,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { candidateService, CandidateDossier } from '@/services/candidateService';
import { StatusBadge } from '@/components/ui/admin/StatusBadge';
import { DataTable } from '@/components/ui/admin/DataTable';
import { TableColumn } from '@/types/ui';
import { LoadingSkeleton } from '@/components/ui/feedback/LoadingSkeleton';

export const AdminCandidatesPage: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateDossier[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [minExpFilter, setMinExpFilter] = useState<number>(0);
  const [accreditationFilter, setAccreditationFilter] = useState<string>('all');

  const loadCandidates = async () => {
    setIsLoading(true);
    try {
      const data = await candidateService.getCandidates({
        search: searchTerm,
        minExperience: minExpFilter,
        accreditation: accreditationFilter,
      });
      setCandidates(data);
    } catch (err) {
      console.error('Failed to load candidate dossiers', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [searchTerm, minExpFilter, accreditationFilter]);

  // High-level talent pool metrics
  const totalCount = candidates.length;
  const accreditedCount = candidates.filter((c) =>
    Boolean(c.candidate.professionalAccreditation)
  ).length;
  const seniorCount = candidates.filter((c) => c.candidate.yearsOfExperience >= 7).length;
  const activeReviewCount = candidates.filter((c) =>
    ['screening', 'shortlisted', 'interview', 'assessment'].includes(c.latestStage)
  ).length;

  const columns: TableColumn<CandidateDossier>[] = [
    {
      key: 'name',
      header: 'Candidate & Current Role',
      render: (dossier) => (
        <div>
          <Link
            to={`/admin/candidates/${dossier.candidate.id}`}
            className="font-medium text-ink hover:text-accent font-serif text-sm block"
          >
            {dossier.candidate.fullName}
          </Link>
          <span className="text-xs text-ink-muted truncate block max-w-xs font-sans">
            {dossier.candidate.currentTitle || 'Professional Candidate'}
          </span>
          {dossier.candidate.professionalAccreditation && (
            <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 text-[10px] font-mono bg-accent/10 text-accent border border-accent/20">
              <Award className="w-2.5 h-2.5" />
              {dossier.candidate.professionalAccreditation}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact & Location',
      render: (dossier) => (
        <div className="text-xs space-y-0.5 font-sans">
          <span className="text-ink block">{dossier.candidate.email}</span>
          <span className="text-ink-muted block font-mono">{dossier.candidate.phone}</span>
          <span className="text-[11px] text-ink-muted inline-flex items-center gap-1">
            <MapPin className="w-3 h-3 text-accent" />
            {dossier.candidate.currentLocation}
          </span>
        </div>
      ),
    },
    {
      key: 'experience',
      header: 'Track Record',
      render: (dossier) => (
        <div className="text-xs font-sans">
          <span className="font-mono font-bold text-ink">
            {dossier.candidate.yearsOfExperience} years
          </span>
          <span className="text-[11px] text-ink-muted block truncate max-w-[180px]">
            {dossier.candidate.highestDegree || 'Degree Holder'}
          </span>
        </div>
      ),
    },
    {
      key: 'applications',
      header: 'Commission History',
      render: (dossier) => (
        <div className="text-xs font-sans">
          <span className="font-mono text-ink">
            {dossier.totalApplications} {dossier.totalApplications === 1 ? 'application' : 'applications'}
          </span>
          <span className="text-[11px] text-ink-muted block truncate max-w-[200px]" title={dossier.latestJobTitle}>
            Latest: {dossier.latestJobTitle}
          </span>
        </div>
      ),
    },
    {
      key: 'stage',
      header: 'Pipeline Status',
      render: (dossier) => <StatusBadge status={dossier.latestStage} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (dossier) => (
        <Link
          to={`/admin/candidates/${dossier.candidate.id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent hover:text-ink hover:bg-canvas transition-colors border border-transparent hover:border-border"
        >
          <span>Dossier</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-admin-border pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-light text-ink">Candidate Directory</h1>
            <span className="px-2 py-0.5 text-xs font-mono bg-canvas border border-border text-ink-muted">
              {candidates.length} Profiles
            </span>
          </div>
          <p className="text-xs text-ink-muted font-sans mt-1">
            Centrally catalogued engineering, architecture, and project management talent across all commission cycles.
          </p>
        </div>
      </div>

      {/* Talent Pool Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-border p-4">
          <span className="text-[11px] uppercase tracking-wider text-ink-muted font-sans block mb-1 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-accent" />
            Total Talent Pool
          </span>
          <span className="text-2xl font-serif font-light text-ink">{totalCount}</span>
        </div>
        <div className="bg-white border border-border p-4">
          <span className="text-[11px] uppercase tracking-wider text-ink-muted font-sans block mb-1 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-accent" />
            Accredited (COREN / ARCON)
          </span>
          <span className="text-2xl font-serif font-light text-accent">{accreditedCount}</span>
        </div>
        <div className="bg-white border border-border p-4">
          <span className="text-[11px] uppercase tracking-wider text-ink-muted font-sans block mb-1 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-accent" />
            Senior Tier (7+ Yrs)
          </span>
          <span className="text-2xl font-serif font-light text-ink">{seniorCount}</span>
        </div>
        <div className="bg-white border border-border p-4">
          <span className="text-[11px] uppercase tracking-wider text-ink-muted font-sans block mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-accent" />
            Active in Review
          </span>
          <span className="text-2xl font-serif font-light text-status-warning">{activeReviewCount}</span>
        </div>
      </div>

      {/* Filters & Discovery Bar */}
      <div className="bg-white border border-border p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name, email, credentials, or current firm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-canvas border border-border text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent transition-colors font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-ink-muted" />
            <select
              value={accreditationFilter}
              onChange={(e) => setAccreditationFilter(e.target.value)}
              className="text-xs bg-canvas border border-border px-3 py-2 text-ink focus:outline-none focus:border-accent font-sans"
            >
              <option value="all">All Accreditations</option>
              <option value="coren">COREN Registered</option>
              <option value="arcon">ARCON Registered</option>
              <option value="niqs">NIQS / QSRBN</option>
              <option value="pmp">PMP / Project Mgmt</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={minExpFilter}
              onChange={(e) => setMinExpFilter(Number(e.target.value))}
              className="text-xs bg-canvas border border-border px-3 py-2 text-ink focus:outline-none focus:border-accent font-sans"
            >
              <option value={0}>Any Experience Level</option>
              <option value={3}>3+ Years Experience</option>
              <option value={5}>5+ Years Experience</option>
              <option value={7}>7+ Years (Senior)</option>
              <option value={10}>10+ Years (Principal/Lead)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates Data Table */}
      {isLoading ? (
        <div className="bg-white border border-border p-6 space-y-4">
          <LoadingSkeleton height={40} count={6} />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={candidates}
          keyExtractor={(d) => d.candidate.id}
          emptyTitle="No candidates match your parameters"
          emptyDescription="Try clearing search terms or broadening accreditation filters."
        />
      )}
    </div>
  );
};

export default AdminCandidatesPage;
