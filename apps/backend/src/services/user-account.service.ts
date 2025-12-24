import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { UserAccount } from '../entities/user-account.entity';
import { UserAccountActivation } from '../entities/user-account-activation.entity';
import { UserAccountRepository } from '../repositories/user-account.repository';
import { UserAccountActivationRepository } from '../repositories/user-account-activation.repository';
import { EmailService } from './email.service';
import { TokenService } from './token.service';

@Injectable()
export class UserAccountService {
  constructor(
    private readonly userAccountRepository: UserAccountRepository,
    private readonly activationRepository: UserAccountActivationRepository,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(
    name: string,
    email: string,
    password: string,
    dob?: string,
  ): Promise<void> {
    if (!name || name.trim().length === 0) {
      throw new BadRequestException('Name is required');
    }
    if (!email || !this.isValidEmail(email)) {
      throw new BadRequestException('Valid email is required');
    }
    if (!password || password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    const existingUser =
      await this.userAccountRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userAccount = new UserAccount();
    userAccount.name = name.trim();
    userAccount.email = email.toLowerCase().trim();
    userAccount.password = hashedPassword;
    userAccount.status = 'awaiting-activation';
    if (dob) {
      userAccount.dob = new Date(dob);
    }

    await this.userAccountRepository.save(userAccount);

    const activationCode = randomUUID();
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const activationLink = `${frontendUrl}/activate/${activationCode}`;

    const activation = new UserAccountActivation();
    activation.userAccount = userAccount;
    activation.code = activationCode;
    activation.link = activationLink;
    activation.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.activationRepository.save(activation);

    await this.emailService.sendActivationEmail(
      userAccount.email,
      userAccount.name,
      activationLink,
    );
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{
    userAccount: UserAccount;
    tokens: any[];
  }> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const userAccount = await this.userAccountRepository.findByEmail(
      email.toLowerCase().trim(),
    );
    if (!userAccount) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userAccount.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (userAccount.status !== 'active') {
      throw new UnauthorizedException(
        `Account is ${userAccount.status}. Please activate your account.`,
      );
    }

    userAccount.lastLoggedInAt = new Date();
    await this.userAccountRepository.save(userAccount);

    const { tokens } = await this.tokenService.generateTokenPair(userAccount);

    return {
      userAccount,
      tokens: tokens.map((t) => ({
        type: t.type,
        token: t.token,
        expires_at: t.expiresAt,
      })),
    };
  }

  async activate(code: string): Promise<UserAccount> {
    const activation = await this.activationRepository.findByCode(code);

    if (!activation) {
      throw new NotFoundException('Invalid activation code');
    }

    if (activation.expiresAt < new Date()) {
      throw new BadRequestException('Activation link has expired');
    }

    if (activation.accessedAt) {
      throw new BadRequestException('Activation link has already been used');
    }

    activation.accessedAt = new Date();
    await this.activationRepository.save(activation);

    const userAccount = activation.userAccount;
    userAccount.status = 'active';
    await this.userAccountRepository.save(userAccount);

    return userAccount;
  }

  async findByUid(uid: string): Promise<UserAccount> {
    const userAccount = await this.userAccountRepository.findByUid(uid);
    if (!userAccount) {
      throw new NotFoundException('User account not found');
    }
    return userAccount;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
