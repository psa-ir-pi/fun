using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Data;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MergeController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public MergeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
       

        [HttpPost("project")]
        public JsonResult Insert(Task task)
        {
            string query0 = @"
                    select * from dbo.Branch where foreign_project='" + task.id + "'";

            DataTable table0 = new DataTable();
            string sqlDataSource0 = _configuration.GetConnectionString("EmployeeAppCon");
            SqlDataReader myReader0;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource0))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query0, myCon))
                {
                    myReader0 = myCommand.ExecuteReader();
                    table0.Load(myReader0);
                    myReader0.Close();
                    myCon.Close();
                }
            }
            if (table0.Rows.Count != 1)
            {
                return new JsonResult("Branch not found");
            }
            else
            {

                string query = @"
                    insert into dbo.Version (date, foreign_branch) values 
                    (CURRENT_TIMESTAMP, '" + table0.Rows[0][0] + @"')
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
                        table.Load(myReader);
                        myReader.Close();
                        myCon.Close();
                    }
                }
                string query2 = @"
                    select top 1 * from dbo.Version where foreign_branch = '" + table0.Rows[0][0] + @"' order by id desc
                    ";
                DataTable table2 = new DataTable();
                using (SqlConnection myCon = new SqlConnection(sqlDataSource))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query2, myCon))
                    {
                        myReader = myCommand.ExecuteReader();
                        table2.Load(myReader);
                        myReader.Close();
                        myCon.Close();
                    }
                }

                string[] lines = task.lines.Split('\n');
                int i = 1;
                foreach (string line in lines)
                {

                    string query3 = @"
                    insert into dbo.Code_line (line, line_number, foreign_version) values 
                    ('" + line.Replace("'", "''") + @"','" + i++ + @"', '" + table2.Rows[0][0] + @"')
                    ";
                    DataTable table3 = new DataTable();
                    using (SqlConnection myCon = new SqlConnection(sqlDataSource))
                    {
                        myCon.Open();
                        using (SqlCommand myCommand = new SqlCommand(query3, myCon))
                        {
                            myReader = myCommand.ExecuteReader();
                            table3.Load(myReader);
                            myReader.Close();
                            myCon.Close();
                        }
                    }
                }

                return new JsonResult("Pushed Successfully");
            }
        }

        [HttpPost("task")]
        public JsonResult Insert2(Task task)
        {
            string query0 = @"
                    select * from dbo.Branch where foreign_task='" + task.id + "'";

            DataTable table0 = new DataTable();
            string sqlDataSource0 = _configuration.GetConnectionString("EmployeeAppCon");
            SqlDataReader myReader0;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource0))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query0, myCon))
                {
                    myReader0 = myCommand.ExecuteReader();
                    table0.Load(myReader0);
                    myReader0.Close();
                    myCon.Close();
                }
            }
            if (table0.Rows.Count != 1)
            {
                return new JsonResult("Branch not found");
            }
            else
            {

                string query = @"
                    insert into dbo.Version (date, foreign_branch) values 
                    (CURRENT_TIMESTAMP, '" + table0.Rows[0][0] + @"')
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
                        table.Load(myReader);
                        myReader.Close();
                        myCon.Close();
                    }
                }
                string query2 = @"
                    select top 1 * from dbo.Version where foreign_branch = '" + table0.Rows[0][0] + @"' order by id desc
                    ";
                DataTable table2 = new DataTable();
                using (SqlConnection myCon = new SqlConnection(sqlDataSource))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query2, myCon))
                    {
                        myReader = myCommand.ExecuteReader();
                        table2.Load(myReader);
                        myReader.Close();
                        myCon.Close();
                    }
                }

                string[] lines = task.lines.Split('\n');
                int i = 1;
                foreach (string line in lines)
                {

                    string query3 = @"
                    insert into dbo.Code_line (line, line_number, foreign_version) values 
                    ('" + line.Replace("'", "''") + @"','" + i++ + @"', '" + table2.Rows[0][0] + @"')
                    ";
                    DataTable table3 = new DataTable();
                    using (SqlConnection myCon = new SqlConnection(sqlDataSource))
                    {
                        myCon.Open();
                        using (SqlCommand myCommand = new SqlCommand(query3, myCon))
                        {
                            myReader = myCommand.ExecuteReader();
                            table3.Load(myReader);
                            myReader.Close();
                            myCon.Close();
                        }
                    }
                }

                return new JsonResult("Pushed Successfully");
            }
        }
    }
}