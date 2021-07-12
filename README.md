# OS Assistant Automation [![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fdnswd%2Fos-assistant-automation&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=%F0%9F%91%80&edge_flat=false)](https://hits.seeyoufarm.com)

This repo is inspired by [Kak Alghi's](https://github.com/darklordace/os-assistant-automation)
with some tweaks to automate grade reports  and bypass cors-anywhere limit by not using it 
entirely.

## Requirements
- Node.js
- Decent PC with decent Internet

## Installation
   ```bash
   npm i
   ```
   This will also install browser drivers for WebKit, Chrome, and Firefox.  
   If you want to install one specific browser, you can use [playwright flavors](https://github.com/microsoft/playwright/issues 812#issuecomment-581501050)

## TODO
- [ ] Implement interactive CLI for assisting manual review
- [ ] Better rejection handling
- [ ] Refactor for easy grader scheme change/addition
- [ ] Implement teaching assistant work time recorder
- [X] Record faulty/error links inside scheme for manual review (?)

## Bug
- [X] Concurrency issue (inconsistent result)

Copyright (C) Dennis A. Walangadi 2021
