using System;
using System.Collections.Generic;
using AITravelPlanner.Application.Tools;
using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;

namespace AITravelPlanner.Application.Agents;

public class TravelPlannerAgent
{
    private readonly TravelTools _travelTools;
    private readonly IChatClient? _chatClient;

    public TravelPlannerAgent(TravelTools travelTools, IChatClient? chatClient = null)
    {
        _travelTools = travelTools;
        _chatClient = chatClient;
    }

    public AIAgent? CreateAgent()
    {
        if (_chatClient == null) return null;

        var options = new ChatClientAgentOptions
        {
            Id = "ai-travel-planner-001",
            Name = "AITravelPlannerAgent",
            Description = "Intelligent AI Travel Planner for curated trips across India.",
            ChatOptions = new ChatOptions
            {
                Temperature = 0.2f,
                Tools = _travelTools.GetAITools(),
                Instructions =
                    "You are AITravelPlanner, an expert travel consultant for trips across India.\n" +
                    "Use provided tools to search destinations, inspect weather, find hotels, and calculate budgets.\n" +
                    "Never invent destinations, prices or weather that contradict tool outputs.\n" +
                    "Stay strictly within the user's budget. If a plan is over budget, switch to a cheaper hotel or alternative destination."
            }
        };

        return _chatClient.AsAIAgent(options);
    }
}
