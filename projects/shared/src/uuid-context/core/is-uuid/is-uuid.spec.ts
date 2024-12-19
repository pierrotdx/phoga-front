import { isUuid } from './is-uuid';

describe('isUuid', () => {
  const falseTestCases: { scenario: string; value: unknown }[] = [
    { scenario: 'candidate is not a string', value: 1234 },
    {
      scenario: 'candidate is not a valid uuid',
      value: 'erikgjn erijgn zifne',
    },
  ];

  falseTestCases.forEach(({ scenario, value }) => {
    it(`should return false if ${scenario}`, () => {
      expect(isUuid(value)).toBe(false);
    });
  });

  const trueTestCases = [
    'f7efb444-7699-11ef-b864-0242ac120002',
    'cbb5fc89-a585-4fb2-879f-f28fb8d35e42',
    '9bab348c-7cf1-4c8f-920f-8a5363cf4fdd',
    '65bc4ea6-769a-11ef-b864-0242ac120002',
  ];

  trueTestCases.forEach((value) => {
    it(`should return \`true\` for ${value}`, () => {
      expect(isUuid(value)).toBe(true);
    });
  });
});
