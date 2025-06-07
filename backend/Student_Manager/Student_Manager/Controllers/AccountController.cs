using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Student_Manager.Data;
using Student_Manager.Model;
using Student_Manager.Model.Entities;
using Microsoft.EntityFrameworkCore;
using Student_Manager.Model.DTO.Account;

namespace Student_Manager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public AccountController(AppDbContext dbContext, IMapper mapper)
        {
            this._context = dbContext;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult getAccount()
        {
            var result = _context.account.ToList();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult getAccountById(int id)
        {
            var result = _context.account.Find(id);
            if (result is null) return NotFound("Account not found!");
            return Ok(result);
        }

        [HttpPost("register")]
        public IActionResult createAccount(CreateAccount createAccount)
        {
            try
            {
                var entity = new Account
                {
                    account_first_name = createAccount.account_first_name,
                    account_last_name = createAccount.account_last_name,
                    account_middle_name = createAccount.account_middle_name,
                    account_username = createAccount.account_username,
                    account_password = BCrypt.Net.BCrypt.HashPassword(createAccount.account_password),
                    account_email = createAccount.account_email,
                    createdAt = createAccount.createdAt
                };

                _context.account.Add(entity);
                _context.SaveChanges();
                return Ok(entity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating Account: {ex.Message}");
            }
        }

        [HttpPatch("{id}")]
        public IActionResult updateAccount(int id, [FromBody] UpdateAccount updateAccount)
        {
            try
            {
                var acc = _context.account.Find(id);
                if (acc == null) return NotFound("Account not found");

                _mapper.Map(updateAccount, acc);
                _context.SaveChanges();

                return Ok(acc);
            }
            catch (Exception ex)
            {

                return StatusCode(500, $"Error updating Account: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteAccount(int id)
        {
            try
            {
                var ent = _context.account.Find(id);

                if (ent == null) return NotFound("Account not found");

                _context.account.Remove(ent);
                _context.SaveChanges();
                return Ok(ent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting Account: {ex.Message}");
            }
        }
    }
}
