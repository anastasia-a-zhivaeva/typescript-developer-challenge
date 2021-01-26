// Software developer challenge

type Context = {
  [k: string]: string | undefined
}

enum LogicalOperator {
  And = 'AND',
  Or = 'OR'
}

enum ComparisonOperator {
  Eq = '=='
}

type Operator = LogicalOperator | ComparisonOperator
type LogicalCondition = [LogicalOperator, ...Condition[]]
type Variable = string
type Value = string
type ComparisonCondition = [ComparisonOperator, Variable, Value]
type Condition = LogicalCondition | ComparisonCondition

function isLogicalCondition (condition: Condition): condition is LogicalCondition {
  return Object.values(LogicalOperator).includes(condition[0] as LogicalOperator)
}

function isComparisonCondition (condition: Condition): condition is ComparisonCondition {
  return Object.values(ComparisonOperator).includes(condition[0] as ComparisonOperator)
}

/**
 * Evaluate a condition against the context.
 *
 * Your task is to implement this function such that the
 * test cases below pass. The solution will be graded on
 * readability, completeness, and your ability to read
 * code.  We're not looking for you to write much code.
 * No additional types, interfaces, classes or functions
 * are required.  Recommended time: 30-45 minutes.
 *
 * @param condition DSL condition modelled after S-expressions
 * @param context key/value pairs
 * @return boolean
 */
function evaluate (condition: Condition, context: Context): boolean {

  if (isComparisonCondition(condition)) {
    const [operator, variable, value] = condition;

    if (!variable) return false;

    const key = variable.substring(1);
    return context[key] === value;
  }

  if (isLogicalCondition(condition)) {
    const [operator, ...conditions] = condition;

    switch (operator) {
      case LogicalOperator.And:
        return conditions.every(item => evaluate(item, context));
      case LogicalOperator.Or:
        return conditions.some(item => evaluate(item, context));
      default:
        throw new Error('A logical operator should be either OR or AND');
    }
  }

  throw new Error('The first element in any array should be one of either a logical operator or comparison operator.');
}

/*
  A condition modelled after S-expressions.  This condition is composed of nested arrays.

  The first element in any array is one of either a logical operator or comparison operator.

  A logical operator is either 'OR' or 'AND'.
  - There are 1 or more operands that proceed it.

  A comparison operator is '=='.
  - There are two operands that proceed it.
  - The first operand is a variable indicated by the '$' sign.
  - The second operand is a string value.
*/
const condition = [
  'OR',
  [
    'AND',
    ['==', '$State', 'Alabama'],
    ['==', '$Profession', 'Software development']
  ],
  ['==', '$Undefined', ''],
  [
    'AND',
    ['==', '$State', 'Texas']
  ],
  [
    'OR',
    [
      'OR',
      ['==', '$Profession', 'Tradesperson']
    ]
  ]
]

/**
 * Click "Run" to execute the test cases.
 */
const testCases = [
  [{'State': 'Alabama', 'Profession': 'Software development'}, true],
  [{'State': 'Texas'}, true],
  [{'State': 'Alabama', 'Profession': 'Gaming'}, false],
  [{'State': 'Utah'}, false],
  [{'Profession': 'Town crier'}, false],
  [{'Profession': 'Tradesperson'}, true],
  [{}, false]
]

for (const [index, [context, expected]] of testCases.entries()) {
  console.log(
    evaluate(condition as Condition, context) === expected
      ? `${index} ok`
      : `${index} FAIL`
  )
}
