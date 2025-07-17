import { Signal, assertInInjectionContext, signal } from '@angular/core';
import { OptimisticUpdate } from 'convex/browser';
import {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType,
} from 'convex/server';

import { injectConvex } from './inject-convex';

export type MutationReference = FunctionReference<'mutation'>;

export interface MutationOptions<Mutation extends MutationReference> {
  onSuccess?: (data: FunctionReturnType<Mutation>) => void;
  onError?: (err: Error) => void;
  optimisticUpdate?: OptimisticUpdate<FunctionArgs<Mutation>>;
}

export interface MutationResult<Mutation extends MutationReference> {
  mutate: (
    args: FunctionArgs<Mutation>,
  ) => Promise<FunctionReturnType<Mutation>>;
  data: Signal<FunctionReturnType<Mutation>>;
  error: Signal<Error | undefined>;
  isLoading: Signal<boolean>;
}

export function injectMutation<Mutation extends MutationReference>(
  mutation: Mutation,
  options?: MutationOptions<Mutation>,
): MutationResult<Mutation> {
  assertInInjectionContext(injectMutation);
  const convex = injectConvex();

  const data = signal<FunctionReturnType<Mutation>>(undefined);
  const error = signal<Error | undefined>(undefined);
  const isLoading = signal(false);

  const reset = () => {
    data.set(undefined);
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
      data.set(result);
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
    data: data.asReadonly(),
    error: error.asReadonly(),
    isLoading: isLoading.asReadonly(),
  };
}
