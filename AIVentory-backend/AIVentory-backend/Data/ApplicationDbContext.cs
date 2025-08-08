using Microsoft.EntityFrameworkCore;
using AIVentory_backend.Models.Entities;

namespace AIVentory_backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Company> Companies { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Stock> Stock { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }
        public DbSet<AIAnalysis> AIAnalyses { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<ProductSupplier> ProductSuppliers { get; set; }
        public DbSet<StockPrediction> StockPredictions { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }
        public DbSet<SystemSetting> SystemSettings { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<AIAnalysis> AIAnalysis { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

           
            modelBuilder.Entity<Company>(entity =>
            {
                entity.ToTable("Companies");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
                entity.HasIndex(e => e.Email).IsUnique();

              
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

           
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();

                entity.HasOne(e => e.Company)
                    .WithMany(c => c.Users)
                    .HasForeignKey(e => e.CompanyId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(e => e.Role)
                    .HasConversion<string>()
                    .HasMaxLength(20);

               
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

          
            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("Categories");
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Company)
                    .WithMany(c => c.Categories)
                    .HasForeignKey(e => e.CompanyId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Parent)
                    .WithMany(c => c.Children)
                    .HasForeignKey(e => e.ParentId)
                    .OnDelete(DeleteBehavior.SetNull);

               
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

          
            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("Products");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Barcode).IsUnique();

                entity.HasOne(e => e.Company)
                    .WithMany(c => c.Products)
                    .HasForeignKey(e => e.CompanyId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Category)
                    .WithMany(c => c.Products)
                    .HasForeignKey(e => e.CategoryId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.CreatedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);

               
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

         
            modelBuilder.Entity<Stock>(entity =>
            {
                entity.ToTable("Stock");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.ProductId).IsUnique();

                entity.HasOne(e => e.Product)
                    .WithOne(p => p.Stock)
                    .HasForeignKey<Stock>(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(e => e.AvailableStock)
                    .HasComputedColumnSql("(`CurrentStock` - `ReservedStock`)", stored: true);

              
                entity.Property(e => e.LastStockUpdate).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

           
            modelBuilder.Entity<StockMovement>(entity =>
            {
                entity.ToTable("StockMovements");
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Product)
                    .WithMany()
                    .HasForeignKey(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

               
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

         
            modelBuilder.Entity<AIAnalysis>(entity =>
            {
                entity.ToTable("AIAnalysis");
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Product)
                    .WithMany()
                    .HasForeignKey(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Company)
                    .WithMany()
                    .HasForeignKey(e => e.CompanyId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

              
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

           
            modelBuilder.Entity<Supplier>(entity =>
            {
                entity.ToTable("Suppliers");
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Company)
                    .WithMany()
                    .HasForeignKey(e => e.CompanyId)
                    .OnDelete(DeleteBehavior.Cascade);

              
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

        
            modelBuilder.Entity<ProductSupplier>(entity =>
            {
                entity.ToTable("ProductSuppliers");
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => new { e.ProductId, e.SupplierId }).IsUnique();

                entity.HasOne(e => e.Product)
                    .WithMany()
                    .HasForeignKey(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Supplier)
                    .WithMany(s => s.ProductSuppliers)
                    .HasForeignKey(e => e.SupplierId)
                    .OnDelete(DeleteBehavior.Cascade);

               
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

          
            modelBuilder.Entity<StockPrediction>(entity =>
            {
                entity.ToTable("StockPredictions");
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => new { e.ProductId, e.PredictionDate }).IsUnique();

                entity.HasOne(e => e.Product)
                    .WithMany()
                    .HasForeignKey(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Company)
                    .WithMany()
                    .HasForeignKey(e => e.CompanyId)
                    .OnDelete(DeleteBehavior.Cascade);

              
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

           
            modelBuilder.Entity<UserActivity>(entity =>
            {
                entity.ToTable("UserActivities");
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Company)
                    .WithMany()
                    .HasForeignKey(e => e.CompanyId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            modelBuilder.Entity<SystemSetting>(entity =>
            {
                entity.ToTable("SystemSettings");
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => new { e.CompanyId, e.SettingKey }).IsUnique();

                entity.HasOne(e => e.Company)
                    .WithMany()
                    .HasForeignKey(e => e.CompanyId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.UpdatedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.UpdatedBy)
                    .OnDelete(DeleteBehavior.SetNull);

             
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

        
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.ToTable("Notifications");
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Company)
                    .WithMany()
                    .HasForeignKey(e => e.CompanyId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });
        }
    }
}