using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class Version
    {
        public int id { get; set; }
        public DateTime date { get; set; }
        public int foreign_branch { get; set; }
    }
}
