using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;
using System.Web;

namespace UnicodeTableGenerator
{
    class Program
    {
        static void Main()
        {
            //DebugRow(0xE0191);
            //return;

            var sb = new StringBuilder();
            var rows = GetRows();

            foreach (var row in rows)
            {
                sb.Append(row);
                sb.Append("\r\n");
            }
            using (var outfile = new StreamWriter(@"UnicodeTable.txt", false))
            {
                outfile.Write(sb.ToString());
            }
        }

        static void DebugRow(int unicodeCharacter)
        {
            var newRow = new UnicodeRow
            {
                Decimal = unicodeCharacter
            };

            Console.WriteLine(newRow.ToString());
        }

        static IEnumerable<UnicodeRow> GetRows()
        {
            var rows = new List<UnicodeRow>();
            //http://www.unicode.org/Public/UNIDATA/UnicodeData.txt
            var lines = File.ReadAllLines(@"UnicodeData.txt");

            foreach (var line in lines)
            {
                var newRow = new UnicodeRow
                {
                    Hexadecimal = line.Split(';')[0],
                    Description = line.Split(';')[1].ToLower()
                };
                if (newRow.Description == "<control>")
                    newRow.Description = line.Split(';')[10].ToLower();

                rows.Add(newRow);
            }
            return rows;
        }
    }

    public class UnicodeRow
    {
        public string Hexadecimal
        {
            get { return "U+" + Decimal.ToString("X"); }
            set { Decimal = int.Parse(value, NumberStyles.HexNumber); }
        }
        public int Decimal { get; set; }

        public string Unicode
        {
            get
            {
                var unicodeCharacter = char.ConvertFromUtf32(Decimal)[0];
                if (string.IsNullOrWhiteSpace(unicodeCharacter.ToString()) || char.IsControl(unicodeCharacter))
                    return "&nbsp;";
                return char.ConvertFromUtf32(Decimal);
            }
            set { Decimal = CharUnicodeInfo.GetDigitValue(value, 0); }
        }

        public string Description { get; set; }

        public override string ToString()
        {
            const string format = "<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td></tr>";

            try
            {
                return string.Format(format, Hexadecimal, Decimal, Unicode, HttpUtility.HtmlEncode(Description));
            }
            catch (ArgumentOutOfRangeException)
            {
                return string.Empty;
            }
        }
    }
}
