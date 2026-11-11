import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { AdminLayout } from '@/components/layout/admin/AdminLayout';
import { CareersLayout } from '@/components/layout/public/CareersLayout';
import {
  // Public Corporate Pages
  HomePage,
  AboutPage,
  ServicesPage,
  ServiceConsultationPage,
  ProjectsPage,
  ProjectBriefPage,
  CompanyProfilePage,
  InsightsPage,
  InsightDetailPage,
  ContactPage,
  NotFoundPage,
  // Careers Portal
  CareersPage,
  JobDetailPage,
  JobApplyPage,
  ApplicationConfirmationPage,
  // Administration Platform
  AdminLoginPage,
  AdminDashboardPage,
  AdminJobsPage,
  AdminJobCreatePage,
  AdminJobDetailPage,
  AdminJobEditPage,
  AdminApplicationsPage,
  AdminApplicationDetailPage,
  AdminCandidatesPage,
  AdminCandidateDetailPage,
  AdminPipelinePage,
  AdminInterviewsPage,
  AdminSettingsPage,
} from '@/pages';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Corporate Website */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/consultation" element={<ServiceConsultationPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/project-brief" element={<ProjectBriefPage />} />
      <Route path="/company-profile" element={<CompanyProfilePage />} />
      <Route path="/insights" element={<InsightsPage />} />
      <Route path="/insights/:slug" element={<InsightDetailPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* 2. Public Careers & Application Portal */}
      <Route element={<CareersLayout />}>
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/careers/:slug" element={<JobDetailPage />} />
        <Route path="/careers/:slug/apply" element={<JobApplyPage />} />
        <Route path="/application/confirmation" element={<ApplicationConfirmationPage />} />
      </Route>

      {/* 3. Administration Authentication */}
      <Route
        path="/admin/login"
        element={
          <PublicOnlyRoute>
            <AdminLoginPage />
          </PublicOnlyRoute>
        }
      />

      {/* 4. Protected Administration & Recruitment Management Platform */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="jobs" element={<AdminJobsPage />} />
        <Route path="jobs/create" element={<AdminJobCreatePage />} />
        <Route path="jobs/:id" element={<AdminJobDetailPage />} />
        <Route path="jobs/:id/edit" element={<AdminJobEditPage />} />
        <Route path="applications" element={<AdminApplicationsPage />} />
        <Route path="applications/:id" element={<AdminApplicationDetailPage />} />
        <Route path="candidates" element={<AdminCandidatesPage />} />
        <Route path="candidates/:id" element={<AdminCandidateDetailPage />} />
        <Route path="pipeline" element={<AdminPipelinePage />} />
        <Route path="interviews" element={<AdminInterviewsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* 5. Fallback 404 Recovery */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
