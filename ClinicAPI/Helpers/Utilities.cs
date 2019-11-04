using System;
using System.Security.Cryptography;
using System.Text;
using System.Globalization;
using Microsoft.Extensions.Logging;
using System.IO;

namespace ClinicAPI.Helpers
{
    public static class Utilities
    {
        static ILoggerFactory _loggerFactory;

        public static void ConfigureLogger(ILoggerFactory loggerFactory)
        {
            _loggerFactory = loggerFactory;
        }

        public static ILogger CreateLogger<T>()
        {
            if (_loggerFactory == null)
            {
                throw new InvalidOperationException(
                    $"{nameof(ILogger)} is not configured. {nameof(ConfigureLogger)} must be called before use!"
                );
            }

            return _loggerFactory.CreateLogger<T>();
        }

        public static void QuickLog(string text, string filename)
        {
            string dirPath = Path.GetDirectoryName(filename);

            if (!Directory.Exists(dirPath))
            {
                Directory.CreateDirectory(dirPath);
            }

            using (StreamWriter writer = File.AppendText(filename))
            {
                writer.WriteLine($"{DateTime.Now} - {text}");
            }
        }

        public static string ToMD5Hash(this string text)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] computeHash = md5.ComputeHash(Encoding.UTF8.GetBytes(text));

                StringBuilder hash = new StringBuilder();
                foreach (byte element in computeHash)
                {
                    hash.Append(element.ToString("x2", CultureInfo.CurrentCulture));
                }

                return hash.ToString();
            }
        }

        public static bool VerifyMD5Hash(this string text, string md5Hash)
        {
            StringComparer comparer = StringComparer.CurrentCultureIgnoreCase;
            return comparer.Compare(text.ToMD5Hash(), md5Hash) == 0;
        }
    }
}
