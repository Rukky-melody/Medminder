import { Test, TestingModule } from '@nestjs/testing';
import { DoseController } from './dose.controller';
import { DoseService } from './dose.service';

describe('DoseController', () => {
  let controller: DoseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoseController],
      providers: [DoseService],
    }).compile();

    controller = module.get<DoseController>(DoseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
