import { HTTP_STATUS } from "@/constants/status";
import { EntityErrorResponse } from "@/types/error";

export class HttpError extends Error {
  status: number;
  response: {
    message: string;
    [key: string]: any;
  };
  constructor({
    status,
    response,
    message = "Error HTTP",
  }: {
    status: number;
    response: any;
    message?: string;
  }) {
    super(message);
    this.status = status;
    this.response = response;
  }
}

export class EntityError extends HttpError {
  status: typeof HTTP_STATUS.UNPROCESSABLE_ENTITY;
  response: EntityErrorResponse;
  constructor({
    status,
    response,
  }: {
    status: typeof HTTP_STATUS.UNPROCESSABLE_ENTITY;
    response: EntityErrorResponse;
  }) {
    super({ status, response, message: "Error entity" });
    this.status = status;
    this.response = response;
  }
}
