using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Student_Manager.Data;
using Student_Manager.Model;
using Student_Manager.Model.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Student_Manager.Model.DTO.Academic_Level;
using Microsoft.AspNetCore.Authorization;

namespace Student_Manager.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AcademicLevelController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public AcademicLevelController(AppDbContext dbContext, IMapper mapper)
        {
            this._context = dbContext;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult getAcademicLevel()
        {
            var result = _context.academic_level.ToList();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult getAcademicLevelById(int id)
        {
            var result = _context.academic_level.Find(id);
            if (result is null) return NotFound("Academic Level not found!");
            return Ok(result);
        }

        [HttpPost]
        public IActionResult createAcademicLevel(CreateAcademicLevel createAcademicLevel)
        {
            try
            {
                var entity = new Academic_Level
                {
                    academic_level_name = createAcademicLevel.academic_level_name
                };

                if (string.IsNullOrWhiteSpace(createAcademicLevel.academic_level_name)) return BadRequest("Name is required.");

                _context.academic_level.Add(entity);
                _context.SaveChanges();
                return Ok(entity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating Academic Level: {ex.Message}");
            }
        }

        [HttpPatch("{id}")]
        public IActionResult updateAcademicLevel(int id, [FromBody] UpdateAcademicLevel updateAcademicLevel)
        {
            try
            {
                var level = _context.academic_level.Find(id);
                if (level == null) return NotFound("Level not found");

                _mapper.Map(updateAcademicLevel, level);
                _context.SaveChanges();

                return Ok(level);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating Level: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteAcademicLevel(int id)
        {
            try
            {
                var academiclevel = _context.academic_level.Find(id);

                if (academiclevel == null) return NotFound("Level not found");

                _context.academic_level.Remove(academiclevel);
                _context.SaveChanges();
                return Ok(academiclevel);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting Academic level: {ex.Message}");
            }
        }
    }
}
