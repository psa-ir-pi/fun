using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ControlTasksController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ControlTasksController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("{id}")]
        public JsonResult Get(int id)
        {
            string query = @"
                select Task.id,Task.name,Task.description,State_types.type state,Task.type,Task.type,Task.points,Task.creation_date,Task.closing_date,Task.foreign_sprint,
	                Task.foreign_Team_member,[User].name userName from Task
                    inner join Team_member on Task.foreign_Team_member = Team_member.id
                    inner join [User] on [User].id = Team_member.foreign_user
                    inner join State_types on Task.state=State_types.id
                    where Task.foreign_sprint = " + id; 
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
