import React from 'react';
export default function SimpleOnboardingPage(): JSX.Element {
	return (
		<div
			style={{
				padding: '20px',
				backgroundColor: '#e8f5e8',
				minHeight: '100vh',
				fontFamily: 'Arial, sans-serif'
			}}>
			<h1 style={{ color: 'green', fontSize: '2rem' }}>
				ONBOARDING PAGE WORKING!
			</h1>
			<p style={{ color: 'darkgreen', fontSize: '1.2rem' }}>
				This is the simplified onboarding page.
			</p>
			<div
				style={{
					marginTop: '20px',
					padding: '10px',
					border: '2px solid green'
				}}>
				<h2>Status:</h2>
				<p>✅ Onboarding route working</p>
				<p>✅ Component rendering</p>
				<p>✅ Styles applied</p>
			</div>
		</div>
	);
}
