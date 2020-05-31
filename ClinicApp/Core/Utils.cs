using SelectPdf;
using System;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Text;

namespace ClinicApp.Core
{
    public static class Utils
    {
        public static HtmlToPdf CreateA4Converter()
        {
            HtmlToPdf converter = new HtmlToPdf();
            converter.Options.PdfPageSize = PdfPageSize.A4;
            converter.Options.PdfPageOrientation = PdfPageOrientation.Portrait;
            converter.Options.WebPageFixedSize = true;
            converter.Options.WebPageWidth = 793;
            converter.Options.WebPageHeight = 1123;
            converter.Options.AutoFitWidth = HtmlToPdfPageFitMode.AutoFit;
            converter.Options.AutoFitHeight = HtmlToPdfPageFitMode.ShrinkOnly;

            return converter;
        }

        public static HtmlToPdf CreateA5Converter()
        {
            HtmlToPdf converter = new HtmlToPdf();
            converter.Options.PdfPageSize = PdfPageSize.A5;
            converter.Options.PdfPageOrientation = PdfPageOrientation.Portrait;
            converter.Options.WebPageFixedSize = true;
            converter.Options.WebPageWidth = 560;
            converter.Options.WebPageHeight = 793;
            converter.Options.AutoFitWidth = HtmlToPdfPageFitMode.AutoFit;
            converter.Options.AutoFitHeight = HtmlToPdfPageFitMode.ShrinkOnly;

            return converter;
        }

        public static string GetSavePath(string appDirectory, string prefixFileName)
        {
            string createdTime = DateTime.Now.ToString("HHmmssddMMyyyy");
            string saveFile = $"{prefixFileName}_{createdTime}.pdf";
            string saveDirectory = $"{appDirectory}\\DT";
            string savePath = $"{saveDirectory}\\{saveFile}";

            return savePath;
        }

        public static void ConvertPdfFromUrl(HtmlToPdf converter, string url, string saveFile)
        {
            var pdf = converter.ConvertUrl(url);
            pdf.Save(saveFile);
            pdf.Close();
        }

        public static void PrintPdf(string file)
        {
            ProcessStartInfo startInfo = new ProcessStartInfo(file)
            {
                Verb = "Print",
                CreateNoWindow = true,
                WindowStyle = ProcessWindowStyle.Hidden,
            };
            Process.Start(startInfo);
        }

        public static string ReadTemplate(string file)
        {
            using (StreamReader sr = new StreamReader(file, Encoding.UTF8))
            {
                return sr.ReadToEnd();
            }
        }

        public static void WriteTemplate(string file, string content)
        {
            using (StreamWriter sw = new StreamWriter(file, false, Encoding.UTF8))
            {
                sw.WriteLine(content);
            }
        }

        public static string GetDayOfWeek(DateTime dateTime)
        {
            string dayOfWeek;
            switch (dateTime.DayOfWeek)
            {
                case DayOfWeek.Monday:
                    dayOfWeek = "2";
                    break;
                case DayOfWeek.Tuesday:
                    dayOfWeek = "3";
                    break;
                case DayOfWeek.Wednesday:
                    dayOfWeek = "4";
                    break;
                case DayOfWeek.Thursday:
                    dayOfWeek = "5";
                    break;
                case DayOfWeek.Friday:
                    dayOfWeek = "6";
                    break;
                case DayOfWeek.Saturday:
                    dayOfWeek = "7";
                    break;
                case DayOfWeek.Sunday:
                    dayOfWeek = "CN";
                    break;
                default:
                    dayOfWeek = "";
                    break;
            }

            return dayOfWeek;
        }

        public static string GetDateString(string date, string html)
        {
            DateTime dateTime = ParseDate(date);
            string thu = GetDayOfWeek(dateTime);
            string ngay = dateTime.Day.ToString();
            string thang = dateTime.Month.ToString();
            string nam = dateTime.Year.ToString();

            html = html
                .Replace("{thu}", thu)
                .Replace("{ngay}", ngay)
                .Replace("{thang}", thang)
                .Replace("{nam}", nam);

            return html;
        }

        public static string DiffDate(string startDate, string endDate)
        {
            if (string.IsNullOrWhiteSpace(startDate) || string.IsNullOrWhiteSpace(endDate))
            {
                return string.Empty;
            }

            DateTime startDateTime = ParseDate(startDate);
            DateTime endDateTime = ParseDate(endDate);
            double days = Math.Round((endDateTime - startDateTime).TotalDays);

            return days.ToString();
        }

        static DateTime ParseDate(string date)
        {
            return DateTime.ParseExact(date, Constants.DisplayDateFormat, CultureInfo.CurrentCulture);
        }
    }
}
