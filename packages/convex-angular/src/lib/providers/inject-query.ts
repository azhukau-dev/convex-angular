import {
  DestroyRef,
  Signal,
  assertInInjectionContext,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  FunctionReference,
  FunctionReturnType,
  getFunctionName,
} from 'convex/server';

import { injectConvex } from './inject-convex';

export type QueryReference = FunctionReference<'query'>;

export interface QueryOptions {
  enabled?: boolean;
}

export interface QueryResult<Query extends QueryReference> {
  data: Signal<FunctionReturnType<Query>>;
  error: Signal<Error | undefined>;
  isLoading: Signal<boolean>;
}

export function injectQuery<Query extends QueryReference>(
  query: Query,
  argsFn: () => Query['_args'],
  optionsFn?: () => QueryOptions,
): QueryResult<Query> {
  assertInInjectionContext(injectQuery);
  const convex = injectConvex();
  const destroyRef = inject(DestroyRef);

  const data = signal<FunctionReturnType<Query>>(
    convex.client.localQueryResult(getFunctionName(query), argsFn()),
  );
  const error = signal<Error | undefined>(undefined);
  const isLoading = signal(false);

  let unsubscribe: (() => void) | undefined;

  effect(() => {
    const options = optionsFn?.();
    const enabled = options?.enabled ?? true;

    unsubscribe?.();

    if (!enabled) {
      data.set(undefined);
      error.set(undefined);
      isLoading.set(false);
      return;
    }

    isLoading.set(true);

    unsubscribe = convex.onUpdate(
      query,
      argsFn(),
      (result: FunctionReturnType<Query>) => {
        data.set(result);
        error.set(undefined);
        isLoading.set(false);
      },
      (err: Error) => {
        data.set(undefined);
        error.set(err);
        isLoading.set(false);
      },
    );
  });

  destroyRef.onDestroy(() => unsubscribe?.());

  return {
    data: data.asReadonly(),
    error: error.asReadonly(),
    isLoading: isLoading.asReadonly(),
  };
}
