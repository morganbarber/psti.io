import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PastesService } from '../src/pastes/pastes.service';
import { AuthGuard } from '../src/common/guards/auth.guard';

describe('PastesController (e2e)', () => {
    let app: INestApplication;
    const pastesService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PastesService)
            .useValue(pastesService)
            .overrideGuard(AuthGuard)
            .useValue({
                canActivate: (context: ExecutionContext) => {
                    const req = context.switchToHttp().getRequest();
                    req.user = { id: '1' };
                    return true;
                },
            })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/pastes (POST)', () => {
        const createPasteDto = { content: 'test content' };
        const result = { id: '1', ...createPasteDto };
        pastesService.create.mockResolvedValue(result);

        return request(app.getHttpServer())
            .post('/pastes')
            .send(createPasteDto)
            .expect(201)
            .expect({
                success: true,
                data: result,
            });
    });

    it('/pastes (GET)', () => {
        const result = [{ id: '1', content: 'test content' }];
        pastesService.findAll.mockResolvedValue(result);

        return request(app.getHttpServer())
            .get('/pastes')
            .expect(200)
            .expect({
                success: true,
                data: result,
            });
    });

    it('/pastes/:id (GET)', () => {
        const result = { id: '1', content: 'test content' };
        pastesService.findOne.mockResolvedValue(result);

        return request(app.getHttpServer())
            .get('/pastes/1')
            .expect(200)
            .expect({
                success: true,
                data: result,
            });
    });

    it('/pastes/:id (PATCH)', () => {
        const updatePasteDto = { content: 'updated content' };
        const result = { id: '1', ...updatePasteDto };
        pastesService.update.mockResolvedValue(result);

        return request(app.getHttpServer())
            .patch('/pastes/1')
            .send(updatePasteDto)
            .expect(200)
            .expect({
                success: true,
                data: result,
            });
    });

    it('/pastes/:id (DELETE)', () => {
        pastesService.remove.mockResolvedValue(undefined);

        return request(app.getHttpServer())
            .delete('/pastes/1')
            .expect(200)
            .expect({
                success: true,
                message: 'Paste deleted successfully',
            });
    });
});
