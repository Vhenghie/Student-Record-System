using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Student_Manager.Data;
using Student_Manager.Model;
using Student_Manager.Model.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Student_Manager.Model.DTO.Student;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authorization;

namespace Student_Manager.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public StudentController(AppDbContext dbContext, IMapper mapper)
        {
            this._context = dbContext;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult getStudent()
        {
            DateTime today = DateTime.Today;

            var result = _context.student
                .Include(s => s.Course)
                .Include(s => s.Academic_Level)
                .Include(s => s.Academic_Year)
                .Select(s => new
                {
                    student_id = s.student_id,
                    student_first_name = s.student_first_name,
                    student_last_name = s.student_last_name,
                    student_middle_name = s.student_middle_name,
                    student_address = s.student_address,
                    student_gender = s.student_gender,
                    student_email = s.student_email,
                    student_mobile = s.student_mobile,
                    student_dob = s.student_dob,
                    student_age = today.Year - s.student_dob.Value.Year -
                            (s.student_dob.Value.Date > today.AddYears(-(today.Year - s.student_dob.Value.Year)) ? 1 : 0),
                    student_grade_level_id = s.student_academic_level_id,
                    student_grade_year_id = s.student_academic_year_id,
                    student_course_id = s.student_course_id,
                    student_course_name = s.Course.course_name,
                    student_academic_level_name = s.Academic_Level.academic_level_name,
                    student_academic_year_name = s.Academic_Year.academic_year_name
                });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult getStudentById(int id)
        {
            var result = _context.student.Find(id);
            if (result is null) return NotFound("Student not found!");
            return Ok(result);
        }

        [HttpPost]
        public IActionResult createStudent(CreateStudent createStudent)
        {
            try
            {
                var entity = new Student
                {
                    student_first_name = createStudent.student_first_name,
                    student_last_name = createStudent.student_last_name,
                    student_middle_name = createStudent.student_middle_name,
                    student_gender = createStudent.student_gender,
                    student_address = createStudent.student_address,
                    student_email = createStudent.student_email,
                    student_mobile = createStudent.student_mobile,
                    student_dob = createStudent.student_dob,
                    student_academic_level_id = createStudent.student_academic_level_id,
                    student_academic_year_id = createStudent.student_academic_year_id,
                    student_course_id = createStudent.student_course_id
                };  

                _context.student.Add(entity);
                _context.SaveChanges();
                return Ok(entity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating Student: {ex.Message}");
            }
        }

        [HttpPatch("{id}")]
        public IActionResult updateStudent(int id, [FromBody] UpdateStudent updateStudent)
        {
            try
            {
                var acc = _context.student.Find(id);
                if (acc == null) return NotFound("Student not found");

                _mapper.Map(updateStudent, acc);
                _context.SaveChanges();

                return Ok(acc);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating Student: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteStudent(int id)
        {
            try
            {
                var ent = _context.student.Find(id);

                if (ent == null) return NotFound("Student not found");

                _context.student.Remove(ent);
                _context.SaveChanges();
                return Ok(ent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting Student: {ex.Message}");
            }
        }
    }
}
