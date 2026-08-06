import type { Services as ApplicationServices } from '@relay/application';
import { describe, expectTypeOf, it } from 'vitest';

import type { Services as ApiServices } from './port';

describe('application service port', () => {
  it('does not drift from the canonical application contract', () => {
    expectTypeOf<ApiServices>().toMatchTypeOf<ApplicationServices>();
    expectTypeOf<ApplicationServices>().toMatchTypeOf<ApiServices>();
  });
});
