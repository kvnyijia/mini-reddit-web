import { Cache, cacheExchange, Resolver } from '@urql/exchange-graphcache';
import { fetchExchange, Exchange, stringifyVariables } from 'urql';
import { gql } from '@urql/core';
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, PostSnippetFragment, RegisterMutation, VoteMutationVariables } from '../generated/graphql';
import { betterUpdateQuery } from "./betterUpdateQuery";
import { pipe, tap } from 'wonka';
import Router from 'next/router';
import { NOT_LOGIN_ERROR_MSG } from "../constants";
import { isServer } from './isServer';

// Handle errors at a global level
const errorExchange: Exchange = ({ forward }) => ops$ => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes(NOT_LOGIN_ERROR_MSG)) {
        Router.replace("/login");
      }
    })
  );
};

const invalidateAllPosts = (cache: Cache) => {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter(info => info.fieldName === "posts");
  fieldInfos.forEach((fi) => {
    cache.invalidate("Query", "posts", fi.arguments || {});  // If fi possibly be null
  });
  cache.invalidate('Query', 'posts', {
    limit: 10,
  });
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = '';
  if (isServer()) {
    cookie = ctx?.req?.headers?.cookie;
  }

  return ({
    url: 'http://localhost:4000/graphql',
    exchanges: [
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            deletePost: (_result, args, cache, info) => {
              const {id} = args;
              cache.invalidate({
                __typename: "Post", 
                _id: id as number,
              });
            },
            vote: (_result, args, cache, info) => {
              const {postId, value} = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: postId }
              ) as PostSnippetFragment;
              if (data) {
                if (data.voteStatus === value) {
                  return;
                }
                const newPoints = (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
                cache.writeFragment(
                  gql`
                    fragment __ on Post {
                      points
                      voteStatus
                    }
                  `,
                  { id: postId, points: newPoints, voteStatus: value }
                );
              }
            },
            createPost: (_result, args, cache, info) => {
              invalidateAllPosts(cache);
            },
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
              invalidateAllPosts(cache);
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
          }  // Mutation
        }    // updates
      }),    // cacheExchange({})
      errorExchange,
      ssrExchange,
      fetchExchange 
    ],       // exchanges list[]
    fetchOptions: () => {
      return {
        credentials: 'include' as const,
        headers: cookie ? { cookie } : undefined,
        // headers: { credentials: 'include' },
      };
    },
  })   // return object{}
};     // createUrqlClient

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    // console.log("key=", entityKey, "filed=", fieldName);
    const allFields = cache.inspectFields(entityKey);
    // console.log("allFields=", allFields);

    const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    // Check is data is in the cache, and read data from the cache and return them 
    // console.log("fieldArgs=", fieldArgs);
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(cache.resolve(entityKey, fieldKey) as string, "posts");
    // console.log("isItInTheCache=", isItInTheCache);
    info.partial = !isItInTheCache;

    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach(fi => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore") as boolean;
      if (!_hasMore) {
        hasMore = _hasMore;
      }
      // console.log(data);
      results.push(...data);
    });
    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    };
  };
};
