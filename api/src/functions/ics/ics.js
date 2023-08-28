import { db } from 'src/lib/db';
import { logger } from 'src/lib/logger'
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
  logger.info(`${event.httpMethod} ${event.path}: ics function`)

  // we need to handle auth somehow to work with .. outlook does this with a custom url parameter... i guess i'll do the same...
  // /ics?calendar=hashedRandomStringBasedEnvionmentVariable
  // then decode the calendar parameter and it should decode into the user's cuid, and include
  //   any filter e.g. just their events, or just their events + spouse, or just their events + spouse + kids, kids only, etc.
  // object will be like { userCuid: '1234', everyone: true, justMe: false, exclude: ['cuid1', 'cuid2'] }

  // from that we'll query events;
  //http://localhost:8910/.redwood/functions/ics?familyId=cllonqqmk0007gu4c6ojkhif7
  var familyId = event.queryStringParameters.familyId
  var parsedObject = {
    familyCuid: familyId,
    include: ['cuid1', 'cuid2']
  }
  let events = await db.event.findMany({
    where: {
      familyId: {
        equals: parsedObject.familyCuid
      },
    }
  })
  console.log('parsedObject', parsedObject)
  console.log('events', events)
  var vCalendar = new ICAL.Component(['vcalendar', [], []]);
  vCalendar.updatePropertyWithValue('prodid', '-//iCal.js Wiki Example');
  // Set the iCalendar version
  vCalendar.addPropertyWithValue('version', '2.0');
  //for(var i = 0; i < 3; i++) {
  //  var vevent = new ICAL.Component(`vevent`);
  //  vevent.addPropertyWithValue('dtstamp', new ICAL.Time().fromJSDate(new Date()));
  //  vevent.addPropertyWithValue('x-my-custom-property', 'custom');
  //  let iCalEvent = new ICAL.Event(vevent);
  //  // Set standard properties
  //  iCalEvent.summary = `Test Event ${i} Manually Created`;
  //  iCalEvent.uid = `abc${i}`;
  //  iCalEvent.startDate = ICAL.Time.now();
  //  // Add the new component
  //  vCalendar.addSubcomponent(vevent);
  //}
  // add a new component for each event
  events.forEach((event) => {
    let parsedStartDate = JSON.parse(event.start)
    let parsedDuration = JSON.parse(event.duration)
    let durationHours = parsedDuration?.hours
    let durationMinutes = parsedDuration?.minutes
    console.log({
      startDate: event.start,
      duration: event.duration,
      parsedStartDate,
      parsedDuration
    })
    let [startYear, startMonth, startDay, startHour, startMinute] = parsedStartDate
    let startDate = new Date(startYear, startMonth, startDay, startHour, startMinute)
    let endDate = new Date(startDate.getTime() + (durationHours ? durationHours : 0) * 60 * 60 * 1000 + durationMinutes * 60 * 1000)
    console.log({
      startDate,
      endDate
    })
    var vevent2 = new ICAL.Component(`vevent`);
    // Set the DTSTAMP property to the current date and time
    vevent2.addPropertyWithValue('dtstamp', new ICAL.Time().fromJSDate(new Date()));
    vevent2.addPropertyWithValue('comment', new ICAL.Time().fromJSDate(new Date()));
    let attendees = JSON.parse(event.attendees)
    attendees = attendees.split(',')
    attendees.forEach((attendee) => {
      vevent2.addPropertyWithValue('attendee', attendee);
    })
    if(event.url) vevent2.addPropertyWithValue('url', event.url);
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
    console.log({
      message: `adding ${event.title} to calendar`,
      vCalendar: JSON.stringify(vCalendar.jCal, null, 2),
    })
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
}
