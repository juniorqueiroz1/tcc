import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDoctor1597933650301 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'doctor',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'crm',
            type: 'int',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'phone',
            type: 'varchar',
          },
          {
            name: 'speciality_id',
            type: 'int',
          },
          {
            name: 'password',
            type: 'varchar',
          }
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'doctor',
      new TableForeignKey({
        name: 'doctor_speciality_id_fk',
        referencedTableName: 'speciality',
        columnNames: ['speciality_id'],
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('doctor');
  }
}
