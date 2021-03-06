using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Data;
using WebAPI.Models;

namespace WebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ControlCommentController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ControlCommentController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult select()
        {
            string query = @"
                select dbo.Comment.id, text, from_line, to_line, Comment.date, foreign_version, [User].name, Project.name as Project_name FROM Comment INNER JOIN [User] ON dbo.[User].id=dbo.Comment.foreign_user
                INNER JOIN Version ON Version.id=Comment.foreign_version
                INNER JOIN Branch ON Version.foreign_branch=Branch.id
                LEFT JOIN Task ON Branch.foreign_task=Task.id
                LEFT JOIN Sprint ON Task.foreign_sprint=Sprint.id
                LEFT JOIN Project ON Project.id=Branch.foreign_project or Sprint.foreign_project=Project.Id";
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

        [HttpDelete("{id}")]
        public JsonResult delete(int id)
        {
            string query = @"
                   delete from dbo.Comment
                   where id = " + id + @" 
                   ";
            string sqlDataSource = _configuration.GetConnectionString("EmployeeAppCon");
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.ExecuteNonQuery();
                    myCon.Close();
                }
            }

            return new JsonResult("Deleted Successfully");
        }
    }
}
