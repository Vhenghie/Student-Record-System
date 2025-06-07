using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Student_Manager.Model.Entities;

namespace Student_Manager.Model.Entities
{
    public class Student
    {
        [Key]
        public int student_id { get; set; }
        public required string student_first_name { get; set; }
        public required string student_last_name { get; set; }
        public string? student_middle_name { get; set; }
        public required string student_gender { get; set; }
        public required string student_address { get; set; }
        public string? student_email { get; set; }
        public string? student_mobile { get; set; }
        public DateTime? student_dob { get; set; }
        [ForeignKey("Academic_Level")]
        public required int student_academic_level_id { get; set; }
        [ForeignKey("Academic_Year")]
        public int? student_academic_year_id { get; set; }
        [ForeignKey("Course")]
        public int? student_course_id { get; set; }
        public Academic_Level? Academic_Level { get; set; }
        public Academic_Year? Academic_Year { get; set; }
        public Course? Course { get; set; }

    }
}
