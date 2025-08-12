

namespace AIVentory_backend.Models.DTOs.AI
{
    public class ColorAnalysisDto
    {
        public string ImageUrl { get; set; } = string.Empty;
        public List<DetectedColor> DominantColors { get; set; } = new();
        public string PrimaryColor { get; set; } = string.Empty;
        public string PrimaryColorCode { get; set; } = string.Empty;
        public decimal Confidence { get; set; }
        public string ColorHarmony { get; internal set; }
        public string ColorTemperature { get; internal set; }
    }

    public class DetectedColor
    {
        public string ColorName { get; set; } = string.Empty;
        public string ColorCode { get; set; } = string.Empty;
        public decimal Percentage { get; set; }
    }

}