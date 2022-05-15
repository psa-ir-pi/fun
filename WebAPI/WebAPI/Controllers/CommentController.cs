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
    public class CommentController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public CommentController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult GetAll()
        {
            string query = @"
                    select dbo.Comment.id, text, from_line, to_line, Comment.date, foreign_version, [User].name, Project.name as Project_name FROM Comment INNER JOIN [User] ON dbo.[User].id=dbo.Comment.foreign_user
					INNER JOIN Version ON Version.id=Comment.foreign_version
					INNER JOIN Branch ON Version.foreign_branch=Branch.id
					INNER JOIN Project ON Project.id=Branch.foreign_project";
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
        [HttpGet("{id}")]
        public JsonResult Get(int id)
        {
            string query = @"
                    select dbo.Comment.id, text, from_line, to_line, Comment.date, foreign_version, [User].name, Project.name as Project_name FROM Comment INNER JOIN [User] ON dbo.[User].id=dbo.Comment.foreign_user
					INNER JOIN Version ON Version.id=Comment.foreign_version
					INNER JOIN Branch ON Version.foreign_branch=Branch.id
					INNER JOIN Project ON Project.id=Branch.foreign_project
                    where id =" + id;
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
        public JsonResult insert(Comment comment)
        {
            string query0 = @$"
                    insert into dbo.Comment (text, from_line, to_line, date, foreign_version, foreign_user) 
                    values ('{comment.text}', {comment.from_line}, {comment.to_line}, '{DateTime.Now.ToString("yyyy/MM/dd HH:mm")}', {comment.foreign_version}, {comment.foreign_user})
                    ";

            string sqlDataSource = _configuration.GetConnectionString("EmployeeAppCon");
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query0, myCon))
                {
                    myCommand.ExecuteNonQuery();
                    myCon.Close();
                }
            }
            return new JsonResult("Succesfully inserted");
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
