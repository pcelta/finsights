import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAccount } from '../entities/user-account.entity';
import { UserAccountToken } from '../entities/user-account-token.entity';
import { UserAccountTokenRepository } from '../repositories/user-account-token.repository';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenRepository: UserAccountTokenRepository,
  ) {}

  async generateTokenPair(userAccount: UserAccount): Promise<{
    accessToken: string;
    refreshToken: string;
    tokens: UserAccountToken[];
  }> {
    const payload = { sub: userAccount.uid, email: userAccount.email };

    // Generate access token (7 days)
    const accessToken = this.jwtService.sign(payload);

    // For refresh token, we'll use the same secret but store it with longer expiry
    const refreshToken = this.jwtService.sign(payload);

    const accessTokenEntity = new UserAccountToken();
    accessTokenEntity.token = accessToken;
    accessTokenEntity.userAccount = userAccount;
    accessTokenEntity.type = 'access';
    accessTokenEntity.expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    );

    const refreshTokenEntity = new UserAccountToken();
    refreshTokenEntity.token = refreshToken;
    refreshTokenEntity.userAccount = userAccount;
    refreshTokenEntity.type = 'refresh';
    refreshTokenEntity.expiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    );

    await this.tokenRepository.save(accessTokenEntity);
    await this.tokenRepository.save(refreshTokenEntity);

    return {
      accessToken,
      refreshToken,
      tokens: [refreshTokenEntity, accessTokenEntity],
    };
  }

  async verifyAccessToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  async verifyRefreshToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    token: UserAccountToken;
  }> {
    const payload = await this.verifyRefreshToken(refreshToken);

    const tokenEntity = await this.tokenRepository.findByToken(refreshToken);
    if (!tokenEntity) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const newPayload = { sub: payload.sub, email: payload.email };
    const accessToken = this.jwtService.sign(newPayload);

    const accessTokenEntity = new UserAccountToken();
    accessTokenEntity.token = accessToken;
    accessTokenEntity.userAccount = tokenEntity.userAccount;
    accessTokenEntity.type = 'access';
    accessTokenEntity.expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    );

    await this.tokenRepository.save(accessTokenEntity);

    return { accessToken, token: accessTokenEntity };
  }
}
