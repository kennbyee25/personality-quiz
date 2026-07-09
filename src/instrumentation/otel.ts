// Browser-based OpenTelemetry instrumentation
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { trace } from '@opentelemetry/api';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';

// Configure OTLP exporter for traces
const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://192.168.1.157:4317';
const traceExporter = new OTLPTraceExporter({
  url: `${otlpEndpoint}/v1/traces`, // OTLP collector endpoint for traces
});

// Create the tracer provider
const provider = new WebTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'personality-quiz',
  }),
});

// Add the span processor
provider.addSpanProcessor(
  new SimpleSpanProcessor(traceExporter)
);

// Register the provider
trace.setGlobalTracerProvider(provider);

// Auto-instrument web APIs
registerInstrumentations({
  instrumentations: [
    getWebAutoInstrumentations({
      '@opentelemetry/instrumentation-fetch': {
        enabled: true
      },
      '@opentelemetry/instrumentation-xml-http-request': {
        enabled: true
      },
      '@opentelemetry/instrumentation-document-load': {
        enabled: true
      },
      '@opentelemetry/instrumentation-user-interaction': {
        enabled: true
      }
    ]
  ]
});

// Initialize when the module loads
console.log('OpenTelemetry initialized for personality-quiz');
