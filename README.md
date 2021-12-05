# OS Assistant Automation [![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fdnswd%2Fos-assistant-automation&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=%F0%9F%91%80&edge_flat=false)](https://hits.seeyoufarm.com)

> Abandoned due to change of coursework 

This repo is inspired by [Kak Alghi's](https://github.com/darklordace/os-assistant-automation)
with some tweaks to automate grade reports, faster async checking, and bypass cors-anywhere limit by 
not using it entirely.

## Requirements
- Node.js
- Decent PC with decent Internet

## Installation
1. Clone this repo  
   `git clone https://github.com/dnswd/os-assistant-automation`
2. Install dependencies  
   `npm i`  
    This will also install browser drivers for WebKit, Chrome, and Firefox.  
    If you want to install one specific driver, you can use [playwright flavors](https://github.com/microsoft/playwright/issues/812#issuecomment-581501050)
3. `npm run dev`
4. ???
5. Profit

## TODOs
- [ ] Assisting manual review
  - [ ] CLI
  - [X] Playwright step function
  - [X] Listen to key events
  - [X] Save current state for later work
  - [ ] Load saved state
- [X] Better rejection handling
- [X] Refactor for easy grader scheme change/addition
- [ ] Implement teaching assistant work time recorder
- [X] Record faulty/error links inside scheme for manual review

## Known Bugs
- [X] Concurrency issue (inconsistent result)
  - Fixed by utilizing async pools.  
    Using Binary search, I conclude that result would be consistent with pool size < 80.
    But not always guaranteed. Hence manual review would be able to override automatic review.

- [ ] Pages with heavy client-side rendering may invoke TimeoutError as it's just too heavy to load.

## Contributing
Just create a pull request, I'm not fancy. Don't forget to credit your own work.

Copyright (C) Dennis A. Walangadi 2021
