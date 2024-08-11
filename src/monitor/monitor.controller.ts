import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MonitorHttpRequest } from './interfaces/http-payload.interface';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosRequestHeaders } from 'axios';

@Controller('monitor')
export class MonitorController {
  private readonly logger = new Logger(MonitorController.name);
  constructor(private readonly httpService: HttpService) {}

  @MessagePattern('http-request')
  async makeHttpRequest(@Payload() monitorRequest: MonitorHttpRequest): Promise<{}> {
    this.logger.debug(`Consumer works ${JSON.stringify(monitorRequest)}}`);

    // rxjs for rertries, similar as like with integrations
    const method = monitorRequest.httpOptions.method[0]
    
    const response = await lastValueFrom(
      this.httpService.request({
        method: method,
        url: monitorRequest.url,
        data: monitorRequest.httpOptions.body,
        headers: monitorRequest.httpOptions.headers,
        timeout: monitorRequest.timeout,
      })
    );
    this.logger.debug(`HTTP request successful: ${JSON.stringify(response.data)}`);

    const responseClear = {
      response: response.data,
      headers: response.headers,
      status: response.status
    } 
    return responseClear
    
      // method:

    // );    // HOW to send dynamically request --> handlers
    // return monitorRequest; /// TODO implement functionality in service, to send http requests --->
  }
}
