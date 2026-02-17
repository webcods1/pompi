# TODO: Fix User Profile Storage in RTDB

## Tasks
- [x] Modify src/pages/Profile.tsx to save/fetch directly from RTDB only, remove localStorage backup for profile data
- [x] Update src/pages/Admin.tsx to fetch users from RTDB only, remove localStorage merge for real-time consistency

## Followup
- [x] Test profile saving and fetching from Firestore
- [x] Verify admin sees real-time updates without localStorage interference
