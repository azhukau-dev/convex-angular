import { Signal, assertInInjectionContext, signal } from '@angular/core';
import { FunctionReference, FunctionReturnType } from 'convex/server';

import { injectConvex } from './inject-convex';

export type ActionFunctionReference = FunctionReference<'action'>;

export interface ActionOptions<Action extends ActionFunctionReference> {
  onSuccess?: (data: FunctionReturnType<Action>) => void;
  onError?: (err: Error) => void;
}

export interface ActionResult<Action extends ActionFunctionReference> {
  run: (args: Action['_args']) => Promise<FunctionReturnType<Action>>;
  data: Signal<FunctionReturnType<Action>>;
  error: Signal<Error | undefined>;
  isLoading: Signal<boolean>;
}

export function injectAction<Action extends ActionFunctionReference>(
  action: Action,
  options?: ActionOptions<Action>,
): ActionResult<Action> {
  assertInInjectionContext(injectAction);
  const convex = injectConvex();

  const data = signal<FunctionReturnType<Action>>(undefined);
  const error = signal<Error | undefined>(undefined);
  const isLoading = signal(false);

  const reset = () => {
    data.set(undefined);
    error.set(undefined);
    isLoading.set(false);
  };

  const run = async (
    args: Action['_args'],
  ): Promise<FunctionReturnType<Action>> => {
    try {
      reset();

      isLoading.set(true);

      const result = await convex.action(action, args);
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
    run,
    data: data.asReadonly(),
    error: error.asReadonly(),
    isLoading: isLoading.asReadonly(),
  };
}
