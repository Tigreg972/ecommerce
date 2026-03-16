import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  ping() {
    return { ok: true, module: 'users' };
  }
}