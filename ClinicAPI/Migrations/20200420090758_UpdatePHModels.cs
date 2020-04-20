using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ClinicAPI.Migrations
{
    public partial class UpdatePHModels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AddColumn<DateTime>(
                name: "CheckedDate",
                table: "Histories",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.RenameColumn(
                name: "BloodPresure",
                table: "Histories",
                newName: "BloodPressure");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CheckedDate",
                table: "Histories");

            migrationBuilder.RenameColumn(
                name: "BloodPresure",
                table: "Histories",
                newName: "BloodPressure");
        }
    }
}
