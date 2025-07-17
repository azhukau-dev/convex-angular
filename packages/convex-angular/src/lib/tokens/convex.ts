import {
  DestroyRef,
  FactoryProvider,
  InjectionToken,
  inject,
} from '@angular/core';
import { ConvexClient, ConvexClientOptions } from 'convex/browser';

export const CONVEX = new InjectionToken<ConvexClient>('CONVEX');

function convexClientFactory(convexUrl: string, options?: ConvexClientOptions) {
  const destroyRef = inject(DestroyRef);
  const client = new ConvexClient(convexUrl, options);
  destroyRef.onDestroy(() => client.close());
  return client;
}

export function provideConvex(
  convexUrl: string,
  options?: ConvexClientOptions,
): FactoryProvider {
  return {
    provide: CONVEX,
    useFactory: () => convexClientFactory(convexUrl, options),
  };
}
