using Microsoft.EntityFrameworkCore.Migrations;

namespace ClinicAPI.Migrations
{
    public partial class UpdateFormModels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IdCode",
                table: "XqForms",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdCode",
                table: "TestForms",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdCode",
                table: "MriForms",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdCode",
                table: "CtForms",
                maxLength: 30,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdCode",
                table: "XqForms");

            migrationBuilder.DropColumn(
                name: "IdCode",
                table: "TestForms");

            migrationBuilder.DropColumn(
                name: "IdCode",
                table: "MriForms");

            migrationBuilder.DropColumn(
                name: "IdCode",
                table: "CtForms");
        }
    }
}
