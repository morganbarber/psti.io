import { PastebinClient } from '../src';
import { PasteVisibility } from '@psti/types';

// Mock the global fetch function
global.fetch = jest.fn();

describe('PastebinClient', () => {
    let client: PastebinClient;
    const mockBaseUrl = 'https://api.example.com';
    const mockToken = 'mock-token';

    beforeEach(() => {
        client = new PastebinClient({ baseUrl: mockBaseUrl });
        (global.fetch as jest.Mock).mockClear();
    });

    it('should initialize with base URL', () => {
        expect(client).toBeDefined();
    });

    it('should set and use token for authorization', async () => {
        client.setToken(mockToken);
        
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, data: [] }),
        });

        await client.pastes.list();

        expect(global.fetch).toHaveBeenCalledWith(
            `${mockBaseUrl}/api/v1/pastes`,
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': `Bearer ${mockToken}`,
                })
            })
        );
    });

    it('should create a paste', async () => {
        const mockPaste = { id: '1', title: 'test', content: 'hello' };
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, data: mockPaste }),
        });

        const result = await client.pastes.create({
            title: 'test',
            content: 'hello',
            language: 'plaintext',
            visibility: PasteVisibility.PUBLIC,
            encrypted: false,
            burn_after_read: false
        });

        expect(global.fetch).toHaveBeenCalledWith(
            `${mockBaseUrl}/api/v1/pastes`,
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    title: 'test',
                    content: 'hello',
                    language: 'plaintext',
                    visibility: PasteVisibility.PUBLIC,
                    encrypted: false,
                    burn_after_read: false
                })
            })
        );
        expect(result.data).toEqual(mockPaste);
    });

    it('should fork a paste', async () => {
        const mockPaste = { id: 'new-id', title: 'test (Fork)', content: 'hello' };
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, data: mockPaste }),
        });

        const result = await client.pastes.fork('old-id', 'secret');

        expect(global.fetch).toHaveBeenCalledWith(
            `${mockBaseUrl}/api/v1/pastes/old-id/fork`,
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ password: 'secret' })
            })
        );
        expect(result.data).toEqual(mockPaste);
    });

    it('should get paste versions', async () => {
        const mockVersions = [{ id: 'v1', content: 'test' }];
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, data: mockVersions }),
        });

        const result = await client.pastes.getVersions('old-id', 'secret');

        expect(global.fetch).toHaveBeenCalledWith(
            `${mockBaseUrl}/api/v1/pastes/old-id/versions?password=secret`,
            expect.objectContaining({
                method: 'GET',
            })
        );
        expect(result.data).toEqual(mockVersions);
    });
});
