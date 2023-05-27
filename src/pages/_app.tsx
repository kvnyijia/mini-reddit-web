import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/react'

import theme from '../theme'
import { AppProps } from 'next/app'

import { Provider, Client, cacheExchange, fetchExchange } from 'urql';

const client = new Client({
  url: 'http://localhost:4000/graphql',
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    return {
      headers: { credentials: 'include' },
    };
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
        <CSSReset/>
        <Component {...pageProps} />
        </ColorModeProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp
