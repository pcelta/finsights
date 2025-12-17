import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { Queue } from 'bull';
import { ExpressAdapter } from '@bull-board/express';
import { getQueueToken } from '@nestjs/bull';
import { NestExpressApplication } from '@nestjs/platform-express';

export class BullBoardSetup {
  static setup(app: NestExpressApplication) {
    const serverAdapter = new ExpressAdapter();

    createBullBoard({
      queues: [
        new BullAdapter(app.get<Queue>(getQueueToken('statement-processing')))
      ],
      serverAdapter
    });

    serverAdapter.setBasePath('/dev/queues');
    app.use('/dev/queues', serverAdapter.getRouter());
  }
}
