import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/react'
import theme from '../theme'
import { AppProps } from 'next/app'
import { Provider, Client, fetchExchange } from 'urql';
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, data => fn(result, data as any) as any)
}

const client = new Client({
  url: 'http://localhost:4000/graphql',
  exchanges: [cacheExchange({
    updates: {
      Mutation: {
        logout: (_result, args, cache, info) => {
          // Make the me query return null now (rather than wide out the cache)
          betterUpdateQuery<LogoutMutation, MeQuery>(
            cache,
            {query: MeDocument},
            _result,
            () => ({me: null})
          );
        },
        login: (_result, args, cache, info) => {
          betterUpdateQuery<LoginMutation, MeQuery>(
            cache,
            {query: MeDocument}, 
            _result, 
            (result, query) => {
              if (result.login.errors) {
                return query;
              } else {
                return {me: result.login.user};
              }
            }
          );
        },

        register: (_result, args, cache, info) => {
          betterUpdateQuery<RegisterMutation, MeQuery>(
            cache,
            {query: MeDocument}, 
            _result, 
            (result, query) => {
              if (result.register.errors) {
                return query;
              } else {
                return {me: result.register.user};
              }
            }
          );
        },
      }
    }
  }), fetchExchange ],
  fetchOptions: () => {
    return {
      credentials: 'include',
      headers: { },
      // headers: { credentials: 'include' },
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
