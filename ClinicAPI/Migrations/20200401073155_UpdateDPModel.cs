using Microsoft.EntityFrameworkCore.Migrations;

namespace ClinicAPI.Migrations
{
    public partial class UpdateDPModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_DoctorPatients",
                table: "DoctorPatients");

            migrationBuilder.AddColumn<int>(
                name: "HistoryId",
                table: "DoctorPatients",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_DoctorPatients",
                table: "DoctorPatients",
                columns: new[] { "DoctorId", "PatientId", "HistoryId" });

            migrationBuilder.CreateIndex(
                name: "IX_DoctorPatients_HistoryId",
                table: "DoctorPatients",
                column: "HistoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorPatients_Histories_HistoryId",
                table: "DoctorPatients",
                column: "HistoryId",
                principalTable: "Histories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorPatients_Histories_HistoryId",
                table: "DoctorPatients");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DoctorPatients",
                table: "DoctorPatients");

            migrationBuilder.DropIndex(
                name: "IX_DoctorPatients_HistoryId",
                table: "DoctorPatients");

            migrationBuilder.DropColumn(
                name: "HistoryId",
                table: "DoctorPatients");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DoctorPatients",
                table: "DoctorPatients",
                columns: new[] { "DoctorId", "PatientId" });
        }
    }
}
