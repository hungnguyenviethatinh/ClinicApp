using System;
using System.Text.Json;
using ClinicApp.Core;
using ClinicApp.ViewModels;
using Chromely.Core.RestfulService;

namespace ClinicApp.Controllers
{
    [ControllerProperty(Name = "XqFormController", Route = "ctform")]
    public class XqFormController : ChromelyController
    {
        public XqFormController()
        {
            RegisterPostRequest("/xqform/print", PrintXqForm);
        }

        private ChromelyResponse PrintXqForm(ChromelyRequest request)
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
            XqFormViewModel xqForm = JsonSerializer.Deserialize<XqFormViewModel>(jsonString, new JsonSerializerOptions
            {
                AllowTrailingCommas = true,
                PropertyNameCaseInsensitive = true,
            });

            var doctor = xqForm.Doctor;
            var patient = xqForm.Patient;

            string appDirectory = AppDomain.CurrentDomain.BaseDirectory;
            string templateHtml = $"{appDirectory}/wwwroot/templates/xq.html";
            string html = Utils.ReadTemplate(templateHtml);

            string dayOfWeek = Utils.GetDayOfWeek(DateTime.Now);
            string date = DateTime.Now.Day.ToString();
            string month = DateTime.Now.Month.ToString();
            string year = DateTime.Now.Year.ToString();
            string time = DateTime.Now.ToString("HH:mm");

            html = html.Replace("{date}", date);
            html = html.Replace("{dayOfWeek}", dayOfWeek);
            html = html.Replace("{date}", date);
            html = html.Replace("{month}", month);
            html = html.Replace("{year}", year);
            html = html.Replace("{time}", time);

            string patientIdCode = $"{patient.Id}";
            html = html.Replace("{patientIdCode}", patientIdCode);

            string patientOrderNumber = $"{patient.OrderNumber}";
            html = html.Replace("{patientOrderNumber}", patientOrderNumber);

            string patientName = patient.FullName;
            html = html.Replace("{patientName}", patientName);

            string patientAge = patient.Age != 0 ?
                $"{patient.Age}" :
                ".......";
            html = html.Replace("{patientAge}", patientAge);

            if (patient.Gender.Equals(GenderConstants.Male, StringComparison.OrdinalIgnoreCase))
            {
                html = html.Replace("{isMale}", "checked").Replace("{isFemale}", "");
            }
            else if (patient.Gender.Equals(GenderConstants.Female, StringComparison.OrdinalIgnoreCase))
            {
                html = html.Replace("{isMale}", "").Replace("{isFemale}", "checked");
            }
            else
            {
                html = html.Replace("{isMale}", "").Replace("{isFemale}", "");
            }

            string patientAddress = !string.IsNullOrWhiteSpace(patient.Address) ?
                patient.Address :
                ".................................................................................................";
            html = html.Replace("{patientAddress}", patientAddress);

            string patientPhoneNumber = !string.IsNullOrWhiteSpace(patient.PhoneNumber) ?
                patient.PhoneNumber :
                "...............................................";
            html = html.Replace("{patientPhoneNumber}", patientPhoneNumber);

            string diagnosisName = !string.IsNullOrWhiteSpace(xqForm.DiagnosisName) ?
                xqForm.DiagnosisName :
                "..............................................................................." +
                "...............................................................................";
            html = html.Replace("{diagnosisName}", diagnosisName);

            string requestName = xqForm.Request.Replace("\n", "<br />");
            html = html.Replace("{request}", requestName);

            string note = !string.IsNullOrWhiteSpace(xqForm.Note) ?
                xqForm.Note.Replace("\n", "<br />") :
                "............................................................................................ " +
                "...................................................................................................................... " +
                "......................................................................................................................";
            html = html.Replace("{note}", note);

            string dateCreated = xqForm.DateCreated.Day.ToString();
            string monthCreated = xqForm.DateCreated.Month.ToString();
            string yearCreated = xqForm.DateCreated.Year.ToString();
            html = html
                .Replace("{dateCreated}", dateCreated)
                .Replace("{monthCreated}", monthCreated)
                .Replace("{yearCreated}", yearCreated);

            string doctorName = doctor.FullName.ToUpper();
            if (doctorName.Contains("TRẦN ĐĂNG KHOA"))
            {
                doctorName = doctorName.Replace("TRẦN ĐĂNG KHOA", "") + "&nbsp;<b>TRẦN ĐĂNG KHOA</b>";
            }
            html = html.Replace("{doctorName}", doctorName);

            string indexHtml = $"{appDirectory}/wwwroot/index.html";
            Utils.WriteTemplate(indexHtml, html);

            string url = $"file:///{appDirectory}/wwwroot/index.html";
            var converter = Utils.CreateA4Converter();
            string savePath = Utils.GetSavePath(appDirectory, "XQ");

            Utils.ConvertPdfFromUrl(converter, url, savePath);
            Utils.PrintPdf(savePath);

            ChromelyResponse response = new ChromelyResponse(request.Id)
            {
                Data = new
                {
                    Message = $"In phiếu chỉ định thành công lúc {DateTime.Now:dd/MM/yyyy HH:mm:ss}.",
                }
            };

            return response;
        }
    }
}
