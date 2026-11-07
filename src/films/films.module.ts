import { Module, forwardRef } from '@nestjs/common';
import { ShowingsModule } from '../showings/showings.module.js';
import { FilmsController } from './films.controller.js';
import { FilmsService } from './films.service.js';

@Module({
  imports: [forwardRef(() => ShowingsModule)],
  controllers: [FilmsController],
  providers: [FilmsService],
  exports: [FilmsService],
})
export class FilmsModule {}
