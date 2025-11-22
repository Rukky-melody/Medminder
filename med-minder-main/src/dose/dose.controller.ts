import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DoseService } from './dose.service';
import { CreateDoseDto } from './dto/create-dose.dto';
import { UpdateDoseDto } from './dto/update-dose.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';


@ApiTags("dose")
@Controller({version: "1", path: "dose"})
export class DoseController {
  constructor(private readonly doseService: DoseService) {}


  @Get()
  findAll() {
    return this.doseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doseService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
   updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.doseService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doseService.remove(+id);
  }
}
