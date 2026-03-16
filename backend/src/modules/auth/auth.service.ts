import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  ping() {
    return { ok: true, module: 'auth' };
  }
}