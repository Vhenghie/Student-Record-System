using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Student_Manager.Model.Entities
{
    public class Academic_Level
    {
        [Key]
        public int academic_level_id { get; set; }
        public required string academic_level_name { get; set; }
    }
}
