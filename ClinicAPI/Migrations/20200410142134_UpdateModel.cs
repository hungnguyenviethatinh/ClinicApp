using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ClinicAPI.Migrations
{
    public partial class UpdateModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "XRayImages",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "XRayImages",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "XRayImages",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "XRayImages",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "DoctorPatientHistories",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "DoctorPatientHistories",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "DoctorPatientHistories",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "DoctorPatientHistories",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "XRayImages");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "XRayImages");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "XRayImages");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "XRayImages");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "DoctorPatientHistories");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "DoctorPatientHistories");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "DoctorPatientHistories");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "DoctorPatientHistories");
        }
    }
}
