using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssignManually : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AssignManually(IConfiguration configuration)
        {
            _configuration = configuration;
        }


       
        [HttpGet("{taskid}")]
        public JsonResult get(int taskid)
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

        [HttpPut]
        public JsonResult Put(Task task)
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
