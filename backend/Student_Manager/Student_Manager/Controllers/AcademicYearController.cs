using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Student_Manager.Data;
using Student_Manager.Model;
using Student_Manager.Model.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Student_Manager.Model.DTO.Academic_Year;
using Microsoft.AspNetCore.Authorization;

namespace Student_Manager.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AcademicYearController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public AcademicYearController(AppDbContext dbContext, IMapper mapper)
        {
            this._context = dbContext;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult getAcademicYear()
        {
            var result = _context.academic_year
                .Include(s => s.Academic_Level)
                .Select(s => new
                {
                    academic_year_id = s.academic_year_id,
                    academic_year_name = s.academic_year_name,
                    academic_year_level_id = s.academic_year_level_id,
                    academic_year_level_name = s.Academic_Level.academic_level_name
                });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult getAcademicYearById(int id)
        {
            var result = _context.academic_year.Find(id);
            if (result is null) return NotFound("Academic Year not found!");
            return Ok(result);
        }

        [HttpPost]
        public IActionResult createAcademicYear(CreateAcademicYear createAcademicYear)
        {
            try
            {
                var entity = new Academic_Year
                {
                    academic_year_name = createAcademicYear.academic_year_name,
                    academic_year_level_id = createAcademicYear.academic_year_level_id
                };

                _context.academic_year.Add(entity);
                _context.SaveChanges();
                return Ok(entity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating Academic Year: {ex.Message}");
            }
        }

        [HttpPatch("{id}")]
        public IActionResult updateAcademicYear(int id, [FromBody] UpdateAcademicYear updateAcademicYear)
        {
            try
            {
                var year = _context.academic_year.Find(id);
                if (year == null) return NotFound("Academic Year not found");

                _mapper.Map(updateAcademicYear, year);
                _context.SaveChanges();

                return Ok(year);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating Academic Year: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteAcademicYear(int id)
        {
            try
            {
                var academicYear = _context.academic_year.Find(id);

                if (academicYear == null) return NotFound("Academic Year not found");

                _context.academic_year.Remove(academicYear);
                _context.SaveChanges();
                return Ok(academicYear);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting Academic Year: {ex.Message}");
            }
        }
    }
}
