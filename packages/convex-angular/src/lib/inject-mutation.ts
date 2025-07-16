import { assertInInjectionContext, signal } from '@angular/core';
import { OptimisticUpdate } from 'convex/browser';
import {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType,
} from 'convex/server';

import { injectConvex } from './inject-convex';

export interface MutationOptions<
  Mutation extends FunctionReference<'mutation'>,
> {
  onSuccess?: (data: FunctionReturnType<Mutation>) => void;
  onError?: (err: Error) => void;
  optimisticUpdate?: OptimisticUpdate<FunctionArgs<Mutation>>;
}

export function injectMutation<Mutation extends FunctionReference<'mutation'>>(
  mutation: Mutation,
  options?: MutationOptions<Mutation>,
) {
  assertInInjectionContext(injectMutation);
  const convex = injectConvex();

  const error = signal<Error | undefined>(undefined);
  const isLoading = signal(false);

  const reset = () => {
    error.set(undefined);
    isLoading.set(false);
  };

  const mutate = async (
    args: FunctionArgs<Mutation>,
  ): Promise<FunctionReturnType<Mutation>> => {
    try {
      reset();

      isLoading.set(true);

      const result = await convex.mutation(mutation, args, {
        optimisticUpdate: options?.optimisticUpdate,
      });

      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      error.set(errorObj);
      options?.onError?.(errorObj);
      return undefined;
    } finally {
      isLoading.set(false);
    }
  };

  return {
    mutate,
    error: error.asReadonly(),
    isLoading: isLoading.asReadonly(),
  };
}
