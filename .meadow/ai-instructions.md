# AI Instructions for UG-1797

**Issue:** Improve the Manual Design
**Project:** Meadow Manual
**Repository:** Manual
**Branch:** dev/UG-1797
**Started:** 2025-08-06T14:43:56.717Z

## Instructions

```
- Make manual and integrated documentation industry standard design
- Add a search feature with a shortcut CMD+K
      
      Ultrathink and carefully analyze the existing codebase and understand its structure. Read files first, make a plan and save it to .meadow/plan.md file, then implement step by step. Write code that adheres to best industry practices and standards.

IMPORTANT: After implementing the changes above, please:

1. ✅ **Verification**: Verify your implementation works
   - Test the specific functionality you modified
   - Check edge cases and error conditions  
   - Ensure the changes solve the original issue
   - If it's a web app, test it manually in the browser

2. 🚀 **Complete the Task**: Finalize and submit your work
   - Create a detailed summary of changes in `.meadow/CHANGES.md`
   - Include: what was changed, why, files modified, and how to verify it works
   - Use `git add .` to stage all changes
   - Commit with: `git commit -m "UG-1797: [brief description of changes]"`
   - Push the branch: `git push origin dev/UG-1797`

Please confirm each step is completed before finishing. When you're done with implementation, run "meadow task test" to run tests and move the task to review status.
```
