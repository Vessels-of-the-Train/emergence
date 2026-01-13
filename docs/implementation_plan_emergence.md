# Emergence Math Integration & System Solidification Case

This plan focuses on refining the "Emergence Math" implementation and establishing a robust development infrastructure for the `aetherium-game` sub-project, matching the standards set in Phase 1 and 2.

## User Review Required

> [!IMPORTANT]
> This phase moves from infrastructure to core algorithm refinement.
> We will be modifying `emergenceFlow.ts` to incorporate historical state and synergistic merges.

## Proposed Changes

### [Component] Emergence Math Core (src/engine/...)

#### [MODIFY] [emergenceFlow.ts](file:///c:/Users/juanita/.gemini/antigravity/playground/solar-corona/aetherium-game/src/emergenceFlow.ts)

- Implement `H_log` (history) processing to allow the engine to remember previous states.
- Add logic to handle `merge` operations when input contains multiple vectors.
- Refine valence/grounding calculations based on the latest documented frameworks.

### [Component] UI & Interaction (src/ui/...)

#### [MODIFY] [EmotionCheckIn.tsx](file:///c:/Users/juanita/.gemini/antigravity/playground/solar-corona/aetherium-game/src/EmotionCheckIn.tsx)

- Add sliders for all `EmergenceContext` parameters (Valence, Persistence, Grounding, Clarity).
- Enhance the vector visualization with a 12-point radar chart or improved 2D plot.
- Link the "Notes" field to a simple sentiment analysis stimulus (if possible) or use it as a valence modifier.

### [Component] Infrastructure & Testing (tests/...)

#### [NEW] [package.json](file:///c:/Users/juanita/.gemini/antigravity/playground/solar-corona/aetherium-game/package.json)

- Add `jest`, `playwright`, and `@playwright/test` dependencies.
- Configure `test` and `test:e2e` scripts.

#### [NEW] [jest.config.cjs](file:///c:/Users/juanita/.gemini/antigravity/playground/solar-corona/aetherium-game/jest.config.cjs)

- Initialize Jest configuration for TypeScript/ESM.

#### [NEW] [tests/emergence-math.test.ts](file:///c:/Users/juanita/.gemini/antigravity/playground/solar-corona/aetherium-game/tests/emergence-math.test.ts)

- Create unit tests for `EmergenceMath` operators (`infuse`, `collapse`, `merge`).

## Verification Plan

### Automated Tests

- `npm test`: Verify unit tests for math logic.
- `npx playwright test`: Verify UI integration and flow submission.

### Manual Verification

- Run the dev server and verify the new sliders in `EmotionCheckIn`.
- Observe real-time state changes and ensure higher "Grounding" prevents "COLLAPSE_PROTOCOL".
