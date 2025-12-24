import {
  Entity,
  PrimaryKey,
  Property,
  BeforeCreate,
  Index,
} from '@mikro-orm/core';
import { randomUUID } from 'crypto';

@Entity({ tableName: 'user_accounts' })
export class UserAccount {
  @PrimaryKey()
  id!: number;

  @Property({ length: 36, unique: true })
  uid!: string;

  @Property({ length: 255 })
  name!: string;

  @Property({ length: 255, unique: true })
  @Index()
  email!: string;

  @Property({ type: 'date', nullable: true })
  dob?: Date;

  @Property({ length: 255 })
  password!: string;

  @Property({ length: 20 })
  status!: 'active' | 'inactive' | 'awaiting-activation';

  @Property({ nullable: true })
  lastLoggedInAt?: Date;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @BeforeCreate()
  generateUid() {
    if (!this.uid) {
      this.uid = randomUUID();
    }
  }
}
