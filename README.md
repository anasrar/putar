# putar

360 Image and Video Viewer

## Build

### Web

```bash
# output on folder `web/dist`
pnpm web:build
```

### Electron

```bash
# build web for electron
pnpm web:build:electron

# build electron
pnpm electron:build

# pack and archive, output in `electron/release/VERSION`
pnpm electron:dist
```

## Development Script

```bash
# vite web server
pnpm web:dev

# vite web server for electron
pnpm web:dev:electron

# electron watch changes and build
pnpm electron:dev

# build electron
pnpm electron:build

# only pack electron, output in `electron/release/VERSION/OS-unpack`
pnpm electron:pack

# pack and archive, output in `electron/release/VERSION`
pnpm electron:dist

# run linter
pnpm lint

# run formatter but only check
pnpm format:check

# run formatter and change the files
pnpm format:write
```

## Contribute

- Fork
- Change or add something
- Describe changes in `CHANGELOG.md` and `RELEASE.md`
- Commit
- Push
- Pull request
