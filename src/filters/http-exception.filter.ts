import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.BAD_REQUEST;
    let message = 'Something was wrong';
    let error = 'Bad Request';
    let name = exception?.name || 'DefaultException';
    const data = {};
    const validations = [];

    if (exception?.getResponse) {
      const exceptionResponse = exception.getResponse();
      if (exceptionResponse && typeof exceptionResponse === 'object') {
        statusCode = exceptionResponse['statusCode'] ?? statusCode;
        message = exceptionResponse['message'] ?? message;
        error = exceptionResponse['error'] ?? error;
      }

      const omit = [
        'exception',
        'options',
        'status',
        'message',
        'response',
        'name',
      ];
      for (const k of Object.keys(exception)) {
        if (!omit.includes(k)) {
          data[k] = exception[k];
        }
      }
    } else {
      for (const validationError of exception) {
        message = 'Data validation error';
        name = 'ValidationException';
        error = 'Validation Error';
        validations.push({
          property: validationError.property,
          value: validationError.value,
          constraints: validationError.constraints,
        });
      }
    }

    const logMessage: any = {
      message,
      error,
      name,
      data,
      timestamp: new Date().toISOString(),
      endpoint: request.url,
    };

    if (validations.length > 0) {
      logMessage.validations = validations;
    }

    response.status(statusCode).json(logMessage);
  }
}
