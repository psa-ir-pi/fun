using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class Project
    {
        public int id { get; set; }
        public string name { get; set; }
        public DateTime date { get; set; }
        public string description { get; set; }
        public string previousName { get; set; }
    }
}
