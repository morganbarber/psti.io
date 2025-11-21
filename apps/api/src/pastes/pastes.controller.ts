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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { PastesService } from './pastes.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('pastes')
@Controller('pastes')
export class PastesController {
    constructor(private readonly pastesService: PastesService) { }

    @Post()
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

    @Get(':id')
    @ApiOperation({ summary: 'Get a paste by ID' })
    async findOne(@Param('id') id: string, @Query('password') password?: string) {
        const paste = await this.pastesService.findOne(id, password);
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
