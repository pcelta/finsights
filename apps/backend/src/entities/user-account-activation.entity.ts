import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { UserAccount } from './user-account.entity';

@Entity({ tableName: 'user_account_activation' })
export class UserAccountActivation {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => UserAccount, { nullable: false })
  userAccount!: UserAccount;

  @Property({ length: 36, unique: true })
  @Index()
  code!: string;

  @Property({ type: 'text' })
  link!: string;

  @Property({ nullable: true })
  accessedAt?: Date;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property()
  expiresAt!: Date;
}
