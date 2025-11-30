import {
  Entity,
  PrimaryKey,
  Property,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { Transaction } from './transaction.entity';

@Entity({ tableName: 'accounts' })
export class Account {
  @PrimaryKey()
  id!: number;

  @Property({ length: 6 })
  bsb!: string;

  @Property({ length: 20 })
  number!: string;

  @Property({ length: 100, name: 'bank_name' })
  bankName!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions = new Collection<Transaction>(this);
}
