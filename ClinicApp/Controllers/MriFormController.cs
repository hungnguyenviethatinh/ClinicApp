using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using Chromely.Core.RestfulService;
using SelectPdf;
using System.Text.Json;
using ClinicApp.Core;
using ClinicApp.ViewModels;

namespace ClinicApp.Controllers
{
    [ControllerProperty(Name = "MriFormController", Route = "mriform")]
    public class MriFormController : ChromelyController
    {
        public MriFormController()
        {
            RegisterPostRequest("/mriform/print", PrintMriForm);
        }

        private ChromelyResponse PrintMriForm(ChromelyRequest request)
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
            MriFormViewModel mriForm = JsonSerializer.Deserialize<MriFormViewModel>(jsonString, new JsonSerializerOptions
            {
                AllowTrailingCommas = true,
                PropertyNameCaseInsensitive = true,
            });

            var doctor = mriForm.Doctor;
            var patient = mriForm.Patient;

            string appDirectory = AppDomain.CurrentDomain.BaseDirectory;
            string templateHtml = $"{appDirectory}/wwwroot/templates/mri.html";

            string html = "";
            using (StreamReader sr = new StreamReader(templateHtml, Encoding.UTF8))
            {
                html = sr.ReadToEnd();
            }

            string dayOfWeek = Utils.GetDayOfWeek(DateTime.Now);
            string date = DateTime.Now.Day.ToString();
            string month = DateTime.Now.Month.ToString();
            string year = DateTime.Now.Year.ToString();
            string hour = DateTime.Now.ToString("HH:mm");

            html = html.Replace("{date}", date);
            html = html.Replace("{dayOfWeek}", dayOfWeek);
            html = html.Replace("{date}", date);
            html = html.Replace("{month}", month);
            html = html.Replace("{year}", year);
            html = html.Replace("{hour}", hour);

            string patientId = $"{patient.IdCode}{patient.Id}";
            string patientOrderNumber = $"{patient.OrderNumber}";
            html = html.Replace("{patientId}", patientId);
            html = html.Replace("{patientOrderNumber}", patientOrderNumber);
            html = html.Replace("{patientName}", patient.FullName);
            html = html.Replace("{patientAge}", $"{patient.Age}");

            string genderHtml;
            if (patient.Gender.Equals(GenderConstants.Male, StringComparison.OrdinalIgnoreCase))
            {
                genderHtml =
                    @"<div class=""custom-control custom-checkbox"">
                      <input type=""checkbox"" class=""custom-control-input"" id=""nam"" checked>
                      <label class=""custom-control-label"" for=""nam"">Nam</label>
                    </div>
                    <div class=""custom-control custom-checkbox"">
                      <input type=""checkbox"" class=""custom-control-input"" id=""nu"">
                      <label class=""custom-control-label"" for=""nu"">Nữ</label>
                    </div>";
            }
            else if (patient.Gender.Equals(GenderConstants.Female, StringComparison.OrdinalIgnoreCase))
            {
                genderHtml =
                    @"<div class=""custom-control custom-checkbox"">
                      <input type=""checkbox"" class=""custom-control-input"" id=""nam"">
                      <label class=""custom-control-label"" for=""nam"">Nam</label>
                    </div>
                    <div class=""custom-control custom-checkbox"">
                      <input type=""checkbox"" class=""custom-control-input"" id=""nu"" checked>
                      <label class=""custom-control-label"" for=""nu"">Nữ</label>
                    </div>";
            }
            else
            {
                genderHtml =
                    @"<div class=""custom-control custom-checkbox"">
                      <label class=""custom-control-label"" for=""nam"">Nam</label>
                      <input type=""checkbox"" class=""custom-control-input"" id=""nam"">
                    </div>
                    <div class=""custom-control custom-checkbox"">
                      <label class=""custom-control-label"" for=""nu"">Nữ</label>
                      <input type=""checkbox"" class=""custom-control-input"" id=""nu"">
                    </div>";
            }

            html = html.Replace("{patientGender}", genderHtml);
            html = html.Replace("{patientAddress}", patient.Address);
            html = html.Replace("{patientPhone}", patient.PhoneNumber);
            html = html.Replace("{patientDiagnosisName}", mriForm.DiagnosisName);


            string indexHtml = $"{appDirectory}/wwwroot/index.html";
            using (StreamWriter sw = new StreamWriter(indexHtml, false, Encoding.UTF8))
            {
                sw.WriteLine(html);
            }

            Process.Start(indexHtml);

            string url = $"file:///{appDirectory}/wwwroot/index.html";

            HtmlToPdf converter = new HtmlToPdf();
            converter.Options.PdfPageSize = PdfPageSize.A5;
            converter.Options.PdfPageOrientation = PdfPageOrientation.Portrait;
            converter.Options.WebPageWidth = 600;

            string patientIdCode = string.Concat(patient.IdCode, patient.Id);
            string patientName = patient.FullName;
            string createdTime = DateTime.Now.ToString("HHmmssddMMyyyy");
            string saveFile = $"{patientIdCode}_{patientName}_{createdTime}.pdf";
            string saveDirectory = $"{appDirectory}\\BenhNhan";
            string savePath = $"{saveDirectory}\\{saveFile}";

            PdfDocument pdf = converter.ConvertUrl(url);
            pdf.Save(savePath);
            pdf.Close();

            //ProcessStartInfo info = new ProcessStartInfo(savePath)
            //{
            //    Verb = "Print",
            //    CreateNoWindow = true,
            //    WindowStyle = ProcessWindowStyle.Hidden
            //};
            //Process.Start(info);

            ChromelyResponse response = new ChromelyResponse(request.Id)
            {
                Data = new
                {
                    Message = $"In phiếu chỉ định thành công lúc {DateTime.Now.ToString()}.",
                }
            };

            return response;
        }
    }
}
