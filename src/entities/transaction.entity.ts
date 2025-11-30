import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { Account } from './account.entity';
import { TransactionCategory } from './transaction-category.entity';

@Entity({ tableName: 'transactions' })
export class Transaction {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  description!: string;

  @Property({ length: 64, unique: true })
  @Index()
  hash!: string;

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number;

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  balance!: number;

  @Property({ type: 'date' })
  transactionDate!: Date;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne(() => Account, { nullable: false })
  account!: Account;

  @ManyToOne(() => TransactionCategory, { nullable: true })
  category?: TransactionCategory;
}
