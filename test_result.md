#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Improve look & feel + typography of the Latios PDP (starting with /desktops/mt-amd-am4) in a Minisforum style, use real Latios imagery, and REMOVE scroll-driven animations."

frontend:
  - task: "PDP typography + look-and-feel polish (mt-amd-am4)"
    implemented: true
    working: true
    file: "frontend/src/components/pdp/sections.jsx, primitives.jsx, src/index.css, data/pdp/mt-amd-am4.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Refined display type (pdp-display, calmer tracking, balanced wraps), editorial lead paragraphs, soft-lit product stage, accent icon-chip feature tiles with hover lift, accent stat tiles. Swapped wrong/off-product images for real Latios MT photos: I/O map now uses details/mt-rear-close.webp (was dp180-2), audiences education=home-setup.webp (was av-ifp), frontoffice=office.webp (was av-monitor)."
        -working: true
        -agent: "testing"
        -comment: "✅ VERIFIED - Typography and visual polish working perfectly. Hero section displays correctly with product title 'Latios MT — AMD AM4', gallery with 10 thumbnails, 3 chips, intro paragraph, 3 stat tiles, configurator with Processor/Memory/Storage options, and CTAs. Feature grid shows 8 tiles with accent icon chips and hover effects. All images load correctly: I/O map (naturalWidth: 2560), and all 4 audience tabs (enterprise: 1216, education: 1216, government: 1400, frontoffice: 1600). Page loads with HTTP 200, no console errors. Screenshots captured."
  - task: "Remove scroll-driven animations across PDP"
    implemented: true
    working: true
    file: "frontend/src/components/Reveal.jsx, ParallaxImage.jsx, components/pdp/PdpReveal.jsx, pages/ModelPage.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Reveal is now a static passthrough (no whileInView fade/translate). ParallaxImage renders a static framed image (no scroll y-drift, removed 1.2 pre-scale; hover spotlight kept). PdpReveal converted from a tall sticky scroll-scrubbed canvas sequence into a static two-column band (heading + numbered service steps + single open-chassis still, onError falls back to details/mt-interior.webp) — no 'Scroll to open', no progress bar. ModelPage standard hero parallax (imgY/fade) removed for non-PDP pages."
        -working: true
        -agent: "testing"
        -comment: "✅ VERIFIED - All scroll-driven animations successfully removed. Sections are immediately visible on scroll (opacity: 1.0) with NO fade-in/slide-up entrance animations. Serviceability section (pdp-reveal) is now a STATIC two-column band with heading 'It opens by hand.', 5 numbered service steps (Closed, Panel off, Cooling, Memory and storage, Expansion), and a single chassis image (naturalWidth: 1400). CONFIRMED: NO canvas element with data-testid='pdp-reveal-canvas' exists. CONFIRMED: Body text does NOT contain 'Scroll to open'. Overview/Specification tabs work correctly. All requirements met."

metadata:
  created_by: "main_agent"
  version: "1.2"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus:
    - "PDP typography + look-and-feel polish (mt-amd-am4)"
    - "Remove scroll-driven animations across PDP"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    -agent: "main"
    -message: "Please VISUALLY verify http://localhost:3000/desktops/mt-amd-am4 (dev). 1) Page loads with no console errors. 2) Sections are visible immediately on scroll WITHOUT fade-up/translate entrance animations and WITHOUT parallax image drift. 3) The 'It opens by hand' (Serviceability) section is now a static two-column band with a heading, a numbered steps list (Closed/Panel off/Cooling/Memory and storage/Expansion) and a single chassis image — it must NOT be a tall sticky scroll-scrubbed sequence and must NOT contain the text 'Scroll to open'. 4) Feature grid shows accent icon chips with hover lift. 5) The I/O map image and audience-tab images load (no broken images). Capture screenshots of the hero, feature grid, the Serviceability band, and audiences. This is a static/CSS visual change; no backend involved."
    -agent: "testing"
    -message: "✅ ALL TESTS PASSED - Comprehensive testing completed on http://localhost:3000/desktops/mt-amd-am4. Both high-priority tasks verified and working correctly: (1) PDP typography + look-and-feel polish: Hero section displays all elements correctly, feature grid has 8 tiles with icon chips, all images load properly. (2) Scroll-driven animations removed: Sections are immediately visible (opacity 1.0) with no entrance animations, Serviceability section is now static (no canvas, no 'Scroll to open' text), has 5 service steps with correct labels. Page loads with HTTP 200, no console errors. Overview/Specification tabs work correctly. Screenshots captured: 01-hero-section.png, 02-serviceability-section.png, 03-feature-grid.png, 04-audiences-section.png, 05-specification-tab.png. Ready for production."
