## Manual Ordhook Installation

Visit the [Hiro Archive](https://www.hiro.so/blog/sync-your-stacks-node-and-api-services-faster-with-the-hiro-archive) and download the bitcoin index `rocksdb` that ordhook builds. (Note: rocksdb is a pared down version of the bitcoin chain state that enables ordhook to compute an inscription's ordinal number, which is the ordinal number of each satoshi minted on Bitcoin)

- Go to Hiro's archive for ordhook's indexes and files: https://archive.hiro.so/mainnet/ordhook/
- Ctrl-f find "mainnet-ordhook-latest.tar.gz" (59.2 GB as of Sep 20, 2023)
- Download and unzip contents, and drag to ordhook folder within project (`./ordhook/` is the default place for it)
