interface ApiErrorOptions {
  statusCode: number;
  message?: string;
  errors?: unknown[];
  meta?: Record<string, unknown> | undefined;
}

class ApiError extends Error {
  public readonly statusCode: number;
  public readonly success: boolean;
  public readonly errors: unknown[];
  public readonly meta?: Record<string, unknown> | undefined;

  constructor({
    statusCode,
    message = "Something went wrong",
    errors = [],
    meta,
  }: ApiErrorOptions) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.meta = meta;

    const captureStackTrace = (
      Error as ErrorConstructor & {
        captureStackTrace?: (targetObject: object, constructorOpt?: Function) => void;
      }
    ).captureStackTrace;

    captureStackTrace?.(this, this.constructor);
  }
}

export default ApiError;