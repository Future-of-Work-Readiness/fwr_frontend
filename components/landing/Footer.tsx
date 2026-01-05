'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const footerLinks = {
	product: [
		{ name: 'Features', href: '#features' },
		{ name: 'Industries', href: '#industries' }
	],
	company: [
		{ name: 'About', href: '#about' },
		// { name: "Careers", href: "#" },
		{ name: 'Contact', href: '#' }
	],
	legal: [
		{ name: 'Privacy Policy', href: '/privacy' },
		{ name: 'Terms of Service', href: '/terms' }
	]
};

const Footer = () => {
	return (
		<footer className='bg-navy-dark text-white relative overflow-hidden'>
			{/* Top accent line */}
			<div className='h-px bg-gradient-to-r from-transparent via-accent to-transparent' />

			<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20'>
				<div className='grid grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12'>
					{/* Brand column */}
					<div className='col-span-2 lg:col-span-4'>
						<a href='/' className='inline-flex items-center gap-3 mb-6 group'>
							<Image
								src='/assets/RAI-Logo2-nobg.png'
								alt='ReadinessAI Logo'
								width={36}
								height={36}
								className='group-hover:scale-110 transition-transform'
							/>
							<span className='font-display font-bold text-xl group-hover:text-accent transition-colors'>
								ReadinessAI
							</span>
						</a>
						<p className='text-white/50 text-sm leading-relaxed mb-6 max-w-xs'>
							Empowering professionals to thrive in the evolving world of work
							through personalised assessments and skill development.
						</p>
						{/* Social links */}
						<div className='flex gap-3'>
							{[
								{ name: 'LinkedIn', initial: 'Li', href: 'https://www.linkedin.com/company/readinessai/' }
								// { name: 'Twitter', initial: 'X' },
								// { name: 'GitHub', initial: 'Gh' },
							].map((social) => (
								<a
									key={social.name}
									href={social.href}
									className='w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent transition-all group'
									aria-label={social.name}>
									<span className='text-xs font-bold text-white/60 group-hover:text-white'>
										{social.initial}
									</span>
								</a>
							))}
						</div>
					</div>

					{/* Links columns */}
					<div className='lg:col-span-2'>
						<h4 className='font-display font-semibold text-white mb-5'>
							Product
						</h4>
						<ul className='space-y-3'>
							{footerLinks.product.map((link) => (
								<li key={link.name}>
									<a
										href={link.href}
										className='group inline-flex items-center gap-1 text-white/50 hover:text-white text-sm transition-colors'>
										{link.name}
										<ArrowUpRight className='w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all' />
									</a>
								</li>
							))}
						</ul>
					</div>

					<div className='lg:col-span-2'>
						<h4 className='font-display font-semibold text-white mb-5'>
							Company
						</h4>
						<ul className='space-y-3'>
							{footerLinks.company.map((link) => (
								<li key={link.name}>
									<a
										href={link.href}
										className='group inline-flex items-center gap-1 text-white/50 hover:text-white text-sm transition-colors'>
										{link.name}
										<ArrowUpRight className='w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all' />
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className='mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4'>
					<p className='text-white/40 text-sm'>
						© {new Date().getFullYear()} ReadinessAI. All rights reserved.
					</p>
					<div className='flex gap-6'>
						{footerLinks.legal.map((link) => (
							<Link
								key={link.name}
								href={link.href}
								className='text-white/40 hover:text-white text-sm transition-colors'>
								{link.name}
							</Link>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
