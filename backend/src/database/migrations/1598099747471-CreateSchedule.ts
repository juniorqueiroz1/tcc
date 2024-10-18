import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateSchedule1598099747471 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'schedule',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'date',
            type: 'date',
          },
          {
            name: 'doctor_id',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'schedule',
      new TableForeignKey({
        name: 'schedule_doctor_id_fk',
        referencedTableName: 'doctor',
        columnNames: ['doctor_id'],
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('schedule');
  }
}
