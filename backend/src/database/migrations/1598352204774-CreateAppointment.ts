import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAppointment1598352204774 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'appointment',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'schedule_id',
            type: 'int',
          },
          {
            name: 'time',
            type: 'time',
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
          {
            name: 'observation',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'appointment',
      new TableForeignKey({
        name: 'appointment_user_id_fk',
        referencedTableName: 'account_user',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'appointment',
      new TableForeignKey({
        name: 'appointment_schedule_id_fk',
        referencedTableName: 'schedule',
        columnNames: ['schedule_id'],
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('appointment');
  }
}
