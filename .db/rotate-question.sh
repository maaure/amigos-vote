curl -X POST "https://localhost:3000/api/question/rotation" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${CRON_SECRET_KEY}" \
  -d '{}'