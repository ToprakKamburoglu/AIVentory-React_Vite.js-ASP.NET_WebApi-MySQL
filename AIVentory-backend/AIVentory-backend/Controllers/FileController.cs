
using Microsoft.AspNetCore.Mvc;
using AIVentory_backend.Services.Interfaces;

namespace AIVentory_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly ILogger<FileController> _logger;

        public FileController(IFileService fileService, ILogger<FileController> logger)
        {
            _fileService = fileService;
            _logger = logger;
        }

      
        [HttpPost("upload-image")]
        public async Task<ActionResult> UploadImage(IFormFile file, [FromQuery] string folder = "products")
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { success = false, message = "Dosya seçilmedi" });
                }

                var imagePath = await _fileService.UploadImageAsync(file, folder);

                // Full URL oluştur
                var imageUrl = $"{Request.Scheme}://{Request.Host}{imagePath}";

                return Ok(new
                {
                    success = true,
                    message = "Resim başarıyla yüklendi",
                    data = new
                    {
                        imagePath = imagePath,   
                        imageUrl = imageUrl,      
                        fileName = Path.GetFileName(imagePath)
                    }
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Resim yükleme hatası");
                return StatusCode(500, new { success = false, message = "Resim yüklenirken hata oluştu" });
            }
        }

      
        [HttpGet("images")]
        public ActionResult GetImages([FromQuery] string folder = "products")
        {
            try
            {
                var images = _fileService.GetExistingImages(folder);

                var imageList = images.Select(img => new
                {
                    imagePath = img,
                    imageUrl = $"{Request.Scheme}://{Request.Host}{img}",
                    fileName = Path.GetFileName(img)
                }).ToList();

                return Ok(new
                {
                    success = true,
                    message = $"{imageList.Count} resim bulundu",
                    data = imageList
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Resim listesi alınırken hata");
                return StatusCode(500, new { success = false, message = "Resim listesi alınırken hata oluştu" });
            }
        }

    
        [HttpDelete("delete-image")]
        public ActionResult DeleteImage([FromQuery] string imagePath)
        {
            try
            {
                if (string.IsNullOrEmpty(imagePath))
                {
                    return BadRequest(new { success = false, message = "Resim yolu belirtilmedi" });
                }

                var deleted = _fileService.DeleteImage(imagePath);

                if (deleted)
                {
                    return Ok(new { success = true, message = "Resim başarıyla silindi" });
                }
                else
                {
                    return NotFound(new { success = false, message = "Resim bulunamadı" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Resim silme hatası");
                return StatusCode(500, new { success = false, message = "Resim silinirken hata oluştu" });
            }
        }
    }
}