import { db } from 'src/lib/db';
import { logger } from 'src/lib/logger'
import CryptoJS from 'crypto-js'
const ICAL = require('ical.js');
/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */
export const handler = async (event, _context) => {
  try{
  logger.info(`${event.httpMethod} ${event.path}: ics function`)

  // we need to handle auth somehow to work with .. outlook does this with a custom url parameter... i guess i'll do the same...
  // /ics?calendar=hashedRandomStringBasedEnvionmentVariable
  // then decode the calendar parameter and it should decode into the user's cuid, and include
  //   any filter e.g. just their events, or just their events + spouse, or just their events + spouse + kids, kids only, etc.
  // object will be like { userCuid: '1234', everyone: true, justMe: false, exclude: ['cuid1', 'cuid2'] }

  // from that we'll query events;
  //http://localhost:8910/.redwood/functions/ics?familyId=cllonqqmk0007gu4c6ojkhif7
  var familyId = event.queryStringParameters.familyId
  if(!familyId) {
    return {
      statusCode: 400,
      body: "familyId is required"
    }
  }
  let events = await db.event.findMany({
    where: {
      familyId: {
        equals: familyId
      },
    }
  })
  var vCalendar = new ICAL.Component(['vcalendar', [], []]);
  vCalendar.updatePropertyWithValue('prodid', '-//iCal.js Wiki Example');
  // Set the iCalendar version
  vCalendar.addPropertyWithValue('version', '2.0');
  events.forEach((event) => {
    let parsedStartDate = JSON.parse(event.start)
    let parsedDuration = JSON.parse(event.duration)
    let durationHours = parsedDuration?.hours
    let durationMinutes = parsedDuration?.minutes
    let [startYear, startMonth, startDay, startHour, startMinute] = parsedStartDate
    let startDate = new Date(startYear, startMonth, startDay, startHour, startMinute)
    let endDate = new Date(startDate.getTime() + (durationHours ? durationHours : 0) * 60 * 60 * 1000 + durationMinutes * 60 * 1000)
    var vevent2 = new ICAL.Component(`vevent`);
    // Set the DTSTAMP property to the current date and time
    vevent2.addPropertyWithValue('dtstamp', new ICAL.Time().fromJSDate(new Date()));
    vevent2.addPropertyWithValue('comment', new ICAL.Time().fromJSDate(new Date()));
    let attendees = JSON.parse(event.attendees)
    if(attendees.includes(',')) {
      attendees = attendees.split(',')
      attendees.forEach((attendee) => {
        vevent2.addPropertyWithValue('attendee', attendee);
      })
    }
    if(attendees.indexOf(',') === -1) {
      vevent2.addPropertyWithValue('attendee', attendees);
    }
    if(event.url) vevent2.addPropertyWithValue('url', event.url);
    if(event.repeats) vevent2.addPropertyWithValue('rrule', event.repeats);
    //vevent2.startDate = new ICAL.Time().fromJSDate(new Date(startDate.getTime()));
    let iCalEvent2 = new ICAL.Event(vevent2);
    // Set standard properties
    iCalEvent2.summary = event.title;
    iCalEvent2.uid = event.id;
    iCalEvent2.startDate = new ICAL.Time().fromJSDate(new Date(startDate.getTime()));
    iCalEvent2.endDate = new ICAL.Time().fromJSDate(new Date(endDate.getTime()));
    if(event.description) iCalEvent2.description = event.description;
    if(event.location) iCalEvent2.location = 'location';
    if(event.url) iCalEvent2.url = 'url';
    // TODO: set up recurrence rules
    iCalEvent2.organizer = event.organizer
    /** optional properties, may occur 1 time
     * class / created / description* / geo /
       last-mod / location / organizer / priority /
       seq / status / summary / transp /
       url / recurid /
     */

    iCalEvent2.contact = 'attach';
    /** optional properties, may occur more than once
      * attach / attendee / categories / comment /
        contact / exdate / rstatus / related /
        resources / rdate / x-prop / iana-prop
     */
    // Add the new component
    vCalendar.addSubcomponent(vevent2);
  })
// return the payload so it saves with the file calendar.ics
// to do that we need to
// return {
  // whats the property name for setting the file name?

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/calendar',
      // file name is calenar.ics
      'Content-Disposition': 'attachment; filename="calendar.ics"',
    },
    body: vCalendar.toString(),
  }
  } catch(e) {
    logger.error(e)
    return {
      statusCode: 500,
      body: e.message
    }
  }
}
