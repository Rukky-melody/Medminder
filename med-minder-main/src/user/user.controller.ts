import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, ForgotPasswordDto, ResetPasswordDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { DuplicateValueExceptionFilter } from 'src/duplicate-value-exception.filter';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';


@ApiTags("user")
@Controller({version: "1", path: "user"})
@UseFilters(DuplicateValueExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get()
  findAll() {
    return this.userService.findAll();
  }
 

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneUser(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Post('resend-verification')
  resendVerification(@Body('email') email: string) {
  return this.userService.resendVerification(email);
}

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.userService.forgotPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Query('token') token: string, @Body() dto: ResetPasswordDto) {
    return this.userService.resetPassword(dto,token);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
