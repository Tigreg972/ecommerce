import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Address)
    private readonly addressesRepo: Repository<Address>,
  ) {}

  async getMe(user: any) {
    const dbUser = await this.usersRepo.findOne({ where: { id: user.id } });

    if (!dbUser) {
      throw new NotFoundException('User not found');
    }

    return {
      id: dbUser.id,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      email: dbUser.email,
      phone: dbUser.phone,
      role: dbUser.role,
    };
  }

  async updateMe(user: any, data: Partial<User>) {
    await this.usersRepo.update(user.id, {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    });

    return this.getMe(user);
  }

  async getAddresses(userId: number) {
    return this.addressesRepo.find({
      where: { userId },
      order: { id: 'DESC' },
    });
  }

  async addAddress(userId: number, data: Partial<Address>) {
    const address = this.addressesRepo.create({
      userId,
      firstName: data.firstName,
      lastName: data.lastName,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      region: data.region,
      postalCode: data.postalCode,
      country: data.country,
      phone: data.phone,
    });

    return this.addressesRepo.save(address);
  }

  async updateAddress(userId: number, addressId: number, data: Partial<Address>) {
    const address = await this.addressesRepo.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    Object.assign(address, data);
    return this.addressesRepo.save(address);
  }

  async deleteAddress(userId: number, addressId: number) {
    const address = await this.addressesRepo.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    await this.addressesRepo.remove(address);
    return { success: true };
  }
}