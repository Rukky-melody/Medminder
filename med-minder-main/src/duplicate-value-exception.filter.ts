import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class DuplicateValueExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.CONFLICT;

    if (exception.code === 11000) { // Unique constraint violation
      const keyValue = (exception as any).keyValue; // Type assertion for keyValue
      const duplicateField = keyValue ? Object.keys(keyValue)[0] : 'unknown';
      const fieldMessage = this.getDuplicateFieldMessage(duplicateField);

      response.status(status).json({
        statusCode: status,
        message: fieldMessage,
      });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    }
  }

  private getDuplicateFieldMessage(field: string): string {
    switch (field) {
      case 'email':
        return 'The email is already in use.';
      case 'phoneNumber':
        return 'The phoneNumber is already in use.';
      default:
        return 'A duplicate value exists.';
    }
  }
}
