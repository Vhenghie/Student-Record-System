namespace Student_Manager.Model.DTO.Account
{
    public class CreateAccount
    {
        public required string account_first_name { get; set; }
        public required string account_last_name { get; set; }
        public string? account_middle_name { get; set; }
        public required string account_username { get; set; }
        public required string account_password { get; set; }
        public required string account_email { get; set; }
        public DateTime createdAt { get; set; } = DateTime.UtcNow;
    }
}
