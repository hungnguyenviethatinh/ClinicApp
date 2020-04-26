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
    [ControllerProperty(Name = "PatientController", Route = "patient")]
    public class PatientController : ChromelyController
    {
        public PatientController()
        {
            RegisterPostRequest("/patient/print", PrintPatient);
        }

        private ChromelyResponse PrintPatient(ChromelyRequest request)
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
            PatientViewModel patient = JsonSerializer.Deserialize<PatientViewModel>(jsonString, new JsonSerializerOptions
            {
                AllowTrailingCommas = true,
                PropertyNameCaseInsensitive = true,
            });

            var doctors = patient.Doctors;

            string dayOfWeek = Utils.GetDayOfWeek(DateTime.Now);
            string date = DateTime.Now.Day.ToString();
            string month = DateTime.Now.Month.ToString();
            string year = DateTime.Now.Year.ToString();
            string hour = DateTime.Now.ToString("HH:mm");

            string address = !string.IsNullOrWhiteSpace(patient.Address) ? patient.Address :
                ".......................................................................................................................................................................";
            string phoneNumber = !string.IsNullOrWhiteSpace(patient.PhoneNumber) ? patient.PhoneNumber :
                ".................................................................";
            string relativePhoneNumber = !string.IsNullOrWhiteSpace(patient.RelativePhoneNumber) ? patient.RelativePhoneNumber :
                ".......................................................";

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
                      <input type=""checkbox"" class=""custom-control-input"" id=""nam"" checked>
                    </div>
                    <div class=""custom-control custom-checkbox"">
                      <label class=""custom-control-label"" for=""nu"">Nữ</label>
                      <input type=""checkbox"" class=""custom-control-input"" id=""nu"">
                    </div>";
            }

            string statusHtml;
            if (patient.Status.Equals(PatientStatusConstants.IsNew, StringComparison.OrdinalIgnoreCase))
            {
                statusHtml =
                    @"<div class=""custom-control custom-checkbox"">
                          <label class=""custom-control-label"" for=""kham-lan-dau"">Khám lần đầu</label>
                          <input type=""checkbox"" class=""custom-control-input"" id=""kham-lan-dau"" checked>
                      </div>
                      <div class=""custom-control custom-checkbox"">
                          <label class=""custom-control-label"" for=""tai-kham"">Tái khám</label>
                          <input type=""checkbox"" class=""custom-control-input"" id=""tai-kham"">
                      </div>
                      <div class=""custom-control custom-checkbox"">
                          <label class=""custom-control-label"" for=""bs-ho-so"">BS Hồ Sơ</label>
                          <input type=""checkbox"" class=""custom-control-input"" id=""bs-ho-so"">
                      </div>";
            }
            else if (patient.Status.Equals(PatientStatusConstants.IsRechecking, StringComparison.OrdinalIgnoreCase))
            {
                statusHtml =
                    @"<div class=""custom-control custom-checkbox"">
                          <label class=""custom-control-label"" for=""kham-lan-dau"">Khám lần đầu</label>
                          <input type=""checkbox"" class=""custom-control-input"" id=""kham-lan-dau"">
                      </div>
                      <div class=""custom-control custom-checkbox"">
                          <label class=""custom-control-label"" for=""tai-kham"">Tái khám</label>
                          <input type=""checkbox"" class=""custom-control-input"" id=""tai-kham"" checked>
                      </div>
                      <div class=""custom-control custom-checkbox"">
                          <label class=""custom-control-label"" for=""bs-ho-so"">BS Hồ Sơ</label>
                          <input type=""checkbox"" class=""custom-control-input"" id=""bs-ho-so"">
                      </div>";
            }
            else if (patient.Status.Equals(PatientStatusConstants.IsToAddDocs, StringComparison.OrdinalIgnoreCase))
            {
                statusHtml =
                    @"<div class=""custom-control custom-checkbox"">
                          <label class=""custom-control-label"" for=""kham-lan-dau"">Khám lần đầu</label>
                          <input type=""checkbox"" class=""custom-control-input"" id=""kham-lan-dau"">
                      </div>
                      <div class=""custom-control custom-checkbox"">
                          <label class=""custom-control-label"" for=""tai-kham"">Tái khám</label>
                          <input type=""checkbox"" class=""custom-control-input"" id=""tai-kham"">
                      </div>
                      <div class=""custom-control custom-checkbox"">
                          <label class=""custom-control-label"" for=""bs-ho-so"">BS Hồ Sơ</label>
                          <input type=""checkbox"" class=""custom-control-input"" id=""bs-ho-so"" checked>
                      </div>";
            }
            else
            {
                statusHtml =
                    @"<div class=""custom-control custom-checkbox"">
                          <label class=""custom-control-label"" for=""kham-lan-dau"">Khám lần đầu</label>
                          <input type=""checkbox"" class=""custom-control-input"" id=""kham-lan-dau"">
                      </div>
                      <div class=""custom-control custom-checkbox"">
                          <label class=""custom-control-label"" for=""tai-kham"">Tái khám</label>
                          <input type=""checkbox"" class=""custom-control-input"" id=""tai-kham"">
                      </div>
                      <div class=""custom-control custom-checkbox"">
                          <label class=""custom-control-label"" for=""bs-ho-so"">BS Hồ Sơ</label>
                          <input type=""checkbox"" class=""custom-control-input"" id=""bs-ho-so"">
                      </div>";
            }

            string appointmentHtml;
            if (!string.IsNullOrWhiteSpace(patient.AppointmentDate))
            {
                appointmentHtml =
                @"<u class=""font-weight-bold"">Tái khám :</u>........................................., Thứ {thu}, ngày {ngay} tháng {thang} năm {nam}.";

                DateTime appointedDate = DateTime.ParseExact(patient.AppointmentDate, "dd-MM-yyyy HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
                string thu = Utils.GetDayOfWeek(appointedDate);
                string ngay = appointedDate.Day.ToString();
                string thang = appointedDate.Month.ToString();
                string nam = appointedDate.Year.ToString();

                appointmentHtml = appointmentHtml.Replace("{thu}", thu);
                appointmentHtml = appointmentHtml.Replace("{ngay}", ngay);
                appointmentHtml = appointmentHtml.Replace("{thang}", thang);
                appointmentHtml = appointmentHtml.Replace("{nam}", nam);

            }
            else
            {
                appointmentHtml =
                @"<u class=""font-weight-bold"">Tái khám :</u>........................................., Thứ ........, ngày .......... tháng .......... năm 20............";
            }

            string appDirectory = AppDomain.CurrentDomain.BaseDirectory;
            string templateHtml = $"{appDirectory}/wwwroot/templates/mautiepnhan.html";

            string html = "";
            using (StreamReader sr = new StreamReader(templateHtml, Encoding.UTF8))
            {
                html = sr.ReadToEnd();
            }

            html = html.Replace("{patientId}", $"{patient.IdCode}{patient.Id}");
            html = html.Replace("{date}", date);
            html = html.Replace("{dayOfWeek}", dayOfWeek);
            html = html.Replace("{date}", date);
            html = html.Replace("{month}", month);
            html = html.Replace("{year}", year);
            html = html.Replace("{hour}", hour);

            html = html.Replace("{patientId}", $"{patient.IdCode}{patient.Id}");
            html = html.Replace("{patientOrderNumber}", $"{patient.OrderNumber}");
            html = html.Replace("{patientFullName}", patient.FullName);
            html = html.Replace("{patientAge}", $"{patient.Age}");
            html = html.Replace("{patientGender}", genderHtml);
            html = html.Replace("{patientAddress}", address);
            html = html.Replace("{patientPhoneNumber}", phoneNumber);
            html = html.Replace("{patientRelativePhoneNumber}", relativePhoneNumber);
            html = html.Replace("{patientStatus}", statusHtml);
            html = html.Replace("{patientAppointment}", appointmentHtml);

            string height = !string.IsNullOrWhiteSpace(patient.Height) ? patient.Height : "...................";
            html = html.Replace("{patientHeight}", height);
            string weight = !string.IsNullOrWhiteSpace(patient.Weight) ? patient.Weight : "...................";
            html = html.Replace("{patientWeight}", weight);
            string bloodPressure = !string.IsNullOrWhiteSpace(patient.BloodPressure) ? patient.BloodPressure : "............/..........";
            html = html.Replace("{patientBloodPresure}", bloodPressure);
            string pulse = !string.IsNullOrWhiteSpace(patient.Pulse) ? patient.Pulse : "..............";
            html = html.Replace("{patientPulse}", pulse);
            string other = !string.IsNullOrWhiteSpace(patient.Other) ? patient.Other : "...................";
            html = html.Replace("{patientOther}", other);
            string note = !string.IsNullOrWhiteSpace(patient.Note) ? patient.Note : @"......................................................................................................................
                    ...................................................................";
            html = html.Replace("{patientNote}", note);

            if (doctors.Count > 1)
            {
                string doctorHtmls = "";
                foreach (var doctor in doctors)
                {
                    doctorHtmls += $"<div class=\"col-6\"><p>{doctor.FullName}</p></div>";
                }
                html = html.Replace("{doctors}", doctorHtmls);
            }

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

            string patientId = string.Concat(patient.IdCode, patient.Id);
            string patientName = patient.FullName;
            string createdTime = DateTime.Now.ToString("HHmmssddMMyyyy");
            string saveFile = $"{patientId}_{patientName}_{createdTime}.pdf";
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
                    Message = $"In phiếu tiếp nhận bệnh nhân thành công lúc {DateTime.Now.ToString()}.",
                }
            };

            return response;
        }
    }
}
