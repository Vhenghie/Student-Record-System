using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Student_Manager.Model.Entities;

namespace Student_Manager.Model.Entities
{
    public class Academic_Year
    {
        [Key]
        public int academic_year_id { get; set; }
        public required string academic_year_name { get; set; }
        [ForeignKey("Academic_Level")]
        public required int academic_year_level_id { get; set; }
        public Academic_Level? Academic_Level { get; set; }
    }
}
