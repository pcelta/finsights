import { Entity, PrimaryKey, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { FinancialInstitution } from './financial-institution.entity';
import { UserAccount } from './user-account.entity';

export enum StatementImportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  FAILED = 'failed',
}

@Entity({ tableName: 'statement_imports' })
export class StatementImport {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  uid: string = uuidv4();

  @ManyToOne(() => FinancialInstitution)
  financialInstitution!: FinancialInstitution;

  @ManyToOne(() => UserAccount, { nullable: false })
  userAccount!: UserAccount;

  @Enum(() => StatementImportStatus)
  status: StatementImportStatus = StatementImportStatus.PENDING;

  @Property()
  path!: string;

  @Property({ type: 'text', nullable: true })
  error?: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
