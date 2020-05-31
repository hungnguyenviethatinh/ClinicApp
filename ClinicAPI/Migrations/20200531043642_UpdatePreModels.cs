using Microsoft.EntityFrameworkCore.Migrations;

namespace ClinicAPI.Migrations
{
    public partial class UpdatePreModels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AfterBreakfast",
                table: "PrescriptionMedicines");

            migrationBuilder.DropColumn(
                name: "AfterDinner",
                table: "PrescriptionMedicines");

            migrationBuilder.DropColumn(
                name: "AfterLunch",
                table: "PrescriptionMedicines");

            migrationBuilder.DropColumn(
                name: "Afternoon",
                table: "PrescriptionMedicines");

            migrationBuilder.AlterColumn<int>(
                name: "TakeTimes",
                table: "PrescriptionMedicines",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "TakeTimes",
                table: "PrescriptionMedicines",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AfterBreakfast",
                table: "PrescriptionMedicines",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AfterDinner",
                table: "PrescriptionMedicines",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AfterLunch",
                table: "PrescriptionMedicines",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Afternoon",
                table: "PrescriptionMedicines",
                type: "int",
                nullable: true);
        }
    }
}
