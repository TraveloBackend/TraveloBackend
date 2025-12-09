import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    BadRequestException,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception instanceof HttpException ? exception.getStatus() : 500;
  
      let message = 'Internal Server Error';
      let errors: any = {};
  
      if (exception instanceof BadRequestException) {
        const res = exception.getResponse() as any;
  
        message = 'Bad Request!';
  
        if (Array.isArray(res.message)) {
          // Format errors: one error per field
          errors = {};
          for (const msg of res.message) {
            const field = msg.split(' ')[0]; // crude field name grab
            if (!errors[field]) {
              errors[field] = [msg]; // Only add first message
            }
          }
        } else if (typeof res === 'object' && res.errors) {
          errors = res.errors;
        }
      } else if (exception instanceof HttpException) {
        const res = exception.getResponse() as any;
        message = res.message || message;
        errors = res.errors ?? {};
      } else {
        message = exception.message || message;
      }
  
      response.status(status).json({
        statusCode: status,
        response: {
          data: [],
        },
        message, // Always a string
        status: false,
        errors,
      });
    }
  }  