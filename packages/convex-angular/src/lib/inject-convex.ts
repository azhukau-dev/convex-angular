import { assertInInjectionContext, inject } from '@angular/core';

import { CONVEX } from './convex';

export function injectConvex() {
  assertInInjectionContext(injectConvex);
  const convex = inject(CONVEX);
  return convex;
}
