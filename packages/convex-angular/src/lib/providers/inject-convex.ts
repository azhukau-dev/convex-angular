import { assertInInjectionContext, inject } from '@angular/core';
import { ConvexClient } from 'convex/browser';

import { CONVEX } from '../tokens/convex';

export function injectConvex(): ConvexClient {
  assertInInjectionContext(injectConvex);
  const convex = inject(CONVEX);
  return convex;
}
