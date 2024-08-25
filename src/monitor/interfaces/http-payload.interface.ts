import { AxiosRequestHeaders } from 'axios';

enum HttpMethodEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

enum HttpStatusCodeEnum {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

interface HttpOptions {
  method: HttpMethodEnum;
  body?: Record<string, unknown>;
  headers?: AxiosRequestHeaders;
}

export interface MonitorHttpRequest {
  name: string;
  url: string;
  interval: number;
  retries: number;
  retryInterval: number;
  timeout: number;
  acceptedStatusCodes: HttpStatusCodeEnum[];
  httpOptions: HttpOptions;
}
