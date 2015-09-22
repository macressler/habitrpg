var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var shared = require('../../../common');
var _ = require('lodash');
var moment = require('moment');

// Task Schema
// -----------

var TaskSchema = {
  _id: {type: String, default: shared.uuid},
  dateCreated: {type: Date, default: Date.now},
  text: String,
  notes: {type: String, default: ''},
  // TODO dictionary?
  tags: {type: Schema.Types.Mixed, default: {}}, //{ "4ddf03d9-54bd-41a3-b011-ca1f1d2e9371" : true },
  value: {type: Number, default: 0}, // redness
  priority: {type: Number, default: '1'},
  attribute: {type: String, default: 'str', enum: ['str','con','int','per']},
  challenge: {
    id: {type: 'String', ref: 'Challenge'},
    broken: String, // CHALLENGE_DELETED, TASK_DELETED, UNSUBSCRIBED, CHALLENGE_CLOSED todo enum
    winner: String // user.profile.name
    // group: {type: 'Strign', ref: 'Group'} // if we restore this, rename `id` above to `challenge`
  }
};

var HabitSchema = new Schema(
  _.defaults({
    type: {type: String, default: 'habit', enum: ['habit']},
    history: Array, // [{date:Date, value:Number}], // this causes major performance problems
    up: {type: Boolean, default: true},
    down: {type: Boolean, default: true}
  }, TaskSchema)
  , {minimize: false}
);

var ChecklistSchema = {
  collapseChecklist: {type: Boolean, default: false},
  checklist: [{
    completed: {type: Boolean, default: false},
    text: String,
    _id: {type: String, default: shared.uuid}
  }]
};

var DailySchema = new Schema(
  _.defaults({
    type: {type: String, default: 'daily', enum: ['daily']},
    frequency: {type: String, default: 'weekly', enum: ['daily', 'weekly']},
    everyX: {type: Number, default: 1}, // e.g. once every X weeks
    startDate: {
      type: Date,
      default: function() {
        return moment().startOf('day').toDate();
      }
    }, 
    history: Array,
    completed: {type: Boolean, default: false},
    repeat: { // used only for 'weekly' frequency,
      m:  {type: Boolean, default: true},
      t:  {type: Boolean, default: true},
      w:  {type: Boolean, default: true},
      th: {type: Boolean, default: true},
      f:  {type: Boolean, default: true},
      s:  {type: Boolean, default: true},
      su: {type: Boolean, default: true}
    },
    streak: {type: Number, default: 0}
  }, ChecklistSchema, TaskSchema)
  , {minimize: false}
)

var TodoSchema = new Schema(
  _.defaults({
    type: {type: String, default: 'todo', enum: ['todo']},
    completed: {type: Boolean, default: false},
    dateCompleted: Date,
    date: String // due date for todos // FIXME we're getting parse errors, people have stored as "today" and "3/13". Need to run a migration & put this back to type: Date
  }, ChecklistSchema, TaskSchema)
  , {minimize: false}
);

var RewardSchema = new Schema(
  _.defaults({
    type: {type: String, default: 'reward', enum: ['reward']}
  }, TaskSchema)
  , {minimize: false}
);

module.exports.HabitSchema = HabitSchema;
module.exports.HabitModel = mongoose.model('Habit', HabitSchema);
module.exports.DailySchema = DailySchema;
module.exports.DailyModel = mongoose.model('Daily', DailySchema);
module.exports.TodoSchema = TodoSchema;
module.exports.TodoModel = mongoose.model('Todo', TodoSchema);
module.exports.RewardSchema = RewardSchema;
module.exports.RewardModel = mongoose.model('Reward', RewardSchema);