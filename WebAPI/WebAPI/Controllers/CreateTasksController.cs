using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CreateTasksController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public CreateTasksController(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        [HttpPost]
        public JsonResult Insert(Task task)
        {
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("EmployeeAppCon");
            SqlDataReader myReader;

            string query = "select * from Task where Task.name='"+task.name+"'";
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
            if (table.Rows.Count > 0)
            {
                return new JsonResult("task with this name already exists");
            }
            query = @"
               INSERT INTO Task
                ([name],[description],[state],[type],[points],[creation_date],[foreign_sprint])
                VALUES
                ('"+task.name+"','"+task.description+ "',1," + task.type+","+task.points + ",CURRENT_TIMESTAMP," + task.foreign_sprint+")";
           
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
            query = @"
                    insert into dbo.Branch (foreign_task) 
                    select id from Task where Task.name = '"+task.name+"'";
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
            query = @"
                    insert into dbo.Version (foreign_branch, date) 
                    select Branch.id , CURRENT_TIMESTAMP from Branch
                    inner join Task on Task.id = Branch.foreign_task
                    where Task.name = '"+task.name+"'";
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


    }
}
