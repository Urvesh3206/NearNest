"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Droplets, Zap, AlertTriangle, Truck, CloudLightning, MapPin, Search, Plus, X, Upload, CheckCircle2 } from 'lucide-react';
import { Badge, Button, Card, Input, Modal, Textarea, Select } from '@/components/ui';

const NOTICES = [
  {
    id: 'n1',
    authority: 'Municipal Corporation',
    title: 'Water Supply Shutdown',
    category: 'Water Shutdown',
    icon: Droplets,
    severity: 'Critical',
    location: 'Sector 14 - 2km radius',
    date: 'Tomorrow, 9:00 AM - 5:00 PM',
    description: 'Scheduled maintenance of the main pipeline line. Please store sufficient water.',
    verified: true,
  },
  {
    id: 'n2',
    authority: 'Electricity Board',
    title: 'Grid Maintenance',
    category: 'Power Maintenance',
    icon: Zap,
    severity: 'High',
    location: 'Phase 2 & 3',
    date: 'Sep 4, 2:00 PM - 4:00 PM',
    description: 'Routine grid maintenance. Power will be restored promptly after work completion.',
    verified: true,
  },
  {
    id: 'n3',
    authority: 'Traffic Police',
    title: 'Road Repairs & Diversion',
    category: 'Traffic Diversion',
    icon: AlertTriangle,
    severity: 'Info',
    location: 'MG Road Junction',
    date: 'Valid till Sep 10',
    description: 'Road resurfacing work in progress. Please use the alternative route via Link Road.',
    verified: true,
  },
  {
    id: 'n4',
    authority: 'Health Dept',
    title: 'Free Dengue Checkup Camp',
    category: 'Health Camps',
    icon: ShieldCheck,
    severity: 'Info',
    location: 'Community Hall',
    date: 'This Sunday, 10:00 AM',
    description: 'Free checkup camp organized by the health department. Bring your resident ID.',
    verified: true,
  },
  {
    id: 'n5',
    authority: 'Municipal Corporation',
    title: 'Heavy Rainfall Warning',
    category: 'Weather Alerts',
    icon: CloudLightning,
    severity: 'High',
    location: 'Entire District',
    date: 'Next 48 Hours',
    description: 'IMD predicts heavy rainfall. Please avoid unnecessary travel and park vehicles safely.',
    verified: true,
  }
];

export default function NoticesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportStatus, setReportStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'danger';
      case 'High': return 'warning';
      case 'Info': return 'info';
      default: return 'default';
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportStatus('submitting');
    setTimeout(() => {
      setReportStatus('success');
      setTimeout(() => {
        setIsReportModalOpen(false);
        setReportStatus('idle');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            Government & Municipal Updates
            <ShieldCheck className="w-6 h-6 text-blue-500" />
          </h1>
          <p className="text-text-secondary mt-1">Official notices and alerts for your neighborhood</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <Input 
              placeholder="Search notices..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            className="flex-shrink-0" 
            onClick={() => setIsReportModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Report Issue
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {NOTICES.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase())).map((notice) => (
          <Card key={notice.id} className="p-5 hover:border-brand-500 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${
                  notice.severity === 'Critical' ? 'bg-coral-100 text-coral-600 dark:bg-coral-900/30' :
                  notice.severity === 'High' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30' :
                  'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                }`}>
                  <notice.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">{notice.authority}</span>
                    {notice.verified && (
                      <span title="Verified Authority">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-text-primary text-lg">{notice.title}</h3>
                </div>
              </div>
              <Badge variant={getSeverityColor(notice.severity) as any}>{notice.severity}</Badge>
            </div>
            
            <p className="text-text-secondary text-sm mb-4 line-clamp-2">{notice.description}</p>
            
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border-hairline">
              <div className="flex items-center gap-1.5 text-xs text-text-secondary bg-surface-subtle px-2.5 py-1 rounded-md">
                <MapPin className="w-3.5 h-3.5" />
                {notice.location}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-secondary bg-surface-subtle px-2.5 py-1 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                {notice.date}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isReportModalOpen} onClose={() => reportStatus === 'idle' && setIsReportModalOpen(false)} title="Report Civic Issue">
        {reportStatus === 'success' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Issue Reported Successfully</h3>
            <p className="text-text-secondary mb-6">Your report has been submitted to the authorities with GPS tags.</p>
            <Button onClick={() => setIsReportModalOpen(false)} className="w-full">Done</Button>
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Issue Category</label>
              <Select>
                <option>Broken Road / Pothole</option>
                <option>Streetlight Not Working</option>
                <option>Garbage Dump Overflow</option>
                <option>Water Leakage / Pipe Burst</option>
                <option>Fallen Tree / Branches</option>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
              <Textarea placeholder="Please describe the issue in detail..." rows={3} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Location (Auto-tagged via GPS)</label>
              <div className="flex items-center gap-2 px-3 py-2 bg-surface-subtle border border-border-hairline rounded-lg text-sm text-text-secondary">
                <MapPin className="w-4 h-4 text-brand-500" />
                Sector 14, Main Road Junction (28.4595° N, 77.0266° E)
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Upload Photo</label>
              <div className="border-2 border-dashed border-border-hairline rounded-lg p-6 text-center hover:bg-surface-subtle transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                <Upload className="w-6 h-6 text-text-tertiary" />
                <span className="text-sm text-text-secondary">Tap to upload a photo of the issue</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border-hairline">
              <Button type="button" variant="ghost" onClick={() => setIsReportModalOpen(false)} disabled={reportStatus === 'submitting'}>Cancel</Button>
              <Button type="submit" disabled={reportStatus === 'submitting'}>
                {reportStatus === 'submitting' ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
