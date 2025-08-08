namespace AIVentory_backend.Models.DTOs.Stock
{
    public class StockDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int CurrentStock { get; set; }
        public int ReservedStock { get; set; }
        public int AvailableStock { get; set; }
        public int MinimumStock { get; set; }
        public string StockStatus { get; set; } = string.Empty; 
        public DateTime LastStockUpdate { get; set; }
    }
}