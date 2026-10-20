# anafim design restore branch

This branch will restore `App.tsx` and `ControlPanel.tsx` with anafim light theme.

## Complete the restore (from this branch)

```bash
git checkout fix/anafim-design-restore
bash scripts/apply-anafim-colors.sh
git add App.tsx components/ControlPanel.tsx
git commit -m "fix(design): restore App + ControlPanel with anafim light theme"
git push origin fix/anafim-design-restore
```

Then merge the PR into main.
