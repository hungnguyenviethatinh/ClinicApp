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

            string dayOfWeek = Utils.GetDayOfWeek(DateTime.Now);
            string date = DateTime.Now.Day.ToString();
            string month = DateTime.Now.Month.ToString();
            string year = DateTime.Now.Year.ToString();
            string hour = DateTime.Now.ToString("HH:mm");

            string address = !string.IsNullOrWhiteSpace(patient.Address) ? patient.Address :
                ".................................................................................................";
            string phoneNumber = !string.IsNullOrWhiteSpace(patient.PhoneNumber) ? patient.PhoneNumber :
                "....................................................";
            string prescriptionNote = !string.IsNullOrWhiteSpace(prescription.Note) ? prescription.Note :
                "................................................................................................................................................................";

            string appDirectory = AppDomain.CurrentDomain.BaseDirectory;
            string templateHtml = $"{appDirectory}/wwwroot/templates/dt.html";


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

            html = html.Replace("{patientName}", patient.FullName);
            html = html.Replace("{patientAge}", $"{patient.Age}");
            html = html.Replace("{patientOrderNumber}", $"{patient.OrderNumber}");

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
            html = html.Replace("{patientGender}", genderHtml);
            html = html.Replace("{patientAddress}", address);
            html = html.Replace("{patientPhone}", phoneNumber);
            html = html.Replace("{diagnosisName}", $"{prescription.Diagnosis}, {prescription.OtherDiagnosis}");

            string medicineHtmls = "";
            if (medicines != null && medicines.Count > 0)
            {
                if (medicines.Count >= 10)
                {
                    html = html.Replace("1280px", "100%");
                }

                int index = 1;
                foreach (var medicine in medicines)
                {
                    string medicineHtml =
                    @"<div class=""prescription-item"">
                        <div><b class=""fs-16"">{index} </b><i> {medicineName}  Số lượng : {medicineQuantity} {medicineUnit}</i></div>
                        <div class=""font-italic"">{medicineTakeMethod} {medicineTakePeriod} <u>{medicineTakeTimes}</u> lần, lần <u>{amountPerTime}</u> {medicineUnit}, <u>......................</u>ăn. <u>Lưu ý :</u> {medicineNote} </div>
                      </div>";

                    string ingredient = !string.IsNullOrWhiteSpace(medicine.Ingredient) ? $"({medicine.Ingredient})" : "";

                    medicineHtml = medicineHtml.Replace("{index}", $"{index}");
                    medicineHtml = medicineHtml.Replace("{medicineName}", $"{medicine.MedicineName} {medicine.NetWeight} {ingredient}");
                    medicineHtml = medicineHtml.Replace("{medicineQuantity}", medicine.Quantity.ToString());
                    medicineHtml = medicineHtml.Replace("{medicineUnit}", medicine.Unit);
                    medicineHtml = medicineHtml.Replace("{medicineTakePeriod}", medicine.TakePeriod.ToLower());
                    medicineHtml = medicineHtml.Replace("{medicineTakeMethod}", medicine.TakeMethod);
                    medicineHtml = medicineHtml.Replace("{medicineTakeTimes}", $"{medicine.TakeTimes}");
                    string takePeriod = medicine.TakePeriod;
                    if (takePeriod.Equals(TakePeriodConstants.Day, StringComparison.OrdinalIgnoreCase))
                    {
                        string afterBreakfast = medicine.AfterBreakfast != null ? medicine.AfterBreakfast.ToString() : "........";
                        medicineHtml = medicineHtml.Replace("{amountPerTime}", afterBreakfast);
                    }
                    else
                    {
                        string ammountPerTime = medicine.AmountPerTime != null ? medicine.AmountPerTime.ToString() : "........";
                        medicineHtml = medicineHtml.Replace("{amountPerTime}", ammountPerTime);
                    }

                    string note = !string.IsNullOrWhiteSpace(medicine.Note) ? medicine.Note :
                        "........................................................................... ";
                    medicineHtml = medicineHtml.Replace("{medicineNote}", note);

                    medicineHtmls += medicineHtml;
                    index++;
                }
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

            html = html.Replace("{patientAppointment}", appointmentHtml);
            html = html.Replace("{medicines}", medicineHtmls);
            html = html.Replace("{prescriptionNote}", prescriptionNote);
            html = html.Replace("{doctorName}", doctor.FullName);

            if (openTimes.Count > 0)
            {
                string openTimeHtmls = "";
                foreach (var openTime in openTimes)
                {
                    openTimeHtmls += $"<span>- {openTime.OpenClosedTime}</span>";
                }
                html = html.Replace("{openTimes}", openTimeHtmls);
            }
            else
            {
                html = html.Replace("{openTimes}", "");
            }

            string indexHtml = $"{appDirectory}/wwwroot/index.html";
            using (StreamWriter sw = new StreamWriter(indexHtml, false, Encoding.UTF8))
            {
                sw.WriteLine(html);
            }

            Process.Start(indexHtml);

            string url = $"file:///{appDirectory}/wwwroot/index.html";

            HtmlToPdf converter = new HtmlToPdf();
            converter.Options.PdfPageSize = PdfPageSize.Letter;
            converter.Options.PdfPageOrientation = PdfPageOrientation.Portrait;
            converter.Options.WebPageWidth = 800;

            string patientId = string.Concat(patient.IdCode, patient.Id);
            string patientName = patient.FullName;
            string createdTime = DateTime.Now.ToString("HHmmssddMMyyyy");
            string saveFile = $"{patientId}_{patientName}_{createdTime}.pdf";
            string saveDirectory = $"{appDirectory}\\DonThuoc";
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
                    Message = $"In đơn thuốc thành công!",
                }
            };

            return response;
        }
    }
}
