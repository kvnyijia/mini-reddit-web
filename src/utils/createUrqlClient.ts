import { cacheExchange } from '@urql/exchange-graphcache';
import { fetchExchange, Exchange } from 'urql';
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';
import { betterUpdateQuery } from "./betterUpdateQuery";
import { pipe, tap } from 'wonka';
// import { useRouter } from 'next/router';
import Router from 'next/router';
import { NOT_LOGIN_ERROR_MSG } from "../constants";

// Handle errors at a global level
const errorExchange: Exchange = ({ forward }) => ops$ => {
  // const router = useRouter();   
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      console.log(error);
      if (error?.message.includes(NOT_LOGIN_ERROR_MSG)) {
        // router.replace("/login");
        Router.replace("/login");
      }
    })
  );
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  exchanges: [
    cacheExchange({
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
    }), 
    errorExchange,
    ssrExchange,
    fetchExchange 
  ],
  fetchOptions: () => {
    return {
      credentials: 'include' as const,
      headers: { },
      // headers: { credentials: 'include' },
    };
  },
})