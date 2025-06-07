namespace Student_Manager.Model.DTO.Student
{
    public class UpdateStudent
    {
        public string? student_first_name { get; set; }
        public string? student_last_name { get; set; }
        public string? student_middle_name { get; set; }
        public string? student_gender { get; set; }
        public string? student_address { get; set; }
        public string? student_email { get; set; }
        public string? student_mobile { get; set; }
        public DateTime? student_dob { get; set; }
        public required int student_academic_level_id { get; set; }
        public int? student_academic_year_id { get; set; }
        public int? student_course_id { get; set; }
    }
}
