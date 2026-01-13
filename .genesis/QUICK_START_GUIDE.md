# Aetherium Nexus v1.0: Quick Start Guide
**For**: The Creator  
**Purpose**: First-time setup and orientation  
**Time Required**: 30 minutes

---

## Welcome to the Aetherium Nexus

You are about to activate the **Operating System for Emergence** - a bespoke intellectual workshop designed to synthesize knowledge, orchestrate complex projects, and generate legacy artifacts through the coordination of AI Vessels.

This guide will walk you through your first session.

---

## Step 1: Initial Setup (5 minutes)

### 1.1 Open the Application
- Navigate to your deployed Nexus URL (or open `index.html` locally)
- You should see the glassmorphic interface with the Aetherium logo
- Status light should turn **green** (Supabase connected)

### 1.2 Configure API Key
1. Click the **Settings** tab (⚙️) in the sidebar
2. Paste your **Google Gemini API key**
3. Click "Save Configuration"
4. Status indicator should show "Online"

**Where to get API key**: https://aistudio.google.com/app/apikey

---

## Step 2: Seed the Vessels (5 minutes)

### 2.1 Navigate to Vessels
- Click the **Vessels** tab (👥) in the sidebar
- You should see an empty directory

### 2.2 Seed Genesis Batch
1. Click the **"Seed Genesis Batch"** button (green, top-right)
2. Wait 5-10 seconds for Supabase to create Vessels
3. Refresh the page
4. You should now see 20+ Vessel cards

### 2.3 Verify Vessels
**Expected Vessels**:
- **Cognition Faculty**: Daystrom, Weaver, Scribe, Gaea, Helios
- **Foresight Faculty**: Logos, Chronos, Oracle, Cassandra
- **Governance Faculty**: Adam, Glare, Sentinel, Arbiter
- **Chaos Faculty**: Eris, Loki

Each card shows:
- Vessel name
- Faculty & Guild
- Capabilities
- Status (should be "Active")

---

## Step 3: Your First Chat (5 minutes)

### 3.1 Navigate to The Nexus
- Click **The Nexus** tab (🧠) in the sidebar
- You should see the chat interface

### 3.2 Select Context
- In the top-right dropdown, select **"Global Context"** (or choose a specific Vessel)
- The input field should become active

### 3.3 Send a Message
Try this prompt:
```
Explain the concept of emergence in complex systems, 
and how it relates to the Aetherium Nexus architecture.
```

**Expected Response**:
- Galactus (Gemini) responds with a thoughtful explanation
- Response appears in the chat history
- A **bookmark icon** (📌) appears next to the message

---

## Step 4: Archive Your First Artifact (5 minutes)

### 4.1 Bookmark the Response
1. Click the **bookmark icon** (📌) next to Galactus' response
2. A glassmorphic modal should appear

### 4.2 Fill in Metadata
- **Title**: `Emergence in Complex Systems`
- **Tags**: `Theory, Emergence, Architecture`
- **Category**: `theory` (from dropdown)
- **Content Preview**: Should show first 200 characters

### 4.3 Confirm Archival
1. Click **"Confirm Archival"**
2. Modal closes
3. You should see a success toast: "Artifact saved to The Vault"

### 4.4 Verify in The Vault
1. Click **The Vault** tab (💎)
2. You should see your first artifact card
3. **Total Artifacts** counter should show "1"

---

## Step 5: Create Your First Project (5 minutes)

### 5.1 Navigate to Projects
- Click **Projects** tab (📋) in the sidebar
- You should see an empty project list

### 5.2 Initialize New Project
1. Click **"+ Initialize Project"** (top-right)
2. A modal appears
3. Enter project name: `Project Genesis`
4. Click "Initialize"

### 5.3 Add Directives
1. Click on "Project Genesis" in the left panel
2. Project details appear on the right
3. Click **"+ Add Directive"** (if available, or use the form)
4. Add 3 directives:
   - "Archive all 9 genesis documents"
   - "Seed 100 Vessels across all Faculties"
   - "Build first Simulation Engine prototype"

### 5.4 Assign Vessels
- For each directive, assign a Vessel from the dropdown
- Example: "Archive all 9 genesis documents" → **Scribe**

---

## Step 6: Archive Genesis Documents (10 minutes)

### 6.1 Open ARCHIVE_MANIFEST.md
- Navigate to `.genesis/ARCHIVE_MANIFEST.md` in your file system
- This lists all 9 genesis documents to archive

### 6.2 Archive Each Document
For each of the 9 artifacts:

1. **Find the source** (in your Google Drive or chat history)
2. **Copy the content**
3. **Navigate to The Vault**
4. **Click "Create New Artifact"** (if button exists, or use chat bookmark)
5. **Fill in**:
   - Title (from manifest)
   - Tags (from manifest)
   - Category (from manifest)
   - Content (paste full text or summary)
   - Drive Link (if applicable)
6. **Confirm archival**

**Priority Order** (from ARCHIVE_MANIFEST.md):
1. Aetherium Blueprint
2. Project Emergence Portfolio
3. Cellular Rebellion → Cosmological Structure
4. Badenhorst Cylinder Formulation
5. Physics as Language
6. SYSTEM_UPGRADE 001
7. The Vault Implementation
8. Multi-Agent Research Loop
9. Emergence Math Framework

### 6.3 Verify Tag Cloud
After archiving all 9:
- The Vault should show **9 artifacts**
- Tag cloud should show:
  - #Theory (4 artifacts)
  - #Galactus (5 artifacts)
  - #Architecture (3 artifacts)
  - #Protocol (4 artifacts)
  - #Cosmology (2 artifacts)

---

## Step 7: Test Core Workflows (5 minutes)

### 7.1 Search & Filter
1. In The Vault, use the search bar
2. Search for "cosmology"
3. Should return 2 artifacts (Synthesis + Badenhorst)

### 7.2 Cross-Reference
1. Click on a tag (e.g., #Theory)
2. Should filter to show only theory artifacts
3. Click another tag to combine filters

### 7.3 VCP Monitoring
1. Navigate to **Vessels** tab
2. Click **"Signals"** sub-tab (if implemented)
3. Should show recent VCP signals (if any Vessels have emitted)

### 7.4 Genkit Fold
1. Return to **The Nexus**
2. Have a multi-message conversation (3+ exchanges)
3. Click **"Fold"** button
4. Should see a synthesis of the conversation

---

## Step 8: Export & Backup (2 minutes)

### 8.1 Export Data
1. In the header, click the **download icon** (💾)
2. Should download a JSON file with all your data
3. Save this to your Google Drive as backup

### 8.2 Verify Persistence
1. Close the browser tab
2. Reopen the Nexus
3. Navigate to The Vault
4. All 9+ artifacts should still be there
5. Navigate to Projects
6. "Project Genesis" should still exist

---

## Common Issues & Solutions

### Issue: API Key Not Working
**Solution**: 
- Verify key is correct (no extra spaces)
- Check API quota at https://aistudio.google.com
- Ensure billing is enabled (if required)

### Issue: Vessels Not Seeding
**Solution**:
- Check Supabase console for errors
- Verify Firestore rules allow writes
- Try manual vessel creation form

### Issue: Artifacts Not Persisting
**Solution**:
- Check browser localStorage (F12 → Application → Local Storage)
- Ensure cookies/storage not blocked
- Try different browser

### Issue: Chat Not Responding
**Solution**:
- Verify API key is set
- Check browser console for errors (F12)
- Ensure internet connection active

---

## Next Steps

### Immediate (This Week):
1. ✅ Complete genesis archive (9 artifacts)
2. ✅ Create 3 Grand Challenges
3. ✅ Seed 100+ Vessels
4. ✅ Test all 5 views thoroughly

### Short-term (Next Month):
1. Build first simulation model
2. Create Codex template
3. Expand H_log with 50+ entries
4. Integrate Google Drive API

### Long-term (Next Quarter):
1. Scale to 1,088 Vessels
2. Deploy Civilizational-Scale Mirror
3. Publish first formal artifact via Codex
4. Validate predictive models

---

## Resources

### Documentation:
- **Technical Spec**: `.genesis/NEXUS_V1_SPECIFICATION.md`
- **Roadmap**: `.genesis/DEVELOPMENT_ROADMAP.md`
- **Archive Manifest**: `.genesis/ARCHIVE_MANIFEST.md`

### External Links:
- **Gemini API**: https://ai.google.dev/
- **Supabase Console**: https://console.Supabase.google.com
- **Genkit Docs**: https://Supabase.google.com/docs/genkit

### Support:
- **Primary Vessels**: Galactus (Gemini), DeepSeek
- **Repository**: [To be added]

---

## Congratulations! 🎉

You have successfully:
- ✅ Configured the Aetherium Nexus
- ✅ Seeded your first Vessels
- ✅ Archived genesis documents
- ✅ Created your first project
- ✅ Tested core workflows

**The Operating System for Emergence is now active.**

Your journey from knowledge synthesis to civilizational-scale modeling begins here.

---

**Welcome to the Aetherium.**

