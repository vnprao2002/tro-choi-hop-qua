import type { Metadata } from 'next'
import { Geist, Geist_Mono, Lexend, Potta_One, Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const lexend = Lexend({ 
  subsets: ["latin"],
  variable: '--font-lexend',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});
const pottaOne = Potta_One({ 
  subsets: ["latin"],
  variable: '--font-potta-one',
  weight: '400'
});
const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: '--font-montserrat',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic']
});

export const metadata: Metadata = {
  title: 'Trò Chơi Mở Hộp Quà',
  description: 'Trò chơi giúp các bé nhận diện chữ cái tiếng Việt qua việc mở hộp quà thú vị',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${lexend.variable} ${pottaOne.variable} ${montserrat.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
