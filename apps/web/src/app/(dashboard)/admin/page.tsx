"use client";

import React, { useState } from 'react';
import { Users, Activity, AlertTriangle, ShieldCheck, DollarSign, Send, FileText, CheckCircle, XCircle, Search, Download } from 'lucide-react';
import { Card, Button, Badge, Input, Select, Textarea, Tabs } from '@/components/ui';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('verifications');

  const stats = [
    { label: 'Total Residents', value: '1,240', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Active Daily Users', value: '89%', icon: Activity, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Open Complaints', value: '4', icon: AlertTriangle, color: 'text-coral-500', bg: 'bg-coral-50 dark:bg-coral-900/20' },
    { label: 'Pending Verifications', value: '12', icon: ShieldCheck, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { label: 'Maintenance Collected', value: '₹4,85,000', subtext: '96% of total', icon: DollarSign, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-900/20' },
  ];


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Society Admin Panel</h1>
          <p className="text-text-secondary mt-1">Manage platform operations and community metrics</p>
        </div>
        <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export Full Report</Button>
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
            { id: 'verifications', label: 'Verification Requests' },
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-text-primary">Pending Resident & Business Verifications</h3>
                <Input placeholder="Search requests..." className="w-64" />
              </div>
              
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 border border-border-hairline rounded-lg hover:bg-surface-subtle transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                      {item === 1 ? 'A' : item === 2 ? 'M' : 'S'}
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">
                        {item === 1 ? 'Alice Freeman' : item === 2 ? 'Modern Bakery (Business)' : 'Sam Wilson'}
                      </h4>
                      <p className="text-sm text-text-secondary">
                        {item === 1 ? 'Apt 4B, Tower 2 • Uploaded Lease Agreement' : item === 2 ? 'Shop 12, Commercial Block • Uploaded License' : 'Apt 1C, Tower 1 • Uploaded ID Card'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-text-secondary hover:text-text-primary">View Docs</Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"><CheckCircle className="w-4 h-4 mr-1" /> Approve</Button>
                    <Button size="sm" variant="outline" className="text-coral-600 border-coral-200 hover:bg-coral-50"><XCircle className="w-4 h-4 mr-1" /> Reject</Button>
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
        </div>
      </div>
    </div>
  );
}
