import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { APP_CONFIG } from '@/config/app';

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'For Businesses', href: '#' },
    { name: 'Download App', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Press', href: '#' },
  ],
  resources: [
    { name: 'Help Center', href: '#' },
    { name: 'Community Guidelines', href: '#' },
    { name: 'Developers', href: '#' },
    { name: 'System Status', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'GDPR Compliance', href: '#' },
  ]
};

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-12 md:py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1 pr-8">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-brand-500/20 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-brand-500" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                {APP_CONFIG?.name || 'NeighbourHub'}
              </span>
            </Link>
            <p className="text-sm mb-6 leading-relaxed">
              Bringing communities together. Connect, share, and thrive in your neighborhood.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map(l => (
                <li key={l.name}><Link href={l.href} className="text-sm hover:text-white transition-colors">{l.name}</Link></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map(l => (
                <li key={l.name}><Link href={l.href} className="text-sm hover:text-white transition-colors">{l.name}</Link></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map(l => (
                <li key={l.name}><Link href={l.href} className="text-sm hover:text-white transition-colors">{l.name}</Link></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map(l => (
                <li key={l.name}><Link href={l.href} className="text-sm hover:text-white transition-colors">{l.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">© {new Date().getFullYear()} {APP_CONFIG?.name || 'NeighbourHub'}. All rights reserved.</p>
          <p className="text-sm flex items-center gap-1">
            Made with <span className="text-red-500">❤️</span> for communities
          </p>
        </div>
      </div>
    </footer>
  );
}
