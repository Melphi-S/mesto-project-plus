import HttpStatusCode from '../types/HttpStatusCode';

export default class ForbiddenError extends Error {
  httpStatusCode: number;

  constructor(message: string) {
    super(message);
    this.httpStatusCode = HttpStatusCode.FORBIDDEN;
  }
}
