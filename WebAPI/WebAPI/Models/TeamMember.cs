using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class TeamMember
    {
        public int id { get; set; }
        public int specialization { get; set; }
        public int foreign_user { get; set; }
        public int foreign_project { get; set; }
    }
}
