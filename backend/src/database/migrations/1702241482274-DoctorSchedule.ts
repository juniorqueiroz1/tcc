import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class DoctorSchedule1702241482274 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'doctor_schedules',
                columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'doctor_id',
                    type: 'int',
                },
                {
                    name: 'weekday',
                    type: 'varchar',
                },
                {
                    name: 'start_time',
                    type: 'varchar',
                },
                {
                    name: 'end_time',
                    type: 'varchar',
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'deleted_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                ],
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
