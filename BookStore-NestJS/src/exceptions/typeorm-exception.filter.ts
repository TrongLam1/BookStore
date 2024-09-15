import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
    catch(exception: QueryFailedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const errorMessage = exception.message;
        let customMessage = 'Unique constraint violation';

        // Handle MySQL unique constraint violation (ER_DUP_ENTRY)
        if (errorMessage.includes('Duplicate entry')) {
            // Extract the value and field (key name) from the error message
            const valueMatch = errorMessage.match(/Duplicate entry '(.+?)'/); // Extract the duplicate value
            const keyMatch = errorMessage.match(/for key '(.+?)'/); // Extract the key name

            // If we successfully extracted both value and key, customize the message
            if (valueMatch && keyMatch) {
                const duplicateValue = valueMatch[1]; // The duplicated value (e.g., 'music')

                // Create a more meaningful message
                customMessage = `The value '${duplicateValue}' already exists.`;
            }
        }

        response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            timestamp: new Date().toISOString(),
            message: customMessage
        });
    }
}
