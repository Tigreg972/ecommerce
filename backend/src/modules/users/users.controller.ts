import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: any) {
    return this.usersService.getMe(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Req() req: any, @Body() body: any) {
    return this.usersService.updateMe(req.user, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/addresses')
  getAddresses(@Req() req: any) {
    return this.usersService.getAddresses(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/addresses')
  addAddress(@Req() req: any, @Body() body: any) {
    return this.usersService.addAddress(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/addresses/:id')
  updateAddress(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.usersService.updateAddress(req.user.id, Number(id), body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/addresses/:id')
  deleteAddress(@Req() req: any, @Param('id') id: string) {
    return this.usersService.deleteAddress(req.user.id, Number(id));
  }
}