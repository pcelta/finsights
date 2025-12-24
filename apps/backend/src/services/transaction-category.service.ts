import { Injectable } from '@nestjs/common';
import Ajv from 'ajv';
import { TransactionCategoryRepository } from '../repositories/transaction-category.repository';
import { TransactionCategory } from '../entities/transaction-category.entity';
import { UserAccount } from '../entities/user-account.entity';

@Injectable()
export class TransactionCategoryService {
  private ajv: Ajv;
  private categoriesByUser: Map<number, TransactionCategory[]> = new Map();

  constructor(
    private readonly transactionCategoryRepository: TransactionCategoryRepository,
  ) {
    this.ajv = new Ajv({ strict: false });
  }

  private async getCategories(userAccountId: number): Promise<TransactionCategory[]> {
    if (this.categoriesByUser.has(userAccountId)) {
      return this.categoriesByUser.get(userAccountId)!;
    }
    const categories = await this.transactionCategoryRepository.findAllWithRules(userAccountId);
    this.categoriesByUser.set(userAccountId, categories);

    return categories;
  }

  public async findOut(
    transactionDescription: string,
    userAccount: UserAccount,
  ): Promise<TransactionCategory | null> {
    const categories = await this.getCategories(userAccount.id);
    const schemaTemplate = {
      type: "string",
    };

    for (const category of categories) {
      if (!category.rules) {
        continue;
      }

      let schema = {...schemaTemplate, ...category.rules}

      try {
        const validate = this.ajv.compile(schema);
        if (validate(transactionDescription.toLowerCase())) {
          return category;
        }
      } catch (error) {
        console.error(`Invalid schema for category ${category.slug}:`, error);
      }
    }

    return this.transactionCategoryRepository.findBySlug('other', userAccount.id);
  }

  public async findByUid(uid: string, userAccountId: number): Promise<TransactionCategory | null> {
    return this.transactionCategoryRepository.findByUid(uid, userAccountId);
  }

  public async findAll(userAccountId: number): Promise<TransactionCategory[]> {
    return this.transactionCategoryRepository.findAll(userAccountId);
  }
}
