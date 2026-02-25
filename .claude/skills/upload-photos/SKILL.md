---
name: upload-photos
description: Rename, convert, and upload new gallery photos to Cloudflare R2, then update photos.yaml. Use when the user has new photos to add to the gallery.
argument-hint: "[source-directory]"
---

Process and upload new gallery photos to Cloudflare R2.

**Input**: Optionally specify the source directory containing new photos. Defaults to `photo_temp/`.

## Naming Convention

All photos must follow this format:

```
YYYYMMDD-{CAMERA_ID}.JPG
```

- **Date prefix**: `YYYYMMDD` — the date the photo was taken
- **Separator**: `-` (hyphen only, never `_`)
- **Camera ID**: the original camera filename (e.g. `DSC01753`, `R0000754`)
- **Extension**: `.JPG` (uppercase)

## Steps

### 1. Inventory source files

List all files in the source directory. Classify each file:

| Category | Detection | Action |
|----------|-----------|--------|
| Already correct | Matches `YYYYMMDD-*.JPG` | No change needed |
| Lowercase extension | Matches `YYYYMMDD-*.jpg` | `mv` to `.JPG` |
| Missing date prefix | No `YYYYMMDD-` prefix | Extract date from EXIF via `mdls -name kMDItemContentCreationDate <file>`, then rename |
| Underscore separator | Contains `_` between date and ID | Replace `_` with `-` |
| PNG format | `.png` or `.PNG` extension | Convert to JPEG |

Report the inventory to the user and ask for confirmation before proceeding. If any files are missing a date prefix and EXIF data is unavailable, ask the user to provide the date.

### 2. Rename and convert

Process files in this order:

1. **Convert PNG to JPEG**: Use macOS `sips`:
   ```bash
   sips -s format jpeg "<input>.png" --out "<output>.JPG"
   ```
2. **Rename `.jpg` to `.JPG`**: Use `mv`
3. **Fix separators**: Replace `_` with `-`
4. **Add date prefixes**: Prepend `YYYYMMDD-`
5. **Delete original `.png` files** after successful conversion

After processing, list all files and confirm they match `YYYYMMDD-{CAMERA_ID}.JPG`.

### 3. Get dimensions

For each new photo, get width and height:

```bash
sips -g pixelWidth -g pixelHeight <file>
```

### 4. Upload to Cloudflare R2

Upload each file using wrangler with the `--remote` flag (critical — without it, files only go to local storage):

```bash
npx wrangler r2 object put "xuno8-photos/<filename>" --file="<source>/<filename>" --remote
```

After uploading, verify at least 2-3 files via the public URL:

```bash
curl -sI "https://images.xuno8.com/<filename>" | head -3
```

Expect `HTTP/2 200` with `content-type: image/jpeg`.

### 5. Update `src/data/photos.yaml`

Append new entries to `src/data/photos.yaml`. Each entry has this format:

```yaml
- src: 'YYYYMMDD-CAMERA_ID.JPG'
  alt: 'YYYYMMDD-CAMERA_ID'
  width: <pixelWidth>
  height: <pixelHeight>
```

- `src`: the exact filename uploaded to R2
- `alt`: same as filename without extension
- `width` / `height`: pixel dimensions from step 3
- Do NOT modify existing entries

### 6. Verify

1. Run `npm run build` to confirm the site builds successfully
2. Report a summary: how many photos were added, any issues encountered
