import HttpStatusCode from '../types/HttpStatusCode';

export default class NotFoundError extends Error {
  httpStatusCode: number;

  constructor(message: string) {
    super(message);
    this.httpStatusCode = HttpStatusCode.NOT_FOUND;
  }
}
