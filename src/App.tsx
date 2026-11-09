/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import { Header } from './components/layout/Header';
import { LandingPage } from './components/landing/LandingPage';
import { CRMWorkspace } from './components/crm/CRMWorkspace';
import { KiraChatWidget } from './components/chat/KiraChatWidget';

const MainAppContent: React.FC = () => {
  const { currentView } = useCRM();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors selection:bg-blue-600 selection:text-white relative">
      <Header />
      {currentView === 'landing' ? <LandingPage /> : <CRMWorkspace />}
      <KiraChatWidget />
    </div>
  );
};

export default function App() {
  return (
    <CRMProvider>
      <MainAppContent />
    </CRMProvider>
  );
}
