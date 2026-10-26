import { MigrationInterface, QueryRunner } from "typeorm";
export declare class InitialBankingSchema1793043831831 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
