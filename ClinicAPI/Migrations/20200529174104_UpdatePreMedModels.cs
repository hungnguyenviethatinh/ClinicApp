using Microsoft.EntityFrameworkCore.Migrations;

namespace ClinicAPI.Migrations
{
    public partial class UpdatePreMedModels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "PrescriptionMedicines",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MealTime",
                table: "PrescriptionMedicines",
                maxLength: 30,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MealTime",
                table: "PrescriptionMedicines");

            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "PrescriptionMedicines",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);
        }
    }
}
