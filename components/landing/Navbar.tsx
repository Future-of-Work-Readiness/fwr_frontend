'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/components/providers';
import { useLogout } from '@/hooks/api';

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const { isAuthenticated, user, isLoading, isFetching } = useAuth();
	const logoutMutation = useLogout();

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 50);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const handleLogout = () => {
		logoutMutation.mutate();
		setIsOpen(false);
	};

	// Determine if user is fully logged in (not just cached data)
	const isLoggedIn = isAuthenticated && !isLoading && !isFetching && !!user;

	const navLinks = [
		{ name: 'About', href: '#about' },
		{ name: 'Industries', href: '#industries' },
		{ name: 'Features', href: '#features' }
	];

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-navy-dark/95 backdrop-blur-lg shadow-lg md:shadow-none md:backdrop-blur-none ${
				scrolled
					? 'md:bg-navy-dark/95 md:backdrop-blur-lg md:shadow-lg'
					: 'md:bg-transparent'
			}`}>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-20'>
					{/* Logo */}
					<Link href='/' className='flex items-center group'>
						<div className='flex items-center gap-3'>
							<Image
								src='/assets/RAI-Logo2-nobg.png'
								alt='ReadinessAI Logo'
								width={44}
								height={44}
								className='group-hover:scale-110 transition-transform'
							/>
							<span className='font-display font-bold text-xl text-white leading-tight group-hover:text-accent transition-colors duration-300'>
								ReadinessAI
							</span>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<div className='hidden md:flex items-center gap-1'>
						{navLinks.map((link) => (
							<a
								key={link.name}
								href={link.href}
								className='relative px-4 py-2 text-white/70 hover:text-white font-medium transition-colors group'>
								{link.name}
								<span className='absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent group-hover:w-1/2 transition-all duration-300' />
							</a>
						))}
					</div>

					{/* CTA Buttons */}
					<div className='hidden md:flex items-center gap-3'>
						{isLoggedIn ? (
							<>
								<Button
									asChild
									variant='hero'
									size='sm'
									className='shadow-glow'>
									<Link href='/dashboard'>
										<LayoutDashboard className='w-4 h-4 mr-2' />
										Dashboard
									</Link>
								</Button>
								<Button
									variant='hero'
									size='sm'
									onClick={handleLogout}
									disabled={logoutMutation.isPending}
									className='bg-white/10 hover:bg-white/20 border border-white/20'>
									<LogOut className='w-4 h-4 mr-2' />
									{logoutMutation.isPending ? 'Logging out...' : 'Logout'}
								</Button>
							</>
						) : (
							<>
								<Button
									asChild
									variant='hero'
									size='sm'
									className='bg-white text-black hover:bg-white/90 shadow-glow'>
									<Link href='/auth?tab=login'>Login</Link>
								</Button>
								<Button asChild variant='hero' size='sm' className='shadow-glow'>
									<Link href='/auth?tab=signup'>Sign Up</Link>
								</Button>
							</>
						)}
					</div>

					{/* Mobile Menu Button */}
					<button
						className='md:hidden relative w-10 h-10 flex items-center justify-center text-white'
						onClick={() => setIsOpen(!isOpen)}>
						<span
							className={`absolute transition-all duration-300 ${
								isOpen ? 'rotate-45 opacity-0' : 'rotate-0 opacity-100'
							}`}>
							<Menu className='w-6 h-6' />
						</span>
						<span
							className={`absolute transition-all duration-300 ${
								isOpen ? 'rotate-0 opacity-100' : '-rotate-45 opacity-0'
							}`}>
							<X className='w-6 h-6' />
						</span>
					</button>
				</div>

				{/* Mobile Navigation */}
				<div
					className={`md:hidden overflow-hidden transition-all duration-300 ${
						isOpen ? 'max-h-96 pb-6' : 'max-h-0'
					}`}>
					<div className='flex flex-col gap-2 pt-4 border-t border-white/10'>
						{navLinks.map((link) => (
							<a
								key={link.name}
								href={link.href}
								className='px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 font-medium transition-colors rounded-xl'
								onClick={() => setIsOpen(false)}>
								{link.name}
							</a>
						))}
						<div className='flex flex-col gap-2 mt-4 px-4'>
							{isLoggedIn ? (
								<>
									<Button asChild variant='hero' className='w-full'>
										<Link href='/dashboard' onClick={() => setIsOpen(false)}>
											<LayoutDashboard className='w-4 h-4 mr-2' />
											Go to Dashboard
										</Link>
									</Button>
									<Button 
										variant='hero' 
										className='w-full bg-white/10 hover:bg-white/20 border border-white/20'
										onClick={handleLogout}
										disabled={logoutMutation.isPending}>
										<LogOut className='w-4 h-4 mr-2' />
										{logoutMutation.isPending ? 'Logging out...' : 'Logout'}
									</Button>
								</>
							) : (
								<>
									<Button asChild variant='hero' className='w-full'>
										<Link href='/auth?tab=login'>Login</Link>
									</Button>
									<Button asChild variant='hero' className='w-full'>
										<Link href='/auth?tab=signup'>Sign Up</Link>
									</Button>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
