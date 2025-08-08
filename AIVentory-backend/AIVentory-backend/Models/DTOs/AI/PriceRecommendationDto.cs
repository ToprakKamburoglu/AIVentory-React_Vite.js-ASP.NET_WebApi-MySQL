namespace AIVentory_backend.Models.DTOs.AI
{
    public class PriceRecommendationDto
    {
        public string ProductName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public decimal RecommendedPrice { get; set; }
        public decimal MinPrice { get; set; }
        public decimal MaxPrice { get; set; }
        public decimal MarketAverage { get; set; }
        public List<PriceComparison> Comparisons { get; set; } = new();
        public string Reasoning { get; set; } = string.Empty;
        public decimal Confidence { get; set; }
    }

    public class PriceComparison
    {
        public string Source { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ProductName { get; set; } = string.Empty;
    }
}