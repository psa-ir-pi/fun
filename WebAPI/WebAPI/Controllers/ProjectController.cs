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
    public class ProjectController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ProjectController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult Get()
        {
            string query = @"
                    select * from dbo.Project";
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
        public JsonResult insert(Project project)
        {
            string query0 = @"
                    select * from dbo.Project where name='" + project.name + "'";
                    
            DataTable table0 = new DataTable();
            string sqlDataSource0 = _configuration.GetConnectionString("EmployeeAppCon");
            SqlDataReader myReader0;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource0))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query0, myCon))
                {
                    myReader0 = myCommand.ExecuteReader();
                    table0.Load(myReader0); ;

                    myReader0.Close();
                    myCon.Close();
                }
            }
            if (table0.Rows.Count > 0)
            {
                return new JsonResult("Project with this name already exists");
            }
            else
            {

                string query = @"
                    insert into dbo.Project (name, date, description) values 
                    ('" + project.name + "', CURRENT_TIMESTAMP, '" + project.description + @"')
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


                string query1 = @"
                    insert into dbo.Branch (foreign_project) 
                    select top(1) id from dbo.Project order by  id desc
                    ";
                DataTable table1 = new DataTable();
                string sqlDataSource1 = _configuration.GetConnectionString("EmployeeAppCon");
                SqlDataReader myReader1;
                using (SqlConnection myCon = new SqlConnection(sqlDataSource1))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query1, myCon))
                    {
                        myReader1 = myCommand.ExecuteReader();
                        table1.Load(myReader); ;

                        myReader1.Close();
                        myCon.Close();
                    }
                }

                string query2 = @"
                    insert into dbo.Version (foreign_branch, date) 
                    select top(1) id , CURRENT_TIMESTAMP from dbo.Branch order by  id desc
                    ";
                DataTable table2 = new DataTable();
                string sqlDataSource2 = _configuration.GetConnectionString("EmployeeAppCon");
                SqlDataReader myReader2;
                using (SqlConnection myCon = new SqlConnection(sqlDataSource2))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query2, myCon))
                    {
                        myReader2 = myCommand.ExecuteReader();
                        table2.Load(myReader); ;

                        myReader2.Close();
                        myCon.Close();
                    }
                }
                return new JsonResult("Added Successfully");
            }
        }


        [HttpPut]
        public JsonResult Put(Project project)
        {
            string query0 = @"
                    select * from dbo.Project where name='" + project.name + "'";

            DataTable table0 = new DataTable();
            string sqlDataSource0 = _configuration.GetConnectionString("EmployeeAppCon");
            SqlDataReader myReader0;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource0))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query0, myCon))
                {
                    myReader0 = myCommand.ExecuteReader();
                    table0.Load(myReader0); ;

                    myReader0.Close();
                    myCon.Close();
                }
            }
            if (table0.Rows.Count > 0)
            {
                return new JsonResult("Project with this name already exists");
            }
            else
            {
                string query = @"
                    update dbo.Project set 
                    name = '" + project.name + @"',
                    description = '" + project.description + @"'
                    where id = " + project.id + @" 
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

                return new JsonResult("Updated Successfully");
            }

        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
           string query = @"
                   delete from dbo.Project
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
