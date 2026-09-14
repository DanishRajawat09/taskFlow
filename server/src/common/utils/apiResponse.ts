class ApiResponse<T> {
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data: T;
  public readonly success: boolean;
  public readonly meta?: Record<string, unknown>;

  constructor(
    statusCode: number,
    data: T,
    message = "success",
    meta?: Record<string, unknown>
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
    this.meta = meta;
  }

  static success<T>(
    statusCode: number,
    data: T,
    message = "success",
    meta?: Record<string, unknown>
  ) {
    return new ApiResponse(
      statusCode,
      data,
      message,
      meta
    );
  }
}

export default ApiResponse;