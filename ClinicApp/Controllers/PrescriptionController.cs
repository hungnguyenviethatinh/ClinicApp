using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using Chromely.Core.RestfulService;
using System.Text.Json;
using ClinicApp.Core;
using ClinicApp.ViewModels;

namespace ClinicApp.Controllers
{
    [ControllerProperty(Name = "PrescriptionController", Route = "prescription")]
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
            var openTimes = data.OpenTimes;

            string appDirectory = AppDomain.CurrentDomain.BaseDirectory;
            string templateHtml = $"{appDirectory}/wwwroot/templates/dt.html";


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

            string diagnosis = !string.IsNullOrWhiteSpace(prescription.Diagnosis) ? prescription.Diagnosis : "";
            string otherDiagnosis = !string.IsNullOrWhiteSpace(prescription.OtherDiagnosis) ? prescription.OtherDiagnosis : "";
            string separator = (!string.IsNullOrEmpty(diagnosis) && !string.IsNullOrEmpty(otherDiagnosis)) ? ", " : "";
            string diagnosisName = (!string.IsNullOrEmpty(diagnosis) || !string.IsNullOrEmpty(otherDiagnosis)) ?
                $"{diagnosis}{separator}{otherDiagnosis}" :
                "................................................................................................." +
                "...........................................................................................";
            html = html.Replace("{diagnosisName}", diagnosisName);

            string medicineHtmls = "";
            if (medicines != null && medicines.Count > 0)
            {
                int index = 1;
                foreach (var medicine in medicines)
                {
                    string medicineHtml =
                    @"<div class=""prescription-item row"">
                        <div class=""col-6""><b class=""fs-16"">{index} </b><i> {medicineName}</div>
                        <div class=""col-6""> Số lượng : {medicineQuantity} {medicineUnit}</i></div>
                        <div class=""col-12 font-italic"">{medicineTakeMethod} {medicineTakePeriod} <u>{medicineTakeTimes}</u> lần, lần <u>{amountPerTime}</u> {medicineUnit}, <u>......................</u>ăn. <u>Lưu ý :</u> {medicineNote} </div>
                      </div>";


                    medicineHtml = medicineHtml.Replace("{index}", $"{index}");

                    string ingredient = !string.IsNullOrWhiteSpace(medicine.Ingredient) ? $"({medicine.Ingredient})" : "";
                    string medicineName = $"<b>{medicine.MedicineName}</b>&nbsp;{medicine.NetWeight} {ingredient}";
                    medicineHtml = medicineHtml.Replace("{medicineName}", medicineName);

                    string quantity = $"{medicine.Quantity}";
                    medicineHtml = medicineHtml.Replace("{medicineQuantity}", quantity);

                    string unit = medicine.Unit;
                    medicineHtml = medicineHtml.Replace("{medicineUnit}", unit);

                    string takePeriod = medicine.TakePeriod.ToLower();
                    medicineHtml = medicineHtml.Replace("{medicineTakePeriod}", takePeriod);

                    string takeMethod = medicine.TakeMethod;
                    medicineHtml = medicineHtml.Replace("{medicineTakeMethod}", takeMethod);

                    string takeTimes = $"{medicine.TakeTimes}";
                    medicineHtml = medicineHtml.Replace("{medicineTakeTimes}", takeTimes);

                    if (takePeriod.Equals(TakePeriodConstants.Day, StringComparison.OrdinalIgnoreCase))
                    {
                        string afterBreakfast = medicine.AfterBreakfast != null ?
                            medicine.AfterBreakfast.ToString() :
                            "..............";
                        medicineHtml = medicineHtml.Replace("{amountPerTime}", afterBreakfast);
                    }
                    else
                    {
                        string ammountPerTime = medicine.AmountPerTime != null ?
                            medicine.AmountPerTime.ToString() :
                            "..............";
                        medicineHtml = medicineHtml.Replace("{amountPerTime}", ammountPerTime);
                    }

                    string medicineNote = !string.IsNullOrWhiteSpace(medicine.Note) ?
                        medicine.Note :
                        "........................................................................... ";
                    medicineHtml = medicineHtml.Replace("{medicineNote}", medicineNote);

                    medicineHtmls += medicineHtml;
                    index++;
                }
            }
            html = html.Replace("{medicines}", medicineHtmls);

            string appointmentHtml;
            if (!string.IsNullOrWhiteSpace(patient.AppointmentDate))
            {
                appointmentHtml =
                @"<u class=""font-weight-bold"">Tái khám: </u>
                    ........................................, Thứ {thu}, ngày {ngay} tháng {thang} năm {nam}.";

                DateTime appointedDate = DateTime.ParseExact(patient.AppointmentDate,
                    Constants.DisplayDateFormat,
                    System.Globalization.CultureInfo.CurrentCulture);
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
                @"<u class=""font-weight-bold"">Tái khám: </u>
                    ........................................, Thứ ........, ngày .......... tháng .......... năm 20...............";
            }
            html = html.Replace("{appointmentDate}", appointmentHtml);

            string prescriptionNote = !string.IsNullOrWhiteSpace(prescription.Note) ?
                prescription.Note :
                "....................................................................................." +
                ".....................................................................................";
            html = html.Replace("{prescriptionNote}", prescriptionNote);

            if (openTimes.Count > 0)
            {
                string openTimeHtmls = "";
                foreach (var openTime in openTimes)
                {
                    string openClosedTime = openTime.OpenClosedTime;
                    if (openClosedTime.StartsWith("-"))
                    {
                        openTimeHtmls += $"<span>{openClosedTime}</span>";
                    }
                    else
                    {
                        openTimeHtmls += $"<span>- {openClosedTime}</span>";
                    }
                }
                html = html.Replace("{openTimes}", openTimeHtmls);
            }
            else
            {
                html = html.Replace("{openTimes}", "");
            }

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
            string saveFile = $"DT_{createdTime}.pdf";
            string saveDirectory = $"{appDirectory}\\DT";
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
                    Message = $"In đơn thuốc thành công lúc {DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss")}!",
                }
            };

            return response;
        }
    }
}
