using System;
using System.Text.Json;
using ClinicApp.Core;
using ClinicApp.ViewModels;
using Chromely.Core.RestfulService;

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
                ".........................................................";
            html = html.Replace("{patientPhoneNumber}", patientPhoneNumber);

            string diagnosisName = !string.IsNullOrWhiteSpace(ctForm.DiagnosisName) ?
                ctForm.DiagnosisName :
                "....................................................................................." +
                ".....................................................................................";
            html = html.Replace("{diagnosisName}", diagnosisName);

            if (ctForm.Type.Equals(CtRequestTypeConstants.Normal, StringComparison.OrdinalIgnoreCase))
            {
                html = html.Replace("{normal}", "checked").Replace("{urgent}", "").Replace("{emergency}", "");
            }
            else if (ctForm.Type.Equals(CtRequestTypeConstants.Urgent, StringComparison.OrdinalIgnoreCase))
            {
                html = html.Replace("{normal}", "").Replace("{urgent}", "checked").Replace("{emergency}", "");
            }
            else if (ctForm.Type.Equals(CtRequestTypeConstants.Emergency, StringComparison.OrdinalIgnoreCase))
            {
                html = html.Replace("{normal}", "").Replace("{urgent}", "").Replace("{emergency}", "checked");
            }
            else
            {
                html = html.Replace("{normal}", "").Replace("{urgent}", "").Replace("{emergency}", "");
            }

            if (ctForm.IsContrastMedicine)
            {
                html = html.Replace("{IsContrastMedicine}", "checked");
            }
            else
            {
                html = html.Replace("{IsContrastMedicine}", "");
            }
            if (ctForm.IsNotContrastMedicine)
            {
                html = html.Replace("{IsNotContrastMedicine}", "checked");
            }
            else
            {
                html = html.Replace("{IsNotContrastMedicine}", "");
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
            if (ctForm.IsStomach)
            {
                html = html.Replace("{IsStomach}", "checked");
            }
            else
            {
                html = html.Replace("{IsStomach}", "");
            }
            if (ctForm.IsUrinary)
            {
                html = html.Replace("{IsUrinary}", "checked");
            }
            else
            {
                html = html.Replace("{IsUrinary}", "");
            }
            if (ctForm.IsUpperVein)
            {
                html = html.Replace("{IsUpperVein}", "checked");
            }
            else
            {
                html = html.Replace("{IsUpperVein}", "");
            }
            if (ctForm.IsLowerVein)
            {
                html = html.Replace("{IsLowerVein}", "checked");
            }
            else
            {
                html = html.Replace("{IsLowerVein}", "");
            }
            if (ctForm.IsOther)
            {
                html = html.Replace("{IsOther}", "checked");
            }
            else
            {
                html = html.Replace("{IsOther}", "");
            }

            string upperVein = !string.IsNullOrWhiteSpace(ctForm.UpperVein) ?
                ctForm.UpperVein :
                "....................................................";
            html = html.Replace("{UpperVein}", upperVein);

            string lowerVein = !string.IsNullOrWhiteSpace(ctForm.LowerVein) ?
                ctForm.LowerVein :
                "...................................................";
            html = html.Replace("{LowerVein}", lowerVein);

            string other = !string.IsNullOrWhiteSpace(ctForm.Other) ?
                ctForm.Other :
                "................................................................................ " +
                "................................................................................................. " +
                ".................................................................................................";
            html = html.Replace("{Other}", other);

            if (ctForm.IsPregnant)
            {
                html = html.Replace("{IsPregnant}", "checked").Replace("{IsNotPregnant}", "");
            }
            else
            {
                html = html.Replace("{IsPregnant}", "").Replace("{IsNotPregnant}", "checked");
            }
            if (ctForm.IsAllergy)
            {
                html = html.Replace("{IsAllergy}", "checked").Replace("{IsNotAllergy}", "");
            }
            else
            {
                html = html.Replace("{IsAllergy}", "").Replace("{IsNotAllergy}", "checked");
            }
            if (ctForm.IsHeartDisease)
            {
                html = html.Replace("{IsHeartDisease}", "checked").Replace("{IsNotHeartDisease}", "");
            }
            else
            {
                html = html.Replace("{IsHeartDisease}", "").Replace("{IsNotHeartDisease}", "checked");
            }
            if (ctForm.IsBloodDisease)
            {
                html = html.Replace("{IsBloodDisease}", "checked").Replace("{IsNotBloodDisease}", "");
            }
            else
            {
                html = html.Replace("{IsBloodDisease}", "").Replace("{IsNotBloodDisease}", "checked");
            }
            if (ctForm.IsKidneyFailure)
            {
                html = html.Replace("{IsKidneyFailure}", "checked").Replace("{IsNotKidneyFailure}", "");
            }
            else
            {
                html = html.Replace("{IsKidneyFailure}", "").Replace("{IsNotKidneyFailure}", "checked");
            }
            if (ctForm.IsDiabetesMellitus)
            {
                html = html.Replace("{IsDiabetesMellitus}", "checked").Replace("{IsNotDiabetesMellitus}", "");
            }
            else
            {
                html = html.Replace("{IsDiabetesMellitus}", "").Replace("{IsNotDiabetesMellitus}", "checked");
            }
            if (ctForm.IsCoagulopathy)
            {
                html = html.Replace("{IsCoagulopathy}", "checked").Replace("{IsNotCoagulopathy}", "");
            }
            else
            {
                html = html.Replace("{IsCoagulopathy}", "").Replace("{IsNotCoagulopathy}", "checked");
            }

            string dateCreated = ctForm.DateCreated.Day.ToString();
            string monthCreated = ctForm.DateCreated.Month.ToString();
            string yearCreated = ctForm.DateCreated.Year.ToString();
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
            string savePath = Utils.GetSavePath(appDirectory, "CT");

            Utils.ConvertPdfFromUrl(converter, url, savePath);
            Utils.PrintPdf(savePath);

            ChromelyResponse response = new ChromelyResponse(request.Id)
            {
                Data = new
                {
                    Message = $"In phiếu chỉ định chụp ct thành công lúc {DateTime.Now:dd/MM/yyyy HH:mm:ss}.",
                }
            };

            return response;
        }
    }
}
