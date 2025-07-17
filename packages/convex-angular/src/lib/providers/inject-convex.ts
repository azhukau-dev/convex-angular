import { assertInInjectionContext, inject } from '@angular/core';

import { CONVEX } from '../tokens/convex';

export function injectConvex() {
  assertInInjectionContext(injectConvex);
  const convex = inject(CONVEX);
  return convex;
}
