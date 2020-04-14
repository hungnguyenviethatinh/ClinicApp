using Microsoft.EntityFrameworkCore.Migrations;

namespace ClinicAPI.Migrations
{
    public partial class UpdateRoleAdmin : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "Medicines");

            migrationBuilder.DropColumn(
                name: "ShortName",
                table: "Medicines");

            migrationBuilder.AlterColumn<int>(
                name: "Quantity",
                table: "Medicines",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "ExpiredDate",
                table: "Medicines",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AdditionalInfo",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpiredDate",
                table: "Medicines");

            migrationBuilder.DropColumn(
                name: "AdditionalInfo",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<int>(
                name: "Quantity",
                table: "Medicines",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Medicines",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "ShortName",
                table: "Medicines",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);
        }
    }
}
