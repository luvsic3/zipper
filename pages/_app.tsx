import Head from 'next/head'
import '../styles/globals.css'
import {type AppProps} from 'next/app'

export default function MyApp({Component, pageProps}: AppProps) {
	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
				/>
				<meta name="description" content="Description" />
				<meta name="keywords" content="Keywords" />
				<title>Zipper</title>

				<link rel="manifest" href="/manifest.json" />
				<link
					href="/icons/favicon-16x16.png"
					rel="icon"
					type="image/png"
					sizes="16x16"
				/>
				<link
					href="/icons/favicon-32x32.png"
					rel="icon"
					type="image/png"
					sizes="32x32"
				/>
				<link rel="apple-touch-icon" href="/apple-icon.png"></link>
				<meta name="theme-color" content="#317EFB" />
				<link
					rel="stylesheet"
					href="https://yarnpkg.com/en/package/normalize.css"
				/>
				<script src="//unpkg.com/@stardazed/streams-polyfill/dist/sd-streams-polyfill.min.js"></script>
			</Head>
			<Component {...pageProps} />
		</>
	)
}
