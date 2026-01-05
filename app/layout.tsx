import type { Metadata } from 'next';
import { Poppins, Inter, Space_Mono, Lora } from 'next/font/google';
import { QueryProvider } from '@/lib/query';
import { AuthProvider, CareerProvider } from '@/components/providers';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Toaster } from 'sonner';
import './globals.css';

const poppins = Poppins({
	variable: '--font-display',
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700', '800']
});

const inter = Inter({
	variable: '--font-sans',
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700']
});

const spaceMono = Space_Mono({
	variable: '--font-mono',
	subsets: ['latin'],
	weight: ['400', '700']
});

const lora = Lora({
	variable: '--font-serif',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
	title: 'ReadinessAI',
	description:
		'Prepare for the future with AI-powered career readiness assessments',
	icons: {
		icon: [{ url: '/assets/RAI-Logo2-nobg.png', type: 'image/png' }],
		apple: [{ url: '/assets/RAI-Logo2.png', type: 'image/png' }],
		shortcut: '/assets/RAI-Logo2-nobg.png'
	}
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${poppins.variable} ${inter.variable} ${spaceMono.variable} ${lora.variable} font-sans antialiased`}>
				<ErrorBoundary>
					<QueryProvider>
						<AuthProvider>
							<CareerProvider>
								{children}
								<Toaster richColors position='top-center' />
							</CareerProvider>
						</AuthProvider>
					</QueryProvider>
				</ErrorBoundary>
			</body>
		</html>
	);
}
