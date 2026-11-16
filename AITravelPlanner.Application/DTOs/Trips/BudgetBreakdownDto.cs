namespace AITravelPlanner.Application.DTOs.Trips;

public class BudgetBreakdownDto
{
    public decimal TravelCost { get; set; }
    public decimal HotelCost { get; set; }
    public decimal FoodCost { get; set; }
    public decimal ActivitiesCost { get; set; }
    public decimal MiscCost { get; set; }
    public decimal TotalEstimatedCost { get; set; }
    public decimal TotalBudget { get; set; }
    public decimal RemainingBudget { get; set; }
    public decimal CostPerTraveller { get; set; }
    public bool WithinBudget => TotalEstimatedCost <= TotalBudget;
    public decimal OverBudgetBy => WithinBudget ? 0 : (TotalEstimatedCost - TotalBudget);
    public string VerdictSummary { get; set; } = string.Empty;
}
