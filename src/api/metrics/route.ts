// Simple metrics endpoint for Prometheus
// Tracks quiz submissions

export async function GET() {
  // In a real app, you'd get this from your OpenTelemetry metrics
  // For demo, we'll use a simple counter that increments
  let quizSubmissionCount = 0;
  
  // Increment on each request (for demo purposes)
  quizSubmissionCount += 1;
  
  const metrics = `
# HELP quiz_submission_count Number of quiz submissions
# TYPE quiz_submission_count counter
quiz_submission_count ${quizSubmissionCount}
  `.trim();
  
  return new Response(metrics, {
    headers: {
      'Content-Type': 'text/plain; version=0.0.4',
    },
  });
}
