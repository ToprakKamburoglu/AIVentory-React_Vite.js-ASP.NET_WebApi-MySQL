using AIVentory.API.Models.Entities;
using AIVentory_backend.Models.Entities;
using System.ComponentModel.DataAnnotations;

namespace AIVentory.API.Models.Common
{
    public abstract class BaseEntity
    {
        [Key]
        public int Id { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public abstract class BaseEntityWithCompany : BaseEntity
    {
        [Required]
        public int CompanyId { get; set; }

        public virtual Company? Company { get; set; }
    }
}