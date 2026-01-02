"use client";

import { ArrowUpRight } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Industries", href: "#industries" },
    { name: "Pricing", href: "#" },
    { name: "FAQ", href: "#" },
  ],
  company: [
    { name: "About", href: "#about" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
  ],
  resources: [
    { name: "Documentation", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "API Reference", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-navy-dark text-white relative overflow-hidden">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-4">
            <a href="/" className="inline-flex items-center mb-6 group">
              <span className="font-display font-bold text-xl group-hover:text-accent transition-colors">ReadinessAI</span>
            </a>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Empowering professionals to thrive in the evolving world of work through 
              personalised assessments and skill development.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { name: 'LinkedIn', initial: 'Li' },
                { name: 'Twitter', initial: 'X' },
                { name: 'GitHub', initial: 'Gh' },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent transition-all group"
                  aria-label={social.name}
                >
                  <span className="text-xs font-bold text-white/60 group-hover:text-white">{social.initial}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-2">
            <h4 className="font-display font-semibold text-white mb-5">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="group inline-flex items-center gap-1 text-white/50 hover:text-white text-sm transition-colors">
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display font-semibold text-white mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="group inline-flex items-center gap-1 text-white/50 hover:text-white text-sm transition-colors">
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display font-semibold text-white mb-5">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="group inline-flex items-center gap-1 text-white/50 hover:text-white text-sm transition-colors">
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter mini form */}
          <div className="col-span-2 lg:col-span-2">
            <h4 className="font-display font-semibold text-white mb-5">Stay Updated</h4>
            <p className="text-white/50 text-sm mb-4">Get the latest insights on future of work.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email" 
                className="flex-1 h-10 px-3 rounded-l-lg bg-white/5 border border-white/10 border-r-0 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-accent"
              />
              <button className="px-4 h-10 rounded-r-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} ReadinessAI. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((link) => (
              <a key={link} href="#" className="text-white/40 hover:text-white text-sm transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

