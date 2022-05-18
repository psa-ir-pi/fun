using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ControlSprintController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ControlSprintController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("{id}")]
        public JsonResult Get(int id)
        {
            string query = @"
                select sp.id,sp.name,sp.date,sp.foreign_project,Project.name as projectName from Sprint sp
                inner join Project on Project.id = sp.foreign_project
                inner join Team_member on Team_member.foreign_project = sp.foreign_project
                inner join Team_leader on Team_leader.foreign_team_member = Team_member.id
                inner join [User] on [User].id = Team_member.foreign_user
                where [User].id = " + id+";";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("EmployeeAppCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader); ;

                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult(table);
        }

    }
}
