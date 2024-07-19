import { UserEntity, UserRepository } from '@app/dal/repositories/user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly userRepository: UserRepository) {}
  getHello(): Promise<UserEntity[]> {
    return this.userRepository.getAll();
  }
}
