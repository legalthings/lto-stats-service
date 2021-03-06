import {Inject, Injectable} from '@nestjs/common';
import {ConfigService} from '../config/config.service';
import {LoggerService} from '../logger/logger.service';
import {MODEL_TRANSACTION} from '../constants';
import {
  Transaction,
  TransactionGranularity,
  TransactionInstanceType,
  TransactionModelType,
} from './models/transaction.model';

@Injectable()
export class TransactionRepositoryService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    @Inject(MODEL_TRANSACTION)
    private readonly transactionModel: TransactionModelType,
  ) { }

  incrementTransactionCount(data: Partial<Transaction>, increment: number = 1): Promise<TransactionInstanceType> {
    return this.transactionModel.findOneAndUpdate(data, { $inc: { transactions: increment} }, { new: true, upsert: true });
  }

  find(startDate: Date, endDate: Date, granularity: TransactionGranularity, type?: number) {

    const match: any = {
      date: {$gte: startDate, $lte: endDate},
      granularity,
    };

    if (type) {
      match.type = type;
    }

    return this.transactionModel.aggregate([{$match: match}, { $group: { _id: '$date', transactions: { $sum: '$transactions'}}}, {$sort: {_id: 1}}]);
  }
}