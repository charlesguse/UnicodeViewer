using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace UnicodeTableGenerator
{
    class Program
    {
        static readonly List<int> pageBreaks = new List<int>
        {
            0x97F, 
            0x167F, 
            0x20F0,
            0x2BD1, 
            0xA000,
            0xF8FF,
            0x102FB,
            0x11AF8, 
            0x16A38,
            0x1F0F5, 
            0x10FFFD
        };

        static void Main()
        {

            var rows = GetRows();
            var page = GeneratePages(rows);

            using (var navigationListFile = new StreamWriter("NavigationList.html", false))
            {
                while (page != null)
                {
                    using (var outfile = new StreamWriter(page.FileName, false))
                    {
                        outfile.Write(page.ToString());
                    }
                    navigationListFile.Write(GetNavigation(page));
                    page = page.Next;
                }
            }
        }

        static string GetNavigation(HtmlPage page)
        {
            const string format = @"<li><a href=""/{0}"">{1}</a></li>";

            return string.Format(format, page.FileName, page.Title);
        }

        static List<UnicodeRow> GetRows()
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

        static HtmlPage GeneratePages(List<UnicodeRow> rows)
        {
            var i = 1;
            var page = new HtmlPage(i, rows.First().Decimal, pageBreaks[i - 1]);
            var firstPage = page;
            foreach (var row in rows)
            {
                if (row.Decimal > pageBreaks[i - 1])
                {
                    page.Next = new HtmlPage(++i, row.Decimal, pageBreaks[i - 1]);
                    var previousPage = page;
                    page = page.Next;
                    page.Previous = previousPage;
                }

                page.TableRows.Append(row);
                page.TableRows.Append("\r\n");
            }
            return firstPage;
        }
    }

    public class HtmlPage
    {
        static readonly string template = File.ReadAllText(@"UnicodeTemplate.html");

        public string Title { get; private set; }
        public int Index { get; private set; }
        public HtmlPage Previous { get; set; }
        public HtmlPage Next { get; set; }
        public StringBuilder TableRows { get; set; }

        public string FileName
        {
            get { return Index + ".html"; }
        }

        public HtmlPage(int index, int first, int last)
        {
            TableRows = new StringBuilder();
            Title = string.Format("U+{0} - U+{1}", first.ToString("X"), last.ToString("X"));
            Index = index;
        }

        public override string ToString()
        {
            // 0: Page Title
            // 1: Previous Page Link Disabled
            // 2: Previous Page Link Href
            // 3: Previous Page Description
            // 4: Next Page Link Disabled
            // 5: Next Page Link Href
            // 6: Next Page Description
            // 7: Table Rows
            return string.Format(template, 
                Title, 
                Disabled(Previous), Href(Previous), Description(Previous),
                Disabled(Next), Href(Next), Description(Next),
                TableRows.ToString());

        }

        private string Disabled(HtmlPage page)
        {
            const string bootstrapCss = " disabled";
            return page == null ? bootstrapCss : string.Empty;
        }

        private string Href(HtmlPage page)
        {
            return page == null ? "#" : page.FileName;
        }

        private string Description(HtmlPage page)
        {
            return page == null ? string.Empty : page.Title;
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
                try
                {
                    var unicodeCharacter = char.ConvertFromUtf32(Decimal)[0];
                    if (string.IsNullOrWhiteSpace(unicodeCharacter.ToString(CultureInfo.InvariantCulture)) || char.IsControl(unicodeCharacter))
                        return "&nbsp;";
                    return char.ConvertFromUtf32(Decimal);
                }
                catch (ArgumentOutOfRangeException)
                {
                    return "&nbsp;";
                }

            }
            set { Decimal = CharUnicodeInfo.GetDigitValue(value, 0); }
        }

        public string Description { get; set; }

        public override string ToString()
        {
            const string format = "<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td></tr>";
            return string.Format(format, Hexadecimal, Decimal, Unicode, HttpUtility.HtmlEncode(Description));

        }
    }
}
