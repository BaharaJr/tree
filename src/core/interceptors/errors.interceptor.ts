import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { existsSync } from 'fs';
import { FRONTEND } from '../system/system.config';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest();
    const response = context.getResponse();
    let message: string;
    if (response && existsSync(`${FRONTEND}/${request?.url}`)) {
      return response.sendFile(request?.url, { root: FRONTEND });
    }

    if (response) {
      return response
        .status(exception?.response?.statusCode || HttpStatus.BAD_REQUEST)
        .send({ error: message });
    }
    Logger.error(message, `${request?.method} ${request?.url}`, 'HTTP ERROR');
    message = this.getMessage(exception);
    message = this.sanitizeMessage(message);
    return new Error(message);
  }

  private sanitizeMessage = (message: string): string => {
    let text = message;
    message.includes('person with firstname, "parentId"')
      ? (text = 'This child on this parent has already been added')
      : message.includes('Could not find any entity of type "Person" matching')
      ? (text = 'Family member could not be found')
      : null;
    return text;
  };

  private getMessage = (exception: any) => {
    let message: string;
    const detail = exception.detail;

    if (typeof detail === 'string' && detail?.includes('already exists')) {
      message = exception.table.split('_').join(' ') + ' with';
      message = exception.detail.replace('Key', message);
    } else {
      message = exception?.message?.includes('Bad Request Exception')
        ? exception?.response?.message?.join(',')
        : exception?.message || exception?.error;
    }
    message = message.split('(').join('');
    message = message.split(')').join('');
    message = message.split('=').join(' ');
    if (
      message.includes('Cannot POST') ||
      message.includes('Cannot GET') ||
      message.includes('Cannot PATCH') ||
      message.includes('Cannot DELETE') ||
      message.includes('Cannot PUT')
    ) {
      message = 'Oops 😢! Route not available.';
    }
    return message;
  };
}
