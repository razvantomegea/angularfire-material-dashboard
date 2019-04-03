import * as moment from 'moment';

const enum ParseType {
  asHours = 'asHours',
  asMinutes = 'asMinutes'
}

const timeDifference = (start: string, end: string, parseType: string = ParseType.asMinutes): number => {
  return moment.duration(moment.utc(moment(end, 'HH:mm:ss').diff(moment(start, 'HH:mm:ss'))).format('HH:mm:ss'))[parseType]();
};

const timeToNumber = (time: string, parseType: string = ParseType.asHours): number => {
  return moment.duration(time)[parseType]();
};

export {
  ParseType,
  timeDifference,
  timeToNumber
};
