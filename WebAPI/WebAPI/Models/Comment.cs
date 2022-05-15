using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class Comment
    {
        public string text { get; set; }
        public int from_line {get; set; }
        public int to_line { get; set; }
        public DateTime date { get; set; }
        public int foreign_version { get; set; }
        public int foreign_user { get; set; }
    }
}
