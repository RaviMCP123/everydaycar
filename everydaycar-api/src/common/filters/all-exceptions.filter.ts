import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

function extractHttpExceptionMessage(exception: HttpException): string {
  const res = exception.getResponse();
  if (typeof res === "string" && res.trim()) {
    return res;
  }
  if (res && typeof res === "object") {
    const message = (res as { message?: string | string[] }).message;
    if (Array.isArray(message)) {
      return message.find((entry) => typeof entry === "string" && entry.trim()) ??
        "Bad request";
    }
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }
  return "Bad request";
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const i18n = request.i18nContext;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";

    if (exception instanceof HttpException) {
      status =
        exception.getStatus() === 400
          ? HttpStatus.UNPROCESSABLE_ENTITY
          : exception.getStatus();

      message = extractHttpExceptionMessage(exception);
    } else if (typeof exception === "object" && exception?.message) {
      message = exception.message;
    }

    // ✅ Translate message if possible
    if (i18n) {
      try {
        message = i18n.t(message);
      } catch {
        // Keep original message if translation fails
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      data: {},
      message,
    });
  }
}
