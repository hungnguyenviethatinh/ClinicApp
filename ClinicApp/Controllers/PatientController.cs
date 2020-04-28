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



            string appDirectory = AppDomain.CurrentDomain.BaseDirectory;
            string templateHtml = $"{appDirectory}/wwwroot/templates/mautiepnhan.html";

            string html = "";
            using (StreamReader sr = new StreamReader(templateHtml, Encoding.UTF8))
            {
                html = sr.ReadToEnd();
            }

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

            string patientAge = $"{patient.Age}";
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
                ".........................................................";
            html = html.Replace("{patientPhoneNumber}", patientPhoneNumber);

            string patientRelativePhoneNumber = !string.IsNullOrWhiteSpace(patient.RelativePhoneNumber) ?
                patient.RelativePhoneNumber :
                ".........................................................";
            html = html.Replace("{patientRelativePhoneNumber}", patientRelativePhoneNumber);

            if (patient.Status.Equals(PatientStatusConstants.IsNew, StringComparison.OrdinalIgnoreCase))
            {
                html = html
                    .Replace("{IsNew}", "checked")
                    .Replace("{IsRechecking}", "")
                    .Replace("{IsToAddDocs}", "");
            }
            else if (patient.Status.Equals(PatientStatusConstants.IsRechecking, StringComparison.OrdinalIgnoreCase))
            {
                html = html
                    .Replace("{IsNew}", "")
                    .Replace("{IsRechecking}", "checked")
                    .Replace("{IsToAddDocs}", "");
            }
            else if (patient.Status.Equals(PatientStatusConstants.IsToAddDocs, StringComparison.OrdinalIgnoreCase))
            {
                html = html
                    .Replace("{IsNew}", "")
                    .Replace("{IsRechecking}", "")
                    .Replace("{IsToAddDocs}", "checked");
            }
            else
            {
                html = html
                    .Replace("{IsNew}", "")
                    .Replace("{IsRechecking}", "")
                    .Replace("{IsToAddDocs}", "");
            }

            string appointmentHtml;
            if (!string.IsNullOrWhiteSpace(patient.AppointmentDate))
            {
                appointmentHtml = "thứ {thu}, {ngay}/{thang}/{nam}, giờ khám: ................................";

                DateTime appointedDate = DateTime.ParseExact(patient.AppointmentDate, "dd-MM-yyyy HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
                string thu = Utils.GetDayOfWeek(appointedDate);
                string ngay = appointedDate.Day.ToString();
                string thang = appointedDate.Month.ToString();
                string nam = appointedDate.Year.ToString();

                appointmentHtml = appointmentHtml
                    .Replace("{thu}", thu)
                    .Replace("{ngay}", ngay)
                    .Replace("{thang}", thang)
                    .Replace("{nam}", nam);
            }
            else
            {
                appointmentHtml =
                $"thứ .........., ............../............../{DateTime.Now.Year}, giờ khám: ...............................";
            }
            html = html.Replace("{appointmentDate}", appointmentHtml);

            string height = !string.IsNullOrWhiteSpace(patient.Height) ?
                patient.Height :
                "...................";
            html = html.Replace("{patientHeight}", height);

            string weight = !string.IsNullOrWhiteSpace(patient.Weight) ?
                patient.Weight :
                "...................";
            html = html.Replace("{patientWeight}", weight);

            string bloodPressure = !string.IsNullOrWhiteSpace(patient.BloodPressure) ?
                patient.BloodPressure :
                "............/..........";
            html = html.Replace("{patientBloodPresure}", bloodPressure);

            string pulse = !string.IsNullOrWhiteSpace(patient.Pulse) ?
                patient.Pulse :
                "..............";
            html = html.Replace("{patientPulse}", pulse);

            string other = !string.IsNullOrWhiteSpace(patient.Other) ?
                patient.Other :
                "...................";
            html = html.Replace("{patientOther}", other);

            string note = !string.IsNullOrWhiteSpace(patient.Note) ?
                patient.Note :
                "........................................ " +
                ".............................................";
            html = html.Replace("{patientNote}", note);

            if (doctors.Count > 1)
            {
                foreach (var doctor in doctors)
                {
                    string fullName = doctor.FullName.ToUpper();

                    if (fullName.Equals("TRẦN ĐĂNG KHOA", StringComparison.OrdinalIgnoreCase))
                    {
                        html = html.Replace("{bs.tdk}", "checked");
                    }
                    if (fullName.Equals("LÂM QUỐC THANH", StringComparison.OrdinalIgnoreCase))
                    {
                        html = html.Replace("{bs.lqt}", "checked");
                    }
                    if (fullName.Equals("LÊ ĐỨC HIẾU", StringComparison.OrdinalIgnoreCase))
                    {
                        html = html.Replace("{{bs.ldh}", "checked");
                    }
                    if (fullName.Equals("PHẠM BÁ HẢI ĐƯỜNG", StringComparison.OrdinalIgnoreCase))
                    {
                        html = html.Replace("{bs.pbhd}", "checked");
                    }
                }
            }
            html = html
                .Replace("{bs.tdk}", "")
                .Replace("{bs.lqt}", "")
                .Replace("{bs.ldh}", "")
                .Replace("{bs.pbhd}", "");

            string indexHtml = $"{appDirectory}/wwwroot/index.html";
            using (StreamWriter sw = new StreamWriter(indexHtml, false, Encoding.UTF8))
            {
                sw.WriteLine(html);
            }

            string url = $"file:///{appDirectory}/wwwroot/index.html";

            HtmlToPdf converter = new HtmlToPdf();
            converter.Options.PdfPageSize = PdfPageSize.A5;
            converter.Options.PdfPageOrientation = PdfPageOrientation.Portrait;
            converter.Options.WebPageWidth = 600;

            string createdTime = DateTime.Now.ToString("HHmmssddMMyyyy");
            string saveFile = $"PTNBN_{createdTime}.pdf";
            string saveDirectory = $"{appDirectory}\\PTNBN";
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
                    Message = $"In phiếu tiếp nhận bệnh nhân thành công lúc {DateTime.Now.ToString()}.",
                }
            };

            return response;
        }
    }
}
