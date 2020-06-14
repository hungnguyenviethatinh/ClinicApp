using System;
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

            string diagnosis = !string.IsNullOrWhiteSpace(prescription.Diagnosis) ? prescription.Diagnosis : "";
            string otherDiagnosis = !string.IsNullOrWhiteSpace(prescription.OtherDiagnosis) ? prescription.OtherDiagnosis : "";
            string separator = (!string.IsNullOrEmpty(diagnosis) && !string.IsNullOrEmpty(otherDiagnosis)) ? ", " : "";
            string diagnosisName = (!string.IsNullOrEmpty(diagnosis) || !string.IsNullOrEmpty(otherDiagnosis)) ?
                $"{diagnosis}{separator}{otherDiagnosis}" :
                "..................................................................................." +
                "...................................................................................";
            html = html.Replace("{diagnosisName}", diagnosisName);

            string medicineHtmls = "";
            if (medicines != null && medicines.Count > 0)
            {
                int index = 1;
                foreach (var medicine in medicines)
                {
                    string medicineHtml =
                    @"<div class=""prescription-item row"">
                        <div class=""col-9""><b class=""fs-16"">{index} </b><i> {medicineName}</div>
                        <div class=""col-3""> Số lượng: {medicineQuantity} {medicineUnit}</i></div>
                        <div class=""col-12 font-italic"">
                            {medicineTakeMethod} {medicineTakePeriod} 
                            <u>{medicineTakeTimes}</u> lần, lần 
                            <u>{amountPerTime}</u> {medicineUnit}, 
                            {mealTime} ăn. 
                            <u>Lưu ý:</u> {medicineNote} 
                        </div>
                      </div>";


                    medicineHtml = medicineHtml.Replace("{index}", $"{index}");

                    string ingredient = !string.IsNullOrWhiteSpace(medicine.Ingredient) ? $"({medicine.Ingredient})" : "";
                    string medicineName = $"<b>{medicine.MedicineName}</b>&nbsp;{medicine.NetWeight} {ingredient}";
                    medicineHtml = medicineHtml.Replace("{medicineName}", medicineName);

                    string quantity = medicine.Quantity != null ?
                        medicine.Quantity.ToString() :
                        "..............";
                    medicineHtml = medicineHtml.Replace("{medicineQuantity}", quantity);

                    string unit = medicine.Unit;
                    medicineHtml = medicineHtml.Replace("{medicineUnit}", unit);

                    string takePeriod = medicine.TakePeriod.ToLower();
                    medicineHtml = medicineHtml.Replace("{medicineTakePeriod}", takePeriod);

                    string takeMethod = medicine.TakeMethod;
                    medicineHtml = medicineHtml.Replace("{medicineTakeMethod}", takeMethod);

                    string takeTimes = medicine.TakeTimes != null ?
                        medicine.TakeTimes.ToString() :
                        "..............";
                    medicineHtml = medicineHtml.Replace("{medicineTakeTimes}", takeTimes);

                    string amountPerTime = medicine.AmountPerTime != null ?
                        medicine.AmountPerTime.ToString() :
                        "..............";
                    medicineHtml = medicineHtml.Replace("{amountPerTime}", amountPerTime);

                    string mealTime = !string.IsNullOrWhiteSpace(medicine.MealTime) ?
                        medicine.MealTime :
                        "......................";
                    medicineHtml = medicineHtml.Replace("{mealTime}", mealTime);

                    string medicineNote = !string.IsNullOrWhiteSpace(medicine.Note) ?
                        medicine.Note :
                        "........................................................................... ";
                    medicineHtml = medicineHtml.Replace("{medicineNote}", medicineNote);

                    medicineHtmls += medicineHtml;
                    index++;
                }
            }
            html = html.Replace("{medicines}", medicineHtmls);

            string appointmentHtml =
                @"<u class=""font-weight-bold"">Tái khám:</u>&nbsp;
                    {appointmentDays}, Thứ {thu}, ngày {ngay} tháng {thang} năm {nam}.";
            if (!string.IsNullOrWhiteSpace(patient.AppointmentDate))
            {
                appointmentHtml = Utils.GetDateString(patient.AppointmentDate, appointmentHtml);

                string days = Utils.DiffDate(prescription.DateCreated, patient.AppointmentDate);
                string appointmentDays = !string.IsNullOrWhiteSpace(days) ?
                    $"{days} ngày" :
                    "........................................";
                appointmentHtml = appointmentHtml.Replace("{appointmentDays}", appointmentDays);
            }
            else
            {
                appointmentHtml =
                @"<u class=""font-weight-bold"">Tái khám: </u>
                    ........................................, Thứ ........, ngày .......... tháng .......... năm 20...............";
            }
            html = html.Replace("{appointmentDate}", appointmentHtml);

            string dateCreatedHtml = "Thứ {thu}, ngày {ngay} tháng {thang} năm {nam}";
            if (!string.IsNullOrWhiteSpace(prescription.DateCreated))
            {
                dateCreatedHtml = Utils.GetDateString(prescription.DateCreated, dateCreatedHtml);
            }
            else
            {
                dateCreatedHtml = dateCreatedHtml
                    .Replace("{thu}", dayOfWeek)
                    .Replace("{ngay}", date)
                    .Replace("{thang}", month)
                    .Replace("{nam}", year);
            }
            html = html.Replace("{dateCreated}", dateCreatedHtml);

            string prescriptionNote = !string.IsNullOrWhiteSpace(prescription.Note) ?
                prescription.Note.Replace("\n", "<br />") :
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
            string savePath = Utils.GetSavePath(appDirectory, "DT");

            Utils.ConvertPdfFromUrl(converter, url, savePath);
            Utils.PrintPdf(savePath);

            ChromelyResponse response = new ChromelyResponse(request.Id)
            {
                Data = new
                {
                    Message = $"In đơn thuốc thành công lúc {DateTime.Now:dd/MM/yyyy HH:mm:ss}!",
                }
            };

            return response;
        }
    }
}
