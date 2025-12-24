import {
  Entity,
  PrimaryKey,
  Property,
  Collection,
  OneToMany,
  ManyToOne,
  BeforeCreate,
} from '@mikro-orm/core';
import { Transaction } from './transaction.entity';
import { UserAccount } from './user-account.entity';
import { randomUUID } from 'crypto';

@Entity({ tableName: 'transaction_categories' })
export class TransactionCategory {
  @PrimaryKey()
  id!: number;

  @Property({ length: 36, unique: true })
  uid!: string;

  @Property({ length: 100 })
  name!: string;

  @Property({ length: 100, unique: true })
  slug!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ type: 'jsonb', nullable: true })
  rules?: object;

  @ManyToOne(() => UserAccount, { nullable: false })
  userAccount!: UserAccount;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions = new Collection<Transaction>(this);

  @BeforeCreate()
  generateUid() {
    if (!this.uid) {
      this.uid = randomUUID();
    }
  }
}
