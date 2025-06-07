using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer;
using Student_Manager.Model.Entities;

namespace Student_Manager.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Student> student { get; set; }
        public DbSet<Academic_Level> academic_level { get; set; }
        public DbSet<Academic_Year> academic_year { get; set; }
        public DbSet<Account> account { get; set; }
        public DbSet<Course> course { get; set; }
    }
}
