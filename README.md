# Oscars Hub

A **free, open‑source** API that serves Oscar winners (2020‑2024) with full details – film title, year, directors, main cast, and the category it won. Deploys on Vercel with zero cost.

## Endpoints
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/years` | List all years for which data is available. |
| `GET` | `/api/year/:year` | Full ceremony summary (categories, winners, cast, etc.). |
| `GET` | `/api/movie/:title` | Details for a specific winning film. |
| `GET` | `/api/search?q=…` | Text search across titles, people, categories. |
| `GET` | `/api/health` | Simple health check. |

## License
MIT – see `LICENSE`.
