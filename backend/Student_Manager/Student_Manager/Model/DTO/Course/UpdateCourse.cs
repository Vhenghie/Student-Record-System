namespace Student_Manager.Model.DTO.Course
{
    public class UpdateCourse
    {
        public required string course_name { get; set; }
        public required string course_description { get; set; }
        public int? course_academic_level_id { get; set; }
    }
}
