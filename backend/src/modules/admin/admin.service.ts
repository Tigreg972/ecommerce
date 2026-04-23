import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  ping() {
    return { ok: true, module: 'admin' };
  }
}
