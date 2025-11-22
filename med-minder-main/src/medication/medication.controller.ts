import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("medications")
@Controller({version: "1", path: "medications"})
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @UseGuards(JwtAuthGuard)
  @Post("add")
  create(@Body() createMedicationDto: CreateMedicationDto,@Req() { user }) {
    const { _id } = user;
    return this.medicationService.addMedication(createMedicationDto, _id);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMedications(@Req() req) {
    const userId = req.user._id; // assuming this is set in JWT payload
    return this.medicationService.findAllMedicationsByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateMedication(
    @Param('id') id: string,
    @Body() data: UpdateMedicationDto,
    @Req() req,
  ) {
    return this.medicationService.updateMedication(req.user._id, id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteMedication(@Param('id') id: string, @Req() req) {
    return this.medicationService.deleteMedication(req.user._id, id);
  }

  @Get('run-medication-reminders')
 runRemindersManually() {
  return this.medicationService.checkReminders(); // whatever logic you run
}

  @Get()
  findAll() {
    return this.medicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicationDto: UpdateMedicationDto) {
    return this.medicationService.update(+id, updateMedicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicationService.remove(+id);
  }
}
