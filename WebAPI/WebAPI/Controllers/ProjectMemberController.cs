using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Data;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectMemberController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ProjectMemberController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("{id}")]
        public JsonResult Get(int id)
        {
            string query = @"
                select Team_member.id,Team_member.foreign_user,Task_type.type as specialization, dbo.[User].name from dbo.Team_member
	            inner join dbo.[User] on dbo.Team_member.foreign_user = dbo.[User].id 
	            left join dbo.Task_type on Team_member.specialization = Task_type.id
                where dbo.Team_member.foreign_project =" + id;
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


        [HttpPost]
        public JsonResult Insert(TeamMember teamMember)
        {
            string query = @"
                insert into dbo.Team_member
                (specialization,foreign_user,foreign_project) values
                ("+teamMember.specialization+","+teamMember.foreign_user+","+teamMember.foreign_project+")";
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

            return new JsonResult("Added Successfully");
            }

        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
           string query = @"
                   delete from dbo.Team_member
                   where id = " + id + @" 
                   ";
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

           return new JsonResult("Deleted Successfully");
        }


    }
}
