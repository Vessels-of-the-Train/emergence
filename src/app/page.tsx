'use client';

import React from 'react';
import { useFirebase } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { FileUpload } from '@/components/file-upload';
import { ChatInterface } from '@/components/chat-interface';
import { PrototypingInterface } from '@/components/prototyping-interface';
import { ProjectSwitcher } from '@/components/project-switcher';
import { PageHeader } from '@/components/page-header';
import OrlogGame from '@/components/OrlogGame';

export default function AetheriumDashboard() {
  const { user, isUserLoading, auth } = useFirebase();

  if (isUserLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4">Please log in to access Aetherium.</p>
        <button
          onClick={() => auth && initiateAnonymousSignIn(auth)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login Anonymously
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white">
      <PageHeader title="Aetherium Dashboard" subtitle="Welcome to the OS Architect Interface" />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-[#6574C6]">OS Architect Dashboard</h1>
        <ProjectSwitcher />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-6">
            <FileUpload />
            <PrototypingInterface />
          </div>
          <div>
            <ChatInterface />
          </div>
        </div>
        <div className="mt-6">
          <OrlogGame />
        </div>
      </div>
    </div>
  );
}
