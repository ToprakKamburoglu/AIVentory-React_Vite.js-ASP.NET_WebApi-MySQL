
using AIVentory_backend.Services.Interfaces;

namespace AIVentory_backend.Services.Implementations
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogger<FileService> _logger;

        public FileService(IWebHostEnvironment webHostEnvironment, ILogger<FileService> logger)
        {
            _webHostEnvironment = webHostEnvironment;
            _logger = logger;
        }

        public async Task<string> UploadImageAsync(IFormFile file, string folder = "products")
        {
            try
            {
                if (file == null || file.Length == 0)
                    throw new ArgumentException("Dosya boş veya geçersiz");

               
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

                if (!allowedExtensions.Contains(fileExtension))
                    throw new ArgumentException("Geçersiz dosya formatı. Sadece resim dosyaları kabul edilir.");

               
                if (file.Length > 5 * 1024 * 1024)
                    throw new ArgumentException("Dosya boyutu 5MB'dan büyük olamaz");

               
                var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", folder);
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

              
                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

               
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                
                return $"/uploads/{folder}/{fileName}";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Dosya yükleme hatası");
                throw;
            }
        }

        public bool DeleteImage(string imagePath)
        {
            try
            {
                if (string.IsNullOrEmpty(imagePath))
                    return false;

               
                var fullPath = Path.Combine(_webHostEnvironment.WebRootPath, imagePath.TrimStart('/'));

                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Dosya silme hatası: {ImagePath}", imagePath);
                return false;
            }
        }

        public List<string> GetExistingImages(string folder = "products")
        {
            try
            {
                var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", folder);

                if (!Directory.Exists(uploadsFolder))
                    return new List<string>();

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };

                var files = Directory.GetFiles(uploadsFolder)
                    .Where(f => allowedExtensions.Contains(Path.GetExtension(f).ToLowerInvariant()))
                    .Select(f => $"/uploads/{folder}/{Path.GetFileName(f)}")
                    .ToList();

                return files;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Mevcut resimler alınırken hata");
                return new List<string>();
            }
        }
    }
}