## slacc

### roadmap

- sort channels by most recent message
- `Sidebar{,Channel}Option` Keyboard accessibility
- google auth
- Starred|Channels|Direct Messages Sidebar UI
- update SEND button to `+` like Slack
- update Search to Slack UI
- make input position not sketchy

#### lessons learned

- Firebase async auth methods cannot be used with async/await. Known issue. Collaborators locked and limited conversation without solution or documentation. Not the kind of dev team I want my product to depend on. [See here.](https://github.com/firebase/firebase-js-sdk/issues/1881)