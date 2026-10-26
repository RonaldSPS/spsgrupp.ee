export const MAINTENANCE_PRICE_PER_SQM = 1.2
/** Üldist miinimumpinda ei ole (kliendi otsus 23.10.2026) — kalkulaatori alumine
 *  piir on illustratiivne lähtepunkt, mitte teeninduse lävi. */
export const MAINTENANCE_MIN_AREA = 100
export const MAINTENANCE_MAX_AREA = 10_000
export const MAINTENANCE_AREA_STEP = 100

export const MAINTENANCE_PRICE_EXAMPLES = [200, 500, 1_500, 5_000] as const

export function calculateMaintenancePrice(area: number): number {
  if (
    !Number.isFinite(area) ||
    area < MAINTENANCE_MIN_AREA ||
    area > MAINTENANCE_MAX_AREA
  ) {
    throw new RangeError(
      `Maintenance area must be between ${MAINTENANCE_MIN_AREA} and ${MAINTENANCE_MAX_AREA} m².`,
    )
  }

  return Math.round(area * MAINTENANCE_PRICE_PER_SQM)
}
