using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Data;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CodeLineController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public CodeLineController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet("versionCode/{versionId}")]
        public JsonResult GetVersionCode(int versionId)
        {
            string query = @"
                    select * from dbo.Code_line
                    inner join dbo.version on dbo.Code_line.foreign_version = dbo.Version.id
                    where dbo.Version.id =" + versionId;
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
