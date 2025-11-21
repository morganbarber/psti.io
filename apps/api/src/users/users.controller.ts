import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('profile')
    async getProfile(@CurrentUser() user: any) {
        const profile = await this.usersService.findOne(user.id);
        return {
            success: true,
            data: profile,
        };
    }

    @Patch('profile')
    async updateProfile(@CurrentUser() user: any, @Body() updateData: any) {
        const profile = await this.usersService.update(user.id, updateData);
        return {
            success: true,
            data: profile,
        };
    }
}
