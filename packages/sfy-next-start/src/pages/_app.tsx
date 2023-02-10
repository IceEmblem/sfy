import '../styles/globals.css'
import type { AppProps } from 'next/app'
require("regenerator-runtime/runtime")

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
