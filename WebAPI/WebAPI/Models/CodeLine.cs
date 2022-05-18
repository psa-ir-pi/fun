using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class CodeLine
    {
        public int id { get; set; }
        public string line { get; set; }
        public int line_number { get; set; }

        public int foreign_version { get; set; }
    }
}
