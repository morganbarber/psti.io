import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { PastesService } from './pastes.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { OptionalAuthGuard } from '../common/guards/optional-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('pastes')
@Controller('pastes')
export class PastesController {
    constructor(private readonly pastesService: PastesService) { }

    @Post()
    @UseGuards(OptionalAuthGuard)
    @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 pastes per minute
    @ApiOperation({ summary: 'Create a new paste' })
    async create(@Body() createPasteDto: any, @CurrentUser() user?: any) {
        const paste = await this.pastesService.create(user?.id || null, createPasteDto);
        return {
            success: true,
            data: paste,
        };
    }

    @Get()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all pastes for current user' })
    async findAll(@CurrentUser() user: any) {
        const pastes = await this.pastesService.findAll(user.id);
        return {
            success: true,
            data: pastes,
        };
    }

    @Get('analytics/aggregate')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get aggregated analytics for all pastes' })
    async getAnalytics(@CurrentUser() user: any) {
        const analytics = await this.pastesService.getAnalytics(user.id);
        return {
            success: true,
            data: analytics,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a paste by ID' })
    async findOne(@Param('id') id: string, @Query('password') password?: string) {
        const paste = await this.pastesService.findOne(id, password);
        return {
            success: true,
            data: paste,
        };
    }

    @Get(':id/versions')
    @ApiOperation({ summary: 'Get paste versions by ID' })
    async findVersions(@Param('id') id: string, @Query('password') password?: string) {
        const versions = await this.pastesService.findVersions(id, password);
        return {
            success: true,
            data: versions,
        };
    }

    @Post(':id/views')
    @UseGuards(OptionalAuthGuard)
    @ApiOperation({ summary: 'Track a paste view with detailed analytics' })
    async trackView(
        @Param('id') id: string,
        @Body() body: any,
        @Req() req: Request,
        @CurrentUser() user?: any
    ) {
        const ip = req.ip || req.socket?.remoteAddress || '';
        const userAgent = req.headers['user-agent'] || '';
        
        await this.pastesService.trackView(id, ip, userAgent, {
            ...body,
            viewer_user_id: user?.id,
        });

        return { success: true };
    }

    @Post(':id/fork')
    @UseGuards(OptionalAuthGuard)
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @ApiOperation({ summary: 'Fork a paste' })
    async fork(
        @Param('id') id: string,
        @Body('password') password?: string,
        @CurrentUser() user?: any
    ) {
        const paste = await this.pastesService.fork(id, user?.id || null, password);
        return {
            success: true,
            data: paste,
        };
    }

    @Patch(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a paste' })
    async update(
        @Param('id') id: string,
        @Body() updatePasteDto: any,
        @CurrentUser() user: any
    ) {
        const paste = await this.pastesService.update(id, user.id, updatePasteDto);
        return {
            success: true,
            data: paste,
        };
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a paste' })
    async remove(@Param('id') id: string, @CurrentUser() user: any) {
        await this.pastesService.remove(id, user.id);
        return {
            success: true,
            message: 'Paste deleted successfully',
        };
    }
}
