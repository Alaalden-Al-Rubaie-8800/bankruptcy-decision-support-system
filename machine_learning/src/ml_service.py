"""واجهة واحدة جاهزة ليستدعيها الـBackend أو الـAI Agent."""

try:
    from .explain import explain_prediction
    from .feature_adapter import build_model_features
    from .predict import predict
except ImportError:
    from explain import explain_prediction
    from feature_adapter import build_model_features
    from predict import predict


def analyze_financial_ratios(yearly_ratios: dict, top_n: int = 5) -> dict:
    """تشغيل التنبؤ والتفسير من 21 مؤشرًا ماليًا لثلاث سنوات."""

    features = build_model_features(yearly_ratios)
    prediction = predict(features)
    explanation = explain_prediction(features, top_n=top_n)

    return {
        "prediction": prediction,
        "explanation": explanation,
    }
