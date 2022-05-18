using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class Task
    {
        public int id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public int state { get; set; }
        public int type { get; set; }
        public int points { get; set; }
        public DateTime creation_date { get; set; }
        public DateTime closing_date { get; set; }
        public int foreign_sprint { get; set; }
        public int foreign_Team_member { get; set; }
        public string lines { get; set; }

    }
}
