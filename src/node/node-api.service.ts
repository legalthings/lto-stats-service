import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ConfigService } from '../config/config.service';
import { RequestService } from '../request/request.service';

@Injectable()
export class NodeApiService {
  constructor(
    private readonly request: RequestService,
    private readonly config: ConfigService,
  ) { }

  async getNodeAddresses(): Promise<AxiosResponse | Error> {
    const url = this.config.getNodeUrl();
    return await this.request.get(`${url}/addresses`);
  }

  async getUnconfirmedTransactions(): Promise<AxiosResponse | Error> {
    const url = this.config.getNodeUrl();
    return await this.request.get(`${url}/transactions/unconfirmed`);
  }

  async getLastBlock(): Promise<AxiosResponse | Error> {
    const url = this.config.getNodeUrl();
    return await this.request.get(`${url}/blocks/last`);
  }

  async getBlock(id: string | number): Promise<AxiosResponse | Error> {
    const url = this.config.getNodeUrl();
    return await this.request.get(`${url}/blocks/at/${id}`);
  }

  async getBlocks(from: number, to: number): Promise<AxiosResponse | Error> {
    // note: max range of 100 is supported
    const url = this.config.getNodeUrl();
    return await this.request.get(`${url}/blocks/seq/${from}/${to}`);
  }

  async getTransaction(id: string): Promise<AxiosResponse | Error> {
    const url = this.config.getNodeUrl();
    return await this.request.get(`${url}/transactions/info/${id}`);
  }

  async getNodeStatus(): Promise<AxiosResponse | Error> {
    const url = this.config.getNodeUrl();
    return await this.request.get(`${url}/node/status`);
  }
}
