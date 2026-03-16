import { Injectable } from '@nestjs/common';

@Injectable()
export class CartService {
  ping() {
    return { ok: true, module: 'cart' };
  }
}