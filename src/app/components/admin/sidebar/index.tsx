'use client';

import React from 'react';
import AdminSidebar from '../layout/AdminSidebar';

// Lightweight wrapper for backward compatibility.
// The main, full-featured sidebar lives at `components/admin/layout/AdminSidebar.tsx`.
export default function AdminSidebarWrapper() {
  // Render the layout sidebar with default (expanded) state for callers
  return <AdminSidebar collapsed={false} />;
}

