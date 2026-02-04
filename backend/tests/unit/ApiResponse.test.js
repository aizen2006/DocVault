import { ApiResponse } from '../../utils/ApiResponse.js';

describe('ApiResponse', () => {
    it('should create a successful response', () => {
        const response = new ApiResponse(200, { id: 1 }, 'Success');
        
        expect(response.statusCode).toBe(200);
        expect(response.data).toEqual({ id: 1 });
        expect(response.message).toBe('Success');
        expect(response.success).toBe(true);
    });

    it('should mark success as true for status codes < 400', () => {
        const response200 = new ApiResponse(200, null, 'OK');
        const response201 = new ApiResponse(201, null, 'Created');
        const response204 = new ApiResponse(204, null, 'No Content');
        
        expect(response200.success).toBe(true);
        expect(response201.success).toBe(true);
        expect(response204.success).toBe(true);
    });

    it('should mark success as false for status codes >= 400', () => {
        const response400 = new ApiResponse(400, null, 'Bad Request');
        const response500 = new ApiResponse(500, null, 'Server Error');
        
        expect(response400.success).toBe(false);
        expect(response500.success).toBe(false);
    });

    it('should handle null data', () => {
        const response = new ApiResponse(200, null, 'No data');
        
        expect(response.data).toBeNull();
    });

    it('should use default message if not provided', () => {
        const response = new ApiResponse(200, {});
        
        expect(response.message).toBe('Success');
    });
});
