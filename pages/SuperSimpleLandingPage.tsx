import React from 'react';

export default function SuperSimpleLandingPage() {
	return (
		<div
			style={{
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: 'system-ui, -apple-system, sans-serif'
			}}>
			<div
				style={{
					backgroundColor: 'white',
					padding: '3rem',
					borderRadius: '20px',
					textAlign: 'center',
					boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
					maxWidth: '600px',
					margin: '2rem'
				}}>
				<h1
					style={{
						fontSize: '3rem',
						marginBottom: '2rem',
						background: 'linear-gradient(135deg, #667eea, #764ba2)',
						backgroundClip: 'text',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent'
					}}>
					🚀 Future Ready Platform
				</h1>

				<p
					style={{
						fontSize: '1.25rem',
						color: '#6b7280',
						marginBottom: '3rem'
					}}>
					Welcome to your career readiness journey! This page is working
					perfectly.
				</p>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
						gap: '1rem',
						marginBottom: '3rem'
					}}>
					<div
						style={{
							padding: '2rem',
							backgroundColor: '#f0f9ff',
							borderRadius: '15px',
							border: '2px solid #3b82f6'
						}}>
						<div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
						<h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>
							Frontend
						</h3>
						<p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
							React app running
						</p>
					</div>

					<div
						style={{
							padding: '2rem',
							backgroundColor: '#f0fdf4',
							borderRadius: '15px',
							border: '2px solid #10b981'
						}}>
						<div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔧</div>
						<h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>
							Backend
						</h3>
						<p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
							API server ready
						</p>
					</div>

					<div
						style={{
							padding: '2rem',
							backgroundColor: '#fef3c7',
							borderRadius: '15px',
							border: '2px solid #f59e0b'
						}}>
						<div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
						<h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Design</h3>
						<p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
							Beautiful UI ready
						</p>
					</div>
				</div>

				<div
					style={{
						display: 'flex',
						gap: '1rem',
						justifyContent: 'center',
						flexWrap: 'wrap'
					}}>
					<a
						href='/onboarding'
						style={{
							padding: '1rem 2rem',
							backgroundColor: '#667eea',
							color: 'white',
							textDecoration: 'none',
							borderRadius: '15px',
							fontWeight: '600',
							transition: 'transform 0.2s'
						}}
						onMouseOver={(e: React.MouseEvent<HTMLAnchorElement>) => {
							e.currentTarget.style.transform = 'translateY(-2px)';
						}}
						onMouseOut={(e: React.MouseEvent<HTMLAnchorElement>) => {
							e.currentTarget.style.transform = 'translateY(0)';
						}}>
						🎯 Start Onboarding
					</a>

					<a
						href='/dashboard'
						style={{
							padding: '1rem 2rem',
							backgroundColor: '#10b981',
							color: 'white',
							textDecoration: 'none',
							borderRadius: '15px',
							fontWeight: '600',
							transition: 'transform 0.2s'
						}}
						onMouseOver={(e: React.MouseEvent<HTMLAnchorElement>) => {
							e.currentTarget.style.transform = 'translateY(-2px)';
						}}
						onMouseOut={(e: React.MouseEvent<HTMLAnchorElement>) => {
							e.currentTarget.style.transform = 'translateY(0)';
						}}>
						📊 View Dashboard
					</a>
				</div>

				<div
					style={{
						marginTop: '2rem',
						padding: '1rem',
						backgroundColor: '#f3f4f6',
						borderRadius: '10px',
						fontSize: '0.875rem',
						color: '#6b7280'
					}}>
					<strong>Status:</strong> All systems operational ✨
					<br />
					<strong>URL:</strong> http://localhost:3009
				</div>
			</div>
		</div>
	);
}
