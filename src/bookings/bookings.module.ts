import { Module, forwardRef } from '@nestjs/common';
import { BOOKINGS_SERVICE } from '../common/tokens.js';
import { HallsModule } from '../halls/halls.module.js';
import { ShowingsModule } from '../showings/showings.module.js';
import { BookingsController } from './bookings.controller.js';
import { BookingsService } from './bookings.service.js';

@Module({
  imports: [forwardRef(() => ShowingsModule), HallsModule],
  controllers: [BookingsController],
  providers: [
    BookingsService,
    { provide: BOOKINGS_SERVICE, useExisting: BookingsService },
  ],
  exports: [BookingsService, BOOKINGS_SERVICE],
})
export class BookingsModule {}
