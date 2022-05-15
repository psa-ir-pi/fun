using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class Branch
    {
        public int id { get; set; }
        public string name { get; set; }
        public int foregn_project { get; set; }
        public int foreign_task { get; set; }

    }
}
