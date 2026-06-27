"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const types_1 = require("@psti/types");
// Mock the global fetch function
global.fetch = jest.fn();
describe('PastebinClient', () => {
    let client;
    const mockBaseUrl = 'https://api.example.com';
    const mockToken = 'mock-token';
    beforeEach(() => {
        client = new src_1.PastebinClient({ baseUrl: mockBaseUrl });
        global.fetch.mockClear();
    });
    it('should initialize with base URL', () => {
        expect(client).toBeDefined();
    });
    it('should set and use token for authorization', async () => {
        client.setToken(mockToken);
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, data: [] }),
        });
        await client.pastes.list();
        expect(global.fetch).toHaveBeenCalledWith(`${mockBaseUrl}/api/v1/pastes`, expect.objectContaining({
            headers: expect.objectContaining({
                'Authorization': `Bearer ${mockToken}`,
            })
        }));
    });
    it('should create a paste', async () => {
        const mockPaste = { id: '1', title: 'test', content: 'hello' };
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, data: mockPaste }),
        });
        const result = await client.pastes.create({
            title: 'test',
            content: 'hello',
            language: 'plaintext',
            visibility: types_1.PasteVisibility.PUBLIC
        });
        expect(global.fetch).toHaveBeenCalledWith(`${mockBaseUrl}/api/v1/pastes`, expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
                title: 'test',
                content: 'hello',
                language: 'plaintext',
                visibility: types_1.PasteVisibility.PUBLIC
            })
        }));
        expect(result.data).toEqual(mockPaste);
    });
});
