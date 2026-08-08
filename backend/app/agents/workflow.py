"""تشغيل AI Agent باستخدام LangGraph مع حفظ النتائج."""

from langgraph.graph import END, START, StateGraph
from sqlalchemy.orm import Session
from app.agents.nodes import (
    explain_prediction,
    generate_recommendations,
    load_financial_data,
    predict_bankruptcy,
    save_analysis_results,
    validate_financial_data,
)
from app.agents.state import AgentState

def next_step(state: AgentState) -> str:
    if state.get("status") == "failed":
        return "end"

    return "continue"

def build_agent(db: Session):
    graph = StateGraph(AgentState)

    graph.add_node(
        "load_financial_data",
        lambda state: load_financial_data(state, db),
    )

    graph.add_node(
        "validate_financial_data",
        validate_financial_data,
    )

    graph.add_node(
        "predict_bankruptcy",
        predict_bankruptcy,
    )

    graph.add_node(
        "explain_prediction",
        explain_prediction,
    )

    graph.add_node(
        "generate_recommendations",
        generate_recommendations,
    )

    graph.add_node(
        "save_analysis_results",
        lambda state: save_analysis_results(state, db),
    )

    graph.add_edge(START, "load_financial_data")

    graph.add_conditional_edges(
        "load_financial_data",
        next_step,
        {
            "continue": "validate_financial_data",
            "end": END,
        },
    )

    graph.add_conditional_edges(
        "validate_financial_data",
        next_step,
        {
            "continue": "predict_bankruptcy",
            "end": END,
        },
    )

    graph.add_conditional_edges(
        "predict_bankruptcy",
        next_step,
        {
            "continue": "explain_prediction",
            "end": END,
        },
    )

    graph.add_conditional_edges(
        "explain_prediction",
        next_step,
        {
            "continue": "generate_recommendations",
            "end": END,
        },
    )

    graph.add_conditional_edges(
        "generate_recommendations",
        next_step,
        {
            "continue": "save_analysis_results",
            "end": END,
        },
    )

    graph.add_edge("save_analysis_results", END)

    return graph.compile()

def run_agent(financial_record_id: int, db: Session) -> AgentState:
    agent = build_agent(db)

    state: AgentState = {
        "financial_record_id": financial_record_id,
        "status": "started",
        "error": None,
    }

    return agent.invoke(state)