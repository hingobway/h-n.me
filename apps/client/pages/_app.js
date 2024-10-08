import Head from 'next/head';

import '../styles/globals.css';

import { Lato } from 'next/font/google';
const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  display: 'swap',
  variable: '--font-lato',
});

import Layout from '../components/Layout';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>h-n.me</title>
        <meta name="description" content="h-n.me" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${lato.variable} font-sans`}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </main>
    </>
  );
}
