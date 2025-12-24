import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../repositories/account.repository';
import { Account } from '../entities/account.entity';
import { UserAccount } from '../entities/user-account.entity';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async saveOrCreate(
    bsb: string,
    number: string,
    bankName: string,
    userAccount: UserAccount,
    description?: string,
  ): Promise<Account> {
    const existingAccount = await this.accountRepository.findByBsbAndNumber(
      bsb,
      number,
      userAccount.id,
    );

    if (existingAccount) {
      return existingAccount;
    }

    const account = new Account();
    account.bsb = bsb;
    account.number = number;
    account.bankName = bankName;
    account.description = description;
    account.userAccount = userAccount;

    return this.accountRepository.save(account);
  }
}
