import Head from 'next/head';

import '../styles/globals.css';

import { Lato } from '@next/font/google';
const lato = Lato({ subsets: ['latin'], weight: ['300', '400', '700', '900'] });

import Layout from '../components/layout';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>h-n.me</title>
        <meta name="description" content="h-n.me" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={lato.className}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </main>
    </>
  );
}
