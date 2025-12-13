import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
  BeforeCreate,
} from '@mikro-orm/core';
import { Account } from './account.entity';
import { TransactionCategory } from './transaction-category.entity';
import { randomUUID } from 'crypto';

@Entity({ tableName: 'transactions' })
export class Transaction {
  @PrimaryKey()
  id!: number;

  @Property({ length: 36, unique: true })
  uid!: string;

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

  @Property({ length: 10 })
  type!: 'income' | 'expense' | 'transfer';

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne(() => Account, { nullable: false })
  account!: Account;

  @ManyToOne(() => TransactionCategory, { nullable: true })
  category?: TransactionCategory;

  @BeforeCreate()
  generateUid() {
    if (!this.uid) {
      this.uid = randomUUID();
    }
  }
}
