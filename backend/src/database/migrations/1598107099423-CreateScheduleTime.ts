import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateScheduleTime1598107099423 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'schedule_time',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'time',
            type: 'time',
          },
          {
            name: 'is_available',
            type: 'boolean',
          },
          {
            name: 'schedule_id',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'schedule_time',
      new TableForeignKey({
        name: 'schedule_time_schedule_id_fk',
        referencedTableName: 'schedule',
        columnNames: ['schedule_id'],
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('schedule_time');
  }
}
