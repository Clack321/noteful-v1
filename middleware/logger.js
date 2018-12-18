const morgan = require('morgan')

module.exports.logger = new morgan(':date[iso] :method :url');