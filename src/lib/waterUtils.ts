export type PlantState = 'burned' | 'thirsty' | 'ok' | 'overwatered';

export function getPlantState(
  currentMl: number,
  minMl: number,
  targetMl: number,
  maxMl: number
): PlantState {
  // Toleranzbereich um das Ziel herum (±300 ml)
  const lowerOkBound = targetMl - 300;
  const upperOkBound = targetMl + 300;

  // 1. Zu viel gegossen (über dem oberen Toleranzbereich oder Max-Wert)
  if (currentMl > Math.max(upperOkBound, maxMl)) {
    return 'overwatered';
  }

  // 2. Optimaler / Blumiger Bereich (Ziel ± 300 ml)
  if (currentMl >= lowerOkBound && currentMl <= upperOkBound) {
    return 'ok';
  }

  // 3. Unter dem Toleranzbereich, aber noch über/auf dem Minimum
  if (currentMl < lowerOkBound && currentMl >= minMl) {
    return 'thirsty';
  }

  // 4. Kritisch zu wenig (unter dem Minimum)
  if (currentMl < minMl) {
    return 'burned';
  }

  return 'thirsty';
}

// Hilfsfunktion für das heutige Datum im Format YYYY-MM-DD
export function getLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}