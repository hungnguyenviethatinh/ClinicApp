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
    [ControllerProperty(Name = "DemoController", Route = "prescription")]
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

            string date = DateTime.Now.ToString("dd-MM-yyyy");
            string time = DateTime.Now.ToString("HH:mm");
            string dateOfBirth = patient.DateOfBirth != null ? patient.DateOfBirth.ToString() : "......";
            string address = !string.IsNullOrWhiteSpace(patient.Address) ? patient.Address : "............";
            string phoneNumber = !string.IsNullOrWhiteSpace(patient.PhoneNumber) ? patient.PhoneNumber : "............";
            string appointedDate = !string.IsNullOrWhiteSpace(patient.AppointmentDate) ? patient.AppointmentDate : "............";
            string prescriptionNote = !string.IsNullOrWhiteSpace(prescription.Note) ? prescription.Note : "............";

            string appDirectory = AppDomain.CurrentDomain.BaseDirectory;
            string templateHtml = $"{appDirectory}/wwwroot/templates/prescription.html";

            string html = "";
            using (StreamReader sr = new StreamReader(templateHtml, Encoding.UTF8))
            {
                html = sr.ReadToEnd();
            }

            html = html.Replace("{patient.Id}", patient.Id);
            html = html.Replace("{date}", date);
            html = html.Replace("{time}", time);
            html = html.Replace("{patient.FullName}", patient.FullName);
            html = html.Replace("{patient.DateOfBirth}", dateOfBirth);
            html = html.Replace("{patient.Gender}", patient.Gender);
            html = html.Replace("{patient.Address}", address);
            html = html.Replace("{patient.PhoneNumber}", phoneNumber);
            html = html.Replace("{prescription.Diagnosis}", prescription.Diagnosis);

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
                                Ngày uống: <u>{medicine.TimesPerDay} {medicine.Unit}</u>, Sáng: <u>{medicine.AfterBreakfast}</u> {medicine.Unit}, Trưa: <u>{medicine.AfterLunch}</u> {medicine.Unit}, Chiều: <u>{medicine.Afternoon}</u> {medicine.Unit}, Tối: <u>{medicine.AfterDinner}</u> {medicine.Unit}
                            </p>
                        </div>
                        <div class=""col-3"">
                            <p class=""mb-0"" style=""font-style: italic;""><u>Lưu ý:</u> {medicine.Note}</p>
                        </div>";

                    medicineHtml = medicineHtml.Replace("{index}", index.ToString());
                    medicineHtml = medicineHtml.Replace("{medicine.Name}", medicine.MedicineName);
                    medicineHtml = medicineHtml.Replace("{medicine.Quantity}", medicine.Quantity.ToString());
                    medicineHtml = medicineHtml.Replace("{medicine.Unit}", medicine.Unit);

                    string timesPerDay = medicine.TimesPerDay != null ? medicine.TimesPerDay.ToString() : "...";
                    string afterBreakfast = medicine.AfterBreakfast != null ? medicine.AfterBreakfast.ToString() : "...";
                    string afterLunch = medicine.AfterLunch != null ? medicine.AfterLunch.ToString() : "...";
                    string afternoon = medicine.Afternoon != null ? medicine.Afternoon.ToString() : "...";
                    string afterDinner = medicine.AfterDinner != null ? medicine.AfterDinner.ToString() : "...";
                    string note = !string.IsNullOrWhiteSpace(medicine.Note) ? medicine.Note : "............";
                    medicineHtml = medicineHtml.Replace("{medicine.TimesPerDay}", timesPerDay);
                    medicineHtml = medicineHtml.Replace("{medicine.AfterBreakfast}", afterBreakfast);
                    medicineHtml = medicineHtml.Replace("{medicine.AfterLunch}", afterLunch);
                    medicineHtml = medicineHtml.Replace("{medicine.Afternoon}", afternoon);
                    medicineHtml = medicineHtml.Replace("{medicine.AfterDinner}", afterDinner);
                    medicineHtml = medicineHtml.Replace("{medicine.Note}", note);

                    medicineHtmls += medicineHtml;
                    index++;
                }
            }
            html = html.Replace("{medicines}", medicineHtmls);
            html = html.Replace("{prescription.Note}", prescriptionNote);
            html = html.Replace("{patient.AppointedDate}", appointedDate);
            html = html.Replace("{doctor.FullName}", doctor.FullName);

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

            string savePath = $"saves\\DonThuoc_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.pdf";
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

            ChromelyResponse response = new ChromelyResponse();

            return response;
        }
    }
}
