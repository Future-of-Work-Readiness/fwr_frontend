import React from 'react';

function SimpleApp(): JSX.Element {
	return (
		<div
			style={{
				backgroundColor: 'green',
				color: 'white',
				padding: '50px',
				fontSize: '24px'
			}}>
			<h1>Simple App Component Working!</h1>
			<p>This is a basic App component without any imports or routing.</p>
		</div>
	);
}

export default SimpleApp;
