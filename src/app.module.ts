import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MonitorModule } from './monitor/monitor.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    MonitorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
