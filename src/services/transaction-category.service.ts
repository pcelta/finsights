import { Injectable } from '@nestjs/common';
import Ajv from 'ajv';
import { TransactionCategoryRepository } from '../repositories/transaction-category.repository';
import { TransactionCategory } from '../entities/transaction-category.entity';

@Injectable()
export class TransactionCategoryService {
  private ajv: Ajv;
  private categories: TransactionCategory[]|null;

  constructor(
    private readonly transactionCategoryRepository: TransactionCategoryRepository,
  ) {
    this.ajv = new Ajv({ strict: false });
  }

  private async getCategories(): Promise<TransactionCategory[] | null> {
    if (this.categories) {
      return this.categories;
    }
    this.categories = await this.transactionCategoryRepository.findAllWithRules();

    return this.categories;
  }

  public async findOut(
    transactionDescription: string,
  ): Promise<TransactionCategory | null> {
    const categories = await this.getCategories();
    const schemaTemplate = {
      type: "string",
    };

    for (const category of categories ?? []) {
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

    return this.transactionCategoryRepository.findBySlug('other');
  }

  public async findByUid(uid: string): Promise<TransactionCategory | null> {
    return this.transactionCategoryRepository.findByUid(uid);
  }

  public async findAll(): Promise<TransactionCategory[]> {
    return this.transactionCategoryRepository.findAll();
  }
}
