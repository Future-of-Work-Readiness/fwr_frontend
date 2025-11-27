export default function TestPage(): JSX.Element {
	return (
		<div className='min-h-screen bg-blue-100 flex items-center justify-center'>
			<div className='bg-white p-8 rounded-lg shadow-lg'>
				<h1 className='text-2xl font-bold text-gray-800'>Test Page Working!</h1>
				<p className='text-gray-600 mt-2'>
					If you can see this, routing is working.
				</p>
			</div>
		</div>
	);
}
