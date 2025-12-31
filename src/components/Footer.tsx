import { Zap } from 'lucide-react';

export default function Footer(): JSX.Element {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='bg-white border-t border-gray-200 py-10 md:py-12'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='grid md:grid-cols-4 gap-8 md:gap-12'>
					{/* Brand */}
					<div className='md:col-span-1'>
						<div className='flex items-center space-x-3 mb-4'>
							<div className='w-10 h-10 bg-[#3A7AFE] rounded-lg flex items-center justify-center'>
								<Zap className='w-6 h-6 text-white' />
							</div>
							<span className='text-xl font-bold text-[#1D2433]'>
								ReadinessAi
							</span>
						</div>
						<p className='text-sm text-[#4B5563]'>Test your skills .....</p>
					</div>

					{/* Product */}
					<div>
						<h4 className='font-semibold text-[#1C1C1C] mb-4'>Product</h4>
						<ul className='space-y-2'>
							{/* <li>
								<a
									href='#'
									className='text-sm text-[#4B5563] hover:text-[#3A7AFE] transition-colors duration-200'>
									Features
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-sm text-[#4B5563] hover:text-[#3A7AFE] transition-colors duration-200'>
									About
								</a>
							</li> */}
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h4 className='font-semibold text-[#1C1C1C] mb-4'>Legal</h4>
						<ul className='space-y-2'>
							{/* <li>
								<a
									href='#'
									className='text-sm text-[#4B5563] hover:text-[#3A7AFE] transition-colors duration-200'>
									Privacy Policy
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-sm text-[#4B5563] hover:text-[#3A7AFE] transition-colors duration-200'>
									Terms of Service
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-sm text-[#4B5563] hover:text-[#3A7AFE] transition-colors duration-200'>
									Contact
								</a>
							</li> */}
						</ul>
					</div>

					{/* Support */}
					<div>
						<h4 className='font-semibold text-[#1C1C1C] mb-4'>Support</h4>
						<ul className='space-y-2'>
							{/* <li>
								<a
									href='#'
									className='text-sm text-[#4B5563] hover:text-[#3A7AFE] transition-colors duration-200'>
									Help Center
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-sm text-[#4B5563] hover:text-[#3A7AFE] transition-colors duration-200'>
									Documentation
								</a>
							</li> */}
						</ul>
					</div>
				</div>

				{/* Copyright */}
				<div className='mt-8 md:mt-12 pt-8 border-t border-gray-200'>
					<p className='text-sm text-[#4B5563] text-center'>
						© {currentYear} ReadinessAi. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
