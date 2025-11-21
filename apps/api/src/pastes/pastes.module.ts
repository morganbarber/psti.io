import { Module } from '@nestjs/common';
import { PastesController } from './pastes.controller';
import { PastesService } from './pastes.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [PastesController],
    providers: [PastesService],
})
export class PastesModule { }
