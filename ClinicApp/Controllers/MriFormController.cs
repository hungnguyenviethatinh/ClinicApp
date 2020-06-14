using System;
using System.Text.Json;
using ClinicApp.Core;
using ClinicApp.ViewModels;
using Chromely.Core.RestfulService;

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

            string diagnosisName = !string.IsNullOrWhiteSpace(mriForm.DiagnosisName) ?
                mriForm.DiagnosisName :
                "..........................................................................." +
                "..........................................................................." +
                "<div>....................................................................................................." +
                ".....................................................................................................</div>";
            html = html.Replace("{diagnosisName}", diagnosisName);

            if (mriForm.IsSkull)
            {
                html = html.Replace("{IsSkull}", "checked");
            }
            else
            {
                html = html.Replace("{IsSkull}", "");
            }
            if (mriForm.IsHeadNeck)
            {
                html = html.Replace("{IsHeadNeck}", "checked");
            }
            else
            {
                html = html.Replace("{IsHeadNeck}", "");
            }
            if (mriForm.IsChest)
            {
                html = html.Replace("{IsChest}", "checked");
            }
            else
            {
                html = html.Replace("{IsChest}", "");
            }
            if (mriForm.IsStomachGroin)
            {
                html = html.Replace("{IsStomachGroin}", "checked");
            }
            else
            {
                html = html.Replace("{IsStomachGroin}", "");
            }
            if (mriForm.IsLimbs)
            {
                html = html.Replace("{IsLimbs}", "checked");
            }
            else
            {
                html = html.Replace("{IsLimbs}", "");
            }
            if (mriForm.IsNeckSpine)
            {
                html = html.Replace("{IsNeckSpine}", "checked");
            }
            else
            {
                html = html.Replace("{IsNeckSpine}", "");
            }
            if (mriForm.IsChestSpine)
            {
                html = html.Replace("{IsChestSpine}", "checked");
            }
            else
            {
                html = html.Replace("{IsChestSpine}", "");
            }
            if (mriForm.IsPelvisSpine)
            {
                html = html.Replace("{IsPelvisSpine}", "checked");
            }
            else
            {
                html = html.Replace("{IsPelvisSpine}", "");
            }
            if (mriForm.IsBloodVessel)
            {
                html = html.Replace("{IsBloodVessel}", "checked");
            }
            else
            {
                html = html.Replace("{IsBloodVessel}", "");
            }
            if (mriForm.IsOther)
            {
                html = html.Replace("{IsOther}", "checked");
            }
            else
            {
                html = html.Replace("{IsOther}", "");
            }
            if (mriForm.IsContrastAgent)
            {
                html = html.Replace("{IsContrastAgent}", "checked");
            }
            else
            {
                html = html.Replace("{IsContrastAgent}", "");
            }
            if (mriForm.IsNotContrastAgent)
            {
                html = html.Replace("{IsNotContrastAgent}", "checked");
            }
            else
            {
                html = html.Replace("{IsNotContrastAgent}", "");
            }

            string other = !string.IsNullOrWhiteSpace(mriForm.Other) ?
                mriForm.Other.Replace("\n", "<br />") :
                "........................................................................................." +
                "........................................................................................." +
                ".........................................................................................";
            html = html.Replace("{Other}", other);

            string dateCreated = mriForm.DateCreated.Day.ToString();
            string monthCreated = mriForm.DateCreated.Month.ToString();
            string yearCreated = mriForm.DateCreated.Year.ToString();
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
            string savePath = Utils.GetSavePath(appDirectory, "MRI");

            Utils.ConvertPdfFromUrl(converter, url, savePath);
            Utils.PrintPdf(savePath);

            ChromelyResponse response = new ChromelyResponse(request.Id)
            {
                Data = new
                {
                    Message = $"In phiếu chỉ định chụp cộng hưởng từ (mri) thành công lúc {DateTime.Now:dd/MM/yyyy HH:mm:ss}.",
                }
            };

            return response;
        }
    }
}
