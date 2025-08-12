// Models/AI/AIHelperClasses.cs
namespace AIVentory_backend.Models.AI
{
    public class ProductAnalysisResult
    {
        public string ProductName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string SubCategory { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public string ColorCode { get; set; } = string.Empty;
        public List<string> Features { get; set; } = new();
        public decimal EstimatedPrice { get; set; }
        public decimal Confidence { get; set; }
        public string Description { get; set; } = string.Empty;
        public Dictionary<string, string> Specifications { get; set; } = new();
        public List<string> Keywords { get; set; } = new();
    }

    public class ColorAnalysisResult
    {
        public List<DominantColor> DominantColors { get; set; } = new();
        public string ColorHarmony { get; set; } = string.Empty;
        public string ColorTemperature { get; set; } = string.Empty;
        public decimal Brightness { get; set; }
        public decimal Saturation { get; set; }
        public string Contrast { get; set; } = string.Empty;
        public MarketTrends MarketTrends { get; set; } = new();
        public List<string> Suggestions { get; set; } = new();
        public List<string> ComplementaryColors { get; set; } = new();
        public List<string> SimilarProducts { get; set; } = new();
    }

    public class DominantColor
    {
        public string ColorName { get; set; } = string.Empty;
        public string HexCode { get; set; } = string.Empty;
        public string RgbCode { get; set; } = string.Empty;
        public decimal Percentage { get; set; }
        public string ColorFamily { get; set; } = string.Empty;
    }

    public class MarketTrends
    {
        public int Popularity { get; set; }
        public string Season { get; set; } = string.Empty;
        public string Demographic { get; set; } = string.Empty;
        public string Emotion { get; set; } = string.Empty;
    }

    public class PricePredictionResult
    {
        public decimal EstimatedPrice { get; set; }
        public PriceRange PriceRange { get; set; } = new();
        public decimal Confidence { get; set; }
        public List<PriceFactor> Factors { get; set; } = new();
        public MarketAnalysis MarketAnalysis { get; set; } = new();
        public List<string> Recommendations { get; set; } = new();
    }

    public class PriceRange
    {
        public decimal Min { get; set; }
        public decimal Max { get; set; }
    }

    public class PriceFactor
    {
        public string Factor { get; set; } = string.Empty;
        public string Impact { get; set; } = string.Empty;
        public decimal Weight { get; set; }
    }

    public class MarketAnalysis
    {
        public List<decimal> CompetitorPrices { get; set; } = new();
        public string DemandLevel { get; set; } = string.Empty;
        public decimal ProfitMargin { get; set; }
        public decimal SeasonalFactor { get; set; }
    }

    public class MarketTrendResult
    {
        public string Category { get; set; } = string.Empty;
        public string Period { get; set; } = string.Empty;
        public TrendData Trends { get; set; } = new();
        public List<string> Insights { get; set; } = new();
        public List<string> Opportunities { get; set; } = new();
        public List<string> Risks { get; set; } = new();
    }

    public class TrendData
    {
        public string PriceDirection { get; set; } = string.Empty;
        public string DemandTrend { get; set; } = string.Empty;
        public List<string> PopularFeatures { get; set; } = new();
        public List<string> EmergingBrands { get; set; } = new();
    }
}