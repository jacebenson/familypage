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
        <Private unauthenticated="home">
          <Route path="/calendar" page={CalendarPage} name="calendar" />
          <Route path="/my-profile" page={MyProfilePage} name="myProfile" />
          <Set wrap={ScaffoldLayout} title="Events" titleTo="events" buttonLabel="New Event" buttonTo="newEvent">
            <Route path="/events/new" page={EventNewEventPage} name="newEvent" />
            <Route path="/events/{id}/edit" page={EventEditEventPage} name="editEvent" />
            <Route path="/events/{id}" page={EventEventPage} name="event" />
            <Route path="/events" page={EventEventsPage} name="events" />
          </Set>
          <Set wrap={ScaffoldLayout} title="UserEvents" titleTo="userEvents" buttonLabel="New UserEvent" buttonTo="newUserEvent">
            <Route path="/user-events/new" page={UserEventNewUserEventPage} name="newUserEvent" />
            <Route path="/user-events/{id}/edit" page={UserEventEditUserEventPage} name="editUserEvent" />
            <Route path="/user-events/{id}" page={UserEventUserEventPage} name="userEvent" />
            <Route path="/user-events" page={UserEventUserEventsPage} name="userEvents" />
          </Set>
          <Set wrap={ScaffoldLayout} title="Users" titleTo="users" buttonLabel="New User" buttonTo="newUser">
            <Route path="/users/new" page={UserNewUserPage} name="newUser" />
            <Route path="/users/{id}/edit" page={UserEditUserPage} name="editUser" />
            <Route path="/users/{id}" page={UserUserPage} name="user" />
            <Route path="/users" page={UserUsersPage} name="users" />
          </Set>
          <Set wrap={ScaffoldLayout} title="FamilyMembers" titleTo="familyMembers" buttonLabel="New FamilyMember" buttonTo="newFamilyMember">
            <Route path="/family-members/new" page={FamilyMemberNewFamilyMemberPage} name="newFamilyMember" />
            <Route path="/family-members/{id}/edit" page={FamilyMemberEditFamilyMemberPage} name="editFamilyMember" />
            <Route path="/family-members/{id}" page={FamilyMemberFamilyMemberPage} name="familyMember" />
            <Route path="/family-members" page={FamilyMemberFamilyMembersPage} name="familyMembers" />
          </Set>
          <Set wrap={ScaffoldLayout} title="Families" titleTo="families" buttonLabel="New Family" buttonTo="newFamily">
            <Route path="/families/new" page={FamilyNewFamilyPage} name="newFamily" />
            <Route path="/families/{id}/edit" page={FamilyEditFamilyPage} name="editFamily" />
            <Route path="/families/{id}" page={FamilyFamilyPage} name="family" />
            <Route path="/families" page={FamilyFamiliesPage} name="families" />
          </Set>
        </Private>
      </Set>


    </Router>
  )
}

export default Routes
