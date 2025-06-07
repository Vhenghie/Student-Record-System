using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Student_Manager.Data;
using Student_Manager.Model;
using Student_Manager.Model.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;


namespace Student_Manager.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChartController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        private readonly IMapper _mapper;
        public ChartController(AppDbContext dbContext, IMapper mapper)
        {
            this._appDbContext = dbContext;
            _mapper = mapper;
        }

        [HttpGet("students-per-course")]
        public IActionResult GetStudentsPerCourse()
        {
            var result = _appDbContext.student
                .Where(s => s.Course != null)
                .GroupBy(s => s.Course.course_name)
                .Select(g => new { Course = g.Key, Count = g.Count() })
                .ToList();
            return Ok(result);
        }

        [HttpGet("students-per-gender")]
        public IActionResult GetStudentsPerGender()
        {
            var result = _appDbContext.student
                .GroupBy(s => s.student_gender)
                .Select(g => new { Gender = g.Key, Count = g.Count() })
                .ToList();
            return Ok(result);
        }

        [HttpGet("students-per-level")]
        public IActionResult GetStudentsPerAcademicLevel()
        {
            var result = _appDbContext.student
                .GroupBy(s => s.Academic_Level.academic_level_name)
                .Select(g => new { Level = g.Key, Count = g.Count() })
                .ToList();
            return Ok(result);
        }
    }
}
