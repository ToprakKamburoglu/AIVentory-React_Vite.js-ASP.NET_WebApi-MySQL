
namespace AIVentory_backend.Services.Interfaces
{
    public interface IFileService
    {
        /// <summary>
        /// Resim yükler ve dosya yolunu döndürür
        /// </summary>
        /// <param name="file">Yüklenecek dosya</param>
        /// <param name="folder">Hedef klasör (varsayılan: products)</param>
        /// <returns>Relative file path</returns>
        Task<string> UploadImageAsync(IFormFile file, string folder = "products");

        /// <summary>
        /// Resim siler
        /// </summary>
        /// <param name="imagePath">Silinecek resmin relative path'i</param>
        /// <returns>Silme işleminin başarılı olup olmadığı</returns>
        bool DeleteImage(string imagePath);

        /// <summary>
        /// Belirtilen klasördeki mevcut resimleri listeler
        /// </summary>
        /// <param name="folder">Klasör adı</param>
        /// <returns>Resim dosyalarının relative path listesi</returns>
        List<string> GetExistingImages(string folder = "products");
    }
}