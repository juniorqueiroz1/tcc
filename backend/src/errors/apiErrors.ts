import { ValidationError as VError } from 'class-validator';

type ErrorDetails = { [field: string]: string[] };
type ErrorJson = { [field: string]: string | string[] };

function getErrorDetails(errors: VError[]): ErrorDetails {
  return errors.reduce((errorDetail: ErrorDetails, error) => {
    if (error.constraints) {
      errorDetail[error.property] = Object.values(error.constraints);
    }
    return errorDetail;
  }, {});
}

class APIError {
  protected defaultDetail = 'A server error occurred.';

  public readonly statusCode: number = 500;
  private _detail: string | undefined;

  constructor(detail: string | undefined = undefined) {
    this._detail = detail;
  }

  get detail(): string {
    return this._detail || this.defaultDetail;
  }

  json(): ErrorJson {
    return {
      detail: this.detail,
    };
  }
}

class ValidationError extends APIError {
  statusCode = 400;
  defaultDetail = 'Invalid input.';

  errorDetails: ErrorDetails | undefined;

  constructor(errors: VError[] = [], detail: string | undefined = undefined) {
    super(detail);

    if (errors.length) {
      this.errorDetails = getErrorDetails(errors);
    }
  }

  json() {
    if (this.errorDetails) {
      return this.errorDetails;
    }

    return super.json();
  }
}

class AuthenticationFailed extends APIError {
  statusCode = 401;
  defaultDetail = 'Incorrect authentication credentials.';
}

class NotAuthenticated extends APIError {
  statusCode = 401;
  defaultDetail = 'Authentication credentials were not provided.';
}

class PermissionDenied extends APIError {
  statusCode = 403;
  defaultDetail = 'You do not have permission to perform this action.';
}

class NotFound extends APIError {
  statusCode = 404;
  defaultDetail = 'Not found.';
}

class ServiceError extends APIError {
  statusCode = 409;
  defaultDetail = 'Conflict.';
}

export {
  APIError,
  ValidationError,
  AuthenticationFailed,
  NotAuthenticated,
  PermissionDenied,
  NotFound,
  ServiceError,
};
