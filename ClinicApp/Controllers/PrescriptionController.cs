using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using Chromely.Core.RestfulService;
using SelectPdf;
using System.Text.Json;
using ClinicApp.ViewModels;

namespace ClinicApp.Controllers
{
    [ControllerProperty(Name = "PrescriptionController", Route = "prescription")]
    public class PrescriptionController : ChromelyController
    {
        public PrescriptionController()
        {
            RegisterPostRequest("/prescription/print", PrintPrescription);
        }

        private ChromelyResponse PrintPrescription(ChromelyRequest request)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            if (request.PostData == null)
            {
                throw new Exception("Post data is null or invalid.");
            }

            string jsonString = request.PostData.ToString();
            PrescriptionViewModel data = JsonSerializer.Deserialize<PrescriptionViewModel>(jsonString, new JsonSerializerOptions
            {
                AllowTrailingCommas = true,
                PropertyNameCaseInsensitive = true,
            });

            var doctor = data.Doctor;
            var patient = data.Patient;
            var prescription = data.Prescription;
            var medicines = data.Medicines;
            var openTimes = data.OpenTimes;

            string dots = "............";
            string threeDots = "...";

            string date = DateTime.Now.ToString("dd-MM-yyyy");
            string time = DateTime.Now.ToString("HH:mm");
            //string dateOfBirth = patient.DateOfBirth != null ? patient.DateOfBirth.ToString() : dots;
            //string age = !string.IsNullOrWhiteSpace(patient.Age) ? patient.Age : dots;
            string address = !string.IsNullOrWhiteSpace(patient.Address) ? patient.Address : dots;
            string phoneNumber = !string.IsNullOrWhiteSpace(patient.PhoneNumber) ? patient.PhoneNumber : dots;
            string appointedDate = !string.IsNullOrWhiteSpace(patient.AppointmentDate) ? patient.AppointmentDate : dots;
            string prescriptionNote = !string.IsNullOrWhiteSpace(prescription.Note) ? prescription.Note : dots;

            string appDirectory = AppDomain.CurrentDomain.BaseDirectory;
            string templateHtml = $"{appDirectory}/wwwroot/templates/prescription.html";

            string html = "";
            using (StreamReader sr = new StreamReader(templateHtml, Encoding.UTF8))
            {
                html = sr.ReadToEnd();
            }

            html = html.Replace("{patient.Id}", $"{patient.IdCode}{patient.Id}");
            html = html.Replace("{date}", date);
            html = html.Replace("{time}", time);
            html = html.Replace("{patient.FullName}", patient.FullName);
            html = html.Replace("{patient.Age}", $"{patient.Age}");
            html = html.Replace("{patient.Gender}", patient.Gender);
            html = html.Replace("{patient.Address}", address);
            html = html.Replace("{patient.PhoneNumber}", phoneNumber);
            html = html.Replace("{prescription.Diagnosis}", $"{prescription.Diagnosis}, {prescription.OtherDiagnosis}");

            string medicineHtmls = "";
            if (medicines != null && medicines.Count > 0)
            {
                if (medicines.Count >= 10)
                {
                    html = html.Replace("1280px", "100%");
                }

                int index = 1;
                foreach (var medicine in medicines)
                {
                    string medicineHtml =
                    @"<div class=""col-1"">
                            <p class=""mb-0"" style=""padding-left: 10px;"">{index}</p>
                        </div>
                        <div class=""col-5"">
                            <p class=""mb-0"" style=""font-weight: bolder;"">{medicine.Name}</p>
                        </div>
                        <div class=""col-3"">
                            <p class=""mb-0"" style=""font-weight: bolder; text-align: center;"">{medicine.Quantity}</p>
                        </div>
                        <div class=""col-2"">
                            <p class=""mb-0"" style=""font-weight: bolder; text-align: center;"">{medicine.Unit}</p>
                        </div>
                        <div class=""col-1""></div>
                        <div class=""col-1""></div>
                        <div class=""col-8"">
                            <p class=""mb-0"" style=""font-style: italic;"">
                                {medicine}
                            </p>
                        </div>
                        <div class=""col-3"">
                            <p class=""mb-0"" style=""font-style: italic;""><u>Lưu ý:</u> {medicine.Note}</p>
                        </div>";

                    string ingredient = !string.IsNullOrWhiteSpace(medicine.Ingredient) ? $"{medicine.Ingredient}" : "";

                    medicineHtml = medicineHtml.Replace("{index}", $"{index}");
                    medicineHtml = medicineHtml.Replace("{medicine.Name}", $"{medicine.MedicineName} {medicine.NetWeight} ({ingredient})");
                    medicineHtml = medicineHtml.Replace("{medicine.Quantity}", medicine.Quantity.ToString());
                    medicineHtml = medicineHtml.Replace("{medicine.Unit}", medicine.Unit);

                    string takePeriod = medicine.TakePeriod;
                    if (takePeriod.Equals(TakePeriodConstants.Day, StringComparison.OrdinalIgnoreCase))
                    {
                        string medicinePerDayHtml = "Ngày {medicine.TakeMethod}: <u>{medicine.TakeTimes} lần</u>, Sáng: <u>{medicine.AfterBreakfast}</u> {medicine.Unit}, Trưa: <u>{medicine.AfterLunch}</u> {medicine.Unit}, Chiều: <u>{medicine.Afternoon}</u> {medicine.Unit}, Tối: <u>{medicine.AfterDinner}</u> {medicine.Unit}";
                        
                        string afterBreakfast = medicine.AfterBreakfast != null ? medicine.AfterBreakfast.ToString() : threeDots;
                        string afterLunch = medicine.AfterLunch != null ? medicine.AfterLunch.ToString() : threeDots;
                        string afternoon = medicine.Afternoon != null ? medicine.Afternoon.ToString() : threeDots;
                        string afterDinner = medicine.AfterDinner != null ? medicine.AfterDinner.ToString() : threeDots;
                        medicinePerDayHtml = medicinePerDayHtml.Replace("{medicine.TakeMethod}", medicine.TakeMethod);
                        medicinePerDayHtml = medicinePerDayHtml.Replace("{medicine.TakeTimes}", $"{medicine.TakeTimes}");
                        medicinePerDayHtml = medicinePerDayHtml.Replace("{medicine.AfterBreakfast}", afterBreakfast);
                        medicinePerDayHtml = medicinePerDayHtml.Replace("{medicine.AfterLunch}", afterLunch);
                        medicinePerDayHtml = medicinePerDayHtml.Replace("{medicine.Afternoon}", afternoon);
                        medicinePerDayHtml = medicinePerDayHtml.Replace("{medicine.AfterDinner}", afterDinner);
                        medicinePerDayHtml = medicinePerDayHtml.Replace("{medicine.Unit}", medicine.Unit);

                        medicineHtml = medicineHtml.Replace("{medicine}", medicinePerDayHtml);
                    } 
                    else
                    {
                        string medicineByPeriodHtml = "{medicine.TakePeriod} {medicine.TakeMethod}: {medicine.TakeTimes} lần, Mỗi lần dùng: {medicine.AmountPerTime} {medicine.Unit}";

                        string ammountPerTime = medicine.AmountPerTime != null ? medicine.AmountPerTime.ToString() : threeDots;
                        medicineByPeriodHtml = medicineByPeriodHtml.Replace("{medicine.TakePeriod}", medicine.TakePeriod);
                        medicineByPeriodHtml = medicineByPeriodHtml.Replace("{medicine.TakeMethod}", medicine.TakeMethod);
                        medicineByPeriodHtml = medicineByPeriodHtml.Replace("{medicine.TakeTimes}", $"{medicine.TakeTimes}");
                        medicineByPeriodHtml = medicineByPeriodHtml.Replace("{medicine.AmountPerTime}", ammountPerTime);
                        medicineByPeriodHtml = medicineByPeriodHtml.Replace("{medicine.Unit}", medicine.Unit);

                        medicineHtml = medicineHtml.Replace("{medicine}", medicineByPeriodHtml);
                    }
                    
                    string note = !string.IsNullOrWhiteSpace(medicine.Note) ? medicine.Note : dots;
                    medicineHtml = medicineHtml.Replace("{medicine.Note}", note);

                    medicineHtmls += medicineHtml;
                    index++;
                }
            }

            html = html.Replace("{medicines}", medicineHtmls);
            html = html.Replace("{prescription.Note}", prescriptionNote);
            html = html.Replace("{patient.AppointedDate}", appointedDate);
            html = html.Replace("{doctor.FullName}", doctor.FullName);

            if (openTimes.Count > 0)
            {
                string openTimeHtmls = "";
                foreach(var openTime in openTimes)
                {
                    openTimeHtmls += $"<p>{openTime.OpenClosedTime}</p>";
                }
                html = html.Replace("{openTimes}", openTimeHtmls);
            }
            else
            {
                html = html.Replace("{openTimes}", "");
            }

            string indexHtml = $"{appDirectory}/wwwroot/index.html";
            using (StreamWriter sw = new StreamWriter(indexHtml, false, Encoding.UTF8))
            {
                sw.WriteLine(html);
            }

            string url = $"file:///{appDirectory}/wwwroot/index.html";
            HtmlToPdf converter = new HtmlToPdf();
            converter.Options.PdfPageSize = PdfPageSize.Letter;
            converter.Options.PdfPageOrientation = PdfPageOrientation.Portrait;
            converter.Options.WebPageWidth = 1024;
            converter.Options.WebPageHeight = 1280;
            if (medicines.Count >= 10)
            {
                converter.Options.WebPageHeight = 0;
            }

            string patientId = string.Concat("DKC-DT", patient.Id);
            string patientName = patient.FullName;
            string createdTime = DateTime.Now.ToString("HHmmssddMMyyyy");
            string saveFile = $"{patientId}_{patientName}_{createdTime}.pdf";

            //string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
            //string saveDirectory = $"{desktopPath}\\DonThuoc";
            string saveDirectory = $"{appDirectory}\\DonThuoc";

            string savePath = $"{saveDirectory}\\{saveFile}";
            PdfDocument pdf = converter.ConvertUrl(url);
            pdf.Save(savePath);
            pdf.Close();

            ProcessStartInfo info = new ProcessStartInfo(savePath)
            {
                Verb = "Print",
                CreateNoWindow = true,
                WindowStyle = ProcessWindowStyle.Hidden
            };
            Process.Start(info);

            ChromelyResponse response = new ChromelyResponse(request.Id)
            {
                Data = new
                {
                    //Message = $"Đã lưu đơn thuốc tại {savePath}",
                    Message = $"In đơn thuốc thành công!",
                }
            };

            return response;
        }
    }
}

public static class TakePeriodConstants
{
    public const string Day = "Ngày";
    public const string Week = "Tuần";
    public const string Month = "Tháng";
}
