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
    [ControllerProperty(Name = "CtFormController", Route = "ctform")]
    public class CtFormController : ChromelyController
    {
        public CtFormController()
        {
            RegisterPostRequest("/ctform/print", PrintCtForm);
        }

        private ChromelyResponse PrintCtForm(ChromelyRequest request)
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
            CtFormViewModel ctForm = JsonSerializer.Deserialize<CtFormViewModel>(jsonString, new JsonSerializerOptions
            {
                AllowTrailingCommas = true,
                PropertyNameCaseInsensitive = true,
            });

            var doctor = ctForm.Doctor;
            var patient = ctForm.Patient;

            string appDirectory = AppDomain.CurrentDomain.BaseDirectory;
            string templateHtml = $"{appDirectory}/wwwroot/templates/ct.html";

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
            html = html.Replace("{patientDiagnosisName}", ctForm.DiagnosisName);

            string ctRequestTypeHtml;
            if (ctForm.Type.Equals(CtRequestTypeConstants.Normal, StringComparison.OrdinalIgnoreCase))
            {
                ctRequestTypeHtml =
                    @"<div class=""col-4"">
                            <div class=""custom-control custom-checkbox"">
                                <input type=""checkbox"" class=""custom-control-input"" id=""thuong"" checked>
                                <label class=""custom-control-label"" for=""thuong"">Thường</label>
                            </div>
                      </div>
                      <div class=""col-4"">
                          <div class=""custom-control custom-checkbox"">
                               <input type=""checkbox"" class=""custom-control-input"" id=""khan"">
                               <label class=""custom-control-label"" for=""khan"">Khẩn</label>
                          </div>
                      </div>
                      <div class=""col-4"">
                        <div class=""custom-control custom-checkbox"">
                           <input type=""checkbox"" class=""custom-control-input"" id=""capcuu"">
                           <label class=""custom-control-label"" for=""capcuu"">Cấp cứu</label>
                      </div>
                     </div>";
            }
            else if (ctForm.Type.Equals(CtRequestTypeConstants.Urgent, StringComparison.OrdinalIgnoreCase))
            {
                ctRequestTypeHtml =
                    @"<div class=""col-4"">
                            <div class=""custom-control custom-checkbox"">
                                <input type=""checkbox"" class=""custom-control-input"" id=""thuong"">
                                <label class=""custom-control-label"" for=""thuong"">Thường</label>
                            </div>
                      </div>
                      <div class=""col-4"">
                          <div class=""custom-control custom-checkbox"">
                               <input type=""checkbox"" class=""custom-control-input"" id=""khan"" checked>
                               <label class=""custom-control-label"" for=""khan"">Khẩn</label>
                          </div>
                      </div>
                      <div class=""col-4"">
                        <div class=""custom-control custom-checkbox"">
                           <input type=""checkbox"" class=""custom-control-input"" id=""capcuu"">
                           <label class=""custom-control-label"" for=""capcuu"">Cấp cứu</label>
                        </div>
                       </div>";
            }
            else if (ctForm.Type.Equals(CtRequestTypeConstants.Emergency, StringComparison.OrdinalIgnoreCase))
            {
                ctRequestTypeHtml =
                    @"<div class=""col-4"">
                            <div class=""custom-control custom-checkbox"">
                                <input type=""checkbox"" class=""custom-control-input"" id=""thuong"">
                                <label class=""custom-control-label"" for=""thuong"">Thường</label>
                            </div>
                      </div>
                      <div class=""col-4"">
                          <div class=""custom-control custom-checkbox"">
                               <input type=""checkbox"" class=""custom-control-input"" id=""khan"">
                               <label class=""custom-control-label"" for=""khan"">Khẩn</label>
                          </div>
                      </div>
                      <div class=""col-4"">
                        <div class=""custom-control custom-checkbox"">
                           <input type=""checkbox"" class=""custom-control-input"" id=""capcuu"" checked>
                           <label class=""custom-control-label"" for=""capcuu"">Cấp cứu</label>
                      </div>
                     </div>";
            }
            else
            {
                ctRequestTypeHtml =
                    @"<div class=""col-4"">
                            <div class=""custom-control custom-checkbox"">
                                <input type=""checkbox"" class=""custom-control-input"" id=""thuong"">
                                <label class=""custom-control-label"" for=""thuong"">Thường</label>
                            </div>
                      </div>
                      <div class=""col-4"">
                          <div class=""custom-control custom-checkbox"">
                               <input type=""checkbox"" class=""custom-control-input"" id=""khan"">
                               <label class=""custom-control-label"" for=""khan"">Khẩn</label>
                          </div>
                      </div>
                      div class=""col-4"">
                        <div class=""custom-control custom-checkbox"">
                           <input type=""checkbox"" class=""custom-control-input"" id=""capcuu"">
                           <label class=""custom-control-label"" for=""capcuu"">Cấp cứu</label>
                      </div>
                     </div>";
            }

            html = html.Replace("{ctRequestType}", ctRequestTypeHtml);

            if (ctForm.IsContrastMedicine)
            {
                html = html.Replace("{IsContrastMedicine}", "checked").Replace("{IsNotContrastMedicine}","");
            }
            else
            {
                html = html.Replace("{IsContrastMedicine}", "").Replace("{IsNotContrastMedicine}", "checked");
            }
            if (ctForm.IsSkull)
            {
                html = html.Replace("{IsSkull}", "checked");
            }
            else
            {
                html = html.Replace("{IsSkull}", "");
            }
            if (ctForm.IsCsNeck)
            {
                html = html.Replace("{IsCsNeck}", "checked");
            }
            else
            {
                html = html.Replace("{IsCsNeck}", "");
            }
            if (ctForm.IsCsChest)
            {
                html = html.Replace("{IsCsChest}", "checked");
            }
            else
            {
                html = html.Replace("{IsCsChest}", "");
            }
            if (ctForm.IsCsWaist)
            {
                html = html.Replace("{IsCsWaist}", "checked");
            }
            else
            {
                html = html.Replace("{IsCsWaist}", "");
            }
            if (ctForm.IsEarNoseThroat)
            {
                html = html.Replace("{IsEarNoseThroat}", "checked");
            }
            else
            {
                html = html.Replace("{IsEarNoseThroat}", "");
            }
            if (ctForm.IsShoulder)
            {
                html = html.Replace("{IsShoulder}", "checked");
            }
            else
            {
                html = html.Replace("{IsShoulder}", "");
            }
            if (ctForm.IsElbow)
            {
                html = html.Replace("{IsElbow}", "checked");
            }
            else
            {
                html = html.Replace("{IsElbow}", "");
            }
            if (ctForm.IsWrist)
            {
                html = html.Replace("{IsWrist}", "checked");
            }
            else
            {
                html = html.Replace("{IsWrist}", "");
            }
            if (ctForm.IsSinus)
            {
                html = html.Replace("{IsSinus}", "checked");
            }
            else
            {
                html = html.Replace("{IsSinus}", "");
            }
            if (ctForm.IsNeck)
            {
                html = html.Replace("{IsNeck}", "checked");
            }
            else
            {
                html = html.Replace("{IsNeck}", "");
            }
            if (ctForm.IsGroin)
            {
                html = html.Replace("{IsGroin}", "checked");
            }
            else
            {
                html = html.Replace("{IsGroin}", "");
            }
            if (ctForm.IsKnee)
            {
                html = html.Replace("{IsKnee}", "checked");
            }
            else
            {
                html = html.Replace("{IsKnee}", "");
            }
            if (ctForm.IsAnkle)
            {
                html = html.Replace("{IsAnkle}", "checked");
            }
            else
            {
                html = html.Replace("{IsAnkle}", "");
            }
            if (ctForm.IsFoot)
            {
                html = html.Replace("{IsFoot}", "checked");
            }
            else
            {
                html = html.Replace("{IsFoot}", "");
            }
            if (ctForm.IsPelvis)
            {
                html = html.Replace("{IsPelvis}", "checked");
            }
            else
            {
                html = html.Replace("{IsPelvis}", "");
            }
            if (ctForm.IsChest)
            {
                html = html.Replace("{IsChest}", "checked");
            }
            else
            {
                html = html.Replace("{IsChest}", "");
            }
            if (ctForm.IsUpperVein)
            {
                html = html.Replace("{IsUpperVein}", "checked");
            }
            else
            {
                html = html.Replace("{IsUpperVein}", "");
            }
            if (ctForm.IsStomach)
            {
                html = html.Replace("{IsStomach}", "checked");
            }
            else
            {
                html = html.Replace("{IsStomach}", "");
            }
            if (ctForm.IsLowerVein)
            {
                html = html.Replace("{IsLowerVein}", "checked");
            }
            else
            {
                html = html.Replace("{IsLowerVein}", "");
            }
            if (ctForm.IsUrinary)
            {
                html = html.Replace("{IsUrinary}", "checked");
            }
            else
            {
                html = html.Replace("{IsUrinary}", "");
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
