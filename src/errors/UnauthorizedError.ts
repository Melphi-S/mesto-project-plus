import HttpStatusCode from '../types/HttpStatusCode';

export default class UnauthorizedError extends Error {
  httpStatusCode: number;

  constructor(message: string) {
    super(message);
    this.httpStatusCode = HttpStatusCode.UNAUTHORIZED;
  }
}
