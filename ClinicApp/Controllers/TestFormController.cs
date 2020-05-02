using System;
using System.IO;
using System.Text;
using Chromely.Core.RestfulService;
using System.Text.Json;
using ClinicApp.Core;
using ClinicApp.ViewModels;
using System.Diagnostics;

namespace ClinicApp.Controllers
{
    [ControllerProperty(Name = "TestFormController", Route = "ctform")]
    public class TestFormController : ChromelyController
    {
        public TestFormController()
        {
            RegisterPostRequest("/testform/print", PrintTestForm);
        }

        private ChromelyResponse PrintTestForm(ChromelyRequest request)
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
            TestFormViewModel testForm = JsonSerializer.Deserialize<TestFormViewModel>(jsonString, new JsonSerializerOptions
            {
                AllowTrailingCommas = true,
                PropertyNameCaseInsensitive = true,
            });

            var doctor = testForm.Doctor;
            var patient = testForm.Patient;

            string appDirectory = AppDomain.CurrentDomain.BaseDirectory;
            string templateHtml = $"{appDirectory}/wwwroot/templates/pxn.html";

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

            string diagnosisName = !string.IsNullOrWhiteSpace(testForm.DiagnosisName) ?
                testForm.DiagnosisName :
                "................................................................................................" +
                "....................................................";
            html = html.Replace("{diagnosisName}", diagnosisName);

            if (testForm.IsBloodSample)
            {
                html = html.Replace("{IsBloodSample}", "checked");
            }
            else
            {
                html = html.Replace("{IsBloodSample}", "");
            }
            if (testForm.IsUrineSample)
            {
                html = html.Replace("{IsUrineSample}", "checked");
            }
            else
            {
                html = html.Replace("{IsUrineSample}", "");
            }
            if (testForm.IsPusSample)
            {
                html = html.Replace("{IsPusSample}", "checked");
            }
            else
            {
                html = html.Replace("{IsPusSample}", "");
            }
            if (testForm.IsSputumSample)
            {
                html = html.Replace("{IsSputumSample}", "checked");
            }
            else
            {
                html = html.Replace("{IsSputumSample}", "");
            }
            if (testForm.IsSputumSample)
            {
                html = html.Replace("{IsShitSample}", "checked");
            }
            else
            {
                html = html.Replace("{IsShitSample}", "");
            }

            string homourSample = !string.IsNullOrWhiteSpace(testForm.HumourSample) ?
                testForm.HumourSample :
                "......................................";
            html = html.Replace("{HumourSample}", homourSample);

            if (testForm.IsBloodGroup)
            {
                html = html.Replace("{IsBloodGroup}", "checked");
            }
            else
            {
                html = html.Replace("{IsBloodGroup}", "");
            }
            if (testForm.IsBlood)
            {
                html = html.Replace("{IsBlood}", "checked");
            }
            else
            {
                html = html.Replace("{IsBlood}", "");
            }
            if (testForm.IsVS)
            {
                html = html.Replace("{IsVS}", "checked");
            }
            else
            {
                html = html.Replace("{IsVS}", "");
            }
            if (testForm.IsFeverTest)
            {
                html = html.Replace("{IsFeverTest}", "checked");
            }
            else
            {
                html = html.Replace("{IsFeverTest}", "");
            }
            if (testForm.IsTs)
            {
                html = html.Replace("{IsTs}", "checked");
            }
            else
            {
                html = html.Replace("{IsTs}", "");
            }
            if (testForm.IsTc)
            {
                html = html.Replace("{IsTc}", "checked");
            }
            else
            {
                html = html.Replace("{IsTc}", "");
            }
            if (testForm.IsPt)
            {
                html = html.Replace("{IsPt}", "checked");
            }
            else
            {
                html = html.Replace("{IsPt}", "");
            }
            if (testForm.IsAtpp)
            {
                html = html.Replace("{IsAtpp}", "checked");
            }
            else
            {
                html = html.Replace("{IsAtpp}", "");
            }
            if (testForm.IsFibrinogen)
            {
                html = html.Replace("{IsFibrinogen}", "checked");
            }
            else
            {
                html = html.Replace("{IsFibrinogen}", "");
            }
            if (testForm.IsDdimer)
            {
                html = html.Replace("{IsDdimer}", "checked");
            }
            else
            {
                html = html.Replace("{IsDdimer}", "");
            }
            if (testForm.IsAso)
            {
                html = html.Replace("{IsAso}", "checked");
            }
            else
            {
                html = html.Replace("{IsAso}", "");
            }
            if (testForm.IsCrp)
            {
                html = html.Replace("{IsCrp}", "checked");
            }
            else
            {
                html = html.Replace("{IsCrp}", "");
            }
            if (testForm.IsRf)
            {
                html = html.Replace("{IsRf}", "checked");
            }
            else
            {
                html = html.Replace("{IsRf}", "");
            }
            if (testForm.IsAna)
            {
                html = html.Replace("{IsAna}", "checked");
            }
            else
            {
                html = html.Replace("{IsAna}", "");
            }
            if (testForm.IsAntiCcp)
            {
                html = html.Replace("{IsAntiCcp}", "checked");
            }
            else
            {
                html = html.Replace("{IsAntiCcp}", "");
            }
            if (testForm.IsCortisol)
            {
                html = html.Replace("{IsCortisol}", "checked");
            }
            else
            {
                html = html.Replace("{IsCortisol}", "");
            }
            if (testForm.IsProcal)
            {
                html = html.Replace("{IsProcal}", "checked");
            }
            else
            {
                html = html.Replace("{IsProcal}", "");
            }
            if (testForm.IsFt4)
            {
                html = html.Replace("{IsFt4}", "checked");
            }
            else
            {
                html = html.Replace("{IsFt4}", "");
            }
            if (testForm.IsTsh)
            {
                html = html.Replace("{IsTsh}", "checked");
            }
            else
            {
                html = html.Replace("{IsTsh}", "");
            }
            if (testForm.IsInterlukin6)
            {
                html = html.Replace("{IsInterlukin6}", "checked");
            }
            else
            {
                html = html.Replace("{IsInterlukin6}", "");
            }
            if (testForm.IsHbsAg)
            {
                html = html.Replace("{IsHbsAg}", "checked");
            }
            else
            {
                html = html.Replace("{IsHbsAg}", "");
            }
            if (testForm.IsHbsQgE)
            {
                html = html.Replace("{IsHbsQgE}", "checked");
            }
            else
            {
                html = html.Replace("{IsHbsQgE}", "");
            }
            if (testForm.IsAntiHiv)
            {
                html = html.Replace("{IsAntiHiv}", "checked");
            }
            else
            {
                html = html.Replace("{IsAntiHiv}", "");
            }
            if (testForm.IsAnitHivE)
            {
                html = html.Replace("{IsAnitHivE}", "checked");
            }
            else
            {
                html = html.Replace("{IsAnitHivE}", "");
            }
            if (testForm.IsAntiHcv)
            {
                html = html.Replace("{IsAntiHcv}", "checked");
            }
            else
            {
                html = html.Replace("{IsAntiHcv}", "");
            }
            if (testForm.IsAntiHcvE)
            {
                html = html.Replace("{IsAntiHcvE}", "checked");
            }
            else
            {
                html = html.Replace("{IsAntiHcvE}", "");
            }
            if (testForm.IsRpr)
            {
                html = html.Replace("{IsRpr}", "checked");
            }
            else
            {
                html = html.Replace("{IsRpr}", "");
            }
            if (testForm.IsGlucose)
            {
                html = html.Replace("{IsGlucose}", "checked");
            }
            else
            {
                html = html.Replace("{IsGlucose}", "");
            }
            if (testForm.IsHpA1c)
            {
                html = html.Replace("{IsHpA1c}", "checked");
            }
            else
            {
                html = html.Replace("{IsHpA1c}", "");
            }
            if (testForm.IsUrea)
            {
                html = html.Replace("{IsUrea}", "checked");
            }
            else
            {
                html = html.Replace("{IsUrea}", "");
            }
            if (testForm.IsCreatinine)
            {
                html = html.Replace("{IsCreatinine}", "checked");
            }
            else
            {
                html = html.Replace("{IsCreatinine}", "");
            }
            if (testForm.IsUricAcid)
            {
                html = html.Replace("{IsUricAcid}", "checked");
            }
            else
            {
                html = html.Replace("{IsUricAcid}", "");
            }
            if (testForm.IsAst)
            {
                html = html.Replace("{IsAst}", "checked");
            }
            else
            {
                html = html.Replace("{IsAst}", "");
            }
            if (testForm.IsAlt)
            {
                html = html.Replace("{IsAlt}", "checked");
            }
            else
            {
                html = html.Replace("{IsAlt}", "");
            }
            if (testForm.IsFBilirubin)
            {
                html = html.Replace("{IsFBilirubin}", "checked");
            }
            else
            {
                html = html.Replace("{IsFBilirubin}", "");
            }
            if (testForm.IsBilirubin)
            {
                html = html.Replace("{IsBilirubin}", "checked");
            }
            else
            {
                html = html.Replace("{IsBilirubin}", "");
            }
            if (testForm.IsGgt)
            {
                html = html.Replace("{IsGgt}", "checked");
            }
            else
            {
                html = html.Replace("{IsGgt}", "");
            }
            if (testForm.IsProtein)
            {
                html = html.Replace("{IsProtein}", "checked");
            }
            else
            {
                html = html.Replace("{IsProtein}", "");
            }
            if (testForm.IsAlbumin)
            {
                html = html.Replace("{IsAlbumin}", "checked");
            }
            else
            {
                html = html.Replace("{IsAlbumin}", "");
            }
            if (testForm.IsTriglycerid)
            {
                html = html.Replace("{IsTriglycerid}", "checked");
            }
            else
            {
                html = html.Replace("{IsTriglycerid}", "");
            }
            if (testForm.IsCholes)
            {
                html = html.Replace("{IsCholes}", "checked");
            }
            else
            {
                html = html.Replace("{IsCholes}", "");
            }
            if (testForm.IsHdlCholes)
            {
                html = html.Replace("{IsHdlCholes}", "checked");
            }
            else
            {
                html = html.Replace("{IsHdlCholes}", "");
            }
            if (testForm.IsLdlCholes)
            {
                html = html.Replace("{IsLdlCholes}", "checked");
            }
            else
            {
                html = html.Replace("{IsLdlCholes}", "");
            }
            if (testForm.IsElectrolytes)
            {
                html = html.Replace("{IsElectrolytes}", "checked");
            }
            else
            {
                html = html.Replace("{IsElectrolytes}", "");
            }
            if (testForm.IsCa)
            {
                html = html.Replace("{IsCa}", "checked");
            }
            else
            {
                html = html.Replace("{IsCa}", "");
            }
            if (testForm.IsCpk)
            {
                html = html.Replace("{IsCpk}", "checked");
            }
            else
            {
                html = html.Replace("{IsCpk}", "");
            }
            if (testForm.IsCkMb)
            {
                html = html.Replace("{IsCkMb}", "checked");
            }
            else
            {
                html = html.Replace("{IsCkMb}", "");
            }
            if (testForm.IsTroponin)
            {
                html = html.Replace("{IsTroponin}", "checked");
            }
            else
            {
                html = html.Replace("{IsTroponin}", "");
            }
            if (testForm.IsEthanol)
            {
                html = html.Replace("{IsEthanol}", "checked");
            }
            else
            {
                html = html.Replace("{IsEthanol}", "");
            }
            if (testForm.IsEndoscopy)
            {
                html = html.Replace("{IsEndoscopy}", "checked");
            }
            else
            {
                html = html.Replace("{IsEndoscopy}", "");
            }
            if (testForm.IsGram)
            {
                html = html.Replace("{IsGram}", "checked");
            }
            else
            {
                html = html.Replace("{IsGram}", "");
            }
            if (testForm.IsZiehl)
            {
                html = html.Replace("{IsZiehl}", "checked");
            }
            else
            {
                html = html.Replace("{IsZiehl}", "");
            }
            if (testForm.IsAntibiotic)
            {
                html = html.Replace("{IsAntibiotic}", "checked");
            }
            else
            {
                html = html.Replace("{IsAntibiotic}", "");
            }
            if (testForm.IsUrine)
            {
                html = html.Replace("{IsUrine}", "checked");
            }
            else
            {
                html = html.Replace("{IsUrine}", "");
            }
            if (testForm.IsAddis)
            {
                html = html.Replace("{IsAddis}", "checked");
            }
            else
            {
                html = html.Replace("{IsAddis}", "");
            }
            if (testForm.IsProteinBj)
            {
                html = html.Replace("{IsProteinBj}", "checked");
            }
            else
            {
                html = html.Replace("{IsProteinBj}", "");
            }
            if (testForm.IsProtein24h)
            {
                html = html.Replace("{IsProtein24h}", "checked");
            }
            else
            {
                html = html.Replace("{IsProtein24h}", "");
            }
            if (testForm.IsUrea24h)
            {
                html = html.Replace("{IsUrea24h}", "checked");
            }
            else
            {
                html = html.Replace("{IsUrea24h}", "");
            }
            if (testForm.IsUricAcid24h)
            {
                html = html.Replace("{IsUricAcid24h}", "checked");
            }
            else
            {
                html = html.Replace("{IsUricAcid24h}", "");
            }
            if (testForm.IsCreat24h)
            {
                html = html.Replace("{IsCreat24h}", "checked");
            }
            else
            {
                html = html.Replace("{IsCreat24h}", "");
            }
            if (testForm.IsElec24h)
            {
                html = html.Replace("{IsElec24h}", "checked");
            }
            else
            {
                html = html.Replace("{IsElec24h}", "");
            }
            if (testForm.IsCa24h)
            {
                html = html.Replace("{IsCa24h}", "checked");
            }
            else
            {
                html = html.Replace("{IsCa24h}", "");
            }
            if (testForm.IsKstRuot)
            {
                html = html.Replace("{IsKstRuot}", "checked");
            }
            else
            {
                html = html.Replace("{IsKstRuot}", "");
            }
            if (testForm.IsKstMau)
            {
                html = html.Replace("{IsKstMau}", "checked");
            }
            else
            {
                html = html.Replace("{IsKstMau}", "");
            }
            if (testForm.IsHcBc)
            {
                html = html.Replace("{IsHcBc}", "checked");
            }
            else
            {
                html = html.Replace("{IsHcBc}", "");
            }
            if (testForm.IsDntProtein)
            {
                html = html.Replace("{IsDntProtein}", "checked");
            }
            else
            {
                html = html.Replace("{IsDntProtein}", "");
            }
            if (testForm.IsDntGlucose)
            {
                html = html.Replace("{IsDntGlucose}", "checked");
            }
            else
            {
                html = html.Replace("{IsDntGlucose}", "");
            }
            if (testForm.IsDntCtbc)
            {
                html = html.Replace("{IsDntCtbc}", "checked");
            }
            else
            {
                html = html.Replace("{IsDntCtbc}", "");
            }
            if (testForm.IsDntAnti)
            {
                html = html.Replace("{IsDntAnti}", "checked");
            }
            else
            {
                html = html.Replace("{IsDntAnti}", "");
            }
            if (testForm.IsDkProtein)
            {
                html = html.Replace("{IsDkProtein}", "checked");
            }
            else
            {
                html = html.Replace("{IsDkProtein}", "");
            }
            if (testForm.IsDkGlucose)
            {
                html = html.Replace("{IsDkGlucose}", "checked");
            }
            else
            {
                html = html.Replace("{IsDkGlucose}", "");
            }
            if (testForm.IsDkCtbc)
            {
                html = html.Replace("{IsDkCtbc}", "checked");
            }
            else
            {
                html = html.Replace("{IsDkCtbc}", "");
            }
            if (testForm.IsDkAnti)
            {
                html = html.Replace("{IsDkAnti}", "checked");
            }
            else
            {
                html = html.Replace("{IsDkAnti}", "");
            }
            if (testForm.IsDpbProtein)
            {
                html = html.Replace("{IsDpbProtein}", "checked");
            }
            else
            {
                html = html.Replace("{IsDpbProtein}", "");
            }
            if (testForm.IsDpbRivalta)
            {
                html = html.Replace("{IsDpbRivalta}", "checked");
            }
            else
            {
                html = html.Replace("{IsDpbRivalta}", "");
            }
            if (testForm.IsDpbCell)
            {
                html = html.Replace("{IsDpbCell}", "checked");
            }
            else
            {
                html = html.Replace("{IsDpbCell}", "");
            }
            if (testForm.IsDpbAnti)
            {
                html = html.Replace("{IsDpbAnti}", "checked");
            }
            else
            {
                html = html.Replace("{IsDpbAnti}", "");
            }

            string otherTest = !string.IsNullOrWhiteSpace(testForm.OtherTest) ?
                testForm.OtherTest :
                ".......................................................................................................... " +
                ".......................................................................................................... " +
                "..........................................................................................................";
            html = html.Replace("{OtherTest}", otherTest);

            string doctorName = doctor.FullName;
            html = html.Replace("{doctorName}", doctorName);

            string indexHtml = $"{appDirectory}/wwwroot/index.html";
            using (StreamWriter sw = new StreamWriter(indexHtml, false, Encoding.UTF8))
            {
                sw.WriteLine(html);
            }

            string url = $"file:///{appDirectory}/wwwroot/index.html";

            SelectPdf.HtmlToPdf converter = new SelectPdf.HtmlToPdf();
            converter.Options.PdfPageSize = SelectPdf.PdfPageSize.A4;
            converter.Options.PdfPageOrientation = SelectPdf.PdfPageOrientation.Portrait;
            converter.Options.WebPageFixedSize = true;
            converter.Options.WebPageWidth = 793;
            converter.Options.WebPageHeight = 1123;
            converter.Options.AutoFitWidth = SelectPdf.HtmlToPdfPageFitMode.AutoFit;
            converter.Options.AutoFitHeight = SelectPdf.HtmlToPdfPageFitMode.ShrinkOnly;

            string createdTime = DateTime.Now.ToString("HHmmssddMMyyyy");
            string saveFile = $"PXN_{createdTime}.pdf";
            string saveDirectory = $"{appDirectory}\\PXN";
            string savePath = $"{saveDirectory}\\{saveFile}";

            SelectPdf.PdfDocument pdf = converter.ConvertUrl(url);
            pdf.Save(savePath);
            pdf.Close();

            ProcessStartInfo startInfo = new ProcessStartInfo(savePath)
            {
                Verb = "Print",
                CreateNoWindow = true,
                WindowStyle = ProcessWindowStyle.Hidden,
            };
            Process.Start(startInfo);

            ChromelyResponse response = new ChromelyResponse(request.Id)
            {
                Data = new
                {
                    Message = $"In phiếu chỉ định xét nghiệm thành công lúc {DateTime.Now.ToString()}.",
                }
            };

            return response;
        }
    }
}
