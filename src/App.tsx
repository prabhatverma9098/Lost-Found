/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastContainer } from './components/ui/ToastContainer';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReportPage } from './pages/ReportPage';
import { AIMatchesPage } from './pages/AIMatchesPage';
import { ItemDetailsPage } from './pages/ItemDetailsPage';
import { ClaimRequestPage } from './pages/ClaimRequestPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { BrowseItemsPage } from './pages/BrowseItemsPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { MyClaimsPage } from './pages/MyClaimsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';

// Admin Subviews
import { 
  ManageReportsView, 
  UsersAdminView, 
  CategoriesAdminView, 
  LocationsAdminView, 
  SettingsAdminView 
} from './pages/admin/AdminSubpages';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Marketing */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Authentication */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />

          {/* Student Dashboard & Portal */}
          <Route element={<DashboardLayout isAdmin={false} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/report/lost" element={<ReportPage />} />
            <Route path="/report/found" element={<ReportPage />} />
            <Route path="/reports" element={<MyReportsPage />} />
            <Route path="/claims" element={<MyClaimsPage />} />
            <Route path="/claims/submit" element={<ClaimRequestPage />} />
            <Route path="/claims/:id" element={<MyClaimsPage />} />
            <Route path="/items" element={<BrowseItemsPage />} />
            <Route path="/items/:id" element={<ItemDetailsPage />} />
            <Route path="/ai-matches" element={<AIMatchesPage />} />
            <Route path="/chat" element={<ChatbotPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin Panel Portal */}
          <Route path="/admin" element={<DashboardLayout isAdmin={true} />}>
            <Route index element={<AdminPanelPage />} />
            <Route path="reports" element={<ManageReportsView />} />
            <Route path="claims" element={<AdminPanelPage />} />
            <Route path="ai-matches" element={<AIMatchesPage />} />
            <Route path="users" element={<UsersAdminView />} />
            <Route path="categories" element={<CategoriesAdminView />} />
            <Route path="locations" element={<LocationsAdminView />} />
            <Route path="notifications" element={<SettingsAdminView />} />
            <Route path="settings" element={<SettingsAdminView />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </AppProvider>
  );
}
