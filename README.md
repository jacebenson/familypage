# README

## TODO

- [x] Add table scheme for the family unit (small)
- [x] Fixed issue when adding event, it doesn't show on the calendar immediately (has to do with state)
- [x] Update table scheme for the events to add family unit (so we can limit what events folks see) (extrasmall)

- [x] Update queries to use family unit(medium)
  - [x] check on /calendar if im part of a family and waht family im in right now
  - [x] on addevent, set the family from the state
  - [x] on getevents, filter by family
- [x] BUG: When user registers, they are not added to a family initiallly
- [x] Add UI to allow folks to invite members to family and to requst to join a family (medium)
  - [x] Moved "invite" to it's own page
  - [x] Added console log to show reset link when user resets password
  - [ ] today when you invite someone, it makes an account with a bad password, then they need to reset it. I should email the reset "invite" link to them, and/or show a dialog with instructions to share to have them sign up with the email given
    - [x] I created a "Join Family" page that works the same as "reset" password, this will be part of the message shown/emailed
- [x] Profile Page needs to be updated tohave a better UX re: inviting folks
- [x] When adding the first event on your calendar, it doesn't show up until you refresh the page
  - [x] When a family is created, lets create an event "FamilyPage Created"

- [ ] When you signup, you should land on the /calendar page
- [ ] On the "GetInvited" call to action button, change the text to be correct, today they are not exactly right
- [ ] The "families" and "events" are not hidden from everyone.
- [ ] On the home page, add a link to "Join a family" under the hosted version
- [ ] Wire up emails for invites, and password resets

- [ ] Build a UI to show how to add this page as a "app" on your phone, and computer (will take time, but this is just a pretty page) (large)
- [ ] Build a endpoint that will serve a webdav dataI can connect to with my phone and get events with get parameters to control whole family, and then one for each family member (https://tsdav.vercel.app/)
- [ ] Build a UI to walk through connecting an iPhone to the calendars
