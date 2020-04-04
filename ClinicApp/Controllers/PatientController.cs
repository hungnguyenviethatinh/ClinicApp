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

            string dots = "............";
            //string threeDots = "...";
            string longDots = ".......................................................................................................................................";

            string date = DateTime.Now.ToString("dd-MM-yyyy");
            string time = DateTime.Now.ToString("HH:mm");
            //string dateOfBirth = patient.DateOfBirth != null ? patient.DateOfBirth.ToString() : dots;
            //string age = !string.IsNullOrWhiteSpace(patient.Age) ? patient.Age : dots;
            string address = !string.IsNullOrWhiteSpace(patient.Address) ? patient.Address : dots;
            string phoneNumber = !string.IsNullOrWhiteSpace(patient.PhoneNumber) ? patient.PhoneNumber : dots;
            string relativePhoneNumber = !string.IsNullOrWhiteSpace(patient.RelativePhoneNumber) ? patient.RelativePhoneNumber : dots;
            string appointedDate = !string.IsNullOrWhiteSpace(patient.AppointmentDate) ? patient.AppointmentDate : longDots;

            string gender;
            if (patient.Gender.Equals(GenderConstants.Male, StringComparison.OrdinalIgnoreCase))
            {
                gender = @"<div class=""col-2"" style=""text-align: center;"">
                                <label for=""male"" style=""margin-right: 10px;"">Nam</label>
                                <input type=""checkbox"" id=""male"" name=""male"" value=""Male"" checked>
                            </div>
                            <div class=""col-2"">
                                <label for=""female"" style=""margin-right: 10px;"">Nữ</label>
                                <input type=""checkbox"" id=""female"" name=""female"" value=""Female"">
                            </div>";
            }
            else if (patient.Gender.Equals(GenderConstants.Female, StringComparison.OrdinalIgnoreCase))
            {
                gender = @"<div class=""col-2"" style=""text-align: center;"">
                                <label for=""male"" style=""margin-right: 10px;"">Nam</label>
                                <input type=""checkbox"" id=""male"" name=""male"" value=""Male"">
                            </div>
                            <div class=""col-2"">
                                <label for=""female"" style=""margin-right: 10px;"">Nữ</label>
                                <input type=""checkbox"" id=""female"" name=""female"" value=""Female"" checked>
                            </div>";
            }
            else
            {
                gender = @"<div class=""col-2"" style=""text-align: center;"">
                                <label for=""male"" style=""margin-right: 10px;"">Nam</label>
                                <input type=""checkbox"" id=""male"" name=""male"" value=""Male"">
                            </div>
                            <div class=""col-2"">
                                <label for=""female"" style=""margin-right: 10px;"">Nữ</label>
                                <input type=""checkbox"" id=""female"" name=""female"" value=""Female"">
                            </div>";
            }

            string status;
            if (patient.Status.Equals(PatientStatusConstants.IsNew, StringComparison.OrdinalIgnoreCase))
            {
                status = @"<div class=""col-4"" style=""text-align: left;"">
                                <label for=""isnew"" style=""margin-right: 30px;"">Khám lần đầu</label>
                                <input type=""checkbox"" id=""isnew"" name=""isnew"" value=""isnew"" checked>
                            </div>
                            <div class=""col-4"" style=""text-align: center;"">
                                <label for=""isrechecking"" style=""margin-right: 30px;"">Tái khám</label>
                                <input type=""checkbox"" id=""isrechecking"" name=""isrechecking"" value=""isrechecking"">
                            </div>
                            <div class=""col-4"" style=""text-align: right;"">
                                <label for=""istoadddoc"" style=""margin-right: 30px;"">BS Hồ Sơ</label>
                                <input type=""checkbox"" id=""istoadddoc"" name=""istoadddoc"" value=""istoadddoc"">
                            </div>";
            }
            else if (patient.Status.Equals(PatientStatusConstants.IsRechecking, StringComparison.OrdinalIgnoreCase))
            {
                status = @"<div class=""col-4"" style=""text-align: left;"">
                                <label for=""isnew"" style=""margin-right: 30px;"">Khám lần đầu</label>
                                <input type=""checkbox"" id=""isnew"" name=""isnew"" value=""isnew"">
                            </div>
                            <div class=""col-4"" style=""text-align: center;"">
                                <label for=""isrechecking"" style=""margin-right: 30px;"">Tái khám</label>
                                <input type=""checkbox"" id=""isrechecking"" name=""isrechecking"" value=""isrechecking"" checked>
                            </div>
                            <div class=""col-4"" style=""text-align: right;"">
                                <label for=""istoadddoc"" style=""margin-right: 30px;"">BS Hồ Sơ</label>
                                <input type=""checkbox"" id=""istoadddoc"" name=""istoadddoc"" value=""istoadddoc"">
                            </div>";
            }
            else if (patient.Status.Equals(PatientStatusConstants.IsToAddDocs, StringComparison.OrdinalIgnoreCase))
            {
                status = @"<div class=""col-4"" style=""text-align: left;"">
                                <label for=""isnew"" style=""margin-right: 30px;"">Khám lần đầu</label>
                                <input type=""checkbox"" id=""isnew"" name=""isnew"" value=""isnew"">
                            </div>
                            <div class=""col-4"" style=""text-align: center;"">
                                <label for=""isrechecking"" style=""margin-right: 30px;"">Tái khám</label>
                                <input type=""checkbox"" id=""isrechecking"" name=""isrechecking"" value=""isrechecking"">
                            </div>
                            <div class=""col-4"" style=""text-align: right;"">
                                <label for=""istoadddoc"" style=""margin-right: 30px;"">BS Hồ Sơ</label>
                                <input type=""checkbox"" id=""istoadddoc"" name=""istoadddoc"" value=""istoadddoc"" checked>
                            </div>";
            }
            else
            {
                status = @"<div class=""col-4"" style=""text-align: left;"">
                                <label for=""isnew"" style=""margin-right: 30px;"">Khám lần đầu</label>
                                <input type=""checkbox"" id=""isnew"" name=""isnew"" value=""isnew"">
                            </div>
                            <div class=""col-4"" style=""text-align: center;"">
                                <label for=""isrechecking"" style=""margin-right: 30px;"">Tái khám</label>
                                <input type=""checkbox"" id=""isrechecking"" name=""isrechecking"" value=""isrechecking"">
                            </div>
                            <div class=""col-4"" style=""text-align: right;"">
                                <label for=""istoadddoc"" style=""margin-right: 30px;"">BS Hồ Sơ</label>
                                <input type=""checkbox"" id=""istoadddoc"" name=""istoadddoc"" value=""istoadddoc"">
                            </div>";
            }

            string appDirectory = AppDomain.CurrentDomain.BaseDirectory;
            string templateHtml = $"{appDirectory}/wwwroot/templates/patient.html";

            string html = "";
            using (StreamReader sr = new StreamReader(templateHtml, Encoding.UTF8))
            {
                html = sr.ReadToEnd();
            }

            html = html.Replace("{patient.Id}", $"{patient.IdCode}{patient.Id}");
            html = html.Replace("{date}", date);
            html = html.Replace("{time}", time);
            html = html.Replace("{patient.OrderNumber}", $"{patient.OrderNumber}");
            html = html.Replace("{patient.FullName}", patient.FullName);
            html = html.Replace("{patient.Age}", $"{patient.Age}");
            html = html.Replace("{patient.Gender}", gender);
            html = html.Replace("{patient.Address}", address);
            html = html.Replace("{patient.PhoneNumber}", phoneNumber);
            html = html.Replace("{patient.RelativePhoneNumber}", relativePhoneNumber);
            html = html.Replace("{patient.Status}", status);
            html = html.Replace("{patient.AppointmentDate}", appointedDate);
            html = html.Replace("{patient.Height}", patient.Height);
            html = html.Replace("{patient.Weight}", patient.Weight);
            html = html.Replace("{patient.BloodPresure}", patient.BloodPresure);
            html = html.Replace("{patient.Pulse}", patient.Pulse);
            html = html.Replace("{patient.Other}", patient.Other);
            html = html.Replace("{patient.Note}", patient.Note);

            if (doctors.Count > 1)
            {
                string doctorHtmls = "";
                foreach(var doctor in doctors)
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

            string url = $"file:///{appDirectory}/wwwroot/index.html";
            HtmlToPdf converter = new HtmlToPdf();
            converter.Options.PdfPageSize = PdfPageSize.A5;
            converter.Options.PdfPageOrientation = PdfPageOrientation.Portrait;
            converter.Options.WebPageWidth = 1024;
            //converter.Options.WebPageHeight = 1280;

            string patientId = string.Concat("DKC-BN", patient.Id);
            string patientName = patient.FullName;
            string createdTime = DateTime.Now.ToString("HHmmssddMMyyyy");
            string saveFile = $"{patientId}_{patientName}_{createdTime}.pdf";

            //string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
            //string saveDirectory = $"{desktopPath}\\DonThuoc";
            string saveDirectory = $"{appDirectory}\\BenhNhan";

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

public static class GenderConstants
{
    public const string None = "Khác";
    public const string Male = "Nam";
    public const string Female = "Nữ";
}

public static class PatientStatusConstants
{
    public const string IsNew = "Mới";
    public const string IsRechecking = "Tái khám";
    public const string IsToAddDocs = "BS Hồ Sơ";
}
