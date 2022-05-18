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
                select Task.id,Task.name,Task.description,State_types.type state,Task.type,Task.points,Task.creation_date,Task.closing_date,Task.foreign_sprint,
	                Task.foreign_Team_member,[User].name userName from Task
                    left join Team_member on Task.foreign_Team_member = Team_member.id
                    left join [User] on [User].id = Team_member.foreign_user
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

        [Route("GetSpecializedMembers/{taskid}")]
        [HttpGet]
        public JsonResult GetSpecializedMembers(int taskid)
        {
            string query = @"
                select Team_member.*,[User].max_points,[User].name from Team_member
                inner join [User] on [User].id = Team_member.foreign_user
                where Team_member.foreign_project = 
                (select Sprint.foreign_project from Task
	                inner join Sprint on Task.foreign_sprint =Sprint.id
	                where Task.id = "+taskid+")";
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

        [Route("GetUsersPoints/{userid}")]
        [HttpGet]
        public JsonResult GetUsersPoints(int userid)
        {
            string query = @"
                select Task.points from Task
                inner join Team_member on Team_member.id = Task.foreign_Team_member
                where Team_member.foreign_user = "+userid+" and Task.state != 4";
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

        [Route("AddMemberToTask")]
        [HttpPut]
        public JsonResult AddMemberToTask(Task task)
        {
            string query = @"
                update Task set 
                foreign_Team_member = " + task.foreign_Team_member + "where id = " + task.id;
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

            return new JsonResult("Updated Successfully");
        }

    }
}
