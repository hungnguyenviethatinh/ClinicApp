using System;

namespace ClinicApp.Core
{
    public static class Utils
    {
        public static string GetDayOfWeek(DateTime dateTime)
        {
            string dayOfWeek;
            switch (DateTime.Now.DayOfWeek)
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
    }
}
