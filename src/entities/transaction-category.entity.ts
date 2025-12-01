import {
  Entity,
  PrimaryKey,
  Property,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { Transaction } from './transaction.entity';

@Entity({ tableName: 'transaction_categories' })
export class TransactionCategory {
  @PrimaryKey()
  id!: number;

  @Property({ length: 100 })
  name!: string;

  @Property({ length: 100, unique: true })
  slug!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ type: 'jsonb', nullable: true })
  rules?: object;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions = new Collection<Transaction>(this);
}
