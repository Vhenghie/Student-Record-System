using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Student_Manager.Model.Entities;

namespace Student_Manager.Model.Entities
{
    public class Course
    {
        [Key]
        public int course_id { get; set; }
        public required string course_name { get; set; }
        public required string course_description { get; set; }
        [ForeignKey("Academic_Level")]
        public int? course_academic_level_id { get; set; }
        public Academic_Level? Academic_Level { get; set; }
    }
}
