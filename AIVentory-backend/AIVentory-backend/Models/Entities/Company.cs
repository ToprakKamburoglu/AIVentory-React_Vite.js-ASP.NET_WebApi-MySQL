using AIVentory.API.Models.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AIVentory_backend.Models.Entities
{
    [Table("Companies")]
    public class Company
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(255)]
        public string Name { get; set; }

        [MaxLength(255)]
        public string? Email { get; set; }

        [MaxLength(20)]
        public string? Phone { get; set; }

        public string? Address { get; set; }

        [MaxLength(100)]
        public string? City { get; set; }

        [MaxLength(100)]
        public string Country { get; set; } = "Turkey";

        [MaxLength(50)]
        public string? TaxNumber { get; set; }

        [MaxLength(255)]
        public string? Website { get; set; }

        [MaxLength(500)]
        public string? Logo { get; set; }

        [Column(TypeName = "varchar(20)")]
        public string SubscriptionPlan { get; set; } = "Basic";

        public DateTime? SubscriptionStartDate { get; set; }
        public DateTime? SubscriptionEndDate { get; set; }
        public int MaxUsers { get; set; } = 3;
        public int MaxProducts { get; set; } = 1000;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

     
        public virtual ICollection<User> Users { get; set; }
        public virtual ICollection<Category> Categories { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}