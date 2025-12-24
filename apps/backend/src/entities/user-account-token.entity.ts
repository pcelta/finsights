import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { UserAccount } from './user-account.entity';

@Entity({ tableName: 'user_account_tokens' })
export class UserAccountToken {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  token!: string;

  @ManyToOne(() => UserAccount, { nullable: false })
  userAccount!: UserAccount;

  @Property({ length: 10 })
  type!: 'access' | 'refresh';

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property()
  expiresAt!: Date;
}
