import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MonitorHttpRequest } from './interfaces/http-payload.interface';
import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

@Controller('monitor')
export class MonitorController {
  private readonly logger = new Logger(MonitorController.name);

  constructor(private configService: ConfigService) {}

  @MessagePattern('http-request')
  async makeHttpRequest(
    @Payload() monitorRequest: MonitorHttpRequest,
  ): Promise<any> {
    const method = monitorRequest.httpOptions.method[0];
    const url = monitorRequest.url;
    const data = monitorRequest.httpOptions.body;
    const headers: AxiosRequestHeaders = monitorRequest.httpOptions.headers;
    const timeout = monitorRequest.timeout;

    const config = {
      method: method,
      url: url,
      data: data,
      headers: headers,
      timeout: timeout,
    };

    let attempts = 0;
    let response: AxiosResponse;

    // Implement retry logic
    while (attempts <= monitorRequest.retries) {
      attempts++;
      const startTime = Date.now();

      try {
        response = await axios(config);

        const endTime = Date.now();

        const responseClear = {
          responseTime: endTime - startTime,
          statusCode: response.status,
          timestamp: startTime * 1000,
          region: this.configService.get('REGION'),
        };

        return responseClear;
      } catch (error) {
        this.logger.error(
          `HTTP request failed on attempt ${attempts}: ${error.message}`,
        );

        // Check if the error is a network error (like getaddrinfo ENOTFOUND)
        let statusCode = 500; // Default to a server error code
        if (error.response) {
          statusCode = error.response.status;
        } else if (
          error.code === 'ENOTFOUND' ||
          error.code === 'ECONNREFUSED'
        ) {
          statusCode = 503; // Service Unavailable
        } else if (error.code === 'ETIMEDOUT') {
          statusCode = 504; // Gateway Timeout
        } else if (error.code === 'ECONNABORTED') {
          statusCode = 408; // Request Timeout
        }

        // If the number of attempts exceeds the retry limit, return the error
        if (attempts > monitorRequest.retries) {
          return {
            statusCode,
            message: error.message,
            timestamp: startTime * 1000,
            region: this.configService.get('REGION'),
          };
        }

        // Wait before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, monitorRequest.retryInterval),
        );
      }
    }
  }
}
