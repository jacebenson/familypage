// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route, Private } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'
import HomeLayout from 'src/layouts/HomeLayout'

import { useAuth } from './auth'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Route path="/" page={HomePage} name="home" />
      <Set wrap={HomeLayout}>
        <Route notfound page={NotFoundPage} />
        <Route path="/login" page={LoginPage} name="login" />
        <Route path="/signup" page={SignupPage} name="signup" />
        <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
        <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
        <Route path="/join-family" page={JoinFamilyPage} name="joinFamily" />
        <Private unauthenticated="home">
          <Route path="/setup-family" page={SetupFamilyPage} name="setupFamily" />
          <Route path="/calendar/{familyId}" page={CalendarPage} name="calendarWithId" />
          <Route path="/calendar" page={CalendarPage} name="calendar" />
          <Route path="/my-profile" page={MyProfilePage} name="myProfile" />
          <Route path="/invite-to-family" page={InviteToFamilyPage} name="inviteToFamily" />
          <Route path="/inviteSomeone/{familyId}" page={InviteToFamilyPage} name="inviteToFamilyWithID" />
          <Route path="/edit-event/{id}" page={EditEventPublicPage} name="editEventPublic" />
        </Private>
        <Private unauthenticated="calendar" roles="admin">
          <Set wrap={ScaffoldLayout} title="Events" titleTo="events" buttonLabel="New Event" buttonTo="newEvent">
            <Route path="/admin/events/new" page={EventNewEventPage} name="newEvent" />
            <Route path="/admin/events/{id}/edit" page={EventEditEventPage} name="editEvent" />
            <Route path="/admin/events/{id}" page={EventEventPage} name="event" />
            <Route path="/admin/events" page={EventEventsPage} name="events" />
          </Set>
          <Set wrap={ScaffoldLayout} title="Users" titleTo="users" buttonLabel="New User" buttonTo="newUser">
            <Route path="/admin/users/new" page={UserNewUserPage} name="newUser" />
            <Route path="/admin/users/{id}/edit" page={UserEditUserPage} name="editUser" />
            <Route path="/admin/users/{id}" page={UserUserPage} name="user" />
            <Route path="/admin/users" page={UserUsersPage} name="users" />
          </Set>
          <Set wrap={ScaffoldLayout} title="FamilyMembers" titleTo="familyMembers" buttonLabel="New FamilyMember" buttonTo="newFamilyMember">
            <Route path="/admin/family-members/new" page={FamilyMemberNewFamilyMemberPage} name="newFamilyMember" />
            <Route path="/admin/family-members/{id}/edit" page={FamilyMemberEditFamilyMemberPage} name="editFamilyMember" />
            <Route path="/admin/family-members/{id}" page={FamilyMemberFamilyMemberPage} name="familyMember" />
            <Route path="/admin/family-members" page={FamilyMemberFamilyMembersPage} name="familyMembers" />
          </Set>
          <Set wrap={ScaffoldLayout} title="Families" titleTo="families" buttonLabel="New Family" buttonTo="newFamily">
            <Route path="/admin/families/new" page={FamilyNewFamilyPage} name="newFamily" />
            <Route path="/admin/families/{id}/edit" page={FamilyEditFamilyPage} name="editFamily" />
            <Route path="/admin/families/{id}" page={FamilyFamilyPage} name="family" />
            <Route path="/admin/families" page={FamilyFamiliesPage} name="families" />
          </Set>
        </Private>
      </Set>
    </Router>
  )
}

export default Routes
