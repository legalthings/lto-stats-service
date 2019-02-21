import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from '../request/request.service';
import { NodeModuleConfig } from './node.module';
import { NodeApiService } from './node-api.service';
import { ConfigService } from "../config/config.service";

describe('NodeApiService', () => {
  let module: TestingModule;
  let nodeApiService: NodeApiService;
  let requestService: RequestService;
  let configService: ConfigService;

  function spy() {
    const request = {
      get: jest.spyOn(requestService, 'get'),
      post: jest.spyOn(requestService, 'post'),
    };

    return { request };
  }

  beforeEach(async () => {
    module = await Test.createTestingModule(NodeModuleConfig).compile();
    await module.init();

    nodeApiService = module.get<NodeApiService>(NodeApiService);
    requestService = module.get<RequestService>(RequestService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('getNodeAddresses()', () => {
    test('should get all node wallet addresses', async () => {
      const spies = spy();

      const response = { status: 200, data: ['fake_address'] };
      spies.request.get.mockImplementation(() => Promise.resolve(response as any));

      expect(await nodeApiService.getNodeAddresses()).toBe(response);
      expect(spies.request.get.mock.calls.length).toBe(1);
      expect(spies.request.get.mock.calls[0][0]).toBe('http://localhost:6869/addresses');
    });
  });

  describe('getUnconfirmedTransactions()', () => {
    test('should get all unconfirmed transactions', async () => {
      const spies = spy();

      const response = { status: 200, data: [{ id: 'fake_id', type: 12, data: [{ value: 'base64:fake_hash' }] }] };
      spies.request.get.mockImplementation(() => Promise.resolve(response as any));

      expect(await nodeApiService.getUnconfirmedTransactions()).toBe(response);
      expect(spies.request.get.mock.calls.length).toBe(1);
      expect(spies.request.get.mock.calls[0][0]).toBe('http://localhost:6869/transactions/unconfirmed');
    });
  });

  describe('getLastBlock()', () => {
    test('should get last block', async () => {
      const spies = spy();

      const response = { status: 200, data: { id: 'fake_id' } };
      spies.request.get.mockImplementation(() => Promise.resolve(response as any));

      expect(await nodeApiService.getLastBlock()).toBe(response);
      expect(spies.request.get.mock.calls.length).toBe(1);
      expect(spies.request.get.mock.calls[0][0]).toBe('http://localhost:6869/blocks/last');
    });
  });

  describe('getBlock()', () => {
    test('should get block by id', async () => {
      const spies = spy();

      const response = { status: 200, data: { id: 'fake_id' } };
      spies.request.get.mockImplementation(() => Promise.resolve(response as any));

      expect(await nodeApiService.getBlock('fake_id')).toBe(response);
      expect(spies.request.get.mock.calls.length).toBe(1);
      expect(spies.request.get.mock.calls[0][0]).toBe('http://localhost:6869/blocks/at/fake_id');
    });
  });

  describe('getBlocks()', () => {
    test('should get blocks by range', async () => {
      const spies = spy();

      const response = { status: 200, data: [{ height: 1 }] };
      spies.request.get.mockImplementation(() => Promise.resolve(response as any));

      expect(await nodeApiService.getBlocks(1, 2)).toBe(response);
      expect(spies.request.get.mock.calls.length).toBe(1);
      expect(spies.request.get.mock.calls[0][0]).toBe('http://localhost:6869/blocks/seq/1/2');
    });
  });
});
