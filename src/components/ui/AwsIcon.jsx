const GLYPHS = {
  lambda: 'λ',
  bedrock: 'AI',
  gateway: 'API',
  dynamodb: 'DB',
  cognito: 'ID',
  iot: 'IoT',
  cloudwatch: 'CW',
  sns: 'SNS',
};

export default function AwsIcon({ glyph = 'lambda', className = '' }) {
  return (
    <span
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded border border-amber/30 bg-amber/10 font-mono text-[10px] font-semibold text-amber ${className}`}
      aria-hidden="true"
    >
      {GLYPHS[glyph] ?? glyph}
    </span>
  );
}
