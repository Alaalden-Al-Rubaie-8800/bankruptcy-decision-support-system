# Frontend Integration

## Architecture

Browser -> Next.js UI -> Next.js Route Handlers -> FastAPI -> LangGraph Agent -> ML/XAI -> Recommendations/Report -> PostgreSQL

## Authentication

The login page sends email/password only to the Next.js server route. The server exchanges them with `/auth/login` and stores the returned access token in an HttpOnly cookie. Client JavaScript cannot read the token.

## Analysis payload

```json
{
  "financial_record_id": 2,
  "yearly_ratios": {
    "t_minus_3": { "ROA": 0.0 },
    "t_minus_2": { "ROA": 0.0 },
    "t_minus_1": { "ROA": 0.0 }
  }
}
```

Each year contains all 21 ratio codes expected by the current ML adapter.

## No mock behavior

- No hard-coded bankruptcy probability.
- No fake risk level.
- No fake recommendation list.
- No fake history.
- Reports are requested from the real backend report endpoints.

## Error handling

The UI handles validation failures, unauthorized responses, backend errors, failed analysis status, and file parsing errors without displaying fabricated results.
