using System;
using System.Security.Cryptography;
using System.Text;
using System.Globalization;

namespace ClinicAPI.Helpers
{
    public static class Utilities
    {
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

        public static bool HasMD5Hash(this string text, string md5Hash)
        {
            StringComparer comparer = StringComparer.CurrentCultureIgnoreCase;
            return comparer.Compare(text.ToMD5Hash(), md5Hash) == 0;
        }
    }
}
