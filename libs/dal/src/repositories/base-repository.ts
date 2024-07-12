import { NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsOrderValue,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { OrderValue, PaginationLink } from '../types';

export abstract class BaseRepository<T extends { id?: unknown }> {
  private repo: Repository<T>;
  private DEFAULT_LIMIT = 250;
  private DEFAULT_OFFSET = 0;
  private DEFAULT_ORDER_BY: keyof T = 'id';
  private DEFAULT_SORT_DIRECTION: FindOptionsOrderValue = 'ASC';

  constructor(
    private target: EntityTarget<T>,
    private manager: EntityManager,
  ) {
    this.repo = manager.getRepository(target);
  }

  async getAll(options?: FindManyOptions<T>) {
    return this.repo.find(options);
  }

  async getOneById(id: number | string, options?: FindOneOptions<T>) {
    const entry = await this.repo.findOne({ where: { id } as FindOptionsWhere<T>, ...options });
    if (!entry) {
      return null;
    }

    return entry;
  }

  async getManyBy(filter: FindOptionsWhere<T>, options?: FindManyOptions<T>) {
    return this.repo.find({ where: filter, ...options });
  }

  async getOneBy(filter: FindOptionsWhere<T>, options?: FindOneOptions<T>) {
    return this.repo.findOne({ where: filter, ...options });
  }

  async updateOneById(id: number, data: QueryDeepPartialEntity<T>) {
    const entry = await this.getOneById(id);
    if (!entry) {
      throw new NotFoundException('Not found');
    }
    const updatedEntity = Object.assign(entry, data as DeepPartial<T>);
    await this.repo.save(updatedEntity);
  }

  async upsert(data: DeepPartial<T> & { id: number | string }) {
    let entity = await this.repo.findOneBy({ id: data.id } as FindOptionsWhere<T>);
    if (!entity) {
      entity = this.repo.create(data);
    } else {
      delete data.id;
      entity = Object.assign(entity, data);
    }
    await this.repo.save(entity);
  }

  async getWithLimitAndOffset(
    filter: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
    limit = this.DEFAULT_LIMIT,
    offset = this.DEFAULT_OFFSET,
    orderBy: keyof T = this.DEFAULT_ORDER_BY,
    sortBy: FindOptionsOrderValue = this.DEFAULT_SORT_DIRECTION,
  ): Promise<{ data: T[]; limit: number; offset: number; totalCount: number }> {
    const [data, count] = await this.repo.findAndCount({
      where: filter,
      skip: offset,
      take: limit,
      order: { [orderBy]: sortBy } as FindOptionsOrder<T>,
    });

    return {
      data,
      limit,
      offset,
      totalCount: count,
    };
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const newEntity = this.repo.create(data);
    await this.repo.save(newEntity);

    return newEntity;
  }

  createEntity(data: DeepPartial<T>): T {
    return this.repo.create(data);
  }

  async save(data: DeepPartial<T>) {
    return this.repo.save(data);
  }

  async createBulk(data: DeepPartial<T>[]): Promise<void> {
    const newEntities = this.repo.create(data);
    await this.repo.save(newEntities);
  }

  async delete(id: number) {
    await this.repo.delete({ id } as FindOptionsWhere<T>);
  }

  async replace(id: number, data: DeepPartial<T>) {
    const newEntity = this.repo.create(data);
    await this.manager.transaction(async (transactionEntityManager) => {
      transactionEntityManager.delete(this.target, { id } as FindOptionsWhere<T>);
      transactionEntityManager.save(newEntity);
    });
  }

  paginationLinks(totalItems: number, limit: number, offset: number, sortBy: string, orderBy: OrderValue) {
    const links: PaginationLink[] = [];
    const totalPages = Math.ceil(totalItems / limit);
    const maxPagesToShow = Math.min(5, totalPages);
    const startPage = Math.max(
      1,
      Math.min(offset / limit - Math.floor(maxPagesToShow / 2) + 1, totalPages - maxPagesToShow + 1),
    );
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    if (offset != 0) {
      links.push({ label: 'First', active: false, offset: 0 });
    }

    if (offset > 0) {
      const prevOffset = Math.max(offset - limit, 0);
      links.push({ label: 'Previous', active: false, offset: prevOffset });
    }

    for (let page = startPage; page <= endPage; page++) {
      const calculatedOffset = (page - 1) * limit;
      const label = page;
      const active = calculatedOffset === offset;
      links.push({ label, active, offset: calculatedOffset });
    }

    if (offset < (totalPages - 1) * limit) {
      const nextPage = Math.ceil((offset + 1) / limit) + 1;
      const nextOffset = nextPage > totalPages ? offset : nextPage * limit;
      links.push({ label: 'Next &raquo;', active: false, offset: nextOffset });
    }

    if (offset < (totalPages - 1) * limit) {
      const lastPageOffset = (totalPages - 1) * limit;
      links.push({ label: 'Last', active: offset === lastPageOffset, offset: lastPageOffset });
    }

    return links;
  }
}
