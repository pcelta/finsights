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

@Entity({ tableName: 'accounts' })
export class Account {
  @PrimaryKey()
  id!: number;

  @Property({ length: 36, unique: true })
  uid!: string;

  @Property({ length: 6 })
  bsb!: string;

  @Property({ length: 20 })
  number!: string;

  @Property({ length: 100, name: 'bank_name' })
  bankName!: string;

  @Property({ length: 255, nullable: true })
  name?: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => UserAccount, { nullable: false })
  userAccount!: UserAccount;

  @Property({ onCreate: () => new Date(), nullable: true })
  createdAt?: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date = new Date();

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions = new Collection<Transaction>(this);

  @BeforeCreate()
  generateUid() {
    if (!this.uid) {
      this.uid = randomUUID();
    }
  }
}
