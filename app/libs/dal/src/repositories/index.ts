import { UserEntity, UserRepository } from './user';

export * from './base-entity';
export * from './base-repository';

export const DAL_ENTITIES = [
  UserEntity,
];
export const DAL_REPOSITORIES = [
  UserRepository,
]
