import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { PastesModule } from './pastes/pastes.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        // Rate limiting
        ThrottlerModule.forRoot([
            {
                ttl: 60000, // 1 minute
                limit: 100, // 100 requests per minute
            },
        ]),
        AuthModule,
        PastesModule,
        UsersModule,
    ],
})
export class AppModule { }
