import {
  EnvironmentInjector,
  Injector,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { Router } from '@angular/router';

export const InjectableFc = (
  injector: Injector,
  enviInjector: EnvironmentInjector
) => {
  let router;
  console.log(injector, enviInjector);

  runInInjectionContext(injector, () => {
    const r = inject(Router);
    router = r.config;
  });

  router ??= 'tèo';

  return router;
};
