using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ClinicAPI.Migrations
{
    public partial class Initialize : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    SecurityStamp = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    FullName = table.Column<string>(nullable: true),
                    AdditionalInfo = table.Column<string>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    IsDeleted = table.Column<bool>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Diagnoses",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    IsDeleted = table.Column<bool>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Diagnoses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Medicines",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdCode = table.Column<string>(maxLength: 30, nullable: true),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    ExpiredDate = table.Column<string>(maxLength: 30, nullable: true),
                    NetWeight = table.Column<string>(maxLength: 30, nullable: true),
                    Quantity = table.Column<int>(nullable: true),
                    Unit = table.Column<string>(maxLength: 100, nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medicines", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OpenTimes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OpenClosedTime = table.Column<string>(maxLength: 100, nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OpenTimes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdCode = table.Column<string>(maxLength: 30, nullable: true),
                    OrderNumber = table.Column<int>(nullable: false),
                    FullName = table.Column<string>(maxLength: 100, nullable: false),
                    Age = table.Column<int>(nullable: false),
                    Gender = table.Column<int>(nullable: false),
                    Address = table.Column<string>(maxLength: 200, nullable: true),
                    PhoneNumber = table.Column<string>(unicode: false, maxLength: 100, nullable: true),
                    RelativePhoneNumber = table.Column<string>(unicode: false, maxLength: 100, nullable: true),
                    AppointmentDate = table.Column<DateTime>(nullable: true),
                    CheckedDate = table.Column<DateTime>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    IsDeleted = table.Column<bool>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Units",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 15, nullable: false),
                    IsDeleted = table.Column<bool>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Units", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    RoleId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Ingredients",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    MedicineId = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ingredients", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Ingredients_Medicines_MedicineId",
                        column: x => x.MedicineId,
                        principalTable: "Medicines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Histories",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Height = table.Column<string>(maxLength: 10, nullable: true),
                    Weight = table.Column<string>(maxLength: 10, nullable: true),
                    BloodPressure = table.Column<string>(maxLength: 10, nullable: true),
                    Pulse = table.Column<string>(maxLength: 10, nullable: true),
                    Other = table.Column<string>(maxLength: 100, nullable: true),
                    Note = table.Column<string>(maxLength: 100, nullable: true),
                    CheckedDate = table.Column<DateTime>(nullable: false),
                    IsChecked = table.Column<bool>(nullable: false),
                    PatientId = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Histories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Histories_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CtForms",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DiagnosisName = table.Column<string>(nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    PatientId = table.Column<int>(nullable: false),
                    DoctorId = table.Column<string>(nullable: false),
                    HistoryId = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false),
                    Type = table.Column<int>(nullable: false),
                    IsContrastMedicine = table.Column<bool>(nullable: false),
                    IsSkull = table.Column<bool>(nullable: false),
                    IsEarNoseThroat = table.Column<bool>(nullable: false),
                    IsCsNeck = table.Column<bool>(nullable: false),
                    IsCsChest = table.Column<bool>(nullable: false),
                    IsCsWaist = table.Column<bool>(nullable: false),
                    IsShoulder = table.Column<bool>(nullable: false),
                    IsElbow = table.Column<bool>(nullable: false),
                    IsWrist = table.Column<bool>(nullable: false),
                    IsSinus = table.Column<bool>(nullable: false),
                    IsGroin = table.Column<bool>(nullable: false),
                    IsKnee = table.Column<bool>(nullable: false),
                    IsAnkle = table.Column<bool>(nullable: false),
                    IsNeck = table.Column<bool>(nullable: false),
                    IsFoot = table.Column<bool>(nullable: false),
                    IsPelvis = table.Column<bool>(nullable: false),
                    IsChest = table.Column<bool>(nullable: false),
                    IsStomach = table.Column<bool>(nullable: false),
                    IsUrinary = table.Column<bool>(nullable: false),
                    IsUpperVein = table.Column<bool>(nullable: false),
                    UpperVein = table.Column<string>(nullable: true),
                    IsLowerVein = table.Column<bool>(nullable: false),
                    LowerVein = table.Column<string>(nullable: true),
                    IsOther = table.Column<bool>(nullable: false),
                    Other = table.Column<string>(nullable: true),
                    IsPregnant = table.Column<bool>(nullable: false),
                    IsAllergy = table.Column<bool>(nullable: false),
                    IsHeartDisease = table.Column<bool>(nullable: false),
                    IsBloodDisease = table.Column<bool>(nullable: false),
                    IsKidneyFailure = table.Column<bool>(nullable: false),
                    IsDiabetesMellitus = table.Column<bool>(nullable: false),
                    IsCoagulopathy = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CtForms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CtForms_AspNetUsers_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CtForms_Histories_HistoryId",
                        column: x => x.HistoryId,
                        principalTable: "Histories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CtForms_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DoctorPatientHistories",
                columns: table => new
                {
                    DoctorId = table.Column<string>(nullable: false),
                    PatientId = table.Column<int>(nullable: false),
                    HistoryId = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorPatientHistories", x => new { x.DoctorId, x.PatientId, x.HistoryId });
                    table.ForeignKey(
                        name: "FK_DoctorPatientHistories_AspNetUsers_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DoctorPatientHistories_Histories_HistoryId",
                        column: x => x.HistoryId,
                        principalTable: "Histories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DoctorPatientHistories_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MriForms",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DiagnosisName = table.Column<string>(nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    PatientId = table.Column<int>(nullable: false),
                    DoctorId = table.Column<string>(nullable: false),
                    HistoryId = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false),
                    IsSkull = table.Column<bool>(nullable: false),
                    IsHeadNeck = table.Column<bool>(nullable: false),
                    IsChest = table.Column<bool>(nullable: false),
                    IsStomachGroin = table.Column<bool>(nullable: false),
                    IsLimbs = table.Column<bool>(nullable: false),
                    IsNeckSpine = table.Column<bool>(nullable: false),
                    IsChestSpine = table.Column<bool>(nullable: false),
                    IsPelvisSpine = table.Column<bool>(nullable: false),
                    IsBloodVessel = table.Column<bool>(nullable: false),
                    IsOther = table.Column<bool>(nullable: false),
                    Other = table.Column<string>(nullable: true),
                    IsContrastAgent = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MriForms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MriForms_AspNetUsers_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MriForms_Histories_HistoryId",
                        column: x => x.HistoryId,
                        principalTable: "Histories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MriForms_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Prescriptions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdCode = table.Column<string>(maxLength: 30, nullable: true),
                    Diagnosis = table.Column<string>(nullable: true),
                    OtherDiagnosis = table.Column<string>(nullable: true),
                    Note = table.Column<string>(nullable: true),
                    Status = table.Column<int>(nullable: false),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    PatientId = table.Column<int>(nullable: false),
                    DoctorId = table.Column<string>(nullable: false),
                    HistoryId = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prescriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Prescriptions_AspNetUsers_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Prescriptions_Histories_HistoryId",
                        column: x => x.HistoryId,
                        principalTable: "Histories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Prescriptions_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TestForms",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DiagnosisName = table.Column<string>(nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    PatientId = table.Column<int>(nullable: false),
                    DoctorId = table.Column<string>(nullable: false),
                    HistoryId = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false),
                    IsBloodSample = table.Column<bool>(nullable: false),
                    IsPusSample = table.Column<bool>(nullable: false),
                    IsSputumSample = table.Column<bool>(nullable: false),
                    IsShitSample = table.Column<bool>(nullable: false),
                    HumourSample = table.Column<string>(nullable: true),
                    IsBloodGroup = table.Column<bool>(nullable: false),
                    IsBlood = table.Column<bool>(nullable: false),
                    IsVS = table.Column<bool>(nullable: false),
                    IsFeverTest = table.Column<bool>(nullable: false),
                    IsTs = table.Column<bool>(nullable: false),
                    IsTc = table.Column<bool>(nullable: false),
                    IsPt = table.Column<bool>(nullable: false),
                    IsAtpp = table.Column<bool>(nullable: false),
                    IsFibrinogen = table.Column<bool>(nullable: false),
                    IsDdimer = table.Column<bool>(nullable: false),
                    IsAso = table.Column<bool>(nullable: false),
                    IsCrp = table.Column<bool>(nullable: false),
                    IsRf = table.Column<bool>(nullable: false),
                    IsAna = table.Column<bool>(nullable: false),
                    IsAntiCcp = table.Column<bool>(nullable: false),
                    IsCortisol = table.Column<bool>(nullable: false),
                    IsProcal = table.Column<bool>(nullable: false),
                    IsFt4 = table.Column<bool>(nullable: false),
                    IsTsh = table.Column<bool>(nullable: false),
                    IsInterlukin6 = table.Column<bool>(nullable: false),
                    IsHbsAg = table.Column<bool>(nullable: false),
                    IsHbsQgE = table.Column<bool>(nullable: false),
                    IsAntiHiv = table.Column<bool>(nullable: false),
                    IsAnitHivE = table.Column<bool>(nullable: false),
                    IsAntiHcv = table.Column<bool>(nullable: false),
                    IsAntiHcvE = table.Column<bool>(nullable: false),
                    IsRpr = table.Column<bool>(nullable: false),
                    IsGlucose = table.Column<bool>(nullable: false),
                    IsHpA1c = table.Column<bool>(nullable: false),
                    IsUrea = table.Column<bool>(nullable: false),
                    IsCreatinine = table.Column<bool>(nullable: false),
                    IsUricAcid = table.Column<bool>(nullable: false),
                    IsAst = table.Column<bool>(nullable: false),
                    IsAlt = table.Column<bool>(nullable: false),
                    IsFBilirubin = table.Column<bool>(nullable: false),
                    IsBilirubin = table.Column<bool>(nullable: false),
                    IsGgt = table.Column<bool>(nullable: false),
                    IsProtein = table.Column<bool>(nullable: false),
                    IsAlbumin = table.Column<bool>(nullable: false),
                    IsTriglycerid = table.Column<bool>(nullable: false),
                    IsCholes = table.Column<bool>(nullable: false),
                    IsHdlCholes = table.Column<bool>(nullable: false),
                    IsLdlCholes = table.Column<bool>(nullable: false),
                    IsElectrolytes = table.Column<bool>(nullable: false),
                    IsCa = table.Column<bool>(nullable: false),
                    IsCpk = table.Column<bool>(nullable: false),
                    IsCkMb = table.Column<bool>(nullable: false),
                    IsTroponin = table.Column<bool>(nullable: false),
                    IsEthanol = table.Column<bool>(nullable: false),
                    IsEndoscopy = table.Column<bool>(nullable: false),
                    IsGram = table.Column<bool>(nullable: false),
                    IsZiehl = table.Column<bool>(nullable: false),
                    IsAntibiotic = table.Column<bool>(nullable: false),
                    IsUrine = table.Column<bool>(nullable: false),
                    IsAddis = table.Column<bool>(nullable: false),
                    IsProteinBj = table.Column<bool>(nullable: false),
                    IsProtein24h = table.Column<bool>(nullable: false),
                    IsUrea24h = table.Column<bool>(nullable: false),
                    IsUricAcid24h = table.Column<bool>(nullable: false),
                    IsCreat24h = table.Column<bool>(nullable: false),
                    IsElec24h = table.Column<bool>(nullable: false),
                    IsCa24h = table.Column<bool>(nullable: false),
                    IsKstRuot = table.Column<bool>(nullable: false),
                    IsKstMau = table.Column<bool>(nullable: false),
                    IsHcBc = table.Column<bool>(nullable: false),
                    IsDntProtein = table.Column<bool>(nullable: false),
                    IsDntGlucose = table.Column<bool>(nullable: false),
                    IsDntCtbc = table.Column<bool>(nullable: false),
                    IsDntAnti = table.Column<bool>(nullable: false),
                    IsDkProtein = table.Column<bool>(nullable: false),
                    IsDkGlucose = table.Column<bool>(nullable: false),
                    IsDkCtbc = table.Column<bool>(nullable: false),
                    IsDkAnti = table.Column<bool>(nullable: false),
                    IsDpbProtein = table.Column<bool>(nullable: false),
                    IsDpbRivalta = table.Column<bool>(nullable: false),
                    IsDpbCell = table.Column<bool>(nullable: false),
                    IsDpbAnti = table.Column<bool>(nullable: false),
                    OtherTest = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestForms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TestForms_AspNetUsers_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TestForms_Histories_HistoryId",
                        column: x => x.HistoryId,
                        principalTable: "Histories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TestForms_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "XqForms",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DiagnosisName = table.Column<string>(nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    PatientId = table.Column<int>(nullable: false),
                    DoctorId = table.Column<string>(nullable: false),
                    HistoryId = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false),
                    Request = table.Column<string>(nullable: true),
                    Note = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_XqForms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_XqForms_AspNetUsers_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_XqForms_Histories_HistoryId",
                        column: x => x.HistoryId,
                        principalTable: "Histories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_XqForms_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "XRayImages",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    Data = table.Column<string>(unicode: false, nullable: false),
                    LastModifiedDate = table.Column<DateTime>(nullable: false),
                    IsDeleted = table.Column<bool>(nullable: false),
                    HistoryId = table.Column<int>(nullable: false),
                    PatientId = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_XRayImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_XRayImages_Histories_HistoryId",
                        column: x => x.HistoryId,
                        principalTable: "Histories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_XRayImages_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PrescriptionMedicines",
                columns: table => new
                {
                    PrescriptionId = table.Column<int>(nullable: false),
                    MedicineId = table.Column<int>(nullable: false),
                    Ingredient = table.Column<string>(maxLength: 100, nullable: true),
                    NetWeight = table.Column<string>(maxLength: 30, nullable: true),
                    Quantity = table.Column<int>(nullable: true),
                    Unit = table.Column<string>(maxLength: 100, nullable: true),
                    TakePeriod = table.Column<string>(maxLength: 30, nullable: true),
                    TakeMethod = table.Column<string>(maxLength: 50, nullable: true),
                    TakeTimes = table.Column<int>(nullable: false),
                    AmountPerTime = table.Column<int>(nullable: true),
                    AfterBreakfast = table.Column<int>(nullable: true),
                    AfterLunch = table.Column<int>(nullable: true),
                    Afternoon = table.Column<int>(nullable: true),
                    AfterDinner = table.Column<int>(nullable: true),
                    Note = table.Column<string>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrescriptionMedicines", x => new { x.PrescriptionId, x.MedicineId });
                    table.ForeignKey(
                        name: "FK_PrescriptionMedicines_Medicines_MedicineId",
                        column: x => x.MedicineId,
                        principalTable: "Medicines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PrescriptionMedicines_Prescriptions_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_CtForms_DoctorId",
                table: "CtForms",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_CtForms_HistoryId",
                table: "CtForms",
                column: "HistoryId");

            migrationBuilder.CreateIndex(
                name: "IX_CtForms_PatientId",
                table: "CtForms",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorPatientHistories_HistoryId",
                table: "DoctorPatientHistories",
                column: "HistoryId");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorPatientHistories_PatientId",
                table: "DoctorPatientHistories",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Histories_PatientId",
                table: "Histories",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Ingredients_MedicineId",
                table: "Ingredients",
                column: "MedicineId");

            migrationBuilder.CreateIndex(
                name: "IX_MriForms_DoctorId",
                table: "MriForms",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_MriForms_HistoryId",
                table: "MriForms",
                column: "HistoryId");

            migrationBuilder.CreateIndex(
                name: "IX_MriForms_PatientId",
                table: "MriForms",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionMedicines_MedicineId",
                table: "PrescriptionMedicines",
                column: "MedicineId");

            migrationBuilder.CreateIndex(
                name: "IX_Prescriptions_DoctorId",
                table: "Prescriptions",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_Prescriptions_HistoryId",
                table: "Prescriptions",
                column: "HistoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Prescriptions_PatientId",
                table: "Prescriptions",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_TestForms_DoctorId",
                table: "TestForms",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_TestForms_HistoryId",
                table: "TestForms",
                column: "HistoryId");

            migrationBuilder.CreateIndex(
                name: "IX_TestForms_PatientId",
                table: "TestForms",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_XqForms_DoctorId",
                table: "XqForms",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_XqForms_HistoryId",
                table: "XqForms",
                column: "HistoryId");

            migrationBuilder.CreateIndex(
                name: "IX_XqForms_PatientId",
                table: "XqForms",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_XRayImages_HistoryId",
                table: "XRayImages",
                column: "HistoryId");

            migrationBuilder.CreateIndex(
                name: "IX_XRayImages_PatientId",
                table: "XRayImages",
                column: "PatientId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "CtForms");

            migrationBuilder.DropTable(
                name: "Diagnoses");

            migrationBuilder.DropTable(
                name: "DoctorPatientHistories");

            migrationBuilder.DropTable(
                name: "Ingredients");

            migrationBuilder.DropTable(
                name: "MriForms");

            migrationBuilder.DropTable(
                name: "OpenTimes");

            migrationBuilder.DropTable(
                name: "PrescriptionMedicines");

            migrationBuilder.DropTable(
                name: "TestForms");

            migrationBuilder.DropTable(
                name: "Units");

            migrationBuilder.DropTable(
                name: "XqForms");

            migrationBuilder.DropTable(
                name: "XRayImages");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "Medicines");

            migrationBuilder.DropTable(
                name: "Prescriptions");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Histories");

            migrationBuilder.DropTable(
                name: "Patients");
        }
    }
}
