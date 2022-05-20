using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Data;


namespace WebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ControlFinishedTasksController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ControlFinishedTasksController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet]
        public JsonResult selectFinished()
        {
            string query = @"
                    select  dbo.Task.*, dbo.Task_type.type as taskType, dbo.Sprint.name as sprintName from dbo.Task 
                    inner join dbo.Task_type on dbo.Task.type = dbo.Task_type.id 
                    inner join dbo.Sprint on dbo.Task.foreign_sprint = dbo.Sprint.id 
                    where dbo.Task.state = 3";
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

        [HttpGet("projectID/{Taskid}")]
        public JsonResult GetProjectId(int Taskid)
        {
            string query = @"
                    select dbo.Sprint.foreign_project as ProjectId from dbo.Task
                    inner join dbo.Sprint on dbo.Task.foreign_sprint = dbo.Sprint.id
                    where dbo.Task.id =" + Taskid;
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

        [Route("projectBranch/{projectid}")]
        public JsonResult GetMainBranchVersion(int projectid)
        {
            string query = @$"
                    select  top(1) dbo.version.id as versionId from dbo.Branch
                    inner join dbo.version on dbo.Branch.id = dbo.Version.foreign_branch
                    where dbo.Branch.foreign_project = {projectid}
                    order by dbo.Version.id desc";
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

        [Route("taskBranch/{taskid}")]
        public JsonResult GetThisBranchVersion(int taskid)
        {
            string query = @$"
                    select  top(1) dbo.version.id as versionId from dbo.Branch
                    inner join dbo.version on dbo.Branch.id = dbo.Version.foreign_branch
                    where dbo.Branch.foreign_task = {taskid}
                    order by dbo.Version.id desc";
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
