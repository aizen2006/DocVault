import { ApiError } from '../../utils/ApiError.js';

describe('ApiError', () => {
    it('should create an error with default values', () => {
        const error = new ApiError(500);
        
        expect(error.statusCode).toBe(500);
        expect(error.message).toBe('Something went wrong');
        expect(error.success).toBe(false);
        expect(error.errors).toEqual([]);
    });

    it('should create an error with custom message', () => {
        const error = new ApiError(400, 'Custom error message');
        
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('Custom error message');
        expect(error.success).toBe(false);
    });

    it('should create an error with custom errors array', () => {
        const customErrors = [{ field: 'email', message: 'Invalid email' }];
        const error = new ApiError(400, 'Validation failed', customErrors);
        
        expect(error.statusCode).toBe(400);
        expect(error.errors).toEqual(customErrors);
    });

    it('should be an instance of Error', () => {
        const error = new ApiError(500, 'Test error');
        
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(ApiError);
    });

    it('should have a stack trace', () => {
        const error = new ApiError(500, 'Test error');
        
        expect(error.stack).toBeDefined();
        expect(typeof error.stack).toBe('string');
    });
});
