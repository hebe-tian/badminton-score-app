# Implementation Tasks - Five-Round Scoring

## Phase 1: Type Definitions

### Task 1.1: Update CourtPositions Type
**File**: `badminton-score-app/src/types/index.ts`  
**Action**: Add `CourtPositions` interface
```typescript
export interface CourtPositions {
  evenCourtPlayer: string;
  oddCourtPlayer: string;
}
```

### Task 1.2: Extend WuYunLunBiMatchState
**File**: `badminton-score-app/src/types/index.ts`  
**Action**: Add court position fields to `WuYunLunBiMatchState`
- Add `teamACourtPositions: CourtPositions`
- Add `teamBCourtPositions: CourtPositions`
- Keep existing `currentPlayerIndices` for UI display

**Dependencies**: Task 1.1

---

## Phase 2: Core Logic Implementation

### Task 2.1: Implement Helper Functions
**File**: `badminton-score-app/src/utils/scoring.ts`  
**Action**: Add utility functions
- `swapCourts(positions: CourtPositions): CourtPositions` - 交换单双数区
- `getReceiverByServer(serverPlayer, serverTeam, teamACourts, teamBCourts): string` - 根据发球人确定接发球人

**Dependencies**: Task 1.1

### Task 2.2: Refactor handleServerScores
**File**: `badminton-score-app/src/utils/scoring.ts`  
**Action**: Create function to handle server scoring scenario
- Increment score for server team
- Swap court positions for server team
- Keep same server player
- Determine new receiver based on server's new position
- Return updated state

**Dependencies**: Task 2.1

### Task 2.3: Refactor handleReceiverScores
**File**: `badminton-score-app/src/utils/scoring.ts`  
**Action**: Create function to handle receiver scoring scenario
- Increment score for receiver team
- Keep all positions unchanged
- Transfer serve to receiving team
- Select new server based on score parity (odd→odd court, even→even court)
- Determine new receiver based on new server's position
- Return updated state

**Dependencies**: Task 2.1

### Task 2.4: Enhance detectRotationThreshold
**File**: `badminton-score-app/src/utils/scoring.ts`  
**Action**: Update existing function to return detailed rotation info
- Return `benchedPlayers` array with team, out player, in player
- Handle both 50-point and 100-point modes (cyclic rotation)
- Use player indices instead of hardcoded names

**Dependencies**: None (existing function, needs enhancement)

### Task 2.5: Implement applyRotation
**File**: `badminton-score-app/src/utils/scoring.ts`  
**Action**: Create function to apply rotation changes
- Update `currentPlayerIndices` based on rotation rules
- Reset positions: new players → even court, remaining → odd court
- Assign serve to leading team's new player (in even court)
- Assign receive to trailing team's new player (in even court)
- Return fully updated state

**Dependencies**: Task 2.4

### Task 2.6: Create Unified handleWuYunLunBiScore
**File**: `badminton-score-app/src/utils/scoring.ts`  
**Action**: Create main scoring handler that orchestrates all logic
- Determine if server or receiver scored
- Call appropriate handler (Task 2.2 or 2.3)
- Check for rotation threshold
- If rotation needed, prepare rotation data (but don't apply yet - let UI handle modal)
- Return updated state and rotation info

**Dependencies**: Task 2.2, 2.3, 2.4

---

## Phase 3: Setup Component

### Task 3.1: Update WuYunLunBiSetup UI Structure
**File**: `badminton-score-app/src/components/WuYunLunBiSetup.tsx`  
**Action**: Ensure proper layout for player name inputs
- Two cards for Team A and Team B
- Each card has 5 text inputs with labels A1-A5, B1-B5
- Inputs should have proper placeholder text

**Dependencies**: None (existing component, verify structure)

### Task 3.2: Implement Mutually Exclusive Server Selection
**File**: `badminton-score-app/src/components/WuYunLunBiSetup.tsx`  
**Action**: Restrict server selection to first 2 players of each team
- Server dropdown options: [A1, A2, B1, B2]
- When server is selected, determine server team

**Dependencies**: None

### Task 3.3: Implement Dynamic Receiver Selection
**File**: `badminton-score-app/src/components/WuYunLunBiSetup.tsx`  
**Action**: Update receiver options based on server selection
- If server is from Team A, receiver options: [B1, B2]
- If server is from Team B, receiver options: [A1, A2]
- Disable or hide unavailable options
- Auto-update receiver if current selection becomes invalid

**Dependencies**: Task 3.2

### Task 3.4: Add Score Mode Toggle
**File**: `badminton-score-app/src/components/WuYunLunBiSetup.tsx`  
**Action**: Ensure 50/100 point toggle works correctly
- Two buttons or radio buttons for 50 and 100
- Highlight selected option
- Update config state on selection

**Dependencies**: None (verify existing implementation)

---

## Phase 4: Match Component

### Task 4.1: Add Court Visualization
**File**: `badminton-score-app/src/components/WuYunLunBiMatch.tsx`  
**Action**: Display court layout with player positions
- Show A队双数区 and A队单数区
- Show B队单数区 and B队双数区
- Display player names in their respective courts
- Update positions reactively when state changes

**Dependencies**: Task 1.2 (new state fields)

### Task 4.2: Add Server/Receiver Indicators
**File**: `badminton-score-app/src/components/WuYunLunBiMatch.tsx`  
**Action**: Display visual indicators for server and receiver
- Add "发" badge next to server player name
- Add "接" badge next to receiver player name
- Use distinct colors or icons for clarity

**Dependencies**: Task 4.1

### Task 4.3: Implement Rotation Modal State
**File**: `badminton-score-app/src/components/WuYunLunBiMatch.tsx`  
**Action**: Add modal state management
- Add `showRotationModal` state (boolean)
- Add `pendingRotation` state (RotationInfo | null)
- Detect rotation threshold after each score update
- Show modal when rotation is needed

**Dependencies**: Task 2.4

### Task 4.4: Build Rotation Modal UI
**File**: `badminton-score-app/src/components/WuYunLunBiMatch.tsx`  
**Action**: Create modal component for rotation confirmation
- Display title: "换人提醒"
- Show Team A change: "A队：{out} 下场 → {in} 上场"
- Show Team B change: "B队：{out} 下场 → {in} 上场"
- Add "确认" button to proceed
- Block further scoring until confirmed

**Dependencies**: Task 4.3

### Task 4.5: Handle Rotation Confirmation
**File**: `badminton-score-app/src/components/WuYunLunBiMatch.tsx`  
**Action**: Apply rotation when user confirms
- Call `applyRotation` function with current state and rotation info
- Update match state with new positions and players
- Close modal
- Resume game

**Dependencies**: Task 2.5, 4.4

### Task 4.6: Disable Scoring During Modal
**File**: `badminton-score-app/src/components/WuYunLunBiMatch.tsx`  
**Action**: Prevent scoring while rotation modal is open
- Disable score buttons when `showRotationModal` is true
- Re-enable after modal closes

**Dependencies**: Task 4.3

---

## Phase 5: App Integration

### Task 5.1: Update handleWuYunLunBiStart
**File**: `badminton-score-app/src/App.tsx`  
**Action**: Initialize court positions on match start
- Set initial positions based on first server/receiver
- Server goes to even court, teammate to odd court
- Receiver goes to even court, teammate to odd court
- Store in `teamACourtPositions` and `teamBCourtPositions`

**Dependencies**: Task 1.2

### Task 5.2: Refactor handleWuYunLunBiScore
**File**: `badminton-score-app/src/App.tsx`  
**Action**: Use new unified scoring handler
- Call `handleWuYunLunBiScore` from utils
- Update state with returned values
- Check for rotation info
- If rotation needed, trigger modal in component (not in App)
- Update score history

**Dependencies**: Task 2.6

### Task 5.3: Update handleRestart
**File**: `badminton-score-app/src/App.tsx`  
**Action**: Reset court positions on restart
- Re-initialize positions same as Task 5.1
- Clear any pending rotation state

**Dependencies**: Task 5.1

---

## Phase 6: Testing & Validation

### Task 6.1: Manual Test - Server Scoring
**Action**: Verify server scoring flow
- Start match with A1 serving
- Score for A team
- Verify A1 moves to correct court based on score parity
- Verify A1 continues serving
- Verify receiver updates correctly

**Dependencies**: All previous tasks

### Task 6.2: Manual Test - Receiver Scoring
**Action**: Verify receiver scoring flow
- Start match with A1 serving
- Score for B team
- Verify serve transfers to B team
- Verify new server selected based on score parity
- Verify positions remain unchanged

**Dependencies**: All previous tasks

### Task 6.3: Manual Test - Rotation at 10 Points
**Action**: Verify rotation logic
- Play until score reaches 10
- Verify modal appears with correct player changes
- Confirm rotation
- Verify new players in even courts
- Verify remaining players in odd courts
- Verify leading team's new player serves

**Dependencies**: All previous tasks

### Task 6.4: Manual Test - Multiple Rotations
**Action**: Verify cyclic rotation
- Continue playing through 20, 30, 40 points
- Verify correct players rotate at each threshold
- For 100-point mode, verify rotation continues past 50

**Dependencies**: Task 6.3

### Task 6.5: Edge Case - Rapid Scoring
**Action**: Test rapid consecutive scores
- Try to score quickly before modal appears
- Verify no state corruption
- Verify modal blocks further scoring

**Dependencies**: Task 4.6

---

## Summary

**Total Tasks**: 23 tasks across 6 phases  
**Estimated Complexity**: Medium-High (complex state management and business logic)  
**Critical Path**: Phase 2 (core logic) → Phase 4 (match component) → Phase 5 (integration)

**Key Files to Modify**:
1. `badminton-score-app/src/types/index.ts` - Type definitions
2. `badminton-score-app/src/utils/scoring.ts` - Core algorithms
3. `badminton-score-app/src/components/WuYunLunBiSetup.tsx` - Setup UI
4. `badminton-score-app/src/components/WuYunLunBiMatch.tsx` - Match UI
5. `badminton-score-app/src/App.tsx` - State orchestration
