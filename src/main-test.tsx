// Minimal test to see if React can render anything at all
import ReactDOM from 'react-dom/client';

function MinimalApp(): JSX.Element {
	return (
		<div
			style={{
				backgroundColor: 'red',
				color: 'white',
				padding: '50px',
				fontSize: '30px',
				fontWeight: 'bold'
			}}>
			MINIMAL TEST - IF YOU SEE THIS, REACT WORKS!
		</div>
	);
}

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(<MinimalApp />);
