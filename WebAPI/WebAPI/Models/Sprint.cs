using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class Sprint
    {
        public int id { get; set; }
        public string name { get; set; }
        public DateTime date { get; set; }
        public int foreign_project { get; set; }


    }
}
