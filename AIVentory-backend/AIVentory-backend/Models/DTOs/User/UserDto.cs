namespace AIVentory_backend.Models.DTOs.User
{
    public class UserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public int CompanyId { get; set; }
        public string? CompanyName { get; set; }
    }
}