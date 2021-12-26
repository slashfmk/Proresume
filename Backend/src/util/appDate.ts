// const types = require('pg').types
// const moment = require('moment');

// const parseFn = (val: any) => {
//    return val === null ? null : moment(val)
// }

// types.setTypeParser(types.builtins.TIMESTAMPTZ, parseFn)
// types.setTypeParser(types.builtins.TIMESTAMP, parseFn)

// module.exports = parseFn;

// const Moment = require('moment');
// const parseDate = function parseDate(val: any) {
// return val === null ? null : Moment(val).format('YYYY-MM-DD')
// };
//
// const DATATYPE_DATE = 1082;
// types.setTypeParser(DATATYPE_DATE, function(val: any) {
// return val === null ? null : parseDate(val)
// });
//
// types.setTypeParser(types.builtins.TIMESTAMPTZ, parseDate);
// types.setTypeParser(types.builtins.TIMESTAMP, parseDate);
//
// module.exports = parseDate;
