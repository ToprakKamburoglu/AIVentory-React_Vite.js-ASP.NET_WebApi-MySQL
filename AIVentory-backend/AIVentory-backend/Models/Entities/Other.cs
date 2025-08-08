using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AIVentory.API.Models.Common;
using AIVentory_backend.Models.Entities;

namespace AIVentory.API.Models.Entities
{
    public class Supplier : BaseEntityWithCompany
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [StringLength(100)]
        public string? ContactPerson { get; set; }

        [StringLength(255)]
        public string? Email { get; set; }

        [StringLength(20)]
        public string? Phone { get; set; }

        public string? Address { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(100)]
        public string? Country { get; set; }

        [StringLength(50)]
        public string? TaxNumber { get; set; }

        [StringLength(255)]
        public string? Website { get; set; }

        [StringLength(100)]
        public string? PaymentTerms { get; set; }

        [Column(TypeName = "decimal(2,1)")]
        public decimal? Rating { get; set; }

        public string? Notes { get; set; }

        public bool IsActive { get; set; } = true;

      
        public virtual ICollection<ProductSupplier> ProductSuppliers { get; set; } = new List<ProductSupplier>();
    }

    public class ProductSupplier : BaseEntity
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        public int SupplierId { get; set; }

        [StringLength(100)]
        public string? SupplierProductCode { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? PurchasePrice { get; set; }

        [StringLength(3)]
        public string Currency { get; set; } = "TRY";

        public int MinOrderQuantity { get; set; } = 1;

        public int LeadTimeDays { get; set; } = 7;

        public bool IsPreferred { get; set; } = false;

        public DateOnly? LastPurchaseDate { get; set; }

    
        public virtual Product Product { get; set; } = null!;
        public virtual Supplier Supplier { get; set; } = null!;
    }

    public class UserActivity : BaseEntityWithCompany
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(100)]
        public string Action { get; set; } = string.Empty;

        [StringLength(50)]
        public string? EntityType { get; set; }

        public int? EntityId { get; set; }

        public string? Description { get; set; }

        [StringLength(45)]
        public string? IpAddress { get; set; }

        public string? UserAgent { get; set; }

    
        public virtual User User { get; set; } = null!;
    }

    public class SystemSetting : BaseEntityWithCompany
    {
        [Required]
        [StringLength(100)]
        public string SettingKey { get; set; } = string.Empty;

        public string? SettingValue { get; set; }

        [Required]
        public SettingType SettingType { get; set; } = SettingType.String;

        public string? Description { get; set; }

        public bool IsPublic { get; set; } = false;

        public int? UpdatedBy { get; set; }

   
        public virtual User? UpdatedByUser { get; set; }
    }

    public class Notification : BaseEntityWithCompany
    {
        public int? UserId { get; set; }

        [Required]
        [StringLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;

        [Required]
        public NotificationType Type { get; set; } = NotificationType.Info;

        [Required]
        public NotificationCategory Category { get; set; } = NotificationCategory.System;

        [StringLength(50)]
        public string? RelatedEntityType { get; set; }

        public int? RelatedEntityId { get; set; }

        public bool IsRead { get; set; } = false;

        public DateTime? ReadAt { get; set; }

        public DateTime? ExpiresAt { get; set; }

   
        public virtual User? User { get; set; }
    }

    public enum SettingType
    {
        String,
        Number,
        Boolean,
        Json
    }

    public enum NotificationType
    {
        Info,
        Warning,
        Error,
        Success
    }

    public enum NotificationCategory
    {
        Stock,
        AI,
        System,
        User
    }
}