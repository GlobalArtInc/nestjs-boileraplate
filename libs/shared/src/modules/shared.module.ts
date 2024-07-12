import { DAL_ENTITIES, DAL_REPOSITORIES } from "@app/dal";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature(DAL_ENTITIES)],
  providers: [...DAL_REPOSITORIES, ConfigService],
  exports: [TypeOrmModule.forFeature(DAL_ENTITIES), ...DAL_REPOSITORIES, ConfigService],
})
export class SharedModule {}