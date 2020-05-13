using Microsoft.EntityFrameworkCore.Migrations;

namespace ClinicAPI.Migrations
{
    public partial class UpdateCtMriFormModels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsNotContrastAgent",
                table: "MriForms",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsNotContrastMedicine",
                table: "CtForms",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsNotContrastAgent",
                table: "MriForms");

            migrationBuilder.DropColumn(
                name: "IsNotContrastMedicine",
                table: "CtForms");
        }
    }
}
