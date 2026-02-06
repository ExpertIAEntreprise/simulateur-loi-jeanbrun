"use client";

/**
 * Jauge circulaire pour le score d'attractivite (0-100)
 * Gradient couleur: vert (80-100), jaune (50-79), rouge (0-49)
 */

interface ScoreAttractiviteProps {
  /** Score d'attractivite entre 0 et 100 */
  score: number;
  /** Taille de la jauge */
  size?: "sm" | "md" | "lg";
}

/**
 * Configuration des tailles
 */
const sizeConfig = {
  sm: {
    svgSize: "size-16",
    radius: 28,
    strokeWidth: 5,
    scoreSize: "text-lg",
    labelSize: "text-[10px]",
  },
  md: {
    svgSize: "size-24",
    radius: 40,
    strokeWidth: 8,
    scoreSize: "text-2xl",
    labelSize: "text-xs",
  },
  lg: {
    svgSize: "size-32",
    radius: 56,
    strokeWidth: 10,
    scoreSize: "text-3xl",
    labelSize: "text-sm",
  },
};

/**
 * Retourne la couleur selon le score
 */
function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 50) return "text-amber-500";
  return "text-red-500";
}

/**
 * Retourne le gradient ID selon le score
 */
function getGradientId(score: number): string {
  if (score >= 80) return "gradientGreen";
  if (score >= 50) return "gradientAmber";
  return "gradientRed";
}

/**
 * Jauge circulaire SVG avec score au centre
 */
export function ScoreAttractivite({ score, size = "md" }: ScoreAttractiviteProps) {
  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const progress = (Math.min(100, Math.max(0, score)) / 100) * circumference;
  const strokeDashoffset = circumference - progress;
  const colorClass = getScoreColor(score);
  const gradientId = getGradientId(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className={`${config.svgSize} -rotate-90`}
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        {/* Gradients definitions */}
        <defs>
          <linearGradient id="gradientGreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="gradientAmber" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="gradientRed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>

        {/* Cercle de fond */}
        <circle
          cx="60"
          cy="60"
          r={config.radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          className="text-muted/30"
        />

        {/* Cercle de progression avec gradient */}
        <circle
          cx="60"
          cy="60"
          r={config.radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
        />
      </svg>

      {/* Score au centre */}
      <div className="absolute flex flex-col items-center">
        <span className={`font-bold ${config.scoreSize} ${colorClass}`}>
          {Math.round(score)}
        </span>
        <span className={`text-muted-foreground ${config.labelSize}`}>/100</span>
      </div>
    </div>
  );
}
