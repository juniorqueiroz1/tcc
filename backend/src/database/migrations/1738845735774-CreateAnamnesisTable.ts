import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateAnamnesisTable implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "anamnesis",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "description",
            type: "text",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "appointmentId",
            type: "int",
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "anamnesis",
      new TableForeignKey({
        columnNames: ["appointmentId"],
        referencedColumnNames: ["id"],
        referencedTableName: "appointment",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("anamnesis");
  }
}
