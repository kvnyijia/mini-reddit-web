import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/react'

import theme from '../theme'
import { AppProps } from 'next/app'
import { Provider, Client, cacheExchange, fetchExchange, ssrExchange } from 'urql';

const ssrCache = ssrExchange({ isClient: true, initialState: undefined, });

const client = new Client({
  url: 'http://localhost:4000/graphql',
  exchanges: [cacheExchange, ssrCache, fetchExchange ],
  fetchOptions: () => {
    const token = "hellooooooooooooo";
    return {
      credentials: "include",
      url: 'http://localhost:4000/graphql',
      "Access-Control-Allow-Credentials": true, 
      origin: "http://localhost:3000/",
      headers: { credentials: "include", authorization: !!token ? `Bearer ${token}` : "" },
      // credentials: "include",
      // headers: { "Access-Control-Allow-Credentials": true, "Access-Control-Allow-Origin": "http://localhost:3000/" },
      // headers: {cookie: ctx && ctx.req ? ctx.req.headers.cookie : document.cookie,},
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
