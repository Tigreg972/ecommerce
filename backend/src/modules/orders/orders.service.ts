import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  ping() {
    return { ok: true, module: 'orders' };
  }
}