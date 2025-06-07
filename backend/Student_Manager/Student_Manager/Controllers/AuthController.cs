using Microsoft.AspNetCore.Mvc;
using Student_Manager.Data;
using Microsoft.EntityFrameworkCore;
using Student_Manager.Model.DTO.Account;
using Student_Manager.Model.Entities;
using Student_Manager.Services;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtTokenService _jwtTokenService;

    public AuthController(AppDbContext context, JwtTokenService jwtTokenService)
    {
        _context = context;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(Login dto)
    {
        var acc = await _context.account.FirstOrDefaultAsync(a => a.account_username == dto.Username);
        if (acc == null)
            return Unauthorized("Invalid username or password.");

        bool isValidPassword = BCrypt.Net.BCrypt.Verify(dto.Password, acc.account_password);
        if (!isValidPassword)
            return Unauthorized("Invalid username or password.");

        var token = _jwtTokenService.GenerateToken(acc.account_username);

        return Ok(new { token, message = "Login Successful!" });
    }
}
