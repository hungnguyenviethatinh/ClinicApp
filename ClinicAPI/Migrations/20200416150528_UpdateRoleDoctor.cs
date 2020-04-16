using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ClinicAPI.Migrations
{
    public partial class UpdateRoleDoctor : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "PrescriptionMedicines");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateCreated",
                table: "Prescriptions",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Quantity",
                table: "PrescriptionMedicines",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateCreated",
                table: "Prescriptions");

            migrationBuilder.AlterColumn<int>(
                name: "Quantity",
                table: "PrescriptionMedicines",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "PrescriptionMedicines",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
