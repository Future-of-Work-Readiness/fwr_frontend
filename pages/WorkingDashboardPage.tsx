import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../src/types';
import { API_BASE_URL } from '../utils/api';

interface RecentAttempt {
	id: string | number;
	quiz_id: string | number;
	score: number;
	passed: boolean;
	completed_at?: string;
}

interface DashboardData {
	readiness: {
		overall: number;
		technical: number;
		soft: number;
		leadership?: number;
	};
	recent_attempts?: RecentAttempt[];
	[key: string]: unknown;
}

export default function WorkingDashboardPage(): JSX.Element {
	const navigate = useNavigate();
	const [user, setUser] = useState<User | null>(null);
	const [dashboard, setDashboard] = useState<DashboardData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Check if user is logged in
		const userData = localStorage.getItem('currentUser');
		if (!userData) {
			navigate('/');
			return;
		}
		const parsed = JSON.parse(userData);
		setUser(parsed);

		const fetchDashboard = async (isRefresh = false) => {
			if (isRefresh) {
				setRefreshing(true);
			} else {
				setLoading(true);
			}
			setError(null);
			try {
				const res = await fetch(
					`${API_BASE_URL}/dashboard?user_id=${parsed.id}`
				);
				if (!res.ok) {
					const t = await res.text();
					throw new Error(`Dashboard error ${res.status}: ${t}`);
				}
				const data = await res.json();
				setDashboard(data);
				// Mirror key readiness fields to local currentUser for consistency elsewhere
				try {
					const updated = { ...parsed };
					updated.readiness_score = Math.round(data.readiness.overall);
					updated.technical_score = Math.round(data.readiness.technical);
					updated.soft_skills_score = Math.round(data.readiness.soft);
					localStorage.setItem('currentUser', JSON.stringify(updated));
					setUser(updated);
				} catch {}
			} catch (e) {
				const err = e instanceof Error ? e : new Error('Unknown error');
				setError(err.message || 'Failed to load dashboard');
			} finally {
				setLoading(false);
				setRefreshing(false);
			}
		};

		// Initial load
		fetchDashboard();

		// Periodic refresh every 30 seconds
		const intervalId = setInterval(() => {
			fetchDashboard(true);
		}, 30000);

		// Refresh on window focus
		const onFocus = () => fetchDashboard(true);
		window.addEventListener('focus', onFocus);

		// Cleanup
		return () => {
			clearInterval(intervalId);
			window.removeEventListener('focus', onFocus);
		};
	}, [navigate]);

	const handleRefresh = () => {
		const userData = localStorage.getItem('currentUser');
		if (userData) {
			const parsed = JSON.parse(userData);
			const fetchDashboard = async () => {
				setRefreshing(true);
				setError(null);
				try {
					const res = await fetch(
						`${API_BASE_URL}/dashboard?user_id=${parsed.id}`
					);
					if (!res.ok) {
						const t = await res.text();
						throw new Error(`Dashboard error ${res.status}: ${t}`);
					}
					const data = await res.json();
					setDashboard(data);
					try {
						const updated = { ...parsed };
						updated.readiness_score = Math.round(data.readiness.overall);
						updated.technical_score = Math.round(data.readiness.technical);
						updated.soft_skills_score = Math.round(data.readiness.soft);
						localStorage.setItem('currentUser', JSON.stringify(updated));
						setUser(updated);
					} catch {}
				} catch (e) {
					const errorMessage =
						e instanceof Error ? e.message : 'Failed to load dashboard';
					setError(errorMessage);
				} finally {
					setRefreshing(false);
				}
			};
			fetchDashboard();
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('currentUser');
		localStorage.removeItem('token');
		navigate('/');
	};

	const handleStartTest = (testType: string) => {
		navigate('/test-hub');
	};

	if (!user) {
		return (
			<div
				style={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}>
				<div>Loading...</div>
			</div>
		);
	}

	return (
		<div
			style={{
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				fontFamily: 'system-ui, -apple-system, sans-serif'
			}}>
			<style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
			{/* Header */}
			<header
				style={{
					backgroundColor: 'rgba(255, 255, 255, 0.95)',
					backdropFilter: 'blur(10px)',
					borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
					padding: '1rem 2rem',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
				}}>
				<div>
					<h1
						style={{
							margin: 0,
							fontSize: '1.75rem',
							fontWeight: '800',
							background: 'linear-gradient(135deg, #667eea, #764ba2)',
							backgroundClip: 'text',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent'
						}}>
						🚀 Future Ready Dashboard
					</h1>
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '0.5rem',
							padding: '0.5rem 1rem',
							backgroundColor: 'rgba(102, 126, 234, 0.1)',
							borderRadius: '25px',
							border: '1px solid rgba(102, 126, 234, 0.2)'
						}}>
						<span style={{ fontSize: '1.5rem' }}>👤</span>
						<span
							style={{
								color: '#1f2937',
								fontWeight: '600'
							}}>
							{user.name}
						</span>
					</div>
					<button
						onClick={handleRefresh}
						disabled={refreshing}
						style={{
							padding: '0.75rem 1.5rem',
							backgroundColor: refreshing ? '#9ca3af' : '#3b82f6',
							color: 'white',
							border: 'none',
							borderRadius: '15px',
							cursor: refreshing ? 'not-allowed' : 'pointer',
							fontWeight: '600',
							transition: 'all 0.3s',
							boxShadow: refreshing
								? 'none'
								: '0 4px 15px rgba(59, 130, 246, 0.3)',
							display: 'flex',
							alignItems: 'center',
							gap: '0.5rem'
						}}
						onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
							if (!refreshing) {
								e.currentTarget.style.backgroundColor = '#2563eb';
								e.currentTarget.style.transform = 'translateY(-2px)';
							}
						}}
						onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
							if (!refreshing) {
								e.currentTarget.style.backgroundColor = '#3b82f6';
								e.currentTarget.style.transform = 'translateY(0)';
							}
						}}>
						{refreshing ? (
							<>
								<span
									style={{
										display: 'inline-block',
										animation: 'spin 1s linear infinite',
										fontSize: '1rem'
									}}>
									🔄
								</span>
								<span>Refreshing...</span>
							</>
						) : (
							<>
								<span>🔄</span>
								<span>Refresh</span>
							</>
						)}
					</button>
					<button
						onClick={handleLogout}
						style={{
							padding: '0.75rem 1.5rem',
							backgroundColor: '#ef4444',
							color: 'white',
							border: 'none',
							borderRadius: '15px',
							cursor: 'pointer',
							fontWeight: '600',
							transition: 'all 0.3s',
							boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
						}}
						onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
							e.currentTarget.style.backgroundColor = '#dc2626';
							e.currentTarget.style.transform = 'translateY(-2px)';
						}}
						onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
							e.currentTarget.style.backgroundColor = '#ef4444';
							e.currentTarget.style.transform = 'translateY(0)';
						}}>
						🚪 Logout
					</button>
				</div>
			</header>

			<div style={{ padding: '2rem' }}>
				<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
					{/* Welcome Section */}
					<div
						style={{
							backgroundColor: 'rgba(255, 255, 255, 0.95)',
							backdropFilter: 'blur(10px)',
							padding: '3rem',
							borderRadius: '25px',
							marginBottom: '3rem',
							boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
							border: '1px solid rgba(255, 255, 255, 0.2)'
						}}>
						<div style={{ textAlign: 'center', marginBottom: '2rem' }}>
							<h2
								style={{
									fontSize: 'clamp(2rem, 4vw, 3rem)',
									fontWeight: '800',
									marginBottom: '1rem',
									background: 'linear-gradient(135deg, #667eea, #764ba2)',
									backgroundClip: 'text',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent'
								}}>
								Welcome back, {user.name}! 👋
							</h2>
							<p
								style={{
									fontSize: '1.25rem',
									color: '#6b7280',
									marginBottom: '2rem',
									maxWidth: '600px',
									margin: '0 auto'
								}}>
								Ready to continue your professional development journey? Let's
								assess your skills and build your future readiness.
							</p>
						</div>

						{/* Quick Stats */}
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
								gap: '2rem'
							}}>
							{(() => {
								const readiness = dashboard?.readiness;
								const items = [
									{
										icon: '📚',
										label: 'Readiness Score',
										value: readiness
											? Math.round(readiness.overall)
											: user.readiness_score || 'N/A',
										color: '#3b82f6',
										bg: '#eff6ff'
									},
									{
										icon: '⚡',
										label: 'Technical Skills',
										value: readiness
											? Math.round(readiness.technical)
											: user.technical_score || 'N/A',
										color: '#10b981',
										bg: '#f0fdf4'
									},
									{
										icon: '🤝',
										label: 'Soft Skills',
										value: readiness
											? Math.round(readiness.soft)
											: user.soft_skills_score || 'N/A',
										color: '#f59e0b',
										bg: '#fef3c7'
									},
									{
										icon: '👑',
										label: 'Leadership',
										value: user.leadership_score || 'N/A',
										color: '#ec4899',
										bg: '#fce7f3'
									}
								];
								return items;
							})().map((stat, index) => (
								<div
									key={index}
									style={{
										backgroundColor: stat.bg,
										padding: '2rem',
										borderRadius: '20px',
										textAlign: 'center',
										border: `2px solid ${stat.color}20`,
										transition: 'all 0.3s',
										cursor: 'pointer'
									}}
									onMouseOver={(e) => {
										e.currentTarget.style.transform = 'translateY(-5px)';
										e.currentTarget.style.boxShadow = `0 15px 40px ${stat.color}30`;
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.transform = 'translateY(0)';
										e.currentTarget.style.boxShadow = 'none';
									}}>
									<div
										style={{
											fontSize: '3rem',
											marginBottom: '1rem',
											filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
										}}>
										{stat.icon}
									</div>
									<div
										style={{
											fontWeight: '600',
											color: '#1f2937',
											fontSize: '1.125rem',
											marginBottom: '0.5rem'
										}}>
										{stat.label}
									</div>
									<div
										style={{
											fontSize: '2.5rem',
											fontWeight: 'bold',
											color: stat.color
										}}>
										{stat.value}
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Quick Actions */}
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
							gap: '1.5rem',
							marginBottom: '1.5rem'
						}}>
						<div
							style={{
								backgroundColor: 'white',
								padding: '2rem',
								borderRadius: '8px',
								boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
								cursor: 'pointer',
								transition: 'all 0.3s'
							}}
							onClick={() => navigate('/goals')}
							onMouseOver={(e) => {
								e.currentTarget.style.transform = 'translateY(-5px)';
								e.currentTarget.style.boxShadow =
									'0 10px 25px rgba(0,0,0,0.15)';
							}}
							onMouseOut={(e) => {
								e.currentTarget.style.transform = 'translateY(0)';
								e.currentTarget.style.boxShadow =
									'0 1px 3px rgba(0, 0, 0, 0.1)';
							}}>
							<div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
							<h3
								style={{
									fontSize: '1.5rem',
									fontWeight: 'bold',
									marginBottom: '1rem',
									color: '#1f2937'
								}}>
								Goals & Reflection
							</h3>
							<p
								style={{
									color: '#6b7280',
									marginBottom: '1.5rem',
									lineHeight: '1.6'
								}}>
								Set goals, track your progress, and reflect on your learning
								journey.
							</p>
							<button
								onClick={(e) => {
									e.stopPropagation();
									navigate('/goals');
								}}
								style={{
									width: '100%',
									padding: '0.75rem 1.5rem',
									backgroundColor: '#8b5cf6',
									color: 'white',
									border: 'none',
									borderRadius: '6px',
									cursor: 'pointer',
									fontWeight: '600'
								}}>
								📝 View Goals
							</button>
						</div>
					</div>

					{/* Assessment Options */}
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
							gap: '1.5rem'
						}}>
						{/* Skills Assessment */}
						<div
							style={{
								backgroundColor: 'white',
								padding: '2rem',
								borderRadius: '8px',
								boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
							}}>
							<div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
							<h3
								style={{
									fontSize: '1.5rem',
									fontWeight: 'bold',
									marginBottom: '1rem',
									color: '#1f2937'
								}}>
								Skills Assessment
							</h3>
							<p
								style={{
									color: '#6b7280',
									marginBottom: '1.5rem',
									lineHeight: '1.6'
								}}>
								Evaluate your current technical and professional skills to
								identify strengths and areas for improvement.
							</p>
							<button
								onClick={() => handleStartTest('skills')}
								style={{
									width: '100%',
									padding: '0.75rem 1.5rem',
									backgroundColor: '#3b82f6',
									color: 'white',
									border: 'none',
									borderRadius: '6px',
									cursor: 'pointer',
									fontWeight: '600'
								}}>
								🚀 Start Assessment
							</button>
						</div>

						{/* Career Readiness */}
						<div
							style={{
								backgroundColor: 'white',
								padding: '2rem',
								borderRadius: '8px',
								boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
							}}>
							<div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
							<h3
								style={{
									fontSize: '1.5rem',
									fontWeight: 'bold',
									marginBottom: '1rem',
									color: '#1f2937'
								}}>
								Career Readiness
							</h3>
							<p
								style={{
									color: '#6b7280',
									marginBottom: '1.5rem',
									lineHeight: '1.6'
								}}>
								Assess your readiness for future career opportunities and
								identify key development areas.
							</p>
							<button
								onClick={() => handleStartTest('career')}
								style={{
									width: '100%',
									padding: '0.75rem 1.5rem',
									backgroundColor: '#10b981',
									color: 'white',
									border: 'none',
									borderRadius: '6px',
									cursor: 'pointer',
									fontWeight: '600'
								}}>
								📊 Start Assessment
							</button>
						</div>

						{/* Industry Insights */}
						<div
							style={{
								backgroundColor: 'white',
								padding: '2rem',
								borderRadius: '8px',
								boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
							}}>
							<div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
							<h3
								style={{
									fontSize: '1.5rem',
									fontWeight: 'bold',
									marginBottom: '1rem',
									color: '#1f2937'
								}}>
								Industry Insights
							</h3>
							<p
								style={{
									color: '#6b7280',
									marginBottom: '1.5rem',
									lineHeight: '1.6'
								}}>
								Explore trends and requirements in your industry to stay ahead
								of the curve.
							</p>
							<button
								onClick={() => handleStartTest('industry')}
								style={{
									width: '100%',
									padding: '0.75rem 1.5rem',
									backgroundColor: '#f59e0b',
									color: 'white',
									border: 'none',
									borderRadius: '6px',
									cursor: 'pointer',
									fontWeight: '600'
								}}>
								💡 Explore Insights
							</button>
						</div>
					</div>

					{/* Recent Activity */}
					<div
						style={{
							backgroundColor: 'white',
							padding: '2rem',
							borderRadius: '8px',
							boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
							marginTop: '2rem'
						}}>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: '1.5rem'
							}}>
							<h3
								style={{
									fontSize: '1.5rem',
									fontWeight: 'bold',
									color: '#1f2937',
									margin: 0
								}}>
								📋 Recent Activity
							</h3>
							{refreshing && (
								<span
									style={{
										fontSize: '0.875rem',
										color: '#6b7280',
										display: 'flex',
										alignItems: 'center',
										gap: '0.5rem'
									}}>
									<span
										style={{
											display: 'inline-block',
											animation: 'spin 1s linear infinite',
											fontSize: '0.875rem'
										}}>
										🔄
									</span>
									Updating...
								</span>
							)}
						</div>
						{loading && (
							<div
								style={{
									padding: '2rem',
									textAlign: 'center',
									color: '#6b7280'
								}}>
								Loading dashboard…
							</div>
						)}
						{!loading && error && (
							<div
								style={{
									padding: '1rem',
									color: '#b91c1c',
									background: '#fee2e2',
									border: '1px solid #fecaca',
									borderRadius: '8px'
								}}>
								{error}
							</div>
						)}
						{!loading &&
							!error &&
							(() => {
								const items: RecentAttempt[] = (dashboard?.recent_attempts ||
									[]) as RecentAttempt[];
								if (!items || items.length === 0) {
									return (
										<div
											style={{
												padding: '2rem',
												textAlign: 'center',
												color: '#6b7280'
											}}>
											<div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
												📊
											</div>
											<p>
												No recent assessments found. Start your first assessment
												to see your progress here!
											</p>
										</div>
									);
								}
								return (
									<div
										style={{
											display: 'grid',
											gridTemplateColumns: '1fr',
											gap: '0.75rem'
										}}>
										{items.map((it: RecentAttempt) => (
											<div
												key={it.id}
												style={{
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
													padding: '0.75rem 1rem',
													border: '1px solid #e5e7eb',
													borderRadius: '8px',
													backgroundColor: '#fafafa'
												}}>
												<div style={{ color: '#374151', fontWeight: 600 }}>
													Quiz: {String(it.quiz_id)}
												</div>
												<div
													style={{
														color: it.passed ? '#059669' : '#dc2626',
														fontWeight: 700
													}}>
													{Math.round(it.score)}%
												</div>
												<div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
													{it.completed_at
														? new Date(it.completed_at).toLocaleString()
														: ''}
												</div>
											</div>
										))}
									</div>
								);
							})()}
					</div>
				</div>
			</div>
		</div>
	);
}
