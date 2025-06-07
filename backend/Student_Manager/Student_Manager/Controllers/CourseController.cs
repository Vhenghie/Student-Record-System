using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Student_Manager.Data;
using Student_Manager.Model;
using Student_Manager.Model.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Student_Manager.Model.DTO.Course;
using Microsoft.AspNetCore.Authorization;

namespace Student_Manager.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CourseController(AppDbContext dbContext, IMapper mapper)
        {
            this._context = dbContext;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult getCourse()
        {
            var result = _context.course
                .Include(s => s.Academic_Level)
                .Select(s => new
                {
                    course_id = s.course_id,
                    course_name = s.course_name,
                    course_description = s.course_description,
                    course_level_id = s.course_academic_level_id,
                    course_level_name = s.Academic_Level.academic_level_name
                });
            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult getCourseById(int id)
        {
            var result = _context.course.Find(id);
            if (result is null) return NotFound("Course not found!");
            return Ok(result);
        }

        [HttpPost]
        public IActionResult createCourse(CreateCourse createCourse)
        {
            try
            {
                var entity = new Course
                {
                    course_name = createCourse.course_name,
                    course_description = createCourse.course_description,
                    course_academic_level_id = createCourse.course_academic_level_id
                };

                if (string.IsNullOrWhiteSpace(createCourse.course_name)) return BadRequest("Course Name is required.");

                _context.course.Add(entity);
                _context.SaveChanges();
                return Ok(entity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating Course: {ex.Message}");
            }
        }

        [HttpPatch("{id}")]
        public IActionResult updateCourse(int id, [FromBody] UpdateCourse updateCourse)
        {
            try
            {
                var course = _context.course.Find(id);
                if (course == null) return NotFound("Course not found");

                _mapper.Map(updateCourse, course);
                _context.SaveChanges();

                return Ok(course);
            }
            catch (Exception ex)
            {

                return StatusCode(500, $"Error updating Course: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCourse(int id)
        {
            try
            {
                var ent = _context.course.Find(id);

                if (ent == null) return NotFound("Course not found");

                _context.course.Remove(ent);
                _context.SaveChanges();
                return Ok(ent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting Course: {ex.Message}");
            }
        }
    }
}
