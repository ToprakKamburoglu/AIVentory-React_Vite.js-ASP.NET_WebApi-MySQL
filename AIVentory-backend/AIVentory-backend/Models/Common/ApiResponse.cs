namespace AIVentory.API.Models.Common

{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string> Errors { get; set; } = new();
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public static ApiResponse<T> SuccessResponse(T data, string message = "İşlem başarılı")
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data
            };
        }

        public static ApiResponse<T> ErrorResponse(string message, List<string>? errors = null)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Errors = errors ?? new List<string>()
            };
        }

        public static ApiResponse<T> ErrorResponse(List<string> errors)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = "Validation errors occurred",
                Errors = errors
            };
        }
    }

    public class ApiResponse : ApiResponse<object>
    {
        public static ApiResponse SuccessResponse(string message = "İşlem başarılı")
        {
            var response = new ApiResponse();
            response.Success = true;
            response.Message = message;
            return response;
        }

        public static new ApiResponse ErrorResponse(string message, List<string>? errors = null)
        {
            var response = new ApiResponse();
            response.Success = false;
            response.Message = message;
            response.Errors = errors ?? new List<string>();
            return response;
        }
    }

    public class PaginatedResponse<T>
    {
        public List<T> Data { get; set; } = new();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
        public bool HasNextPage => PageNumber < TotalPages;
        public bool HasPreviousPage => PageNumber > 1;

        public static PaginatedResponse<T> Create(List<T> data, int totalCount, int pageNumber, int pageSize)
        {
            return new PaginatedResponse<T>
            {
                Data = data,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
    }

    public class PaginationDto
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public string SearchTerm { get; set; } = string.Empty;
        public string SortBy { get; set; } = "Id";
        public string SortDirection { get; set; } = "asc";

        public int Skip => (PageNumber - 1) * PageSize;
        public int Take => PageSize;
    }

    public class ErrorResponse
    {
        private string v;

        public ErrorResponse(string v)
        {
            this.v = v;
        }

        public string Message { get; set; } = string.Empty;
        public List<string> Errors { get; set; } = new();
        public int StatusCode { get; set; }
        public string Path { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string TraceId { get; set; } = string.Empty;
    }
}