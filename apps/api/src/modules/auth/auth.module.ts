import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

/**
 * The identity provider itself is bound by `RuntimeModule`, from the value the
 * composition root supplies. Having exactly one binding site is what lets the
 * integration suite exercise every auth route without a network, and stops a
 * module-local provider from silently shadowing the injected one.
 */
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
