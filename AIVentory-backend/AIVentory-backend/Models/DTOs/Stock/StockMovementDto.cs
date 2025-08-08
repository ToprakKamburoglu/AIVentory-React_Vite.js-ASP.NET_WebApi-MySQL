namespace AIVentory_backend.Models.DTOs.Stock
{
    public class StockMovementDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string MovementType { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public int PreviousStock { get; set; }
        public int NewStock { get; set; }
        public decimal? UnitCost { get; set; }
        public decimal? TotalCost { get; set; }
        public string? Reason { get; set; }
        public string? Notes { get; set; }
        public string UserName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}