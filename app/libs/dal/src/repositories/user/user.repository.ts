// @ts-nocheck
import { AuthErrorEnum } from '@app/dal/enums';
import { BaseRepository } from '../base-repository';
import { UserEntity, UserExternalEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { DEFAULT_QUERY_LIMIT } from '@app/shared/constants';
import { OrderValue } from '@app/shared/types';
import * as crypto from 'crypto';
import { NotFoundException } from '@nestjs/common';

export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super(repository.target, repository.manager);
  }
}
