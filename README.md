<p align="center">
  <img src="https://familypage.jace.pro/logo.png" width="200" alt="FamilyPage Logo" />
</p>
# FamilyPage

FamilyPage is a collaborative calendar application built on the Redwood framework, leveraging Chakra UI for its user interface and authentication handled by dbauth. This project aims to simplify coordination among family members by providing a straightforward calendar where everyone can easily collaborate and stay updated on important events.

## Table of Contents

[Introduction](#introduction)
[Features](#features)
[Getting Started](#getting-started)
[Roadmap](#roadmap)
[Contributing](#contributing)

## Introduction

Do you struggle with remembering important family events or coordinating plans with your loved ones? FamilyPage is here to streamline your family's schedule management. This application allows family members to maintain a shared calendar, making it effortless to stay informed about various events and commitments.

## Features

- Collaborative Calendar: Family members can collectively manage their events and commitments on a shared calendar.
- Invitations and Requests: Easily invite family members to join your family unit or request to join theirs.
- User-Friendly UI: The Chakra UI integration ensures a pleasant and intuitive user experience.
- Authentication and Security: Authentication is handled by dbAuth, ensuring secure access to family-related information.
- Responsive Design: FamilyPage is designed to work smoothly across various devices, including smartphones and computers.

## Getting Started

Follow these steps to set up and run FamilyPage on your local machine:

1. Clone the Repository: Clone the FamilyPage repository to your local machine:

```bash
git clone https://github.com/your-username/familypage.git
cd familypage
```

2. Install Dependencies: Install the project's dependencies using Yarn:

```bash
yarn install
```

3. Environment Variables: The only environment variable needed is generated running this command.

```bash
yarn rw g secret
```

4. Database Setup: FamilyPage uses an SQLite database by default. If you wish to use a different database, update ./api/db/schema.prisma accordingly. To set up the database, run the following command:

5. Run Migrations: Apply the database schema using Prisma migrations:

```bash
yarn rw prisma migrate dev
```

6. Start the Development Server: Launch the development server using the following command:

```bash
yarn rw dev
```

7. Access the App: Visit http://localhost:8910 in your browser to access FamilyPage.

## Roadmap

Follow along as I build here

[![imgur](https://i.imgur.com/E3Kkia3.png)](https://www.youtube.com/playlist?list=PLiMstOldZgCcnR2m4QLB743eLdeIap70o)

### In Progress

- [ ] When displaying an event from the calendar, the attendees are not listed correctly (Looks fixed, test after deploy)

- [ ] Improve AddEvent for advanced date/time
  - [ ] Added recurring options
  - [x] Added a person picker
  - [ ] REuse edit modal for add event
- [ ] Improve Calendar Modal to allow edits and deletes
  - [x] Created better modal to display data
  - [x] Added edit and delete buttons
  - [ ] Added edit form
  - [ ] Wire up deletes
  - [ ] Wire up edits
- [x] Add UI to allow folks to invite members to family and to requst to join a family (medium)
  - [x] Moved "invite" to it's own page
  - [x] Added console log to show reset link when user resets password
  - [ ] ONHOLD TILL DEPLOYED: today when you invite someone, it makes an account with a bad password, then they need to reset it. I should email the reset "invite" link to them, and/or show a dialog with instructions to share to have them sign up with the email given
    - [x] I created a "Join Family" page that works the same as "reset" password, this will be part of the message shown/emailed
- [ ] MVP: Build a ics output for the calendars see (https://github.com/kewisch/ical.js/wiki/Creating-basic-iCalendar)
- [ ] MVP: Build a UI to walk through connecting an iPhone to the calendars
  - [ ] Page: /connect/{mailApp}
    - [ ] fastmail
    - [ ] ios mail
- [ ] ONHOLD TILL EMAIL: Wire up emails for invites, and password resets
- [ ] MVP: Build a UI to show how to add this page as a "app" on your phone, and computer (will take time, but this is just a pretty page) (large)
  - [ ] Page: /install/{thing}
    - [ ] Browser App on iPhone
    - [ ] Browser App on Windows

### Done
- [x] Add table scheme for the family unit (small)
- [x] Fixed issue when adding event, it doesn't show on the calendar immediately (has to do with state)
- [x] Update table scheme for the events to add family unit (so we can limit what events folks see) (extrasmall)
- [x] Update queries to use family unit(medium)
  - [x] check on /calendar if im part of a family and waht family im in right now
  - [x] on addevent, set the family from the state
  - [x] on getevents, filter by family
- [x] BUG: When user registers, they are not added to a family initiallly

- [x] Profile Page needs to be updated tohave a better UX re: inviting folks
- [x] When adding the first event on your calendar, it doesn't show up until you refresh the page
  - [x] When a family is created, lets create an event "FamilyPage Created"
- [x] Bug: When you signup, you should land on the /calendar page
- [x] Bug: On the "GetInvited" call to action button, change the text to be correct, today they are not exactly right
- [x] Bug: On the home page, add a link to "Join a family" under the hosted version
- [x] Bug: When you signup, if you select create a family, you land on the backend page for families, you should land on the calendar page
- [x] Bug: The "families" and "events" are not hidden from everyone.
- [x] Convert DB from sqlite to postgres
- [x] Deploy
- [x] BUG: When signing up, its possible to not set a family putting the app in a bad state

- [x] Add security around ics endpoint where no familyId is given

## Contributing
Contributions to FamilyPage are welcome! Feel free to submit issues and pull requests on the GitHub repository.
