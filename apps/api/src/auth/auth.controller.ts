import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('me')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async getMe(@CurrentUser() user: any) {
        const profile = await this.authService.getUserProfile(user.id);
        return {
            success: true,
            data: profile,
        };
    }
}
