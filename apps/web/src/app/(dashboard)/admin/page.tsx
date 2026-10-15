"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, Activity, AlertTriangle, ShieldCheck, DollarSign, Send, FileText, 
  CheckCircle, XCircle, Search, Download, Trash2, Clock, Check, RefreshCw, 
  Briefcase, Store, Loader2, Sparkles, MapPin, Phone 
} from 'lucide-react';
import { Card, Button, Badge, Input, Select, Textarea, Tabs } from '@/components/ui';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { getLocalVerifications, updateVerificationStatus, addPendingVerification } from '@/lib/verificationStore';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('verifications');
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchFilter, setSearchFilter] = useState('');
  const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch('/api/services/book');
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (e) {
      console.error('Error fetching bookings:', e);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await fetch('/api/admin/verifications');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.requests) && data.requests.length > 0) {
          setRequests(data.requests);
          if (data.counts) setCounts(data.counts);
          return;
        }
      }
      throw new Error('API unavailable, fallback to local store');
    } catch {
      // Cloudflare Pages static fallback:
      const localList = getLocalVerifications();
      setRequests(localList);
      setCounts({
        total: localList.length,
        pending: localList.filter((r) => r.status === 'PENDING').length,
        approved: localList.filter((r) => r.status === 'APPROVED').length,
        rejected: localList.filter((r) => r.status === 'REJECTED').length,
      });
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchBookings();
  }, []);

  const handleAction = async (type: 'business' | 'service', id: string, action: 'APPROVE' | 'REJECT', name: string) => {
    try {
      const res = await fetch('/api/admin/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, action }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          toast.success(data.message, {
            icon: action === 'APPROVE' ? '✅' : '❌',
          });
          fetchRequests();
          return;
        }
      }
      throw new Error('API unavailable, updating locally');
    } catch {
      updateVerificationStatus(id, action);
      toast.success(`${name} ${action === 'APPROVE' ? 'Approved & Published Live' : 'Rejected'}!`, {
        icon: action === 'APPROVE' ? '✅' : '❌',
      });
      fetchRequests();
    }
  };

  const handleDelete = async (type: string, id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the database?`)) return;
    try {
      const res = await fetch(`/api/admin/verifications?type=${type}&id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success(`Removed "${name}" from database`);
        fetchRequests();
      }
    } catch (err) {
      toast.error('Failed to delete request');
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return (
        r.name?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q) ||
        r.address?.toLowerCase().includes(q) ||
        r.submittedBy?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = [
    { label: 'Total Residents', value: '1,240', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Active Daily Users', value: '89%', icon: Activity, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Open Complaints', value: '4', icon: AlertTriangle, color: 'text-coral-500', bg: 'bg-coral-50 dark:bg-coral-900/20' },
    { 
      label: 'Pending Verifications', 
      value: counts.pending.toString(), 
      subtext: counts.pending > 0 ? 'Requires your approval' : 'All clear', 
      icon: ShieldCheck, 
      color: counts.pending > 0 ? 'text-amber-500' : 'text-green-500', 
      bg: counts.pending > 0 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-green-50 dark:bg-green-900/20' 
    },
    { label: 'Maintenance Collected', value: '₹4,85,000', subtext: '96% of total', icon: DollarSign, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-900/20' },
  ];

  return (
    <RoleGuard
      allowedRoles={['ADMIN']}
      fallbackTitle="Admin Access Clearance Required"
      fallbackMessage="The Society Admin Panel manages financial dues, verification requests, and civic broadcasts. This module is restricted to Platform & Society Administrators."
    >
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Society Admin Panel</h1>
          <p className="text-text-secondary mt-1">Manage platform operations, member verifications, and approvals</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchRequests} className="flex items-center gap-1.5 text-xs">
            <RefreshCw className={`w-3.5 h-3.5 ${loadingRequests ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button variant="outline" className="text-xs"><Download className="w-4 h-4 mr-2" /> Export Report</Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-text-primary mt-1">{stat.value}</h3>
                {stat.subtext && <span className="text-xs text-text-tertiary">{stat.subtext}</span>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-surface border border-border-hairline rounded-xl overflow-hidden mt-8">
        <Tabs
          tabs={[
            { id: 'verifications', label: `Verification Requests (${counts.pending} pending)` },
            { id: 'bookings', label: `Service Bookings (${bookings.length})` },
            { id: 'complaints', label: 'Complaints Manager' },
            { id: 'broadcast', label: 'Broadcast Announcement' },
            { id: 'financials', label: 'Financials & Dues' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="p-6">
          {activeTab === 'verifications' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div>
                  <h3 className="font-semibold text-text-primary">Member, Service & Business Approvals</h3>
                  <p className="text-xs text-text-secondary">Approve friend registrations to publish them live to the public website</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const friendNum = Math.floor(100 + Math.random() * 900);
                      const categories = ['Electrician', 'Plumber', 'AC Repair', 'Carpenter', 'Home Deep Cleaning'];
                      const selectedCat = categories[Math.floor(Math.random() * categories.length)];
                      const newFriend = addPendingVerification({
                        name: `Friend Specialist (${friendNum})`,
                        category: selectedCat,
                        rate: `₹${200 + Math.floor(Math.random() * 150)}/hr`,
                        phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
                        location: 'Ajeenkya Residency & Society',
                        submittedBy: 'Friend Mobile Application',
                      });
                      toast.success(`New friend request from "${newFriend.name}" added!`, { icon: '✨' });
                      fetchRequests();
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all"
                    title="Simulate a new friend registration request on the cloud"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+ Friend Request</span>
                  </button>

                  <div className="relative flex-1 sm:w-52">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                    <Input 
                      placeholder="Search applicant..." 
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="pl-9 text-xs" 
                    />
                  </div>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex gap-2 border-b border-border-hairline pb-3">
                {[
                  { key: 'ALL', label: `All Requests (${counts.total})` },
                  { key: 'PENDING', label: `⏳ Pending (${counts.pending})` },
                  { key: 'APPROVED', label: `✅ Approved (${counts.approved})` },
                  { key: 'REJECTED', label: `❌ Rejected (${counts.rejected})` },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setStatusFilter(f.key as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      statusFilter === f.key
                        ? 'bg-brand-500 text-white shadow-sm'
                        : 'bg-surface-subtle text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {loadingRequests && (
                <div className="py-12 text-center text-text-secondary">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-500" />
                  <p className="text-xs">Loading requests from database...</p>
                </div>
              )}

              {!loadingRequests && filteredRequests.length === 0 && (
                <div className="py-12 text-center bg-surface-subtle/50 rounded-xl p-6">
                  <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-text-primary">No {statusFilter.toLowerCase()} requests found</p>
                  <p className="text-xs text-text-secondary mt-1">When friends or residents apply to join, their profiles will appear here for your review.</p>
                </div>
              )}

              {!loadingRequests && filteredRequests.map((req) => (
                <div 
                  key={req.id} 
                  className={`flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-xl gap-4 transition-colors ${
                    req.status === 'PENDING'
                      ? 'border-amber-300 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20'
                      : req.status === 'APPROVED'
                      ? 'border-green-200 dark:border-green-900/40 bg-surface'
                      : 'border-coral-200 dark:border-coral-900/40 bg-coral-50/30 dark:bg-coral-950/20'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <img 
                      src={req.avatar || req.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(req.name)}`} 
                      alt={req.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-border-hairline bg-surface shrink-0" 
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-text-primary">{req.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.requestType === 'service'
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                            : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                        }`}>
                          {req.requestType === 'service' ? '🔧 Service Provider' : '🏪 Local Business'}
                        </span>
                        
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          req.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300'
                            : req.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-950/80 dark:text-green-300'
                            : 'bg-coral-100 text-coral-800 dark:bg-coral-950/80 dark:text-coral-300'
                        }`}>
                          {req.status === 'PENDING' ? <Clock className="w-3 h-3 animate-pulse" /> : req.status === 'APPROVED' ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{req.status}</span>
                        </span>
                      </div>

                      <p className="text-xs font-medium text-text-secondary mt-1">
                        <span className="text-brand-600 font-semibold">{req.category}</span>
                        {req.rate && <span className="text-text-primary ml-1.5">• {req.rate}</span>}
                        {req.location && <span className="ml-1.5">• {req.location}</span>}
                        {req.address && <span className="ml-1.5">• {req.address}</span>}
                      </p>

                      {req.speciality && (
                        <p className="text-[11px] text-text-tertiary mt-1 line-clamp-1 italic">
                          "{req.speciality}"
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-text-secondary mt-1.5">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-text-tertiary" /> {req.phone}
                        </span>
                        <span>• Submitted by: <strong className="text-text-primary">{req.submittedBy || req.owner || req.name}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {req.status === 'PENDING' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleAction(req.requestType, req.id, 'APPROVE', req.name)}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 shadow-sm flex items-center gap-1 font-semibold"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve & Publish</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAction(req.requestType, req.id, 'REJECT', req.name)}
                          className="text-coral-600 border-coral-200 hover:bg-coral-50 text-xs px-2.5 font-semibold"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          <span>Reject</span>
                        </Button>
                      </>
                    )}

                    {req.status === 'APPROVED' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAction(req.requestType, req.id, 'REJECT', req.name)}
                        className="text-text-secondary hover:text-coral-600 text-xs px-2.5"
                        title="Revoke approval"
                      >
                        Revoke Approval
                      </Button>
                    )}

                    {req.status === 'REJECTED' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleAction(req.requestType, req.id, 'APPROVE', req.name)}
                        className="bg-brand-500 hover:bg-brand-600 text-white text-xs px-3"
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Re-Approve
                      </Button>
                    )}

                    <button 
                      onClick={() => handleDelete(req.requestType, req.id, req.name)}
                      className="p-2 hover:bg-coral-50 text-coral-600 rounded-lg transition-colors"
                      title="Permanently remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'complaints' && (
            <div className="space-y-4">
               <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-text-primary">Active Community Complaints</h3>
                <div className="flex gap-2">
                  <Select className="w-40"><option>All Status</option><option>Open</option><option>In Progress</option></Select>
                  <Input placeholder="Search ticket ID..." className="w-48" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-text-secondary">
                  <thead className="bg-surface-subtle text-xs uppercase font-semibold text-text-tertiary">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">ID</th>
                      <th className="px-4 py-3">Resident</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Assigned To</th>
                      <th className="px-4 py-3 rounded-tr-lg text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border-hairline">
                      <td className="px-4 py-3 font-medium">#T-892</td>
                      <td className="px-4 py-3">John D. (Apt 3A)</td>
                      <td className="px-4 py-3">Plumbing (Common Area)</td>
                      <td className="px-4 py-3"><Badge variant="warning">In Progress</Badge></td>
                      <td className="px-4 py-3">Mike (Maintenance)</td>
                      <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm">Update</Button></td>
                    </tr>
                    <tr className="border-b border-border-hairline">
                      <td className="px-4 py-3 font-medium">#T-893</td>
                      <td className="px-4 py-3">Sarah K. (Apt 5C)</td>
                      <td className="px-4 py-3">Noise Disturbance</td>
                      <td className="px-4 py-3"><Badge variant="danger">Open</Badge></td>
                      <td className="px-4 py-3">Unassigned</td>
                      <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm">Assign</Button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'broadcast' && (
            <div className="max-w-2xl">
              <h3 className="font-semibold text-text-primary mb-4">Send Broadcast Announcement</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Target Audience</label>
                  <Select>
                    <option>All Residents</option>
                    <option>Tower A Only</option>
                    <option>Tower B Only</option>
                    <option>Committee Members</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Message Title</label>
                  <Input placeholder="e.g. Upcoming Pest Control Schedule" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Message Content</label>
                  <Textarea placeholder="Type your announcement here..." rows={5} />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-text-primary">
                    <input type="checkbox" className="rounded border-border-strong text-brand-600 focus:ring-brand-500" defaultChecked />
                    Send Push Notification
                  </label>
                  <label className="flex items-center gap-2 text-sm text-text-primary">
                    <input type="checkbox" className="rounded border-border-strong text-brand-600 focus:ring-brand-500" />
                    Send SMS Alert
                  </label>
                  <label className="flex items-center gap-2 text-sm text-text-primary">
                    <input type="checkbox" className="rounded border-border-strong text-brand-600 focus:ring-brand-500" defaultChecked />
                    Send Email
                  </label>
                </div>
                <Button className="w-full sm:w-auto"><Send className="w-4 h-4 mr-2" /> Send Broadcast Now</Button>
              </form>
            </div>
          )}

          {activeTab === 'financials' && (
            <div className="space-y-4">
               <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-text-primary">Dues & Collections (Current Month)</h3>
                <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-5 border-l-4 border-l-green-500">
                  <h4 className="text-sm font-medium text-text-secondary">Total Collected</h4>
                  <p className="text-3xl font-bold text-text-primary mt-2">₹4,85,000</p>
                  <p className="text-sm text-green-600 mt-1">96% of expected revenue</p>
                </Card>
                <Card className="p-5 border-l-4 border-l-coral-500">
                  <h4 className="text-sm font-medium text-text-secondary">Outstanding Dues</h4>
                  <p className="text-3xl font-bold text-text-primary mt-2">₹21,000</p>
                  <p className="text-sm text-coral-600 mt-1">12 defaulters this month</p>
                </Card>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-text-primary mb-3">Recent Invoices</h4>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-surface-subtle rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-text-tertiary" />
                        <div>
                          <p className="font-medium text-sm text-text-primary">INV-2023-09-{100+i}</p>
                          <p className="text-xs text-text-secondary">Tower 1, Apt {i}A</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-text-primary">₹3,500.00</span>
                        {i === 1 ? <Badge variant="success">Paid</Badge> : <Badge variant="warning">Pending</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div>
                  <h3 className="font-semibold text-text-primary">Service Provider Work Orders</h3>
                  <p className="text-xs text-text-secondary">Society member hire requests, premises visit instructions & work orders</p>
                </div>
                <Button variant="outline" onClick={fetchBookings} className="text-xs">
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loadingBookings ? 'animate-spin' : ''}`} />
                  Refresh Bookings
                </Button>
              </div>

              {loadingBookings && (
                <div className="py-12 text-center text-text-secondary">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-500" />
                  <p className="text-xs">Loading bookings from database...</p>
                </div>
              )}

              {!loadingBookings && bookings.length === 0 && (
                <div className="py-12 text-center bg-surface-subtle/50 rounded-xl p-6">
                  <CheckCircle className="w-10 h-10 text-brand-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-text-primary">No Service Bookings Yet</p>
                  <p className="text-xs text-text-secondary mt-1">When residents hire service providers on the Services page, work orders will appear here.</p>
                </div>
              )}

              {!loadingBookings && bookings.map((b) => (
                <div key={b.id} className="p-4 bg-surface rounded-2xl border border-border-hairline shadow-sm hover:shadow-card transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border-hairline">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-sm">
                        {b.providerName ? b.providerName.slice(0, 2).toUpperCase() : 'SP'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-text-primary">{b.providerName}</h4>
                          <span className="px-2 py-0.5 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 text-[10px] font-semibold rounded-md border border-brand-200 dark:border-brand-800">
                            {b.providerCategory}
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                            {b.status || 'CONFIRMED'}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary flex items-center gap-2 mt-0.5">
                          <span>📧 {b.providerEmail}</span>
                          <span>•</span>
                          <span>📞 {b.providerPhone}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-text-primary block">
                        📅 {b.date} at {b.time}
                      </span>
                      <span className="text-[11px] text-text-tertiary">
                        Rate: {b.rate}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 text-xs">
                    <div className="p-3 bg-surface-subtle rounded-xl space-y-1">
                      <span className="text-text-tertiary block font-semibold text-[11px]">SOCIETY DESTINATION:</span>
                      <p className="font-semibold text-text-primary flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                        {b.unitAddress}, {b.societyName}
                      </p>
                      <p className="text-text-secondary text-[11px]">
                        Resident Member: <strong>{b.residentName}</strong> ({b.residentPhone})
                      </p>
                    </div>

                    <div className="p-3 bg-surface-subtle rounded-xl space-y-1">
                      <span className="text-text-tertiary block font-semibold text-[11px]">SERVICE REQUIRED:</span>
                      <p className="text-text-primary font-medium leading-relaxed">
                        {b.serviceRequired}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </RoleGuard>
  );
}
