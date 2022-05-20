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
    public class CreateCommentController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public CreateCommentController(IConfiguration configuration)
        {
            _configuration = configuration;
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
